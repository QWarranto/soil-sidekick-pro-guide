-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can read mcp tool call logs" ON public.mcp_tool_call_log;

-- Replace with admin-only SELECT policy
CREATE POLICY "Only admins can read mcp tool call logs"
  ON public.mcp_tool_call_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());