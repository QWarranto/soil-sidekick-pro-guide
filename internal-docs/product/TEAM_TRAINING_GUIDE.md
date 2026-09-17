# Team Training Guide: QC Framework Migration

**Training Date:** December 19, 2025  
**Version:** 1.0.0  
**Duration:** 2 hours total

---

## Table of Contents
1. [New Patterns Walkthrough (T1)](#session-1-new-patterns-walkthrough-t1)
2. [Security Best Practices Review (T2)](#session-2-security-best-practices-review-t2)
3. [Q&A Topics (T3)](#session-3-qa-topics-t3)
4. [Quick Reference](#quick-reference)

---

## Session 1: New Patterns Walkthrough (T1)
**Duration:** 1 hour

### 1.1 The `requestHandler()` Wrapper

All 31 edge functions now use a standardized wrapper pattern:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requestHandler } from "../_shared/request-handler.ts";
import { soilDataSchema } from "../_shared/validation.ts";

serve(requestHandler(
  // Configuration
  {
    requireAuth: true,
    requireSubscription: true,
    requiredTier: 'professional',
    rateLimit: { requests: 100, windowMinutes: 60 },
    adminOnly: false,
    useServiceRole: false,
  },
  // Validation schema
  soilDataSchema,
  // Handler function
  async (data, user, supabase) => {
    // Your business logic here
    const { countyFips, latitude, longitude } = data;
    
    // Process request...
    
    return {
      success: true,
      data: result
    };
  }
));
```

### 1.2 Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `requireAuth` | boolean | Requires valid JWT token |
| `requireSubscription` | boolean \| string | Requires active subscription (or specific tier) |
| `requiredTier` | string | Minimum tier: 'starter', 'professional', 'enterprise' |
| `rateLimit` | object | `{ requests: number, windowMinutes: number }` |
| `adminOnly` | boolean | Restricts to admin role users |
| `useServiceRole` | boolean | Uses Supabase service role for elevated permissions |

### 1.3 Defining Zod Validation Schemas

All input must be validated with Zod schemas:

```typescript
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Simple schema
export const checkoutSchema = z.object({
  plan: z.enum(['starter', 'professional', 'enterprise']),
  interval: z.enum(['month', 'year']).optional().default('month'),
});

// Complex schema with validation
export const soilDataSchema = z.object({
  countyFips: z.string()
    .length(5, 'County FIPS must be exactly 5 characters')
    .regex(/^\d{5}$/, 'County FIPS must be numeric'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  depth: z.number().positive().max(200).optional().default(30),
});

// Schema with nested objects
export const gpt5ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(32000),
  })).min(1).max(50),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  max_tokens: z.number().min(1).max(16000).optional().default(2000),
  stream: z.boolean().optional().default(false),
});
```

### 1.4 Implementing Graceful Degradation

Use the `safeExternalCall()` wrapper for external API calls:

```typescript
import { safeExternalCall, initCircuitBreaker } from "../_shared/graceful-degradation.ts";

// Initialize circuit breakers at module level
const epaBreaker = initCircuitBreaker('EPA', {
  failureThreshold: 5,
  resetTimeMs: 60000,
  halfOpenTimeMs: 30000
});

async function handler(data, user, supabase) {
  // Try primary API with circuit breaker
  const epaResult = await safeExternalCall(
    async () => {
      const response = await fetch('https://api.epa.gov/...');
      return response.json();
    },
    epaBreaker,
    { timeout: 10000 }
  );
  
  if (epaResult.success) {
    return { data: epaResult.data };
  }
  
  // Fallback to cached data
  const { data: cachedData } = await supabase
    .from('fips_data_cache')
    .select('cached_data')
    .eq('county_fips', data.countyFips)
    .single();
    
  if (cachedData) {
    return { 
      data: cachedData.cached_data,
      fallback: true,
      reason: 'EPA API unavailable, using cached data'
    };
  }
  
  // Return simulated/estimated data as last resort
  return {
    data: generateEstimatedData(data.countyFips),
    fallback: true,
    simulated: true,
    reason: 'EPA API and cache unavailable'
  };
}
```

### 1.5 Cost Tracking for External APIs

Track costs for all external API calls:

```typescript
import { trackCost } from "../_shared/cost-tracker.ts";

async function handler(data, user, supabase) {
  const startTime = Date.now();
  
  // Make OpenAI API call
  const response = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: data.messages,
  });
  
  const executionTime = Date.now() - startTime;
  
  // Track the cost
  await trackCost(supabase, {
    userId: user.id,
    serviceProvider: 'openai',
    serviceType: 'chat_completion',
    featureName: 'gpt5-chat',
    costUsd: calculateOpenAICost(response.usage),
    usageCount: 1,
    requestDetails: {
      model: 'gpt-5',
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      executionTimeMs: executionTime
    }
  });
  
  return { data: response };
}

