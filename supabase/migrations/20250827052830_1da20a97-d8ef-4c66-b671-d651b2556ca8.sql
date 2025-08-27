-- Check for views with security_barrier or security_definer properties
SELECT 
    n.nspname as schema_name,
    c.relname as view_name,
    pg_get_viewdef(c.oid) as view_definition,
    c.relkind,
    -- Check view options
    array_to_string(c.reloptions, ', ') as options
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relkind = 'v'  -- views only
  AND n.nspname = 'public'
  AND c.reloptions IS NOT NULL
ORDER BY view_name;