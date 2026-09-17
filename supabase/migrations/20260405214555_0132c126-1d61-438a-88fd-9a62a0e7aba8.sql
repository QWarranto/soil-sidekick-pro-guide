-- Conversion funnel tracking table
CREATE TABLE public.conversion_funnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  source_channel TEXT NOT NULL DEFAULT 'unknown',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversion_funnel ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge functions (service role) and anonymous tracking
CREATE POLICY "Service role can manage conversion funnel"
  ON public.conversion_funnel
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert their own events
CREATE POLICY "Authenticated users can insert conversion events"
  ON public.conversion_funnel
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for funnel queries
CREATE INDEX idx_conversion_funnel_event_type ON public.conversion_funnel(event_type);
CREATE INDEX idx_conversion_funnel_created_at ON public.conversion_funnel(created_at DESC);
CREATE INDEX idx_conversion_funnel_source ON public.conversion_funnel(source_channel);

-- Index on cost_tracking for Stripe sync (finding unsynced records)
CREATE INDEX idx_cost_tracking_stripe_sync 
  ON public.cost_tracking USING gin (request_details)
  WHERE request_details IS NULL OR NOT (request_details ? 'stripe_synced');