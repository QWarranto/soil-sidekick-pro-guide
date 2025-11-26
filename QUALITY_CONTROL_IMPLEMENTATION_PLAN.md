# Quality Control Implementation Plan

## Executive Summary

This document outlines the phased approach to completing the Quality Control Framework implementation, including rate limiting and edge function migration.

---

## Phase 1: Rate Limiting Infrastructure (Priority: HIGH)

### Objective
Complete user-facing rate limiting in `request-handler.ts` with database-backed tracking.

### Tasks

**1.1 Create Rate Limit Schema** (30 min)
- Add validation schema in `_shared/validation.ts` for rate limit configs
- Define tier-based limits (starter: 100/hr, professional: 500/hr, custom: 2000/hr)

**1.2 Implement Database-Backed Rate Limiter** (2 hrs)
- Complete the TODO at line 86-94 in `request-handler.ts`
- Use `rate_limit_tracking` table for distributed rate limiting
- Implement sliding window algorithm
- Handle both authenticated and anonymous (IP-based) requests

**1.3 Add Rate Limit Headers** (30 min)
- Return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Improve developer experience for API consumers

**Testing:**
- Load test with k6 (concurrent requests from multiple IPs)
- Verify limits work across multiple edge function instances
- Test tier escalation scenarios

---

## Phase 2: Critical Function Migration (Priority: HIGH)

### Objective
Migrate high-risk, high-traffic functions first to minimize security exposure.

### Batch 2A: Payment & Subscription (Est: 4-6 hrs)
**Order:** Security risk = CRITICAL

1. `create-checkout` - Stripe payment creation
2. `customer-portal` - Stripe portal access
3. `check-subscription` - Subscription validation

**Complications:**
- Service role authentication patterns
- Sensitive payment data handling
- Must maintain exact Stripe webhook compatibility
- Encryption integration for payment data

**Validation Schemas Needed:**
```typescript
checkoutSchema: {
  priceId, successUrl, cancelUrl, userId
}
subscriptionCheckSchema: {
  userId
}
```

---

### Batch 2B: Authentication & Security (Est: 3-4 hrs)
**Order:** Security risk = HIGH

4. `trial-auth` - Trial user authentication
5. `validate-external-auth` - External auth validation
6. `send-signin-notification` - Security notifications
7. `security-monitoring` - Security event tracking

**Complications:**
- Different auth patterns per function
- Must preserve exact authentication flows
- Security incident logging integration

---

### Batch 2C: Core Agricultural APIs (Est: 6-8 hrs)
**Order:** Usage frequency = HIGH

8. `get-soil-data` - Already has bug fix, needs migration
9. `territorial-water-quality` - EPA water data
10. `environmental-impact-engine` - Impact calculations
11. `multi-parameter-planting-calendar` - Planting optimization

**Complications:**
- Complex external API dependencies (EPA, USDA, NOAA)
- Graceful degradation patterns critical
- Cost tracking for paid APIs
- Circuit breaker integration with existing `api-rate-limiter.ts`

---

## Phase 3: Standard Function Migration (Priority: MEDIUM)

### Batch 3A: AI/ML Functions (Est: 4-5 hrs)

12. `gpt5-chat` - GPT-5 powered chat
13. `smart-report-summary` - AI report generation
14. `seasonal-planning-assistant` - AI planning
15. `alpha-earth-environmental-enhancement` - Satellite + AI

**Complications:**
- OpenAI cost tracking already implemented
- Fallback patterns for GPT-5 → GPT-4o-mini
- Token usage logging

---

### Batch 3B: Data Services (Est: 5-6 hrs)

16. `live-agricultural-data` - Real-time ag data
17. `hierarchical-fips-cache` - FIPS caching
18. `geo-consumption-analytics` - Usage analytics
19. `territorial-water-analytics` - Water analytics
20. `leafengines-query` - LeafEngines API

**Complications:**
- Multiple external API calls per function
- Cache invalidation logic
- Analytics data integrity

---

### Batch 3C: Utility Functions (Est: 3-4 hrs)

21. `populate-counties` - Database seeding
22. `trigger-populate-counties` - Trigger endpoint
23. `api-key-management` - API key CRUD
24. `api-health-monitor` - Health checks

**Complications:**
- Admin-only functions need proper authorization
- Database migration functions need idempotency
- Health checks shouldn't be rate limited

