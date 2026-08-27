/**
 * LeafEngines SDK v2.0
 * 
 * SoilSidekick Pro / LeafEngines API Client
 * 
 * @module @leafengines/sdk
 * @version 2.0.0
 */

// Main client
export { LeafEnginesClient, LeafEnginesError } from './client';

// Sensor APIs
export {
  SensorDevicesAPI,
  SensorReadingsAPI,
  SensorAlertsAPI,
  MQTTClient,
  SkylineMMWaveValidator,
  ValidationResult,
  MQTTMessage,
} from './sensors';

// All types
export * from './types';

// Version
export const VERSION = '2.0.0';
