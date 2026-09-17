-- ============================================
-- Security Hardening: Address Error-Level Security Findings
-- Date: 2025-12-26
-- Issues: trial_users_email_exposure, subscribers_encrypted_data_exposure, trial_creation_rate_limit_exposure
-- ============================================

-- Step 1: Verify RLS is enabled on all sensitive tables (redundant but ensures compliance)
ALTER TABLE public.trial_creation_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop and recreate stricter policies for trial_creation_rate_limit
-- First drop existing policies
DROP POLICY IF EXISTS "Service role manages rate limits" ON public.trial_creation_rate_limit;

-- Create strict service-role-only policy
CREATE POLICY "Service role only access to rate limits"
ON public.trial_creation_rate_limit
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Service role can manage rate limits"
ON public.trial_creation_rate_limit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 3: Ensure trial_users has proper policies
-- Existing policies should block all authenticated access, but let's verify
DROP POLICY IF EXISTS "Block authenticated user access to trial_users" ON public.trial_users;
DROP POLICY IF EXISTS "Service role can manage trial users" ON public.trial_users;

-- Block all non-service access
CREATE POLICY "Block all non-service access to trial_users"
ON public.trial_users
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Allow service role full access
CREATE POLICY "Service role manages trial_users"
ON public.trial_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Strengthen subscribers table validation
-- Create a more secure validation function that logs all access
CREATE OR REPLACE FUNCTION public.validate_subscription_service_operation()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    caller_role text;
    jwt_claims jsonb;
BEGIN
    caller_role := auth.role();
    
    -- Only allow service_role to perform operations
    IF caller_role != 'service_role' THEN
        -- Log unauthorized access attempt
        INSERT INTO public.security_audit_log (
            event_type,
            user_id,
            details,
            ip_address
        ) VALUES (
            'UNAUTHORIZED_SUBSCRIBER_ACCESS_ATTEMPT',
            auth.uid(),
            jsonb_build_object(
                'attempted_role', caller_role,
                'timestamp', now()
            ),
            '0.0.0.0'::inet
        );
        RETURN false;
    END IF;
    
    -- Validate that there's a legitimate JWT claim
    BEGIN
        jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    EXCEPTION
        WHEN OTHERS THEN
            jwt_claims := NULL;
    END;
    
    -- Service role access is allowed but logged for audit
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details,
        ip_address
    ) VALUES (
        'SUBSCRIBER_SERVICE_ACCESS',
        COALESCE((jwt_claims->>'sub')::uuid, NULL),
        jsonb_build_object(
            'access_type', 'service_role',
            'timestamp', now(),
            'has_jwt', jwt_claims IS NOT NULL
        ),
        '0.0.0.0'::inet
    );
    
    RETURN true;
END;
$$;

-- Step 5: Add audit trigger for trial_users table
CREATE OR REPLACE FUNCTION public.audit_trial_users_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.security_audit_log (
        event_type,
        details,
        ip_address
    ) VALUES (
        'TRIAL_USERS_' || TG_OP,
        jsonb_build_object(
            'operation', TG_OP,
            'record_id', COALESCE(NEW.id, OLD.id),
            'email_hash', COALESCE(NEW.email_hash, OLD.email_hash),
            'timestamp', now()
        ),
        '0.0.0.0'::inet
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit trigger if not exists
DROP TRIGGER IF EXISTS audit_trial_users_operations ON public.trial_users;
CREATE TRIGGER audit_trial_users_operations
    AFTER INSERT OR UPDATE OR DELETE ON public.trial_users
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trial_users_access();

-- Step 6: Add audit trigger for trial_creation_rate_limit
CREATE OR REPLACE FUNCTION public.audit_rate_limit_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Only log unusual patterns (more than 5 attempts)
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.attempts > 5) THEN
        INSERT INTO public.security_audit_log (
            event_type,
            details,
            ip_address
        ) VALUES (
            'RATE_LIMIT_' || TG_OP,
            jsonb_build_object(
                'operation', TG_OP,
                'attempts', COALESCE(NEW.attempts, OLD.attempts),
                'email_hash', COALESCE(NEW.email_hash, OLD.email_hash),
                'timestamp', now()
            ),
            COALESCE(NEW.ip_address, OLD.ip_address)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS audit_rate_limit_operations ON public.trial_creation_rate_limit;
CREATE TRIGGER audit_rate_limit_operations
    AFTER INSERT OR UPDATE ON public.trial_creation_rate_limit
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_rate_limit_access();

-- Step 7: Log security hardening completion
INSERT INTO public.security_audit_log (
    event_type,
    details,
    ip_address
) VALUES (
    'SECURITY_HARDENING_COMPLETE',
    jsonb_build_object(
        'date', now(),
        'tables_hardened', ARRAY['trial_users', 'trial_creation_rate_limit', 'subscribers'],
        'actions_taken', ARRAY[
            'RLS verified enabled on all sensitive tables',
            'Stricter policies created for trial_creation_rate_limit',
            'Stricter policies created for trial_users',
            'Enhanced subscriber validation with audit logging',
            'Added audit triggers for sensitive table access'
        ]
    ),
    '0.0.0.0'::inet
);