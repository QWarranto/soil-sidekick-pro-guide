# Post-QC Security Sprint Schedule

**Start Date:** Monday, December 23, 2025  
**End Date:** Friday, December 27, 2025  
**Prerequisite:** Quality Control phases 1-4 completed (December 20, 2025)

---

## Overview

This sprint addresses 4 error-level and 5 warning-level database security findings identified in the December 13, 2025 regression test. These items were intentionally deferred to avoid destabilizing the QC implementation period.

### Findings Summary

| Priority | Finding | Table | Risk |
|----------|---------|-------|------|
| 🔴 Error | Email harvesting risk | `trial_users` | Competitor intelligence |
| 🔴 Error | Email/IP correlation | `trial_creation_rate_limit` | Privacy violation |
| 🔴 Error | Service role access pattern | `subscribers` | Payment data exposure |
| 🔴 Error | Encryption version migration | `account_security` | Credential compromise |
| 🟡 Warn | Dual credential storage | `adapt_integrations` | API key exposure |
| 🟡 Warn | Weak hash algorithm risk | `api_keys` | Rainbow table attacks |
| 🟡 Warn | Anonymous feedback abuse | `user_feedback` | Spam/manipulation |
| 🟡 Warn | Session token security | `county_search_sessions` | Session hijacking |
| 🟡 Warn | Image data sensitivity | `visual_analysis_results` | PII in uploads |

---

## Monday, December 23, 2025

### 9:00 AM - 10:30 AM (1.5 hours)
📧 **SEC-1.1: Trial Users Email Hashing**

**Current State:**
- `trial_users.email` stores plaintext emails
- Service role can access all trial emails

**Migration:**
```sql
-- Add hashed email column
ALTER TABLE public.trial_users 
ADD COLUMN email_hash TEXT;

-- Create hash function (SHA-256 with salt)
CREATE OR REPLACE FUNCTION public.hash_email(email_to_hash TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    salt TEXT := 'SoilSidekickTrialSalt2024!';
BEGIN
    RETURN encode(digest(lower(email_to_hash) || salt, 'sha256'), 'hex');
END;
$$;

-- Migrate existing data
UPDATE public.trial_users 
SET email_hash = public.hash_email(email);

-- Update trial lookup function to use hash
CREATE OR REPLACE FUNCTION public.is_trial_valid_by_hash(trial_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM public.trial_users 
        WHERE email_hash = public.hash_email(trial_email)
          AND is_active = true 
          AND trial_end > now()
    );
END;
$$;
```

**Testing:**
- Verify existing trial lookups still work
- Confirm hash is not reversible
- Test `trial-auth` edge function compatibility

---

### 10:30 AM - 12:00 PM (1.5 hours)
🔒 **SEC-1.2: Rate Limit Email/IP Separation**

**Current State:**
- `trial_creation_rate_limit` stores email + IP together
- Correlation enables tracking

**Migration:**
```sql
-- Hash email in rate limit table
ALTER TABLE public.trial_creation_rate_limit
ADD COLUMN email_hash TEXT;

-- Migrate existing data
UPDATE public.trial_creation_rate_limit
SET email_hash = public.hash_email(email);

-- Update rate limit check function
CREATE OR REPLACE FUNCTION public.check_trial_rate_limit_secure(
    check_ip INET, 
    check_email TEXT, 
    max_attempts INTEGER DEFAULT 3, 
    window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    recent_attempts INTEGER;
    hashed_email TEXT;
BEGIN
    hashed_email := public.hash_email(check_email);
    
    -- Check IP-based rate limit
    SELECT COUNT(*) INTO recent_attempts 
    FROM public.trial_creation_rate_limit
    WHERE ip_address = check_ip 
      AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    -- Check email-based rate limit (using hash)
    SELECT COUNT(*) INTO recent_attempts 
    FROM public.trial_creation_rate_limit
    WHERE email_hash = hashed_email 
      AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    -- Insert with hashed email only
    INSERT INTO public.trial_creation_rate_limit (ip_address, email_hash) 
    VALUES (check_ip, hashed_email);
    
    RETURN TRUE;
END;
$$;

-- Schedule: Drop plaintext email column after 30-day verification period
-- ALTER TABLE public.trial_creation_rate_limit DROP COLUMN email;
```

