import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 100 },  // Peak at 100 users
    { duration: '2m', target: 50 },   // Ramp down
    { duration: '1m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],     // Error rate under 5%
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

// Mock county data for testing
const TEST_COUNTIES = [
  { county: 'Los Angeles', state: 'CA' },
  { county: 'Cook', state: 'IL' },
  { county: 'Harris', state: 'TX' },
  { county: 'Maricopa', state: 'AZ' },
  { county: 'San Diego', state: 'CA' },
  { county: 'Orange', state: 'CA' },
  { county: 'Miami-Dade', state: 'FL' },
  { county: 'Kings', state: 'NY' },
  { county: 'Dallas', state: 'TX' },
  { county: 'Riverside', state: 'CA' },
];

export default function () {
  // Select random county
  const testData = TEST_COUNTIES[Math.floor(Math.random() * TEST_COUNTIES.length)];
  
  const payload = JSON.stringify({
    county: testData.county,
    state: testData.state,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
  };

  const response = http.post(
    `${BASE_URL}/functions/v1/county-lookup`,
    payload,
    params
  );

  // Validate response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has county data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.fips_code !== undefined;
      } catch {
        return false;
      }
    },
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  errorRate.add(!success);

  // Realistic user think time
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'results/county-lookup-results.json': JSON.stringify(data),
  };
}

function textSummary(data) {
  const { metrics } = data;
  return `
  ========= County Lookup Load Test Results =========
  
  Total Requests: ${metrics.http_reqs?.values?.count || 0}
  Failed Requests: ${metrics.http_req_failed?.values?.passes || 0}
  
  Response Times:
    - Average: ${metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms
    - p50: ${metrics.http_req_duration?.values?.med?.toFixed(2) || 0}ms
    - p95: ${metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 0}ms
    - p99: ${metrics.http_req_duration?.values['p(99)']?.toFixed(2) || 0}ms
    - Max: ${metrics.http_req_duration?.values?.max?.toFixed(2) || 0}ms
  
  Throughput: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)} req/s
  Error Rate: ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%
  
  ===================================================
  `;
}
