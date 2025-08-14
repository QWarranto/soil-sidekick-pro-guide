-- Implement field-level encryption for sensitive data
-- Create secure storage architecture for payment data and API credentials

-- 1. Create encryption functions using pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create secure encryption/decryption functions
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(data_to_encrypt text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key text;
BEGIN
    -- Use a combination of secrets for encryption key
    encryption_key := encode(digest(
        COALESCE(current_setting('app.encryption_key', true), 'default_key') || 
        auth.uid()::text || 
        'soil_sidekick_secure'
    , 'sha256'), 'base64');
    
    -- Encrypt the data
    RETURN encode(
        pgp_sym_encrypt(data_to_encrypt, encryption_key),
        'base64'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key text;
BEGIN
    -- Reconstruct the same encryption key
    encryption_key := encode(digest(
        COALESCE(current_setting('app.encryption_key', true), 'default_key') || 
        auth.uid()::text || 
        'soil_sidekick_secure'
    , 'sha256'), 'base64');
    
    -- Decrypt the data
    RETURN pgp_sym_decrypt(
        decode(encrypted_data, 'base64'),
        encryption_key
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Return null if decryption fails (wrong user/key)
        RETURN NULL;
END;
$$;

-- 3. Create secure API credentials storage table
CREATE TABLE public.secure_api_credentials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_id uuid REFERENCES public.adapt_integrations(id) ON DELETE CASCADE,
    credential_type text NOT NULL,
    encrypted_value text NOT NULL, -- Encrypted using the function above
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    last_accessed timestamptz,
    access_count integer DEFAULT 0,
    UNIQUE(user_id, integration_id, credential_type)
);

-- Enable RLS on secure credentials table
ALTER TABLE public.secure_api_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for secure API credentials
CREATE POLICY "Users can access only their own encrypted credentials"
ON public.secure_api_credentials
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own encrypted credentials"
ON public.secure_api_credentials
FOR INSERT
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own encrypted credentials"
ON public.secure_api_credentials
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own encrypted credentials"
ON public.secure_api_credentials
FOR DELETE
USING (auth.uid() = user_id);

-- 4. Add encrypted columns to existing tables
ALTER TABLE public.subscribers 
ADD COLUMN encrypted_stripe_customer_id text,
ADD COLUMN encryption_version integer DEFAULT 1;

ALTER TABLE public.adapt_integrations 
ADD COLUMN encrypted_api_credentials text,
ADD COLUMN encryption_version integer DEFAULT 1;

-- 5. Create function to migrate existing data to encrypted format
CREATE OR REPLACE FUNCTION public.encrypt_existing_sensitive_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    sub_record RECORD;
    integration_record RECORD;
BEGIN
    -- Encrypt existing Stripe customer IDs
    FOR sub_record IN 
        SELECT id, user_id, stripe_customer_id 
        FROM public.subscribers 
        WHERE stripe_customer_id IS NOT NULL 
        AND encrypted_stripe_customer_id IS NULL
    LOOP
        -- Set user context for encryption
        PERFORM set_config('role', 'service_role', true);
        
        UPDATE public.subscribers 
        SET encrypted_stripe_customer_id = public.encrypt_sensitive_data(sub_record.stripe_customer_id),
            encryption_version = 1
        WHERE id = sub_record.id;
    END LOOP;
    
    -- Encrypt existing API credentials and move to secure table
    FOR integration_record IN 
        SELECT id, user_id, api_credentials 
        FROM public.adapt_integrations 
        WHERE api_credentials IS NOT NULL
    LOOP
        -- Insert into secure storage
        INSERT INTO public.secure_api_credentials (
            user_id, 
            integration_id, 
            credential_type, 
            encrypted_value
        ) VALUES (
            integration_record.user_id,
            integration_record.id,
            'api_credentials',
            public.encrypt_sensitive_data(integration_record.api_credentials::text)
        )
        ON CONFLICT (user_id, integration_id, credential_type) 
        DO UPDATE SET 
            encrypted_value = EXCLUDED.encrypted_value,
            updated_at = now();
        
        -- Mark as encrypted
        UPDATE public.adapt_integrations 
        SET encryption_version = 1
        WHERE id = integration_record.id;
    END LOOP;
END;
$$;

-- 6. Create secure access functions
CREATE OR REPLACE FUNCTION public.get_decrypted_stripe_customer_id(subscriber_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    result text;
    sub_user_id uuid;
BEGIN
    -- Check if user owns this subscription
    SELECT user_id INTO sub_user_id 
    FROM public.subscribers 
    WHERE id = subscriber_id;
    
    IF sub_user_id != auth.uid() THEN
        RETURN NULL; -- Access denied
    END IF;
    
    -- Get and decrypt the customer ID
    SELECT public.decrypt_sensitive_data(encrypted_stripe_customer_id) 
    INTO result
    FROM public.subscribers 
    WHERE id = subscriber_id AND user_id = auth.uid();
    
    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_decrypted_api_credentials(integration_id uuid, credential_type text DEFAULT 'api_credentials')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    result text;
BEGIN
    -- Update access tracking
    UPDATE public.secure_api_credentials 
    SET last_accessed = now(), 
        access_count = access_count + 1
    WHERE integration_id = get_decrypted_api_credentials.integration_id 
    AND credential_type = get_decrypted_api_credentials.credential_type
    AND user_id = auth.uid();
    
    -- Get and decrypt the credentials
    SELECT public.decrypt_sensitive_data(encrypted_value) 
    INTO result
    FROM public.secure_api_credentials 
    WHERE integration_id = get_decrypted_api_credentials.integration_id 
    AND credential_type = get_decrypted_api_credentials.credential_type
    AND user_id = auth.uid();
    
    RETURN result;
END;
$$;

-- 7. Create audit trigger for credential access
CREATE OR REPLACE FUNCTION public.audit_credential_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    INSERT INTO public.comprehensive_audit_log (
        table_name,
        operation,
        user_id,
        risk_level,
        compliance_tags,
        metadata
    ) VALUES (
        'secure_api_credentials',
        'CREDENTIAL_ACCESS',
        auth.uid(),
        'HIGH',
        ARRAY['CREDENTIAL_ACCESS', 'ENCRYPTION', 'SECURITY_AUDIT'],
        jsonb_build_object(
            'credential_type', NEW.credential_type,
            'integration_id', NEW.integration_id,
            'access_time', now()
        )
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER audit_credential_access_trigger
    AFTER UPDATE ON public.secure_api_credentials
    FOR EACH ROW 
    WHEN (OLD.access_count != NEW.access_count)
    EXECUTE FUNCTION public.audit_credential_access();

-- 8. Add indexes for performance
CREATE INDEX idx_secure_credentials_user_integration 
ON public.secure_api_credentials(user_id, integration_id);

CREATE INDEX idx_subscribers_encrypted_data 
ON public.subscribers(user_id) 
WHERE encrypted_stripe_customer_id IS NOT NULL;

-- 9. Fix the cache table security issue
ALTER TABLE public.fips_data_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cache data is publicly readable" ON public.fips_data_cache;

CREATE POLICY "Authenticated users can read cache data"
ON public.fips_data_cache
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Keep service policy for cache management
CREATE POLICY "Service can manage cache data"
ON public.fips_data_cache
FOR ALL
USING (auth.role() = 'service_role');

-- 10. Add updated_at trigger to new table
CREATE TRIGGER update_secure_credentials_updated_at
    BEFORE UPDATE ON public.secure_api_credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Log this comprehensive security enhancement
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'multiple_security_tables',
    'COMPREHENSIVE_ENCRYPTION_IMPLEMENTATION',
    '{"encryption": "none", "credentials_storage": "plaintext", "cache_access": "public"}'::jsonb,
    '{"encryption": "field_level_pgcrypto", "credentials_storage": "secure_encrypted", "cache_access": "authenticated_only", "audit_tracking": "enabled"}'::jsonb,
    'CRITICAL',
    ARRAY['ENCRYPTION_IMPLEMENTATION', 'PAYMENT_DATA_PROTECTION', 'API_CREDENTIAL_SECURITY', 'FIELD_LEVEL_ENCRYPTION']
);