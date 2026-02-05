 import http from 'k6/http';
 import { check, sleep } from 'k6';
 import { Rate, Trend, Counter } from 'k6/metrics';
 
 /**
  * Sub-100ms Latency Validation Test
  * LeafEngines™ B2B API SLA Compliance
  * 
  * Tests fast endpoints against the sub-100ms requirement
  * for enterprise-grade performance.
  */
 
 // Custom metrics for SLA tracking
 const slaViolations = new Counter('sla_violations');
 const sub100msRate = new Rate('sub_100ms_success');
 const responseLatency = new Trend('response_latency_ms');
 const warmLatency = new Trend('warm_response_latency_ms');
 
 export const options = {
   scenarios: {
     // Cold start test - initial requests
     cold_start: {
       executor: 'shared-iterations',
       vus: 1,
       iterations: 5,
       startTime: '0s',
       maxDuration: '30s',
       tags: { test_type: 'cold' },
     },
     // Warm performance test - sustained load
     warm_performance: {
       executor: 'constant-arrival-rate',
       rate: 10, // 10 requests per second
       timeUnit: '1s',
       duration: '60s',
       preAllocatedVUs: 20,
       startTime: '35s', // After cold start completes
       tags: { test_type: 'warm' },
     },
     // Burst test - sudden spike
     burst_test: {
       executor: 'shared-iterations',
       vus: 20,
       iterations: 100,
       startTime: '100s',
       maxDuration: '30s',
       tags: { test_type: 'burst' },
     },
   },
   thresholds: {
     // Primary SLA: sub-100ms for warm requests
     'warm_response_latency_ms{test_type:warm}': ['p95<100', 'p99<150'],
     // Overall latency targets
     'response_latency_ms': ['p50<80', 'p95<150', 'p99<200'],
     // SLA compliance rate
     'sub_100ms_success': ['rate>0.80'], // 80% under 100ms
     // Error rate
     'http_req_failed': ['rate<0.01'], // <1% errors
   },
 };
 
 const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
 const ANON_KEY = __ENV.SUPABASE_ANON_KEY;
 
 // Fast endpoints that should meet sub-100ms SLA
 const FAST_ENDPOINTS = [
   {
     name: 'county-lookup',
     path: '/functions/v1/county-lookup',
     payload: { state: 'FL', county: 'Miami-Dade' },
     target_ms: 100,
   },
   {
     name: 'check-subscription',
     path: '/functions/v1/check-subscription',
     payload: {},
     target_ms: 100,
   },
 ];
 
 // Cached endpoints (should be very fast after first call)
 const CACHED_ENDPOINTS = [
   {
     name: 'hierarchical-fips-cache',
     path: '/functions/v1/hierarchical-fips-cache',
     payload: { county_fips: '12086', data_source: 'soil' },
     target_ms: 50,
   },
 ];
 
 export default function () {
   const testType = __ENV.TEST_TYPE || 'warm';
   const endpoints = testType === 'cached' ? CACHED_ENDPOINTS : FAST_ENDPOINTS;
   const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
   
   const headers = {
     'Content-Type': 'application/json',
   };
   
   if (ANON_KEY) {
     headers['Authorization'] = `Bearer ${ANON_KEY}`;
     headers['apikey'] = ANON_KEY;
   }
 
   const startTime = Date.now();
   
   const response = http.post(
     `${BASE_URL}${endpoint.path}`,
     JSON.stringify(endpoint.payload),
     { headers, timeout: '5s' }
   );
 
   const latency = Date.now() - startTime;
   
   // Track metrics
   responseLatency.add(latency);
   
   // Track warm latency separately
   if (__ITER > 2) { // Skip first few iterations (cold starts)
     warmLatency.add(latency);
   }
   
   // Check SLA compliance
   const meetsTarget = latency <= endpoint.target_ms;
   sub100msRate.add(meetsTarget);
   
   if (!meetsTarget) {
     slaViolations.add(1);
   }
   
   // Validation checks
   const success = check(response, {
     'status is 200': (r) => r.status === 200,
     [`latency < ${endpoint.target_ms}ms`]: () => latency <= endpoint.target_ms,
     'has X-Response-Time header': (r) => r.headers['X-Response-Time'] !== undefined,
     'response is valid JSON': (r) => {
       try {
         JSON.parse(r.body);
         return true;
       } catch {
         return false;
       }
     },
   });
 
   // Log slow requests for debugging
   if (latency > 200) {
     console.log(`SLOW: ${endpoint.name} took ${latency}ms (target: ${endpoint.target_ms}ms)`);
   }
 
   // Brief pause between requests
   sleep(0.1);
 }
 
 export function handleSummary(data) {
   const metrics = data.metrics;
   
   const summary = {
     test_date: new Date().toISOString(),
     sla_target: '100ms',
     results: {
       total_requests: metrics.http_reqs?.values?.count || 0,
       failed_requests: metrics.http_req_failed?.values?.passes || 0,
       sla_violations: metrics.sla_violations?.values?.count || 0,
       sub_100ms_rate: ((metrics.sub_100ms_success?.values?.rate || 0) * 100).toFixed(2) + '%',
       latency: {
         avg: (metrics.response_latency_ms?.values?.avg || 0).toFixed(2) + 'ms',
         p50: (metrics.response_latency_ms?.values?.med || 0).toFixed(2) + 'ms',
         p95: (metrics.response_latency_ms?.values?.['p(95)'] || 0).toFixed(2) + 'ms',
         p99: (metrics.response_latency_ms?.values?.['p(99)'] || 0).toFixed(2) + 'ms',
         max: (metrics.response_latency_ms?.values?.max || 0).toFixed(2) + 'ms',
       },
       warm_latency: {
         avg: (metrics.warm_response_latency_ms?.values?.avg || 0).toFixed(2) + 'ms',
         p95: (metrics.warm_response_latency_ms?.values?.['p(95)'] || 0).toFixed(2) + 'ms',
       },
     },
     sla_compliance: {
       target: 'p95 < 100ms for warm requests',
       status: (metrics.warm_response_latency_ms?.values?.['p(95)'] || 999) < 100 ? 'PASS' : 'FAIL',
       recommendation: (metrics.warm_response_latency_ms?.values?.['p(95)'] || 999) < 100 
         ? 'Sub-100ms SLA achievable for warm requests'
         : 'Consider edge caching or warm-up strategies',
     },
   };
 
   console.log('\n========= SUB-100MS LATENCY VALIDATION =========\n');
   console.log(JSON.stringify(summary, null, 2));
   console.log('\n================================================\n');
 
   return {
     'stdout': JSON.stringify(summary, null, 2),
     'results/sub-100ms-validation.json': JSON.stringify(summary, null, 2),
   };
 }