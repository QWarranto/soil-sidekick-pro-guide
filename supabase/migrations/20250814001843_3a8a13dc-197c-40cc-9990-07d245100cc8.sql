-- Fix the policy conflict and complete encryption implementation
-- Remove conflicting policies first

-- Fix cache table policies
DROP POLICY IF EXISTS "Service can manage cache data" ON public.fips_data_cache;
DROP POLICY IF EXISTS "Cache data is publicly readable" ON public.fips_data_cache;

-- Ensure RLS is enabled
ALTER TABLE public.fips_data_cache ENABLE ROW LEVEL SECURITY;

-- Create new secure policies for cache
CREATE POLICY "Authenticated users can read cache data"
ON public.fips_data_cache
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage cache data"
ON public.fips_data_cache
FOR ALL
USING (auth.role() = 'service_role');

-- Now complete the encryption setup that was cut off

-- Run the encryption migration for existing data
SELECT public.encrypt_existing_sensitive_data();

-- Log the successful security enhancement
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'security_infrastructure',
    'FIELD_LEVEL_ENCRYPTION_COMPLETED',
    '{"encryption": "none", "payment_data": "plaintext", "api_credentials": "jsonb_plaintext"}'::jsonb,
    '{"encryption": "pgcrypto_aes", "payment_data": "encrypted", "api_credentials": "secure_table_encrypted", "access_audited": true}'::jsonb,
    'CRITICAL',
    ARRAY['ENCRYPTION_COMPLETE', 'PAYMENT_SECURITY', 'API_CREDENTIAL_PROTECTION', 'AUDIT_ENABLED']
);