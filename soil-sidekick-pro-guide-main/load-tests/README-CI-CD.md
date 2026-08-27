# CI/CD Load Testing Pipeline for Skyline mmWave Platform

This directory contains the load testing configuration for the Skyline mmWave sensor platform CI/CD pipeline.

## Overview

The load testing pipeline is designed to:
1. Validate performance gates before deployment
2. Simulate real-world MQTT broker traffic
3. Ensure throughput meets business requirements
4. Catch performance regressions early

## Performance Gates

The pipeline enforces the following performance thresholds:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| Cloud API P95 | < 1000ms | 95% of cloud API requests must complete in under 1 second |
| Edge Inference P95 | < 100ms | 95% of edge inference requests must complete in under 100ms |
| Throughput | > 10,000 req/min | System must handle at least 10,000 requests per minute |
| Error Rate | < 1% | Less than 1% of requests should fail |

## Test Types

### 1. Smoke Test
- **Purpose**: Quick validation that services are responsive
- **When**: Runs on every pull request
- **Duration**: 1 minute
- **VUs**: 5 virtual users
- **Thresholds**: P95 < 2s, error rate < 5%

### 2. Load Test
- **Purpose**: Validate performance gates under expected load
- **When**: Runs on push to main/develop branches
- **Duration**: ~12 minutes (multiple scenarios)
- **Scenarios**:
  - Cloud API: Ramping from 10 to 200 VUs
  - Edge Inference: Constant 20 VUs
  - MQTT Simulation: 100 requests/second
- **Uses**: Test fixtures from Action 1.2 (`tests/fixtures/skyline-mmwave-golden/`)

### 3. Stress Test
- **Purpose**: Find breaking points of the system
- **When**: Manual trigger or scheduled
- **Duration**: 10 minutes
- **VUs**: 500 virtual users
- **Goal**: Identify maximum capacity and failure modes

## Test Fixtures

The load tests use realistic test data generated in Action 1.2:

- **Location**: `tests/fixtures/skyline-mmwave-golden/`
- **Contents**:
  - Valid sensor readings (v1.0, v1.1, v2.0 schemas)
  - Corrupt/malformed data for negative testing
  - Load scenarios (50 devices sustained, 1000 device spike)
  - MQTT topic structure and payload examples
  - Schema migration test cases

## CI/CD Integration

### GitHub Actions Workflow

The pipeline is defined in `.github/workflows/load-test.yml`:

```yaml
Triggers:
  - Push to main/develop branches
  - Pull requests to main
  - Daily schedule (2 AM UTC)
  - Manual dispatch

Jobs:
  1. Smoke Test: Quick validation (PRs)
  2. Load Test: Full performance validation (pushes)
  3. Stress Test: Breaking point analysis (manual)
  4. Notify: Results notification
```

### Environment Variables

Configure these secrets in GitHub repository settings:

| Secret | Description | Example |
|--------|-------------|---------|
| `CLOUD_API_URL` | Cloud API endpoint | `https://api.staging.example.com` |
| `EDGE_API_URL` | Edge inference endpoint | `https://edge-api.staging.example.com` |
| `MQTT_BROKER_URL` | MQTT broker endpoint | `https://mqtt-broker.staging.example.com` |
| `LOAD_TEST_API_KEY` | API key for cloud API | `sk_test_...` |
| `EDGE_API_KEY` | API key for edge API | `edge_sk_test_...` |
| `SLACK_WEBHOOK_URL` | (Optional) Slack notifications | `https://hooks.slack.com/...` |

## Local Development

### Prerequisites

- **Option 1**: Install k6 locally
  ```bash
  # macOS
  brew install k6
  
  # Linux
  sudo apt-get install k6
  
  # Windows
  choco install k6
  ```

- **Option 2**: Use Docker (no installation required)

### Running Tests Locally

```bash
# Navigate to load-tests directory
cd load-tests

# Make run script executable
chmod +x run-local.sh

# Run smoke test against local environment
./run-local.sh smoke local

# Run load test against staging
./run-local.sh load staging

# Run stress test against production
./run-local.sh stress production
```

### Using Docker Compose

For a complete testing environment with visualization:

