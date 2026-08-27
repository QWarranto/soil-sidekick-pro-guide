# Skyline mmWave Sensor Data - Validation Report

Generated: 2026-03-17T00:45:27.128Z
Total fixtures validated: 21

## Summary

- ✅ Valid: 9
- ❌ Invalid: 7
- ⚠️  Not Applicable: 5

## Detailed Results

### ✅ 01-valid-normal-operation-v1.0.json
- Schema: schema-v1.0
- Expected: valid ✅

### ✅ 02-valid-high-traffic-v1.1.json
- Schema: schema-v1.1
- Expected: valid ✅

### ✅ 03-valid-edge-detection-v2.0.json
- Schema: schema-v2.0
- Expected: valid ✅

### ✅ 04-valid-industrial-environment-v1.0.json
- Schema: schema-v1.0
- Expected: valid ✅

### ❌ 05-valid-multi-sensor-fusion-v1.1.json
- Schema: schema-v1.1
- Expected: valid ❌
- Errors: 1
  - /sensor_readings/target_tracking/2/range_m: must be <= 200

### ❌ 06-corrupt-malformed-json.json
- Schema: schema-v1.0
- Expected: invalid ✅
- Errors: 16
  - /device_id: must match pattern "^SKY-[A-Z0-9]{8}-[A-Z0-9]{4}$"
  - /sensor_readings/mmwave_frequency_ghz: must be number
  - /sensor_readings/target_count: must be integer
  - /calibration_status/last_calibration: must match format "date-time"
  - /calibration_status/calibration_drift: must be number
  - ... and 11 more errors

### ❌ 07-corrupt-missing-required-fields.json
- Schema: schema-v1.0
- Expected: invalid ✅
- Errors: 3
  - : must have required property 'device_id'
  - /sensor_readings: must have required property 'mmwave_frequency_ghz'
  - /calibration_status: must have required property 'last_calibration'

### ❌ 08-corrupt-buffer-overflow.json
- Schema: schema-v1.0
- Expected: invalid ✅
- Errors: 6
  - /sensor_readings/target_count: must be <= 256
  - /calibration_status/calibration_drift: must be <= 100
  - /environmental_conditions/temperature_c: must be <= 85
  - /environmental_conditions/humidity_percent: must be <= 100
  - /metadata/battery_level: must be <= 100
  - ... and 1 more errors

### ✅ 09-corrupt-encoding-issues.json
- Schema: schema-v1.0
- Expected: invalid ❌

### ✅ 10-corrupt-timing-anomalies.json - reading 1
- Schema: schema-v1.0
- Expected: invalid ❌

### ✅ 10-corrupt-timing-anomalies.json - reading 2
- Schema: schema-v1.0
- Expected: invalid ❌

### ✅ 11-schema-v1.0-to-v1.1-backward-compatible.json
- Schema: schema-v1.0
- Expected: valid ✅

### ✅ 12-schema-v1.1-to-v2.0-breaking-changes.json
- Schema: schema-v1.1
- Expected: valid ✅

### ❌ 13-schema-migration-path-v1.0-v1.1-v2.0.json - v1.0
- Schema: schema-v1.0
- Expected: valid ❌
- Errors: 1
  - /device_id: must match pattern "^SKY-[A-Z0-9]{8}-[A-Z0-9]{4}$"

### ❌ 13-schema-migration-path-v1.0-v1.1-v2.0.json - v1.1
- Schema: schema-v1.1
- Expected: valid ❌
- Errors: 1
  - /device_id: must match pattern "^SKY-[A-Z0-9]{8}-[A-Z0-9]{4}$"

### ❌ 13-schema-migration-path-v1.0-v1.1-v2.0.json - v2.0
- Schema: schema-v2.0
- Expected: valid ❌
- Errors: 1
  - /device_id: must match pattern "^SKY-[A-Z0-9]{8}-[A-Z0-9]{4}$"

### ⚠️ 14-load-50-devices-burst.json

### ⚠️ 15-load-50-devices-sustained.json

### ⚠️ 16-load-spike-to-1000-devices.json

### ⚠️ 17-load-mixed-schema-versions.json

### ⚠️ 18-mqtt-topic-structure.json

## Schema Coverage

- schema-v1.0: 10 fixtures
- schema-v1.1: 4 fixtures
- schema-v2.0: 2 fixtures

## Test Categories

1. **Valid Sensor Readings** (01-05): Realistic mmWave patterns
2. **Corrupt/Malformed Data** (06-10): Edge cases for validation
3. **Schema Versioning** (11-13): Firmware update compatibility
4. **Load Test Data** (14-17): 50+ device simulation
5. **MQTT Generators** (18-20): Topic/payload generation
