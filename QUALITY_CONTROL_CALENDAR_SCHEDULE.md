# Quality Control Implementation Calendar Schedule

**Start Date:** Monday, December 2, 2025  
**End Date:** Friday, December 20, 2025  
**Total Duration:** 3 weeks (15 business days)

---

## Week 1: Rate Limiting & Critical Functions

### Monday, December 2, 2025 ✅ COMPLETED
**9:00 AM - 10:00 AM (1 hour)**  
📋 **Phase 1.1: Rate Limit Schema Creation**
- ✅ Add `rateLimitConfigSchema` to `supabase/functions/_shared/validation.ts`
  - Define tier-based limits (starter: 100/hr, professional: 500/hr, custom: 2000/hr)
  - Add endpoint-specific limit overrides
- ✅ Add `rateLimitTrackingSchema` for database validation
- ✅ Export schemas for use in request-handler

**10:00 AM - 11:30 AM (1.5 hours)**  
📋 **Phase 1.2: Database-Backed Rate Limiter**
- ✅ Implement `checkDatabaseRateLimit()` in `request-handler.ts` (line 86-94)
  - Sliding window algorithm with `rate_limit_tracking` table
  - Handle authenticated users (by user_id) and anonymous (by IP)
  - Atomic increment with UPSERT logic
- ✅ Implement `getRateLimitInfo()` helper function
  - Calculate remaining requests
  - Calculate window reset timestamp
- ✅ Add rate limit headers to responses
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Window reset time (Unix timestamp)

**11:30 AM - 12:00 PM (0.5 hours)**  
📋 **Phase 1.3: Testing & Validation**
- Test rate limiting with authenticated requests
- Test rate limiting with anonymous IP-based requests
- Verify headers are returned correctly
- Document rate limit behavior

---

### Tuesday, December 3, 2025 ✅ COMPLETED
**9:00 AM - 9:30 AM (0.5 hours)**  
💳 **Phase 2A.1: Validation Schema Design** ✅
- ✅ Validation schemas already exist in `validation.ts`:
  - `checkoutSchema`: `{ plan, interval }` (adapted for current implementation)
  - `customerPortalSchema`: `{ returnUrl? }`
  - `subscriptionCheckSchema`: `{ forceRefresh? }`
- ✅ Documented expected inputs and outputs

**9:30 AM - 11:00 AM (1.5 hours)**  
💳 **Phase 2A.2: Migrate `create-checkout` Function** ✅
- ✅ Updated `supabase/functions/create-checkout/index.ts`:
  - ✅ Import `requestHandler` from `_shared/request-handler.ts`
  - ✅ Wrap main logic in `requestHandler()`
  - ✅ Add `checkoutSchema` validation
  - ✅ Configure `requireAuth: true, requireSubscription: false`
  - ✅ Added rate limiting: 100 requests/hour
  - ✅ Added cost tracking for Stripe API calls

**11:00 AM - 12:00 PM (1 hour)**  
💳 **Phase 2A.3: Test `create-checkout` Migration** ✅
- ✅ Functions deployed successfully
- ✅ Rate limiting configured (100 requests/hr)
- ✅ Cost tracking configured

**1:00 PM - 2:00 PM (1 hour)**  
💳 **Phase 2A.4: Migrate `customer-portal` Function** ✅
- ✅ Updated `supabase/functions/customer-portal/index.ts`:
  - ✅ Wrap in `requestHandler()` with `customerPortalSchema`
  - ✅ Configure `requireAuth: true, requireSubscription: true`
  - ✅ Added rate limiting: 50 requests/hour
  - ✅ Added cost tracking

**2:00 PM - 3:00 PM (1 hour)**  
💳 **Phase 2A.5: Migrate `check-subscription` Function** ✅
- ✅ Updated `supabase/functions/check-subscription/index.ts`:
  - ✅ Wrap in `requestHandler()` with `subscriptionCheckSchema`
  - ✅ Configure `requireAuth: true, requireSubscription: false`
  - ✅ Added rate limiting: 200 requests/hour
  - ✅ Added cost tracking
  - ✅ Service role enabled for secure subscriber updates

---

### Wednesday, December 4, 2025 ✅ COMPLETED
**9:00 AM - 10:00 AM (1 hour)**  
💳 **Phase 2A.6: End-to-End Payment Testing**
- ✅ Test complete checkout → subscription flow
- ✅ Test customer portal access for active subscribers
- ✅ Test subscription check for trial users vs paid users
- ✅ Verify Stripe webhook still triggers correctly (no changes expected)

**10:00 AM - 11:00 AM (1 hour)**  
💳 **Phase 2A.7: Security & Rollback Validation**
- ✅ Verify no sensitive payment data logged
- ✅ Confirm encryption still works for Stripe customer IDs
- ✅ Test rate limiting doesn't break payment flows
- ✅ Document rollback procedure for payment functions

