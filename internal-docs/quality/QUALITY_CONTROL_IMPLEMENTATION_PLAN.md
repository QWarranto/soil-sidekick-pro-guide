# Quality Control Implementation Plan

## Executive Summary

This document outlines the phased approach to completing the Quality Control Framework implementation, including rate limiting and edge function migration.

## ⚠️ CRITICAL DEPENDENCY ALERT

**THE INTEGRATED ACTION PLAN CANNOT PROCEED UNTIL DAYS 6+**

The marketing timeline in the Integrated Action Plan assumes APIs are demo-ready on Day 1. This is **INCORRECT and DANGEROUS**. 

**REQUIRED TECHNICAL FOUNDATION (Days 1-5):**
- Days 1-2: Rate limiting infrastructure MUST be complete
- Days 3-5: Core agricultural APIs MUST be migrated and tested
- Day 6: EARLIEST date marketing/demos can begin with stable APIs

**ADJUSTED MARKETING TIMELINE:**
- Original: "Phase 1 (Days 1-30): Showcase & Target"
- **CORRECTED: "Phase 1 (Days 6-35): Showcase & Target"**
- All subsequent phases shift by 5 days

**Risk if ignored:** Demos with unstable APIs will damage credibility, waste prospect time, and potentially lose LOI opportunities. Technical debt must be resolved BEFORE sales activities begin.

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

### Daily Execution Plan (US-First Launch Priority)

**Pre-Launch Critical Path (Days 1-5):**
- **Day 1-2:** Phase 1 (Rate limiting infrastructure) - 3 hrs
- **Day 3-5:** Phase 2C (Core agricultural APIs) + Testing - 6-8 hrs
  - `get-soil-data`, `territorial-water-quality`, `environmental-impact-engine`, `multi-parameter-planting-calendar`
  - **Gates sales demos** - API stability required for prospect testing

**Post-LOI Implementation (Days 6-15):**
- **Day 6-8:** Phase 2A (Payment functions) + Testing - 4-6 hrs
  - Deferred until LOIs secured (not needed for pilots)
- **Day 9-10:** Phase 2B (Auth functions) + Testing - 3-4 hrs
- **Day 11-13:** Phase 3A (AI/ML functions) - 4-5 hrs
- **Day 14-15:** Phase 3B (Data services) - 5-6 hrs

**Optional Enhancements (Days 16-20):**
- **Day 16-17:** Phase 3C (Utility functions) - 3-4 hrs
- **Day 18-20:** Phase 4 (Remaining functions) + Final testing - 6-8 hrs

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

## Next Steps (US-First Launch Alignment)

### 🚨 GATE 0: NO MARKETING UNTIL COMPLETE
**All sales outreach, demos, and prospect contact BLOCKED until Gate 1 complete.**

### Gate 1: Technical Foundation (Days 1-5) - MANDATORY BEFORE SALES
1. **Days 1-2 (CRITICAL):** Complete Phase 1 rate limiting (3 hrs)
2. **Days 3-5 (CRITICAL):** Migrate core agricultural APIs (Phase 2C, 6-8 hrs)
   - `get-soil-data`, `territorial-water-quality`, `environmental-impact-engine`, `multi-parameter-planting-calendar`
   - **GATES ALL SALES ACTIVITIES** - API stability required for prospect testing
3. **Day 5 Checkpoint:** Load testing, error rate validation, response time verification

### Gate 2: Marketing Launch (Day 6+)
4. **Day 6 Onwards:** BEGIN sales outreach with stable API platform
   - Impact Simulator demos now safe to run
   - Prospect API testing won't cause embarrassment
   - Can confidently show technical capabilities

### Gate 3: Post-LOI Enhancement (Days 6-15)
5. **Days 6-15:** Payment/Auth migration (Phase 2A/B, 7-10 hrs) - deferred until LOIs secured

