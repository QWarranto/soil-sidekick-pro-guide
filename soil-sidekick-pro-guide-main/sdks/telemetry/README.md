# @ancientwhispers54/leafengines-telemetry

Client-side telemetry SDK for the LeafEngines / Soil Sidekick Pro ecosystem.

## Install

```bash
npm install @ancientwhispers54/leafengines-telemetry
```

## Quick Start

```typescript
import { TelemetryClient } from '@ancientwhispers54/leafengines-telemetry';

const telemetry = new TelemetryClient({
  endpoint: 'https://your-project.supabase.co/functions/v1/telemetry-ingest',
  apiKey: 'ak_...',           // Optional: API key for auth
  anonKey: 'eyJ...',          // Optional: Supabase anon key
  maxBatchSize: 20,           // Flush after 20 events
  flushIntervalMs: 10000,     // Auto-flush every 10s
  privacyMode: true,          // Hash PII before sending
});

// Track events
telemetry.track('page_view', 'dashboard', { route: '/dashboard' });
telemetry.trackToolCall('agricultural_intelligence', 1250, true);
telemetry.trackApiRequest('/get-soil-data', 'POST', 200, 890);
telemetry.trackError('/safe-identification', 'Auth failed', 401, 'UNAUTHORIZED');
telemetry.trackCost('openai', 0.003, 'embedding');

// Manual flush
await telemetry.flush();

// Graceful shutdown
await telemetry.shutdown();
```

## Features

- **Auto-batching**: Events are buffered and sent in batches to reduce network overhead
- **Offline queue**: Events are persisted to localStorage when offline and flushed on reconnect
- **Privacy mode**: PII fields are redacted and user IDs are hashed
- **Sample rate**: Control what fraction of events are reported (0.0 - 1.0)
- **Severity filtering**: Only report events above a minimum severity level
- **Reporter plugins**: Extend with custom filter, enrich, onFlush, and onError hooks
- **Convenience methods**: Built-in helpers for tool calls, API requests, errors, and cost tracking

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `endpoint` | (required) | Ingest endpoint URL |
| `apiKey` | undefined | API key for authentication |
| `anonKey` | undefined | Supabase anonymous key |
| `maxBatchSize` | 20 | Events before auto-flush |
| `flushIntervalMs` | 10000 | Auto-flush interval (0 = manual) |
| `offlineTtlMs` | 86400000 | Max age for offline events (24h) |
| `maxOfflineQueueSize` | 500 | Max events in offline queue |
| `privacyMode` | true | Hash PII before sending |
| `minSeverity` | 'info' | Minimum severity to report |
| `sampleRate` | 1.0 | Fraction of events to report |
| `context` | undefined | App context (version, platform) |
| `customHeaders` | undefined | Extra HTTP headers |
| `globalTags` | undefined | Tags applied to all events |

## Event Types

- `tool_call` - MCP tool invocations
- `api_request` - HTTP API calls
- `api_error` - Failed API calls
- `latency` - Performance measurements
- `cost` - External service costs
- `page_view` - Page/route views
- `user_action` - User interactions
- `system_health` - System metrics
- `pwa_install` - PWA installation events
- `offline_session` - Offline usage sessions

## License

MIT
