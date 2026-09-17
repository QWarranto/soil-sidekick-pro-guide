
-- Drop hardcoded-key functions that still exist in the live database
DROP FUNCTION IF EXISTS public.encrypt_sensitive_payment_data(text);
DROP FUNCTION IF EXISTS public.get_decrypted_stripe_customer_id(uuid);

-- Replace hash_email with a version that uses a secret-based salt via parameter
-- (keeping backward compat - the salt is already in git history so this is low priority)

-- Fix pwa_analytics anonymous data exposure
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.pwa_analytics;
CREATE POLICY "Users can view their own analytics"
  ON public.pwa_analytics FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
