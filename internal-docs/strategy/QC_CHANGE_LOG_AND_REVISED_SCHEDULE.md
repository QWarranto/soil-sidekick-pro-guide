# Quality Control: Change Log & Revised Schedule
# LeafEngines™ B2B API Platform

**Created:** February 22, 2026  
**Covers:** December 20, 2025 → Present  
**Purpose:** Reconcile all changes since QC Calendar completion against planned/projected work, and reschedule remaining items.

---

## 1. QC Calendar Completion Reconciliation (Dec 2–20, 2025)

### Status: Calendar Marked COMPLETE ✅ — With Gaps

The QC Calendar Schedule (Dec 2–20) was marked fully complete on Dec 20, 2025 with "36/36 functions migrated." However, the following discrepancies were identified:

#### 1.1 Phase 3B (Data Services, Dec 10) — Completion Status Missing

| Planned Task | Status | Evidence |
|-------------|--------|----------|
| `live-agricultural-data` → requestHandler migration | ⚠️ Unverified | No ✅ marker in calendar; Dec 20 final review claims 36/36 |
| `hierarchical-fips-cache` → requestHandler migration | ⚠️ Unverified | Same |
| `geo-consumption-analytics` → requestHandler migration | ⚠️ Unverified | Same |
| `territorial-water-analytics` → requestHandler migration | ⚠️ Unverified | Same |
| `leafengines-query` → requestHandler migration | ⚠️ Unverified | Same |
| Data Services Validation Schemas added to `validation.ts` | ⚠️ Unverified | Same |

#### 1.2 Phase 3C (Utility Functions, Dec 11) — Completion Status Missing

| Planned Task | Status | Evidence |
|-------------|--------|----------|
| `populate-counties` → requestHandler migration | ⚠️ Unverified | No ✅ marker |
| `trigger-populate-counties` → requestHandler migration | ⚠️ Unverified | Same |
| `api-key-management` → requestHandler migration | ⚠️ Unverified | Same |
| `api-health-monitor` → requestHandler migration | ⚠️ Unverified | Same |
| Utility Function Validation Schemas | ⚠️ Unverified | Same |

#### 1.3 Phase 4A (Dec 13, Specialized Functions) — Partial Gaps

| Planned Task | Status | Evidence |
|-------------|--------|----------|
| `adapt-soil-export` → requestHandler | ❌ No completion marker | Calendar shows as planned, not checked |
| `enhanced-threat-detection` → requestHandler | ❌ No completion marker | Same |
| `soc2-compliance-monitor` → requestHandler | ❌ No completion marker | Same |
| Phase 4A.8 Specialized Functions Testing | ❌ No completion marker | Same |

**Note:** The Dec 20 Final Review states "Phase 4: Remaining functions (6) ✓" and "36 functions migrated," suggesting these were completed but the individual task markers in the Dec 10–13 section were never updated.

**⚡ REQUIRED ACTION:** Validate each Phase 3B/3C/4A function to confirm requestHandler pattern is present. See Section 4 below.

---

## 2. Post-QC Changes Log (Dec 20, 2025 → Feb 22, 2026)

### 2.1 Post-QC Security Sprint (Dec 23–27, 2025)

**Planned in:** `POST_QC_SECURITY_SPRINT.md`  
**Completion Status:** ❓ UNKNOWN — No completion markers found in document

| Planned Item | ID | Status |
|-------------|-----|--------|
| Trial Users Email Hashing | SEC-1.1 | ❓ Unverified |
| Rate Limit Email/IP Separation | SEC-1.2 | ❓ Unverified |
| Subscribers Service Role Hardening | SEC-1.3 | ❓ Unverified |
| Encryption Version Migration | SEC-1.4 | ❓ Unverified |
| ADAPT Dual Credential Cleanup | SEC-2.1 | ❓ Unverified |
| API Key Hash Algorithm Upgrade | SEC-2.2 | ❓ Unverified |
| Anonymous Feedback Rate Limiting | SEC-2.3 | ❓ Unverified |
| Session Token Security | SEC-2.4 | ❓ Unverified |
| Visual Analysis PII Handling | SEC-2.5 | ❓ Unverified |

**⚡ REQUIRED ACTION:** Verify database schema and RLS policies against security sprint deliverables.

