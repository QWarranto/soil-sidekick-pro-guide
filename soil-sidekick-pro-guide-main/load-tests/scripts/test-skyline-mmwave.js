import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const errorRate = new Rate('errors');
const cloudLatency = new Trend('cloud_latency_ms');
const edgeLatency = new Trend('edge_latency_ms');
const throughput = new Rate('throughput_req_min');

// Load test fixtures from Action 1.2
const testFixtures = new SharedArray('skyline-fixtures', function() {
  // In a real implementation, we would load the JSON files
  // For now, we'll create sample data based on the fixture structure
  const fixtures = [];
  
  // Generate sample sensor readings based on the fixture patterns
  for (let i = 0; i < 100; i++) {
    const deviceId = `SKY-TEST${String(i+1).padStart(4, '0')}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
    const schemaVersion = i % 3 === 0 ? 'v1.0' : i % 3 === 1 ? 'v1.1' : 'v2.0';
    
    fixtures.push({
      device_id: deviceId,
      firmware_version: schemaVersion === 'v1.0' ? 'v1.0.8' : 
                       schemaVersion === 'v1.1' ? 'v1.1.5' : 'v2.0.1',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      sensor_readings: {
        mmwave_frequency_ghz: 24 + Math.random() * 57, // 24-81 GHz
        signal_strength_db: -120 + Math.random() * 90, // -120 to -30 dB
        doppler_velocity_mps: -50 + Math.random() * 100, // -50 to 50 m/s
        range_resolution_mm: 1 + Math.random() * 99, // 1-100 mm
        angle_resolution_deg: 0.1 + Math.random() * 9.9, // 0.1-10 deg
        target_count: Math.floor(Math.random() * 20),
        noise_floor_db: -140 + Math.random() * 60, // -140 to -80 dB
        interference_level: Math.random(),
        target_tracking: schemaVersion !== 'v1.0' ? Array(Math.floor(Math.random() * 5)).fill().map(() => ({
          target_id: `target-${Math.random().toString(36).substring(2, 8)}`,
          range_mm: 100 + Math.random() * 9000,
          velocity_mps: -20 + Math.random() * 40,
          angle_deg: -45 + Math.random() * 90
        })) : []
      }
    });
  }
  
  return fixtures;
});

// MQTT simulation data
const mqttTopics = new SharedArray('mqtt-topics', function() {
  return [
    'skyline/us-east-1/factory-001/SKY-ABCD1234-EF56/sensor/reading/qos1',
    'skyline/us-east-1/factory-001/SKY-ABCD1234-EF56/status/health/qos0',
    'skyline/us-east-1/factory-001/SKY-ABCD1234-EF56/config/update/qos2',
    'skyline/us-east-1/factory-001/SKY-ABCD1234-EF56/alert/event/qos1',
    'skyline/eu-west-1/warehouse-alpha/SKY-WXYZ9876-AB12/sensor/reading/qos1',
    'skyline/us-west-2/office-campus/SKY-EFGH5678-CD34/sensor/reading/qos1'
  ];
});

// Test configuration with performance gates
export const options = {
  scenarios: {
    // Cloud API load test
    cloud_api: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '1m', target: 50 },    // Ramp up to 50 VUs
        { duration: '3m', target: 100 },   // Ramp up to 100 VUs
        { duration: '5m', target: 200 },   // Peak at 200 VUs
        { duration: '2m', target: 100 },   // Ramp down
        { duration: '1m', target: 0 },     // Cool down
      ],
      exec: 'testCloudAPI',
    },
    // Edge inference simulation
    edge_inference: {
      executor: 'constant-vus',
      vus: 20,
      duration: '5m',
      exec: 'testEdgeInference',
    },
    // MQTT broker simulation
    mqtt_simulation: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 requests per second = 6,000 req/min
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 50,
      maxVUs: 100,
      exec: 'testMQTTSimulation',
    },
  },
  
  // Performance gates (thresholds)
  thresholds: {
    // Cloud performance: P95 < 1000ms
    'cloud_latency_ms': ['p(95)<1000'],
    
    // Edge inference performance: P95 < 100ms  
    'edge_latency_ms': ['p(95)<100'],
    
    // Throughput: > 10,000 requests per minute (approx 167 req/s)
    'throughput_req_min': ['rate>167'],
    
    // Overall error rate
    'errors': ['rate<0.01'], // < 1% error rate
    
    // HTTP specific thresholds
    'http_req_duration{scenario:cloud_api}': ['p(95)<1000'],
    'http_req_duration{scenario:edge_inference}': ['p(95)<100'],
    'http_req_failed': ['rate<0.05'], // < 5% failed requests
  },
  
  // Summary output
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

// Cloud API test - simulating cloud processing
export function testCloudAPI() {
  const fixture = testFixtures[Math.floor(Math.random() * testFixtures.length)];
  const startTime = Date.now();
  
  // Simulate cloud API endpoint
  const url = __ENV.CLOUD_API_URL || 'https://api.example.com/v1/skyline/ingest';
  const apiKey = __ENV.API_KEY;
  
  const payload = JSON.stringify(fixture);
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Request-ID': `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    },
    tags: { scenario: 'cloud_api' },
  };
  
  const response = http.post(url, payload, params);
  
  const latency = Date.now() - startTime;
  cloudLatency.add(latency);
  throughput.add(1);
  
  // Validate response
  const success = check(response, {
    'status is 200 or 202': (r) => r.status === 200 || r.status === 202,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has processing id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.processing_id !== undefined || body.message_id !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  // Simulate user think time
  sleep(Math.random() * 1 + 0.5); // 0.5-1.5 seconds
}

// Edge inference test - simulating edge device processing
export function testEdgeInference() {
  const fixture = testFixtures[Math.floor(Math.random() * testFixtures.length)];
  const startTime = Date.now();
  
  // Simulate edge inference endpoint (lower latency expected)
  const url = __ENV.EDGE_API_URL || 'https://edge-api.example.com/v1/infer';
  const apiKey = __ENV.EDGE_API_KEY;
  
  // For edge, we might send a subset of data
  const edgePayload = {
    device_id: fixture.device_id,
    timestamp: fixture.timestamp,
    sensor_data: {
      signal_strength_db: fixture.sensor_readings.signal_strength_db,
      target_count: fixture.sensor_readings.target_count,
      doppler_velocity_mps: fixture.sensor_readings.doppler_velocity_mps,
    }
  };
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    tags: { scenario: 'edge_inference' },
    timeout: '500ms', // Shorter timeout for edge
  };
  
  const response = http.post(url, JSON.stringify(edgePayload), params);
  
  const latency = Date.now() - startTime;
  edgeLatency.add(latency);
  throughput.add(1);
  
  // Validate response - edge should be faster
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 150ms': (r) => r.timings.duration < 150,
    'has inference result': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.inference !== undefined || body.prediction !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  // Faster cycle time for edge devices
  sleep(Math.random() * 0.5 + 0.1); // 0.1-0.6 seconds
}

// MQTT broker simulation test
export function testMQTTSimulation() {
  const fixture = testFixtures[Math.floor(Math.random() * testFixtures.length)];
  const topic = mqttTopics[Math.floor(Math.random() * mqttTopics.length)];
  
  // Simulate MQTT broker endpoint
  const url = __ENV.MQTT_BROKER_URL || 'https://mqtt-broker.example.com/api/publish';
  const clientId = __ENV.MQTT_CLIENT_ID || `test-client-${Math.random().toString(36).substring(2, 10)}`;
  
  const mqttPayload = {
    topic: topic,
    payload: {
      ...fixture,
      mqtt_metadata: {
        message_id: `mqtt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        qos: topic.includes('qos1') ? 1 : topic.includes('qos2') ? 2 : 0,
        retain: false,
        timestamp: Date.now(),
      }
    },
    client_id: clientId,
  };
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-MQTT-Client-ID': clientId,
    },
    tags: { scenario: 'mqtt_simulation' },
  };
  
  const response = http.post(url, JSON.stringify(mqttPayload), params);
  
  throughput.add(1);
  
  // Validate MQTT response
  const success = check(response, {
    'status is 200 or 202': (r) => r.status === 200 || r.status === 202,
    'has message id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message_id !== undefined || body.success === true;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  // MQTT devices often publish frequently
  sleep(Math.random() * 0.1); // 0-0.1 seconds
}

// Handle test summary
export function handleSummary(data) {
  const cloudMetrics = data.metrics['http_req_duration{scenario:cloud_api}'];
  const edgeMetrics = data.metrics['http_req_duration{scenario:edge_inference}'];
  const mqttMetrics = data.metrics['http_req_duration{scenario:mqtt_simulation}'];
  
  const totalRequests = data.metrics.http_reqs?.values?.count || 0;
  const durationMinutes = (data.state.testRunDurationMs / 60000).toFixed(2);
  const requestsPerMinute = totalRequests / durationMinutes;
  
  // Check if throughput threshold is met
  const throughputMet = requestsPerMinute >= 10000;
  
  const summary = {
    stdout: `
========= Skyline mmWave Load Test Results =========

Test Configuration:
  - Cloud API P95 Threshold: < 1000ms ${cloudMetrics?.values['p(95)'] < 1000 ? '✅' : '❌'}
  - Edge Inference P95 Threshold: < 100ms ${edgeMetrics?.values['p(95)'] < 100 ? '✅' : '❌'}
  - Throughput Threshold: > 10,000 req/min ${throughputMet ? '✅' : '❌'} (${requestsPerMinute.toFixed(0)} req/min)

Performance Metrics:
  Cloud API (P95): ${cloudMetrics?.values['p(95)']?.toFixed(2) || 'N/A'} ms
  Edge Inference (P95): ${edgeMetrics?.values['p(95)']?.toFixed(2) || 'N/A'} ms
  MQTT Simulation (P95): ${mqttMetrics?.values['p(95)']?.toFixed(2) || 'N/A'} ms

Throughput:
  Total Requests: ${totalRequests}
  Test Duration: ${durationMinutes} minutes
  Requests/Minute: ${requestsPerMinute.toFixed(0)}
  Requests/Second: ${(requestsPerMinute / 60).toFixed(2)}

Error Rate: ${((data.metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%

Threshold Status: ${throughputMet && cloudMetrics?.values['p(95)'] < 1000 && edgeMetrics?.values['p(95)'] < 100 ? 'ALL PASS ✅' : 'FAILED ❌'}

====================================================
`,
    
    // JSON summary for CI/CD pipeline
    'load-test-results/summary.json': JSON.stringify({
      timestamp: new Date().toISOString(),
      thresholds: {
        cloud_p95_ms: cloudMetrics?.values['p(95)'] || 0,
        cloud_threshold: 1000,
        cloud_passed: cloudMetrics?.values['p(95)'] < 1000,
        
        edge_p95_ms: edgeMetrics?.values['p(95)'] || 0,
        edge_threshold: 100,
        edge_passed: edgeMetrics?.values['p(95)'] < 100,
        
        throughput_req_min: requestsPerMinute,
        throughput_threshold: 10000,
        throughput_passed: throughputMet,
        
        error_rate: (data.metrics.errors?.values?.rate || 0) * 100,
        error_threshold: 1,
        error_passed: (data.metrics.errors?.values?.rate || 0) < 0.01,
      },
      metrics: {
        total_requests: totalRequests,
        duration_minutes: parseFloat(durationMinutes),
        requests_per_minute: requestsPerMinute,
        cloud_avg_latency: cloudMetrics?.values?.avg || 0,
        edge_avg_latency: edgeMetrics?.values?.avg || 0,
        mqtt_avg_latency: mqttMetrics?.values?.avg || 0,
      },
      all_passed: throughputMet && cloudMetrics?.values['p(95)'] < 1000 && edgeMetrics?.values['p(95)'] < 100,
    }, null, 2),
    
    // Detailed metrics for analysis
    'load-test-results/detailed-metrics.json': JSON.stringify(data, null, 2),
  };
  
  return summary;
}