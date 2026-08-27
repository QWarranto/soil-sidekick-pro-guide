#!/bin/bash

# Copy test fixtures from Action 1.2 to load-tests directory

set -e

echo "Copying test fixtures from Action 1.2..."

# Check if we're in the right directory
FIXTURE_SOURCE=""
if [ -d "../tests/fixtures/skyline-mmwave-golden" ]; then
    FIXTURE_SOURCE="../tests/fixtures/skyline-mmwave-golden"
elif [ -d "../../tests/fixtures/skyline-mmwave-golden" ]; then
    FIXTURE_SOURCE="../../tests/fixtures/skyline-mmwave-golden"
elif [ -d "../../../tests/fixtures/skyline-mmwave-golden" ]; then
    FIXTURE_SOURCE="../../../tests/fixtures/skyline-mmwave-golden"
elif [ -d "/Users/reginaldrice/.openclaw/workspace/tests/fixtures/skyline-mmwave-golden" ]; then
    FIXTURE_SOURCE="/Users/reginaldrice/.openclaw/workspace/tests/fixtures/skyline-mmwave-golden"
fi

if [ -z "$FIXTURE_SOURCE" ]; then
    echo "Error: Test fixtures not found."
    echo "Searching for: tests/fixtures/skyline-mmwave-golden/"
    echo "Current directory: $(pwd)"
    echo ""
    echo "Try finding them manually:"
    find ../../.. -name "skyline-mmwave-golden" -type d 2>/dev/null | head -5
    exit 1
fi

# Create fixtures directory
mkdir -p fixtures

# Copy fixtures
echo "Copying fixtures from: $FIXTURE_SOURCE"
cp -r "$FIXTURE_SOURCE"/* fixtures/ 2>/dev/null || {
    echo "Warning: Some files may not have copied. Trying one by one..."
    for file in "$FIXTURE_SOURCE"/*; do
        if [ -f "$file" ]; then
            cp "$file" fixtures/ && echo "  Copied: $(basename "$file")"
        fi
    done
}

# Create a summary of copied files
echo "Fixtures copied:"
ls -la fixtures/ | head -20

# Create a simple index file
cat > fixtures/INDEX.md << EOF
# Skyline mmWave Test Fixtures

These fixtures were generated in Action 1.2 and are used for load testing.

## File List

$(cd fixtures && find . -name "*.json" -o -name "*.js" | sort | sed 's/^/- /')

## Usage in Load Tests

The load test scripts (\`test-skyline-mmwave.js\`) use these fixtures to generate
realistic sensor data for testing:

1. **Valid sensor readings**: Normal operation scenarios
2. **Corrupt data**: Negative test cases
3. **Load scenarios**: Sustained and spike load patterns
4. **MQTT data**: Broker integration tests
5. **Schema versions**: v1.0, v1.1, v2.0 compatibility

## Schema Versions

- \`schema-v1.0.json\`: Initial release schema
- \`schema-v1.1.json\`: Added target tracking
- \`schema-v2.0.json\`: Enhanced sensor fusion

## Load Scenarios

- \`14-load-50-devices-burst.json\`: Short burst of 50 devices
- \`15-load-50-devices-sustained.json\`: 24-hour sustained load
- \`16-load-spike-to-1000-devices.json\`: Spike to 1000 devices
- \`17-load-mixed-schema-versions.json\`: Mixed schema compatibility

## MQTT Integration

- \`18-mqtt-topic-structure.json\`: Topic hierarchy and examples
- \`19-mqtt-payload-generator-script.js\`: Dynamic payload generation

## Validation

- \`20-validation-test-suite.js\": Comprehensive validation tests
- \`validate-fixtures.sh\`: Shell script for validation
EOF

echo ""
echo "Fixtures copied successfully to: $(pwd)/fixtures/"
echo "Index created: fixtures/INDEX.md"