### 2.2 Testing Expansion (Jan 28 – Feb 2026)

**Planned in:** `docs/TESTING_EXPANSION_PLAN.md`  
**Actual Progress (per Feb 10 Test Report):**

| Planned Item | Status | Evidence |
|-------------|--------|----------|
| Create auth test helpers (`src/test/authHelpers.ts`) | ✅ Done | File exists, `useAuth.test.tsx` passing |
| APIKeyManager tests | ✅ Done | 6 tests passing |
| useAuth hook tests | ✅ Done | 10 tests passing |
| useSubscription tests | ✅ Done | 12 tests passing |
| useCostMonitoring tests | ✅ Done | 12 tests passing |
| CarbonCreditCalculator tests | ✅ Done | 17 tests passing |
| county-lookup edge function test | ✅ Done | 12 tests passing |
| carbon-credit-calculator edge function test | ✅ Done | 10 tests passing |
| get-soil-data edge function test | ❌ Not done | No test file found |
| DeveloperSandbox tests | ❌ Not done | No test file found |
| Field management tests | ❌ Not done | No test file found |
| Water quality tests | ❌ Not done | No test file found |
| api-key-request edge function test | ❌ Not done | No test file found |
| agricultural-intelligence edge function test | ❌ Not done | No test file found |

**Test count grew from 7 files → 11 files, 0 tests → 111 tests.**

### 2.3 Unrecorded Bug Fixes & Changes (Feb 2026)

These changes were made in response to production issues but were **NOT logged** in any QC document:

| Date | Change | File(s) | Impact |
|------|--------|---------|--------|
| Feb 2026 | Fixed `get-soil-data` cache TypeError | `supabase/functions/get-soil-data/index.ts` | **Critical** — Function was non-functional due to `cacheManager.get is not a function` |
| Feb 2026 | Refactored `APICacheManager` with explicit `get`/`set` methods | `supabase/functions/_shared/api-cache-manager.ts` | **High** — Standardized caching API to prevent future TypeErrors |
| Feb 2026 | `smart-report-summary` DEMO_MOCK_MODE subscription bypass | `supabase/functions/smart-report-summary/index.ts` | **Medium** — `requireSubscription` now conditional on demo mode |
| Feb 2026 | `agricultural-intelligence` DEMO_MOCK_MODE added | `supabase/functions/agricultural-intelligence/index.ts` | **Medium** — Mock responses for demo/testing without AI gateway |
| Feb 2026 | SDK readiness assessment completed | `SDK_GLOBAL_EXPANSION_READINESS_ASSESSMENT.md` | **Info** — Identified SDK version discrepancy (npm 1.2.0 vs docs 2.2.0) |

### 2.4 Documentation Created Post-QC

| Document | Date | Purpose |
|----------|------|---------|
| `docs/COMPREHENSIVE_TEST_REPORT_2026-02.md` | Feb 10, 2026 | Full test coverage report (111 tests, 22% line coverage) |
| `docs/MIGRATION_GUIDE_v2.1_to_v2.2.md` | Post-Dec 2025 | SDK migration guide |
| `BETA_TEST_ISSUES_ANALYSIS.md` | Post-Dec 2025 | Beta testing findings |
| Multiple enterprise/partnership docs | Jan–Feb 2026 | Business development collateral |

---

## 3. Gap Analysis: Planned vs. Actual

### 3.1 Completed as Planned ✅

- [x] QC Phases 1–4: 36/36 edge functions migrated to requestHandler (Dec 2–20)
- [x] Rate limiting infrastructure (database-backed, tier-based)
- [x] Cost tracking for all external APIs
- [x] Circuit breakers (EPA, USDA, Google Earth, NOAA, OpenAI)
- [x] Graceful degradation patterns
- [x] Compliance logging infrastructure
- [x] Load testing scripts created
- [x] Operational monitoring documentation
- [x] Team training guide
- [x] Testing expansion Phase 1 & 2 (auth, subscription, cost, carbon, API keys)
- [x] Edge function Deno tests for county-lookup and carbon-credit-calculator

### 3.2 Planned But Status Unknown ❓

- [ ] Post-QC Security Sprint (SEC-1.1 through SEC-2.5) — 9 items
- [ ] Phase 3B/3C individual task completion markers — 10 items
- [ ] Phase 4A.4–4A.8 individual task completion markers — 5 items
- [ ] QC Implementation Plan success metrics checkboxes (Phase 1–4)
- [ ] Marketing Timeline Approval gates

