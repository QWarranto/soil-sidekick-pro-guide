-- Completely remove materialized views from API access by creating a revoke policy
REVOKE SELECT ON public.cost_summary FROM anon, authenticated;
REVOKE SELECT ON public.usage_summary FROM anon, authenticated;

-- Grant access only to postgres (owner) and service role for system operations
GRANT SELECT ON public.cost_summary TO postgres;
GRANT SELECT ON public.usage_summary TO postgres;