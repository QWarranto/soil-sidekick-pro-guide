# Developer Specifications

**Platform:** SoilSidekick Pro / LeafEngines
**SDK Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Overview

This document defines the contract developers rely on to integrate with the LeafEngines platform. It covers SDK layout, authentication, request/response envelopes, error handling, retries, idempotency, versioning, and per-language conventions.

## 2. Supported Languages & Distribution

| Language | Package | Registry | Min Runtime |
|---|---|---|---|
| TypeScript / JS | `@leafengines/sdk` | npm | Node 18+ |
| Python | `soilsidekick` | PyPI | Python 3.9+ |
| Java | `com.leafengines:sdk` | Maven Central | JDK 11+ |
| Ruby | `soilsidekick` | RubyGems | Ruby 3.0+ |
| PHP | `leafengines/sdk` | Packagist | PHP 8.1+ |
| Go | `github.com/leafengines/go-sdk` | Go modules | Go 1.21+ |

All SDKs are auto-generated from the canonical `openapi-spec.yaml` via GitHub Actions (`.github/workflows/sdk-generation.yml`) and published by `.github/workflows/sdk-publish.yml`.

## 3. Authentication

### 3.1 API Keys
- Format: `SS_API_{prefix}_2025` or `leaf-{env}-{12hex}`
- Header: `x-api-key: <key>`
- Storage: SHA-256 hashed in `public.api_keys.hashed_key`; plaintext never persisted
- Required subdomain: `app.soilsidekickpro.com` (rejects `web.` and marketing hosts)

### 3.2 Free Tier
- `x-free-tier: true` — no key required; scopes: `get-soil-data`, `county-lookup`, `turboquant-check`
- Test key: `leaf-test-370df0a2e62e` (safe to ship in samples)

### 3.3 JWT (Web App only)
- Supabase Auth; access token in `Authorization: Bearer` header
- Rotates every 60 min; refresh via Supabase client

## 4. Configuration

```ts
import { Configuration, SoilAnalysisApi } from "@leafengines/sdk";

const cfg = new Configuration({
  apiKey: process.env.LEAFENGINES_API_KEY,
  basePath: "https://app.soilsidekickpro.com/api",
});
const soil = new SoilAnalysisApi(cfg);
```

**Required env variables** (per `mem://architecture/leafengines-api-environment-variables`):

| Var | Purpose | Default |
|---|---|---|
| `LEAFENGINES_API_KEY` | Auth | — |
| `LEAFENGINES_API_URL` | Base URL | `https://app.soilsidekickpro.com/api` |
| `LEAFENGINES_LOG_LEVEL` | `debug`\|`info`\|`warn`\|`error` | `info` |
| `LEAFENGINES_CACHE` | 4-tier cache mode: `off`\|`memory`\|`disk`\|`hybrid` | `memory` |

## 5. API Surface (v3.1.0)

| Group | Class | Endpoints |
|---|---|---|
| Soil Analysis | `SoilAnalysisApi` | `/soil`, `/planting-calendar`, `/live-ag` |
| Water Quality | `WaterQualityApi` | `/water-quality`, `/territorial-water` |
| AI Services | `AIServicesApi` | `/chat`, `/seasonal`, `/summary`, `/visual` |
| Environmental | `EnvironmentalApi` | `/impact`, `/alpha-earth` |
| Carbon | `CarbonApi` | `/carbon-credits` |
| Geographic | `GeographicApi` | `/county-lookup`, `/reverse-geocode` |
| Satellite | `SatelliteDataApi` | `/vrt` |
| TurboQuant | `TurboQuantApi` | `/turboquant-check` |
| Consumer Plant | `ConsumerPlantCareApi` | `/plant/id`, `/plant/care` |
| **Assets (NEW)** | `AssetsCrudApi` | `/assets` GET/POST/PATCH/DELETE |
| **WFS (NEW)** | `WfsExportApi` | `/wfs?request=GetCapabilities\|GetFeature` |
| MCP | `LeafEnginesApi` | `/query` |

## 6. Request Conventions

