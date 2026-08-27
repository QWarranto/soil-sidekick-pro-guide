# Skyline mmWave Test Fixtures

These fixtures were generated in Action 1.2 and are used for load testing.

## File List

- ./01-valid-normal-operation-v1.0.json
- ./02-valid-high-traffic-v1.1.json
- ./03-valid-edge-detection-v2.0.json
- ./04-valid-industrial-environment-v1.0.json
- ./05-valid-multi-sensor-fusion-v1.1.json
- ./06-corrupt-malformed-json.json
- ./07-corrupt-missing-required-fields.json
- ./08-corrupt-buffer-overflow.json
- ./09-corrupt-encoding-issues.json
- ./10-corrupt-timing-anomalies.json
- ./11-schema-v1.0-to-v1.1-backward-compatible.json
- ./12-schema-v1.1-to-v2.0-breaking-changes.json
- ./13-schema-migration-path-v1.0-v1.1-v2.0.json
- ./14-load-50-devices-burst.json
- ./15-load-50-devices-sustained.json
- ./16-load-spike-to-1000-devices.json
- ./17-load-mixed-schema-versions.json
- ./18-mqtt-topic-structure.json
- ./19-mqtt-payload-generator-script.js
- ./20-validation-test-suite.js
- ./package.json
- ./schema-v1.0.json
- ./schema-v1.1.json
- ./schema-v2.0.json

## Usage in Load Tests

The load test scripts (`test-skyline-mmwave.js`) use these fixtures to generate
realistic sensor data for testing:

1. **Valid sensor readings**: Normal operation scenarios
2. **Corrupt data**: Negative test cases
3. **Load scenarios**: Sustained and spike load patterns
4. **MQTT data**: Broker integration tests
5. **Schema versions**: v1.0, v1.1, v2.0 compatibility

## Schema Versions

- `schema-v1.0.json`: Initial release schema
- `schema-v1.1.json`: Added target tracking
- `schema-v2.0.json`: Enhanced sensor fusion

## Load Scenarios

- `14-load-50-devices-burst.json`: Short burst of 50 devices
- `15-load-50-devices-sustained.json`: 24-hour sustained load
- `16-load-spike-to-1000-devices.json`: Spike to 1000 devices
- `17-load-mixed-schema-versions.json`: Mixed schema compatibility

## MQTT Integration

- `18-mqtt-topic-structure.json`: Topic hierarchy and examples
- `19-mqtt-payload-generator-script.js`: Dynamic payload generation

## Validation

- `20-validation-test-suite.js\": Comprehensive validation tests
- `validate-fixtures.sh`: Shell script for validation
