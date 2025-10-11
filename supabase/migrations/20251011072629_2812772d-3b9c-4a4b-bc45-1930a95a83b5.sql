-- Create table for PWA install analytics
CREATE TABLE IF NOT EXISTS public.pwa_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('prompt_available', 'prompt_accepted', 'prompt_dismissed', 'app_installed', 'already_installed')),
  platform TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pwa_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for pwa_analytics
-- Allow anyone to insert analytics (for tracking before auth)
CREATE POLICY "Anyone can insert PWA analytics"
  ON public.pwa_analytics
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own analytics
CREATE POLICY "Users can view their own PWA analytics"
  ON public.pwa_analytics
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow admins to view all analytics
CREATE POLICY "Admins can view all PWA analytics"
  ON public.pwa_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email LIKE '%@soilsidekick.com'
    )
  );

-- Create index for better query performance
CREATE INDEX idx_pwa_analytics_user_id ON public.pwa_analytics(user_id);
CREATE INDEX idx_pwa_analytics_event_type ON public.pwa_analytics(event_type);
CREATE INDEX idx_pwa_analytics_timestamp ON public.pwa_analytics(timestamp DESC);
CREATE INDEX idx_pwa_analytics_platform ON public.pwa_analytics(platform);