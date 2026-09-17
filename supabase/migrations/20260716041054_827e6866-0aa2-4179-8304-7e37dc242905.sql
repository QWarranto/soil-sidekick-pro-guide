
-- 1. Cohort-attribution columns on mcp_tool_call_log
ALTER TABLE public.mcp_tool_call_log
  ADD COLUMN IF NOT EXISTS client_instance_id text,
  ADD COLUMN IF NOT EXISTS sdk text;

CREATE INDEX IF NOT EXISTS idx_mcp_tool_call_log_keyhash_created
  ON public.mcp_tool_call_log (api_key_hash, created_at DESC)
  WHERE api_key_hash IS NOT NULL AND success = true;

CREATE INDEX IF NOT EXISTS idx_mcp_tool_call_log_instance
  ON public.mcp_tool_call_log (client_instance_id)
  WHERE client_instance_id IS NOT NULL;

-- 2. Auto-emit developer funnel events on tool-call insert
CREATE OR REPLACE FUNCTION public.emit_developer_funnel_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count bigint;
  v_distinct_tools bigint;
  v_source text;
BEGIN
  -- Only successful, keyed calls contribute to developer milestones
  IF NEW.success IS DISTINCT FROM true OR NEW.api_key_hash IS NULL THEN
    RETURN NEW;
  END IF;

  v_source := COALESCE(NEW.access_source, 'unknown');

  SELECT count(*) INTO v_count
    FROM public.mcp_tool_call_log
   WHERE api_key_hash = NEW.api_key_hash AND success = true;

  IF v_count = 1 THEN
    INSERT INTO public.conversion_funnel (event_type, source_channel, metadata)
    VALUES ('first_api_call', v_source,
            jsonb_build_object('api_key_hash', NEW.api_key_hash,
                               'tool', NEW.tool_name,
                               'sdk', NEW.sdk,
                               'client_instance_id', NEW.client_instance_id));
  ELSIF v_count = 10 THEN
    INSERT INTO public.conversion_funnel (event_type, source_channel, metadata)
    VALUES ('tenth_api_call', v_source,
            jsonb_build_object('api_key_hash', NEW.api_key_hash, 'sdk', NEW.sdk));
  ELSIF v_count = 100 THEN
    INSERT INTO public.conversion_funnel (event_type, source_channel, metadata)
    VALUES ('hundredth_api_call', v_source,
            jsonb_build_object('api_key_hash', NEW.api_key_hash, 'sdk', NEW.sdk));
  END IF;

  -- Adoption-breadth milestone: first time this developer has used 3+ distinct tools
  SELECT count(DISTINCT tool_name) INTO v_distinct_tools
    FROM public.mcp_tool_call_log
   WHERE api_key_hash = NEW.api_key_hash AND success = true;

  IF v_distinct_tools = 3 THEN
    -- Only insert if we haven't already recorded this milestone for the key
    IF NOT EXISTS (
      SELECT 1 FROM public.conversion_funnel
       WHERE event_type = 'first_multi_tool'
         AND metadata->>'api_key_hash' = NEW.api_key_hash
    ) THEN
      INSERT INTO public.conversion_funnel (event_type, source_channel, metadata)
      VALUES ('first_multi_tool', v_source,
              jsonb_build_object('api_key_hash', NEW.api_key_hash,
                                 'sdk', NEW.sdk,
                                 'distinct_tools', v_distinct_tools));
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never let telemetry failures block a tool call insert
  RETURN NEW;
END;
$$;

-- Register 'first_multi_tool' as a valid event_type (conversion-tracking edge fn also allows it via app-level list)
DROP TRIGGER IF EXISTS trg_emit_developer_funnel_events ON public.mcp_tool_call_log;
CREATE TRIGGER trg_emit_developer_funnel_events
AFTER INSERT ON public.mcp_tool_call_log
FOR EACH ROW EXECUTE FUNCTION public.emit_developer_funnel_events();

-- 3. Per-developer daily activity rollup (regular view; cheap given indexes above)
CREATE OR REPLACE VIEW public.developer_activity_daily AS
SELECT
  date_trunc('day', created_at)::date         AS activity_date,
  api_key_hash,
  COALESCE(access_source, 'unknown')          AS source_channel,
  sdk,
  count(*)                                    AS total_calls,
  count(*) FILTER (WHERE success)             AS successful_calls,
  count(*) FILTER (WHERE NOT success)         AS failed_calls,
  count(DISTINCT tool_name)                   AS distinct_tools_used,
  array_agg(DISTINCT tool_name)               AS tools_used,
  count(DISTINCT client_instance_id)          AS distinct_client_instances,
  percentile_disc(0.5) WITHIN GROUP (ORDER BY response_time_ms) AS p50_ms,
  percentile_disc(0.95) WITHIN GROUP (ORDER BY response_time_ms) AS p95_ms
FROM public.mcp_tool_call_log
WHERE api_key_hash IS NOT NULL
GROUP BY 1,2,3,4;

GRANT SELECT ON public.developer_activity_daily TO service_role;
