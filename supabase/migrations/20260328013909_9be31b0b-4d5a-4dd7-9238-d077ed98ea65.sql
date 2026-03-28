-- Fix signup failure caused by unresolved pgcrypto functions in trigger path
-- Root cause: public.auto_create_sandbox_api_key() used unqualified gen_random_bytes/digest
-- while pgcrypto functions are installed in the extensions schema.

CREATE OR REPLACE FUNCTION public.auto_create_sandbox_api_key()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
    api_key TEXT;
    key_hash TEXT;
BEGIN
    -- Generate a sandbox API key for new users
    api_key := 'ak_sandbox_' || encode(extensions.gen_random_bytes(24), 'hex');
    key_hash := encode(extensions.digest(api_key, 'sha256'), 'hex');

    -- Insert the sandbox key
    INSERT INTO public.api_keys (
        user_id,
        key_name,
        key_hash,
        subscription_tier,
        rate_limit,
        rate_window_minutes,
        permissions
    ) VALUES (
        NEW.user_id,
        'Sandbox API Key (Auto-generated)',
        key_hash,
        'free',
        100,
        60,
        '{"endpoints": ["sandbox-demo", "get-soil-data"], "sandbox_only": true}'::jsonb
    );

    UPDATE public.profiles
    SET updated_at = now()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$function$;

-- Hardening: ensure shared token function resolves pgcrypto correctly too
CREATE OR REPLACE FUNCTION public.generate_secure_session_token()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
    SELECT encode(extensions.gen_random_bytes(32), 'base64');
$function$;