function calculateOpenAICost(usage) {
  const inputCost = (usage.prompt_tokens / 1000) * 0.005;  // $0.005/1k tokens
  const outputCost = (usage.completion_tokens / 1000) * 0.015; // $0.015/1k tokens
  return inputCost + outputCost;
}
```

### 1.6 Circuit Breaker Configuration

Five global circuit breakers are configured:

| Service | Failure Threshold | Reset Time | Half-Open Time |
|---------|-------------------|------------|----------------|
| EPA | 5 failures | 60s | 30s |
| USDA | 5 failures | 60s | 30s |
| Google Earth | 5 failures | 60s | 30s |
| NOAA | 5 failures | 60s | 30s |
| OpenAI | 5 failures | 60s | 30s |

---

## Session 2: Security Best Practices Review (T2)
**Duration:** 30 minutes

### 2.1 Rate Limiting Prevents Abuse

Every function has rate limits configured:

```typescript
// Rate limit configuration
rateLimit: { 
  requests: 100,      // Maximum requests
  windowMinutes: 60   // Time window
}
```

**Rate limit headers returned:**
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Unix timestamp when window resets

**What happens when rate limited:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 1703001234
}
```

### 2.2 Input Validation Prevents Injection

All inputs are validated with Zod before processing:

**Benefits:**
- Type coercion (strings to numbers, etc.)
- Length limits prevent buffer overflows
- Regex patterns prevent SQL injection
- Enum values prevent unexpected inputs

**Example protection:**
```typescript
// This prevents SQL injection:
countyFips: z.string()
  .length(5)
  .regex(/^\d{5}$/)  // Only digits allowed

// This prevents XSS:
content: z.string()
  .max(32000)  // Prevents huge payloads
```

### 2.3 Authentication/Authorization Enforcement

```typescript
// Require authentication
requireAuth: true

// Require specific subscription tier
requireSubscription: 'professional'

// Restrict to admin users
adminOnly: true
```

**Authorization flow:**
1. JWT token validated
2. User profile fetched
3. Subscription status checked
4. Role verified (if adminOnly)
5. Rate limit checked
6. Request processed

### 2.4 Audit Logging for Compliance

All sensitive operations are logged:

```typescript
// Automatic logging via request-handler
{
  table_name: 'carbon_credits',
  operation: 'INSERT',
  user_id: 'uuid-here',
  compliance_tags: ['SOC2', 'ENVIRONMENTAL'],
  risk_level: 'MEDIUM',
  ip_address: '192.168.1.1',
  created_at: '2025-12-19T10:00:00Z'
}
```

**Compliance tags used:**
- `GDPR` - Personal data operations
- `SOC2` - Security control operations
- `ENVIRONMENTAL` - Carbon/environmental data
- `FINANCIAL` - Payment/subscription operations
- `PII` - Personally identifiable information

### 2.5 Encryption for Sensitive Data

Sensitive data is encrypted at rest:

| Field | Encryption |
|-------|------------|
| Stripe Customer ID | AES-256-GCM |
| User Email (in subscribers) | AES-256-GCM |
| API Credentials | AES-256-GCM |

---

## Session 3: Q&A Topics (T3)
**Duration:** 30 minutes

### Frequently Asked Questions

**Q: What if I need to add a new edge function?**

A: Follow the pattern in MIGRATION_GUIDE.md:
1. Create Zod schema in `validation.ts`
2. Create function in `supabase/functions/[name]/index.ts`
3. Use `requestHandler()` wrapper
4. Add to `config.toml` if JWT verification should be disabled
5. Deploy automatically with next build

**Q: How do I debug a failing function?**

A: Use multiple approaches:
1. Check Supabase Edge Function logs: `Functions > [name] > Logs`
2. Look for `[ERROR]` or `[CIRCUIT]` messages
3. Check rate_limit_tracking table for rate limit issues
4. Check cost_tracking table for API costs
5. Check auth_security_log for auth issues

**Q: What's the rollback procedure?**

A: See MIGRATION_GUIDE.md Section 6:
- **Batch rollback:** Revert specific function group
- **Full rollback:** Revert all 31 functions
- **Database rollback:** Clean rate_limit_tracking table

**Q: How do I know if external APIs are down?**

A: Look for circuit breaker messages:
- `[CIRCUIT] Opening for EPA` - API failing
- `[CIRCUIT] Half-open for EPA` - Testing recovery
- `[CIRCUIT] Closing for EPA` - API recovered

**Q: How do I add a new external API?**

A: 
1. Add circuit breaker: `const myBreaker = initCircuitBreaker('MY_API')`
2. Wrap calls: `safeExternalCall(fetchFn, myBreaker, options)`
3. Implement fallback logic
4. Add cost tracking if billable

**Q: How do I modify rate limits?**

A: Update the `rateLimit` config in the function:
```typescript
rateLimit: { requests: 200, windowMinutes: 60 }
```
Then redeploy the function.

---