**Testing:**
- Verify rate limiting still functions
- Confirm no plaintext emails in new records
- Test `trial-auth` edge function integration

---

### 1:00 PM - 2:30 PM (1.5 hours)
💳 **SEC-1.3: Subscriber Service Role Audit**

**Current State:**
- `validate_subscription_service_operation()` validates service role access
- Potential bypass if JWT claims are manipulated

**Security Hardening:**
```sql
-- Enhanced service operation validation
CREATE OR REPLACE FUNCTION public.validate_subscription_service_operation()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    jwt_claims JSONB;
    calling_function TEXT;
    is_valid BOOLEAN := FALSE;
BEGIN
    -- Must be service role
    IF auth.role() != 'service_role' THEN
        RETURN FALSE;
    END IF;
    
    -- Get JWT claims
    BEGIN
        jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    EXCEPTION WHEN OTHERS THEN
        RETURN FALSE;
    END;
    
    -- Must have valid email claim
    IF jwt_claims->>'email' IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Log all service role access attempts
    INSERT INTO public.security_audit_log (
        event_type,
        details,
        ip_address,
        user_agent
    ) VALUES (
        'SERVICE_ROLE_VALIDATION',
        jsonb_build_object(
            'jwt_claims', jwt_claims,
            'timestamp', now(),
            'validation_result', TRUE
        ),
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    RETURN TRUE;
END;
$$;

-- Add explicit deny policy for unvalidated service access
CREATE POLICY "Block unvalidated service access" ON public.subscribers
FOR ALL
USING (
    CASE 
        WHEN auth.role() = 'service_role' THEN 
            public.validate_subscription_service_operation()
        ELSE 
            auth.uid() = user_id
    END
);
```

**Testing:**
- Verify Stripe webhook still works
- Test checkout flow end-to-end
- Confirm audit logs capture service access

---

### 2:30 PM - 4:00 PM (1.5 hours)
🔐 **SEC-1.4: Account Security Encryption Upgrade**

**Current State:**
- `account_security.email_encryption_version` indicates mixed encryption states
- Some records may use older/weaker encryption

**Migration:**
```sql
-- Identify records needing upgrade
SELECT COUNT(*), email_encryption_version 
FROM public.account_security 
GROUP BY email_encryption_version;

-- Create v2 encryption function with stronger algorithm
CREATE OR REPLACE FUNCTION public.encrypt_email_v2(email_to_encrypt TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key TEXT := 'SoilSidekickEmailKeyV2-2025!Stronger';
BEGIN
    IF email_to_encrypt IS NULL OR email_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
    -- Use AES-256 with random IV
    RETURN encode(
        pgp_sym_encrypt(
            email_to_encrypt, 
            encryption_key,
            'cipher-algo=aes256'
        ),
        'base64'
    );
END;
$$;

-- Migrate to v2 encryption (batch operation)
CREATE OR REPLACE FUNCTION public.upgrade_email_encryption_batch(batch_size INTEGER DEFAULT 100)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    upgraded_count INTEGER := 0;
    rec RECORD;
    decrypted_email TEXT;
BEGIN
    FOR rec IN 
        SELECT id, encrypted_email 
        FROM public.account_security 
        WHERE email_encryption_version < 2 
          AND encrypted_email IS NOT NULL
        LIMIT batch_size
    LOOP
        -- Decrypt with v1
        decrypted_email := public.decrypt_email_address(rec.encrypted_email);
        
        IF decrypted_email IS NOT NULL THEN
            -- Re-encrypt with v2
            UPDATE public.account_security
            SET encrypted_email = public.encrypt_email_v2(decrypted_email),
                email_encryption_version = 2,
                updated_at = now()
            WHERE id = rec.id;
            
            upgraded_count := upgraded_count + 1;
        END IF;
    END LOOP;
    
    RETURN upgraded_count;
END;
$$;
```

**Testing:**
- Run batch upgrade on test records
- Verify decryption still works with v2
- Confirm no data loss during migration

---

## Tuesday, December 24, 2025