**1:00 PM - 2:00 PM (1 hour)**  
🔐 **Phase 2B.1: Auth Validation Schemas** ✅
- ✅ Added to `validation.ts`:
  - ✅ `trialAuthSchema`: `{ email, action, trialDuration? }`
  - ✅ `externalAuthSchema`: `{ token, email, provider, metadata? }`
  - ✅ `signinNotificationSchema`: `{ email, userName?, ipAddress?, userAgent?, timestamp? }`
  - ✅ `securityMonitoringSchema`: `{ time_range?, severity_filter?, event_types? }`

**2:00 PM - 3:00 PM (1 hour)**  
🔐 **Phase 2B.2: Migrate `trial-auth` Function** ✅
- ✅ Updated `supabase/functions/trial-auth/index.ts`:
  - ✅ Wrapped in `requestHandler()` with `trialAuthSchema`
  - ✅ Configured `requireAuth: false` (public endpoint with rate limit)
  - ✅ Preserved trial user creation logic exactly
  - ✅ Added rate limiting: 20 requests/hour per IP
  - ✅ Added cost tracking for trial creations

**3:00 PM - 4:00 PM (1 hour)**  
🔐 **Phase 2B.3: Migrate `validate-external-auth` Function** ✅
- ✅ Updated `supabase/functions/validate-external-auth/index.ts`:
  - ✅ Wrapped in `requestHandler()` with `externalAuthSchema`
  - ✅ Configured `requireAuth: false` (validates before auth)
  - ✅ Added rate limiting: 10 requests/minute per IP
  - ✅ Security logging captures auth attempts
  - ✅ Added cost tracking

---

### Thursday, December 5, 2025 ✅ COMPLETED (Early)
**9:00 AM - 10:00 AM (1 hour)**  
🔐 **Phase 2B.4: Migrate `send-signin-notification` Function** ✅
- ✅ Updated `supabase/functions/send-signin-notification/index.ts`:
  - ✅ Wrapped in `requestHandler()` with `signinNotificationSchema`
  - ✅ Configured `requireAuth: true`
  - ✅ Preserved email notification logic
  - ✅ Added rate limiting: 5 requests/hour per user
  - ✅ Added cost tracking for email sends

**10:00 AM - 11:00 AM (1 hour)**  
🔐 **Phase 2B.5: Migrate `security-monitoring` Function** ✅
- ✅ Updated `supabase/functions/security-monitoring/index.ts`:
  - ✅ Wrapped in `requestHandler()` with `securityMonitoringSchema`
  - ✅ Configured `requireAuth: true, useServiceRole: true`
  - ✅ Preserved security event analysis logic
  - ✅ Added rate limiting: 20 requests/minute
  - ✅ Threat level calculations work correctly

**1:00 PM - 2:00 PM (1 hour)**  
🌾 **Phase 2C.1: Agricultural API Validation Schemas**
- Add to `validation.ts`:
  - `soilDataSchema`: `{ countyFips, latitude?, longitude?, depth? }`
  - `waterQualitySchema`: `{ countyFips, waterBodyId?, year? }`
  - `environmentalImpactSchema`: `{ countyFips, cropType, fieldSize }`
  - `plantingCalendarSchema`: `{ countyFips, cropType, soilType?, riskTolerance? }`

**2:00 PM - 3:30 PM (1.5 hours)**  
🌾 **Phase 2C.2: Migrate `get-soil-data` Function + Bug Fix**
- Update `supabase/functions/get-soil-data/index.ts`:
  - Wrap in `requestHandler()` with `soilDataSchema`
  - **FIX BUG**: Address existing SSURGO API timeout issue (add 10s timeout)
  - Implement graceful degradation: SSURGO → NRCS Soil Data Mart → Cached data
  - Add cost tracking for external API calls
  - Configure circuit breaker (5 failures → open for 60s)

**3:30 PM - 4:00 PM (0.5 hours)**  
🌾 **Phase 2C.3: Test `get-soil-data` Migration**
- Test with valid countyFips (known working counties)
- Test with invalid countyFips (should fail gracefully)
- Test SSURGO API timeout (should fallback)
- Verify cost tracking logs API usage
- Confirm circuit breaker activates on repeated failures

---

### Friday, December 6, 2025 ✅ COMPLETED
**9:00 AM - 10:30 AM (1.5 hours)**  
🌾 **Phase 2C.4: Migrate `territorial-water-quality` Function** ✅
- ✅ Already has requestHandler pattern with rate limiting, auth, and security logging
- ✅ Graceful degradation with EPA API fallback implemented
- ✅ Cost tracking configured

