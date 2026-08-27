/**
 * Telemetry middleware for Supabase edge functions.
 *
 * Wraps any request handler with automatic api_key_access_log recording
 * and optional client_telemetry_events emission.
 *
 * Usage:
 *   import { withApiKeyLogging } from '../_shared/telemetry_middleware.ts';
 *
 *   Deno.serve(withApiKeyLogging(async (req) => {
 *     return new Response('ok');
 *   }, { endpoint: 'get-soil-data', emitTelemetry: true }));
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

interface MiddlewareOpts {
  /** Canonical endpoint name for logging */
  endpoint: string;
  /** Also emit to client_telemetry_events (default false) */
  emitTelemetry?: boolean;
  /** App version tag */
  appVersion?: string;
}

interface ApiKeyAccessLogRow {
  api_key_id?: string | null;
  endpoint: string;
  success: boolean;
  rate_limited: boolean;
  response_time_ms: number;
  response_status: number;
  error_message?: string | null;
  created_at: string;
}

/** Extract the API key from common header positions. */
function extractApiKey(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return req.headers.get('x-api-key') || req.headers.get('apikey');
}

/** Look up api_key_id by key hash. Cached per-request. */
async function resolveApiKeyId(
  supabase: SupabaseClient,
  apiKey: string | null,
): Promise<string | null> {
  if (!apiKey) return null;
  // Use a simple in-memory cache for the edge function invocation
  const cacheKey = `_ak_${apiKey.substring(0, 16)}`;
  const cached = (Deno as any)[cacheKey];
  if (cached !== undefined) return cached;

  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key_hash', apiKey)
    .maybeSingle();

  const id = error || !data ? null : (data.id as string);
  (Deno as any)[cacheKey] = id;
  return id;
}

export function withApiKeyLogging(
  handler: (req: Request) => Promise<Response>,
  opts: MiddlewareOpts,
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  return async (req: Request): Promise<Response> => {
    const start = Date.now();
    const apiKey = extractApiKey(req);
    let success = true;
    let status = 200;
    let rateLimited = false;
    let errorMessage: string | null = null;

    try {
      const response = await handler(req);
      status = response.status;
      success = status < 400;
      rateLimited = status === 429;
      return response;
    } catch (err: any) {
      success = false;
      status = err.status || err.statusCode || 500;
      rateLimited = status === 429;
      errorMessage = err.message || String(err);
      throw err;
    } finally {
      const duration = Date.now() - start;

      // Fire-and-forget: api_key_access_log
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const apiKeyId = await resolveApiKeyId(supabase, apiKey);

        const row: ApiKeyAccessLogRow = {
          api_key_id: apiKeyId,
          endpoint: opts.endpoint,
          success,
          rate_limited: rateLimited,
          response_time_ms: duration,
          response_status: status,
          error_message: errorMessage,
          created_at: new Date().toISOString(),
        };

        await supabase.from('api_key_access_log').insert(row);

        // Optional: also emit to client_telemetry_events
        if (opts.emitTelemetry) {
          await supabase.from('client_telemetry_events').insert({
            event_id: crypto.randomUUID(),
            event_type: success ? 'api_request' : 'error',
            event_name: `api:${opts.endpoint}`,
            surface: 'rest',
            properties: {
              endpoint: opts.endpoint,
              status_code: status,
              duration_ms: duration,
              success,
              error_message: errorMessage,
              api_key_id: apiKeyId,
            },
            severity: success ? 'info' : 'error',
            platform: 'rest',
            app_version: opts.appVersion || '1.0',
            created_at: new Date().toISOString(),
            timestamp: new Date().toISOString(),
          });
        }
      } catch (_logErr) {
        // NEVER block the actual request because of logging
      }
    }
  };
}