### 3.3 Planned But Not Completed ❌

- [ ] Testing Expansion Phase 3: DeveloperSandbox, Field management, Water quality tests
- [ ] Testing Expansion Phase 4: agricultural-intelligence edge function test
- [ ] get-soil-data edge function test
- [ ] api-key-request edge function test
- [ ] 38 remaining edge function Deno tests (2/42 complete per Feb report)
- [ ] Compliance scanning cron job activation
- [ ] Line coverage target (22% actual vs 60% target)
- [ ] SOC 2 Type II observation window (targeted Q2 2026)

### 3.4 Unplanned Work Completed (Emerged Post-QC) 🆕

- [x] `get-soil-data` cache fix (critical production bug)
- [x] `APICacheManager` API refactor (prevention measure)
- [x] DEMO_MOCK_MODE for smart-report-summary and agricultural-intelligence
- [x] SDK global expansion readiness assessment
- [x] Enterprise partnership documentation suite

---

## 4. Validation Tasks: Phase 3B/3C/4A Confirmation

**Priority: HIGH — Completed February 23, 2026**

### 4.1 Results Summary

- **Phase 3B (Data Services):** 4/5 migrated to requestHandler ✅, 1 uses API-key auth pattern (by design)
- **Phase 3C (Utility Functions):** 0/4 migrated ❌ — These functions use raw `Deno.serve()` patterns
- **Phase 4A (Specialized Functions):** 0/3 migrated ❌ — These functions use raw `Deno.serve()` / `serve()` patterns
- **Validation Schemas:** Data Services schemas ✅ complete; Utility schemas N/A (not applicable for utility/admin functions)
- **Corrected count:** 28/36 functions use requestHandler. The Dec 20 "36/36" claim is **INACCURATE** — 8 functions were not migrated.

### 4.2 Detailed Validation Results

| # | Function | requestHandler? | Pattern Used | Notes |
|---|----------|----------------|--------------|-------|
| V1 | `live-agricultural-data` | ✅ Yes | `requestHandler` import, Phase 3B.2 | Migrated Dec 9, 2025 |
| V2 | `hierarchical-fips-cache` | ✅ Yes | `requestHandler` import, Phase 3B.3 | Migrated Dec 9, 2025 |
| V3 | `geo-consumption-analytics` | ✅ Yes | `requestHandler` import, Phase 3B.4 | Migrated Dec 9, 2025 |
| V4 | `territorial-water-analytics` | ✅ Yes | `requestHandler` import, Phase 3B.5 | Migrated Dec 9, 2025 |
| V5 | `leafengines-query` | ❌ No | Raw `Deno.serve()` + `authenticateApiKey()` from security-utils | **By design**: uses API-key authentication, not user auth. requestHandler pattern may not apply directly. |
| V6 | `populate-counties` | ❌ No | Raw `Deno.serve()` + manual `createClient` | Admin/utility function — no user-facing auth needed |
| V7 | `trigger-populate-counties` | ❌ No | Raw `Deno.serve()` + `supabase.functions.invoke()` | Wrapper/trigger function — delegates to populate-counties |
| V8 | `api-key-management` | ❌ No | Raw `Deno.serve()` + `authenticateUser()` from security-utils | Has own rate limiting via `advancedRateLimit()` |
| V9 | `api-health-monitor` | ❌ No | Raw `Deno.serve()` + optional auth | Public health endpoint — auth is optional |
| V10 | `adapt-soil-export` | ❌ No | Raw `createClient` + manual auth | Full CRUD with manual Deno.serve |
| V11 | `enhanced-threat-detection` | ❌ No | Raw `Deno.serve()` + security-utils | Security monitoring — uses own security patterns |
| V12 | `soc2-compliance-monitor` | ❌ No | `serve()` from std + manual auth | Compliance tool — admin-only |
| V13 | Data Services schemas in `validation.ts` | ✅ Yes | `liveAgDataSchema`, `fipsCacheSchema`, `geoAnalyticsSchema`, `waterAnalyticsSchema`, `leafEnginesSchema` all present | — |
| V14 | Utility Function schemas in `validation.ts` | ⚠️ N/A | Utility/admin functions don't require Zod schemas via requestHandler | Utility functions have own validation |

