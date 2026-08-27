import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Smoke test configuration
export const options = {
  vus: 5,
  duration: '1m',
  
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // 2s for smoke test
    'http_req_failed': ['rate<0.05'],    // < 5% error rate
    'errors': ['rate<0.05'],
  },
};

// Simple smoke test for CI/CD pipeline
export default function () {
  // Test basic API endpoints
  const endpoints = [
    { method: 'GET', url: __ENV.API_BASE_URL || 'https://api.example.com/health', expectedStatus: 200 },
    { method: 'GET', url: __ENV.API_BASE_URL ? `${__ENV.API_BASE_URL}/status` : 'https://api.example.com/status', expectedStatus: 200 },
  ];
  
  for (const endpoint of endpoints) {
    const params = {
      headers: {
        'User-Agent': 'k6-smoke-test/1.0',
      },
      timeout: '10s',
    };
    
    let response;
    if (endpoint.method === 'GET') {
      response = http.get(endpoint.url, params);
    } else if (endpoint.method === 'POST') {
      response = http.post(endpoint.url, '{}', params);
    }
    
    const success = check(response, {
      [`${endpoint.method} ${endpoint.url} status is ${endpoint.expectedStatus}`]: (r) => r.status === endpoint.expectedStatus,
      [`${endpoint.method} ${endpoint.url} response time < 5s`]: (r) => r.timings.duration < 5000,
    });
    
    errorRate.add(!success);
    
    // Short pause between requests
    if (endpoints.indexOf(endpoint) < endpoints.length - 1) {
      __ITER % 2 === 0 ? 0.5 : 1; // Small variation
    }
  }
}

export function handleSummary(data) {
  const totalRequests = data.metrics.http_reqs?.values?.count || 0;
  const failedRequests = data.metrics.http_req_failed?.values?.passes || 0;
  const errorRate = (failedRequests / totalRequests * 100) || 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'] || 0;
  
  const passed = p95 < 2000 && errorRate < 5;
  
  return {
    stdout: `
========= Skyline Smoke Test Results =========

Total Requests: ${totalRequests}
Failed Requests: ${failedRequests}
Error Rate: ${errorRate.toFixed(2)}%
P95 Response Time: ${p95.toFixed(2)} ms

Smoke Test: ${passed ? 'PASSED ✅' : 'FAILED ❌'}

==============================================
`,
    
    'smoke-test-results.json': JSON.stringify({
      timestamp: new Date().toISOString(),
      passed: passed,
      metrics: {
        total_requests: totalRequests,
        failed_requests: failedRequests,
        error_rate_percent: errorRate,
        p95_response_time_ms: p95,
      },
      thresholds: {
        p95_max_ms: 2000,
        error_rate_max_percent: 5,
      },
    }, null, 2),
  };
}