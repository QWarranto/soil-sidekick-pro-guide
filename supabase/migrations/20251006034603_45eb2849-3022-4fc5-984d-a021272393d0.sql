-- Security Fix: Consolidate RLS policies on account_security table
-- Remove duplicate/overlapping policies and enforce strict user ownership checks

-- Drop existing overlapping policies on account_security (with IF EXISTS)
DROP POLICY IF EXISTS "Authenticated users can view account security" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated users can view own security data" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated users can insert own security data" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated users can update own account security" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated users can update own security data" ON public.account_security;
DROP POLICY IF EXISTS "Authenticated service can create security records" ON public.account_security;
DROP POLICY IF EXISTS "No deletion of security records" ON public.account_security;
DROP POLICY IF EXISTS "Users can view own security status" ON public.account_security;
DROP POLICY IF EXISTS "Users can insert own security data" ON public.account_security;
DROP POLICY IF EXISTS "Users can update own security status" ON public.account_security;

-- Create consolidated, strict owner-based policies
CREATE POLICY "Users view own security data only"
ON public.account_security
FOR SELECT
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users insert own security data only"
ON public.account_security
FOR INSERT
WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users update own security data only"
ON public.account_security
FOR UPDATE
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL)
WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "No user deletion of security records"
ON public.account_security
FOR DELETE
USING (false);

-- Keep admin and service role access policies (unchanged)

-- Security Fix: Upgrade trigger to BLOCK plaintext writes to subscribers table
CREATE OR REPLACE FUNCTION public.prevent_plaintext_payment_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Block any attempts to write plaintext payment data
  IF NEW.email IS NOT NULL OR NEW.stripe_customer_id IS NOT NULL THEN
    RAISE EXCEPTION 'Direct writes to plaintext columns prohibited. Use secure_upsert_subscriber() function.';
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS prevent_plaintext_subscriber_data ON public.subscribers;
CREATE TRIGGER prevent_plaintext_subscriber_data
  BEFORE INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_plaintext_payment_data();

