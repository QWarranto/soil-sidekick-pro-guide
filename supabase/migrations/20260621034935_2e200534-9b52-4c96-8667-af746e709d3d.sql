
-- 1. Drop plaintext sensitive columns
ALTER TABLE public.auth_security_log DROP COLUMN IF EXISTS email;
ALTER TABLE public.trial_users DROP COLUMN IF EXISTS email;
ALTER TABLE public.trial_creation_rate_limit DROP COLUMN IF EXISTS email;
ALTER TABLE public.adapt_integrations DROP COLUMN IF EXISTS api_credentials;

-- 2. Lock down bigfoot_autogen_queue (was public ALL → service_role only)
DROP POLICY IF EXISTS "Service role manages autogen queue" ON public.bigfoot_autogen_queue;
CREATE POLICY "Service role manages autogen queue"
  ON public.bigfoot_autogen_queue
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Lock down vendor_leads (was public ALL → service_role only)
DROP POLICY IF EXISTS "Service role manages vendor leads" ON public.vendor_leads;
CREATE POLICY "Service role manages vendor leads"
  ON public.vendor_leads
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Enable RLS on model_routing_log and add owner + admin policies
ALTER TABLE public.model_routing_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own routing logs" ON public.model_routing_log;
CREATE POLICY "Users view own routing logs"
  ON public.model_routing_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all routing logs" ON public.model_routing_log;
CREATE POLICY "Admins view all routing logs"
  ON public.model_routing_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Service role manages routing logs" ON public.model_routing_log;
CREATE POLICY "Service role manages routing logs"
  ON public.model_routing_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Replace email-domain admin check on pwa_analytics with is_admin()
DROP POLICY IF EXISTS "Admins can view all PWA analytics" ON public.pwa_analytics;
CREATE POLICY "Admins can view all PWA analytics"
  ON public.pwa_analytics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 6. Recreate active_telegram_users with security_invoker to honor caller RLS
DROP VIEW IF EXISTS public.active_telegram_users;
CREATE VIEW public.active_telegram_users
  WITH (security_invoker = true) AS
SELECT tl.telegram_id,
       tl.username,
       tl.first_name,
       tl.last_name,
       tl.linked_user_id,
       ak.id AS api_key_id,
       ak.subscription_tier,
       ak.daily_ai_count,
       ak.daily_data_count,
       ak.last_reset_date
FROM public.telegram_link tl
JOIN public.api_keys ak ON ak.id = tl.api_key_id
WHERE tl.is_active = true
  AND (tl.linked_user_id IS NOT NULL
       OR ak.subscription_tier <> 'free'
       OR ak.daily_ai_count > 0
       OR ak.daily_data_count > 0);

GRANT SELECT ON public.active_telegram_users TO authenticated;
GRANT SELECT ON public.active_telegram_users TO service_role;
