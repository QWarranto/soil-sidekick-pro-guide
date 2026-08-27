/**
 * @leafengines/telemetry - Main entry point
 *
 * Re-exports all public APIs from the telemetry package.
 *
 * Usage:
 *   import { TelemetryClient } from '@ancientwhispers54/leafengines-telemetry';
 *
 *   const telemetry = new TelemetryClient({
 *     endpoint: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/telemetry-ingest',
 *     apiKey: 'ak_...',
 *     anonKey: 'eyJ...',
 *   });
 *
 *   telemetry.trackToolCall('agricultural_intelligence', 1250, true);
 *   telemetry.trackApiRequest('/get-soil-data', 'POST', 200, 890);
 */

export { TelemetryClient } from './client';
export type {
  TelemetryEvent,
  TelemetryConfig,
  TelemetryContext,
  TelemetryReporter,
  TelemetryEventType,
  SeverityLevel,
  IngestResponse,
  ToolCallProperties,
  ApiRequestProperties,
  ApiErrorProperties,
  LatencyProperties,
  CostProperties,
  SystemHealthProperties,
} from './types';
export { DEFAULT_CONFIG } from './types';
