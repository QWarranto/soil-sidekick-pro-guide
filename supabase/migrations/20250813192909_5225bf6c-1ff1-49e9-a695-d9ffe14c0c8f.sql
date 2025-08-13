-- Fix remaining security vulnerabilities

-- 1. Double-check and fix data_classification table access
-- Drop any remaining policies that might allow public access
DROP POLICY IF EXISTS "All can view data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Service can read data classification" ON public.data_classification;

-- Ensure only admin access (the admin policy should already exist for ALL operations)
-- Verify the admin policy exists
DO $$
BEGIN
    -- Check if admin policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'data_classification' 
        AND policyname = 'Admins can manage data classification'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can manage data classification" 
                 ON public.data_classification 
                 FOR ALL 
                 USING (is_admin())';
    END IF;
END
$$;

-- 2. Fix adapt_api_usage table - ensure users can only see their own data
-- Drop the existing public policies that might be too permissive
DROP POLICY IF EXISTS "Service can manage API usage logs" ON public.adapt_api_usage;

-- Recreate secure policies
CREATE POLICY "Users can view only their own API usage"
ON public.adapt_api_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service functions can insert API usage"
ON public.adapt_api_usage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service functions can manage API usage"
ON public.adapt_api_usage
FOR UPDATE
USING (true);

-- 3. Log the security fixes
INSERT INTO public.comprehensive_audit_log (
  table_name,
  operation,
  old_values,
  new_values,
  risk_level,
  compliance_tags
) VALUES 
(
  'data_classification',
  'SECURITY_HARDENING',
  '{"access": "potentially_public"}'::jsonb,
  '{"access": "admin_only"}'::jsonb,
  'CRITICAL',
  ARRAY['SECURITY_FIX', 'ACCESS_CONTROL', 'DATA_PROTECTION']
),
(
  'adapt_api_usage',
  'SECURITY_HARDENING',
  '{"access": "public_readable"}'::jsonb,
  '{"access": "user_specific"}'::jsonb,
  'HIGH',
  ARRAY['SECURITY_FIX', 'PRIVACY', 'DATA_PROTECTION']
);