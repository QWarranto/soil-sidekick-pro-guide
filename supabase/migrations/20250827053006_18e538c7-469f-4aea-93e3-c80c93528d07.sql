-- Check for any remaining security definer configurations
-- First, let's see all views and their properties
SELECT 
    n.nspname as schema_name,
    c.relname as view_name,
    c.relkind,
    array_to_string(c.reloptions, ', ') as options,
    pg_get_viewdef(c.oid) as view_definition
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relkind IN ('v', 'r')  -- views and tables
  AND n.nspname = 'public'
  AND (c.reloptions IS NOT NULL OR c.relname LIKE '%security%')
ORDER BY view_name;

-- Also check functions with security definer that might be related to views
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as is_security_definer,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prosecdef = true  -- security definer functions
  AND p.proname LIKE '%masked%'
ORDER BY function_name;