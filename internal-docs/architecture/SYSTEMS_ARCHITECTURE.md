# Systems Architecture Document

**System:** SoilSidekick Pro / LeafEngines Platform
**Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Purpose

Describes the end-to-end system architecture across web, API, edge, database, AI, and offline layers; how they interconnect; and where trust boundaries lie.

## 2. High-Level Diagram

```text
                 ┌────────────────────────────────────────────────┐
                 │                 Distribution Channels          │
                 │  Web · MCP · Claude · n8n · Node-RED · QGIS ·  │
                 │           Telegram · ClawHub · Direct API      │
                 └────────────────────┬───────────────────────────┘
                                      │
                             ┌────────▼────────┐
                             │   Edge Gateway   │  (Cloudflare / Supabase Edge)
                             │  Rate limit · JWT│
                             │  x-api-key · CORS│
                             └────────┬─────────┘
                                      │
             ┌────────────────────────┼────────────────────────────┐
             │                        │                            │
     ┌───────▼──────┐        ┌────────▼────────┐          ┌────────▼────────┐
     │ Edge Funcs   │        │  Lovable AI GW  │          │ Supabase Postgres│
     │ (Deno)       │        │ GPT-5 · Gemma   │          │ RLS · PostGIS    │
     │ 50 conc/2MB  │        │ Routing         │          │ pg_trgm · Vault  │
     └───────┬──────┘        └────────┬────────┘          └────────┬─────────┘
             │                        │                            │
             └────────┬───────────────┴─────────┬──────────────────┘
                      │                         │
              ┌───────▼────────┐        ┌───────▼────────┐
              │ External Data  │        │ Storage & CDN  │
              │ USDA · EPA ·   │        │ Supabase       │
              │ NOAA · GEE ·   │        │ Storage · CDN  │
              │ AlphaEarth     │        │                │
              └────────────────┘        └────────────────┘

Client (React 18) ──► Service Worker v3 App Shell
                    ├─► IndexedDB / Capacitor Preferences (write queue)
                    └─► WebGPU Gemma (offline inference)
```

### 2.1 Rendered Architecture Diagram

<lov-artifact url="/__l5e/documents/Systems_Architecture.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

### 2.2 Soil SDA → Edge Function → KV Cache Path

The `get-soil-data` and `hierarchical-fips-cache` functions front USDA Soil Data Access (SDA) with a 4-level hierarchical KV cache stored in `fips_data_cache` (L1 county · L2 state · L3 region · L4 national). Reads fall through levels until a fresh row is found; writes upsert with per-level TTLs (1h / 6h / 24h / 7d). SDA outages degrade gracefully to coarser levels and enqueue functional errors to `api-error-triage`.

<lov-artifact url="/__l5e/documents/Soil_SDA_KV_Flow.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

## 3. Logical Layers

### 3.1 Presentation Layer
- **Stack:** React 18, Vite 5, Tailwind v3, shadcn/ui, TypeScript 5
- **Routing:** React Router; `/api-docs`, `/api-keys`, `/founders`, `/mcp` etc.
- **State:** TanStack Query for server cache; Zustand for local
- **PWA:** Service Worker v3 (3-tier app-shell caching)
- **Offline:** Capacitor Preferences write queue → `offlineDataSync.ts` executor

### 3.2 API Gateway Layer
- **Provider:** Supabase Edge (Deno) fronted by Cloudflare
- **CORS:** `_shared/cors.ts` allows `x-api-key`, `x-free-tier`, `x-tq-*` headers
- **Auth flows:**
  1. JWT → web app users
  2. `x-api-key` → SDK / MCP / QGIS
  3. `x-free-tier: true` → keyless discovery for two whitelisted endpoints
- **Subdomain enforcement:** Authenticated routes require `app.` host

### 3.3 Compute Layer (Edge Functions)
- Constraints: 50 concurrent, 2 MB payload
- Mitigations: pagination, streaming, chunked embeddings
- Notable functions: `get-soil-data`, `county-lookup`, `assets-crud`, `wfs-export`, `stripe-usage-sync`, `mcp-router`, `api-error-triage`, `alpha-earth-enhance`, `visual-crop-analysis`

### 3.4 Data Layer
- **Postgres 15** with PostGIS, pg_trgm, pgvector
- **RLS** on all 80+ public tables (verified via security scan)
- **Encryption:** V3 AES-256; keys in Supabase Vault (`APP_ENCRYPTION_KEY`)
- **Search:** pg_trgm GIN indices for < 1000 ms fuzzy county lookup
- **Time-series:** partitioned tables for telemetry / usage analytics
- **Audit:** `comprehensive_audit_log`, `mcp_tool_call_log`, `compliance_audit_log`

