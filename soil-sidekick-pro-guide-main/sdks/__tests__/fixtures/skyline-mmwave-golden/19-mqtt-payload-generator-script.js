// MQTT Payload Generator for Skyline mmWave Sensor Data
// Generates realistic payloads for testing MQTT ingestion

const fs = require('fs');
const path = require('path');

class SkylineMQTTGenerator {
  constructor(options = {}) {
    this.options = {
      region: 'us-east-1',
      deploymentId: 'test-deployment',
      deviceCount: 50,
      schemaVersions: ['v1.0', 'v1.1', 'v2.0'],
      transmissionRate: 10, // readings per second per device
      duration: 60, // seconds
      ...options
    };
    
    this.devices = this.generateDevices();
    this.messageCount = 0;
  }
  
  generateDevices() {
    const devices = [];
    const schemaDistribution = {
      'v1.0': Math.floor(this.options.deviceCount * 0.3),
      'v1.1': Math.floor(this.options.deviceCount * 0.4),
      'v2.0': this.options.deviceCount - Math.floor(this.options.deviceCount * 0.3) - Math.floor(this.options.deviceCount * 0.4)
    };
    
    let deviceIndex = 1;
    
    for (const [schemaVersion, count] of Object.entries(schemaDistribution)) {
      for (let i = 0; i < count; i++) {
        const deviceId = `SKY-TEST${String(deviceIndex).padStart(4, '0')}-${this.generateRandomHex(4)}`;
        const firmwareVersion = this.getFirmwareVersion(schemaVersion);
        
        devices.push({
          deviceId,
          schemaVersion,
          firmwareVersion,
          location: this.generateLocation(),
          calibrationStatus: this.generateCalibrationStatus(),
          transmissionInterval: 1000 / this.options.transmissionRate
        });
        
        deviceIndex++;
      }
    }
    
    return devices;
  }
  
  generateSensorReading(device, timestamp) {
    const baseReading = {
      device_id: device.deviceId,
      firmware_version: device.firmwareVersion,
      timestamp: timestamp.toISOString()
    };
    
    switch (device.schemaVersion) {
      case 'v1.0':
        return {
          ...baseReading,
          sensor_readings: {
            mmwave_frequency_ghz: this.randomBetween(24, 81),
            signal_strength_db: this.randomBetween(-120, -30),
            doppler_velocity_mps: this.randomBetween(-50, 50),
            range_resolution_mm: this.randomBetween(1, 100),
            angle_resolution_deg: this.randomBetween(0.1, 10),
            target_count: Math.floor(this.randomBetween(0, 20)),
            noise_floor_db: this.randomBetween(-140, -80),
            interference_level: this.randomBetween(0, 1)
          },
          calibration_status: device.calibrationStatus,
          environmental_conditions: this.generateEnvironmentalConditions(),
          location: device.location,
          metadata: this.generateMetadata()
        };
        
      case 'v1.1':
        const targetCount = Math.floor(this.randomBetween(0, 20));
        return {
          ...baseReading,
          sensor_readings: {
            mmwave_frequency_ghz: this.randomBetween(24, 81),
            signal_strength_db: this.randomBetween(-120, -30),
            doppler_velocity_mps: this.randomBetween(-50, 50),
            range_resolution_mm: this.randomBetween(1, 100),
            angle_resolution_deg: this.randomBetween(0.1, 10),
            target_count: targetCount,
            noise_floor_db: this.randomBetween(-140, -80),
            interference_level: this.randomBetween(0, 1),
            target_tracking: this.generateTargetTracking(targetCount)
          },
          calibration_status: device.calibrationStatus,
          environmental_conditions: this.generateEnvironmentalConditions(),
          location: device.location,
          metadata: this.generateMetadata()
        };
        
      case 'v2.0':
        const detectedTargets = Math.floor(this.randomBetween(0, 20));
        return {
          ...baseReading,
          sensor_data: {
            frequency_ghz: this.randomBetween(24, 81),
            signal_power_db: this.randomBetween(-120, -30),
            velocity_mps: this.randomBetween(-50, 50),
            range_mm: this.randomBetween(1, 100),
            angle_deg: this.randomBetween(0.1, 10),
            detected_targets: detectedTargets,
            noise_level_db: this.randomBetween(-140, -80),
            interference_score: this.randomBetween(0, 10),
            tracked_targets: this.generateTrackedTargets(detectedTargets)
          },
          calibration: this.transformCalibrationToV2(device.calibrationStatus),
          environment: this.transformEnvironmentToV2(this.generateEnvironmentalConditions()),
          position: this.transformLocationToV2(device.location),
          device_metadata: this.transformMetadataToV2(this.generateMetadata())
        };
        
      default:
        throw new Error(`Unknown schema version: ${device.schemaVersion}`);
    }
  }
  
