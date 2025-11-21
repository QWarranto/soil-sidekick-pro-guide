import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import encoding from 'k6/encoding';

const errorRate = new Rate('errors');
const visionResponseTime = new Trend('vision_response_time');

// ⚠️ WARNING: Vision API is VERY EXPENSIVE - start with minimal load
export const options = {
  stages: [
    { duration: '30s', target: 3 },   // Just 3 users
    { duration: '1m', target: 5 },    // Max 5 concurrent
    { duration: '30s', target: 0 },   // Stop
  ],
  thresholds: {
    http_req_duration: ['p(95)<15000'], // Vision can be slow
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.SUPABASE_URL || 'https://wzgnxkoeqzvueypwzvyn.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

// Mock base64 image data (1x1 pixel PNG for testing)
// In production, you'd use actual field images
const MOCK_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const ANALYSIS_TYPES = [
  { type: 'crop_health', description: 'Analyze overall crop health and identify stress areas' },
  { type: 'disease_detection', description: 'Detect potential diseases or pest damage' },
  { type: 'growth_stage', description: 'Determine crop growth stage and maturity' },
  { type: 'weed_pressure', description: 'Assess weed coverage and identify species' },
  { type: 'nutrient_deficiency', description: 'Identify potential nutrient deficiency symptoms' },
];

export default function () {
  const analysisType = ANALYSIS_TYPES[Math.floor(Math.random() * ANALYSIS_TYPES.length)];
  
  const payload = JSON.stringify({
    image_data: MOCK_IMAGE_BASE64,
    analysis_type: analysisType.type,
    field_info: {
      crop: 'corn',
      growth_stage: 'V6',
      location: 'Test Field 1',
    },
    prompt: analysisType.description,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    timeout: '30s',
  };

  const startTime = new Date();
  const response = http.post(
    `${BASE_URL}/functions/v1/visual-crop-analysis`,
    payload,
    params
  );
  const duration = new Date() - startTime;

  visionResponseTime.add(duration);

  const success = check(response, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'has analysis': (r) => {
      if (r.status === 429) return true;
      try {
        const body = JSON.parse(r.body);
        return body.analysis && body.analysis.length > 30;
      } catch {
        return false;
      }
    },
  });

  if (response.status === 429) {
    console.log('⚠️ Rate limit - Vision API is protected');
  }

  errorRate.add(!success && response.status !== 429);

  sleep(Math.random() * 8 + 4); // 4-12 seconds (users review images)
}

export function handleSummary(data) {
  const { metrics } = data;
  const requestCount = metrics.http_reqs?.values?.count || 0;
  const estimatedCost = requestCount * 0.40; // ~$0.40 per vision request

  console.log(`
  ========= Visual Crop Analysis Load Test Results =========
  
  💰 HIGH COST WARNING: OpenAI Vision API
  
  Total Requests: ${requestCount}
  Successful: ${requestCount - (metrics.http_req_failed?.values?.passes || 0)}
  Failed: ${metrics.http_req_failed?.values?.passes || 0}
  
  Response Times:
    - Average: ${metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms
    - p95: ${metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 0}ms
  
  Estimated Cost: $${estimatedCost.toFixed(2)}
  
  Cost Optimization Strategies:
  1. Implement client-side image compression
  2. Cache results for identical images
  3. Batch multiple images per request when possible
  4. Consider image quality vs. cost tradeoffs
  
  ===========================================================
  `);

  return {
    'results/visual-crop-analysis-results.json': JSON.stringify(data),
  };
}
