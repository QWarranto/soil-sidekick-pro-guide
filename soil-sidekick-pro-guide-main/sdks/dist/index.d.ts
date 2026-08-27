/**
 * LeafEngines SDK v2.0
 *
 * SoilSidekick Pro / LeafEngines API Client
 *
 * @module @leafengines/sdk
 * @version 2.0.0
 */
export { LeafEnginesClient, LeafEnginesError } from './client';
export { SensorDevicesAPI, SensorReadingsAPI, SensorAlertsAPI, MQTTClient, } from './sensors';
export * from './types';
export declare const VERSION = "2.0.0";
