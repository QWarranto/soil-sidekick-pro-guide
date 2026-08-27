/**
 * Server-side telemetry helper for Supabase edge functions.
 *
 * Provides fire-and-forget event writes to client_telemetry_events
 * using a service_role key (bypasses RLS). Never throws — telemetry
 * must never block the actual request.
 *
 * Usage:
 *   import { TelemetryEmitter } from '../_shared/telemetry.ts';
 *
 *   const telemetry = new TelemetryEmitter(supabaseUrl, serviceRoleKey);
 *
 *   // Inside request handler
 *   await telemetry.toolCall({ toolName: 'get-soil-data', durationMs: 890, success: true });
 *   await telemetry.apiRequest({ endpoint: '/api/soil', statusCode: 200, durationMs: 340 });
 *   await telemetry.error({ endpoint: '/api/soil', errorMessage: 'timeout', statusCode: 504 });
 *   await telemetry.cost({ provider: 'openrouter', costUsd: 0.002, operation: 'chat-completion' });
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const ALWAYS_REDACT = new Set([
  'api_key', 'apikey', 'x_api_key', 'authorization',
  'password', 'token', 'secret', 'service_role_key',
  'openrouter_api_key', 'stripe_secret_key',
]);

/** Strip PII-bearing keys from any object before converting to JSON. */
function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const lower = k.toLowerCase();
    if (ALWAYS_REDACT.has(lower) || ALWAYS_REDACT.has(lower.replace(/[-_]/g, ''))) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      out[k] = redact(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export interface BaseEvent {
  /** Which surface emitted this: 'mcp', 'telegram', 'web', 'rest', etc. */
  surface: string;
  /** Optional: first-L-of api key for attribution (already truncated). */
  apiKeyPrefix?: string;
  /** Optional: Supabase user uuid or telegram_id. */
  userId?: string;
  /** Optional: extra k-v payload (gets redacted). */
  properties?: Record<string, unknown>;
}

export interface ToolCallEvent extends BaseEvent {
  toolName: string;
  durationMs: number;
  success: boolean;
  functionName?: string;
  errorMessage?: string;
}

export interface ApiRequestEvent extends BaseEvent {
  endpoint: string;
  method?: string;
  statusCode: number;
  durationMs: number;
}

export interface ErrorEvent extends BaseEvent {
  endpoint: string;
  errorMessage: string;
  statusCode?: number;
  errorCode?: string;
}

export interface CostEvent extends BaseEvent {
  provider: string;
  costUsd: number;
  operation: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
}

export class TelemetryEmitter {
  private client: SupabaseClient;
  private readonly appVersion: string;

  constructor(
    supabaseUrl: string,
    serviceRoleKey: string,
    opts?: { appVersion?: string },
  ) {
    this.client = createClient(supabaseUrl, serviceRoleKey);
    this.appVersion = opts?.appVersion ?? 'unknown';
  }

  // ── High-level helpers ─────────────────────────────────────

  async toolCall(e: ToolCallEvent): Promise<void> {
    await this.insert({
      event_type: 'tool_call',
      event_name: `tool:${e.toolName}`,
      surface: e.surface,
      properties: {
        ...redact(e.properties ?? {}),
        tool_name: e.toolName,
        function_name: e.functionName ?? e.toolName,
        duration_ms: e.durationMs,
        success: e.success,
        error_message: e.errorMessage ?? null,
        api_key_prefix: e.apiKeyPrefix ?? null,
      },
      severity: e.success ? 'info' : 'error',
      user_id: e.userId ?? null,
    });
  }

  async apiRequest(e: ApiRequestEvent): Promise<void> {
    await this.insert({
      event_type: 'api_request',
      event_name: `api:${e.endpoint}:${e.method ?? 'GET'}`,
      surface: e.surface,
      properties: {
        ...redact(e.properties ?? {}),
        endpoint: e.endpoint,
        method: e.method ?? 'GET',
        status_code: e.statusCode,
        duration_ms: e.durationMs,
      },
      severity: e.statusCode >= 500 ? 'error' : e.statusCode >= 400 ? 'warn' : 'info',
      user_id: e.userId ?? null,
    });
  }

  async error(e: ErrorEvent): Promise<void> {
    await this.insert({
      event_type: 'api_error',
      event_name: `error:${e.endpoint}`,
      surface: e.surface,
      properties: {
        ...redact(e.properties ?? {}),
        endpoint: e.endpoint,
        status_code: e.statusCode ?? 0,
        error_code: e.errorCode ?? null,
        error_message: e.errorMessage,
      },
      severity: 'error',
      user_id: e.userId ?? null,
    });
  }

  async cost(e: CostEvent): Promise<void> {
    await this.insert({
      event_type: 'cost',
      event_name: `cost:${e.provider}:${e.operation}`,
      surface: e.surface,
      properties: {
        ...redact(e.properties ?? {}),
        provider: e.provider,
        cost_usd: e.costUsd,
        operation: e.operation,
        model: e.model ?? null,
        tokens_in: e.tokensIn ?? null,
        tokens_out: e.tokensOut ?? null,
      },
      severity: 'info',
      user_id: e.userId ?? null,
    });
  }

  // ── Raw insert (fire-and-forget) ───────────────────────────

  private async insert(row: {
    event_type: string;
    event_name: string;
    surface: string;
    properties: Record<string, unknown>;
    severity: string;
    user_id: string | null;
  }): Promise<void> {
    try {
      await this.client.from('client_telemetry_events').insert({
        event_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        app_version: this.appVersion,
        platform: row.surface,
        ...row,
        created_at: new Date().toISOString(),
      });
    } catch (_err) {
      // NEVER block the actual request because of telemetry.
      // In local/dev, supress noise; in production, Deno console
      // still logs to edge function output.
    }
  }
}
