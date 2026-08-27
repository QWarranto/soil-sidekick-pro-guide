import { ClientConfig, RequestOptions, APIError, MQTTConfig } from './types';
import { SensorDevicesAPI, SensorReadingsAPI, SensorAlertsAPI, MQTTClient } from './sensors';
/**
 * LeafEngines SDK Client v2.0
 *
 * Main entry point for all API interactions
 *
 * @example
 * ```typescript
 * import { LeafEnginesClient } from '@leafengines/sdk';
 *
 * const client = new LeafEnginesClient({
 *   apiKey: 'sk_live_xxx',
 *   projectRef: 'wzgnxkoeqzvueypwzvyn',
 * });
 *
 * // Register a sensor device
 * const device = await client.sensors.devices.register({
 *   deviceId: 'skyline-001',
 *   deviceType: 'mmwave_radar',
 *   firmwareVersion: '1.0.0',
 * });
 *
 * // Query readings
 * const readings = await client.sensors.readings.query({
 *   deviceId: 'skyline-001',
 *   startTime: new Date('2026-02-01'),
 *   endTime: new Date(),
 * });
 * ```
 */
export declare class LeafEnginesClient {
    private config;
    private baseUrl;
    /**
     * Sensor APIs (NEW in v2.0)
     */
    sensors: {
        devices: SensorDevicesAPI;
        readings: SensorReadingsAPI;
        alerts: SensorAlertsAPI;
    };
    /**
     * MQTT Client (optional, for direct broker access)
     */
    mqtt: MQTTClient | null;
    constructor(config: ClientConfig);
    /**
     * Connect to MQTT broker for high-frequency data publishing
     *
     * @param config - MQTT connection configuration
     * @example
     * ```typescript
     * await client.connectMQTT({
     *   host: 'xxx.s1.eu.hivemq.cloud',
     *   port: 8883,
     *   protocol: 'mqtts',
     *   username: 'your-username',
     *   password: 'your-password',
     * });
     *
     * // Publish directly to MQTT
     * client.mqtt!.publish('skyline/device-001/readings', {
     *   device_id: 'device-001',
     *   readings: [{ metric: 'reflectivity', value: 0.92 }],
     * });
     * ```
     */
    connectMQTT(config: MQTTConfig): Promise<void>;
    /**
     * Disconnect from MQTT broker
     */
    disconnectMQTT(): void;
    /**
     * Internal request method
     * Not intended for direct use - used by API classes
     */
    request<T>(options: RequestOptions): Promise<T>;
    /**
     * Get WebSocket URL for real-time subscriptions
     */
    getWebSocketUrl(): string;
    private parseError;
}
/**
 * Custom error class for LeafEngines API errors
 */
export declare class LeafEnginesError extends Error {
    code: string;
    details?: Record<string, any>;
    constructor(error: APIError);
}
export * from './types';
export * from './sensors';
