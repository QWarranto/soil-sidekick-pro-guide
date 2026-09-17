-- 1. Function search_path hardening
ALTER FUNCTION public.hash_api_key_secure(text) SET search_path = '';
ALTER FUNCTION public.validate_session_token(text) SET search_path = '';
ALTER FUNCTION public.decrypt_sensitive_data_v3(text, text) SET search_path = '';
ALTER FUNCTION public.check_trial_rate_limit_secure(inet, text, integer, integer) SET search_path = '';
ALTER FUNCTION public.is_trial_valid_by_hash(text) SET search_path = '';
ALTER FUNCTION public.check_anonymous_feedback_rate_limit(inet) SET search_path = '';
ALTER FUNCTION public.encrypt_sensitive_data_v3(text, text) SET search_path = '';
ALTER FUNCTION public.decrypt_email_v3(text, text) SET search_path = '';
ALTER FUNCTION public.encrypt_email_v3(text, text) SET search_path = '';
ALTER FUNCTION public.hash_email(text) SET search_path = '';

-- 2. Regular view → security_invoker
ALTER VIEW public.environmental_data_cache SET (security_invoker = true);

-- 3. Materialized views: revoke PostgREST API access (anon + authenticated)
REVOKE ALL ON public.cost_summary FROM anon, authenticated;
REVOKE ALL ON public.usage_summary FROM anon, authenticated;