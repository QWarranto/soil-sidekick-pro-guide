CREATE TABLE IF NOT EXISTS public.mcp_tool_call_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_hash text,
  source_ip text,
  user_agent text,
  tool_name text NOT NULL,
  tool_arguments jsonb DEFAULT '{}'::jsonb,
  context_mode text,
  kv_cache_hint text,
  preferred_model_tier text,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  response_status integer,
  response_time_ms integer,
  downstream_endpoint text,
  jsonrpc_id text,
  is_batch boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_mcp_tool_call_log_created_at ON public.mcp_tool_call_log (created_at DESC);
CREATE INDEX idx_mcp_tool_call_log_tool_name ON public.mcp_tool_call_log (tool_name);
CREATE INDEX idx_mcp_tool_call_log_api_key_hash ON public.mcp_tool_call_log (api_key_hash);
CREATE INDEX idx_mcp_tool_call_log_success ON public.mcp_tool_call_log (success);

ALTER TABLE public.mcp_tool_call_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert mcp tool call logs"
ON public.mcp_tool_call_log FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Authenticated users can read mcp tool call logs"
ON public.mcp_tool_call_log FOR SELECT
TO authenticated
USING (true);

COMMENT ON TABLE public.mcp_tool_call_log IS 'Audit trail for every MCP tools/call invocation. Retention: 90 days recommended.';