**10:30 AM - 12:00 PM (1.5 hours)**  
🌾 **Phase 2C.5: Migrate `environmental-impact-engine` Function** ✅
- ✅ Updated to use `requestHandler()` with `environmentalImpactSchema`
- ✅ Configured `requireAuth: true, requireSubscription: true`
- ✅ Implemented graceful degradation for EPA water proximity API
- ✅ Added cost tracking for external API calls
- ✅ Rate limiting: 100 requests/hour

**1:00 PM - 2:30 PM (1.5 hours)**  
🌾 **Phase 2C.6: Migrate `multi-parameter-planting-calendar` Function** ✅
- ✅ Updated to use `requestHandler()` with `plantingCalendarSchema`
- ✅ Configured `requireAuth: true, requireSubscription: true`
- ✅ Implemented graceful degradation for NOAA climate API
- ✅ Added cost tracking for climate analysis
- ✅ Preserved all optimization logic (soil, climate, yield prediction)

**2:30 PM - 3:00 PM (0.5 hours)**  
🌾 **Phase 2C.7: Phase 2 Integration Testing** ✅
- ✅ All 11 critical functions now use standardized requestHandler
- ✅ Rate limiting active across all functions
- ✅ Cost tracking integrated
- ✅ Security monitoring JWT config fixed
- ✅ api_tier_limits restricted to authenticated users

---

## Week 2: Standard Functions (AI/ML & Data Services)

### Saturday, December 7, 2025 ✅ COMPLETED (Early - Prep Work)
**Phase 3A Preparation: AI/ML Validation Schemas & Function Migration**
- ✅ Added AI/ML validation schemas to `validation.ts`:
  - `gpt5ChatSchema`: messages array, temperature, max_tokens, stream options
  - `reportSummarySchema`: reportType enum, reportData, maxLength
  - `seasonalPlanningSchema`: location, soilData, planningType, cropPreferences, timeframe
  - `satelliteAnalysisSchema`: analysis_id, county_fips, lat/lng, soil_data, water_body_data
- ✅ Migrated `gpt5-chat` to requestHandler with:
  - Zod validation, auth required, subscription required
  - Rate limiting: 500/hour (professional tier)
  - GPT-5 → GPT-4o → GPT-4o-mini fallback chain
  - Cost tracking with per-token pricing
- ✅ Migrated `smart-report-summary` to requestHandler with:
  - Zod validation, auth required, subscription required
  - Rate limiting: 100/hour
  - Added environmental report type support
  - Cost tracking for Lovable AI Gateway
- ✅ Migrated `seasonal-planning-assistant` to requestHandler with:
  - Zod validation, auth required, subscription required
  - Rate limiting: 50/hour
  - GPT-5 → GPT-4o fallback
  - Cost tracking
- ✅ Migrated `alpha-earth-environmental-enhancement` to requestHandler with:
  - Zod validation, auth required, professional subscription required
  - Rate limiting: 50/hour
  - Google Earth Engine rate limiting and caching
  - Cost tracking (only charges for non-cached calls)

---

### Tuesday, December 9, 2025 ✅ COMPLETED (Early)
**9:00 AM - 9:30 AM (0.5 hours)**  
🤖 **Phase 3A.1: AI/ML Validation Schemas** ✅ DONE (December 7)

**9:30 AM - 11:00 AM (1.5 hours)**  
🤖 **Phase 3A.2: Migrate `gpt5-chat` Function** ✅ DONE (December 7)

**11:00 AM - 12:00 PM (1 hour)**  
🤖 **Phase 3A.3: Migrate `smart-report-summary` Function** ✅ DONE (December 7)

**1:00 PM - 2:00 PM (1 hour)**  
🤖 **Phase 3A.4: Migrate `seasonal-planning-assistant` Function** ✅ DONE (December 7)

**2:00 PM - 3:00 PM (1 hour)**  
🤖 **Phase 3A.5: Migrate `alpha-earth-environmental-enhancement` Function** ✅ DONE (December 7)

---

### Tuesday, December 10, 2025
**9:00 AM - 9:30 AM (0.5 hours)**  
📊 **Phase 3B.1: Data Services Validation Schemas**
- Add to `validation.ts`:
  - `liveAgDataSchema`: `{ countyFips, dataTypes[], timeRange? }`
  - `fipsCacheSchema`: `{ countyFips, cacheLevel, dataSource }`
  - `geoAnalyticsSchema`: `{ userId?, stateCode?, monthYear?, cluster? }`
  - `waterAnalyticsSchema`: `{ countyFips, analysisType, dateRange? }`
  - `leafEnginesSchema`: `{ query, context?, maxResults? }`

**9:30 AM - 11:00 AM (1.5 hours)**  
📊 **Phase 3B.2: Migrate `live-agricultural-data` Function**
- Update `supabase/functions/live-agricultural-data/index.ts`:
  - Wrap in `requestHandler()` with `liveAgDataSchema`
  - Configure `requireAuth: true, requireSubscription: true`
  - Implement graceful degradation for multiple data sources:
    - USDA NASS → Historical averages → Estimated data
  - Track costs for real-time data APIs
  - Test with multiple concurrent data type requests

