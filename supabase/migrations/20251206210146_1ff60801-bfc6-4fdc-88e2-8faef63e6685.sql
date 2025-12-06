-- Fix 1: Add explicit deny policy for trial_users table to block authenticated user access
CREATE POLICY "Block authenticated user access to trial_users"
ON public.trial_users FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Fix 2: Replace overly permissive pwa_analytics INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert PWA analytics" ON public.pwa_analytics;

CREATE POLICY "Users can insert own PWA analytics"
ON public.pwa_analytics FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);