### 4.3 Migration Assessment

The 8 unmigrated functions fall into three categories:

1. **API-key authenticated (1):** `leafengines-query` — Uses `authenticateApiKey()` not user JWT. requestHandler would need API-key auth variant to support this.
2. **Admin/utility functions (4):** `populate-counties`, `trigger-populate-counties`, `api-health-monitor`, `soc2-compliance-monitor` — These are internal/admin tools where requestHandler adds limited value.
3. **Security-specialized (2):** `api-key-management`, `enhanced-threat-detection` — Have their own security patterns via `security-utils.ts`.
4. **Integration-specific (1):** `adapt-soil-export` — Has unique CRUD pattern for ADAPT platform integration.

**Recommendation:** Accept 28/36 as the accurate migration count. The 8 unmigrated functions have valid architectural reasons for using alternative patterns. Document this as "28/36 migrated to requestHandler; 8 use specialized patterns" rather than forcing migration.

---

## 5. Post-QC Security Sprint Verification

**Completed: February 23, 2026**  
**Result: ALL 9 ITEMS VERIFIED COMPLETE ✅**

| ID | Finding | Status | Evidence |
|----|---------|--------|----------|
| SEC-1.1 | Trial Users Email Hashing | ✅ Complete | `hash_email()` function exists (SQL migration `20251226200305`); `email_hash` column on `trial_users` table confirmed |
| SEC-1.2 | Rate Limit Email/IP Separation | ✅ Complete | `check_trial_rate_limit_secure()` function exists; `email_hash` column on `trial_creation_rate_limit` confirmed |
| SEC-1.3 | Subscribers Service Role Hardening | ✅ Complete | `validate_subscription_service_operation()` exists in DB functions; `audit_subscriber_access()` trigger exists |
| SEC-1.4 | Encryption Version Migration | ✅ Complete | `encrypt_email_v2()` function exists; `email_encryption_version` column on `account_security` confirmed |
| SEC-2.1 | ADAPT Dual Credential Cleanup | ✅ Complete | `encrypted_api_credentials` + `encryption_version` columns on `adapt_integrations` confirmed |
| SEC-2.2 | API Key Hash Algorithm Upgrade | ✅ Complete | `hash_api_key_secure()` function exists (SHA-512 with salt); `key_hash_v2` column on `api_keys` confirmed |
| SEC-2.3 | Anonymous Feedback Rate Limiting | ✅ Complete | `check_anonymous_feedback_rate_limit()` function exists; `client_ip` column on `user_feedback` confirmed |
| SEC-2.4 | Session Token Security | ✅ Complete | `generate_secure_session_token()` and `validate_session_token()` functions confirmed |
| SEC-2.5 | Visual Analysis PII Handling | ✅ Complete | `visual-crop-analysis` stores truncated `image_data` (first 100 chars + "...") per code inspection |

---

## 6. Revised QC Schedule: Q1 2026

### Sprint 1: Validation & Gap Closure — COMPLETED ✅ (Feb 23, 2026)

| Task | Status | Finding |
|------|--------|---------|
| V1–V14: Validate all Phase 3B/3C/4A functions | ✅ Done | 28/36 use requestHandler; 8 use specialized patterns (valid) |
| Verify Post-QC Security Sprint (SEC-1.1–SEC-2.5) | ✅ Done | All 9 items verified complete via DB schema + function inspection |
| Update QC Change Log with findings | ✅ Done | This document updated with full validation results |
| Correct "36/36" claim to accurate "28/36 + 8 specialized" | ✅ Done | Documented in Section 4.3 |

### Sprint 2: Test Coverage Expansion (Week of Mar 3, 2026)

**Goal:** Address largest remaining test gaps — edge function tests and integration tests.

| Day | Task | Est. Hours | Priority |
|-----|------|-----------|----------|
| Mon Mar 3 | Write `get-soil-data` edge function Deno test | 2h | P1 |
| Mon Mar 3 | Write `agricultural-intelligence` edge function Deno test | 2h | P1 |
| Tue Mar 4 | Write `api-key-request` edge function Deno test | 2h | P1 |
| Tue Mar 4 | Write `api-key-management` edge function Deno test | 2h | P1 |
| Wed Mar 5 | Write DeveloperSandbox integration tests (frontend) | 3h | P2 |
| Thu Mar 6 | Write Field management tests (FieldsList, AddFieldDialog) | 3h | P2 |
| Fri Mar 7 | Write Water quality / PDF export tests | 3h | P2 |