- **Content-Type:** `application/json` on write endpoints
- **Idempotency:** `Idempotency-Key: <uuid v4>` on `createAsset` (24 h dedup window)
- **Optimistic Locking:** `If-Match: <version>` on `updateAsset`; 412 on mismatch
- **Pagination:** `?limit=` (default 100, max 5000), `?cursor=`
- **Free Tier:** `x-free-tier: true` mutually exclusive with `x-api-key`
- **Trace ID:** `x-request-id` echoed in response

## 7. Response Envelope (Data-Quality Wrapper)

```json
{
  "data": { /* payload */ },
  "meta": {
    "source": "USDA-SSURGO-2025",
    "freshness_hours": 12,
    "confidence": 0.94,
    "positional_uncertainty_m": 47,
    "request_id": "req_01H...",
    "cached": false
  }
}
```

Enterprise clients receive freshness + confidence flags; consumer tiers get a stripped envelope.

## 8. Error Model

```json
{
  "error": {
    "code": "ASSET_VERSION_MISMATCH",
    "message": "If-Match header does not match current version",
    "hint": "Refetch asset and retry with new version",
    "request_id": "req_01H...",
    "docs_url": "https://docs.leafengines.com/errors/ASSET_VERSION_MISMATCH"
  }
}
```

| HTTP | Category | Retry |
|---|---|---|
| 400 | Bad Request | No |
| 401 / 403 | Auth | No |
| 404 | Not Found | No |
| 409 | Conflict (idempotency mismatch) | No |
| 412 | Version Precondition Failed | Refetch + retry |
| 422 | Validation | No |
| 429 | Rate Limit | Backoff |
| 5xx | Server | Exponential backoff |

## 9. Retry & Backoff

- Base: 250 ms, factor 2, jitter ±20%, max 5 attempts, cap 30 s
- Retry only on 429 and 5xx (excluding 501)
- Honor `Retry-After` header when present

## 10. Rate Limits

Per API key, per environment:

| Tier | RPS | Monthly Calls |
|---|---|---|
| Free | 2 | 500 |
| Starter | 20 | 10,000 |
| Pro | 100 | 35,000 |
| Enterprise | 500+ | 175,000+ |
| Composio partner | 10,000 / hr | — |

Response headers: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.

## 11. Versioning Policy

- SemVer on both SDK and API spec
- Major bumps require a new base path (`/v4`)
- Deprecations announced 6 months in advance via `Sunset` header
- SDK regeneration on every merged spec PR

## 12. Language-Specific Notes

### TypeScript
- ESM + CJS dual export
- Types shipped in `dist/types`
- Tree-shakable; per-API imports supported

### Python
- Async client via `httpx`; sync via `requests`
- Types via `py.typed` marker (PEP 561)

### Java
- Retrofit-based; Kotlin coroutine extension available

### Go
- Context-first: every method takes `ctx context.Context`
- Zero external deps beyond `net/http`

### Ruby & PHP
- Faraday / Guzzle adapters; PSR-18 compliant in PHP

## 13. MCP Server

- Package: `@ancientwhispers54/leafengines-mcp-server`
- Protocol: JSON-RPC 2.0 over stdio
- Tools mapped 1:1 to REST endpoints
- Free tools inject upsell metadata (see `mem://architecture/mcp-orchestration-and-auth-layer`)
- Every invocation logged to `mcp_tool_call_log` for governance

## 14. WFS Client Example

```ts
const wfs = new WfsExportApi(cfg);
const caps = await wfs.wfsExport({ request: "GetCapabilities" });
const features = await wfs.wfsExport({
  request: "GetFeature",
  typeName: "leafengines:managed_assets",
  bbox: "-96.5,32.5,-96.0,33.0",
  limit: 1000,
  outputFormat: "application/json",
});
```

## 15. Testing & Sandbox

- QA sandbox base: `https://sandbox.leafengines.com`
- Hardcoded test keys deterministic; see `mem://quality/sdk-qa-sandbox-api`
- k6 baseline scripts in `load-tests/scripts/`

## 16. Changelog Discipline
- Every SDK release includes a `CHANGELOG.md` update
- Auto-generated release notes appended by publish workflow

## 17. Support Channels
- GitHub: `github.com/QWarranto/soil-sidekick-pro-guide`
- Email: `support@soilsidekickpro.com`
- Enterprise SLA: `enterprise@soilsidekickpro.com`
