# Systems Architecture Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Engineering
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Topology and trust boundaries

```text
Web / SDK / QGIS / MCP clients
           | endpoint-specific auth and quotas
Supabase Edge Functions (Deno) ---- Lovable AI Gateway
           |                         hosted AI
Postgres / Auth / Storage
           |
USDA / EPA WQP / weather / satellite providers

React + Vite client
  |-- Service Worker v3 app shell
  |-- Capacitor Preferences write queue -> offlineDataSync.ts
  |-- Transformers.js local text-generation (WebGPU / WASM)
```

The checkout uses React 18, TypeScript, shadcn/Tailwind and TanStack Query. Model, provider, database version, replica, network/WAF and certificate deployment settings require environment checks; do not infer Redis, VPC-private communication or cross-region replication from architecture diagrams.

## 2. API and identity

Supabase JWT sessions and endpoint-specific API-key paths coexist with explicitly permitted public discovery. The app. host is the authenticated application entry point; direct Supabase function URLs are separate from UI hostname routing. Source key-validation behavior is not uniform: shared hashing helpers and managed-assets direct-column lookups require reconciliation. Service-role functions bypass RLS and must implement explicit ownership checks.

The MCP server is `mcp-server`; browser WebMCP is a separate docs/tool bridge. Parameter normalization and invocation auditing exist. Adaptive tool-schema caching and complete OAuth scope enforcement are not established by this review.

## 3. Cache architecture

Hierarchical FIPS windows: county 1h, state 6h, region 24h, national 7d. Other direct cache users do not automatically inherit adaptive expiration.

The shared cache manager optionally computes `round(max(min_ttl, base_ttl × (1 − clamp(alpha) × clamp(volatility))))`, attempts to store `expires_at`, and uses remaining database lifetime in memory. Territorial-water and WQP surface-water paths set base 24h, floor 1h, alpha 0.75, giving 6–24h.

Territorial-water volatility combines contaminant-limit proximity and coefficient of variation of measured/limit ratios. WQP uses pooled nitrate/phosphorus numeric spread. Neither implements geographic-scope/source-characteristic volatility or temporal-change comparison.

Refresh is request-driven: fresh memory/DB hits, miss fetch, optional expired-memory stale/revalidate, and stale DB fallback on upstream failure. There is no upstream refresh timer precisely at expiry. Stale age bounding and persistence-error verification need lifecycle tests.

## 4. Environmental linkage

`getWaterBodyData` supplies the impact engine with WQP station/nutrient data. It retrieves surface-water station records and requests nutrient results for up to ten stations; volatility takes at most 500 pooled values. Units are not validated/normalized before mg/L-labeled aggregates. Field-coordinate distance is nearest returned station; absent coordinates use a density proxy. Regional degradation is labeled, not a measured shoreline distance.

## 5. AI and controller boundary

Hosted VRT calls Gemini through Lovable AI, extracts JSON and parses it. LocalLLMService separately generates text. Capability flags do not establish strict schema-constrained decoding. The October 30 design documents propose a new local controller-payload method; they are not wired into the running source.

VRT fallbacks contain predefined/uniform rates. Zone generation can duplicate whole-field geometry and replace invalid boundaries with an unrelated polygon. Controller-export placeholders/compatibility claims require validation. Introduce independent validation, trusted geometry, abstention, approval and target-specific adapters before operational use; these are recommended changes, not current controls.

## 6. Offline and position integrity

The shell/local model can operate only when prerequisites are cached/initialized. New EPA/USDA requests and hosted AI cannot run without connectivity. The ten-table sync executor validates table names but its create/update paths do not check positional uncertainty. The model's reliability threshold is not proof of a server-wide lock. The >500m persistence prohibition must be enforced across all write/replay paths; exactly-once semantics remain unproved.

## 7. Documentation architecture and operations

Public imports come only from `scripts/docs-allowlist.mjs` and `src/content/publicDocs.generated.ts`; DocsHub and WebMCP share `src/lib/publicDocs.ts`. Never glob docs or publish internal risk, engineering or patent records. Internal ADRs/RFCs belong in internal-docs, not the public docs directory.

Production UI, custom domains, docs and sandbox are distinct entry points. Source inspection is not fresh production verification. DR, backup retention, availability and hardware throughput remain scoped targets pending operational records.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
