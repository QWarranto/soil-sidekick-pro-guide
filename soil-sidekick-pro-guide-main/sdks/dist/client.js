"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafEnginesError = exports.LeafEnginesClient = void 0;
const sensors_1 = require("./sensors");
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
class LeafEnginesClient {
    constructor(config) {
        /**
         * MQTT Client (optional, for direct broker access)
         */
        this.mqtt = null;
        this.config = {
            environment: 'production',
            timeout: 30000,
            ...config,
        };
        this.baseUrl = config.baseUrl || `https://${config.projectRef}.supabase.co/functions/v1`;
        // Initialize sensor APIs
        this.sensors = {
            devices: new sensors_1.SensorDevicesAPI(this),
            readings: new sensors_1.SensorReadingsAPI(this),
            alerts: new sensors_1.SensorAlertsAPI(this),
        };
    }
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
    async connectMQTT(config) {
        this.mqtt = new sensors_1.MQTTClient(config);
        await this.mqtt.connect();
    }
    /**
     * Disconnect from MQTT broker
     */
    disconnectMQTT() {
        if (this.mqtt) {
            this.mqtt.disconnect();
            this.mqtt = null;
        }
    }
    /**
     * Internal request method
     * Not intended for direct use - used by API classes
     */
    async request(options) {
        const url = new URL(options.endpoint, this.baseUrl);
        // Add query params
        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            ...options.headers,
        };
        // Make request
        const response = await fetch(url.toString(), {
            method: options.method,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        // Handle errors
        if (!response.ok) {
            const error = await this.parseError(response);
            throw new LeafEnginesError(error);
        }
        // Parse response
        const data = await response.json();
        return data;
    }
    /**
     * Get WebSocket URL for real-time subscriptions
     */
    getWebSocketUrl() {
        return `wss://${this.config.projectRef}.supabase.co/realtime/v1`;
    }
    async parseError(response) {
        try {
            const data = await response.json();
            return {
                code: data.code || `HTTP_${response.status}`,
                message: data.message || response.statusText,
                details: data.details,
            };
        }
        catch {
            return {
                code: `HTTP_${response.status}`,
                message: response.statusText,
            };
        }
    }
}
exports.LeafEnginesClient = LeafEnginesClient;
/**
 * Custom error class for LeafEngines API errors
 */
class LeafEnginesError extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'LeafEnginesError';
        this.code = error.code;
        this.details = error.details;
    }
}
exports.LeafEnginesError = LeafEnginesError;
// Re-export types for convenience
__exportStar(require("./types"), exports);
__exportStar(require("./sensors"), exports);
