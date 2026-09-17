# Product Requirements Document (PRD)

**Product:** SoilSidekick Pro® / LeafEngines™ Agricultural Intelligence Platform
**Version:** 3.1.0
**Last updated:** 2026-07-03
**Owner:** Product — SoilTech Suite, Inc.
**Status:** Approved for GA

---

## 1. Executive Summary

SoilSidekick Pro is a patent-protected agricultural intelligence platform that fuses USDA SSURGO soil data, EPA water quality feeds, NOAA weather, Google Earth Engine (AlphaEarth) satellite embeddings, and on-device sensor fusion to deliver ground-truthed field-level insights. The platform is delivered as a hosted web application, a multi-channel API (REST + MCP), auto-generated SDKs across six languages, and native integrations for QGIS, n8n, Node-RED, ClawHub, and Claude.

The 3.1.0 release adds first-class **managed asset CRUD** and **OGC WFS export**, promoting the product from a read-only intelligence service to a full GIS system-of-record for point, polygon, and sensor assets.

## 2. Vision & Positioning

> "Space gives the picture. We give the truth."

LeafEngines positions itself as the **survival / trust layer for physical AI** — the offline-first, GPS-independent verification substrate that makes autonomous physical systems safe to operate in disconnected, contested, or GPS-denied environments (agriculture, mining, forestry, defense, disaster response). The horizontal PNT market opportunity is estimated at $1.2T.

## 3. Target Users & Personas

| Persona | Primary Need | Success Metric |
|---|---|---|
| Precision-Ag Agronomist | County-level soil analysis, VRT prescriptions | Report generated < 30 s |
| Agricultural Consultant | Client-ready PDF, planting calendars | ≥ 172% resale margin |
| Enterprise OEM (Skyline, John Deere) | Sub-100 ms sensor ingestion at 100k msg/min | 99.9% uptime, < 100 ms p95 |
| Developer / AI Engineer | MCP tools, SDKs, offline inference | Time-to-first-call < 5 min |
| Government / Defense | Assured PNT, offline operation, audit trail | 500 m write-inhibition enforced |
| Hobbyist / Consumer | Plant identification, care schedules | Free tier without signup |

## 4. Product Pillars

1. **Data Integrity First** — 500 m positional-uncertainty write-inhibition; V3 AES-256 PII encryption; data-quality envelope on every response.
2. **Offline Survival Layer** — Service Worker v3 app shell, Capacitor write queue, WebGPU local Gemma inference (< 100 ms).
3. **Horizontal Distribution** — Nine channels: web, direct API, MCP, ClawHub, Claude Skill, n8n, Node-RED, QGIS plugin, Telegram bot.
4. **Permissive Freemium Funnel** — `x-free-tier: true` and `leaf-test-370df0a2e62e` keyless discovery; auto-upgrade at 500 / 5k / 25k call thresholds.
5. **Compliance-Grade Governance** — SOC 2 Type 1, ISA TRAQ, GMP, FDA, CEJST alignment.

## 5. In-Scope Functional Requirements (v3.1.0)

### 5.1 Soil & Environmental Intelligence
- USDA SSURGO composition, pH, NPK, drainage, texture for any US county
- EPA Water Quality Portal (400+ agencies), NOAA weather integration
- Environmental Compatibility Score (patent-pending)
- Carbon Credit Calculator, VRT prescription generator
- AlphaEarth 64-dim semantic embeddings @ 10 m pixel resolution

### 5.2 Managed Assets (NEW in 3.1.0)
- `listAssets`, `createAsset`, `updateAsset`, `deleteAsset` (soft-delete)
- Idempotency-Key header on create
- Optimistic locking via `If-Match` matching `version`
- Full audit history in `asset_history` table

### 5.3 WFS Export (NEW in 3.1.0)
- `GetCapabilities` (unauthenticated) and `GetFeature` (API key required)
- Output: GeoJSON (default) or GML via `outputFormat`
- `bbox` filtering, `limit` up to 5000

### 5.4 AI Services
- GPT-5 chat, agricultural intelligence, seasonal planning
- Smart report summaries, visual crop analysis
- Local Gemma routing with TurboQuant KV-cache 6× memory compression

