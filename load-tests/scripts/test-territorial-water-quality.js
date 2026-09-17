import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

// Test coordinates and counties
const TEST_LOCATIONS = [
  { lat: 34.0522, lng: -118.2437, fips: '06037' }, // Los Angeles, CA
  { lat: 41.8781, lng: -87.6298, fips: '17031' },  // Chicago, IL
  { lat: 29.7604, lng: -95.3698, fips: '48201' },  // Houston, TX
  { lat: 33.4484, lng: -112.0740, fips: '04013' }, // Phoenix, AZ
  { lat: 32.7157, lng: -117.1611, fips: '06073' }, // San Diego, CA
  { lat: 25.7617, lng: -80.1918, fips: '12086' },  // Miami, FL
  { lat: 40.6782, lng: -73.9442, fips: '36047' },  // Brooklyn, NY
  { lat: 32.7767, lng: -96.7970, fips: '48113' },  // Dallas, TX
];

export default function () {
  const location = TEST_LOCATIONS[Math.floor(Math.random() * TEST_LOCATIONS.length)];
  
  const payload = JSON.stringify({
    latitude: location.lat,
    longitude: location.lng,
    county_fips: location.fips,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
  };

  const response = http.post(
    `${BASE_URL}/functions/v1/territorial-water-quality`,
    payload,
    params
  );

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has water quality data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.waterQuality || body.water_quality || body.data;
      } catch {
        return false;
      }
    },
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  errorRate.add(!success);

  sleep(Math.random() * 2 + 1);
}