```bash
# Start all services (InfluxDB, Grafana, Mock APIs, MQTT broker)
docker-compose up -d

# Run tests
docker-compose run k6

# View results in Grafana: http://localhost:3000
# Default credentials: admin/admin
```

## Test Scripts

### `test-skyline-mmwave.js`
Main load test script that:
- Simulates cloud API ingestion
- Tests edge inference performance  
- Validates MQTT broker integration
- Uses realistic sensor data from fixtures
- Enforces all performance gates

### `test-skyline-smoke.js`
Lightweight smoke test for quick validation.

## Results and Reporting

### Output Locations

| Location | Contents |
|----------|----------|
| `load-test-results/` | Detailed JSON results |
| `smoke-test-results/` | Smoke test results |
| `performance-report.md` | Human-readable summary |
| GitHub Actions Artifacts | All results uploaded |

### Metrics Collected

- Response times (avg, p50, p95, p99, max)
- Throughput (requests/second, requests/minute)
- Error rates and types
- Virtual user count
- Data transfer rates
- Custom metrics (cloud_latency_ms, edge_latency_ms)

### Failure Conditions

The pipeline will fail if:

1. **Performance gates not met**: Any threshold violated
2. **High error rate**: > 1% of requests fail
3. **Service unavailability**: Endpoints not reachable
4. **Test execution error**: Script failures

## Customization

### Adding New Test Scenarios

1. Create new test script in `scripts/` directory
2. Add scenario to `test-skyline-mmwave.js` if appropriate
3. Update GitHub Actions workflow to include new test type
4. Update `run-local.sh` script for local execution

### Modifying Performance Gates

Edit thresholds in:

1. `test-skyline-mmwave.js` - `thresholds` section
2. `.github/workflows/load-test.yml` - `performance-gates` step
3. `run-local.sh` - performance gate checks

### Adding New Test Data

1. Add fixtures to `tests/fixtures/skyline-mmwave-golden/`
2. Update `test-skyline-mmwave.js` to load new fixtures
3. Regenerate test data using scripts from Action 1.2

## Monitoring and Alerting

### Grafana Dashboards

Pre-configured dashboards available in `grafana/dashboards/`:

1. **Load Test Overview**: High-level metrics and status
2. **Performance Gates**: Threshold compliance
3. **Response Time Analysis**: Latency breakdown
4. **Error Analysis**: Failure patterns and causes

### Notifications

Configure in GitHub Actions workflow:

- Slack/Teams webhooks
- Email notifications
- Custom webhook endpoints
- Status badges for README

## Troubleshooting

### Common Issues

1. **Tests failing with connection errors**
   - Check environment URLs are correct
   - Verify network connectivity
   - Ensure services are running

2. **Performance gates too strict**
   - Adjust thresholds based on baseline metrics
   - Consider environment differences (staging vs production)
   - Review test configuration (VUs, duration)

3. **Inconsistent results**
   - Run tests multiple times for statistical significance
   - Check for external factors (network, shared resources)
   - Review test data for variability

4. **High memory usage**
   - Reduce number of virtual users
   - Shorten test duration
   - Use `SharedArray` for large test data

### Debugging Tips

```bash
# Run with verbose output
k6 run --verbose scripts/test-skyline-smoke.js

# Run with lower load for debugging
k6 run --vus 1 --duration 30s scripts/test-skyline-mmwave.js

# Check test data
node -e "console.log(require('./scripts/test-skyline-mmwave.js').options)"

# Validate JSON fixtures
jq . tests/fixtures/skyline-mmwave-golden/*.json
```

## Best Practices

1. **Run tests regularly**: Catch regressions early
2. **Maintain baseline metrics**: Track performance over time
3. **Test in production-like environments**: Staging should mirror production
4. **Monitor resource usage**: CPU, memory, network during tests
5. **Version test scripts**: Track changes to test logic
6. **Document performance changes**: Note intentional threshold adjustments
7. **Review failed tests promptly**: Investigate and fix issues quickly

## Related Documentation

- [k6 Documentation](https://k6.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Skyline mmWave Test Fixtures](../tests/fixtures/skyline-mmwave-golden/README.md)
- [Performance Baseline Metrics](./BASELINE_METRICS.md)