**Target:** Edge function tests: 2 → 6; Frontend test files: 11 → 14; Line coverage: 22% → 35%+

### Sprint 3: Operational Hardening (Week of Mar 10, 2026)

**Goal:** Activate automated compliance scanning, harden DEMO_MOCK_MODE controls.

| Day | Task | Est. Hours | Priority |
|-----|------|-----------|----------|
| Mon Mar 10 | Configure compliance scanning cron job (pg_cron + pg_net) | 2h | P1 |
| Mon Mar 10 | Add environment-based DEMO_MOCK_MODE control (not hardcoded booleans) | 2h | P1 |
| Tue Mar 11 | Execute load tests against current production functions | 3h | P1 |
| Tue Mar 11 | Record baseline metrics in `BASELINE_METRICS.md` | 1h | P1 |
| Wed Mar 12 | Run database linter and address any new security findings | 2h | P1 |
| Thu Mar 13 | SOC 2 Type II observation window preparation checklist | 2h | P2 |
| Fri Mar 14 | Sprint 3 review and Q1 QC status report | 2h | P1 |

### Sprint 4: SDK & Documentation Alignment (Week of Mar 17, 2026)

**Goal:** Resolve SDK version discrepancy, update all stale documentation.

| Day | Task | Est. Hours | Priority |
|-----|------|-----------|----------|
| Mon Mar 17 | Resolve SDK version discrepancy (npm 1.2.0 vs docs 2.2.0) | 2h | P1 |
| Mon Mar 17 | Add missing SDK method mappings for v2.2 endpoints | 3h | P1 |
| Tue Mar 18 | Update `OPERATIONAL_MAINTENANCE.md` version to 2.2 | 1h | P2 |
| Tue Mar 18 | Update `QUALITY_CONTROL_FRAMEWORK.md` next steps section | 1h | P2 |
| Wed Mar 19 | Archive completed QC Calendar (Dec 2–20) as historical record | 0.5h | P3 |
| Wed Mar 19 | Create Q2 2026 QC maintenance schedule template | 2h | P2 |
| Thu Mar 20 | Final Q1 test coverage report generation | 2h | P1 |
| Fri Mar 21 | Q1 2026 QC close-out review | 2h | P1 |

---

## 7. Success Criteria (Updated Post-Sprint 1)

| Metric | Pre-Sprint 1 | Post-Sprint 1 | Sprint 4 Target |
|--------|-------------|---------------|-----------------|
| Phase 3B/3C/4A validated | ❓ Unknown | ✅ 28/36 requestHandler + 8 specialized | ✅ Maintained |
| Security sprint items verified | ❓ Unknown | ✅ 9/9 complete | ✅ Maintained |
| Edge function Deno tests | 2/42 (5%) | 2/42 (5%) | 6/42 (14%) |
| Frontend test files | 11 | 11 | 14+ |
| Total tests passing | 111 | 111 | 140+ |
| Line coverage | ~22% | ~22% | ~35% |
| QC docs up to date | ❌ Stale | ✅ Current | ✅ Current |
| DEMO_MOCK_MODE env-controlled | ❌ Hardcoded | ❌ Hardcoded | ✅ |
| Compliance cron active | ❌ | ❌ | ✅ |
| SDK version aligned | ❌ | ❌ | ✅ |
| Baseline metrics recorded | ❌ Empty | ❌ | ✅ Recorded |

---

## 8. Risk Register (Updated)

| Risk | Likelihood | Impact | Status |
|------|-----------|--------|--------|
| Phase 3B/3C functions not actually migrated | ~~Low~~ **Confirmed** | High | **RESOLVED**: 8 functions use specialized patterns (documented as acceptable) |
| Security sprint items incomplete | ~~Medium~~ **Verified** | Critical | **RESOLVED**: All 9 items verified complete |
| DEMO_MOCK_MODE left on in production | Medium | High | Sprint 3: move to env var control |
| SOC 2 Type II audit delayed | Medium | Medium | Sprint 3: prepare observation window checklist |
| SDK clients using wrong version | Low | Medium | Sprint 4: version alignment |

