// Telemetry Ingest Endpoint
// Accepts batched telemetry events from @leafengines/telemetry SDK
// and writes them to client_telemetry_events table

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Simple IP-based rate limiter: 100 events per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_EVENTS = 100;   // 100 events per window per IP

interface IngestEvent {
  event_id?: string;
  eventId?: string;
  event_type?: string;
  eventType?: string;
  event_name?: string;
  eventName?: string;
  timestamp?: string;
  properties?: Record<string, unknown>;
  severity?: string;
  user_id?: string;
  userId?: string;
  surface?: string;
  app_version?: string;
  appVersion?: string;
  platform?: string;
}

function getKey(event: any, snake: string, camel: string) {
  return event[snake] ?? event[camel] ?? undefined;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Authenticate: accept API key or anon key
    const authHeader = req.headers.get('Authorization');
    const xApiKey = req.headers.get('x-api-key');
    const anonKey = req.headers.get('apikey');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? anonKey ?? '';

    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const body = await req.json();
    const events: IngestEvent[] = body.events || [];

    if (!Array.isArray(events) || events.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No events provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Batch size limit
    if (events.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Batch too large. Maximum 100 events per request.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit: extract IP and check window
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = (forwarded?.split(',')[0]?.trim() || realIp || 'unknown');
    const nowMs = Date.now();
    const bucket = rateLimitMap.get(clientIp);

    if (bucket && nowMs < bucket.resetAt) {
      if (bucket.count + events.length > RATE_LIMIT_MAX_EVENTS) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            limit: RATE_LIMIT_MAX_EVENTS,
            window: '1m',
            retry_after_ms: bucket.resetAt - nowMs,
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      bucket.count += events.length;
    } else {
      rateLimitMap.set(clientIp, { count: events.length, resetAt: nowMs + RATE_LIMIT_WINDOW_MS });
    }

    // Validate and transform events
    const now = new Date().toISOString();
    const rows = events.map((event) => ({
      event_id: getKey(event, 'event_id', 'eventId') || crypto.randomUUID(),
      event_type: getKey(event, 'event_type', 'eventType'),
      event_name: getKey(event, 'event_name', 'eventName'),
      "timestamp": getKey(event, 'timestamp', 'timestamp') || now,
      properties: getKey(event, 'properties', 'properties') || {},
      severity: getKey(event, 'severity', 'severity') || 'info',
      user_id: getKey(event, 'user_id', 'userId') || null,
      surface: getKey(event, 'surface', 'surface') || null,
      app_version: getKey(event, 'app_version', 'appVersion') || null,
      platform: getKey(event, 'platform', 'platform') || null,
      created_at: now,
    }));

    // Insert into client_telemetry_events
    const { error: insertError } = await supabase
      .from('client_telemetry_events')
      .insert(rows);

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return new Response(
        JSON.stringify({
          accepted: 0,
          rejected: events.length,
          errors: [{ index: 0, message: insertError.message }],
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        accepted: rows.length,
        rejected: 0,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Telemetry ingest error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
