-- Step 1: Create the encryption infrastructure that was missing
-- Enable pgcrypto extension first
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the encryption function that was missing
CREATE OR REPLACE FUNCTION public.encrypt_existing_sensitive_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    sub_record RECORD;
    integration_record RECORD;
    encryption_key text;
BEGIN
    -- Simple encryption key generation for existing data migration
    encryption_key := encode(digest('soil_sidekick_migration_key_2024', 'sha256'), 'base64');
    
    -- Encrypt existing Stripe customer IDs if they exist
    FOR sub_record IN 
        SELECT id, stripe_customer_id 
        FROM public.subscribers 
        WHERE stripe_customer_id IS NOT NULL 
        AND (encrypted_stripe_customer_id IS NULL OR encrypted_stripe_customer_id = '')
    LOOP
        UPDATE public.subscribers 
        SET encrypted_stripe_customer_id = encode(
                pgp_sym_encrypt(sub_record.stripe_customer_id, encryption_key),
                'base64'
            ),
            encryption_version = 1
        WHERE id = sub_record.id;
    END LOOP;
    
    -- Handle API credentials if any exist
    FOR integration_record IN 
        SELECT id, user_id, api_credentials 
        FROM public.adapt_integrations 
        WHERE api_credentials IS NOT NULL
        AND (encrypted_api_credentials IS NULL OR encrypted_api_credentials = '')
    LOOP
        UPDATE public.adapt_integrations 
        SET encrypted_api_credentials = encode(
                pgp_sym_encrypt(integration_record.api_credentials::text, encryption_key),
                'base64'
            ),
            encryption_version = 1
        WHERE id = integration_record.id;
    END LOOP;
    
    RAISE NOTICE 'Encryption migration completed successfully';
END;
$$;

-- Create secure decryption function for Stripe customer IDs
CREATE OR REPLACE FUNCTION public.get_decrypted_stripe_customer_id(subscriber_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    result text;
    encrypted_value text;
    sub_user_id uuid;
    encryption_key text;
BEGIN
    -- Check if user owns this subscription
    SELECT user_id, encrypted_stripe_customer_id 
    INTO sub_user_id, encrypted_value
    FROM public.subscribers 
    WHERE id = subscriber_id;
    
    IF sub_user_id != auth.uid() THEN
        RETURN NULL; -- Access denied
    END IF;
    
    -- If no encrypted value, return the plain text value (backwards compatibility)
    IF encrypted_value IS NULL THEN
        SELECT stripe_customer_id INTO result
        FROM public.subscribers 
        WHERE id = subscriber_id AND user_id = auth.uid();
        RETURN result;
    END IF;
    
    -- Decrypt the value
    encryption_key := encode(digest('soil_sidekick_migration_key_2024', 'sha256'), 'base64');
    
    BEGIN
        result := pgp_sym_decrypt(decode(encrypted_value, 'base64'), encryption_key);
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL; -- Decryption failed
    END;
    
    RETURN result;
END;
$$;

-- Fix cache table security (completing previous fix)
DROP POLICY IF EXISTS "Service can manage cache data" ON public.fips_data_cache;
DROP POLICY IF EXISTS "Cache data is publicly readable" ON public.fips_data_cache;

ALTER TABLE public.fips_data_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read cache data"
ON public.fips_data_cache
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage cache data"
ON public.fips_data_cache
FOR ALL
USING (auth.role() = 'service_role');