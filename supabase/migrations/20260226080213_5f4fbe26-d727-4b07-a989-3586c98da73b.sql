
-- Fix 1: Drop the overly restrictive "Deny anonymous access" ALL policy on profiles
-- This policy with USING(false) blocks ALL operations including trigger-based inserts
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;

-- Fix 2: Add a service_role bypass policy on profiles for trigger-based inserts
CREATE POLICY "Service role can manage profiles"
ON public.profiles FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix 3: Add a service_role bypass policy on api_keys for the auto-create trigger
CREATE POLICY "Service role can insert API keys"
ON public.api_keys FOR INSERT
WITH CHECK (auth.role() = 'service_role');
