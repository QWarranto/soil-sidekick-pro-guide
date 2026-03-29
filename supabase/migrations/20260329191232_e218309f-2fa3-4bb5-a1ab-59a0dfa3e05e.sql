-- 1. Fix is_service_role() to actually check the role
CREATE OR REPLACE FUNCTION public.is_service_role()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT (SELECT auth.role()) = 'service_role';
$$;

-- 2. Add user_id to sensor_devices for ownership scoping
ALTER TABLE public.sensor_devices ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Fix sensor_devices SELECT policy to scope by user
DROP POLICY IF EXISTS "Authenticated users can view sensor devices" ON public.sensor_devices;
CREATE POLICY "Users can view own sensor devices"
  ON public.sensor_devices FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 4. Fix sensor_readings SELECT policy (scope via device ownership)
DROP POLICY IF EXISTS "Authenticated users can view sensor readings" ON public.sensor_readings;
CREATE POLICY "Users can view own sensor readings"
  ON public.sensor_readings FOR SELECT TO authenticated
  USING (
    device_id IN (SELECT device_id FROM public.sensor_devices WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- 5. Fix sensor_alerts SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view sensor alerts" ON public.sensor_alerts;
CREATE POLICY "Users can view own sensor alerts"
  ON public.sensor_alerts FOR SELECT TO authenticated
  USING (
    device_id IN (SELECT device_id FROM public.sensor_devices WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- 6. Fix sensor_audit_log SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view sensor audit log" ON public.sensor_audit_log;
CREATE POLICY "Users can view own sensor audit log"
  ON public.sensor_audit_log FOR SELECT TO authenticated
  USING (
    device_id IN (SELECT device_id FROM public.sensor_devices WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- 7. Remove anon SELECT policy on affiliate_codes
DROP POLICY IF EXISTS "Public can read active affiliate codes" ON public.affiliate_codes;

-- 8. Fix county_search_sessions policies to remove user_id IS NULL bypass
DROP POLICY IF EXISTS "Users can view their own search sessions" ON public.county_search_sessions;
CREATE POLICY "Users can view their own search sessions"
  ON public.county_search_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own search sessions" ON public.county_search_sessions;
CREATE POLICY "Users can update their own search sessions"
  ON public.county_search_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own search sessions" ON public.county_search_sessions;
CREATE POLICY "Users can delete their own search sessions"
  ON public.county_search_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 9. Fix SECURITY DEFINER search_path for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );

  INSERT INTO public.account_security (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 10. Fix SECURITY DEFINER search_path for auto_create_sandbox_api_key
CREATE OR REPLACE FUNCTION public.auto_create_sandbox_api_key()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
    api_key TEXT;
    key_hash TEXT;
BEGIN
    api_key := 'ak_sandbox_' || encode(extensions.gen_random_bytes(24), 'hex');
    key_hash := encode(extensions.digest(api_key, 'sha256'), 'hex');

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
$$;