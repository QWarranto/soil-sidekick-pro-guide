# Performance Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Performance Objectives

| Path | Metric | Target |
|---|---|---|
| Public API | p50 latency | < 120 ms |
| Public API | p95 latency | < 300 ms |
| Public API | p99 latency | < 800 ms |
| Local WebGPU LLM | p95 inference | < 100 ms |
| Fuzzy county search | p95 | < 1000 ms |
| Sensor ingestion | Throughput | 100,000 msg/min |
| Web LCP | Median | < 2.5 s |
| Web INP | Median | < 200 ms |
| Availability | Monthly | ≥ 99.9% |
| Error rate | Rolling 5 min | < 0.5% |

## 2. Baselines
Recorded in `load-tests/BASELINE_METRICS.md`. Baselines refreshed after every major release.

## 3. Load Testing

Tools: **k6** scripts in `load-tests/scripts/`.

Key scenarios:
- `test-soil-data.js` — steady 200 VU, 5 min
- `test-county-lookup.js` — spike 500 VU
- `test-sub-100ms-latency.js` — local inference SLA
- `test-agricultural-intelligence.js` — mixed workload
- `test-gpt5-chat.js` — AI streaming latency
- `test-territorial-water-quality.js`
- `test-visual-crop-analysis.js`
- `test-cost-monitoring.js`

Pass criteria: p95 within SLA; error rate < 0.5%; no memory growth on Postgres.

## 4. Latency Budgeting

Illustrative for `GET /soil`:
```
Client TLS      20 ms
Edge routing    10 ms
Function boot   15 ms (warm) / 300 ms (cold)
DB query        40 ms
Response gen    15 ms
Network back    30 ms
-----------------------
Warm total     ~130 ms  (< 300 ms p95 target)
```

## 5. Caching

| Layer | Cache | TTL |
|---|---|---|
| CDN | County lookup, public docs | 5 min |
| Edge fn | FIPS data | 60 min |
| DB | `fips_data_cache` materialized | Nightly |
| SDK | Configurable (`off\|memory\|disk\|hybrid`) | Client-defined |
| Client | SW v3 App Shell | Immutable |

## 6. Database Performance
- pg_trgm GIN on `counties.name` for < 1000 ms fuzzy search
- GIST on `managed_assets.geom` for WFS bbox
- Partitioning on high-volume telemetry
- Read replicas for analytics
- `pgvector` HNSW for embedding search

## 7. Edge Function Constraints & Mitigations
- 50 concurrent — mitigate with streaming + queue backpressure
- 2 MB payload — chunked embeddings, pagination
- Cold starts — hot-path warmers, connection pooling

## 8. AI Performance
- Cloud GPT-5: p95 < 2.5 s streaming first token
- Local Gemma (WebGPU): p95 < 100 ms first token on Chromium 121+ M1/M2 class
- TurboQuant KV cache: 6× memory compression
- Router chooses local when SLA-bound and privacy flagged

## 9. Frontend Performance
- Route-level lazy loading (see `docs/LAZY_LOADING.md`)
- Skeleton loaders on data views
- Image optimization (`docs/IMAGE_OPTIMIZATION.md`)
- Bundle budgets: initial JS < 250 KB gzipped

## 10. Observability

Signals emitted:
- `edge_function_logs.duration_ms`
- `endpoint_activity_snapshots`
- `telemetry_daily_summary`
- Web vitals via `client_telemetry_events`

Dashboards:
- Overview (RPS, error rate, latency)
- Per-endpoint drill-down
- AI cost & latency
- Sensor ingest lag

## 11. Alerting Thresholds

| Alert | Trigger | Severity |
|---|---|---|
| p95 > 300 ms sustained 5 min | edge fn | P2 |
| Error rate > 1% | rolling 5 min | P1 |
| Cold-start rate > 20% | 15 min | P2 |
| DB CPU > 75% | 10 min | P1 |
| Sensor lag > 30 s | continuous | P1 |
| Cost > 120% budget | daily | P2 |

## 12. Capacity Planning
- Reviewed monthly
- Scale plan for 2× projected peak
- Redis stream shards added at > 60% utilization

## 13. Regression Guardrails
- Perf tests block merge on p95 regression > 10%
- Bundle size guard blocks > +5 KB gzipped
- DB explain review required on new queries

## 14. Continuous Improvement
- Quarterly perf review with product & SRE
- Post-mortem for any SLA breach
- KPI history in `kpi_history` table

## 15. Related
- Systems Architecture
- Test Documentation
- Operations & Maintenance
