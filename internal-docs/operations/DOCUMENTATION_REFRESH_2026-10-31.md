# System Documentation Review — October 31, 2026

**Classification: Internal Only**
**Last updated:** 2026-10-31
**Status:** Source-reviewed documentation revision; release, security, operational and counsel approvals not inferred

## Scope and dates

The requested 13-document set has been reviewed against the current checkout and the supplied October 30 controller-payload schema and implementation specification. July 3, 2026 was the displayed date on most canonical documents; the user guide in this checkout instead displayed July 10. File history, displayed dates, documentation review dates, SDK versions and deployment dates are distinct records.

October 6 deployment of adaptive caching was reported and validated in the earlier engineering work. This review confirms the corresponding source and reruns its arithmetic tests; it does not independently re-establish that deployment date or retest the production endpoints. No runtime behavior, hosted configuration or patent filing is changed by this documentation refresh.

## Status vocabulary

| Label | Meaning |
|---|---|
| Source implemented | Current checkout contains the relevant path; successful deployment is not implied |
| Executed validation | A named check was run with a recorded result |
| Known limitation | Source-backed gap or unsafe placeholder |
| Requirement / target | Must be implemented or demonstrated; not a statement of achieved performance |
| Proposed design | Artifact exists, but executable implementation is not established |
| External verification required | Hosted settings, auditor evidence, contracts, hardware or counsel must establish the claim |

## Canonical inventory

| Document | Current source |
|---|---|
| Product Requirements | `internal-docs/product/PRODUCT_REQUIREMENTS.md` |
| Developer Specifications | `docs/sdk/DEVELOPER_SPECIFICATIONS.md` |
| Systems Architecture | `internal-docs/architecture/SYSTEMS_ARCHITECTURE.md` |
| Test Documentation | `internal-docs/testing/TEST_DOCUMENTATION.md` |
| User Documentation | `docs/user/USER_DOCUMENTATION.md` |
| Operations and Maintenance | `internal-docs/operations/OPERATIONS_MAINTENANCE.md` |
| API Documentation | `docs/api/API_DOCUMENTATION.md` |
| Security Documentation | `internal-docs/security/SECURITY_DOCUMENTATION.md` |
| Change Management | `internal-docs/operations/CHANGE_MANAGEMENT.md` |
| Risk Assessment and Mitigation | `internal-docs/risk/RISK_ASSESSMENT.md` |
| Performance Documentation | `internal-docs/performance-ux/PERFORMANCE_DOCUMENTATION.md` |
| Compliance and Legal | `docs/compliance/COMPLIANCE_LEGAL.md` with internal legal review notes |
| Project Management | `internal-docs/program/PROJECT_MANAGEMENT.md` |

Legacy PRD, internal IP-oriented developer specification, older internal API reference, quality test reference and operational reference are historical records, not competing current specifications. The nested backup source tree is not the active documentation set.

## Source evidence and corrections

