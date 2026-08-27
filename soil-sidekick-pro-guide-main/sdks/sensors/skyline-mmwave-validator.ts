import fs from 'fs';
import path from 'path';

/**
 * Skyline mmWave Sensor Data Validator
 * 
 * Validates Skyline Instruments mmWave sensor data against JSON schemas
 * Supports v1.0, v1.1, and v2.0 schema versions with transformation capabilities
 */
export class SkylineMMWaveValidator {
  private schemas: Map<string, any> = new Map();
  private schemaDir: string;

  constructor(schemaDir?: string) {
    this.schemaDir = schemaDir || path.join(__dirname, '..', '__tests__', 'fixtures', 'skyline-mmwave-golden');
    this.loadSchemas();
  }

  /**
   * Load JSON schemas from disk
   */
  private loadSchemas(): void {
    const schemaFiles = ['schema-v1.0.json', 'schema-v1.1.json', 'schema-v2.0.json'];
    
    schemaFiles.forEach(schemaFile => {
      try {
        const schemaPath = path.join(this.schemaDir, schemaFile);
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const schemaName = path.basename(schemaFile, '.json');
        this.schemas.set(schemaName, schema);
      } catch (error) {
        console.warn(`Failed to load schema ${schemaFile}:`, error);
      }
    });
  }

  /**
   * Detect schema version based on data structure
   */
  detectSchemaVersion(data: any): string | null {
    if (data.sensor_data && data.calibration) {
      return 'schema-v2.0';
    } else if (data.sensor_readings && data.calibration_status) {
      if (data.sensor_readings.target_tracking !== undefined) {
        return 'schema-v1.1';
      } else {
        return 'schema-v1.0';
      }
    }
    return null;
  }

  /**
   * Validate sensor data against appropriate schema
   */
  validate(data: any): ValidationResult {
    const schemaVersion = this.detectSchemaVersion(data);
    
    if (!schemaVersion) {
      return {
        valid: false,
        errors: ['Cannot detect schema version'],
        schemaVersion: null,
        warnings: []
      };
    }

    // For this implementation, we'll do basic validation
    // In production, you would use a proper JSON schema validator like Ajv
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation based on schema version
    switch (schemaVersion) {
      case 'schema-v1.0':
        errors.push(...this.validateV1_0(data));
        break;
      case 'schema-v1.1':
        errors.push(...this.validateV1_1(data));
        break;
      case 'schema-v2.0':
        errors.push(...this.validateV2_0(data));
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      schemaVersion,
      warnings
    };
  }

  /**
   * Basic validation for v1.0 schema
   */
  private validateV1_0(data: any): string[] {
    const errors: string[] = [];

    // Required fields
    const requiredFields = ['device_id', 'firmware_version', 'timestamp', 'sensor_readings', 'calibration_status'];
    requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (data.sensor_readings) {
      const sensorRequired = ['mmwave_frequency_ghz', 'signal_strength_db', 'doppler_velocity_mps', 'range_resolution_mm', 'angle_resolution_deg'];
      sensorRequired.forEach(field => {
        if (data.sensor_readings[field] === undefined) {
          errors.push(`Missing required sensor field: ${field}`);
        }
      });

      // Type checking
      if (typeof data.sensor_readings.mmwave_frequency_ghz !== 'number') {
        errors.push('mmwave_frequency_ghz must be a number');
      }
      if (typeof data.sensor_readings.signal_strength_db !== 'number') {
        errors.push('signal_strength_db must be a number');
      }
    }

    if (data.calibration_status) {
      const calRequired = ['last_calibration', 'calibration_drift', 'requires_recalibration'];
      calRequired.forEach(field => {
        if (data.calibration_status[field] === undefined) {
          errors.push(`Missing required calibration field: ${field}`);
        }
      });
    }

    return errors;
  }