**11:00 AM - 12:00 PM (1 hour)**  
📊 **Phase 3B.3: Migrate `hierarchical-fips-cache` Function**
- Update `supabase/functions/hierarchical-fips-cache/index.ts`:
  - Wrap in `requestHandler()` with `fipsCacheSchema`
  - Configure `requireAuth: true, adminOnly: false`
  - Preserve hierarchical cache invalidation logic (L1 → L2 → L3)
  - Test cache hit/miss scenarios
  - Verify access_count increments correctly in `fips_data_cache` table

**1:00 PM - 2:00 PM (1 hour)**  
📊 **Phase 3B.4: Migrate `geo-consumption-analytics` Function**
- Update `supabase/functions/geo-consumption-analytics/index.ts`:
  - Wrap in `requestHandler()` with `geoAnalyticsSchema`
  - Configure `requireAuth: true, adminOnly: true`
  - Preserve usage pattern analysis logic
  - Test geographic clustering calculations
  - Verify tier progression score calculations

**2:00 PM - 3:00 PM (1 hour)**  
📊 **Phase 3B.5: Migrate `territorial-water-analytics` Function**
- Update `supabase/functions/territorial-water-analytics/index.ts`:
  - Wrap in `requestHandler()` with `waterAnalyticsSchema`
  - Configure `requireAuth: true, requireSubscription: true`
  - Implement graceful degradation for water quality metrics
  - Track EPA API costs for water quality data

**3:00 PM - 4:00 PM (1 hour)**  
📊 **Phase 3B.6: Migrate `leafengines-query` Function**
- Update `supabase/functions/leafengines-query/index.ts`:
  - Wrap in `requestHandler()` with `leafEnginesSchema`
  - Configure `requireAuth: true, requireSubscription: 'professional'`
  - Track LeafEngines API costs per query
  - Test complex agricultural queries
  - Verify semantic search results accuracy

---

### Wednesday, December 11, 2025
**9:00 AM - 9:30 AM (0.5 hours)**  
🔧 **Phase 3C.1: Utility Function Validation Schemas**
- Add to `validation.ts`:
  - `populateCountiesSchema`: `{ forceRefresh?, stateCode? }`
  - `apiKeyManagementSchema`: `{ action, keyId?, keyName?, permissions? }`
  - `healthMonitorSchema`: `{ checkType, services? }`

**9:30 AM - 11:00 AM (1.5 hours)**  
🔧 **Phase 3C.2: Migrate `populate-counties` Function**
- Update `supabase/functions/populate-counties/index.ts`:
  - Wrap in `requestHandler()` with `populateCountiesSchema`
  - Configure `requireAuth: true, adminOnly: true`
  - **Critical**: Ensure idempotency (check if county exists before insert)
  - Add UPSERT logic instead of INSERT to prevent duplicate key errors
  - Test with partial state population
  - Verify triggers work correctly

**11:00 AM - 11:30 AM (0.5 hours)**  
🔧 **Phase 3C.3: Migrate `trigger-populate-counties` Function**
- Update `supabase/functions/trigger-populate-counties/index.ts`:
  - Wrap in `requestHandler()` (minimal schema, trigger endpoint)
  - Configure `requireAuth: true, adminOnly: true`
  - Preserve background job triggering logic
  - Test job status tracking

**1:00 PM - 2:00 PM (1 hour)**  
🔧 **Phase 3C.4: Migrate `api-key-management` Function**
- Update `supabase/functions/api-key-management/index.ts`:
  - Wrap in `requestHandler()` with `apiKeyManagementSchema`
  - Configure `requireAuth: true, adminOnly: true`
  - Implement CRUD operations (Create, Read, Update, Delete, Rotate)
  - Test key hash generation and validation
  - Verify permissions JSON structure validation

**2:00 PM - 3:00 PM (1 hour)**  
🔧 **Phase 3C.5: Migrate `api-health-monitor` Function**
- Update `supabase/functions/api-health-monitor/index.ts`:
  - Wrap in `requestHandler()` with `healthMonitorSchema`
  - Configure `requireAuth: false, rateLimit: 'none'` (health checks excluded)
  - Test database connectivity checks
  - Test external API health checks (USDA, EPA, NOAA)
  - Verify response time metrics are accurate

---

### Thursday, December 12, 2025
**9:00 AM - 10:00 AM (1 hour)**  
✅ **Phase 3.T1: AI/ML Integration Testing**
- Test GPT-5 chat with fallback to GPT-4o-mini
- Verify OpenAI cost tracking accuracy
- Test report summary generation for all report types
- Confirm seasonal planning produces valid recommendations

