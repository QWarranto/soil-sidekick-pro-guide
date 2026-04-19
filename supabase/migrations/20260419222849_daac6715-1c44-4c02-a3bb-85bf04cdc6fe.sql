
CREATE TABLE public.endpoint_activity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  requests INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0,
  rate_limited INTEGER NOT NULL DEFAULT 0,
  avg_ms NUMERIC,
  p95_ms NUMERIC,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_eas_window ON public.endpoint_activity_snapshots (window_end DESC);
CREATE INDEX idx_eas_channel_window ON public.endpoint_activity_snapshots (channel, window_end DESC);

ALTER TABLE public.endpoint_activity_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view endpoint snapshots"
ON public.endpoint_activity_snapshots FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Service role can insert endpoint snapshots"
ON public.endpoint_activity_snapshots FOR INSERT
TO service_role
WITH CHECK (true);

CREATE TABLE public.endpoint_digest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipients TEXT[] NOT NULL,
  window_hours INTEGER NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_failures INTEGER NOT NULL DEFAULT 0,
  total_rate_limited INTEGER NOT NULL DEFAULT 0,
  channels_summary JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'sent',
  error TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_edl_sent_at ON public.endpoint_digest_log (sent_at DESC);

ALTER TABLE public.endpoint_digest_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view digest log"
ON public.endpoint_digest_log FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Service role can insert digest log"
ON public.endpoint_digest_log FOR INSERT
TO service_role
WITH CHECK (true);
