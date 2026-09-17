# Test Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Testing Strategy

Five test tiers, gated in CI:

1. **Unit** — Vitest, isolated pure functions/hooks
2. **Integration** — Vitest + Supabase mocks (`src/test/mocks/supabase.ts`)
3. **Contract** — OpenAPI spec ↔ SDK codegen round-trip
4. **End-to-End** — Playwright against `sandbox.leafengines.com`
5. **Load** — k6 scripts under `load-tests/scripts/`

Coverage target: **≥ 80% lines**, **100% for security-critical modules** (`api_keys`, RLS helpers, encryption, dead-reckoning uncertainty gate).

## 2. Frameworks & Tools

| Purpose | Tool | Version |
|---|---|---|
| Unit / Integration | Vitest | ^4.1.9 |
| React Testing | @testing-library/react | latest |
| E2E | Playwright | bundled |
| API Contract | openapi-diff | pinned |
| Load | k6 | 0.50+ |
| Type-check | tsgo | latest |
| Lint | eslint (flat config) | latest |

## 3. Directory Layout

```
src/test/                    # setup, helpers, fixtures
src/hooks/__tests__/         # hook-level unit tests
src/services/__tests__/      # service tests (offlineDataSync)
src/utils/*.test.ts          # utility tests
load-tests/scripts/          # k6 load scripts
tests/fixtures/              # golden files (skyline mmwave)
plugins/qgis-leafengines/test_wfs_plugin.py
```

## 4. Naming Conventions
- `*.test.ts` / `*.test.tsx` for unit
- `*.spec.ts` for E2E under `e2e/`
- `test-*.js` for k6

## 5. Test Environments

| Env | URL | Data | Reset |
|---|---|---|---|
| Local | `localhost:8080` | seeded | on demand |
| CI (Vitest) | in-memory | mocked | per run |
| Sandbox | `sandbox.leafengines.com` | deterministic | nightly |
| Staging | `staging.app.soilsidekickpro.com` | scrubbed prod | weekly |

## 6. Critical Test Cases

### 6.1 Security
- RLS enforced on `api_keys`, `model_benchmark_results`, `vendor_leads`
- `telegram-uploads` bucket rejects anonymous INSERT
- `has_role` prevents privilege escalation
- SHA-256 API key hashing round-trip

### 6.2 Assets CRUD (3.1.0)
- Idempotency-Key returns identical 201 within 24 h
- If-Match mismatch → 412
- Soft delete preserves history
- RLS isolates owners

### 6.3 WFS Export
- Unauth GetCapabilities returns valid XML
- GetFeature respects `bbox` and 5000 `limit` cap
- outputFormat=gml validates against WFS 2.0 XSD

### 6.4 Offline / Dead Reckoning
- Uncertainty > 500 m blocks DB write
- Sync executor idempotent under duplicate replays
- Service Worker v3 hydrates app shell offline

### 6.5 Performance
- County fuzzy search p95 < 1000 ms
- Local Gemma inference p95 < 100 ms on target hardware
- Edge fn respects 50 concurrency & 2 MB payload

## 7. Load Test Baselines

Baseline metrics recorded in `load-tests/BASELINE_METRICS.md`. Key scripts:

- `test-soil-data.js` — 200 VU, 5 min
- `test-county-lookup.js` — fuzzy search saturation
- `test-sub-100ms-latency.js` — local inference SLA
- `test-agricultural-intelligence.js`, `test-gpt5-chat.js`
- `test-cost-monitoring.js` — Stripe sync path

Pass criteria: p95 within SLA, error rate < 0.5%.

## 8. Regression Suite
- Runs on every PR touching `supabase/functions/**`, `src/**`, `openapi-spec.yaml`
- Full k6 nightly against sandbox
- Weekly HIL (Hardware-in-the-Loop) for OEM safety paths

### 8.1 Public Tool Endpoint Regression (CI, every deploy)

Workflow: `.github/workflows/endpoint-regression.yml` — push to `main`, PRs touching `supabase/functions/**` or `supabase/config.toml`, nightly 06:17 UTC, plus manual dispatch. One matrix job per endpoint.

| Bot command | Function | Test file |
|---|---|---|
| `/soil` | `get-soil-data` | `supabase/functions/get-soil-data/regression_test.ts` |
| `/water` | `territorial-water-quality` | `supabase/functions/territorial-water-quality/regression_test.ts` |
| `/planning-calendar` | `multi-parameter-planting-calendar` | `supabase/functions/multi-parameter-planting-calendar/regression_test.ts` |

Shared helpers: `supabase/functions/_shared/regression-helpers.ts` (call modes: `keyless`, `anon`, `apikey`, `bad-apikey`).

Assertions per endpoint:
- **Keyless** (Telegram bot / MCP free tier) → 200 with payload, never 401/500
- **Anon key** → 200 free tier
- **Invalid `ak_` key** → 401 (never silently downgraded to free tier)
- **Valid `ak_` key** → 200 (skipped unless `REGRESSION_API_KEY` secret is set)
- **Param contract guards** — water requires `fips_code`/`state_code`/`admin_unit_name`; calendar requires `crop_type` (not `crop`); soil rejects non-5-digit FIPS
- **Roll-forward guard** — calendar windows must resolve to a future date
- **CORS preflight** → 200 with `Access-Control-Allow-Origin`

CI secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (required), `REGRESSION_API_KEY` (optional).

## 9. QA Sandbox Rules
- Test keys are hardcoded and public — never gate real data
- Mocks are deterministic (see `mem://quality/sdk-qa-sandbox-api`)
- Rate limit: 10k req/hr per test key

## 10. Offline Beta Test Plan
Eight-step sequence (`mem://quality/offline-resilience-beta-test-plan`):
1. Load app online, prime SW cache
2. Kill network
3. Navigate all core routes
4. Queue writes
5. Attempt local LLM query
6. Restore network
7. Verify sync executor drains queue
8. Verify no plaintext PII leaked

## 11. Accessibility
- WCAG 2.1 AA
- Automated axe-core scan on every PR
- Manual keyboard + screen reader sweep quarterly

## 12. Bug Triage
- Critical (P0): security, data loss → same-day patch
- High (P1): broken flow → next release
- Medium (P2): degraded UX → next minor
- Low (P3): cosmetic → backlog

## 13. Test Data Management
- Sanitized fixtures only in repo
- Real PII strictly prohibited outside prod
- Fixtures under `tests/fixtures/`

## 14. Metrics & Reporting
- Coverage report in `docs/TEST_COVERAGE_REPORT.md`
- Flaky test dashboard reviewed weekly
- Historical trend stored in `kpi_history`

## 15. Related Documents
- Developer Specifications
- Performance Documentation
- Security Documentation