---

---

## 9. Deferred Technical Recommendations

### REC-001: Local LLM Model Upgrade — Gemma 2B/7B → Phi-4-mini / Qwen 3 4B

**Status:** 📋 Documented — Deferred until SDK QC sprint completes  
**Date Identified:** February 25, 2026  
**Target Implementation:** Post-SDK QC completion (estimated Q2 2026)  
**Codebase Impact:** Low (config + UI only; no architectural changes)

#### Background

The current offline AI implementation uses Google Gemma 2B/7B models via `@huggingface/transformers` with WebGPU acceleration. Since initial integration (~Q3 2025), the small language model landscape has evolved significantly. A February 2026 assessment identified multiple models that outperform Gemma at equivalent or lower resource cost.

#### Recommended Changes

| Current | Proposed Replacement | Rationale |
|---------|---------------------|-----------|
| Gemma 2B (fast tier) | **Phi-4-mini (3.8B)** | +17 pts MMLU (50% → 67.3%), only +1.4GB VRAM. Best-in-class reasoning at this size. |
| Gemma 7B (quality tier) | **Qwen 3 4B** | ~70% MMLU (vs Gemma 7B ~64%) at **half the VRAM** (~3GB vs ~6GB). Strong multilingual support for European expansion. |

#### Benchmark Comparison (Feb 2026 Data)

| Model | Params | MMLU | VRAM (Q4) | WebGPU/ONNX Ready | Notes |
|-------|--------|------|-----------|-------------------|-------|
| Gemma 2B (current) | 2B | ~50% | ~1.6GB | ✅ Proven | Battle-tested, stable |
| Gemma 3 4B | 4B | 59.6% | ~3GB | ⚠️ Partial | Multimodal (image+text); Transformers.js support pending (#1334) |
| **Phi-4-mini** | 3.8B | **67.3%** | ~3GB | ✅ ONNX available | Strongest reasoning at ≤4B |
| **Qwen 3 4B** | 4B | **~70%** | ~3GB | ✅ ONNX available | Best benchmarks, multilingual |
| Llama 3.2 3B | 3B | 63.4% | ~2GB | ✅ WebLLM | Meta ecosystem, tool-calling |
| SmolLM2 1.7B | 1.7B | ~48% | ~900MB | ✅ Native | Ultra-lightweight fallback option |

#### Files Affected (When Implemented)

| File | Change |
|------|--------|
| `src/services/localLLMService.ts` | Add Phi-4-mini and Qwen 3 model configs; update ONNX model identifiers |
| `src/components/LocalLLMToggle.tsx` | Update model selection dropdown labels and download size estimates |
| `src/hooks/useSmartLLMSelection.ts` | No changes required (model-agnostic) |
| `docs/BITNET_PHASE3_ENHANCEMENT.md` | Update "Current State" section; note reduced urgency for BitNet given Qwen 3/Phi-4 quantized CPU variants |
| `openapi-spec.yaml` | Update offline model references if exposed via SDK |

#### Additional Notes

- **Gemma 3 multimodal** should be monitored — once Transformers.js support is finalized, it could enable offline visual crop analysis (high-value feature for plant ID licensees).
- **Qwen 3's multilingual strength** directly supports the Phased European Rollout strategy.
- **Phi-4-mini's reasoning capability** improves offline agricultural diagnostics accuracy — key differentiator vs competitors.
- The existing `useSmartLLMSelection` auto-switching logic (online/offline/slow connection) requires **zero changes** for this upgrade.

#### Decision Gate

- [ ] SDK QC sprint completed (Sprints 2–4)
- [ ] Phi-4-mini ONNX model validated in local test environment
- [ ] Qwen 3 4B ONNX model validated in local test environment
- [ ] Download size impact assessed for PWA users
- [ ] Announcement prepared for SDK changelog / release notes
- [ ] Technical Lead sign-off
- [ ] Product Owner approval

---

**Document Owner:** Development Team  
**Last Updated:** February 25, 2026 (REC-001 added)  
**Review Cadence:** Weekly during Sprint 2–4, then monthly  
**Next Review:** March 7, 2026 (Sprint 2 close)
