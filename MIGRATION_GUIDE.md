# Edge Function Migration Guide

**Version**: 1.0  
**Date**: December 2025  
**Scope**: Migration of 31 edge functions to standardized `requestHandler()` pattern

---

## 1. Overview

This guide documents the step-by-step process used to migrate all SoilSidekick Pro edge functions to use the unified `requestHandler()` wrapper pattern. The migration provides:

- **Centralized rate limiting** with database-backed sliding window
- **Zod input validation** for all request payloads
- **Standardized authentication** (JWT and API key support)
- **Cost tracking** for all external API calls
- **Graceful degradation** with fallback chains
- **Circuit breaker protection** for external services
- **Comprehensive audit logging** for SOC 2 compliance

---

## 2. Migration Process

### 2.1 Before/After Code Structure

**Before (Legacy Pattern)**:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { county_fips, state_code } = await req.json();
    
    // Manual validation
    if (!county_fips || !/^\d{5}$/.test(county_fips)) {
      return new Response(JSON.stringify({ error: 'Invalid FIPS' }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Business logic...
    const result = await doSomething(county_fips);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
```

**After (requestHandler Pattern)**:
```typescript
import { requestHandler } from '../_shared/request-handler.ts';
import { soilDataSchema } from '../_shared/validation.ts';

requestHandler({
  validationSchema: soilDataSchema,
  requireAuth: true,
  requireSubscription: true,
  rateLimit: { requests: 100, window: 'hour' },
  handler: async ({ validatedData, user, supabase }) => {
    const { county_fips, state_code } = validatedData;
    
    // Business logic only - validation, auth, rate limiting handled automatically
    const result = await doSomething(county_fips);
    
    return { success: true, data: result };
  }
});
```

### 2.2 Step-by-Step Migration

#### Step 1: Create Validation Schema (validation.ts)

```typescript
export const myFunctionSchema = z.object({
  county_fips: fipsCodeSchema,           // Reuse common schemas
  state_code: stateCodeSchema,
  custom_field: z.string().max(100),
  optional_field: z.boolean().optional(),
});
```

#### Step 2: Update Function Import

```typescript
// Replace serve() import with requestHandler
import { requestHandler } from '../_shared/request-handler.ts';
import { myFunctionSchema } from '../_shared/validation.ts';
```

#### Step 3: Wrap Logic in requestHandler

```typescript
requestHandler({
  validationSchema: myFunctionSchema,
  requireAuth: true,                    // Require JWT authentication
  requireSubscription: 'professional',  // Optional: require specific tier
  useServiceRole: false,                // Use service role for admin ops
  rateLimit: { requests: 100, window: 'hour' },
  
  handler: async ({ validatedData, user, supabase, req }) => {
    // validatedData is type-safe and already validated
    // user contains authenticated user info
    // supabase client is pre-configured
    
    return { success: true, data: result };
  }
});
```

#### Step 4: Add Cost Tracking (if external APIs)

```typescript
import { trackCost } from '../_shared/cost-tracker.ts';

// Inside handler
await trackCost({
  service_provider: 'openai',
  service_type: 'gpt-4o',
  usage_amount: tokenCount,
  feature_name: 'agricultural-chat',
  user_id: user?.id
});
```

#### Step 5: Add Graceful Degradation (if applicable)

```typescript
import { withFallback, safeExternalCall } from '../_shared/graceful-degradation.ts';

// Use fallback chain
const result = await withFallback([
  () => primaryApiCall(),
  () => fallbackApiCall(),
  () => cachedDataCall(),
]);

// Or use circuit breaker protection
const data = await safeExternalCall('EPA', () => epaApiCall());
```

---

## 3. Configuration Options

### 3.1 requestHandler Options

| Option | Type | Description |
|--------|------|-------------|
| `validationSchema` | `z.ZodSchema` | Zod schema for input validation |
| `requireAuth` | `boolean` | Require JWT authentication |
| `requireSubscription` | `boolean \| string` | Require subscription (or specific tier) |
| `useServiceRole` | `boolean` | Use service role for elevated permissions |
| `rateLimit` | `object` | Rate limit configuration |
| `skipRateLimit` | `boolean` | Disable rate limiting (health checks only) |
| `handler` | `function` | Main business logic handler |

### 3.2 Rate Limit Configuration

```typescript
rateLimit: {
  requests: 100,      // Number of requests allowed
  window: 'hour'      // Window: 'minute', 'hour', 'day'
}
```

### 3.3 Handler Context

The handler receives a context object:

```typescript
handler: async ({
  validatedData,  // Parsed and validated request body
  user,           // Authenticated user (or null)
  supabase,       // Supabase client (user or service role)
  req,            // Original Request object
  ipAddress,      // Client IP address
  userAgent,      // User-Agent header
}) => {
  // Your business logic
}
```

---

## 4. Common Patterns

### 4.1 Public Endpoint (No Auth)

```typescript
requestHandler({
  validationSchema: publicSchema,
  requireAuth: false,
  rateLimit: { requests: 60, window: 'hour' },
  handler: async ({ validatedData }) => {
    return { success: true, data: publicData };
  }
});
```

### 4.2 Admin-Only Endpoint

```typescript
requestHandler({
  validationSchema: adminSchema,
  requireAuth: true,
  useServiceRole: true,
  rateLimit: { requests: 20, window: 'minute' },
  handler: async ({ validatedData, user, supabase }) => {
    // Check admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (roles?.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return { success: true, data: adminResult };
  }
});
```

### 4.3 AI Function with Fallback

```typescript
requestHandler({
  validationSchema: chatSchema,
  requireAuth: true,
  requireSubscription: true,
  rateLimit: { requests: 500, window: 'hour' },
  handler: async ({ validatedData, user }) => {
    const response = await withFallback([
      () => callGPT5(validatedData),
      () => callGPT4o(validatedData),
      () => callGPT4oMini(validatedData),
    ]);
    
    await trackCost({
      service_provider: 'openai',
      service_type: response.model,
      usage_amount: response.tokens,
      feature_name: 'gpt5-chat',
      user_id: user?.id
    });
    
    return { success: true, data: response };
  }
});
```

---

## 5. Rollback Procedures

### 5.1 Batch-Level Rollback

To rollback a specific function:

1. Revert the function file to previous version
2. Redeploy: `supabase functions deploy function-name`
3. Monitor error rates for 5 minutes

### 5.2 Full Rollback

To rollback all functions:

```bash
# Revert to pre-migration commit
git checkout [commit-hash] -- supabase/functions/

# Redeploy all functions
supabase functions deploy
```

### 5.3 Database Rollback

Clean up rate limiting data if needed:

```sql
-- Clear rate limit tracking
TRUNCATE rate_limit_tracking;

-- Reset cost tracking (if corrupted)
DELETE FROM cost_tracking WHERE created_at > '[migration_start_date]';
```

---

## 6. Common Pitfalls

### 6.1 Missing CORS Preflight

**Problem**: OPTIONS requests fail
**Solution**: requestHandler automatically handles CORS, but verify `verify_jwt = false` in config.toml for public endpoints

### 6.2 Validation Schema Mismatch

**Problem**: Valid requests rejected
**Solution**: Ensure schema matches actual request payload; use `.optional()` for optional fields

### 6.3 Service Role Not Elevated

**Problem**: Service role queries still restricted
**Solution**: Set `useServiceRole: true` in requestHandler config

### 6.4 Rate Limit Key Collision

**Problem**: Rate limits shared across endpoints
**Solution**: Each endpoint automatically uses its function name as rate limit key

---

## 7. Testing Checklist

- [ ] Valid request succeeds with expected response
- [ ] Invalid request returns 400 with descriptive error
- [ ] Unauthenticated request returns 401 (if requireAuth)
- [ ] Rate limit exceeded returns 429 with reset header
- [ ] Fallback activates when primary fails
- [ ] Cost tracking logs appear in cost_tracking table
- [ ] Audit logs appear in comprehensive_audit_log

---

## 8. OEM & 5G Edge Function Patterns

### 8.1 OEM Device Endpoint Pattern

OEM endpoints use mutual TLS (mTLS) authentication instead of JWT and require `ak_oem_*` API key prefixes:

```typescript
requestHandler(
  {
    requireAuth: false,          // mTLS replaces JWT for device auth
    requireApiKey: true,
    apiKeyPrefix: 'ak_oem_',
    rateLimit: { requests: 1000, windowMinutes: 60 },
    requireSubscription: false,  // OEM licensing is contract-based
  },
  oemTelemetrySchema,
  async (data, _user, supabase) => {
    // Validate HMAC on CAN Bus frames
    // Enforce PGN whitelist for J1939
    // Track royalty metering heartbeat
    return { success: true, data: result };
  }
)
```

### 8.2 5G Safety-Critical Endpoint Pattern

Safety-critical 5G endpoints enforce strict latency budgets and dual sign-off for deployments:

```typescript
requestHandler(
  {
    requireAuth: true,
    rateLimit: { requests: 10000, windowMinutes: 1 },  // High-throughput URLLC
    latencyBudgetMs: 10,        // p99 target
    safetyClassification: 'critical',
  },
  edgeCoordinateSchema,
  async (data, user, supabase) => {
    // Anti-replay: validate monotonic sequence number
    // Execute coordination logic within latency budget
    // Enforce 5-second TTL on coordination data
    return { success: true, data: result };
  }
)
```

### 8.3 Change Management for OEM/5G Functions

| Change Type | Approval Required | Testing Required |
|-------------|-------------------|------------------|
| Standard API endpoint | Engineering lead | Unit + integration tests |
| OEM telemetry ingestion | Engineering lead + QA | HIL testing + field validation |
| 5G safety-critical | Engineering + Safety Officer (dual sign-off) | HIL + 24hr soak test |
| OTA firmware update pipeline | Engineering + Safety Officer + OEM partner | Staged rollout (1% → 10% → 100%) |

---

## 9. References

- [VALIDATION_SCHEMAS.md](./VALIDATION_SCHEMAS.md) - Complete schema documentation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [QUALITY_CONTROL_CALENDAR_SCHEDULE.md](./QUALITY_CONTROL_CALENDAR_SCHEDULE.md) - Migration timeline
- [SECURITY_CRITICAL_CORRECTIONS.md](./SECURITY_CRITICAL_CORRECTIONS.md) - OEM/5G security flaws and corrections
- [POST_QC_SECURITY_SPRINT.md](./POST_QC_SECURITY_SPRINT.md) - OEM/5G security sprint tasks
