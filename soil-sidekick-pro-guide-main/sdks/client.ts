import {
  ClientConfig,
  RequestOptions,
  APIResponse,
  APIError,
  MQTTConfig,
} from './types';

import {
  SensorDevicesAPI,
  SensorReadingsAPI,
  SensorAlertsAPI,
  MQTTClient,
} from './sensors';

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
export class LeafEnginesClient {
  private config: ClientConfig;
  private baseUrl: string;

  /**
   * Sensor APIs (NEW in v2.0)
   */
  public sensors: {
    devices: SensorDevicesAPI;
    readings: SensorReadingsAPI;
    alerts: SensorAlertsAPI;
  };

  /**
   * MQTT Client (optional, for direct broker access)
   */
  public mqtt: MQTTClient | null = null;

  constructor(config: ClientConfig) {
    this.config = {
      environment: 'production',
      timeout: 30000,
      ...config,
    };

    this.baseUrl = config.baseUrl || `https://${config.projectRef}.supabase.co/functions/v1`;

    // Initialize sensor APIs
    this.sensors = {
      devices: new SensorDevicesAPI(this),
      readings: new SensorReadingsAPI(this),
      alerts: new SensorAlertsAPI(this),
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
  async connectMQTT(config: MQTTConfig): Promise<void> {
    this.mqtt = new MQTTClient(config);
    await this.mqtt.connect();
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnectMQTT(): void {
    if (this.mqtt) {
      this.mqtt.disconnect();
      this.mqtt = null;
    }
  }

  /**
   * Internal request method
   * Not intended for direct use - used by API classes
   */
  async request<T>(options: RequestOptions): Promise<T> {
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
    const headers: Record<string, string> = {
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
    return data as T;
  }

  /**
   * Get WebSocket URL for real-time subscriptions
   */
  getWebSocketUrl(): string {
    return `wss://${this.config.projectRef}.supabase.co/realtime/v1`;
  }

  private async parseError(response: Response): Promise<APIError> {
    try {
      const data = await response.json();
      return {
        code: data.code || `HTTP_${response.status}`,
        message: data.message || response.statusText,
        details: data.details,
      };
    } catch {
      return {
        code: `HTTP_${response.status}`,
        message: response.statusText,
      };
    }
  }
}

/**
 * Custom error class for LeafEngines API errors
 */
export class LeafEnginesError extends Error {
  code: string;
  details?: Record<string, any>;

  constructor(error: APIError) {
    super(error.message);
    this.name = 'LeafEnginesError';
    this.code = error.code;
    this.details = error.details;
  }
}

// Re-export types for convenience
export * from './types';
export * from './sensors';
