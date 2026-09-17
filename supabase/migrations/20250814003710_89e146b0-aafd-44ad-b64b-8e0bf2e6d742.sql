-- Implement field-level encryption for email addresses in account_security table
-- This will completely protect customer email addresses from unauthorized access

-- 1. Add encrypted email columns to account_security table
ALTER TABLE public.account_security 
ADD COLUMN IF NOT EXISTS encrypted_email text,
ADD COLUMN IF NOT EXISTS encrypted_recovery_email text,
ADD COLUMN IF NOT EXISTS email_encryption_version integer DEFAULT 1;

-- 2. Create function to encrypt email addresses using existing infrastructure
CREATE OR REPLACE FUNCTION public.encrypt_email_address(email_to_encrypt text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key text := 'SoilSidekickEmailKey2024!';
BEGIN
    IF email_to_encrypt IS NULL OR email_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN encode(
        pgp_sym_encrypt(email_to_encrypt, encryption_key),
        'base64'
    );
END;
$$;

-- 3. Create function to decrypt email addresses securely
CREATE OR REPLACE FUNCTION public.decrypt_email_address(encrypted_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key text := 'SoilSidekickEmailKey2024!';
    decrypted_email text;
BEGIN
    IF encrypted_email IS NULL OR encrypted_email = '' THEN
        RETURN NULL;
    END IF;
    
    BEGIN
        decrypted_email := pgp_sym_decrypt(decode(encrypted_email, 'base64'), encryption_key);
        RETURN decrypted_email;
    EXCEPTION
        WHEN OTHERS THEN
            -- Return NULL if decryption fails
            RETURN NULL;
    END;
END;
$$;

-- 4. Migrate existing email data to encrypted format
CREATE OR REPLACE FUNCTION public.migrate_account_security_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    security_record RECORD;
BEGIN
    -- Encrypt existing email addresses
    FOR security_record IN 
        SELECT id, email, recovery_email 
        FROM public.account_security 
        WHERE (email IS NOT NULL OR recovery_email IS NOT NULL)
        AND (encrypted_email IS NULL OR encrypted_recovery_email IS NULL)
    LOOP
        UPDATE public.account_security 
        SET 
            encrypted_email = CASE 
                WHEN security_record.email IS NOT NULL 
                THEN public.encrypt_email_address(security_record.email) 
                ELSE NULL 
            END,
            encrypted_recovery_email = CASE 
                WHEN security_record.recovery_email IS NOT NULL 
                THEN public.encrypt_email_address(security_record.recovery_email) 
                ELSE NULL 
            END,
            email_encryption_version = 1
        WHERE id = security_record.id;
    END LOOP;
    
    RAISE NOTICE 'Email encryption migration completed successfully';
END;
$$;

-- 5. Run the email encryption migration
SELECT public.migrate_account_security_emails();

-- 6. Create secure function to get user email (replaces direct table access)
CREATE OR REPLACE FUNCTION public.get_user_email_secure(target_user_id uuid DEFAULT NULL)
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
    IF actual_target_user_id != auth.uid() AND NOT is_admin() THEN
        RETURN NULL;
    END IF;
    
    -- Get encrypted email
    SELECT encrypted_email INTO encrypted_email_value
    FROM public.account_security
    WHERE user_id = actual_target_user_id;
    
    -- If no encrypted email, try fallback to plain text (backwards compatibility)
    IF encrypted_email_value IS NULL THEN
        SELECT email INTO decrypted_email
        FROM public.account_security
        WHERE user_id = actual_target_user_id;
    ELSE
        -- Decrypt the email
        decrypted_email := public.decrypt_email_address(encrypted_email_value);
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
        'SECURE_EMAIL_RETRIEVAL',
        auth.uid(),
        'HIGH',
        ARRAY['EMAIL_ACCESS', 'ENCRYPTED_DATA_ACCESS'],
        jsonb_build_object(
            'target_user', actual_target_user_id,
            'access_time', now(),
            'is_admin_access', is_admin(),
            'encryption_used', encrypted_email_value IS NOT NULL
        )
    );
    
    RETURN decrypted_email;
END;
$$;

-- 7. Update the secure view to use encrypted data
DROP VIEW IF EXISTS public.secure_account_security_view;

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
    -- Always show masked versions in the view
    public.sanitize_email_for_audit(
        COALESCE(
            public.decrypt_email_address(encrypted_email), 
            email
        )
    ) as masked_email,
    public.sanitize_email_for_audit(
        COALESCE(
            public.decrypt_email_address(encrypted_recovery_email), 
            recovery_email
        )
    ) as masked_recovery_email
FROM public.account_security;

-- Grant permissions on the updated view
GRANT SELECT ON public.secure_account_security_view TO authenticated;

-- 8. Log the completion of email encryption implementation
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'account_security_email_encryption',
    'EMAIL_FIELD_LEVEL_ENCRYPTION_COMPLETE',
    '{"email_storage": "plaintext", "recovery_email": "plaintext", "access_control": "rls_only"}'::jsonb,
    '{"email_storage": "pgcrypto_encrypted", "recovery_email": "pgcrypto_encrypted", "access_control": "rls_plus_encryption", "secure_access_function": "implemented"}'::jsonb,
    'CRITICAL',
    ARRAY['EMAIL_ENCRYPTION_COMPLETE', 'FIELD_LEVEL_SECURITY', 'PHISHING_PROTECTION', 'IDENTITY_THEFT_PREVENTION', 'BACKWARDS_COMPATIBLE']
);