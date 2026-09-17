# Technical Design Document (TDD)

**System:** SoilSidekick Pro / LeafEngines
**Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Scope

Detailed component-level design covering data models, algorithms, module boundaries, and interface contracts for the 3.1.0 release. Complements the Systems Architecture Document with implementation-grade specifics.

## 1.1 Component & Data-Flow Diagrams

**Platform topology** — clients, edge routing, data layer, and third-party sources:

<lov-artifact url="/__l5e/documents/Systems_Architecture.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

**Soil SDA → Edge Function → KV cache** — read-through with hierarchical fallback (L1 county → L2 state → L3 region → L4 national) and graceful degradation when USDA SDA is unreachable:

<lov-artifact url="/__l5e/documents/Soil_SDA_KV_Flow.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

**Managed asset write path** — API-key auth, idempotency dedup, and append-only `asset_history` audit:

<lov-artifact url="/__l5e/documents/Assets_Write_Flow.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

## 2. Module Inventory (Frontend)

```
src/
├── components/        # UI (shadcn-based)
├── pages/             # Route-level views
├── hooks/             # Custom React hooks
├── lib/
│   ├── dead-reckoning/    # step-detector, complementary filter, geodesy
│   ├── error-handling.ts  # Centralized soft-warning classification
│   ├── sdk-tier-limits.ts # Tier quota logic
│   └── utils.ts
├── services/
│   ├── offlineDataSync.ts # Canonical 10-table sync executor
│   ├── embeddingService.ts
│   ├── vectorStorage.ts
│   ├── hapticService.ts
│   └── serviceWorkerErrorTracker.ts
└── integrations/supabase/
```

## 3. Backend Modules (Edge Functions)

| Function | Purpose | Auth |
|---|---|---|
| `get-soil-data` | USDA lookup by FIPS | Free tier |
| `county-lookup` | Fuzzy county search | Free tier |
| `assets-crud` | Managed assets CRUD | API key |
| `wfs-export` | OGC WFS | API key (GetCapabilities open) |
| `mcp-router` | JSON-RPC 2.0 dispatch | API key |
| `stripe-usage-sync` | Metered billing events | Service role |
| `api-error-triage` | Error queue | Service role |
| `alpha-earth-enhance` | Satellite embeddings | API key |
| `visual-crop-analysis` | Image → crop | API key |
| `reverse-geocode` | FCC API adapter | Free tier |
| `send-branded-email` | Auth email webhook | Service role |

## 4. Key Data Models

### 4.0 Core Entity-Relationship Diagram

Reflects the actual schema in `public.*` plus `auth.users`. Note: the request mentioned `county_soils` and `user_gardens` — the equivalent tables in this project are `soil_analyses` (per-user soil records keyed by FIPS) and `fields` (user gardens/plots).

<lov-artifact url="/__l5e/documents/Core_ERD.mmd" mime_type="text/vnd.mermaid"></lov-artifact>

Key relationships:
- `auth.users.id` is the linking anchor for every user-owned row (`profiles.user_id`, `user_roles.user_id`, `api_keys.user_id`, `subscribers.user_id`, `subscription_usages.user_id`, `soil_analyses.user_id`, `fields.user_id`).
- `counties.fips_code` joins `soil_analyses.county_fips` and `subscription_usages.county_fips` for regional analytics.
- Roles are stored **only** in `user_roles` (never on `profiles`); access checks go through `public.has_role(uuid, app_role)`.
- Billing PII (`encrypted_stripe_customer_id`, `encrypted_email`) uses V3 AES-256 in `subscribers`; `encryption_version` tracks the rotation.



### 4.1 `managed_assets`
```sql
CREATE TABLE public.managed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  api_key_id UUID REFERENCES public.api_keys(id),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('point','polygon','sensor')),
  name TEXT NOT NULL,
  geom geometry(Geometry, 4326) NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  version INT NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  idempotency_key TEXT,
  positional_uncertainty_m NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  ... audit + freshness columns
);
```

Indices:
- `GIST(geom)` for WFS bbox filtering
- `UNIQUE(owner_id, idempotency_key) WHERE idempotency_key IS NOT NULL`
- `INDEX(owner_id, is_deleted, updated_at DESC)`

### 4.2 `asset_history`
Append-only audit — captures previous version JSON on every UPDATE/DELETE, keyed by `asset_id`.

