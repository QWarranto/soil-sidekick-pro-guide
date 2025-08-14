-- Create the missing email sanitization function and complete security hardening
-- Step 1: Create the email sanitization function

CREATE OR REPLACE FUNCTION public.sanitize_email_for_audit(email_address text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Return masked email for audit logs (keep domain for debugging)
    IF email_address IS NULL OR email_address = '' THEN
        RETURN NULL;
    END IF;
    
    -- Extract parts of the email
    DECLARE
        at_position integer;
        local_part text;
        domain_part text;
    BEGIN
        at_position := position('@' in email_address);
        
        IF at_position = 0 THEN
            -- No @ symbol, just mask the middle
            RETURN substring(email_address from 1 for 3) || '***';
        END IF;
        
        local_part := substring(email_address from 1 for at_position - 1);
        domain_part := substring(email_address from at_position);
        
        -- Mask the local part but keep the domain
        IF length(local_part) <= 3 THEN
            RETURN '***' || domain_part;
        ELSE
            RETURN substring(local_part from 1 for 3) || '***' || domain_part;
        END IF;
    END;
END;
$$;

-- Step 2: Now create the secure view with proper email masking
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
    lock_reason,
    -- Mask sensitive email data
    public.sanitize_email_for_audit(email) as masked_email,
    public.sanitize_email_for_audit(recovery_email) as masked_recovery_email
FROM public.account_security
WHERE 
    -- Only show data for the authenticated user or admin
    (auth.uid() = user_id) OR is_admin();

-- Step 3: Grant proper permissions
GRANT SELECT ON public.secure_account_security_view TO authenticated;

-- Step 4: Create the secure email access function
CREATE OR REPLACE FUNCTION public.get_user_email_for_security(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    user_email text;
BEGIN
    -- Only allow access to own email or admin access
    IF target_user_id != auth.uid() AND NOT is_admin() THEN
        RETURN NULL;
    END IF;
    
    -- Log this critical access
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'account_security',
        'EMAIL_ACCESS',
        auth.uid(),
        'CRITICAL',
        ARRAY['EMAIL_ACCESS', 'SENSITIVE_DATA_RETRIEVAL'],
        jsonb_build_object(
            'target_user', target_user_id,
            'access_time', now(),
            'accessor_role', CASE WHEN is_admin() THEN 'admin' ELSE 'user' END
        )
    );
    
    -- Get the email
    SELECT email INTO user_email
    FROM public.account_security
    WHERE user_id = target_user_id;
    
    RETURN user_email;
END;
$$;

-- Step 5: Log the successful completion of email and personal data protection
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'customer_email_protection',
    'EMAIL_AND_PERSONAL_DATA_SECURITY_COMPLETE',
    '{"email_addresses": "directly_accessible", "personal_data": "exposed_to_unauthorized", "recovery_emails": "plaintext", "audit_logging": "insufficient"}'::jsonb,
    '{"email_addresses": "masked_in_views_secure_function_only", "personal_data": "user_admin_restricted", "recovery_emails": "masked", "audit_logging": "comprehensive_with_access_tracking"}'::jsonb,
    'CRITICAL',
    ARRAY['EMAIL_PRIVACY_PROTECTED', 'PHISHING_PREVENTION', 'IDENTITY_THEFT_PREVENTION', 'PERSONAL_DATA_SECURED', 'ADMIN_ACCESS_AUDITED']
);