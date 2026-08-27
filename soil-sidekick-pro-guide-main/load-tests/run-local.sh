#!/bin/bash

# Skyline mmWave Load Test Runner
# Run locally with: ./run-local.sh [smoke|load|stress]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE=${1:-"smoke"}
ENVIRONMENT=${2:-"local"}
RESULTS_DIR="./test-results/$(date +%Y%m%d-%H%M%S)"
K6_IMAGE="grafana/k6:latest"

# Create results directory
mkdir -p "$RESULTS_DIR"

echo -e "${GREEN}Skyline mmWave Load Test Runner${NC}"
echo "Test Type: $TEST_TYPE"
echo "Environment: $ENVIRONMENT"
echo "Results Directory: $RESULTS_DIR"
echo ""

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo -e "${YELLOW}k6 not found. Installing via Docker...${NC}"
    USE_DOCKER=true
else
    USE_DOCKER=false
fi

# Set environment variables based on environment
case "$ENVIRONMENT" in
    local)
        export CLOUD_API_URL="http://localhost:3001"
        export EDGE_API_URL="http://localhost:3002"
        export MQTT_BROKER_URL="http://localhost:1883"
        export API_KEY="local-test-key"
        export EDGE_API_KEY="local-edge-key"
        ;;
    staging)
        export CLOUD_API_URL="${CLOUD_API_URL:-https://api.staging.example.com}"
        export EDGE_API_URL="${EDGE_API_URL:-https://edge-api.staging.example.com}"
        export MQTT_BROKER_URL="${MQTT_BROKER_URL:-https://mqtt-broker.staging.example.com}"
        ;;
    production)
        export CLOUD_API_URL="${CLOUD_API_URL:-https://api.example.com}"
        export EDGE_API_URL="${EDGE_API_URL:-https://edge-api.example.com}"
        export MQTT_BROKER_URL="${MQTT_BROKER_URL:-https://mqtt-broker.example.com}"
        ;;
    *)
        echo -e "${RED}Unknown environment: $ENVIRONMENT${NC}"
        echo "Available environments: local, staging, production"
        exit 1
        ;;
esac

# Select test script
case "$TEST_TYPE" in
    smoke)
        TEST_SCRIPT="test-skyline-smoke.js"
        K6_ARGS="--vus 5 --duration 1m"
        ;;
    load)
        TEST_SCRIPT="test-skyline-mmwave.js"
        K6_ARGS=""
        ;;
    stress)
        TEST_SCRIPT="test-skyline-mmwave.js"
        K6_ARGS="--vus 500 --duration 10m"
        ;;
    *)
        echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
        echo "Available test types: smoke, load, stress"
        exit 1
        ;;
esac

echo -e "${GREEN}Running $TEST_TYPE test...${NC}"
echo "Cloud API: $CLOUD_API_URL"
echo "Edge API: $EDGE_API_URL"
echo "MQTT Broker: $MQTT_BROKER_URL"
echo ""

# Run the test
if [ "$USE_DOCKER" = true ]; then
    echo -e "${YELLOW}Running with Docker...${NC}"
    
    # Create a temporary script with environment variables
    cat > /tmp/k6-run.sh << EOF
#!/bin/bash
export CLOUD_API_URL="$CLOUD_API_URL"
export EDGE_API_URL="$EDGE_API_URL"
export MQTT_BROKER_URL="$MQTT_BROKER_URL"
export API_KEY="$API_KEY"
export EDGE_API_KEY="$EDGE_API_KEY"
export MQTT_CLIENT_ID="local-run-\$(date +%s)"
k6 run $K6_ARGS \
  --out json="$RESULTS_DIR/results.json" \
  --summary-export="$RESULTS_DIR/summary.json" \
  "/scripts/$TEST_SCRIPT"
EOF
    
    chmod +x /tmp/k6-run.sh
    
    docker run --rm \
      -v "$(pwd)/scripts:/scripts" \
      -v "$RESULTS_DIR:/results" \
      -v /tmp/k6-run.sh:/k6-run.sh \
      --network host \
      $K6_IMAGE \
      /k6-run.sh
else
    echo -e "${GREEN}Running with local k6 installation...${NC}"
    
    export MQTT_CLIENT_ID="local-run-$(date +%s)"
    
    k6 run $K6_ARGS \
      --out json="$RESULTS_DIR/results.json" \
      --summary-export="$RESULTS_DIR/summary.json" \
      "scripts/$TEST_SCRIPT"
fi