---

## Phase 4: Remaining Functions (Priority: LOW)

### Batch 4A: Specialized Features (Est: 4-5 hrs)

25. `carbon-credit-calculator` - Carbon credits
26. `generate-vrt-prescription` - VRT maps
27. `adapt-soil-export` - ADAPT integration
28. `enhanced-threat-detection` - Security threats
29. `soc2-compliance-monitor` - Compliance checks

### Batch 4B: Public Endpoints (Est: 2-3 hrs)

30. `get-mapbox-token` - Public token endpoint (no auth)

**Note:** Public endpoints need `requireAuth: false` and lighter rate limits

---

## Implementation Strategy

### Daily Execution Plan

**Week 1:**
- **Day 1-2:** Phase 1 (Rate limiting infrastructure)
- **Day 3-4:** Phase 2A (Payment functions) + Testing
- **Day 5:** Phase 2B (Auth functions) + Testing

**Week 2:**
- **Day 1-3:** Phase 2C (Core agricultural APIs) + Testing
- **Day 4-5:** Phase 3A (AI/ML functions)

**Week 3:**
- **Day 1-2:** Phase 3B (Data services)
- **Day 3:** Phase 3C (Utility functions)
- **Day 4-5:** Phase 4 (Remaining functions) + Final testing

---

## Risk Mitigation

### Rollback Strategy
- Keep original function code in comments during migration
- Test each batch in isolation before proceeding
- Deploy in batches with monitoring between deployments

### Testing Requirements Per Batch
1. **Unit Tests**: Validation schema tests
2. **Integration Tests**: End-to-end function calls
3. **Load Tests**: Rate limiting behavior under load
4. **Security Tests**: Authentication bypass attempts
5. **Cost Tests**: Verify cost tracking accuracy

### Monitoring Dashboard
Track during migration:
- Error rates per function
- Response time changes
- Cost tracking accuracy
- Rate limit effectiveness
- Circuit breaker activations

---

## Success Metrics

### Phase 1 Complete When:
- [ ] Rate limiting works across distributed instances
- [ ] All tier limits enforced correctly
- [ ] Rate limit headers returned
- [ ] Load tests pass at 100 concurrent users

### Phase 2 Complete When:
- [ ] All 11 critical functions migrated
- [ ] Payment flows work identically
- [ ] Auth patterns preserved
- [ ] Zero security regressions

### Phase 3 Complete When:
- [ ] All 14 standard functions migrated
- [ ] External API costs tracked
- [ ] Graceful degradation working
- [ ] Circuit breakers activating correctly

### Phase 4 Complete When:
- [ ] All 30 functions migrated
- [ ] Compliance logging active
- [ ] Documentation updated
- [ ] Migration guide validated

---

## Completion Criteria

### Definition of Done
1. ✅ All 31 edge functions use `request-handler.ts`
2. ✅ All inputs validated with Zod schemas
3. ✅ All external API calls have cost tracking
4. ✅ All functions have graceful degradation
5. ✅ Compliance logging captures all operations
6. ✅ Rate limiting active on all user-facing endpoints
7. ✅ Load tests pass for all functions
8. ✅ Zero security regressions detected
9. ✅ Documentation complete and reviewed
10. ✅ Team trained on new patterns

---

## Resource Requirements

### Developer Time
- **Phase 1:** 3 hours
- **Phase 2:** 13-18 hours
- **Phase 3:** 12-15 hours  
- **Phase 4:** 6-8 hours
- **Testing/QA:** 8-10 hours
- **Total:** ~42-54 hours (1-1.5 weeks for one developer)

### Infrastructure
- Supabase analytics monitoring
- Load testing environment
- Staging deployment for testing
- Rollback procedures documented

---

## Next Steps

1. **Immediate:** Complete Phase 1 rate limiting (3 hrs)
2. **This Week:** Migrate payment functions (Batch 2A)
3. **Next Week:** Complete critical functions (Phase 2)
4. **Following Week:** Standard functions (Phase 3-4)

---

## Approval & Sign-off

- [ ] Technical lead approval
- [ ] Security review completed
- [ ] Load testing plan approved
- [ ] Rollback procedures validated
- [ ] Go-live date confirmed

---

**Last Updated:** 2025-11-26
**Owner:** Development Team
**Status:** PLANNING