  /**
   * Basic validation for v1.1 schema
   */
  private validateV1_1(data: any): string[] {
    const errors = this.validateV1_0(data);
    
    if (data.sensor_readings && data.sensor_readings.target_tracking === undefined) {
      errors.push('Missing required field: sensor_readings.target_tracking (required in v1.1)');
    }

    if (data.sensor_readings?.target_tracking && !Array.isArray(data.sensor_readings.target_tracking)) {
      errors.push('target_tracking must be an array');
    }

    return errors;
  }

  /**
   * Basic validation for v2.0 schema
   */
  private validateV2_0(data: any): string[] {
    const errors: string[] = [];

    // Required fields for v2.0
    const requiredFields = ['device_id', 'firmware_version', 'timestamp', 'sensor_data', 'calibration'];
    requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (data.sensor_data) {
      const sensorRequired = ['frequency_ghz', 'signal_power_db', 'velocity_mps', 'range_mm', 'angle_deg', 'tracked_targets'];
      sensorRequired.forEach(field => {
        if (data.sensor_data[field] === undefined) {
          errors.push(`Missing required sensor field: ${field}`);
        }
      });

      if (!Array.isArray(data.sensor_data.tracked_targets)) {
        errors.push('tracked_targets must be an array');
      }
    }

    if (data.calibration) {
      const calRequired = ['last_calibrated', 'drift_percentage', 'needs_calibration'];
      calRequired.forEach(field => {
        if (data.calibration[field] === undefined) {
          errors.push(`Missing required calibration field: ${field}`);
        }
      });
    }

    return errors;
  }

  /**
   * Transform v1.0 data to v1.1 format
   */
  transformToV1_1(v1Data: any): any {
    const transformed = JSON.parse(JSON.stringify(v1Data));
    
    // Add target_tracking array (empty for v1.0 data)
    if (transformed.sensor_readings) {
      transformed.sensor_readings.target_tracking = [];
    }
    
    return transformed;
  }

  /**
   * Transform v1.1 data to v2.0 format
   */
  transformToV2_0(v1_1Data: any): any {
    const transformed = JSON.parse(JSON.stringify(v1_1Data));
    
    // Rename fields
    transformed.sensor_data = {
      frequency_ghz: transformed.sensor_readings.mmwave_frequency_ghz,
      signal_power_db: transformed.sensor_readings.signal_strength_db,
      velocity_mps: transformed.sensor_readings.doppler_velocity_mps,
      range_mm: transformed.sensor_readings.range_resolution_mm,
      angle_deg: transformed.sensor_readings.angle_resolution_deg,
      detected_targets: transformed.sensor_readings.target_count || 0,
      noise_level_db: transformed.sensor_readings.noise_floor_db,
      interference_score: transformed.sensor_readings.interference_level * 10, // Scale 0-1 to 0-10
      tracked_targets: []
    };

    // Transform target tracking
    if (transformed.sensor_readings.target_tracking) {
      transformed.sensor_data.tracked_targets = transformed.sensor_readings.target_tracking.map((target: any, index: number) => ({
        id: `TGT-${String(index + 1).padStart(6, '0')}`,
        distance_m: target.range_m,
        speed_mps: target.velocity_mps,
        azimuth_deg: target.angle_deg,
        elevation_deg: 0, // Default value
        track_confidence: target.confidence,
        signal_quality: target.signal_to_noise ? Math.min(100, target.signal_to_noise * 3.7) : 0 // Convert SNR to percentage
      }));
    }

    // Transform calibration
    transformed.calibration = {
      last_calibrated: transformed.calibration_status.last_calibration,
      drift_percentage: transformed.calibration_status.calibration_drift,
      needs_calibration: transformed.calibration_status.requires_recalibration,
      calibration_quality: this.getCalibrationQuality(transformed.calibration_status.calibration_drift)
    };

    // Transform environment if present
    if (transformed.environmental_conditions) {
      transformed.environment = {
        temp_c: transformed.environmental_conditions.temperature_c,
        humidity_pct: transformed.environmental_conditions.humidity_percent,
        rain_mm: transformed.environmental_conditions.precipitation_mm,
        wind_mps: transformed.environmental_conditions.wind_speed_mps,
        visibility_m: 1000 // Default value
      };
    }

    // Transform location if present
    if (transformed.location) {
      transformed.position = {
        lat: transformed.location.latitude,
        lon: transformed.location.longitude,
        alt_m: transformed.location.altitude_m
      };
    }

    // Transform metadata if present
    if (transformed.metadata) {
      transformed.device_metadata = {
        transmission_id: transformed.metadata.transmission_id,
        seq_num: transformed.metadata.sequence_number,
        battery_pct: transformed.metadata.battery_level,
        signal_strength: transformed.metadata.network_rssi,
        uptime_seconds: 0 // Default value
      };
    }

    // Remove old fields
    delete transformed.sensor_readings;
    delete transformed.calibration_status;
    delete transformed.environmental_conditions;
    delete transformed.location;
    delete transformed.metadata;

    return transformed;
  }

