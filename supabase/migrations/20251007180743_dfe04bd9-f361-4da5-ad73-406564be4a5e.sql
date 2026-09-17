-- Add input validation to key SECURITY DEFINER functions (without modifying encryption)

CREATE OR REPLACE FUNCTION public.unlock_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;

    IF NOT (public.is_admin() OR 
            (auth.uid() = target_user_id AND 
             EXISTS(SELECT 1 FROM public.account_security 
                   WHERE user_id = target_user_id 
                   AND locked_until < now()))) THEN
        RETURN FALSE;
    END IF;
    
    UPDATE public.account_security
    SET account_locked = FALSE, locked_until = NULL,
        failed_login_attempts = 0, lock_reason = NULL, updated_at = now()
    WHERE user_id = target_user_id;
    
    INSERT INTO public.auth_security_log (user_id, event_type, success, metadata)
    VALUES (target_user_id, 'account_unlocked', TRUE,
        jsonb_build_object('unlocked_by', auth.uid(), 'timestamp', now()));
    
    RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.secure_get_subscriber_data(p_user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, email text, stripe_customer_id text, subscribed boolean, 
    subscription_tier text, subscription_interval text, subscription_end timestamp with time zone, 
    created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;

    IF auth.uid() != p_user_id AND auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Unauthorized access to subscriber data';
    END IF;
    
    IF auth.role() = 'service_role' THEN
        IF NOT validate_subscription_service_operation() THEN
            RAISE EXCEPTION 'Invalid service role operation';
        END IF;
    END IF;
    
    INSERT INTO public.security_audit_log (event_type, user_id, details)
    VALUES ('SECURE_SUBSCRIBER_ACCESS', COALESCE(auth.uid(), p_user_id),
        jsonb_build_object('operation', 'secure_get', 'target_user', p_user_id, 'auth_role', auth.role()));
    
    RETURN QUERY
    SELECT s.id, s.user_id,
        COALESCE(public.decrypt_sensitive_payment_data(s.encrypted_email), s.email) as email,
        COALESCE(public.decrypt_sensitive_payment_data(s.encrypted_stripe_customer_id), s.stripe_customer_id) as stripe_customer_id,
        s.subscribed, s.subscription_tier, s.subscription_interval, s.subscription_end, s.created_at, s.updated_at
    FROM public.subscribers s WHERE s.user_id = p_user_id;
END;
$function$;

-- Add trial rate limiting system
CREATE TABLE IF NOT EXISTS public.trial_creation_rate_limit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address inet NOT NULL,
    email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    attempts integer NOT NULL DEFAULT 1
);

ALTER TABLE public.trial_creation_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rate limits" ON public.trial_creation_rate_limit
FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_trial_rate_limit_ip ON public.trial_creation_rate_limit(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trial_rate_limit_email ON public.trial_creation_rate_limit(email, created_at DESC);

CREATE OR REPLACE FUNCTION public.check_trial_rate_limit(check_ip inet, check_email text, max_attempts integer DEFAULT 3, window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    recent_attempts integer;
BEGIN
    SELECT COUNT(*) INTO recent_attempts FROM public.trial_creation_rate_limit
    WHERE ip_address = check_ip AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    SELECT COUNT(*) INTO recent_attempts FROM public.trial_creation_rate_limit
    WHERE email = check_email AND created_at > now() - (window_minutes || ' minutes')::interval;
    
    IF recent_attempts >= max_attempts THEN RETURN FALSE; END IF;
    
    INSERT INTO public.trial_creation_rate_limit (ip_address, email) VALUES (check_ip, check_email);
    RETURN TRUE;
END;
$function$;