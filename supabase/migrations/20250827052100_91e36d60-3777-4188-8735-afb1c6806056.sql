-- Fix security vulnerability: Create secure access function for subscribers_security_view
-- Since views cannot have RLS policies, we create a security definer function to control access

-- Create a secure function to access masked subscription data
CREATE OR REPLACE FUNCTION public.get_masked_subscription_data(target_user_id uuid DEFAULT NULL)
RETURNS TABLE(
    id uuid,
    user_id uuid,
    subscribed boolean,
    subscription_end timestamp with time zone,
    encryption_version integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    masked_email text,
    masked_stripe_id text,
    subscription_interval text,
    subscription_tier text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Security check: Only allow access to own data or admin access
    IF target_user_id IS NOT NULL THEN
        -- Specific user requested - only allow if requesting own data or is admin
        IF target_user_id != auth.uid() AND NOT is_admin() THEN
            RAISE EXCEPTION 'Access denied: Can only view own subscription data or admin access required';
        END IF;
        
        -- Return specific user's data
        RETURN QUERY
        SELECT 
            ssv.id,
            ssv.user_id,
            ssv.subscribed,
            ssv.subscription_end,
            ssv.encryption_version,
            ssv.created_at,
            ssv.updated_at,
            ssv.masked_email,
            ssv.masked_stripe_id,
            ssv.subscription_interval,
            ssv.subscription_tier
        FROM public.subscribers_security_view ssv
        WHERE ssv.user_id = target_user_id;
    ELSE
        -- No specific user - return based on role
        IF is_admin() THEN
            -- Admin can see all records
            RETURN QUERY
            SELECT 
                ssv.id,
                ssv.user_id,
                ssv.subscribed,
                ssv.subscription_end,
                ssv.encryption_version,
                ssv.created_at,
                ssv.updated_at,
                ssv.masked_email,
                ssv.masked_stripe_id,
                ssv.subscription_interval,
                ssv.subscription_tier
            FROM public.subscribers_security_view ssv;
        ELSE
            -- Regular user can only see their own data
            RETURN QUERY
            SELECT 
                ssv.id,
                ssv.user_id,
                ssv.subscribed,
                ssv.subscription_end,
                ssv.encryption_version,
                ssv.created_at,
                ssv.updated_at,
                ssv.masked_email,
                ssv.masked_stripe_id,
                ssv.subscription_interval,
                ssv.subscription_tier
            FROM public.subscribers_security_view ssv
            WHERE ssv.user_id = auth.uid();
        END IF;
    END IF;
    
    -- Log this access for security monitoring
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details
    ) VALUES (
        'MASKED_SUBSCRIPTION_DATA_ACCESS',
        auth.uid(),
        jsonb_build_object(
            'target_user_id', target_user_id,
            'is_admin_access', is_admin(),
            'access_time', now()
        )
    );
END;
$function$;

-- Create a restricted view that blocks direct access to the original view
-- Drop and recreate the view with a security barrier
DROP VIEW IF EXISTS public.subscribers_security_view;

-- Recreate as a secure view that requires authentication
CREATE VIEW public.subscribers_security_view 
WITH (security_barrier = true)
AS 
SELECT 
    s.id,
    s.user_id,
    s.subscribed,
    s.subscription_end,
    s.encryption_version,
    s.created_at,
    s.updated_at,
    -- Mask email for security (show only first 3 chars + domain)
    CASE 
        WHEN s.email IS NOT NULL THEN
            substring(s.email from 1 for 3) || '***@' || split_part(s.email, '@', 2)
        WHEN s.encrypted_email IS NOT NULL THEN
            '***encrypted***@domain.com'
        ELSE NULL
    END as masked_email,
    -- Mask Stripe ID (show only last 4 characters)
    CASE 
        WHEN s.stripe_customer_id IS NOT NULL THEN
            '***' || right(s.stripe_customer_id, 4)
        WHEN s.encrypted_stripe_customer_id IS NOT NULL THEN
            '***encrypted***'
        ELSE NULL
    END as masked_stripe_id,
    s.subscription_interval,
    s.subscription_tier
FROM public.subscribers s
WHERE 
    -- Only show data if user is authenticated and accessing own data or is admin
    (auth.uid() IS NOT NULL AND (s.user_id = auth.uid() OR is_admin()));

-- Grant usage to authenticated users only
REVOKE ALL ON public.subscribers_security_view FROM PUBLIC;
GRANT SELECT ON public.subscribers_security_view TO authenticated;

-- Set up RLS-like behavior by revoking public access to the secure function
REVOKE ALL ON FUNCTION public.get_masked_subscription_data(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_masked_subscription_data(uuid) TO authenticated;