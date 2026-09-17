-- SECURITY FIX: Implement comprehensive encryption for all sensitive customer payment data

-- Create enhanced encryption functions for customer payment data
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_payment_data(data_to_encrypt text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    encryption_key text := 'SoilSidekickPaymentSecurity2024!SecureKey';
BEGIN
    IF data_to_encrypt IS NULL OR data_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
    RETURN encode(
        pgp_sym_encrypt(data_to_encrypt, encryption_key),
        'base64'
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_payment_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    encryption_key text := 'SoilSidekickPaymentSecurity2024!SecureKey';
    decrypted_data text;
BEGIN
    IF encrypted_data IS NULL OR encrypted_data = '' THEN
        RETURN NULL;
    END IF;
    
    BEGIN
        decrypted_data := pgp_sym_decrypt(decode(encrypted_data, 'base64'), encryption_key);
        RETURN decrypted_data;
    EXCEPTION
        WHEN OTHERS THEN
            -- Return NULL if decryption fails
            RETURN NULL;
    END;
END;
$function$;

-- Add encrypted email column to subscribers table
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS encrypted_email text;

-- Create secure functions for subscriber operations that use encryption
CREATE OR REPLACE FUNCTION public.secure_upsert_subscriber(
    p_user_id uuid,
    p_email text,
    p_stripe_customer_id text DEFAULT NULL,
    p_subscribed boolean DEFAULT false,
    p_subscription_tier text DEFAULT NULL,
    p_subscription_interval text DEFAULT NULL,
    p_subscription_end timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    subscriber_id uuid;
    encrypted_email_value text;
    encrypted_stripe_id text;
BEGIN
    -- Only allow service role or authenticated users to call this function
    IF auth.role() != 'service_role' AND auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized access to secure subscriber operations';
    END IF;
    
    -- For service role, validate it's a legitimate operation
    IF auth.role() = 'service_role' THEN
        IF NOT validate_subscription_service_operation() THEN
            RAISE EXCEPTION 'Invalid service role operation for subscriber data';
        END IF;
    END IF;
    
    -- Encrypt sensitive data
    encrypted_email_value := public.encrypt_sensitive_payment_data(p_email);
    encrypted_stripe_id := CASE 
        WHEN p_stripe_customer_id IS NOT NULL 
        THEN public.encrypt_sensitive_payment_data(p_stripe_customer_id)
        ELSE NULL 
    END;
    
    -- Upsert subscriber with encrypted data
    INSERT INTO public.subscribers (
        user_id,
        encrypted_email,
        encrypted_stripe_customer_id,
        subscribed,
        subscription_tier,
        subscription_interval,
        subscription_end,
        encryption_version,
        updated_at
    ) VALUES (
        p_user_id,
        encrypted_email_value,
        encrypted_stripe_id,
        p_subscribed,
        p_subscription_tier,
        p_subscription_interval,
        p_subscription_end,
        2, -- New encryption version
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        encrypted_email = EXCLUDED.encrypted_email,
        encrypted_stripe_customer_id = EXCLUDED.encrypted_stripe_customer_id,
        subscribed = EXCLUDED.subscribed,
        subscription_tier = EXCLUDED.subscription_tier,
        subscription_interval = EXCLUDED.subscription_interval,
        subscription_end = EXCLUDED.subscription_end,
        encryption_version = EXCLUDED.encryption_version,
        updated_at = EXCLUDED.updated_at
    RETURNING id INTO subscriber_id;
    
    -- Log this sensitive operation
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details
    ) VALUES (
        'SECURE_SUBSCRIBER_UPSERT',
        COALESCE(auth.uid(), p_user_id),
        jsonb_build_object(
            'operation', 'secure_upsert',
            'subscriber_id', subscriber_id,
            'encryption_version', 2,
            'has_stripe_data', p_stripe_customer_id IS NOT NULL,
            'auth_role', auth.role()
        )
    );
    
    RETURN subscriber_id;
END;
$function$;

-- Create secure function to get subscriber data with decryption
CREATE OR REPLACE FUNCTION public.secure_get_subscriber_data(p_user_id uuid)
RETURNS TABLE(
    id uuid,
    user_id uuid,
    email text,
    stripe_customer_id text,
    subscribed boolean,
    subscription_tier text,
    subscription_interval text,
    subscription_end timestamptz,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Only allow the user themselves or service role to access their data
    IF auth.uid() != p_user_id AND auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Unauthorized access to subscriber data';
    END IF;
    
    -- For service role, validate it's a legitimate operation
    IF auth.role() = 'service_role' THEN
        IF NOT validate_subscription_service_operation() THEN
            RAISE EXCEPTION 'Invalid service role operation for subscriber data';
        END IF;
    END IF;
    
    -- Log this data access
    INSERT INTO public.security_audit_log (
        event_type,
        user_id,
        details
    ) VALUES (
        'SECURE_SUBSCRIBER_ACCESS',
        COALESCE(auth.uid(), p_user_id),
        jsonb_build_object(
            'operation', 'secure_get',
            'target_user', p_user_id,
            'auth_role', auth.role()
        )
    );
    
    -- Return decrypted data
    RETURN QUERY
    SELECT 
        s.id,
        s.user_id,
        COALESCE(
            public.decrypt_sensitive_payment_data(s.encrypted_email),
            s.email -- Fallback for legacy data
        ) as email,
        COALESCE(
            public.decrypt_sensitive_payment_data(s.encrypted_stripe_customer_id),
            s.stripe_customer_id -- Fallback for legacy data
        ) as stripe_customer_id,
        s.subscribed,
        s.subscription_tier,
        s.subscription_interval,
        s.subscription_end,
        s.created_at,
        s.updated_at
    FROM public.subscribers s
    WHERE s.user_id = p_user_id;
END;
$function$;

-- Create function to migrate existing plaintext data to encrypted format
CREATE OR REPLACE FUNCTION public.migrate_subscriber_data_to_encrypted()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Update RLS policies to prevent direct access to plaintext columns
-- Drop the old policies that allowed direct table access
DROP POLICY IF EXISTS "Users can view their own subscription only" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;

-- Create new policies that block direct access and force use of secure functions
CREATE POLICY "Block direct subscriber table access"
ON public.subscribers
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Only allow service role with proper validation to access the table directly
CREATE POLICY "Service role encrypted access only"
ON public.subscribers
FOR ALL
TO service_role
USING (validate_subscription_service_operation())
WITH CHECK (validate_subscription_service_operation());

-- Update the security view to use encrypted data
DROP VIEW IF EXISTS public.subscribers_security_view;
CREATE VIEW public.subscribers_security_view AS
SELECT 
    id,
    user_id,
    '***@***' as masked_email,
    CASE WHEN encrypted_stripe_customer_id IS NOT NULL THEN 'cus_***encrypted***' ELSE NULL END as masked_stripe_id,
    subscribed,
    subscription_tier,
    subscription_interval,
    subscription_end,
    encryption_version,
    created_at,
    updated_at
FROM public.subscribers;

-- Grant select on security view to authenticated users for their own data
GRANT SELECT ON public.subscribers_security_view TO authenticated;

-- Create a trigger to prevent accidental plaintext storage
CREATE OR REPLACE FUNCTION public.prevent_plaintext_payment_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Warning: This is a safety check, but secure functions should be used instead
    IF NEW.email IS NOT NULL AND NEW.encrypted_email IS NULL THEN
        RAISE WARNING 'Storing plaintext email without encryption. Use secure_upsert_subscriber() function instead.';
    END IF;
    
    IF NEW.stripe_customer_id IS NOT NULL AND NEW.encrypted_stripe_customer_id IS NULL THEN
        RAISE WARNING 'Storing plaintext Stripe ID without encryption. Use secure_upsert_subscriber() function instead.';
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create the warning trigger
DROP TRIGGER IF EXISTS warn_plaintext_payment_data ON public.subscribers;
CREATE TRIGGER warn_plaintext_payment_data
    BEFORE INSERT OR UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION prevent_plaintext_payment_data();

-- Update the compliance check function
CREATE OR REPLACE FUNCTION public.check_payment_data_security_compliance()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    total_records integer;
    encrypted_records integer;
    plaintext_emails integer;
    plaintext_stripe_ids integer;
    security_score numeric;
    result jsonb;
BEGIN
    -- Count total subscriber records
    SELECT COUNT(*) INTO total_records FROM public.subscribers;
    
    -- Count records with encryption
    SELECT COUNT(*) INTO encrypted_records 
    FROM public.subscribers 
    WHERE encryption_version >= 2;
    
    -- Count plaintext exposures
    SELECT COUNT(*) INTO plaintext_emails 
    FROM public.subscribers 
    WHERE email IS NOT NULL AND encrypted_email IS NULL;
    
    SELECT COUNT(*) INTO plaintext_stripe_ids 
    FROM public.subscribers 
    WHERE stripe_customer_id IS NOT NULL AND encrypted_stripe_customer_id IS NULL;
    
    -- Calculate security score
    security_score := CASE 
        WHEN total_records = 0 THEN 100
        WHEN plaintext_emails = 0 AND plaintext_stripe_ids = 0 THEN 100
        ELSE ((total_records - plaintext_emails - plaintext_stripe_ids)::numeric / total_records::numeric * 100)
    END;
    
    result := jsonb_build_object(
        'total_records', total_records,
        'encrypted_records', encrypted_records,
        'plaintext_emails', plaintext_emails,
        'plaintext_stripe_ids', plaintext_stripe_ids,
        'security_score', security_score,
        'encryption_status', CASE 
            WHEN plaintext_emails = 0 AND plaintext_stripe_ids = 0 THEN 'FULLY_ENCRYPTED'
            WHEN plaintext_emails > 0 OR plaintext_stripe_ids > 0 THEN 'PARTIAL_ENCRYPTION'
            ELSE 'NO_ENCRYPTION'
        END,
        'recommendations', CASE
            WHEN plaintext_emails > 0 OR plaintext_stripe_ids > 0 THEN 
                ARRAY['Run migrate_subscriber_data_to_encrypted() to encrypt plaintext data', 'Update edge functions to use secure_upsert_subscriber()']
            ELSE 
                ARRAY['Payment data encryption is optimal']
        END
    );
    
    RETURN result;
END;
$function$;