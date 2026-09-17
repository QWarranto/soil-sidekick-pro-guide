-- Step 1: Add the missing encrypted columns first
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS encrypted_stripe_customer_id text,
ADD COLUMN IF NOT EXISTS encryption_version integer DEFAULT 1;

ALTER TABLE public.adapt_integrations 
ADD COLUMN IF NOT EXISTS encrypted_api_credentials text,
ADD COLUMN IF NOT EXISTS encryption_version integer DEFAULT 1;

-- Step 2: Create simplified encryption functions that work
CREATE OR REPLACE FUNCTION public.encrypt_existing_sensitive_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    sub_record RECORD;
    integration_record RECORD;
    encryption_key text := 'SoilSidekickSecureKey2024!';
BEGIN
    -- Encrypt existing Stripe customer IDs
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
    
    -- Encrypt API credentials if any exist  
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

-- Step 3: Create secure decryption function
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
    encryption_key text := 'SoilSidekickSecureKey2024!';
BEGIN
    -- Verify ownership
    SELECT user_id, encrypted_stripe_customer_id 
    INTO sub_user_id, encrypted_value
    FROM public.subscribers 
    WHERE id = subscriber_id;
    
    IF sub_user_id != auth.uid() THEN
        RETURN NULL;
    END IF;
    
    -- Return decrypted value or fallback to plain text
    IF encrypted_value IS NOT NULL AND encrypted_value != '' THEN
        BEGIN
            result := pgp_sym_decrypt(decode(encrypted_value, 'base64'), encryption_key);
            RETURN result;
        EXCEPTION
            WHEN OTHERS THEN
                -- Fallback to plain text if decryption fails
                SELECT stripe_customer_id INTO result
                FROM public.subscribers 
                WHERE id = subscriber_id AND user_id = auth.uid();
                RETURN result;
        END;
    ELSE
        -- No encrypted value, return plain text
        SELECT stripe_customer_id INTO result
        FROM public.subscribers 
        WHERE id = subscriber_id AND user_id = auth.uid();
        RETURN result;
    END IF;
END;
$$;

-- Step 4: Run the encryption migration
SELECT public.encrypt_existing_sensitive_data();