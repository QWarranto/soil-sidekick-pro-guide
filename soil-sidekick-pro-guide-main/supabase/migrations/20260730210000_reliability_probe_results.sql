-- Synthetic reliability monitor results table
-- Stores probe outcomes from the reliability-monitor Edge Function

CREATE TABLE IF NOT EXISTS public.reliability_probe_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  probe_name text NOT NULL,
  target_function text NOT NULL,
  status_code integer,
  latency_ms integer,
  success boolean NOT NULL,
  failure_stage text, -- 'auth', 'downstream', 'timeout', 'network', 'http_error'
  error_message text,
  response_preview text
);

-- Fast time-range queries for dashboard / alerting
CREATE INDEX IF NOT EXISTS idx_reliability_probe_results_created_at
  ON public.reliability_probe_results(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reliability_probe_results_probe_name
  ON public.reliability_probe_results(probe_name, created_at DESC);

-- Daily summary view for quick health checks
CREATE OR REPLACE VIEW public.v_reliability_daily_summary AS
SELECT
  probe_name,
  target_function,
  date_trunc('hour', created_at) as hour_bucket,
  COUNT(1) as total_requests,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failure_count,
  AVG(latency_ms)::int as avg_latency_ms,
  MAX(latency_ms) as max_latency_ms,
  MODE() WITHIN GROUP (ORDER BY failure_stage) as dominant_failure_stage
FROM public.reliability_probe_results
WHERE created_at > now() - interval '7 days'
GROUP BY probe_name, target_function, date_trunc('hour', created_at)
ORDER BY hour_bucket DESC, probe_name;
