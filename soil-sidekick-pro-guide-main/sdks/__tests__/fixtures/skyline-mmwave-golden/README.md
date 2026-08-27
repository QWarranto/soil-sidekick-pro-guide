# Skyline mmWave Sensor Data - Golden Test Fixtures

## Overview

This directory contains 20 golden test fixtures for Skyline Instruments mmWave sensor data ingestion. These fixtures support testing of:

1. **Valid sensor readings** with realistic mmWave patterns
2. **Corrupt/malformed data** edge cases for validation testing
3. **JSON Schema versioning** test fixtures for firmware updates
4. **Load test data** for 50 simultaneous Skyline devices
5. **MQTT topic payload generators** for real-time ingestion

## File Structure

### Schema Definitions
- `schema-v1.0.json` - Initial schema for firmware v1.0
- `schema-v1.1.json` - Enhanced schema with target tracking (v1.1)
- `schema-v2.0.json` - Major breaking changes (v2.0)

### Test Fixtures (20 files)

#### Category 1: Valid Sensor Readings (01-05)
- `01-valid-normal-operation-v1.0.json` - Normal operation with v1.0 schema
- `02-valid-high-traffic-v1.1.json` - High traffic scenario with v1.1 schema
- `03-valid-edge-detection-v2.0.json` - Edge detection with v2.0 schema
- `04-valid-industrial-environment-v1.0.json` - Industrial environment data
- `05-valid-multi-sensor-fusion-v1.1.json` - Multi-sensor fusion scenario

#### Category 2: Corrupt/Malformed Data (06-10)
- `06-corrupt-malformed-json.json` - Type mismatches, out-of-range values
- `07-corrupt-missing-required-fields.json` - Missing required fields
- `08-corrupt-buffer-overflow.json` - Extremely large values, buffer overflow risks
- `09-corrupt-encoding-issues.json` - Special characters, control chars, injection attempts
- `10-corrupt-timing-anomalies.json` - Invalid timestamps, duplicates, sequence issues

#### Category 3: Schema Versioning (11-13)
- `11-schema-v1.0-to-v1.1-backward-compatible.json` - Tests backward compatibility
- `12-schema-v1.1-to-v2.0-breaking-changes.json` - Tests breaking changes
- `13-schema-migration-path-v1.0-v1.1-v2.0.json` - Complete migration path with transformation rules

#### Category 4: Load Test Data (14-17)
- `14-load-50-devices-burst.json` - 50 devices transmitting simultaneously
- `15-load-50-devices-sustained.json` - 24-hour sustained operation
- `16-load-spike-to-1000-devices.json` - Spike from 50 to 1000 devices
- `17-load-mixed-schema-versions.json` - Mixed schema versions across devices

#### Category 5: MQTT Generators (18-20)
- `18-mqtt-topic-structure.json` - Topic structure and payload examples
- `19-mqtt-payload-generator-script.js` - Node.js generator for test data
- `20-validation-test-suite.js` - Complete validation test suite

## Schema Evolution

### v1.0 → v1.1 Changes
- **Added**: `target_tracking` array (required in v1.1, optional in v1.0)
- **Impact**: v1.0 data fails v1.1 validation (backward incompatible)

### v1.1 → v2.0 Changes (Breaking)
- **Field renames**: All major fields renamed (e.g., `sensor_readings` → `sensor_data`)
- **Type changes**: `target_id` integer → string format
- **Added fields**: `elevation_deg`, `calibration_quality`, `uptime_seconds`
- **Scale changes**: `interference_level` (0-1) → `interference_score` (0-10)

## Usage Examples

### 1. Validating a Fixture
```javascript
const validator = new SkylineFixtureValidator();
const result = validator.validateFixture('01-valid-normal-operation-v1.0.json');
console.log(result.valid); // true
```

### 2. Generating MQTT Test Data
```javascript
const generator = new SkylineMQTTGenerator({
  deviceCount: 50,
  transmissionRate: 10,
  duration: 60
});
const testData = generator.generateTestData();
generator.saveToFile(testData, 'mqtt-test-output.json');
```

### 3. Running Complete Validation
```bash
node 20-validation-test-suite.js
```

## Test Scenarios Covered

### Validation Testing
- Schema compliance for all three versions
- Type checking and range validation
- Required field enforcement
- Pattern validation (device IDs, timestamps)

### Edge Case Testing
- Buffer overflow protection
- Injection attack prevention
- Malformed JSON handling
- Timing anomaly detection

### Load Testing
- Burst capacity (50 devices @ 100 readings/sec)
- Sustained load (24-hour operation)
- Auto-scaling (50 → 1000 device spike)
- Mixed schema version handling

### Integration Testing
- MQTT topic structure compliance
- Payload generation at scale
- Real-time ingestion validation
- Error handling and recovery

## Performance Requirements

Based on Skyline's $1.2T market analysis:

| Metric | Requirement | Test Coverage |
|--------|-------------|---------------|
| Throughput | 10,000+ readings/minute | Fixtures 14-17 |
| Latency (P95) | < 1000ms cloud, < 100ms edge | Load test validation |
| Device Support | 50+ simultaneous devices | All load test fixtures |
| Schema Support | v1.0, v1.1, v2.0 concurrently | Fixtures 11-13, 17 |
| Data Integrity | Zero loss during spikes | Fixture 16 validation |

## Integration with CI/CD

These fixtures can be integrated into CI/CD pipelines:

1. **Schema Validation Gate**: Fail builds on schema violations
2. **Performance Regression**: Compare against load test baselines
3. **Backward Compatibility**: Verify migration paths work
4. **Security Scanning**: Check for injection vulnerabilities

## Dependencies

- Node.js 14+ (for generator scripts)
- Ajv JSON Schema Validator (included in test suite)
- MQTT client (for integration testing)

## Maintenance

### Adding New Fixtures
1. Follow naming convention: `{category}-{description}-{schema}.json`
2. Include appropriate metadata
3. Update validation test suite
4. Update this README

### Schema Updates
1. Create new schema file (e.g., `schema-v2.1.json`)
2. Update migration fixtures
3. Update validation logic
4. Test backward compatibility

## License

These test fixtures are part of the Skyline Instruments integration test suite for SoilSidekick Pro SDK.

---

*Generated: March 3, 2026*  
*For: Skyline mmWave Sensor Data Ingestion Testing*  
*Phase 1 Action 1.2: Test Data Generation Automation*