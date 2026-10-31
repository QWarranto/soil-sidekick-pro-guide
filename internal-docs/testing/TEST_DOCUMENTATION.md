# Test Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Quality / Engineering
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Strategy and evidence levels

Unit/integration, contract, authenticated end-to-end, load, security and HIL validation are distinct gates. Coverage goals of >=80% overall and complete security-critical rule coverage are targets, not current measured coverage. Existing test examples and workflow definitions do not prove execution.

The root package has no test script; use the actual Vitest runner for selected tests. Deno tests cover shared edge logic. Endpoint regression and docs-allowlist workflows are present. Nightly load, weekly HIL, staging resets and accessibility certification are not verified here.

## 2. Executed October 31 checks

| Command | Result | Scope |
|---|---|---|
| `deno test supabase/functions/_shared/volatility-ttl.test.ts` | 5 passed / 0 failed | Formula, floor, clamp, constant CV |
| `bunx vitest run src/services/__tests__/offlineDataSync.test.ts src/test/fipsCache.test.ts` | 34 passed / 0 failed | Mocked sync/table behavior and FIPS cache simulation |

These runs do not prove deployed cache persistence/expiry, WQP response correctness, 500m write inhibition, local browser inference, controller safety or exact-once replay. Docs exposure and rendered public-page checks are recorded in the review after execution.

## 3. Required cache tests

- Persist the derived expiration and honor it on fresh DB-to-memory reads.
- Exercise before/at/after expiry, stale revalidation, failed refresh and bounded stale fallback.
- Separate fixed hierarchical windows from adaptive water paths.
- Verify current parameters produce 24h at volatility 0, 15h at 0.5 and 6h at 1; the 1h floor is not reached with alpha 0.75.
- Validate water-volatility inputs, source-unit normalization and missing-data behavior; geographic/source-derived volatility is not implemented.

## 4. Critical safety and contract tests still required

- >500m must prevent persistence at admission, replay, direct client and server writes. Test 499/500/501m and unknown/non-finite uncertainty according to approved boundary policy; model unreliable >=500m is distinct from the strict >500m persistence rule.
- VRT must not substitute unrelated geometry or label overlapping duplicate zones operationally valid. Test bounds, ring closure, topology, coverage, non-overlap, units, rate limits and missing-data abstention.
- Validate chosen controller schema, timestamps, irrigation totals/durations and adapter conversions independently; then require manufacturer imports/HIL. Function-calling support is not a decoding test.
- Managed-assets source currently returns 200 on repeated idempotency, 409 on supplied stale If-Match, with no proven atomic lock/24h expiry. Test actual behavior plus required concurrency repair separately.
- WFS must distinguish point bbox filtering/GML from polygon intersection/full OGC conformance. Verify owner isolation and key hashing against deployed credentials.
- Auth errors remain errors; do not silently downgrade invalid paid keys to free access. Validate each endpoint/credential mode separately.

## 5. Offline, security and performance

Use the offline beta plan: prime shell/model online; disable network; navigate; queue permitted writes; test initialized local generation; restore connectivity; verify persisted readback and replay identity; inspect PII handling. A mock queue pass is not this end-to-end result.

Security validation includes live grants/RLS, service-role ownership, encrypted-field coverage, secret custody, sessions, OAuth scopes and log redaction. Do not assert certification from tests. Benchmark acceleration with fixed hardware/browser/model/output length; HTTP k6 or simulated WebGPU results do not measure local inference.

## 6. Regression and records

Endpoint regression workflow covers soil, territorial water and planting calendar with public/anon/API-key/invalid-key modes; paid checks can be skipped without a configured credential. Record skips explicitly. Use sanitized fixtures; never commit PII/secrets. Store coverage records in internal-docs/testing, not public docs. Every result needs revision, environment, date, input/fixtures, command, counts and limitations.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
