# k6 Load Test Docker Image
FROM grafana/k6:latest

# Install additional tools
RUN apk add --no-cache \
    jq \
    curl \
    bash \
    python3 \
    py3-pip \
    nodejs \
    npm

# Install Python dependencies for test data generation
RUN pip3 install --no-cache-dir \
    faker \
    numpy

# Create working directory
WORKDIR /app

# Copy test scripts and fixtures
COPY scripts/ ./scripts/
COPY queries/ ./queries/
COPY README.md ./
COPY BASELINE_METRICS.md ./

# Create directory for test results
RUN mkdir -p /results

# Create a script to run tests with environment variables
RUN cat > /usr/local/bin/run-load-test << 'EOF'
#!/bin/bash
set -e

# Default environment variables
export CLOUD_API_URL=${CLOUD_API_URL:-"https://api.example.com"}
export EDGE_API_URL=${EDGE_API_URL:-"https://edge-api.example.com"}
export MQTT_BROKER_URL=${MQTT_BROKER_URL:-"https://mqtt-broker.example.com"}
export API_KEY=${API_KEY}
export EDGE_API_KEY=${EDGE_API_KEY}
export MQTT_CLIENT_ID=${MQTT_CLIENT_ID:-"docker-k6-$(date +%s)"}

# Test type selection
TEST_TYPE=${TEST_TYPE:-"smoke"}
TEST_SCRIPT=""

case "$TEST_TYPE" in
    smoke)
        TEST_SCRIPT="test-skyline-smoke.js"
        ;;
    load)
        TEST_SCRIPT="test-skyline-mmwave.js"
        ;;
    *)
        echo "Unknown test type: $TEST_TYPE"
        echo "Available types: smoke, load"
        exit 1
        ;;
esac

echo "Running $TEST_TYPE test with script: $TEST_SCRIPT"
echo "Cloud API URL: $CLOUD_API_URL"
echo "Edge API URL: $EDGE_API_URL"
echo "MQTT Broker URL: $MQTT_BROKER_URL"

# Run k6 with appropriate options
if [ "$TEST_TYPE" = "smoke" ]; then
    k6 run \
        --out json=/results/smoke-results.json \
        --summary-export=/results/smoke-summary.json \
        "/app/scripts/$TEST_SCRIPT"
else
    k6 run \
        --env CLOUD_API_URL="$CLOUD_API_URL" \
        --env EDGE_API_URL="$EDGE_API_URL" \
        --env MQTT_BROKER_URL="$MQTT_BROKER_URL" \
        --env API_KEY="$API_KEY" \
        --env EDGE_API_KEY="$EDGE_API_KEY" \
        --env MQTT_CLIENT_ID="$MQTT_CLIENT_ID" \
        --out json=/results/load-results.json \
        --summary-export=/results/load-summary.json \
        --out influxdb="$INFLUXDB_URL" \
        "/app/scripts/$TEST_SCRIPT"
fi

# Generate a simple report
if [ -f "/results/load-summary.json" ]; then
    echo "Generating performance report..."
    jq '.' /results/load-summary.json > /results/report.json
    
    # Extract key metrics
    CLOUD_P95=$(jq -r '.metrics | .["http_req_duration{scenario:cloud_api}"]? | .["p(95)"] // 0' /results/load-summary.json)
    EDGE_P95=$(jq -r '.metrics | .["http_req_duration{scenario:edge_inference}"]? | .["p(95)"] // 0' /results/load-summary.json)
    
    cat > /results/performance-gates.md << EOR
# Performance Gates Report

## Thresholds
- Cloud API P95: < 1000ms
- Edge Inference P95: < 100ms
- Throughput: > 10,000 requests/minute
- Error Rate: < 1%

## Results
- Cloud API P95: ${CLOUD_P95}ms
- Edge Inference P95: ${EDGE_P95}ms

## Status
$(if [ $(echo "$CLOUD_P95 < 1000" | bc -l) -eq 1 ]; then echo "- Cloud API: ✅ PASS"; else echo "- Cloud API: ❌ FAIL"; fi)
$(if [ $(echo "$EDGE_P95 < 100" | bc -l) -eq 1 ]; then echo "- Edge Inference: ✅ PASS"; else echo "- Edge Inference: ❌ FAIL"; fi)
EOR
    
    cat /results/performance-gates.md
fi
EOF

RUN chmod +x /usr/local/bin/run-load-test

# Default command
CMD ["run-load-test"]

# Volume for test results
VOLUME ["/results"]

# Labels
LABEL maintainer="devops@example.com"
LABEL description="k6 Load Test Container for Skyline mmWave Sensor Platform"
LABEL version="1.0.0"