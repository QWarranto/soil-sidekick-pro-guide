DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'free'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.account_security (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_create_sandbox_api_key()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    api_key TEXT;
    key_hash TEXT;
BEGIN
    IF EXISTS (
      SELECT 1 FROM public.api_keys
      WHERE user_id = NEW.user_id
        AND key_name = 'Sandbox API Key (Auto-generated)'
    ) THEN
      RETURN NEW;
    END IF;

    api_key := 'ak_sandbox_' || encode(extensions.gen_random_bytes(24), 'hex');
    key_hash := encode(extensions.digest(api_key, 'sha256'), 'hex');

    INSERT INTO public.api_keys (
        user_id, key_name, key_hash, subscription_tier,
        rate_limit, rate_window_minutes, permissions
    ) VALUES (
        NEW.user_id,
        'Sandbox API Key (Auto-generated)',
        key_hash,
        'free',
        100,
        60,
        '{"endpoints": ["sandbox-demo", "get-soil-data"], "sandbox_only": true}'::jsonb
    );

    RETURN NEW;
END;
$function$;