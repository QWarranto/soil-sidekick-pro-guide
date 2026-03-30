import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 50 },
    { duration: '2m', target: 80 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z254a29lcXp2dWV5cHd6dnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzIzMTksImV4cCI6MjA2ODM0ODMxOX0.RZt9dzpH6Tw-t_eG6vlj_V7AtSz3Sg6wrAEcgF9oSN4';
const API_KEY = __ENV.API_KEY || ''; // Pass ak_sandbox_ key via -e API_KEY=...

// Mock FIPS codes for testing
const TEST_FIPS = [
  '06037', // Los Angeles, CA
  '17031', // Cook, IL
  '48201', // Harris, TX
  '04013', // Maricopa, AZ
  '06073', // San Diego, CA
  '12086', // Miami-Dade, FL
  '36047', // Kings, NY
  '48113', // Dallas, TX
];

export default function () {
  const fipsCode = TEST_FIPS[Math.floor(Math.random() * TEST_FIPS.length)];
  
  const payload = JSON.stringify({
    county_fips: fipsCode,
    depth: 'both', // topsoil and subsoil
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY,
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
  };

  const response = http.post(
    `${BASE_URL}/functions/v1/get-soil-data`,
    payload,
    params
  );

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has soil data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.soil_data && body.soil_data.length > 0;
      } catch {
        return false;
      }
    },
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  errorRate.add(!success);

  sleep(Math.random() * 3 + 1);
}