# Check if test completed successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Test completed successfully!${NC}"
    
    # Parse and display summary
    if [ -f "$RESULTS_DIR/summary.json" ]; then
        echo ""
        echo -e "${GREEN}=== Test Summary ===${NC}"
        
        # Extract key metrics
        TOTAL_REQUESTS=$(jq -r '.metrics["http_reqs"].count // 0' "$RESULTS_DIR/summary.json")
        ERROR_RATE=$(jq -r '.metrics["errors"].rate // 0' "$RESULTS_DIR/summary.json")
        DURATION_MS=$(jq -r '.state.testRunDurationMs // 0' "$RESULTS_DIR/summary.json")
        
        # Calculate throughput
        if [ "$DURATION_MS" -gt 0 ]; then
            REQUESTS_PER_MINUTE=$((TOTAL_REQUESTS * 60000 / DURATION_MS))
        else
            REQUESTS_PER_MINUTE=0
        fi
        
        # Check performance gates for load tests
        if [ "$TEST_TYPE" = "load" ] || [ "$TEST_TYPE" = "stress" ]; then
            CLOUD_P95=$(jq -r '.metrics | .["http_req_duration{scenario:cloud_api}"]? | .["p(95)"] // 0' "$RESULTS_DIR/summary.json")
            EDGE_P95=$(jq -r '.metrics | .["http_req_duration{scenario:edge_inference}"]? | .["p(95)"] // 0' "$RESULTS_DIR/summary.json")
            
            echo "Performance Gates:"
            echo "  Cloud API P95: ${CLOUD_P95}ms (threshold: < 1000ms)"
            echo "  Edge Inference P95: ${EDGE_P95}ms (threshold: < 100ms)"
            echo "  Throughput: ${REQUESTS_PER_MINUTE} req/min (threshold: > 10,000 req/min)"
            echo "  Error Rate: $(echo "$ERROR_RATE * 100" | bc -l | xargs printf "%.2f")% (threshold: < 1%)"
            
            # Check each gate
            CLOUD_PASS=$(echo "$CLOUD_P95 < 1000" | bc -l)
            EDGE_PASS=$(echo "$EDGE_P95 < 100" | bc -l)
            THROUGHPUT_PASS=$(echo "$REQUESTS_PER_MINUTE > 10000" | bc -l)
            ERROR_PASS=$(echo "$ERROR_RATE < 0.01" | bc -l)
            
            ALL_PASS=$((CLOUD_PASS && EDGE_PASS && THROUGHPUT_PASS && ERROR_PASS))
            
            if [ $ALL_PASS -eq 1 ]; then
                echo -e "${GREEN}✅ All performance gates passed!${NC}"
            else
                echo -e "${RED}❌ Some performance gates failed:${NC}"
                [ $CLOUD_PASS -eq 0 ] && echo "  - Cloud API P95 too high"
                [ $EDGE_PASS -eq 0 ] && echo "  - Edge Inference P95 too high"
                [ $THROUGHPUT_PASS -eq 0 ] && echo "  - Throughput too low"
                [ $ERROR_PASS -eq 0 ] && echo "  - Error rate too high"
            fi
        fi
        
        echo ""
        echo "Detailed results saved to: $RESULTS_DIR/"
        echo "View summary: cat $RESULTS_DIR/summary.json | jq ."
    fi
else
    echo -e "${RED}Test failed!${NC}"
    exit 1
fi

# Generate HTML report if we have results
if command -v jq &> /dev/null && [ -f "$RESULTS_DIR/summary.json" ]; then
    echo ""
    echo -e "${GREEN}Generating HTML report...${NC}"
    
    cat > "$RESULTS_DIR/report.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Load Test Report - $(date)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .pass { color: green; }
        .fail { color: red; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Skyline mmWave Load Test Report</h1>
        <p>Test Type: $TEST_TYPE | Environment: $ENVIRONMENT</p>
        <p>Generated: $(date)</p>
    </div>
    
    <h2>Performance Gates</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Result</th>
            <th>Threshold</th>
            <th>Status</th>
        </tr>
EOF
    
    # Add performance gates if available
    if [ "$TEST_TYPE" = "load" ] || [ "$TEST_TYPE" = "stress" ]; then
        CLOUD_P95=$(jq -r '.metrics | .["http_req_duration{scenario:cloud_api}"]? | .["p(95)"] // 0' "$RESULTS_DIR/summary.json")
        EDGE_P95=$(jq -r '.metrics | .["http_req_duration{scenario:edge_inference}"]? | .["p(95)"] // 0' "$RESULTS_DIR/summary.json")
        
        cat >> "$RESULTS_DIR/report.html" << EOF
        <tr>
            <td>Cloud API P95</td>
            <td>${CLOUD_P95}ms</td>
            <td>&lt; 1000ms</td>
            <td class="$( [ $(echo "$CLOUD_P95 < 1000" | bc -l) -eq 1 ] && echo "pass" || echo "fail" )">
                $( [ $(echo "$CLOUD_P95 < 1000" | bc -l) -eq 1 ] && echo "✅ PASS" || echo "❌ FAIL" )
            </td>
        </tr>
        <tr>
            <td>Edge Inference P95</td>
            <td>${EDGE_P95}ms</td>
            <td>&lt; 100ms</td>
            <td class="$( [ $(echo "$EDGE_P95 < 100" | bc -l) -eq 1 ] && echo "pass" || echo "fail" )">
                $( [ $(echo "$EDGE_P95 < 100" | bc -l) -eq 1 ] && echo "✅ PASS" || echo "❌ FAIL" )
            </td>
        </tr>
EOF
    fi
    
    cat >> "$RESULTS_DIR/report.html" << EOF
    </table>
    
    <h2>Raw Results</h2>
    <pre>
$(cat "$RESULTS_DIR/summary.json" | jq . 2>/dev/null || echo "Unable to parse JSON")
    </pre>
</body>
</html>
EOF
    
    echo "HTML report generated: $RESULTS_DIR/report.html"
fi

echo ""
echo -e "${GREEN}Done!${NC}"