-- Security Fix: Add input validation to handle_login_attempt
CREATE OR REPLACE FUNCTION public.handle_login_attempt(
    user_email text,
    attempt_success boolean,
    client_ip inet DEFAULT NULL,
    user_agent_string text DEFAULT NULL,
    failure_reason_text text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    security_record RECORD;
    risk_score INTEGER := 0;
    account_locked BOOLEAN := FALSE;
    lockout_duration INTERVAL := '15 minutes';
    max_attempts INTEGER := 5;
    result JSONB;
    validated_email text;
BEGIN
    -- Validate and sanitize email input
    validated_email := validate_and_sanitize_input(user_email, 'email', 255);
    
    -- Get user info
    SELECT id INTO user_record FROM auth.users WHERE email = validated_email;
    
    IF user_record.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Get or create security record
    INSERT INTO public.account_security (user_id, email)
    VALUES (user_record.id, validated_email)
    ON CONFLICT (user_id) DO NOTHING;
    
    SELECT * INTO security_record FROM public.account_security WHERE user_id = user_record.id;
    
    -- Calculate risk score
    IF client_ip IS NOT NULL THEN
        SELECT COUNT(*) INTO risk_score
        FROM public.auth_security_log
        WHERE ip_address = client_ip AND success = FALSE 
          AND created_at > now() - interval '1 hour';
        risk_score := LEAST(risk_score * 10, 50);
    END IF;
    
    IF EXTRACT(hour FROM now()) NOT BETWEEN 6 AND 23 THEN
        risk_score := risk_score + 20;
    END IF;
    
    IF attempt_success THEN
        UPDATE public.account_security
        SET failed_login_attempts = 0, last_failed_login = NULL,
            account_locked = FALSE, locked_until = NULL, updated_at = now()
        WHERE user_id = user_record.id;
        
        INSERT INTO public.auth_security_log (user_id, email, event_type, ip_address, user_agent, success, risk_score, metadata)
        VALUES (user_record.id, validated_email, 'login_success', client_ip, user_agent_string, TRUE, risk_score, jsonb_build_object('timestamp', now()));
    ELSE
        UPDATE public.account_security
        SET failed_login_attempts = failed_login_attempts + 1, last_failed_login = now(),
            suspicious_activity_count = CASE WHEN risk_score > 30 THEN suspicious_activity_count + 1 ELSE suspicious_activity_count END,
            last_suspicious_activity = CASE WHEN risk_score > 30 THEN now() ELSE last_suspicious_activity END,
            updated_at = now()
        WHERE user_id = user_record.id;
        
        IF security_record.failed_login_attempts + 1 >= max_attempts THEN
            UPDATE public.account_security
            SET account_locked = TRUE, locked_until = now() + lockout_duration,
                lock_reason = 'Too many failed login attempts'
            WHERE user_id = user_record.id;
            account_locked := TRUE;
            
            INSERT INTO public.auth_security_log (user_id, email, event_type, ip_address, user_agent, success, failure_reason, risk_score, metadata)
            VALUES (user_record.id, validated_email, 'account_locked', client_ip, user_agent_string, FALSE, 'Account locked', risk_score, jsonb_build_object('locked_until', now() + lockout_duration));
        END IF;
        
        INSERT INTO public.auth_security_log (user_id, email, event_type, ip_address, user_agent, success, failure_reason, risk_score, metadata)
        VALUES (user_record.id, validated_email, 'login_fail', client_ip, user_agent_string, FALSE, failure_reason_text, risk_score, jsonb_build_object('attempt_number', security_record.failed_login_attempts + 1));
    END IF;
    
    RETURN jsonb_build_object(
        'success', attempt_success,
        'account_locked', account_locked,
        'risk_score', risk_score,
        'failed_attempts', CASE WHEN attempt_success THEN 0 ELSE security_record.failed_login_attempts + 1 END
    );
END;
$$;

-- Security Fix: Add input validation to secure_upsert_subscriber
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(
    p_user_id uuid,
    p_email text,
    p_stripe_customer_id text DEFAULT NULL,
    p_subscribed boolean DEFAULT false,
    p_subscription_tier text DEFAULT NULL,
    p_subscription_interval text DEFAULT NULL,
    p_subscription_end timestamp with time zone DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    subscriber_id uuid;
    encrypted_email_value text;
    encrypted_stripe_id text;
    validated_email text;
BEGIN
    IF auth.role() != 'service_role' AND auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized access';
    END IF;
    
    IF auth.role() = 'service_role' AND NOT validate_subscription_service_operation() THEN
        RAISE EXCEPTION 'Invalid service role operation';
    END IF;
    
    -- Validate email input
    validated_email := validate_and_sanitize_input(p_email, 'email', 255);
    
    -- Encrypt data
    encrypted_email_value := public.encrypt_sensitive_payment_data(validated_email);
    encrypted_stripe_id := CASE WHEN p_stripe_customer_id IS NOT NULL 
        THEN public.encrypt_sensitive_payment_data(p_stripe_customer_id) ELSE NULL END;
    
    -- Upsert
    INSERT INTO public.subscribers (
        user_id, encrypted_email, encrypted_stripe_customer_id,
        subscribed, subscription_tier, subscription_interval,
        subscription_end, encryption_version, updated_at
    ) VALUES (
        p_user_id, encrypted_email_value, encrypted_stripe_id,
        p_subscribed, p_subscription_tier, p_subscription_interval,
        p_subscription_end, 2, now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        encrypted_email = EXCLUDED.encrypted_email,
        encrypted_stripe_customer_id = EXCLUDED.encrypted_stripe_customer_id,
        subscribed = EXCLUDED.subscribed,
        subscription_tier = EXCLUDED.subscription_tier,
        subscription_interval = EXCLUDED.subscription_interval,
        subscription_end = EXCLUDED.subscription_end,
        encryption_version = EXCLUDED.encryption_version,
        updated_at = EXCLUDED.updated_at
    RETURNING id INTO subscriber_id;
    
    -- Log operation
    INSERT INTO public.security_audit_log (event_type, user_id, details)
    VALUES ('SECURE_SUBSCRIBER_UPSERT', COALESCE(auth.uid(), p_user_id),
        jsonb_build_object('subscriber_id', subscriber_id, 'encryption_version', 2));
    
    RETURN subscriber_id;
END;
$$;