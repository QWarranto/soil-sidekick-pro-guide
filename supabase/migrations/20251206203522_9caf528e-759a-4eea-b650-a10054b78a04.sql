-- Remove the weak policy that uses current_setting which can be manipulated
DROP POLICY IF EXISTS "Trial users can view their own record" ON public.trial_users;

-- Service role policy already exists and is sufficient for all trial operations
-- All trial validation happens in edge functions with service role access