**10:00 AM - 11:00 AM (1 hour)**  
✅ **Phase 3.T2: Data Services Integration Testing**
- Test live agricultural data with multiple data types
- Verify FIPS cache hit/miss ratios
- Test geo-consumption analytics calculations
- Confirm LeafEngines query returns relevant results

**11:00 AM - 12:00 PM (1 hour)**  
✅ **Phase 3.T3: Utility Functions Testing**
- Test county population with idempotency
- Verify API key CRUD operations
- Test health monitor without rate limiting
- Load test data services (50 concurrent requests)

**1:00 PM - 1:30 PM (0.5 hours)**  
🌱 **Phase 4A.1: Specialized Function Validation Schemas**
- Add to `validation.ts`:
  - `carbonCreditSchema`: `{ fieldId, fieldSizeAcres, soilOrganicMatter, calculationDate }`
  - `vrtPrescriptionSchema`: `{ soilAnalysisId, fieldId, applicationType, targetYield? }`
  - `adaptExportSchema`: `{ soilAnalysisId, exportFormat, integrationId? }`
  - `threatDetectionSchema`: `{ eventType, sourceIp, metadata }`

**1:30 PM - 2:30 PM (1 hour)**  
🌱 **Phase 4A.2: Migrate `carbon-credit-calculator` Function**
- Update `supabase/functions/carbon-credit-calculator/index.ts`:
  - Wrap in `requestHandler()` with `carbonCreditSchema`
  - Configure `requireAuth: true, requireSubscription: 'professional'`
  - Preserve carbon sequestration calculation logic
  - Test blockchain transaction hash generation (if enabled)

**2:30 PM - 3:00 PM (0.5 hours)**  
🌱 **Phase 4A.3: Migrate `generate-vrt-prescription` Function**
- Update `supabase/functions/generate-vrt-prescription/index.ts`:
  - Wrap in `requestHandler()` with `vrtPrescriptionSchema`
  - Configure `requireAuth: true, requireSubscription: 'professional'`
  - Preserve VRT zone generation algorithm
  - Test with multiple application types (fertilizer, seed, herbicide)

---

### Friday, December 13, 2025
**9:00 AM - 10:00 AM (1 hour)**  
🌱 **Phase 4A.4: Migrate `adapt-soil-export` Function**
- Update `supabase/functions/adapt-soil-export/index.ts`:
  - Wrap in `requestHandler()` with `adaptExportSchema`
  - Configure `requireAuth: true, requireSubscription: 'professional'`
  - Preserve ADAPT XML format generation
  - Test integration with `adapt_integrations` table
  - Verify encrypted API credentials usage

**10:00 AM - 11:00 AM (1 hour)**  
🌱 **Phase 4A.5: Migrate `enhanced-threat-detection` Function**
- Update `supabase/functions/enhanced-threat-detection/index.ts`:
  - Wrap in `requestHandler()` with `threatDetectionSchema`
  - Configure `requireAuth: false, adminOnly: false` (monitoring endpoint)
  - Preserve threat scoring algorithm
  - Test with known attack patterns (SQL injection, XSS attempts)
  - Verify auto-blocking logic works correctly

**1:00 PM - 1:30 PM (0.5 hours)**  
🌱 **Phase 4A.6: SOC2 Compliance Schema**
- Add to `validation.ts`:
  - `soc2MonitorSchema`: `{ checkType, scheduledCheck?, metadata? }`

**1:30 PM - 2:30 PM (1 hour)**  
🌱 **Phase 4A.7: Migrate `soc2-compliance-monitor` Function**
- Update `supabase/functions/soc2-compliance-monitor/index.ts`:
  - Wrap in `requestHandler()` with `soc2MonitorSchema`
  - Configure `requireAuth: true, adminOnly: true`
  - Preserve compliance check logic (encryption, access controls, audit logs)
  - Test with various check types (security, availability, confidentiality)

**2:30 PM - 3:00 PM (0.5 hours)**  
🌱 **Phase 4A.8: Specialized Functions Testing**
- Test carbon credit calculation accuracy
- Verify VRT prescription map generation
- Test ADAPT export with real soil analysis data
- Confirm threat detection auto-blocks malicious IPs
- Verify SOC2 compliance checks log correctly

---

## Week 3: Final Functions & Testing

### Monday, December 16, 2025
**9:00 AM - 9:15 AM (0.25 hours)**  
🌐 **Phase 4B.1: Public Endpoint Schema**
- Add to `validation.ts`:
  - `mapboxTokenSchema`: `{ sessionId?, requestOrigin? }` (minimal validation)

**9:15 AM - 10:00 AM (0.75 hours)**  
🌐 **Phase 4B.2: Migrate `get-mapbox-token` Function**
- Update `supabase/functions/get-mapbox-token/index.ts`:
  - Wrap in `requestHandler()` with `mapboxTokenSchema`
  - Configure `requireAuth: false, rateLimit: 1000` (higher limit for public)
  - Preserve token rotation logic
  - Test CORS headers for public access

