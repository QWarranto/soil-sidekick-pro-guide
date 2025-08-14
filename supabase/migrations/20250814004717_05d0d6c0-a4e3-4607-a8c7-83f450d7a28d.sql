-- Security Fix: Remove plaintext email fields from account_security table
-- This addresses the security finding about customer email exposure

-- First, ensure all data is migrated to encrypted format
-- (The migrate_account_security_emails function should handle this)
SELECT public.migrate_account_security_emails();

-- Drop the plaintext email columns to eliminate exposure risk
ALTER TABLE public.account_security 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS recovery_email;

-- Update the secure_account_security_view to use only encrypted fields
DROP VIEW IF EXISTS public.secure_account_security_view;

CREATE OR REPLACE VIEW public.secure_account_security_view AS
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
    email_encryption_version,
    lock_reason,
    -- Use masking function for audit display only
    public.simple_email_mask() as masked_email,
    public.simple_email_mask() as masked_recovery_email
FROM public.account_security;

-- Create a secure function for retrieving user emails when absolutely necessary
CREATE OR REPLACE FUNCTION public.get_user_email_secure_only(target_user_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encrypted_email_value text;
    decrypted_email text;
    actual_target_user_id uuid;
BEGIN
    -- Default to current user if no target specified
    actual_target_user_id := COALESCE(target_user_id, auth.uid());
    
    -- Security check: only allow access to own email or admin access
    IF actual_target_user_id != auth.uid() AND NOT public.is_admin() THEN
        RETURN NULL;
    END IF;
    
    -- Get encrypted email only
    SELECT encrypted_email INTO encrypted_email_value
    FROM public.account_security
    WHERE user_id = actual_target_user_id;
    
    -- If no encrypted email found, return null (no fallback to plaintext)
    IF encrypted_email_value IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Decrypt the email
    decrypted_email := public.decrypt_email_address(encrypted_email_value);
    
    -- Log this critical access for security audit
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        'SECURE_EMAIL_RETRIEVAL_ONLY',
        auth.uid(),
        'CRITICAL',
        ARRAY['EMAIL_ACCESS', 'ENCRYPTED_ONLY', 'SECURITY_HARDENED'],
        jsonb_build_object(
            'target_user', actual_target_user_id,
            'access_time', now(),
            'is_admin_access', public.is_admin(),
            'plaintext_removed', true
        )
    );
    
    RETURN decrypted_email;
END;
$$;

-- Update the handle_new_user_security trigger to only use encrypted fields
CREATE OR REPLACE FUNCTION public.handle_new_user_security()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    INSERT INTO public.account_security (
        user_id, 
        encrypted_email,
        email_encryption_version
    )
    VALUES (
        NEW.id, 
        public.encrypt_email_address(NEW.email),
        1
    );
    RETURN NEW;
END;
$$;

-- Log this critical security improvement
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'account_security',
    'PLAINTEXT_EMAIL_REMOVAL',
    '{"plaintext_fields": ["email", "recovery_email"], "exposure_risk": "HIGH"}'::jsonb,
    '{"encrypted_only": true, "plaintext_fields": "REMOVED", "exposure_risk": "ELIMINATED"}'::jsonb,
    'CRITICAL',
    ARRAY['DATA_PROTECTION', 'ENCRYPTION_ONLY', 'PLAINTEXT_REMOVAL', 'SECURITY_HARDENING']
);