-- Final fix for Security Definer View issue
-- According to Supabase best practices, we should avoid views that bypass RLS
-- Instead, use the secure function for all access to masked subscriber data

-- Drop the view entirely as it's flagged as a security risk
DROP VIEW IF EXISTS public.subscribers_security_view;

-- Update the get_masked_subscription_data function to work without the view
-- This function already has proper security controls and audit logging
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
        
        -- Return specific user's data with masking applied directly
        RETURN QUERY
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
        WHERE s.user_id = target_user_id;
    ELSE
        -- No specific user - return based on role
        IF is_admin() THEN
            -- Admin can see all records
            RETURN QUERY
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
            FROM public.subscribers s;
        ELSE
            -- Regular user can only see their own data
            RETURN QUERY
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
            WHERE s.user_id = auth.uid();
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
            'access_time', now(),
            'access_method', 'secure_function_only'
        )
    );
END;
$function$;

-- Log this security improvement
INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
) VALUES (
    'SECURITY_DEFINER_VIEW_REMOVED',
    NULL, -- System operation
    jsonb_build_object(
        'action', 'removed_subscribers_security_view',
        'reason', 'Security best practice - replaced with secure function access only',
        'fix_date', now(),
        'compliance_improvement', 'Eliminated potential RLS bypass through views'
    )
);