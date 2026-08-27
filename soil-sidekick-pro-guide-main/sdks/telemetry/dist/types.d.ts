/**
 * @leafengines/telemetry - Event types and configuration
 *
 * Defines the telemetry event schema, configuration options,
 * and type definitions for the LeafEngines telemetry system.
 */
export type TelemetryEventType = 'tool_call' | 'api_request' | 'api_error' | 'latency' | 'cost' | 'page_view' | 'user_action' | 'system_health' | 'pwa_install' | 'offline_session';
export type SeverityLevel = 'debug' | 'info' | 'warn' | 'error';
export interface TelemetryEvent {
    /** Unique event ID (UUID v4) */
    id: string;
    /** Event type categorization */
    type: TelemetryEventType;
    /** ISO 8601 timestamp */
    timestamp: string;
    /** Name/identifier of the event */
    name: string;
    /** Event payload - varies by type */
    properties: Record<string, unknown>;
    /** Severity level for error/health events */
    severity?: SeverityLevel;
    /** Session ID for correlating events */
    sessionId?: string;
    /** User ID (anonymized if privacy mode is on) */
    userId?: string;
    /** Client context (app version, platform, etc.) */
    context?: TelemetryContext;
}
export interface TelemetryContext {
    appVersion: string;
    platform: 'web' | 'node' | 'react-native';
    os?: string;
    browser?: string;
    device?: string;
    screenResolution?: string;
    locale?: string;
    timezone?: string;
}
export interface ToolCallProperties {
    tool_name: string;
    arguments: Record<string, unknown>;
    duration_ms: number;
    success: boolean;
    error_message?: string;
    api_key_prefix?: string;
}
export interface ApiRequestProperties {
    endpoint: string;
    method: string;
    status_code: number;
    duration_ms: number;
    request_id?: string;
    cache_hit?: boolean;
    cache_level?: string;
}
export interface ApiErrorProperties {
    endpoint: string;
    method: string;
    status_code: number;
    error_code?: string;
    error_message: string;
    retry_count?: number;
}
export interface LatencyProperties {
    operation: string;
    duration_ms: number;
    p50_ms?: number;
    p95_ms?: number;
    p99_ms?: number;
    sample_size?: number;
}
export interface CostProperties {
    provider: string;
    model?: string;
    input_tokens?: number;
    output_tokens?: number;
    cost_usd: number;
    operation: string;
}
export interface SystemHealthProperties {
    cpu_percent?: number;
    memory_mb?: number;
    request_queue_depth?: number;
    active_connections?: number;
    uptime_seconds?: number;
}
export interface TelemetryConfig {
    /** Ingest endpoint URL (e.g., Supabase edge function) */
    endpoint: string;
    /** API key for authentication */
    apiKey?: string;
    /** Anonymous public key (Supabase anon key) */
    anonKey?: string;
    /** Maximum events to buffer before flushing */
    maxBatchSize: number;
    /** Interval in ms between automatic flushes (0 = manual only) */
    flushIntervalMs: number;
    /** Maximum time in ms to retain events in offline queue */
    offlineTtlMs: number;
    /** Maximum number of events to store offline */
    maxOfflineQueueSize: number;
    /** Enable privacy mode - hashes PII before sending */
    privacyMode: boolean;
    /** Minimum severity level to report */
    minSeverity: SeverityLevel;
    /** Sample rate 0.0-1.0 (1.0 = all events) */
    sampleRate: number;
    /** Application context included with every event */
    context?: TelemetryContext;
    /** Custom headers to include with ingest requests */
    customHeaders?: Record<string, string>;
    /** Tags applied to all events */
    globalTags?: Record<string, string>;
}
export declare const DEFAULT_CONFIG: TelemetryConfig;
export interface IngestResponse {
    accepted: number;
    rejected?: number;
    errors?: Array<{
        index: number;
        message: string;
    }>;
}
export interface TelemetryReporter {
    readonly name: string;
    /** Called before event is enqueued - return false to drop */
    filter?(event: TelemetryEvent): boolean;
    /** Called to enrich event before enqueue */
    enrich?(event: TelemetryEvent): TelemetryEvent;
    /** Called after successful flush */
    onFlush?(events: TelemetryEvent[]): void;
    /** Called on flush error */
    onError?(error: Error, events: TelemetryEvent[]): void;
}
