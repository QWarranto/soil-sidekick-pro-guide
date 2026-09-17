-- Continue fixing search_path for remaining database functions

-- Fix get_user_email_securely function
DROP FUNCTION IF EXISTS public.get_user_email_securely(uuid);
CREATE OR REPLACE FUNCTION public.get_user_email_securely(target_user_id uuid DEFAULT NULL::uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix get_user_email_for_security function  
DROP FUNCTION IF EXISTS public.get_user_email_for_security(uuid);
CREATE OR REPLACE FUNCTION public.get_user_email_for_security(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix migrate_subscriber_data_to_encrypted function
DROP FUNCTION IF EXISTS public.migrate_subscriber_data_to_encrypted();
CREATE OR REPLACE FUNCTION public.migrate_subscriber_data_to_encrypted()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    record_count integer := 0;
    subscriber_record RECORD;
BEGIN
    -- Only allow admins to run this migration
    IF NOT public.is_admin() AND auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Only administrators can run data migration';
    END IF;
    
    -- Migrate existing plaintext data to encrypted format
    FOR subscriber_record IN 
        SELECT id, email, stripe_customer_id 
        FROM public.subscribers 
        WHERE (encrypted_email IS NULL AND email IS NOT NULL) 
           OR (encrypted_stripe_customer_id IS NULL AND stripe_customer_id IS NOT NULL)
    LOOP
        UPDATE public.subscribers 
        SET 
            encrypted_email = CASE 
                WHEN subscriber_record.email IS NOT NULL 
                THEN public.encrypt_sensitive_payment_data(subscriber_record.email) 
                ELSE encrypted_email 
            END,
            encrypted_stripe_customer_id = CASE 
                WHEN subscriber_record.stripe_customer_id IS NOT NULL 
                THEN public.encrypt_sensitive_payment_data(subscriber_record.stripe_customer_id) 
                ELSE encrypted_stripe_customer_id 
            END,
            encryption_version = 2,
            updated_at = now()
        WHERE id = subscriber_record.id;
        
        record_count := record_count + 1;
    END LOOP;
    
    -- Log the migration
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details
    ) VALUES (
        'PAYMENT_DATA_ENCRYPTION_MIGRATION',
        auth.uid(),
        jsonb_build_object(
            'records_migrated', record_count,
            'migration_time', now()
        )
    );
    
    RETURN record_count;
END;
$function$;

-- Add audit log
INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
) VALUES (
    'SECURITY_POLICY_UPDATE',
    NULL,
    jsonb_build_object(
        'change', 'Fixed search_path parameter for more database functions',
        'reason', 'Prevent search path manipulation attacks - batch 2',
        'functions_updated', ARRAY['get_user_email_securely', 'get_user_email_for_security', 'migrate_subscriber_data_to_encrypted'],
        'timestamp', now()
    )
);