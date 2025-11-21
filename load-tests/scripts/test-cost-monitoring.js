import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

// Tests write-heavy workload - database insert performance
export const options = {
  stages: [
    { duration: '1m', target: 30 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 150 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Should be fast
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

const SERVICES = ['openai', 'supabase', 'usda', 'google_earth'];
const FEATURES = [
  'soil_analysis',
  'crop_recommendations',
  'field_mapping',
  'visual_analysis',
  'agricultural_chat',
];

export default function () {
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
  
  const payload = JSON.stringify({
    action: 'track_cost',
    service_provider: service,
    service_type: 'api-request',
    usage_amount: Math.random() * 1000,
    feature_name: feature,
    request_details: {
      input_tokens: Math.floor(Math.random() * 1000),
      output_tokens: Math.floor(Math.random() * 500),
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
  };

  const response = http.post(
    `${BASE_URL}/functions/v1/cost-monitoring`,
    payload,
    params
  );

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'tracking confirmed': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);

  sleep(Math.random() * 0.5 + 0.1); // High frequency
}