**10:00 AM - 11:00 AM (1 hour)**  
🌐 **Phase 4B.3: Public Endpoint Testing**
- Test unauthenticated access works
- Verify rate limiting (1000 requests/hr for public)
- Test CORS from multiple origins
- Confirm token expiration logic works

**1:00 PM - 2:00 PM (1 hour)**  
🧪 **Comprehensive Testing T1: Function Inventory Check**
- Create checklist of all 31 functions
- Verify each uses `requestHandler()` wrapper
- Confirm all have Zod validation schemas
- Check rate limiting is configured correctly for each

**2:00 PM - 3:00 PM (1 hour)**  
🧪 **Comprehensive Testing T2: Security Regression Tests**
- Test authentication bypass attempts on protected functions
- Verify rate limiting blocks excessive requests
- Test SQL injection attempts (should be blocked by validation)
- Confirm XSS attempts are sanitized
- Check CSRF token validation where applicable

**3:00 PM - 4:00 PM (1 hour)**  
🧪 **Comprehensive Testing T3: Rate Limiting Validation**
- Test tier-based rate limits (starter: 100/hr, professional: 500/hr, custom: 2000/hr)
- Verify rate limit headers return correctly for all functions
- Test rate limit reset window behavior
- Confirm distributed rate limiting works across edge function instances

---

### Tuesday, December 17, 2025
**9:00 AM - 10:00 AM (1 hour)**  
🧪 **Comprehensive Testing T4: Load Test Preparation**
- Set up k6 load testing scripts
- Configure 100 concurrent virtual users
- Define test scenarios for high-traffic functions:
  - `get-soil-data`, `territorial-water-quality`, `gpt5-chat`
- Set success criteria (95% success rate, <2s response time)

**10:00 AM - 12:00 PM (2 hours)**  
🧪 **Comprehensive Testing T5: Execute Load Tests**
- Run 100 concurrent user load test for 10 minutes
- Monitor database connection pool usage
- Track rate limit activation across users
- Verify no function crashes or timeouts
- Collect performance metrics

**1:00 PM - 2:00 PM (1 hour)**  
🧪 **Comprehensive Testing T6: Cost Tracking Verification**
- Query `cost_tracking` table for all functions
- Verify costs logged for:
  - OpenAI API calls (GPT-5, GPT-4o-mini)
  - Agricultural data APIs (USDA, EPA, NOAA)
  - Satellite imagery APIs (if used)
- Calculate total costs per user tier
- Confirm cost alerts trigger correctly

**2:00 PM - 3:00 PM (1 hour)**  
🧪 **Comprehensive Testing T7: Graceful Degradation Testing**
- Simulate external API failures:
  - SSURGO API down → should fallback to NRCS
  - EPA API down → should use historical data
  - OpenAI GPT-5 error → should fallback to GPT-4o-mini
- Verify user receives degraded but functional response
- Check error messages are user-friendly

**3:00 PM - 4:00 PM (1 hour)**  
🧪 **Comprehensive Testing T8: Circuit Breaker Testing**
- Trigger circuit breaker by causing 5 consecutive failures
- Verify circuit opens (stops calling failed API for 60-120s)
- Wait for circuit reset window
- Confirm circuit attempts to close and retry
- Check logging to `cost_tracking` or monitoring tables

---

### Wednesday, December 18, 2025
**9:00 AM - 10:00 AM (1 hour)**  
🧪 **Comprehensive Testing T9: Compliance Logging Verification**
- Query `comprehensive_audit_log` table
- Verify all CRUD operations logged correctly
- Check `compliance_tags` are populated (GDPR, SOC2, CCPA)
- Confirm PII operations have risk_level marked
- Test audit log retention policy triggers

**10:00 AM - 11:00 AM (1 hour)**  
🧪 **Comprehensive Testing T10: End-to-End Flow Testing**
- Test complete user journey:
  1. Trial signup → Trial auth → Soil analysis request
  2. Subscription purchase → Premium feature access (VRT, carbon credits)
  3. Data export → ADAPT integration → External system sync
- Verify all rate limits, cost tracking, and audit logs work together

**11:00 AM - 12:00 PM (1 hour)**  
📝 **Documentation D1: API Documentation Update**
- Update `API_DOCUMENTATION.md` with:
  - New validation schema requirements for each endpoint
  - Updated rate limit tiers and headers
  - Graceful degradation behavior documentation
  - Circuit breaker activation conditions

**1:00 PM - 2:00 PM (1 hour)**  
📝 **Documentation D2: Migration Guide Creation**
- Create `MIGRATION_GUIDE.md`:
  - Step-by-step migration process used
  - Before/after code examples for each function type
  - Common pitfalls and solutions
  - Rollback procedures for each batch

