import { LeafEnginesClient } from '../client';
import { SensorReading, SensorReadingPayload, IngestionResponse, ReadingsQueryParams, ReadingsAggregation, Subscription } from '../types';
/**
 * Sensor Readings API
 *
 * Query historical data and subscribe to real-time updates
 */
export declare class SensorReadingsAPI {
    private client;
    private subscriptions;
    constructor(client: LeafEnginesClient);
    /**
     * Send sensor readings via HTTP (MQTT fallback)
     *
     * @param payload - Sensor data to ingest
     * @returns Ingestion confirmation
     *
     * @example
     * ```typescript
     * const result = await client.sensors.readings.send({
     *   deviceId: 'skyline-001',
     *   deviceType: 'mmwave_radar',
     *   timestamp: new Date(),
     *   readings: [{
     *     metric: 'reflectivity',
     *     value: 0.92,
     *     unit: 'ratio',
     *     confidence: 0.94,
     *     timestamp: new Date(),
     *   }],
     *   metadata: { firmwareVersion: '1.2.0' },
     * });
     * ```
     */
    send(payload: SensorReadingPayload): Promise<IngestionResponse>;
    /**
     * Query historical readings
     *
     * @param params - Query parameters
     * @returns Array of sensor readings
     */
    query(params: ReadingsQueryParams): Promise<SensorReading[]>;
    /**
     * Get latest reading for a device
     *
     * @param deviceId - Device identifier
     * @param metric - Optional metric filter
     * @returns Latest reading or null
     */
    getLatest(deviceId: string, metric?: string): Promise<SensorReading | null>;
    /**
     * Get aggregated readings (hourly, daily, etc.)
     *
     * @param params - Aggregation parameters
     * @returns Aggregated data points
     */
    aggregate(params: {
        deviceId: string;
        metric: string;
        startTime: Date;
        endTime: Date;
        interval: '1h' | '1d' | '1w' | '1m';
    }): Promise<ReadingsAggregation[]>;
    /**
     * Subscribe to real-time readings (WebSocket)
     *
     * @param deviceId - Device to subscribe to
     * @param callback - Handler for new readings
     * @returns Subscription object
     */
    subscribe(deviceId: string, callback: (reading: SensorReading) => void): Subscription;
    /**
     * Unsubscribe from device updates
     */
    unsubscribe(deviceId: string): void;
    /**
     * Unsubscribe from all devices
     */
    unsubscribeAll(): void;
    private parseReading;
}