  /**
   * Generate MQTT topic for Skyline device
   */
  generateMQTTTopic(options: {
    region: string;
    deploymentId: string;
    deviceId: string;
    dataType: 'sensor/reading' | 'status/health' | 'config/update' | 'alert/event';
    qos: 'qos0' | 'qos1' | 'qos2';
  }): string {
    return `skyline/${options.region}/${options.deploymentId}/${options.deviceId}/${options.dataType}/${options.qos}`;
  }

  /**
   * Generate MQTT payload for sensor reading
   */
  generateMQTTPayload(deviceId: string, firmwareVersion: string, sensorData: any): any {
    const timestamp = new Date().toISOString();
    const schemaVersion = this.detectSchemaVersion(sensorData) || 'schema-v1.0';
    
    let payload: any;
    
    switch (schemaVersion) {
      case 'schema-v2.0':
        payload = {
          device_id: deviceId,
          firmware_version: firmwareVersion,
          timestamp,
          ...sensorData
        };
        break;
      case 'schema-v1.1':
        payload = {
          device_id: deviceId,
          firmware_version: firmwareVersion,
          timestamp,
          ...sensorData
        };
        break;
      default: // v1.0
        payload = {
          device_id: deviceId,
          firmware_version: firmwareVersion,
          timestamp,
          ...sensorData
        };
    }
    
    return {
      topic: this.generateMQTTTopic({
        region: 'us-east-1',
        deploymentId: 'default',
        deviceId,
        dataType: 'sensor/reading',
        qos: 'qos1'
      }),
      payload: JSON.stringify(payload),
      qos: 1,
      retain: false,
      timestamp: Date.now()
    };
  }

  /**
   * Get calibration quality based on drift percentage
   */
  private getCalibrationQuality(drift: number): string {
    if (drift < 2) return 'excellent';
    if (drift < 5) return 'good';
    if (drift < 10) return 'fair';
    return 'poor';
  }

  /**
   * Validate MQTT topic structure
   */
  validateMQTTTopic(topic: string): boolean {
    const pattern = /^skyline\/[a-z0-9-]+\/[a-z0-9-]+\/SKY-[A-Z0-9]{8}-[A-Z0-9]{4}\/(sensor\/reading|status\/health|config\/update|alert\/event)\/(qos0|qos1|qos2)$/;
    return pattern.test(topic);
  }

  /**
   * Load test data from fixtures
   */
  loadTestData(scenario: 'burst' | 'sustained' | 'spike' | 'mixed'): any {
    const fixtureFile = {
      burst: '14-load-50-devices-burst.json',
      sustained: '15-load-50-devices-sustained.json',
      spike: '16-load-spike-to-1000-devices.json',
      mixed: '17-load-mixed-schema-versions.json'
    }[scenario];

    const fixturePath = path.join(this.schemaDir, fixtureFile);
    return JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  }
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  schemaVersion: string | null;
  warnings: string[];
}

/**
 * MQTT message interface
 */
export interface MQTTMessage {
  topic: string;
  payload: string;
  qos: number;
  retain: boolean;
  timestamp: number;
}