### 9:00 AM - 10:00 AM (1 hour)
🔑 **SEC-2.1: ADAPT Integrations Credential Cleanup**

**Current State:**
- Dual columns: `api_credentials` (jsonb) and `encrypted_api_credentials` (text)
- Plaintext may exist in jsonb column

**Migration:**
```sql
-- Verify all credentials are encrypted
SELECT id, 
       api_credentials IS NOT NULL as has_plaintext,
       encrypted_api_credentials IS NOT NULL as has_encrypted
FROM public.adapt_integrations
WHERE api_credentials IS NOT NULL;

-- Migrate any remaining plaintext credentials
UPDATE public.adapt_integrations
SET encrypted_api_credentials = encode(
        pgp_sym_encrypt(api_credentials::text, 'SoilSidekickSecureKey2024!'),
        'base64'
    ),
    encryption_version = 2
WHERE api_credentials IS NOT NULL 
  AND (encrypted_api_credentials IS NULL OR encrypted_api_credentials = '');

-- Nullify plaintext column (keep column for rollback capability)
UPDATE public.adapt_integrations
SET api_credentials = NULL
WHERE encrypted_api_credentials IS NOT NULL;

-- Add constraint to prevent future plaintext storage
ALTER TABLE public.adapt_integrations
ADD CONSTRAINT no_plaintext_credentials 
CHECK (api_credentials IS NULL);
```

**Testing:**
- Verify ADAPT integrations still function
- Confirm no plaintext credentials remain
- Test integration sync operations

---

### 10:00 AM - 11:00 AM (1 hour)
🔐 **SEC-2.2: API Key Hash Strengthening**

**Current State:**
- `api_keys.key_hash` uses SHA-256
- Vulnerable to rainbow table attacks without salting

**Enhancement:**
```sql
-- Create secure API key hashing with salt
CREATE OR REPLACE FUNCTION public.hash_api_key_secure(api_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    salt TEXT;
BEGIN
    -- Generate unique salt per key (first 8 chars of key as salt component)
    salt := 'SS_API_' || substring(api_key from 4 for 8) || '_2025';
    
    -- Use SHA-512 with salt
    RETURN encode(digest(api_key || salt, 'sha512'), 'hex');
END;
$$;

-- Add v2 hash column
ALTER TABLE public.api_keys
ADD COLUMN key_hash_v2 TEXT;

-- Migrate existing keys (requires re-hashing from original keys)
-- Note: This requires the original key values, which we don't have
-- New keys will use v2 hashing going forward
```

**Note:** Existing keys cannot be upgraded without the original values. Document that key rotation is recommended for enhanced security.

---

### 11:00 AM - 12:00 PM (1 hour)
📝 **SEC-2.3: Anonymous Feedback Hardening**

**Current State:**
- `user_feedback` allows null user_id
- Potential spam/manipulation vector

**Enhancement:**
```sql
-- Add rate limiting for anonymous feedback
CREATE OR REPLACE FUNCTION public.check_anonymous_feedback_rate_limit(client_ip INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    recent_anonymous INTEGER;
BEGIN
    -- Allow max 3 anonymous feedbacks per IP per hour
    SELECT COUNT(*) INTO recent_anonymous
    FROM public.user_feedback
    WHERE user_id IS NULL
      AND created_at > now() - interval '1 hour'
      AND (metadata->>'client_ip')::inet = client_ip;
    
    RETURN recent_anonymous < 3;
END;
$$;

-- Add client IP tracking to anonymous feedback
ALTER TABLE public.user_feedback
ADD COLUMN IF NOT EXISTS client_ip INET;

-- Update policy to enforce rate limiting
CREATE POLICY "Rate limited anonymous feedback" ON public.user_feedback
FOR INSERT
WITH CHECK (
    user_id IS NOT NULL 
    OR public.check_anonymous_feedback_rate_limit(inet_client_addr())
);
```

---

### 1:00 PM - 2:00 PM (1 hour)
🔒 **SEC-2.4: Session Token Security**

**Current State:**
- `county_search_sessions.session_token` 2-hour expiration
- Token may be predictable