  generateTargetTracking(count) {
    const targets = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      targets.push({
        target_id: i + 1,
        range_m: this.randomBetween(0, 200),
        velocity_mps: this.randomBetween(-50, 50),
        angle_deg: this.randomBetween(-180, 180),
        confidence: this.randomBetween(0.5, 1),
        signal_to_noise: this.randomBetween(10, 40)
      });
    }
    return targets;
  }
  
  generateTrackedTargets(count) {
    const targets = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      targets.push({
        id: `TGT-${String(i + 1).padStart(6, '0')}`,
        distance_m: this.randomBetween(0, 500),
        speed_mps: this.randomBetween(-100, 100),
        azimuth_deg: this.randomBetween(-180, 180),
        elevation_deg: this.randomBetween(-90, 90),
        track_confidence: this.randomBetween(0.5, 1),
        signal_quality: this.randomBetween(50, 100)
      });
    }
    return targets;
  }
  
  generateCalibrationStatus() {
    const lastCalibration = new Date(Date.now() - this.randomBetween(0, 30 * 24 * 60 * 60 * 1000));
    return {
      last_calibration: lastCalibration.toISOString(),
      calibration_drift: this.randomBetween(0, 10),
      requires_recalibration: this.randomBetween(0, 1) > 0.8
    };
  }
  
  generateEnvironmentalConditions() {
    return {
      temperature_c: this.randomBetween(-40, 85),
      humidity_percent: this.randomBetween(0, 100),
      precipitation_mm: this.randomBetween(0, 50),
      wind_speed_mps: this.randomBetween(0, 30)
    };
  }
  
  generateLocation() {
    return {
      latitude: this.randomBetween(-90, 90),
      longitude: this.randomBetween(-180, 180),
      altitude_m: this.randomBetween(0, 5000)
    };
  }
  
  generateMetadata() {
    return {
      transmission_id: `TX-${Date.now()}-${this.messageCount++}`,
      sequence_number: Math.floor(this.randomBetween(0, 1000000)),
      battery_level: this.randomBetween(0, 100),
      network_rssi: this.randomBetween(-120, -30)
    };
  }
  
  transformCalibrationToV2(v1Calibration) {
    return {
      last_calibrated: v1Calibration.last_calibration,
      drift_percentage: v1Calibration.calibration_drift,
      needs_calibration: v1Calibration.requires_recalibration,
      calibration_quality: this.getCalibrationQuality(v1Calibration.calibration_drift)
    };
  }
  
  transformEnvironmentToV2(v1Environment) {
    return {
      temp_c: v1Environment.temperature_c,
      humidity_pct: v1Environment.humidity_percent,
      rain_mm: v1Environment.precipitation_mm,
      wind_mps: v1Environment.wind_speed_mps,
      visibility_m: this.randomBetween(100, 10000)
    };
  }
  
  transformLocationToV2(v1Location) {
    return {
      lat: v1Location.latitude,
      lon: v1Location.longitude,
      alt_m: v1Location.altitude_m
    };
  }
  
  transformMetadataToV2(v1Metadata) {
    return {
      transmission_id: v1Metadata.transmission_id,
      seq_num: v1Metadata.sequence_number,
      battery_pct: v1Metadata.battery_level,
      signal_strength: v1Metadata.network_rssi,
      uptime_seconds: Math.floor(this.randomBetween(0, 30 * 24 * 60 * 60))
    };
  }
  
  getCalibrationQuality(drift) {
    if (drift < 2) return 'excellent';
    if (drift < 5) return 'good';
    if (drift < 10) return 'fair';
    return 'poor';
  }
  
  getFirmwareVersion(schemaVersion) {
    const versions = {
      'v1.0': ['v1.0.5', 'v1.0.8', 'v1.0.9'],
      'v1.1': ['v1.1.2', 'v1.1.5', 'v1.1.7'],
      'v2.0': ['v2.0.1', 'v2.0.3']
    };
    return versions[schemaVersion][Math.floor(Math.random() * versions[schemaVersion].length)];
  }
  
  generateMQTTMessage(device, payload) {
    const topic = `skyline/${this.options.region}/${this.options.deploymentId}/${device.deviceId}/sensor/reading/qos1`;
    
    return {
      topic,
      payload: JSON.stringify(payload, null, 2),
      qos: 1,
      retain: false,
      timestamp: Date.now(),
      deviceId: device.deviceId,
      schemaVersion: device.schemaVersion
    };
  }
  
  generateTestData(durationSeconds = 60) {
    const startTime = Date.now();
    const endTime = startTime + (durationSeconds * 1000);
    const messages = [];
    const interval = 1000 / this.options.transmissionRate;
    
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      for (const device of this.devices) {
        const timestamp = new Date(currentTime);
        const reading = this.generateSensorReading(device, timestamp);
        const message = this.generateMQTTMessage(device, reading);
        messages.push(message);
      }
      
      currentTime += interval;
    }
    
    return messages;
  }
  
  saveToFile(messages, filename = 'mqtt-test-data.json') {
    const output = {
      metadata: {
        generated_at: new Date().toISOString(),
        device_count: this.options.deviceCount,
        schema_distribution: this.getSchemaDistribution(),
        transmission_rate: this.options.transmissionRate,
        total_messages: messages.length,
        duration_seconds: this.options.duration
      },
      messages
    };
    
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`Generated ${messages.length} MQTT messages to ${filename}`);
    
    return output;
  }
  
  getSchemaDistribution() {
    const distribution = {};
    for (const device of this.devices) {
      distribution[device.schemaVersion] = (distribution[device.schemaVersion] || 0) + 1;
    }
    return distribution;
  }
  
  // Utility methods
  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  
  generateRandomHex(length) {
    return Array.from({length}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
  }
}

// Example usage
if (require.main === module) {
  const generator = new SkylineMQTTGenerator({
    deviceCount: 10, // Smaller for example
    transmissionRate: 2,
    duration: 5 // 5 seconds of data
  });
  
  const testData = generator.generateTestData();
  generator.saveToFile(testData, 'mqtt-test-output.json');
  
  console.log('Schema distribution:', generator.getSchemaDistribution());
  console.log('Sample message:', JSON.stringify(testData[0], null, 2));
}

module.exports = SkylineMQTTGenerator;