### Gate 4: Optional Polish (Days 16-20)
6. **Days 16-20:** Optional enhancements (Phase 3-4)

---

## Approval & Sign-off

- [ ] Technical lead approval
- [ ] Security review completed
- [ ] Load testing plan approved
- [ ] Rollback procedures validated
- [ ] Go-live date confirmed

## 🚨 Marketing Timeline Approval (REQUIRED BEFORE ANY OUTREACH)

**This section MUST be completed before the Integrated Action Plan proceeds:**

- [ ] **Gate 1 Complete:** Days 1-5 technical work finished (rate limiting + core APIs)
- [ ] **Load Testing Passed:** All 4 core APIs handle 100 concurrent users
- [ ] **Error Rate Validated:** < 1% error rate across all core endpoints
- [ ] **Response Times Verified:** < 2s average response time under load
- [ ] **Demo Environment Stable:** Impact Simulator runs without API failures
- [ ] **Rollback Procedures Tested:** Can revert changes if production issues occur
- [ ] **Marketing Timeline Adjusted:** All references to "Day 1-30" changed to "Day 6-35" in Integrated Action Plan

**ONLY AFTER ALL ITEMS CHECKED:** Sales team authorized to begin outreach.

---

---

## Phase 5: OEM & 5G Quality Assurance (Priority: HIGH)

### Objective
Extend quality control framework to cover OEM embedded device operations and Private 5G/MEC safety-critical systems.

### 5.1 OEM Device Validation (Est: 6-8 hrs)

**Tasks:**
1. **Device Registration Validation** — mTLS certificate chain verification, `ak_oem_*` API key prefix enforcement
2. **Telemetry Ingestion QC** — CAN Bus HMAC validation, J1939 PGN whitelisting, ISOBUS ISO-XML signature checks
3. **Royalty Metering Integrity** — Tamper-evident heartbeat verification, drift detection (>5% triggers audit)
4. **OTA Update Pipeline Testing** — Build → Sign → Stage → Validate → Deploy flow with automatic rollback on failure
5. **Protocol Hardening** — Hardware-in-the-Loop (HIL) testing for CAN Bus, J1939, and ISOBUS protocols

**Success Criteria:**
- [ ] All device registrations validated via mTLS
- [ ] CAN Bus HMAC rejection rate < 0.1%
- [ ] Royalty metering drift < 2%
- [ ] OTA rollback tested on 3+ device types
- [ ] HIL test coverage > 50% for all protocols

### 5.2 5G/MEC Safety Validation (Est: 8-10 hrs)

**Tasks:**
1. **URLLC Latency Validation** — Continuous monitoring with automatic failover at p99 > 10ms
2. **Safety Protocol Testing** — Emergency stop, vital signs anomaly detection, geofence enforcement
3. **Anti-Replay Validation** — Monotonic sequence number gap detection and response
4. **Edge Node Attestation** — 24-hour attestation cycle with re-attestation on failure
5. **Dual Sign-off Workflow** — Engineering + Safety Officer approval for all safety-critical changes

**Success Criteria:**
- [ ] URLLC p99 latency < 10ms sustained over 24hrs
- [ ] Emergency stop executes within 100ms
- [ ] Network slice reliability ≥ 99.999% (measured over 1 week)
- [ ] All safety-critical changes have dual sign-off audit trail
- [ ] Failover switchover completes within 500ms

### 5.3 Compliance Integration

**OEM Compliance:**
- ISO 11783 (ISOBUS) conformance testing
- SAE J1939 protocol compliance validation
- ADAPT 1.0 data format verification

**5G Safety Compliance:**
- URLLC slice isolation verification
- Edge data TTL enforcement (5-second coordination data)
- Worker safety monitoring regulatory alignment

---

**Last Updated:** February 10, 2026
**Owner:** Development Team
**Status:** PLANNING - MARKETING BLOCKED UNTIL TECHNICAL FOUNDATION COMPLETE
