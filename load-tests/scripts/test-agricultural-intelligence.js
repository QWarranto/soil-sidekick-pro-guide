import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const aiResponseTime = new Trend('ai_response_time');

// ⚠️ WARNING: This test is EXPENSIVE - start with very low user counts
export const options = {
  stages: [
    { duration: '30s', target: 2 },   // Start with just 2 users
    { duration: '1m', target: 5 },    // Gradually increase to 5
    { duration: '30s', target: 2 },   // Ramp down
    { duration: '30s', target: 0 },   // Stop
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'],  // 95% under 10s (AI is slower)
    http_req_failed: ['rate<0.10'],      // 10% error tolerance (rate limits expected)
    errors: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

// Realistic agricultural queries
const TEST_QUERIES = [
  'What are the best practices for soil pH management in corn production?',
  'How can I improve nitrogen efficiency in my wheat fields?',
  'What cover crops work best for clay soil in humid climates?',
  'When should I apply potassium fertilizer for soybeans?',
  'How do I manage phosphorus runoff without reducing yields?',
  'What are signs of micronutrient deficiency in tomatoes?',
  'Best rotation strategy for preventing soil compaction?',
  'How does organic matter affect water retention?',
  'What soil amendments help with high salinity?',
  'Best practices for no-till farming in heavy clay?',
];

export default function () {
  const query = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];
  
  const payload = JSON.stringify({
    query: query,
    context: {
      county: 'Test County',
      state: 'CA',
      soil_type: 'clay loam',
      crop_type: 'corn',
    }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    timeout: '30s',  // AI responses can be slow
  };

  const startTime = new Date();
  const response = http.post(
    `${BASE_URL}/functions/v1/agricultural-intelligence`,
    payload,
    params
  );
  const duration = new Date() - startTime;

  aiResponseTime.add(duration);

  // Validate response
  const success = check(response, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'has AI response': (r) => {
      if (r.status === 429) return true; // Rate limit is expected
      try {
        const body = JSON.parse(r.body);
        return body.response && body.response.length > 50;
      } catch {
        return false;
      }
    },
    'response time < 30s': (r) => r.timings.duration < 30000,
  });

  if (response.status === 429) {
    console.log('⚠️ Rate limit hit - this is expected for AI endpoints');
  }

  errorRate.add(!success && response.status !== 429);

  // Long think time - users read AI responses
  sleep(Math.random() * 10 + 5); // 5-15 seconds
}

export function handleSummary(data) {
  const { metrics } = data;
  
  console.log(`
  ========= Agricultural Intelligence Load Test Results =========
  
  ⚠️ COST WARNING: This test uses GPT-4 API
  
  Total Requests: ${metrics.http_reqs?.values?.count || 0}
  Successful: ${(metrics.http_reqs?.values?.count || 0) - (metrics.http_req_failed?.values?.passes || 0)}
  Rate Limited (429): Expected - protects costs
  Failed: ${metrics.http_req_failed?.values?.passes || 0}
  
  AI Response Times:
    - Average: ${metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms
    - p50: ${metrics.http_req_duration?.values?.med?.toFixed(2) || 0}ms
    - p95: ${metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 0}ms
    - p99: ${metrics.http_req_duration?.values['p(99)']?.toFixed(2) || 0}ms
  
  Estimated Cost: $${((metrics.http_reqs?.values?.count || 0) * 0.15).toFixed(2)}
  (Assumes $0.15 per request - actual cost varies by prompt length)
  
  Next Steps:
  1. Check cost_tracking table for actual costs
  2. Review edge function logs for errors
  3. Consider prompt optimization to reduce token usage
  
  ================================================================
  `);

  return {
    'results/agricultural-intelligence-results.json': JSON.stringify(data),
  };
}
