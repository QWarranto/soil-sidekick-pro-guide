-- Add access source tracking columns to mcp_tool_call_log
-- These track which channel/proxy requests arrive through

ALTER TABLE public.mcp_tool_call_log
  ADD COLUMN IF NOT EXISTS access_source text,
  ADD COLUMN IF NOT EXISTS is_list boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_initialize boolean DEFAULT false;

COMMENT ON COLUMN public.mcp_tool_call_log.access_source IS 'Detected access source: smithery, claude-desktop, openclaw, cursor, cli, browser, etc.';
COMMENT ON COLUMN public.mcp_tool_call_log.is_list IS 'True if this was a tools/list (discovery) request';
COMMENT ON COLUMN public.mcp_tool_call_log.is_initialize IS 'True if this was an initialize (connection) request';

CREATE INDEX IF NOT EXISTS idx_mcp_tool_call_log_access_source ON public.mcp_tool_call_log (access_source);
CREATE INDEX IF NOT EXISTS idx_mcp_tool_call_log_is_list ON public.mcp_tool_call_log (is_list) WHERE is_list = true;
CREATE INDEX IF NOT EXISTS idx_mcp_tool_call_log_is_initialize ON public.mcp_tool_call_log (is_initialize) WHERE is_initialize = true;