### 3.5 AI Layer
- **Cloud:** Lovable AI Gateway → GPT-5, Claude, Gemini
- **Local:** WebGPU Gemma with TurboQuant KV-cache 6× compression
- **Routing:** `useSmartLLMSelection` decides cloud vs local based on task, device capability, and privacy flag
- **Embeddings:** AlphaEarth 64-dim vectors, stored in pgvector
- **MCP orchestration:** parameter normalization + upsell injection

### 3.6 Sensor & OEM Layer
- **Protocols:** MQTT (Skyline < 100 ms), CAN Bus, URLLC, ISOBUS-XML (ADAPT 1.0)
- **Ingest:** Protobuf → Redis Stream fan-out (100k msg/min target)
- **Quality:** drift detection + 0-100 A-F score in `sensor_data_quality`
- **Governance:** HMAC / mTLS, 5 s TTL, HIL validation mandate

### 3.7 Offline / Survival Layer
- **Service Worker v3:** app-shell, runtime, and data caches
- **Dead reckoning:** step detector + adaptive stride + complementary filter
- **Write inhibition:** > 500 m positional uncertainty blocks DB persistence
- **Sync:** canonical executor `offlineDataSync.ts` reconciles 10 tables

## 4. Deployment Topology

| Environment | URL | Purpose |
|---|---|---|
| Preview | `id-preview--...lovable.app` | Ephemeral per-branch |
| Production Web | `web.soilsidekickpro.com`, `soilsidekickpro.com` | Marketing |
| Production App | `app.soilsidekickpro.com` | Auth’d application |
| Docs | `docs.leafengines.com` | Public docs |
| Sandbox | `sandbox.leafengines.com` | QA hardcoded keys |

## 5. Trust Boundaries

1. **Public Internet → Edge Gateway** — TLS 1.3, WAF
2. **Edge → Edge Functions** — service-role JWT, VPC-internal
3. **Edge Functions → Postgres** — RLS enforced with `authenticated`/`service_role`
4. **Client ↔ Local LLM** — never leaves device; privacy-preserving
5. **Partner (Composio, Skyline) → API** — mTLS + partner key profiles

## 6. Data Flow — Managed Asset Create

```text
Client → POST /assets (x-api-key, Idempotency-Key)
      → Edge fn `assets-crud` validates key (SHA-256 lookup)
      → Checks Idempotency-Key against Redis dedup (24 h)
      → INSERT into public.managed_assets (RLS: owner_id = key.owner)
      → INSERT into public.asset_history (audit)
      → 201 with envelope { data, meta: { version: 1, request_id, confidence } }
```

<lov-artifact url="/__l5e/documents/Assets_Write_Flow.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

## 7. Data Flow — WFS GetFeature

```text
Client → GET /wfs?request=GetFeature&typeName=leafengines:managed_assets
      → Edge fn `wfs-export` validates key
      → SELECT ... WHERE owner_id = key.owner AND is_deleted=false
        [AND ST_Intersects(geom, ST_MakeEnvelope(bbox, 4326))]
        LIMIT min(?limit, 5000)
      → Emits GeoJSON FeatureCollection (or GML if outputFormat=gml)
```

## 8. Scalability

- Horizontal edge functions via provider auto-scale
- Postgres read replicas for analytics workloads
- Redis Streams for telemetry fan-out
- CDN cache on immutable assets and county lookup responses

## 9. Availability & DR

- Multi-AZ Postgres; PITR 7 days
- RTO 4 h / RPO 15 min (standard); URLLC autonomous nodes target sub-minute (`mem://operations/5g-mec-recovery-targets`)
- Backups encrypted; quarterly restore drills

## 10. Observability

- Structured logs via `edge_function_logs`
- Metrics: p50/p95/p99 latency, error rate, saturation
- Tracing: `x-request-id` propagated end-to-end
- Alerts: `cost_alerts`, `sensor_alerts`, `security_monitoring`

## 11. Third-Party Dependencies

| Service | Purpose | SLA |
|---|---|---|
| Google Earth Engine | AlphaEarth embeddings | GEE T&Cs |
| USDA SSURGO | Soil composition | US Gov best-effort |
| EPA WQP | Water quality | US Gov best-effort |
| NOAA | Weather | US Gov best-effort |
| Stripe | Billing | 99.99% |
| Composio | Partner routing | Contract |
| Lovable AI Gateway | GPT-5, Gemma | 99.9% |

## 12. Change Log Alignment
Architecture updates driven by `CHANGELOG.md`; every architecturally significant change requires an ADR in `docs/architecture/adr/`.

## 13. Related Documents
- Technical Design Document
- Security Documentation
- Performance Documentation
- Risk Assessment
