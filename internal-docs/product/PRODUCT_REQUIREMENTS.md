# Product Requirements Document (PRD)

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Product
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Product and audience

SoilSidekick Pro provides soil analysis, location-based crop and planting guidance, seasonal planning, environmental context and AI assistance. SoilCertify supplies complementary source-linked soil/site reports and map-ready information. LeafEngines exposes integration services through REST, MCP and generated SDKs. Recommendations are agronomic context, not verified yield, insurance coverage, damage or claim decisions.

Target audiences include growers, consultants, GIS users, developers and enterprise evaluators. OEM/defense use cases remain subject to their own hardware and safety acceptance gates; no universal autonomy assurance follows from an API integration.

## 2. Source-implemented capability inventory

| Area | Current source and limitation |
|---|---|
| Soil/county | USDA/SDA integration, FIPS lookup and regional degradation; county estimates are not laboratory site measurements |
| Crop guidance | Planting calendar, agricultural intelligence and seasonal planning; qualified review required |
| Environment/water | WQP-derived observations and cached water-quality analysis; monitoring-station proximity, not validated water-body boundary distance |
| Satellite | Satellite context and embeddings; pixel size is not combined-report accuracy |
| Assets/GIS | Managed asset CRUD/history and WFS export paths; concurrency, key verification and polygon interoperability require further validation |
| AI | Hosted AI and browser-local text generation; device/runtime/model availability conditions apply |
| VRT | Hosted AI-generated JSON, predefined/uniform fallbacks and illustrative geometries; not approved operational prescriptions |
| Offline | Cached shell, conditional initialized local reasoning and queued writes; new cloud data/AI requires connectivity |
| Channels | Web, REST, MCP, QGIS and integration packages; registry/release availability checked independently |

## 3. Mandatory integrity and safety requirements

- STRICTLY prohibit database persistence when positional uncertainty exceeds 500m. This is a requirement, not a proven universal control: offline replay and managed-asset writes currently lack an explicit uncertainty check in the inspected paths.
- Preserve validly authenticated advisory requests through non-critical upstream failures with labeled degraded data and error triage. This permissiveness does not authorize unsafe operational payloads, unauthenticated access or bypass of the positional-write prohibition.
- Keep advisory, simulation and approved operational output distinct. Trusted geometry, non-overlap, compatible units, application limits, freshness, provenance and human review are acceptance requirements for operational prescriptions.
- Require manufacturer-specific import/conformance testing and HIL plus Engineering/Safety sign-off before safety-critical OEM operation.
- Assess encryption, RLS/grants and log redaction in the deployed environment; do not equate source or monitoring with independent certification.

## 4. Cache and proposed AI changes

The adaptive TTL formula exists for two water-related paths; its volatility is measurement-derived, not geographic/source-derived. Hierarchical FIPS caching still uses fixed windows. Request-driven refresh can serve stale data on failure; a bounded stale-data policy remains corrective work.

October 30 controller schema/specification files are completed design artifacts, explicitly not implemented. Proposed local structured output must be proven on one supported browser engine and validated independently. Keep hosted AI available during evaluation. Do not promise deterministic agronomic content, universal speedup or automatic equipment readiness.

## 5. Plans and quotas

Consumer plans: Hobby $29/month, Grower $79/month, Pro $149/month. LeafEngines API plans: Free, Starter $149/month, Pro $499/month, Enterprise $1,999/month. Prices describe the recorded plan structure, not a verification of active Stripe settings. Endpoint/key/partner entitlements are separate from client configuration; use `src/lib/sdk-tier-limits.ts` for the client category map, then verify server enforcement.

## 6. Nonfunctional acceptance targets

| Requirement | Status |
|---|---|
| Lightweight local AI summary <100ms on accelerated target hardware | Target; WASM is degraded, not SLA-equivalent |
| L1 cache hit <25ms; impact <2s; recommendation/carbon <3s; multi-agency <5s | Targets needing scoped measurement |
| Online endpoints approximately 1–3s target band | Endpoint-specific, not a universal achieved percentile |
| 50 concurrent edge requests / 2MB payload budget | Design constraints; use pagination/chunking |
| Offline reliable replay, identity isolation and >500m write inhibition | End-to-end release gates, not proved by unit mocks |

## 7. Evidence, distribution and roadmap

QGIS plugin evidence reported October 22: 1,010 downloads since April 5, 2026; authorized headline 1,000+ across 50+ countries. Country detail is approximate and downloads are not unique users or ArcGIS adoption.

Next work: safety controls and provenance first; cache lifecycle/unit normalization and contract reconciliation second; one local structured-generation prototype third; device benchmarks/context-cache/VLM pilots after that. These are priorities, not promised release dates. Old GA labels and empty approval rows do not constitute new release approval.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
