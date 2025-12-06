-- Fix PWA analytics open insert vulnerability
-- Require authentication for inserting PWA analytics to prevent data poisoning attacks

DROP POLICY IF EXISTS "Anyone can insert PWA analytics" ON pwa_analytics;

CREATE POLICY "Authenticated users can insert PWA analytics" ON pwa_analytics
  FOR INSERT TO authenticated
  WITH CHECK (true);