## Quick Reference

### Common Patterns

**Public Endpoint (No Auth):**
```typescript
requestHandler(
  { requireAuth: false, rateLimit: { requests: 20, windowMinutes: 60 } },
  publicSchema,
  async (data) => { /* ... */ }
)
```

**Admin-Only Endpoint:**
```typescript
requestHandler(
  { requireAuth: true, adminOnly: true, useServiceRole: true },
  adminSchema,
  async (data, user, supabase) => { /* ... */ }
)
```

**AI Endpoint with Fallback:**
```typescript
requestHandler(
  { requireAuth: true, requireSubscription: 'professional', rateLimit: { requests: 500, windowMinutes: 60 } },
  aiSchema,
  async (data, user, supabase) => {
    // Try GPT-5
    let result = await safeExternalCall(callGpt5, openaiBreaker);
    if (!result.success) {
      // Fallback to GPT-4o
      result = await safeExternalCall(callGpt4o, openaiBreaker);
    }
    if (!result.success) {
      // Fallback to GPT-4o-mini
      result = await callGpt4oMini();
    }
    return result;
  }
)
```

### Key Files

| File | Purpose |
|------|---------|
| `supabase/functions/_shared/request-handler.ts` | Main request wrapper |
| `supabase/functions/_shared/validation.ts` | All Zod schemas |
| `supabase/functions/_shared/graceful-degradation.ts` | Circuit breakers |
| `supabase/functions/_shared/cost-tracker.ts` | Cost tracking |
| `supabase/functions/_shared/compliance-logger.ts` | Audit logging |

### Important Links

- [API Documentation](API_DOCUMENTATION.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Validation Schemas](VALIDATION_SCHEMAS.md)
- [Operational Monitoring](OPERATIONAL_MONITORING.md)
- [Supabase Dashboard](https://supabase.com/dashboard/project/wzgnxkoeqzvueypwzvyn)

---

## Session 4: OEM & 5G Operations Training (T4)
**Duration:** 1 hour  
**Added:** February 2026

### 4.1 OEM Device Authentication

OEM endpoints use mutual TLS (mTLS) instead of JWT tokens:

```
Standard API:   User → JWT Token → requestHandler → Business Logic
OEM Device:     Device → mTLS Certificate + ak_oem_* Key → requestHandler → Telemetry Ingestion
```

**Key differences from standard endpoints:**
- `requireAuth: false` (mTLS replaces JWT)
- `requireApiKey: true` with `apiKeyPrefix: 'ak_oem_'`
- No subscription check (contract-based licensing)
- HMAC validation on CAN Bus frames
- PGN whitelisting for J1939 protocol

### 4.2 5G Safety-Critical Patterns

Safety-critical 5G endpoints have stricter requirements:

| Requirement | Standard Endpoint | 5G Safety-Critical |
|-------------|-------------------|---------------------|
| Latency target | <500ms | <10ms (URLLC p99) |
| Rate limit | 100-500/hr | 10,000/min |
| Deployment approval | Engineering lead | Dual sign-off (Eng + Safety) |
| Testing | Unit + integration | HIL + 24hr soak test |
| Data retention | Standard | 5-second TTL for coordination data |
| Failover | Manual | Automatic (<500ms switchover) |

### 4.3 Change Management for Safety-Critical Systems

**⚠️ ALL changes to OEM/5G functions require:**

1. **Risk Assessment**: Document potential impact on autonomous operations
2. **HIL Testing**: Validate against hardware simulation before deployment
3. **Dual Sign-off**: Engineering lead AND Safety Officer must approve
4. **Staged Rollout**: 1% → 10% → 100% with health monitoring at each stage
5. **Rollback Plan**: Verified automatic rollback procedure before deployment

### 4.4 Incident Response for OEM/5G

| Scenario | Response Time | Procedure |
|----------|---------------|-----------|
| mTLS certificate compromise | <1 hour | Revoke via CRL, re-issue, notify OEM partner |
| CAN Bus injection detected | Immediate | Isolate device, HMAC audit, PGN log review |
| URLLC latency breach | Automatic | Failover to LTE/Wi-Fi 6, alert on-call engineer |
| OTA update failure | <30 min | Automatic A/B rollback, staged re-deployment |
| Edge node compromise | <1 hour | Quarantine node, re-attest, forensic analysis |
| Worker safety data exposure | Immediate | Invoke GDPR Art.33 procedure (72hr notification) |

### 4.5 OEM/5G Monitoring Dashboards

**Key metrics to watch:**
- `oem_device_registry` — Fleet health, last heartbeat, firmware version
- OTA deployment status — Success rate, rollback count, staged progress
- Royalty metering — Heartbeat drift (alert if >5%), revenue reconciliation
- URLLC latency — p50/p95/p99 per edge node
- Network slice reliability — Target: 99.999% uptime
- Safety incident log — Emergency stops, vital sign anomalies, geofence breaches
