-- Fix security vulnerability in data_classification table
-- Remove public read access and restrict to administrators only

-- Drop the existing public read policy
DROP POLICY IF EXISTS "All can view data classification" ON public.data_classification;

-- Ensure only admins can view data classification (the admin policy already exists for ALL operations)
-- The existing "Admins can manage data classification" policy already covers SELECT for admins

-- Add additional security: Create policy for service functions if needed
CREATE POLICY "Service functions can read data classification"
ON public.data_classification
FOR SELECT
USING (is_service_role());

-- Log this security fix in the audit log
INSERT INTO public.comprehensive_audit_log (
  table_name,
  operation,
  old_values,
  new_values,
  risk_level,
  compliance_tags
) VALUES (
  'data_classification',
  'SECURITY_FIX',
  '{"public_access": true}'::jsonb,
  '{"public_access": false, "admin_only": true}'::jsonb,
  'HIGH',
  ARRAY['SECURITY_HARDENING', 'ACCESS_CONTROL']
);