// One-time bootstrap: ensure telemetry tables exist
// Run via: supabase functions deploy telemetry-bootstrap && curl <url>
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SQL = `
CREATE TABLE IF NOT EXISTS public.client_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
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
ALTER TABLE public.client_telemetry_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service can insert telemetry events" ON public.client_telemetry_events FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admins can view all telemetry" ON public.client_telemetry_events FOR SELECT USING (public.is_admin());
CREATE INDEX IF NOT EXISTS idx_telemetry_events_type_time ON public.client_telemetry_events(event_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_surface_time ON public.client_telemetry_events(surface, timestamp);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_time ON public.client_telemetry_events(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_name_time ON public.client_telemetry_events(event_name, timestamp);
`;

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // Execute SQL via REST query endpoint
    const resp = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Prefer': 'tx=commit',
      },
      body: SQL,
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ ok: false, error: text }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, applied: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
});
