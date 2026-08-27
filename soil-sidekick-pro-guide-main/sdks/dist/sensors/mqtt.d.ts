import { MQTTConfig, MQTTPublishOptions, ConnectionStatus } from '../types';
/**
 * MQTT Client for direct broker connection
 *
 * Used for high-frequency sensor data publishing
 */
export declare class MQTTClient {
    private client;
    private config;
    private status;
    private messageHandlers;
    private statusListeners;
    constructor(config: MQTTConfig);
    /**
     * Connect to MQTT broker
     */
    connect(): Promise<void>;
    /**
     * Publish sensor data to topic
     *
     * @param topic - MQTT topic (e.g., "skyline/device-001/readings")
     * @param payload - Data to publish
     * @param options - Publish options
     */
    publish(topic: string, payload: any, options?: MQTTPublishOptions): void;
    /**
     * Subscribe to MQTT topic
     *
     * @param topic - Topic pattern (can use wildcards)
     * @param handler - Message handler
     * @param qos - Quality of Service
     */
    subscribe(topic: string, handler: (message: any) => void, qos?: 0 | 1 | 2): void;
    /**
     * Unsubscribe from topic
     */
    unsubscribe(topic: string): void;
    /**
     * Disconnect from broker
     */
    disconnect(): void;
    /**
     * Get current connection status
     */
    getStatus(): ConnectionStatus;
    /**
     * Listen for connection status changes
     */
    onStatusChange(listener: (status: ConnectionStatus) => void): void;
    private updateStatus;
    private handleMessage;
    private processMessage;
    private topicMatches;
    private parseMessage;
}
