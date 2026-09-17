import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const aiResponseTime = new Trend('ai_response_time');

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 30 },
    { duration: '3m', target: 50 },
    { duration: '2m', target: 30 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // AI responses may take longer
    http_req_failed: ['rate<0.05'],
    ai_response_time: ['p(95)<8000'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

// Test agricultural queries
const TEST_QUERIES = [
  'What soil amendments improve clay soil drainage?',
  'When should I plant tomatoes in zone 7?',
  'How do I test soil pH at home?',
  'What cover crops are best for nitrogen fixation?',
  'How often should I water newly planted fruit trees?',
  'What are signs of nitrogen deficiency in corn?',
  'Best practices for organic weed control?',
  'How deep should I plant garlic cloves?',
  'What causes yellowing leaves in peppers?',
  'How to improve sandy soil water retention?',
];

// Test FIPS codes
const TEST_FIPS = [
  '06037', // Los Angeles, CA
  '17031', // Cook, IL  
  '48201', // Harris, TX
  '04013', // Maricopa, AZ
];

export default function () {
  const query = TEST_QUERIES[Math.floor(Math.random() * TEST_QUERIES.length)];
  const fips = TEST_FIPS[Math.floor(Math.random() * TEST_FIPS.length)];
  
  const payload = JSON.stringify({
    message: query,
    county_fips: fips,
    context: 'soil_analysis',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    timeout: '30s',
  };

  const startTime = Date.now();
  
  const response = http.post(
    `${BASE_URL}/functions/v1/gpt5-chat`,
    payload,
    params
  );

  const responseTime = Date.now() - startTime;
  aiResponseTime.add(responseTime);

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has AI response': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.response || body.message || body.content;
      } catch {
        return false;
      }
    },
    'response time < 10s': (r) => r.timings.duration < 10000,
    'no rate limit error': (r) => r.status !== 429,
  });

  errorRate.add(!success);

  // Longer sleep for AI endpoints to avoid rate limits
  sleep(Math.random() * 5 + 3);
}