**Enhancement:**
```sql
-- Ensure cryptographically random session tokens
CREATE OR REPLACE FUNCTION public.generate_secure_session_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- 32 bytes of cryptographic randomness, base64 encoded
    RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- Reduce expiration to 30 minutes for active sessions
ALTER TABLE public.county_search_sessions
ALTER COLUMN expires_at SET DEFAULT now() + interval '30 minutes';

-- Add session validation function
CREATE OR REPLACE FUNCTION public.validate_session_token(token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM public.county_search_sessions
        WHERE session_token = token
          AND expires_at > now()
    );
END;
$$;
```

---

### 2:00 PM - 3:00 PM (1 hour)
🖼️ **SEC-2.5: Visual Analysis Data Protection**

**Current State:**
- `visual_analysis_results.image_data` may contain sensitive content
- No scanning or protection

**Enhancement:**
```sql
-- Add metadata for content classification
ALTER TABLE public.visual_analysis_results
ADD COLUMN IF NOT EXISTS content_flags JSONB DEFAULT '{}';

-- Add trigger to flag potentially sensitive content
CREATE OR REPLACE FUNCTION public.flag_visual_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Flag large images (potential high-res photos)
    IF length(NEW.image_data) > 1000000 THEN
        NEW.content_flags := NEW.content_flags || '{"large_file": true}'::jsonb;
    END IF;
    
    -- Log all image uploads for audit
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'visual_analysis_results',
        'IMAGE_UPLOAD',
        auth.uid(),
        'MEDIUM',
        ARRAY['IMAGE_DATA', 'CONTENT_REVIEW'],
        jsonb_build_object(
            'image_size', length(NEW.image_data),
            'content_flags', NEW.content_flags
        )
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER flag_visual_content_trigger
BEFORE INSERT OR UPDATE ON public.visual_analysis_results
FOR EACH ROW
EXECUTE FUNCTION public.flag_visual_content();
```

---

### 3:00 PM - 4:00 PM (1 hour)
🧪 **SEC-2.6: Security Sprint Integration Testing**

- Run full security regression scan
- Verify all migrations applied successfully
- Test edge function compatibility with new security functions
- Document any remaining findings for future sprints

---

## Wednesday, December 25, 2025

**🎄 Holiday - No scheduled work**

---

## Thursday, December 26, 2025

### 9:00 AM - 12:00 PM (3 hours)
📝 **SEC-3.1: Documentation & Verification**

- Update `SECURITY_CRITICAL_CORRECTIONS.md` with completed items
- Run final security scan and compare to December 13 baseline
- Document any deferred items for January 2026
- Create rollback procedures for each migration

### 1:00 PM - 3:00 PM (2 hours)
🧪 **SEC-3.2: End-to-End Security Validation**

- Test complete user flows with new security measures
- Verify no functional regressions
- Confirm audit logging captures all security events
- Performance benchmark to ensure no latency impact

---

## Friday, December 27, 2025

### 9:00 AM - 11:00 AM (2 hours)
📊 **SEC-4.1: Security Metrics & Reporting**

- Generate security compliance report
- Calculate improvement from December 13 baseline
- Identify any remaining gaps for Q1 2026

### 11:00 AM - 12:00 PM (1 hour)
✅ **SEC-4.2: Sprint Completion & Handoff**

- Mark all completed items in tracking
- Update `STATUS_REPORT_DECEMBER_2025.md`
- Schedule Q1 2026 security review

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Error-level findings | 0 | Security scan |
| Email hashing coverage | 100% | Database query |
| Encryption v2 migration | 100% | Database query |
| Service role audit logging | 100% | Audit log verification |
| Functional regression | 0 | E2E test suite |

---

## Rollback Procedures

Each migration includes a rollback path:

1. **Trial email hashing**: Keep plaintext column until January 2026, then drop
2. **Rate limit hashing**: Dual-write period of 30 days
3. **Subscriber validation**: Function versioning allows instant rollback
4. **Encryption v2**: Both v1 and v2 decryption functions remain available
5. **ADAPT credentials**: Nullable constraint can be removed

---

## Dependencies

- QC completion on December 20, 2025
- No active edge function deployments during migration windows
- Database backup before each migration batch