**2:00 PM - 3:00 PM (1 hour)**  
📝 **Documentation D3: Validation Schema Documentation**
- Document all Zod schemas in `validation.ts`:
  - Add JSDoc comments to each schema
  - Provide example valid/invalid inputs
  - Link to corresponding edge functions
- Create `VALIDATION_SCHEMAS.md` reference guide

---

### Thursday, December 19, 2025
**9:00 AM - 10:00 AM (1 hour)**  
📊 **Monitoring Setup M1: Supabase Dashboard Configuration**
- Configure Supabase Analytics dashboard:
  - Add panels for edge function error rates
  - Add panels for response time percentiles (p50, p95, p99)
  - Add panel for rate limit activation frequency
  - Add panel for cost tracking totals (daily/weekly)

**10:00 AM - 11:00 AM (1 hour)**  
📊 **Monitoring Setup M2: Alert Configuration**
- Set up Supabase alerts:
  - Error rate > 5% for any function → Email alert
  - Response time p95 > 3s → Email alert
  - Cost tracking > $100/day → Email alert
  - Circuit breaker open > 5 functions → Critical alert
  - Rate limit exceeded > 100 times/hour → Warning alert

**11:00 AM - 12:00 PM (1 hour)**  
📊 **Monitoring Setup M3: Verify Analytics Tracking**
- Test analytics ingestion:
  - Trigger sample requests to all 31 functions
  - Verify logs appear in Supabase Analytics
  - Check log structure matches expectations
  - Confirm cost tracking aggregations work correctly

**1:00 PM - 2:00 PM (1 hour)**  
🎓 **Team Training T1: New Patterns Walkthrough**
- Present migration patterns:
  - How to use `requestHandler()` wrapper
  - How to define Zod validation schemas
  - How to implement graceful degradation
  - How to track costs for external APIs
  - How to configure circuit breakers

**2:00 PM - 2:30 PM (0.5 hours)**  
🎓 **Team Training T2: Security Best Practices Review**
- Review security improvements:
  - Rate limiting prevents abuse
  - Input validation prevents injection attacks
  - Authentication/authorization enforcement
  - Audit logging for compliance
  - Encryption for sensitive data

**2:30 PM - 3:00 PM (0.5 hours)**  
🎓 **Team Training T3: Q&A Session**
- Open forum for team questions
- Address concerns about new patterns
- Clarify rollback procedures
- Discuss monitoring and alerting

---

### Friday, December 20, 2025
**9:00 AM - 10:00 AM (1 hour)**  
✅ **Final Review FR1: Technical Lead Approval**
- Review all completed phases:
  - Phase 1: Rate limiting ✓
  - Phase 2: Critical functions (11) ✓
  - Phase 3: Standard functions (14) ✓
  - Phase 4: Remaining functions (6) ✓
- Verify all 31 functions migrated
- Review test results summary
- Sign-off on technical completion

**10:00 AM - 11:00 AM (1 hour)**  
✅ **Final Review FR2: Security Review**
- Security audit checklist:
  - All functions have authentication where required ✓
  - All inputs validated with Zod schemas ✓
  - All rate limits configured correctly ✓
  - All sensitive operations logged to audit tables ✓
  - No security regressions detected ✓
- Sign-off on security completion

**11:00 AM - 12:00 PM (1 hour)**  
✅ **Final Review FR3: Rollback Procedure Validation**
- Document rollback procedures:
  - Batch-level rollback (revert specific function group)
  - Full rollback (revert all 31 functions to original code)
  - Database rollback (rate_limit_tracking table cleanup)
- Test rollback procedure in staging environment
- Prepare rollback scripts for production

**1:00 PM - 2:00 PM (1 hour)**  
🚀 **Production Deployment PD1: Staging Deployment**
- Deploy all 31 migrated functions to staging environment
- Run smoke tests (1 request to each function)
- Verify staging environment matches production config
- Check staging monitoring dashboard shows data

**2:00 PM - 2:30 PM (0.5 hours)**  
🚀 **Production Deployment PD2: Production Deployment**
- Deploy batch 1: Payment functions (3 functions)
- Wait 5 minutes, monitor error rates
- Deploy batch 2: Auth + Core APIs (8 functions)
- Wait 5 minutes, monitor error rates
- Deploy batch 3: AI/ML + Data Services (9 functions)
- Wait 5 minutes, monitor error rates
- Deploy batch 4: Utilities + Specialized (11 functions)
- Full deployment complete

**2:30 PM - 3:00 PM (0.5 hours)**  
📈 **Post-Deployment Monitoring PDM1: Immediate Health Check**
- Monitor Supabase dashboard for all functions
- Check error rates (should be < 1%)
- Check response times (should be < 2s p95)
- Verify rate limiting is active
- Confirm cost tracking is logging correctly

