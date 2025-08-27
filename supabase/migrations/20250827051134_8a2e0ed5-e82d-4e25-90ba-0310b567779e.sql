-- SECURITY FIX: Strengthen RLS policies for subscribers table to prevent unauthorized email access

-- First, let's create a more secure validation function for service operations
CREATE OR REPLACE FUNCTION public.validate_subscription_service_operation()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    jwt_claims jsonb;
    user_email text;
    calling_function text;
BEGIN
    -- Must be service role
    IF auth.role() != 'service_role' THEN
        RETURN false;
    END IF;
    
    -- Get JWT claims
    BEGIN
        jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN false;
    END;
    
    -- Must have email in JWT claims (authenticated user context)
    user_email := jwt_claims->>'email';
    IF user_email IS NULL OR user_email = '' THEN
        RETURN false;
    END IF;
    
    -- Get the calling function context
    GET DIAGNOSTICS calling_function = PG_CONTEXT;
    
    -- Only allow specific edge functions to use service role access
    -- This prevents arbitrary service role access to subscriber data
    IF calling_function NOT LIKE '%check-subscription%' 
       AND calling_function NOT LIKE '%create-checkout%' 
       AND calling_function NOT LIKE '%customer-portal%' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

-- Drop existing overly permissive service role policies
DROP POLICY IF EXISTS "Authenticated service can insert subscription data" ON public.subscribers;
DROP POLICY IF EXISTS "Authenticated service can update subscription data" ON public.subscribers;

-- Create new, more restrictive service role policies
CREATE POLICY "Restricted service operations for subscriptions"
ON public.subscribers
FOR ALL
TO service_role
USING (validate_subscription_service_operation())
WITH CHECK (validate_subscription_service_operation());

-- Ensure the existing user policies are properly restrictive
-- Update the SELECT policy to be more explicit
DROP POLICY IF EXISTS "Users can view their own subscription only" ON public.subscribers;
CREATE POLICY "Users can view their own subscription only"
ON public.subscribers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Update the UPDATE policy to be more explicit  
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Add explicit INSERT policy for users (was missing)
CREATE POLICY "Users can insert their own subscription"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Explicitly block DELETE operations for all users (sensitive financial data should be preserved)
CREATE POLICY "No deletion of subscription data"
ON public.subscribers
FOR DELETE
TO authenticated, service_role
USING (false);

-- Create audit logging for all subscriber table access
CREATE OR REPLACE FUNCTION public.audit_subscriber_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Log all operations on the subscribers table for security monitoring
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        'SUBSCRIBER_' || TG_OP,
        COALESCE(auth.uid(), 
            CASE WHEN auth.role() = 'service_role' 
            THEN (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid 
            ELSE NULL END),
        jsonb_build_object(
            'operation', TG_OP,
            'table', 'subscribers',
            'record_id', COALESCE(NEW.id, OLD.id),
            'email_affected', COALESCE(NEW.email, OLD.email),
            'auth_role', auth.role(),
            'service_validation', CASE WHEN auth.role() = 'service_role' 
                THEN validate_subscription_service_operation() 
                ELSE NULL END
        ),
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create the audit trigger
DROP TRIGGER IF EXISTS audit_subscriber_operations ON public.subscribers;
CREATE TRIGGER audit_subscriber_operations
    AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION audit_subscriber_access();

-- Additional security: Create a view that masks sensitive data for debugging
CREATE OR REPLACE VIEW public.subscribers_security_view AS
SELECT 
    id,
    user_id,
    left(email, 3) || '***@' || split_part(email, '@', 2) as masked_email,
    CASE WHEN stripe_customer_id IS NOT NULL THEN 'cus_***' ELSE NULL END as masked_stripe_id,
    subscribed,
    subscription_tier,
    subscription_interval,
    subscription_end,
    created_at,
    updated_at
FROM public.subscribers;

-- Grant appropriate permissions on the security view
GRANT SELECT ON public.subscribers_security_view TO authenticated;

-- Add RLS to the view as well
ALTER VIEW public.subscribers_security_view SET (security_invoker = on);

-- Create a compliance check function specific to subscriber security
CREATE OR REPLACE FUNCTION public.check_subscriber_security_compliance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    policy_count integer;
    audit_enabled boolean;
    service_validation_enabled boolean;
    result jsonb;
BEGIN
    -- Check number of policies on subscribers table
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'subscribers' AND schemaname = 'public';
    
    -- Check if audit trigger exists
    SELECT EXISTS(
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'audit_subscriber_operations' 
        AND tgrelid = 'public.subscribers'::regclass
    ) INTO audit_enabled;
    
    -- Check if validation function exists
    SELECT EXISTS(
        SELECT 1 FROM pg_proc 
        WHERE proname = 'validate_subscription_service_operation'
    ) INTO service_validation_enabled;
    
    result := jsonb_build_object(
        'policies_count', policy_count,
        'audit_enabled', audit_enabled,
        'service_validation_enabled', service_validation_enabled,
        'security_score', CASE 
            WHEN policy_count >= 5 AND audit_enabled AND service_validation_enabled THEN 95
            WHEN policy_count >= 3 AND audit_enabled THEN 75
            WHEN policy_count >= 2 THEN 50
            ELSE 25
        END,
        'recommendations', CASE
            WHEN NOT audit_enabled THEN ARRAY['Enable audit logging for subscriber operations']
            WHEN NOT service_validation_enabled THEN ARRAY['Implement service role validation']
            WHEN policy_count < 5 THEN ARRAY['Review and strengthen RLS policies']
            ELSE ARRAY['Security configuration is optimal']
        END
    );
    
    RETURN result;
END;
$function$;