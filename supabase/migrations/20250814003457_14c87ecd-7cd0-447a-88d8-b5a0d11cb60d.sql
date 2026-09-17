-- Fix the SECURITY DEFINER view issue by dropping and recreating as a regular view
-- Remove the security definer view and implement proper RLS-based access

-- Drop the problematic view
DROP VIEW IF EXISTS public.secure_account_security_view;

-- Create a regular view without SECURITY DEFINER
CREATE VIEW public.secure_account_security_view AS
SELECT 
    id,
    user_id,
    failed_login_attempts,
    account_locked,
    locked_until,
    password_changed_at,
    password_strength_score,
    requires_password_change,
    two_factor_enabled,
    backup_codes_generated,
    suspicious_activity_count,
    last_suspicious_activity,
    created_at,
    updated_at,
    lock_reason,
    -- Mask sensitive email data using the function
    public.sanitize_email_for_audit(email) as masked_email,
    public.sanitize_email_for_audit(recovery_email) as masked_recovery_email
FROM public.account_security;

-- Enable RLS on the view (this will inherit from underlying table policies)
ALTER VIEW public.secure_account_security_view SET (security_invoker = true);

-- Grant proper permissions
GRANT SELECT ON public.secure_account_security_view TO authenticated;

-- Create a secure function to access full email when necessary (for legitimate use cases)
CREATE OR REPLACE FUNCTION public.get_user_email_securely(target_user_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    user_email text;
    actual_target_user_id uuid;
BEGIN
    -- Default to current user if no target specified
    actual_target_user_id := COALESCE(target_user_id, auth.uid());
    
    -- Only allow access to own email or admin access
    IF actual_target_user_id != auth.uid() AND NOT is_admin() THEN
        RETURN NULL;
    END IF;
    
    -- Log this access for audit purposes
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        'SECURE_EMAIL_ACCESS',
        auth.uid(),
        'HIGH',
        ARRAY['EMAIL_ACCESS', 'AUTHORIZED_RETRIEVAL'],
        jsonb_build_object(
            'target_user', actual_target_user_id,
            'access_time', now(),
            'is_admin_access', is_admin()
        )
    );
    
    -- Get the email securely
    SELECT email INTO user_email
    FROM public.account_security
    WHERE user_id = actual_target_user_id;
    
    RETURN user_email;
END;
$$;

-- Log the security fix completion
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'view_security_fix',
    'SECURITY_DEFINER_VIEW_REMEDIATED',
    '{"view_type": "security_definer", "security_risk": "bypasses_rls"}'::jsonb,
    '{"view_type": "security_invoker", "security_risk": "resolved", "rls_compliant": true}'::jsonb,
    'HIGH',
    ARRAY['VIEW_SECURITY_FIX', 'RLS_COMPLIANCE', 'EMAIL_PROTECTION_MAINTAINED']
);