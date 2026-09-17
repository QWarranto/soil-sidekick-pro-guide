-- =========================================================
-- 1. managed_assets: add is_public + public-read policy
-- =========================================================
ALTER TABLE public.managed_assets
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS managed_assets_is_public_idx
  ON public.managed_assets(is_public) WHERE is_public = true;

DROP POLICY IF EXISTS "Public assets are viewable by anyone" ON public.managed_assets;
CREATE POLICY "Public assets are viewable by anyone"
  ON public.managed_assets
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_deleted = false);

-- =========================================================
-- 2. Dual-meter columns on api_keys (promotes pending migration)
-- =========================================================
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS daily_ai_count integer DEFAULT 0;
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS daily_data_count integer DEFAULT 0;
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS monthly_alert_count integer DEFAULT 0;
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS last_reset_date date DEFAULT CURRENT_DATE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='api_keys' AND column_name='daily_call_count'
  ) THEN
    EXECUTE 'UPDATE public.api_keys
               SET daily_ai_count = daily_call_count
             WHERE daily_ai_count = 0
               AND daily_call_count IS NOT NULL
               AND daily_call_count > 0';
  END IF;
END $$;

DO $$ BEGIN PERFORM cron.unschedule('reset-daily-usage-dual-meter'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
SELECT cron.schedule(
  'reset-daily-usage-dual-meter',
  '0 0 * * *',
  $$UPDATE public.api_keys
       SET daily_ai_count = 0,
           daily_data_count = 0,
           last_reset_date = CURRENT_DATE
     WHERE last_reset_date < CURRENT_DATE;$$
);

DO $$ BEGIN PERFORM cron.unschedule('reset-monthly-alerts'); EXCEPTION WHEN OTHERS THEN NULL; END $$;
SELECT cron.schedule(
  'reset-monthly-alerts',
  '0 0 1 * *',
  $$UPDATE public.api_keys SET monthly_alert_count = 0;$$
);