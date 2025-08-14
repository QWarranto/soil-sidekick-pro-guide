-- Fix the SECURITY DEFINER view issue by ensuring the view is security invoker
-- This ensures proper RLS compliance

-- Drop and recreate the view as security invoker
DROP VIEW IF EXISTS public.secure_account_security_view;

-- Create the view without any security definer properties
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
    email_encryption_version,
    -- For the view, we'll show masked emails only to maintain security
    -- Full email access should go through the secure function
    '***@domain.com' as masked_email,
    '***@domain.com' as masked_recovery_email
FROM public.account_security;

-- Explicitly set the view to use security invoker (respects RLS)
ALTER VIEW public.secure_account_security_view SET (security_invoker = true);

-- Grant proper permissions
GRANT SELECT ON public.secure_account_security_view TO authenticated;

-- Create a simplified email masking function for the view that doesn't require SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.simple_email_mask()
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT 'email@masked.com'::text;
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
    'view_security_compliance',
    'SECURITY_DEFINER_VIEW_FIXED',
    '{"view_security": "definer", "rls_compliance": "bypassed"}'::jsonb,
    '{"view_security": "invoker", "rls_compliance": "enforced", "email_access": "secure_function_only"}'::jsonb,
    'HIGH',
    ARRAY['VIEW_SECURITY_COMPLIANCE', 'RLS_ENFORCED', 'EMAIL_PROTECTION_MAINTAINED']
);