-- Step 2: Run the encryption migration and complete security hardening

-- Execute the encryption migration
SELECT public.encrypt_existing_sensitive_data();

-- Create additional security policies for the secure_api_credentials table
-- (Note: the table and policies were created in the previous migration)

-- Add a function to safely store new encrypted API credentials
CREATE OR REPLACE FUNCTION public.store_encrypted_api_credentials(
    p_integration_id uuid,
    p_credential_type text,
    p_credentials_data text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key text;
    encrypted_data text;
BEGIN
    -- Only allow users to store their own credentials
    IF NOT EXISTS (
        SELECT 1 FROM public.adapt_integrations 
        WHERE id = p_integration_id AND user_id = auth.uid()
    ) THEN
        RETURN false;
    END IF;
    
    -- Generate encryption key
    encryption_key := encode(digest('soil_sidekick_migration_key_2024', 'sha256'), 'base64');
    
    -- Encrypt the credentials
    encrypted_data := encode(
        pgp_sym_encrypt(p_credentials_data, encryption_key),
        'base64'
    );
    
    -- Store in secure table
    INSERT INTO public.secure_api_credentials (
        user_id,
        integration_id,
        credential_type,
        encrypted_value
    ) VALUES (
        auth.uid(),
        p_integration_id,
        p_credential_type,
        encrypted_data
    )
    ON CONFLICT (user_id, integration_id, credential_type)
    DO UPDATE SET 
        encrypted_value = EXCLUDED.encrypted_value,
        updated_at = now();
    
    RETURN true;
END;
$$;

-- Create function to securely retrieve API credentials
CREATE OR REPLACE FUNCTION public.get_decrypted_api_credentials(
    p_integration_id uuid,
    p_credential_type text DEFAULT 'api_credentials'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    result text;
    encrypted_value text;
    encryption_key text;
BEGIN
    -- Update access tracking and get encrypted value
    UPDATE public.secure_api_credentials 
    SET last_accessed = now(), 
        access_count = access_count + 1
    WHERE integration_id = p_integration_id 
    AND credential_type = p_credential_type
    AND user_id = auth.uid()
    RETURNING encrypted_value INTO encrypted_value;
    
    -- If no secure credentials found, try the legacy column
    IF encrypted_value IS NULL THEN
        SELECT encrypted_api_credentials INTO encrypted_value
        FROM public.adapt_integrations
        WHERE id = p_integration_id AND user_id = auth.uid();
        
        -- If still no encrypted value, try plain text (backwards compatibility)
        IF encrypted_value IS NULL THEN
            SELECT api_credentials::text INTO result
            FROM public.adapt_integrations
            WHERE id = p_integration_id AND user_id = auth.uid();
            RETURN result;
        END IF;
    END IF;
    
    -- Decrypt the credentials
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

-- Log the completion of encryption implementation
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'payment_and_api_security',
    'ENCRYPTION_IMPLEMENTATION_COMPLETE',
    '{"stripe_customer_ids": "plaintext", "api_credentials": "jsonb_plaintext", "cache_access": "public"}'::jsonb,
    '{"stripe_customer_ids": "encrypted_pgcrypto", "api_credentials": "secure_table_encrypted", "cache_access": "authenticated_only", "access_functions": "created"}'::jsonb,
    'CRITICAL',
    ARRAY['PAYMENT_DATA_ENCRYPTED', 'API_CREDENTIALS_SECURED', 'CACHE_ACCESS_CONTROLLED', 'BACKWARDS_COMPATIBLE']
);