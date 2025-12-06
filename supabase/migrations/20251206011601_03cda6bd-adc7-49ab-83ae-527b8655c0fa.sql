-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view tier limits" ON api_tier_limits;

-- Create authenticated-only policy
CREATE POLICY "Authenticated users can view tier limits"
  ON api_tier_limits FOR SELECT
  USING (auth.role() = 'authenticated');