- `supabase/functions/_shared/volatility-ttl.ts`: rounded TTL formula with alpha/volatility clamped to [0,1]. Territorial water quality uses contaminant-limit proximity and spread; WQP uses pooled nutrient spread. Neither score assesses geographic scope or data-source characteristics. Current configuration is 24h base / 1h floor / alpha 0.75, yielding 6–24h. Hierarchical FIPS windows remain fixed at 1h / 6h / 24h / 7d.
- `_shared/api-cache-manager.ts`: attempts to persist `expires_at`, honors stored expiration on database reads, fetches on misses, supports stale-while-revalidate and stale fallback on fetch failure. Refresh is request-driven, not a timer-triggered upstream refresh exactly at expiry. Stale fallback lacks an explicit age ceiling; successful persistence must be independently verified rather than inferred from the log.
- `_shared/wqp-water-bodies.ts`: surface-water monitoring stations, first ten stations for nitrate/phosphorus retrieval, combined first 500 numeric values for volatility. No validated unit normalization or time-series comparison. Distance is to a returned station, or a density proxy, not a water-body boundary.
- `src/services/localLLMService.ts`: browser text-generation path; no implemented `generateAgronomicPayload()` strict schema-decoding method established. A function-calling capability flag is not an enforced decoding mechanism.
- `supabase/functions/generate-vrt-prescription/index.ts`: hosted Gemini AI with JSON extraction/parsing; predefined and uniform fallback recommendations; duplicated whole-boundary zones and unrelated fixed polygon on invalid boundary. These are not operationally validated prescriptions.
- `src/services/offlineDataSync.ts`: canonical executor for ten allowed tables. Create/update paths have no positional uncertainty check. `assets-crud` also lacks this check. The >500m persistence prohibition remains mandatory, but universal enforcement is not demonstrated and must not be claimed.
- `supabase/functions/assets-crud/index.ts`: owner scoping, soft delete, history attempts; repeat idempotency returns 200, optional If-Match mismatch returns 409, GET caps at 1000. No proven atomic concurrency guard, 24h dedup expiry or cursor contract.
- `supabase/functions/wfs-export/index.ts`: public capabilities, owner-scoped feature retrieval, cap 5000, post-query coordinate bbox filtering and point-oriented GML; not verified polygon-intersection filtering or universal OGC conformance.
- `src/lib/sdk-tier-limits.ts`: current client quota configuration differs from old documentation and OpenAPI prose; server/partner/key overrides must be separately verified.
- `sdks/generated/php/composer.json`: PHP ^8.1, Guzzle ^7.9, PSR-7 ^2.7, PHPUnit ^10.5. PHP is a client SDK, not the application backend; artifact version remains 3.0.0. Published registry versions and Composer execution not verified here.
- `src/integrations/supabase/client.ts`: persisted Supabase sessions via preview-aware storage; do not claim tokens never use localStorage. Source migrations/monitoring are not certification evidence.
- `scripts/docs-allowlist.mjs`, `src/lib/publicDocs.ts`: public allowlist and runtime marker filter. Internal mechanisms, risk records and patent notes remain internal.

## Executed validation on October 31

- `deno test supabase/functions/_shared/volatility-ttl.test.ts`: **5 passed, 0 failed**.
- `bunx vitest run src/services/__tests__/offlineDataSync.test.ts src/test/fipsCache.test.ts`: **34 passed, 0 failed** across two files. These use mocks/simulations; they do not prove live persistence, exactly-once delivery, 500m enforcement or browser offline operation.
- Documentation exposure and browser rendering checks are recorded in the closing validation section after execution.

## Proposed design artifacts acknowledged

The uploaded `agronomic-controller-payload.schema.json` and `AGRONOMIC_PAYLOAD_CONSTRAINED_DECODING_SPEC.md` are real design deliverables dated October 30, 2026. They were read for this refresh, not imported into execution paths. The specification explicitly says not implemented. The JSON is a container of three selectable contracts, not an enforcing top-level payload schema. Geometry, unit consistency, numeric operating limits, time checks, abstention and independent agronomic validation need additional controls.

Strict function/tool calling, deterministic content, a universal 50% speedup, a browser-compatible ONNX Runtime GenAI replacement, and drop-in controller export compatibility are proposals/assertions requiring proof. Preserve the hosted path during evaluation; do not describe its AI output as non-AI.

## Open compensating engineering work

1. Enforce the >500m write prohibition across admission, replay, direct/server writes; test boundary and bypass cases.
2. Separate advisory/simulation from approved operational payloads. Validate trusted field geometry, non-overlap, units, limits and freshness independently of the model; require human approval and HIL/vendor checks.
3. Bound degraded/stale data and expose source completeness, retrieval and observation times. Validate WQP units and water-body distance semantics.
4. Prove one local structured-generation backend with the selected schema; then benchmark supported devices. Keep schemas/specification dates separate from implementation/deployment dates.
5. Reconcile OpenAPI descriptions, server enforcement and SDK quota/auth contracts; verify managed-assets key hashing and concurrency behavior.
6. Verify live grants/RLS, encryption migration and rotation, MCP OAuth scope enforcement, certificate/backup/retention settings and independent audit evidence.

These actions are recommendations, not completed remediation or committed delivery dates.