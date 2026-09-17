# SDK Track

SDK version state, breaking changes, and release pipeline.

## Current Versions

| SDK | Lang | Version | Status | Released | Owner |
|-----|------|---------|--------|----------|-------|
| @soilsideckill/sdk | TypeScript | 3.1.0 | Production | 2026-07-02 | Reggie | Adds Asset Management (`assetsCrud`) + WFS Export (`wfsExport`); OpenAPI bumped to 3.1.0 |
| @soilsideckill/sdk | TypeScript | 3.0.0 | Superseded | 2026-06 | Reggie | Dual-meter types, free-tier auto-detect, channel-awareness |
| @soilsideckill/sdk (OpenAPI gen) | TypeScript | 1.2.0 | Deprecated | 2026-Q1 | Auto-generated | Superseded by v3.0.0 |
| @ancientwhispers54/leafengines-telemetry | TypeScript | 1.0.0 | Production | 2026-05 | Reggie |
| @ancientwhispers54/leafengines-mcp-server | TypeScript | Published | Production | 2026-Q1 | Reggie |
| n8n-nodes-leafengines | TypeScript | Published | Production | 2026-Q1 | Reggie |
| node-red-contrib-leafengines | JavaScript | Published | Production | 2026-Q1 | Reggie |
| qgis_leafengines | Python | 1.0.10 | Published | 2026-06 | Reggie | WFS x-api-key auth, security-clean |

## In-Flight Releases

| SDK | Version | Milestone | Blocker | ETA |
|-----|---------|-----------|---------|-----|
| @soilsideckill/sdk | 3.0.0 | Dual-meter types, free-tier auto-detect, channel-awareness | Phase 2 (dual-meter pricing) must land first | Day 16 |
| @ancientwhispers54/leafengines-telemetry | 2.0.0 | Dual-meter events, channel field, service_role write path | Phase 0 (telemetry fix) | Day 14 |
| qgis_leafengines | 2.0.0 | SDK v3.0 integration, free-tier support, dual-meter display | SDK v3.0 | Day 19 |

## Breaking Changes

| Version | Change | Migration Path | Deprecation Date | Removal Date |
|---------|--------|---------------|-----------------|-------------|
| 2.0 -> 3.0 | Single daily_call_count replaced by daily_ai_count + daily_data_count | SDK auto-detects; old field maps to daily_ai_count | Day 10 | Day 30 |
| 2.0 -> 3.0 | Free-tier no longer requires ak_ key (auto-provision) | Remove hardcoded API key from config; SDK handles it | Day 10 | Day 30 |
| Telemetry 1.0 -> 2.0 | event_name format changes from 'tool_call' to 'mcp:{tool_name}' or 'telegram:{tool_name}' | Backward compatible; new format is additive | Day 14 | Day 30 |

## Support Matrix

| SDK | Supported Langs | Supported Platforms | Min Version |
|-----|-----------------|---------------------|-------------|
| @soilsideckill/sdk | TypeScript, JavaScript | Node 18+, browsers, Deno, Supabase Edge Functions | Node 18 |
| @ancientwhispers54/leafengines-telemetry | TypeScript, JavaScript | Node 18+, browsers, Supabase Edge Functions | Node 18 |
| @ancientwhispers54/leafengines-mcp-server | TypeScript | Claude Desktop, Cursor, any MCP client | Node 18 |
| n8n-nodes-leafengines | TypeScript | n8n (self-hosted and cloud) | n8n 1.0+ |
| node-red-contrib-leafengines | JavaScript | Node-RED | Node-RED 3.0+ |
| qgis_leafengines | Python | QGIS Desktop | QGIS 3.22+ |

## SDK v3.0 Feature Spec

### New Types

```typescript
interface DualMeterUsage {
  ai_calls_used: number;
  ai_calls_limit: number;
  data_calls_used: number;
  data_calls_limit: number;
  alerts_used: number;
  alerts_limit: number;
  tier: 'free' | 'pro' | 'team' | 'enterprise';
  resets_at: string; // ISO timestamp
}

interface ChannelAwareConfig {
  channel: 'mcp' | 'telegram' | 'n8n' | 'node_red' | 'qgis' | 'arcgis' | 'browser';
  apiKey?: string; // optional -- auto-provisioned if absent
  baseURL: string;
}
```

### Auto-Provisioning Flow

```
SDK initialized without apiKey
  -> First tool call sends request with x-free-tier: true header
  -> Backend creates user + api_keys row
  -> Returns ak_ key in response header
  -> SDK stores key for subsequent calls
  -> User never sees or manages a key
```

### Channel Detection

```typescript
function detectChannel(): ChannelAwareConfig['channel'] {
  if (typeof Deno !== 'undefined') return 'mcp';           // Supabase edge function
  if (process.env.N8N_WORKFLOW) return 'n8n';              // n8n node
  if (global.RED) return 'node_red';                       // Node-RED
  if (typeof qgis !== 'undefined') return 'qgis';          // QGIS Python env
  if (typeof window !== 'undefined') return 'browser';     // Web app
  return 'mcp';                                            // Default
}
```
