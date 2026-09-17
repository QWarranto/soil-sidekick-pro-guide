-- Final comprehensive fix for data_classification table security
-- Ensure absolute security by removing ALL public access

-- First, check current policies (this will show in logs)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'data_classification';

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "All can view data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Service can read data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Service functions can read data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Admins can manage data classification" ON public.data_classification;

-- Ensure RLS is enabled
ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

-- Create a single, secure admin-only policy
CREATE POLICY "Admin only access to data classification"
ON public.data_classification
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Also create a service role policy for system operations
CREATE POLICY "Service role access for system operations"
ON public.data_classification
FOR ALL
USING (current_setting('role') = 'service_role');

-- Verify the table has proper RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'data_classification';

-- Log this critical security fix
INSERT INTO public.comprehensive_audit_log (
  table_name,
  operation,
  old_values,
  new_values,
  risk_level,
  compliance_tags
) VALUES (
  'data_classification',
  'CRITICAL_SECURITY_FIX',
  '{"public_readable": true, "security_risk": "high"}'::jsonb,
  '{"admin_only": true, "public_readable": false, "security_risk": "resolved"}'::jsonb,
  'CRITICAL',
  ARRAY['SECURITY_BREACH_PREVENTION', 'ACCESS_CONTROL', 'ADMIN_ONLY', 'RLS_HARDENING']
);