### 4.3 `api_keys`
- 29 columns
- `hashed_key` SHA-256; `prefix` (public), `owner_id`, `tier`, `revoked_at`
- RLS: users see only their own; admin via `has_role`

### 4.4 `user_roles`
- Separate table; `app_role` enum (`admin`, `moderator`, `user`)
- Access via `public.has_role(_user_id, _role)` SECURITY DEFINER
- Never store role on `profiles`

## 5. Algorithms

### 5.1 Positional Uncertainty & Write Inhibition
```text
if reading.uncertainty_m > 500 then
    reject write; enqueue to soft warning queue
    emit UI toast "Position uncertain — try again outdoors"
```

### 5.2 Complementary Filter (dead-reckoning)
```
θ = α · (θ_prev + gyro·dt) + (1 - α) · accel_tilt
α ≈ 0.98  (tunable per device profile)
```

### 5.3 Smart LLM Selection
Decision matrix considering:
- Task type (chat, code, vision, embedding)
- Device WebGPU capability (via `TurboQuant`)
- Privacy flag (`no_cloud`)
- Cost budget & tier
Routes to Gemma (local) when latency SLA < 100 ms and payload small; otherwise Lovable Gateway.

### 5.4 API Key Auto-Upgrade (Founders)
Thresholds: 500 / 5,000 / 25,000 lifetime calls → auto bump tier; recorded in `api_keys.tier_history`.

### 5.5 Idempotency
Redis `SETNX idem:{owner}:{key} → asset_id EX 86400`. Second request with same key returns original 201 payload.

### 5.6 Optimistic Locking
```sql
UPDATE managed_assets
   SET ..., version = version + 1
 WHERE id = $1 AND version = $expected AND owner_id = $owner
```
Zero rows → 412 Precondition Failed.

## 6. Interface Contracts

### 6.1 Assets CRUD
```yaml
POST /assets
  headers: x-api-key, Idempotency-Key
  body: ManagedAssetInput
  201: { data: ManagedAsset, meta }
GET /assets?id=&type=&limit=&cursor=
PATCH /assets?id=  headers: If-Match: <version>
DELETE /assets?id=  # soft delete
```

### 6.2 WFS
```yaml
GET /wfs?request=GetCapabilities            # public
GET /wfs?request=GetFeature&typeName=...&bbox=&limit=&outputFormat=
```

## 7. Error Handling Design

- Central classifier `lib/error-handling.ts` maps low-level to `SoftError`, `RetryableError`, `FatalAuthError`.
- Soft errors → toast + non-blocking UI degradation.
- Fatal auth → logout + redirect `/sign-in`.
- Functional errors persisted to `api-error-triage` queue with structured payload.

## 8. Caching Strategy

- **Client:** SW v3 App Shell (immutable), runtime cache for CSS/JS, stale-while-revalidate for county API.
- **Edge:** CDN cache for public GET responses, keyed by URL + tier.
- **DB:** `fips_data_cache` materialized rows refreshed nightly.
- **SDK:** four modes (`off`/`memory`/`disk`/`hybrid`).

## 9. Security Design (see Security Doc)
- V3 AES-256 for PII, key rotation quarterly
- `search_path = ''` mandatory on SECURITY DEFINER functions
- Storage buckets: no permissive anonymous INSERT (telegram-uploads locked)

## 10. Telemetry & Metrics
- `client_telemetry_events` for user-side
- `telemetry_daily_summary` roll-up
- Protobuf ingestion path for high-frequency sensor data

## 11. Concurrency & Backpressure
- Edge fn 50 concurrent — surplus returns 429 with `Retry-After`
- Redis Stream consumer groups for sensor ingestion; back-pressure via lag alert

## 12. Testing Hooks
- `DEMO_MOCK_MODE=true` env bypasses Lovable AI Gateway
- Deterministic sandbox test keys under `sandbox.leafengines.com`

## 13. Feature Flags
- `feature_flags` JSONB on `profiles`; gated per-user rollout
- Edge functions read via cached RPC

## 14. Migration Strategy for 3.1.0 → 3.2.0
- Additive columns only in 3.x branch
- Breaking removals batched into 4.0
- Sunset headers 6 months in advance

## 15. Coding Conventions
- No hardcoded colors; use design tokens (`src/index.css`)
- All colors/gradients via semantic tokens + shadcn variants
- Never store roles on profile tables

## 16. References
- Systems Architecture Document
- API Documentation
- Performance Documentation
