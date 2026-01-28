# Testing Expansion Plan

**Created:** January 28, 2026  
**Status:** Active  
**Goal:** Increase test coverage to enable faster, more reliable iteration

---

## Current Test Coverage Audit

### Existing Tests (7 files)
| File | Category | Coverage Area |
|------|----------|---------------|
| `src/test/trialAuthSecurity.test.ts` | Security | Token spoofing, localStorage attacks, session validation |
| `src/test/supabase.test.ts` | Infrastructure | Mock client, query patterns |
| `src/test/sdkTierLimits.test.ts` | B2B Logic | Tier rate limits, endpoint access |
| `src/test/fipsCache.test.ts` | Architecture | FIPS cache hierarchy |
| `src/hooks/__tests__/cropSanitization.test.ts` | Security | ReDoS prevention, input sanitization |
| `src/hooks/__tests__/useLiveAgriculturalData.test.tsx` | Hooks | Data fetching, error handling |
| `src/utils/emailValidation.test.ts` | Validation | Email format validation |

### Coverage Gaps (Priority Order)

---

## Phase 1: Critical Path Tests (Week 1)

### 1.1 API Key Management (`HIGH`)
**Why:** Core B2B revenue path; sandbox key generation must work flawlessly.
```
src/components/__tests__/APIKeyManager.test.tsx
- Sandbox key generation flow
- Key visibility toggle (security)
- Clipboard copy functionality
- Upgrade request form validation
```

### 1.2 Edge Function Response Patterns (`HIGH`)
**Why:** SDK clients depend on consistent response formats.
```
supabase/functions/get-soil-data/index_test.ts
supabase/functions/county-lookup/index_test.ts
- Response structure validation
- Error format consistency
- Rate limit header presence
- X-Response-Time header accuracy
```

### 1.3 Authentication Flow (`HIGH`)
**Why:** Every protected feature depends on auth state.
```
src/hooks/__tests__/useAuth.test.tsx
- Session persistence
- Token refresh handling
- Logout cleanup
- Profile creation trigger
```

---

## Phase 2: Business Logic Tests (Week 2)

### 2.1 Subscription & Tier Access (`MEDIUM-HIGH`)
```
src/hooks/__tests__/useSubscription.test.tsx
- Tier detection accuracy
- Feature gating logic
- Trial expiration handling
```

### 2.2 Cost Monitoring (`MEDIUM-HIGH`)
```
src/hooks/__tests__/useCostMonitoring.test.tsx
- Cost aggregation accuracy
- Alert threshold triggers
- Service provider breakdown
```

### 2.3 Carbon Credit Calculator (`MEDIUM`)
```
src/components/__tests__/CarbonCreditCalculator.test.tsx
- Calculation formula accuracy
- Field size validation
- Soil organic matter bounds
```

---

## Phase 3: Integration & E2E (Week 3-4)

### 3.1 Developer Sandbox (`HIGH` for B2B)
```
src/pages/__tests__/DeveloperSandbox.test.tsx
- API request execution
- Response display
- cURL generation
- Error handling feedback
```

### 3.2 Field Management (`MEDIUM`)
```
src/components/__tests__/FieldsList.test.tsx
src/components/__tests__/AddFieldDialog.test.tsx
- CRUD operations
- Boundary coordinate validation
- Area calculation
```

### 3.3 Water Quality Analysis (`MEDIUM`)
```
src/components/__tests__/WaterQualityPDFExport.test.tsx
- Data formatting
- PDF generation
- Chart rendering
```

---

## Phase 4: Edge Function Tests (Ongoing)

### Priority Functions for Deno Testing
| Function | Priority | Reason |
|----------|----------|--------|
| `api-key-request` | HIGH | Core onboarding path |
| `api-key-management` | HIGH | Key lifecycle |
| `get-soil-data` | HIGH | Most-used endpoint |
| `county-lookup` | HIGH | Foundation for all queries |
| `agricultural-intelligence` | MEDIUM | AI cost validation |
| `carbon-credit-calculator` | MEDIUM | Revenue feature |
| `territorial-water-quality` | MEDIUM | Starter tier feature |

---

## Test Utilities to Create

### 1. Auth Mock Helper
```typescript
// src/test/authHelpers.ts
export const createAuthenticatedUser = (overrides?: Partial<User>) => {...}
export const createTrialUser = (daysRemaining: number) => {...}
export const createSubscribedUser = (tier: TierName) => {...}
```

### 2. Edge Function Test Harness
```typescript
// supabase/functions/_test-utils/harness.ts
export const invokeWithAuth = async (fn: string, body: object, tier: string) => {...}
export const expectRateLimitHeaders = (response: Response) => {...}
export const expectTimingHeaders = (response: Response) => {...}
```

### 3. Component Test Wrapper
```typescript
// src/test/componentHelpers.tsx
export const renderWithProviders = (component: ReactElement, options?: {
  auth?: AuthState;
  subscription?: SubscriptionState;
  route?: string;
}) => {...}
```

---

## Success Metrics

| Metric | Current | Target (4 weeks) |
|--------|---------|------------------|
| Test Files | 7 | 25+ |
| Line Coverage | ~15% (est.) | 60%+ |
| Critical Path Coverage | ~40% | 95%+ |
| Edge Function Tests | 0 | 10+ |
| Test Execution Time | <10s | <30s |

---

## Implementation Schedule

### Week 1 (Critical Path)
- [ ] Create auth test helpers
- [ ] APIKeyManager tests
- [ ] useAuth hook tests
- [ ] get-soil-data edge function test

### Week 2 (Business Logic)
- [ ] useSubscription tests
- [ ] useCostMonitoring tests
- [ ] CarbonCreditCalculator tests
- [ ] county-lookup edge function test

### Week 3 (Integration)
- [ ] DeveloperSandbox tests
- [ ] Field management tests
- [ ] api-key-request edge function test

### Week 4 (Polish)
- [ ] Water quality tests
- [ ] PDF export tests
- [ ] agricultural-intelligence edge function test
- [ ] Coverage report and gap analysis

---

## Notes

- All new tests should use the existing Vitest + Testing Library setup
- Edge function tests use Deno's built-in test runner
- Prefer testing behavior over implementation details
- Mock external services (USDA, EPA, OpenAI) at network boundary