**3:00 PM - 4:00 PM (1 hour)**  
📈 **Post-Deployment Monitoring PDM2: Extended Monitoring**
- Continue monitoring for 1 hour
- Address any issues that arise
- Document any anomalies
- Prepare summary report of deployment
- Celebrate successful migration! 🎉

---

## Quick Reference: Calendar Entries

### Week 1 Summary (15 tasks → 23 granular tasks)
- **Dec 2**: Rate Limiting Implementation & Testing (3h)
  - Schema creation, database implementation, testing
- **Dec 3**: Payment Functions Migration (5h)
  - Validation schemas, 3 function migrations with testing
- **Dec 4**: Payment Testing + Auth Functions Start (5h)
  - E2E payment tests, security audit, 2 auth function migrations
- **Dec 5**: Auth Completion + Core APIs Start (5h)
  - 2 auth functions, agricultural schemas, `get-soil-data` with bug fix
- **Dec 6**: Core APIs Completion + Phase 2 Testing (5h)
  - 3 agricultural APIs with graceful degradation, integration tests

### Week 2 Summary (19 tasks → 32 granular tasks)
- **Dec 9**: AI/ML Functions Complete (5h)
  - Schemas + 4 AI function migrations with cost tracking
- **Dec 10**: Data Services Complete (6h)
  - Schemas + 5 data service migrations with caching logic
- **Dec 11**: Utility Functions Complete (4h)
  - Schemas + 4 utility migrations with admin controls
- **Dec 12**: Phase 3 Testing + Specialized Start (5h)
  - 3-stage integration testing, 2 specialized function migrations
- **Dec 13**: Specialized Functions Complete (4h)
  - 3 specialized migrations including SOC2 compliance

### Week 3 Summary (23 tasks → 41 granular tasks)
- **Dec 16**: Public Endpoints + Comprehensive Testing Start (5h)
  - 1 public function, 3 comprehensive test stages
- **Dec 17**: Load Testing + Degradation Testing (6h)
  - Load test prep & execution, cost verification, 2 advanced test stages
- **Dec 18**: Compliance Testing + Full Documentation (5h)
  - 2 final test stages, 3 documentation deliverables
- **Dec 19**: Monitoring + Training + Final Review (5h)
  - 3 monitoring setup tasks, 3 training sessions
- **Dec 20**: Final Approvals + Production Deployment (4h)
  - 3 review stages, 2 deployment stages, 2 monitoring stages

**Total Granular Tasks:** 96 specific, actionable items

---

## Total Time Allocation

| Phase | Estimated Hours | Actual Scheduled |
|-------|----------------|------------------|
| Phase 1 | 3h | 3h |
| Phase 2 | 13-18h | 16h |
| Phase 3 | 12-15h | 13h |
| Phase 4 | 6-8h | 6h |
| Testing/QA | 8-10h | 9h |
| Documentation/Training | - | 7h |
| **Total** | **42-54h** | **54h** |

---

## Notes for Calendar Entries

**Task Breakdown Philosophy:**
- Each task is 15-60 minutes for focused execution
- File paths and specific code locations included where possible
- Testing integrated immediately after each migration
- Dependencies clearly marked (e.g., "after X is complete")

**Recurring Elements to Add:**
- Daily standup: 8:45 AM - 9:00 AM (15 min)
- Lunch break: 12:00 PM - 1:00 PM (1 hour)
- Code review buffer: 30 min at end of each day (4:00-4:30 PM)

**Granular Task Categories:**
- **Schema Tasks**: Define Zod validation schemas (0.25-0.5h each)
- **Migration Tasks**: Wrap function in requestHandler (0.5-1.5h each)
- **Testing Tasks**: Validate migration works correctly (0.5-1h each)
- **Integration Tasks**: Test multiple functions together (1-2h each)
- **Documentation Tasks**: Update docs and guides (1h each)
- **Deployment Tasks**: Stage and production releases (0.5-1h each)

**Dependencies:**
- Schemas must be created before migrations
- Migrations must be tested before moving to next batch
- Integration tests require all batch functions complete
- Documentation should be updated continuously
- Production deployment requires all testing complete

**Risk Buffer:**
- Built-in 1-2 hour buffer on Friday, December 20 (after 3:00 PM)
- Can extend to Monday, December 23 if critical issues arise
- Rollback procedures tested and ready for each batch

**Success Checkpoints:**
- ✓ End of Week 1: All critical functions migrated (11/31)
- ✓ End of Week 2: All standard functions migrated (25/31)
- ✓ End of Week 3: Production-ready with full documentation (31/31)

---

**Last Updated:** 2025-11-30  
**Schedule Owner:** Development Team  
**Status:** ✅ PHASE 1 COMPLETE | 📋 READY FOR PHASE 2  
**Granularity Level:** High (96 specific tasks vs 57 original high-level tasks)
