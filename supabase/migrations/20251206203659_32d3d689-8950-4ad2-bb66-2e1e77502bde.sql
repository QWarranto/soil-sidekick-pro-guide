-- Add explicit deny policy for anonymous users on profiles table
-- This provides defense-in-depth protection for user PII (emails, names)
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);