### 5.5 Consumer Plant Care API v2
- Safe identification with jurisdiction-scoped chemical warnings
- Dynamic care variables, progressive-jargon endpoints
- Localized safety limits from FIPS regulatory cache

### 5.6 Sensor & OEM Integration
- MQTT ingestion, CAN Bus, URLLC, ISOBUS-XML (ADAPT 1.0)
- 0-100 (A-F) data-quality score with drift detection
- HMAC / mTLS with 5 s TTL for OEM telemetry

### 5.7 Auth & Billing
- Supabase Auth + JWT; `app.` subdomain required for authenticated routes
- SHA-256 hashed API keys (`SS_API_{prefix}_2025`)
- Stripe metered billing via `stripe-usage-sync`
- Founders Program auto-upgrade thresholds

## 6. Out of Scope (v3.1.0)
- Multi-tenant white-label console (deferred to 3.2)
- Non-US SSURGO equivalents (EU LUCAS deferred)
- Real-time collaborative field editing
- Native iOS/Android apps outside Capacitor wrapper

## 7. Non-Functional Requirements

| Category | Target |
|---|---|
| API p95 latency | < 300 ms (cloud), < 100 ms (local WebGPU) |
| Availability | 99.9% monthly |
| Data residency | US-East (primary), configurable enterprise |
| Concurrent connections | 50 per edge function, 100k msg/min telemetry |
| PII encryption | AES-256 V3 at rest, TLS 1.3 in transit |
| Positional integrity | Write-inhibited > 500 m uncertainty |
| Offline mode | 100% read-only core, queued writes |

## 8. Pricing Tiers

| Tier | Price | Calls | Notes |
|---|---|---|---|
| Free | $0 | Test key + `x-free-tier` | Soil, county, TurboQuant |
| Hobby (SSP) | — | Consumer | Renamed from legacy |
| Starter | $149/mo | 10k | Founder locked |
| Grower (SSP) | — | Consumer | Renamed |
| Pro | $499/mo | 35k | |
| Pro (SSP) | — | Consumer | Renamed |
| Enterprise | $1,999/mo | 175k+ | SLA + white-label |
| Enterprise Bundle | $3,499/mo | 685k | Max volume OEM |

## 9. Success Metrics (North-Star KPIs)

- 750+ active developers globally (achieved June 2026)
- A-Excellent MCP World verified rating (achieved)
- < 100 ms p95 for local WebGPU inference
- < 1000 ms fuzzy county search (pg_trgm GIN)
- Zero PII plaintext leaks (V3 encryption enforced)
- ≥ 90% offline sync success on reconnect

## 10. Constraints & Assumptions
- Lovable Cloud (Supabase) is the sole managed backend
- Client-side app is React 18 + Vite 5 + Tailwind v3 + TypeScript 5
- WebGPU limited to Chromium 121+; degraded to WASM elsewhere
- Free tier bypasses JWT via `x-free-tier` header for `get-soil-data` and `county-lookup`
- Authenticated endpoints require `app.` subdomain

## 11. Release Milestones

| Release | Date | Highlights |
|---|---|---|
| 3.0.0 | 2026-06-25 | Initial GA of 6-language SDK |
| 3.1.0 | 2026-07-02 | Managed Assets CRUD + WFS Export |
| 3.2.0 | 2026-Q4 | White-label console, EU LUCAS |
| 4.0.0 | 2027-Q2 | Defense DV005 GA, ARL-hardened PNT |

## 12. Dependencies
- Google Earth Engine (AlphaEarth)
- USDA SSURGO, EPA WQP, NOAA
- Stripe (metered billing)
- Supabase (Postgres, Auth, Edge Functions, Storage)
- Lovable AI Gateway (GPT-5, Gemma routing)
- Composio (partner API, 10k req/hr)

## 13. Risks (see Risk Doc for full analysis)
- WebGPU browser fragmentation
- Satellite feed outages (AlphaEarth)
- GHSA advisories on transitive deps (mitigated via automated scan)
- Free-tier abuse (mitigated via anonymous_api_usage IP-hash quota)

## 14. Approvals
| Role | Name | Date |
|---|---|---|
| Product Lead | — | 2026-07-03 |
| Engineering Lead | — | 2026-07-03 |
| Security Officer | — | 2026-07-03 |
| Legal | — | 2026-07-03 |
