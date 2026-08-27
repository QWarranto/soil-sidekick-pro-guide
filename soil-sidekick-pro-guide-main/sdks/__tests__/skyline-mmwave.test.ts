import { SkylineMMWaveValidator } from '../sensors/skyline-mmwave-validator';
import fs from 'fs';
import path from 'path';

describe('Skyline mmWave Sensor Data Validation', () => {
  let validator: SkylineMMWaveValidator;

  beforeEach(() => {
    validator = new SkylineMMWaveValidator();
  });

  describe('Schema Validation', () => {
    const fixturesDir = path.join(__dirname, 'fixtures', 'skyline-mmwave-golden');

    // Test valid sensor readings (01-05)
    describe('Valid Sensor Readings', () => {
      const validFixtures = [
        '01-valid-normal-operation-v1.0.json',
        '02-valid-high-traffic-v1.1.json',
        '03-valid-edge-detection-v2.0.json',
        '04-valid-industrial-environment-v1.0.json',
        '05-valid-multi-sensor-fusion-v1.1.json',
      ];

      validFixtures.forEach(fixtureName => {
        it(`should validate ${fixtureName}`, () => {
          const fixturePath = path.join(fixturesDir, fixtureName);
          const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
          
          const result = validator.validate(data);
          
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
          expect(result.schemaVersion).toBeDefined();
        });
      });
    });

    // Test corrupt/malformed data (06-10)
    describe('Corrupt/Malformed Data', () => {
      const corruptFixtures = [
        '06-corrupt-malformed-json.json',
        '07-corrupt-missing-required-fields.json',
        '08-corrupt-buffer-overflow.json',
        '09-corrupt-encoding-issues.json',
        '10-corrupt-timing-anomalies.json',
      ];

      corruptFixtures.forEach(fixtureName => {
        it(`should reject ${fixtureName}`, () => {
          const fixturePath = path.join(fixturesDir, fixtureName);
          const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
          
          const result = validator.validate(data);
          
          expect(result.valid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        });
      });
    });

    // Test schema versioning (11-13)
    describe('Schema Versioning', () => {
      it('should detect v1.0 schema correctly', () => {
        const fixturePath = path.join(fixturesDir, '11-schema-v1.0-to-v1.1-backward-compatible.json');
        const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
        
        const result = validator.validate(data);
        
        expect(result.schemaVersion).toBe('v1.0');
        // v1.0 data should be valid against v1.0 schema
        expect(result.valid).toBe(true);
      });

      it('should detect v1.1 schema correctly', () => {
        const fixturePath = path.join(fixturesDir, '12-schema-v1.1-to-v2.0-breaking-changes.json');
        const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
        
        const result = validator.validate(data);
        
        expect(result.schemaVersion).toBe('v1.1');
        // v1.1 data should be valid against v1.1 schema
        expect(result.valid).toBe(true);
      });

      it('should handle migration path fixture', () => {
        const fixturePath = path.join(fixturesDir, '13-schema-migration-path-v1.0-v1.1-v2.0.json');
        const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
        
        // Test v1.0 data
        const v1Result = validator.validate(data['v1.0']);
        expect(v1Result.schemaVersion).toBe('v1.0');
        expect(v1Result.valid).toBe(true);
        
        // Test v1.1 data
        const v1_1Result = validator.validate(data['v1.1']);
        expect(v1_1Result.schemaVersion).toBe('v1.1');
        expect(v1_1Result.valid).toBe(true);
        
        // Test v2.0 data
        const v2Result = validator.validate(data['v2.0']);
        expect(v2Result.schemaVersion).toBe('v2.0');
        expect(v2Result.valid).toBe(true);
      });
    });
  });

  describe('Data Transformation', () => {
    it('should transform v1.0 data to v1.1 format', () => {
      const v1Data = {
        device_id: 'SKY-TEST-0001',
        firmware_version: 'v1.0.5',
        timestamp: '2026-03-03T10:00:00.000Z',
        sensor_readings: {
          mmwave_frequency_ghz: 60.5,
          signal_strength_db: -45.2,
          doppler_velocity_mps: 12.3,
          range_resolution_mm: 5.2,
          angle_resolution_deg: 2.5,
          target_count: 3,
          noise_floor_db: -95.7,
          interference_level: 0.1
        }
      };

      const transformed = validator.transformToV1_1(v1Data);
      
      expect(transformed.sensor_readings.target_tracking).toBeDefined();
      expect(Array.isArray(transformed.sensor_readings.target_tracking)).toBe(true);
      expect(transformed.sensor_readings.target_tracking).toHaveLength(0); // Empty array for v1.0 data
    });

    it('should transform v1.1 data to v2.0 format', () => {
      const v1_1Data = {
        device_id: 'SKY-TEST-0001',
        firmware_version: 'v1.1.5',
        timestamp: '2026-03-03T10:00:00.000Z',
        sensor_readings: {
          mmwave_frequency_ghz: 60.5,
          signal_strength_db: -45.2,
          doppler_velocity_mps: 12.3,
          range_resolution_mm: 5.2,
          angle_resolution_deg: 2.5,
          target_count: 2,
          noise_floor_db: -95.7,
          interference_level: 0.1,
          target_tracking: [
            {
              target_id: 1,
              range_m: 45.2,
              velocity_mps: 15.3,
              angle_deg: 12.5,
              confidence: 0.92,
              signal_to_noise: 24.7
            }
          ]
        }
      };

      const transformed = validator.transformToV2_0(v1_1Data);
      
      expect(transformed.sensor_data).toBeDefined();
      expect(transformed.sensor_data.frequency_ghz).toBe(60.5);
      expect(transformed.sensor_data.tracked_targets).toBeDefined();
      expect(transformed.sensor_data.tracked_targets[0].id).toBe('TGT-000001');
      expect(transformed.sensor_data.tracked_targets[0].distance_m).toBe(45.2);
      expect(transformed.sensor_data.tracked_targets[0].speed_mps).toBe(15.3);
      expect(transformed.sensor_data.tracked_targets[0].azimuth_deg).toBe(12.5);
      expect(transformed.sensor_data.tracked_targets[0].track_confidence).toBe(0.92);
      expect(transformed.sensor_data.tracked_targets[0].signal_quality).toBe(92.0); // Converted from 24.7 SNR
    });
  });

  describe('Performance Testing', () => {
    const fixturesDir = path.join(__dirname, 'fixtures', 'skyline-mmwave-golden');

    it('should validate 50 device burst scenario efficiently', () => {
      const fixturePath = path.join(fixturesDir, '14-load-50-devices-burst.json');
      const scenario = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      
      // Simulate validation of multiple readings
      const startTime = performance.now();
      
      // Validate sample readings (in real test, would validate all 50)
      if (scenario.devices && scenario.devices.length > 0) {
        scenario.devices.forEach((device: any) => {
          const result = validator.validate(device);
          expect(result.valid).toBe(true);
        });
      }
      
      const endTime = performance.now();
      const validationTime = endTime - startTime;
      
      // Should validate each reading in under 10ms
      expect(validationTime).toBeLessThan(100); // 100ms for up to 10 devices in sample
    });

    it('should handle mixed schema versions', () => {
      const fixturePath = path.join(fixturesDir, '17-load-mixed-schema-versions.json');
      const scenario = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      
      // Test each schema version
      const v1Result = validator.validate(scenario.sample_readings_by_schema.v1_0_example);
      expect(v1Result.schemaVersion).toBe('v1.0');
      expect(v1Result.valid).toBe(true);
      
      const v1_1Result = validator.validate(scenario.sample_readings_by_schema.v1_1_example);
      expect(v1_1Result.schemaVersion).toBe('v1.1');
      expect(v1_1Result.valid).toBe(true);
      
      const v2Result = validator.validate(scenario.sample_readings_by_schema.v2_0_example);
      expect(v2Result.schemaVersion).toBe('v2.0');
      expect(v2Result.valid).toBe(true);
    });
  });

  describe('MQTT Integration', () => {
    it('should validate MQTT payload structure', () => {
      const fixturePath = path.join(__dirname, 'fixtures', 'skyline-mmwave-golden', '18-mqtt-topic-structure.json');
      const mqttStructure = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      
      // Test sample payloads
      Object.values(mqttStructure.payload_examples).forEach((example: any) => {
        const payload = example.payload;
        const result = validator.validate(payload);
        
        expect(result.valid).toBe(true);
        expect(result.schemaVersion).toBeDefined();
      });
    });

    it('should generate valid MQTT topics', () => {
      const deviceId = 'SKY-ABCD1234-EF56';
      const region = 'us-east-1';
      const deploymentId = 'factory-001';
      
      const topic = validator.generateMQTTTopic({
        region,
        deploymentId,
        deviceId,
        dataType: 'sensor/reading',
        qos: 'qos1'
      });
      
      expect(topic).toBe(`skyline/${region}/${deploymentId}/${deviceId}/sensor/reading/qos1`);
    });
  });
});