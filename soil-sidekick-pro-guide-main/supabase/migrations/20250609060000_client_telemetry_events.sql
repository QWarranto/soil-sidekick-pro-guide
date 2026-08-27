-- Create client telemetry events table for server-side telemetry ingestion
-- Used by TelemetryEmitter in edge functions (_shared/telemetry.ts)
CREATE TABLE IF NOT EXISTS public.client_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
    app_version TEXT,
    platform TEXT,
    event_type TEXT NOT NULL,
    event_name TEXT NOT NULL,
    surface TEXT,
    properties JSONB DEFAULT '{}',
    severity TEXT DEFAULT 'info',
    user_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_telemetry_events ENABLE ROW LEVEL SECURITY;

-- Service role can insert (edge functions use service_role key)
CREATE POLICY "Service can insert telemetry events" ON public.client_telemetry_events
FOR INSERT WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can view all telemetry" ON public.client_telemetry_events
FOR SELECT USING (public.is_admin());

-- Users can view their own (if user_id matches auth.uid)
CREATE POLICY "Users can view own telemetry" ON public.client_telemetry_events
FOR SELECT USING (user_id = auth.uid()::text);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_telemetry_events_type_time ON public.client_telemetry_events(event_type, "timestamp");
CREATE INDEX IF NOT EXISTS idx_telemetry_events_surface_time ON public.client_telemetry_events(surface, "timestamp");
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_time ON public.client_telemetry_events(user_id, "timestamp");
CREATE INDEX IF NOT EXISTS idx_telemetry_events_name_time ON public.client_telemetry_events(event_name, "timestamp");
