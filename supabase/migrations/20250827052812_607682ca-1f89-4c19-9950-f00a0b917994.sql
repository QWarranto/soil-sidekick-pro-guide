-- Fix SECURITY DEFINER view issue by checking current views
-- First, let's see what views exist and their definitions
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;