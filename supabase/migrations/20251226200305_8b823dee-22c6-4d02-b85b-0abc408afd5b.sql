-- Fix hash_email function to properly reference pgcrypto
DROP FUNCTION IF EXISTS public.hash_email(text);

CREATE OR REPLACE FUNCTION public.hash_email(email_to_hash TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT encode(digest(lower(email_to_hash) || 'SoilSidekickTrialSalt2024!', 'sha256'), 'hex');
$$;

-- Migrate existing trial_users data to use hash
UPDATE public.trial_users 
SET email_hash = public.hash_email(email)
WHERE email_hash IS NULL AND email IS NOT NULL;

-- Migrate existing rate limit data
UPDATE public.trial_creation_rate_limit
SET email_hash = public.hash_email(email)
WHERE email_hash IS NULL AND email IS NOT NULL;

-- Create trial lookup function using hash
CREATE OR REPLACE FUNCTION public.is_trial_valid_by_hash(trial_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 FROM public.trial_users 
        WHERE email_hash = public.hash_email(trial_email)
          AND is_active = true 
          AND trial_end > now()
    );
$$;

-- Secure rate limit check function
CREATE OR REPLACE FUNCTION public.check_trial_rate_limit_secure(
    check_ip INET, 
    check_email TEXT, 
    max_attempts INTEGER DEFAULT 3, 
    window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_attempts INTEGER;
    hashed_email TEXT;
BEGIN
    hashed_email := public.hash_email(check_email);
    
    SELECT COUNT(*) INTO recent_attempts 
    FROM public.trial_creation_rate_limit
    WHERE ip_address = check_ip 
      AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    SELECT COUNT(*) INTO recent_attempts 
    FROM public.trial_creation_rate_limit
    WHERE email_hash = hashed_email 
      AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    INSERT INTO public.trial_creation_rate_limit (ip_address, email, email_hash) 
    VALUES (check_ip, check_email, hashed_email);
    
    RETURN TRUE;
END;
$$;

-- SEC-1.3: Enhanced Subscriber Service Role Validation
CREATE OR REPLACE FUNCTION public.validate_subscription_service_operation()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    jwt_claims JSONB;
BEGIN
    IF auth.role() != 'service_role' THEN
        RETURN FALSE;
    END IF;
    
    BEGIN
        jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    EXCEPTION WHEN OTHERS THEN
        RETURN FALSE;
    END;
    
    IF jwt_claims->>'email' IS NULL THEN
        RETURN FALSE;
    END IF;
    
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

-- SEC-1.4: V2 Email Encryption Function
CREATE OR REPLACE FUNCTION public.encrypt_email_v2(email_to_encrypt TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key TEXT := 'SoilSidekickEmailKeyV2-2025!Stronger';
BEGIN
    IF email_to_encrypt IS NULL OR email_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
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

-- SEC-2.2: Secure API key hashing with salt
CREATE OR REPLACE FUNCTION public.hash_api_key_secure(api_key TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT encode(digest(api_key || 'SS_API_' || substring(api_key from 4 for 8) || '_2025', 'sha512'), 'hex');
$$;

-- SEC-2.3: Anonymous Feedback Rate Limiting
CREATE OR REPLACE FUNCTION public.check_anonymous_feedback_rate_limit(client_ip_param INET)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT (
        SELECT COUNT(*) 
        FROM public.user_feedback
        WHERE user_id IS NULL
          AND created_at > now() - interval '1 hour'
          AND client_ip = client_ip_param
    ) < 3;
$$;

-- SEC-2.4: Secure Session Token Generation
CREATE OR REPLACE FUNCTION public.generate_secure_session_token()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT encode(gen_random_bytes(32), 'base64');
$$;

-- SEC-2.4: Session validation function
CREATE OR REPLACE FUNCTION public.validate_session_token(token TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 FROM public.county_search_sessions
        WHERE session_token = token
          AND expires_at > now()
    );
$$;

-- SEC-2.1: Nullify any remaining plaintext API credentials
UPDATE public.adapt_integrations
SET api_credentials = NULL
WHERE encrypted_api_credentials IS NOT NULL AND api_credentials IS NOT NULL;