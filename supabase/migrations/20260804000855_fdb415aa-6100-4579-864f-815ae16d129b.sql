-- 1. Exception-safe signup side-effects
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, subscription_tier)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
      'free'
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: profile insert failed for %: %', NEW.id, SQLERRM;
  END;

  BEGIN
    INSERT INTO public.account_security (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: account_security insert failed for %: %', NEW.id, SQLERRM;
  END;

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
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'auto_create_sandbox_api_key: failed for %: %', NEW.user_id, SQLERRM;
    END;

    RETURN NEW;
END;
$function$;

-- 2. RLS on model config tables
ALTER TABLE public.model_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_task_types ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.model_capabilities FROM anon;
REVOKE ALL ON public.model_task_types FROM anon;
GRANT SELECT ON public.model_capabilities TO authenticated;
GRANT SELECT ON public.model_task_types TO authenticated;
GRANT ALL ON public.model_capabilities TO service_role;
GRANT ALL ON public.model_task_types TO service_role;

DROP POLICY IF EXISTS "Authenticated users can read model capabilities" ON public.model_capabilities;
CREATE POLICY "Authenticated users can read model capabilities"
  ON public.model_capabilities FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admins can manage model capabilities" ON public.model_capabilities;
CREATE POLICY "Admins can manage model capabilities"
  ON public.model_capabilities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can read model task types" ON public.model_task_types;
CREATE POLICY "Authenticated users can read model task types"
  ON public.model_task_types FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admins can manage model task types" ON public.model_task_types;
CREATE POLICY "Admins can manage model task types"
  ON public.model_task_types FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Remove spoofable anon policy on telegram_link
DROP POLICY IF EXISTS "telegram_webhook_own_link" ON public.telegram_link;
REVOKE ALL ON public.telegram_link FROM anon;

-- 4. Regular view runs as invoker
ALTER VIEW public.developer_activity_daily SET (security_invoker = true);

-- 5. Materialized views cannot enforce RLS: restrict to service_role only
REVOKE ALL ON public.telemetry_dashboard FROM anon, authenticated;
REVOKE ALL ON public.cost_summary FROM anon, authenticated;
REVOKE ALL ON public.usage_summary FROM anon, authenticated;
GRANT SELECT ON public.telemetry_dashboard TO service_role;
GRANT SELECT ON public.cost_summary TO service_role;
GRANT SELECT ON public.usage_summary TO service_role;