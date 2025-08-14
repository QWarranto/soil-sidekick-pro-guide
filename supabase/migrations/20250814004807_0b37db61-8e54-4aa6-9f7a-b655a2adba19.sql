-- Fix the security definer view issue
-- Remove SECURITY DEFINER from view and create a proper function instead

DROP VIEW IF EXISTS public.secure_account_security_view;

-- Create a secure function to get account security info instead of a SECURITY DEFINER view
CREATE OR REPLACE FUNCTION public.get_secure_account_security_info(target_user_id uuid DEFAULT NULL)
RETURNS TABLE(
    id uuid,
    user_id uuid,
    failed_login_attempts integer,
    account_locked boolean,
    locked_until timestamp with time zone,
    password_changed_at timestamp with time zone,
    password_strength_score integer,
    requires_password_change boolean,
    two_factor_enabled boolean,
    backup_codes_generated boolean,
    suspicious_activity_count integer,
    last_suspicious_activity timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email_encryption_version integer,
    lock_reason text,
    masked_email text,
    masked_recovery_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    actual_target_user_id uuid;
BEGIN
    -- Default to current user if no target specified
    actual_target_user_id := COALESCE(target_user_id, auth.uid());
    
    -- Security check: only allow access to own security info or admin access
    IF actual_target_user_id != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied to security information';
    END IF;
    
    -- Log this access for security audit
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        'SECURITY_INFO_ACCESS',
        auth.uid(),
        'HIGH',
        ARRAY['SECURITY_ACCESS', 'ACCOUNT_INFO_RETRIEVAL'],
        jsonb_build_object(
            'target_user', actual_target_user_id,
            'access_time', now(),
            'is_admin_access', public.is_admin()
        )
    );
    
    -- Return security information with masked emails
    RETURN QUERY
    SELECT 
        acs.id,
        acs.user_id,
        acs.failed_login_attempts,
        acs.account_locked,
        acs.locked_until,
        acs.password_changed_at,
        acs.password_strength_score,
        acs.requires_password_change,
        acs.two_factor_enabled,
        acs.backup_codes_generated,
        acs.suspicious_activity_count,
        acs.last_suspicious_activity,
        acs.created_at,
        acs.updated_at,
        acs.email_encryption_version,
        acs.lock_reason,
        public.simple_email_mask() as masked_email,
        public.simple_email_mask() as masked_recovery_email
    FROM public.account_security acs
    WHERE acs.user_id = actual_target_user_id;
END;
$$;

-- Log this security compliance fix
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'secure_account_security_view',
    'SECURITY_DEFINER_VIEW_REMOVED',
    '{"view_type": "SECURITY_DEFINER", "security_risk": "ELEVATED_PRIVILEGES"}'::jsonb,
    '{"function_type": "SECURITY_DEFINER_FUNCTION", "security_risk": "CONTROLLED_ACCESS"}'::jsonb,
    'MEDIUM',
    ARRAY['VIEW_SECURITY', 'PRIVILEGE_CONTROL', 'ACCESS_FUNCTION']
);