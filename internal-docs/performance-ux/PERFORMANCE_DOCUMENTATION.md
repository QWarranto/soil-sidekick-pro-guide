# Performance Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Platform / AI / Quality
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Targets, not validated October SLAs

| Operation | Acceptance target |
|---|---|
| Lightweight local AI summary on WebGPU/native acceleration | <100ms |
| L1 cache hit | <25ms |
| Environmental impact assessment | <2s |
| Recommendation including carbon analysis | <3s |
| Multi-agency integration | <5s |
| Online API operations | Endpoint-specific approximately 1–3s |
| Fuzzy county lookup | <1000ms |
| Telemetry scale | 100,000 messages/min target |

General cloud p95 <300ms, web LCP <2.5s, INP <200ms and 99.9% monthly availability remain aspirations unless tied to scoped monitoring. Earlier February baselines are historical, not October measurements. No hardware/production performance benchmark was run in this refresh.

## 2. Cache behavior

| Path | Current policy |
|---|---|
| Hierarchical FIPS | Fixed county 1h / state 6h / region 24h / national 7d |
| Territorial water quality | Adaptive shared memory/DB cache |
| WQP surface-water helper | Adaptive shared memory/DB cache |
| Other direct caches / SDK / SW | Endpoint/client-specific; not automatically adaptive |

Adaptive TTL is `round(max(min_ttl, base_ttl × (1 − clamp(alpha) × clamp(volatility))))`. Current water parameters (24h base, 1h floor, alpha 0.75) yield 6–24h. Volatility is measured contaminant/pooled nutrient spread, not temporal change, geographic scope or source characteristics. Expiration is attempted in DB and remaining lifetime transferred to memory.

Fresh hits bypass refresh; requests trigger refresh after misses/expiry. Stale-while-revalidate and fetch-failure stale fallback mean TTL is not a guarantee that every response is younger than TTL. No precise expiry-time upstream scheduler is established. Explicit stale-age bounds and cache lifecycle/persistence tests remain required.

## 3. AI benchmarking

Separate cold download/initialization, time-to-first-token, total generation, output tokens, concurrency, memory and battery. Record model/dtype/backend/hardware/browser/version and fixed task/input. Sub-100ms lightweight summary target is not unrestricted full-text inference on every device. WASM is degraded and cannot be labeled equivalent to hardware acceleration.

Function-call capability flags, TurboQuant estimates/simulations and external engine benchmarks do not establish real KV compression, browser strict decoding or universal 50% speed gains here. HTTP k6 does not benchmark local token generation. October 30 structured-generation design must first be implemented/proven, then measured.

## 4. Upstream and capacity effects

WQP observations may predate retrieval by years. First-ten-station/500-value caps and missing/unnormalized units affect correctness as well as cost. Station proximity is not water-body geometry. Measure cache hit/miss/fallback separately from provider and AI latency.

Respect 2MB/50-request edge design budgets with pagination/chunking; do not assert Redis backpressure, deployed partitions/replicas or warmers without evidence. Client quotas are not edge-service capacity.

## 5. Regression evidence

Five TTL arithmetic tests and 34 mocked cache/sync tests passed October 31. They are correctness checks, not latency/scale results. Future benchmarks must retain timestamp, revision, device/environment, workload, load window, p50/p95/p99/error counts and exclusions. Alert/bundle/regression thresholds require configured gates and measurements before reporting enforcement.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
