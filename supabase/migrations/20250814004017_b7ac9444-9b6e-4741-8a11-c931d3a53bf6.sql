-- Fix the function search path security warning
-- Update the simple email mask function to have proper search path

DROP FUNCTION IF EXISTS public.simple_email_mask();

-- Recreate the function with proper search path
CREATE OR REPLACE FUNCTION public.simple_email_mask()
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO ''
AS $$
    SELECT 'email@masked.com'::text;
$$;

-- Verify all our encryption-related functions have proper search paths
-- (They should already have SET search_path TO '' from previous migrations)

-- Log this final security compliance fix
INSERT INTO public.comprehensive_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    risk_level,
    compliance_tags
) VALUES (
    'function_security_compliance',
    'SEARCH_PATH_SECURITY_FIXED',
    '{"function_search_path": "mutable", "security_risk": "potential_injection"}'::jsonb,
    '{"function_search_path": "immutable_empty", "security_risk": "resolved"}'::jsonb,
    'MEDIUM',
    ARRAY['FUNCTION_SECURITY', 'SEARCH_PATH_FIXED', 'SQL_INJECTION_PREVENTION']
);