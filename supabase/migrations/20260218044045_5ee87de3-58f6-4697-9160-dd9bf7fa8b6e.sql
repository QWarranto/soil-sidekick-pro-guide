-- Fix pwa_analytics RLS: allow both anonymous and authenticated users to insert their own events
CREATE POLICY "Anyone can insert PWA analytics events"
ON public.pwa_analytics
FOR INSERT
WITH CHECK (
  -- Authenticated users can insert rows linked to themselves or anonymous rows
  (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
  OR
  -- Unauthenticated users can only insert anonymous rows (user_id must be null)
  (auth.uid() IS NULL AND user_id IS NULL)
);