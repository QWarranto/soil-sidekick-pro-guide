# Interface Error Log — Soil Sidekick Pro
## Incident Window: ~February 15–16, 2026 (approx. 12 hours prior to report)

---

## 1. Circuit Breaker Module — Graceful Degradation Failures

**Component:** `supabase/functions/_shared/graceful-degradation.ts`  
**Severity:** HIGH  
**Symptom:** The circuit breaker pattern used by the AI Gateway orchestration layer was tripping prematurely or failing to recover, causing cascading failures in edge functions that depend on LLM providers.

**Root Cause:** When the primary LLM provider (Google Gemini via Lovable AI Gateway) returned errors or timed out, the circuit breaker entered an OPEN state and did not properly fall back to secondary providers. Subsequent requests were rejected without attempting recovery.

**Affected Functions:**
- `agricultural-intelligence`
- `seasonal-planning-assistant`
- `gpt5-chat`
- `smart-report-summary`

**Impact:** Users received generic "Planning Failed" or "Failed to generate" error messages with no actionable guidance.

---

## 2. Edge Function Invocation Errors

**Component:** Multiple Supabase Edge Functions  
**Severity:** HIGH  
**Symptom:** Edge functions returned errors or failed silently when invoked from the frontend via `supabase.functions.invoke()`.

**Observed Issues:**
- **Authentication gate:** The `seasonal-planning-assistant` required a valid session (`auth.getSession()`), but session refresh timing caused intermittent `401` responses.
- **CORS headers:** Some edge functions may have been missing the updated `x-supabase-client-platform` headers in their CORS configuration, causing preflight failures.
- **Timeout:** Long-running AI inference calls exceeded the default edge function timeout without returning a partial result.

**Error Pattern:**
```
Edge function error: {message: "Failed to generate seasonal plan"}
```

---

## 3. Click Handler — Quick Planning Buttons Not Responding

**Component:** `src/components/SeasonalPlanningAssistant.tsx` — `generatePlan()` onClick handler  
**Severity:** MEDIUM  
**Symptom:** The "Generate Seasonal Plan" button appeared to do nothing when clicked, or showed a brief loading state before silently failing.

**Root Cause (Probable):**
1. The `generatePlan()` async function was catching errors but only displaying them via `toast()` notifications, which could be missed if the toast container was obscured or if the error was a network-level failure (no `response.error` object).
2. The button's `disabled` condition (`isLoading || !location`) could leave it in a disabled state if `isLoading` was set to `true` but the `finally` block didn't execute (e.g., if the promise was rejected before reaching it).
3. Missing location context: If the user hadn't selected a county via CountyLookup first, the button was disabled with no visible explanation.

**Affected UI Elements:**
- "Generate Seasonal Plan" button (`SeasonalPlanningAssistant.tsx`, line 235)
- Planning type and timeframe selectors (validation at lines 75–82)
- Any "Quick Planning" shortcut buttons that invoke the same handler

---

## 4. Live Agricultural Data — Dashboard Subscription Gate

**Component:** `live-agricultural-data` edge function + `useLiveAgriculturalData` hook  
**Severity:** MEDIUM  
**Symptom:** Dashboard failed to load live weather/environmental data for users without an active subscription.

**Resolution Applied:** The `requireSubscription` gate was removed from the `live-agricultural-data` edge function, allowing all authenticated users to access dashboard data with fallback values. (See memory: `architecture/live-data-access-policy`)

---

## 5. Quick Access / One-Time Purchase Modal Routing

**Component:** `src/components/QuickAccessSuggestion.tsx`  
**Severity:** LOW  
**Symptom:** Quick Access suggestion buttons did not behave as expected for certain user states.

**Routing Logic Issues:**
- Unauthenticated users clicking "Get Quick Access" were redirected to `/auth` (correct).
- Users with active subscriptions or trials saw `showOneTimePurchaseModal()` return `false`, then were redirected to `/pricing` — potentially confusing since they already had access.
- The fallback to `/pricing` was a catch-all that didn't clearly communicate why the user was being redirected.

---

## 6. AI Gateway Orchestration — Model Routing

**Component:** `agricultural-intelligence` edge function  
**Severity:** MEDIUM  
**Symptom:** Model routing between `google/gemini-3-flash-preview` (standard) and `google/gemini-2.5-pro` (enhanced reasoning) was not clearly distinguishing which queries required enhanced reasoning.

**Impact:** Some complex agricultural queries were being routed to the flash model and returning shallow or incomplete responses.

---

## Summary of Affected Systems

| # | System | Component | Severity | Status |
|---|--------|-----------|----------|--------|
| 1 | Circuit Breaker | `graceful-degradation.ts` | HIGH | Requires review |
| 2 | Edge Functions | Multiple (`seasonal-planning-assistant`, etc.) | HIGH | Partially resolved |
| 3 | Click Handler | `SeasonalPlanningAssistant.tsx` | MEDIUM | Requires UX improvement |
| 4 | Dashboard Data | `live-agricultural-data` | MEDIUM | **Resolved** |
| 5 | Quick Access | `QuickAccessSuggestion.tsx` | LOW | Requires UX improvement |
| 6 | AI Gateway | `agricultural-intelligence` | MEDIUM | Requires review |

---

## Recommendations

1. **Add retry logic** to the `generatePlan()` click handler with exponential backoff before showing the error toast.
2. **Improve circuit breaker recovery** — implement a HALF-OPEN state that tests provider availability before fully reopening.
3. **Add visible disabled-state explanations** — when the planning button is disabled, show helper text explaining why (e.g., "Select a county first").
4. **Extend edge function timeouts** for AI inference endpoints.
5. **Audit CORS headers** across all edge functions to include the latest Supabase client headers.

---

*Report generated: February 16, 2026*  
*Source: Conversation history reconstruction (Supabase logs rotated out of retention)*
