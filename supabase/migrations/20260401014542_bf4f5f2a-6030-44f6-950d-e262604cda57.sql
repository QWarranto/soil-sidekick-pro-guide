DROP POLICY IF EXISTS "Users can view their own PWA analytics" ON public.pwa_analytics;

CREATE POLICY "Users can view their own PWA analytics"
  ON public.pwa_analytics
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = user_id) OR (user_id IS NULL));