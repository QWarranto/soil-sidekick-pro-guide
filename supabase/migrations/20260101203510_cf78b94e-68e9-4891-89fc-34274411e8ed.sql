-- Create updated encryption functions that accept key as parameter
-- This allows edge functions to pass the key from secrets

-- Update encrypt_email_v3 to accept key parameter
CREATE OR REPLACE FUNCTION public.encrypt_email_v3(email_to_encrypt text, encryption_key text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    IF email_to_encrypt IS NULL OR email_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key is required';
    END IF;
    
    RETURN encode(
        pgp_sym_encrypt(
            email_to_encrypt, 
            encryption_key,
            'cipher-algo=aes256'
        ),
        'base64'
    );
END;
$function$;

-- Update decrypt_email_v3 to accept key parameter
CREATE OR REPLACE FUNCTION public.decrypt_email_v3(encrypted_email text, encryption_key text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    decrypted_email text;
BEGIN
    IF encrypted_email IS NULL OR encrypted_email = '' THEN
        RETURN NULL;
    END IF;
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key is required';
    END IF;
    
    BEGIN
        decrypted_email := pgp_sym_decrypt(decode(encrypted_email, 'base64'), encryption_key);
        RETURN decrypted_email;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL;
    END;
END;
$function$;

-- General purpose encrypt/decrypt with key parameter
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data_v3(data_to_encrypt text, encryption_key text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    IF data_to_encrypt IS NULL OR data_to_encrypt = '' THEN
        RETURN NULL;
    END IF;
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key is required';
    END IF;
    
    RETURN encode(
        pgp_sym_encrypt(
            data_to_encrypt, 
            encryption_key,
            'cipher-algo=aes256'
        ),
        'base64'
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data_v3(encrypted_data text, encryption_key text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    decrypted_data text;
BEGIN
    IF encrypted_data IS NULL OR encrypted_data = '' THEN
        RETURN NULL;
    END IF;
    
    IF encryption_key IS NULL OR encryption_key = '' THEN
        RAISE EXCEPTION 'Encryption key is required';
    END IF;
    
    BEGIN
        decrypted_data := pgp_sym_decrypt(decode(encrypted_data, 'base64'), encryption_key);
        RETURN decrypted_data;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL;
    END;
END;
$function$;

-- Log migration completion
INSERT INTO public.security_audit_log (event_type, details, ip_address)
VALUES ('ENCRYPTION_MIGRATION_V3', 
        '{"description": "Created v3 encryption functions with key parameter for edge function integration"}',
        '0.0.0.0'::inet);