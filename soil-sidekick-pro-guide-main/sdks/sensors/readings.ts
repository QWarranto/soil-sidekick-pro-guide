import { LeafEnginesClient } from '../client';
import {
  SensorReading,
  SensorReadingPayload,
  SensorReadingData,
  IngestionResponse,
  ReadingsQueryParams,
  ReadingsAggregation,
  APIResponse,
  Subscription,
} from '../types';

/**
 * Sensor Readings API
 * 
 * Query historical data and subscribe to real-time updates
 */
export class SensorReadingsAPI {
  private client: LeafEnginesClient;
  private subscriptions: Map<string, Subscription> = new Map();

  constructor(client: LeafEnginesClient) {
    this.client = client;
  }

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
  async send(payload: SensorReadingPayload): Promise<IngestionResponse> {
    const response = await this.client.request<APIResponse<any>>({
      method: 'POST',
      endpoint: '/sensor-data-ingestion',
      body: {
        device_id: payload.deviceId,
        device_type: payload.deviceType,
        timestamp: payload.timestamp.toISOString(),
        readings: payload.readings.map(r => ({
          metric: r.metric,
          value: r.value,
          unit: r.unit,
          confidence: r.confidence,
          timestamp: r.timestamp.toISOString(),
        })),
        metadata: {
          firmware_version: payload.metadata.firmwareVersion,
          battery_level: payload.metadata.batteryLevel,
          signal_strength: payload.metadata.signalStrength,
        },
      },
    });

    return {
      ingestionId: response.data.ingestion_id,
      queuedAt: new Date(response.data.queued_at),
      processedReadings: response.data.processed_readings,
      estimatedProcessingMs: response.data.estimated_processing_ms,
      status: response.data.status,
    };
  }

  /**
   * Query historical readings
   * 
   * @param params - Query parameters
   * @returns Array of sensor readings
   */
  async query(params: ReadingsQueryParams): Promise<SensorReading[]> {
    const response = await this.client.request<APIResponse<any[]>>({
      method: 'GET',
      endpoint: '/sensor-readings',
      params: {
        device_id: params.deviceId,
        metric: params.metric,
        start_time: params.startTime.toISOString(),
        end_time: params.endTime.toISOString(),
        limit: params.limit || 100,
        offset: params.offset || 0,
        order: params.order || 'desc',
      },
    });

    return response.data.map(this.parseReading);
  }

  /**
   * Get latest reading for a device
   * 
   * @param deviceId - Device identifier
   * @param metric - Optional metric filter
   * @returns Latest reading or null
   */
  async getLatest(
    deviceId: string,
    metric?: string
  ): Promise<SensorReading | null> {
    try {
      const response = await this.client.request<APIResponse<any>>({
        method: 'GET',
        endpoint: '/sensor-readings/latest',
        params: {
          device_id: deviceId,
          metric,
        },
      });

      return response.data ? this.parseReading(response.data) : null;
    } catch (error) {
      // Return null if no readings found
      return null;
    }
  }

  /**
   * Get aggregated readings (hourly, daily, etc.)
   * 
   * @param params - Aggregation parameters
   * @returns Aggregated data points
   */
  async aggregate(params: {
    deviceId: string;
    metric: string;
    startTime: Date;
    endTime: Date;
    interval: '1h' | '1d' | '1w' | '1m';
  }): Promise<ReadingsAggregation[]> {
    const response = await this.client.request<APIResponse<any[]>>({
      method: 'GET',
      endpoint: '/sensor-readings/aggregate',
      params: {
        device_id: params.deviceId,
        metric: params.metric,
        start_time: params.startTime.toISOString(),
        end_time: params.endTime.toISOString(),
        interval: params.interval,
      },
    });

    return response.data.map((agg: any) => ({
      deviceId: agg.device_id,
      metric: agg.metric,
      startTime: new Date(agg.start_time),
      endTime: new Date(agg.end_time),
      count: agg.count,
      avg: agg.avg,
      min: agg.min,
      max: agg.max,
      sum: agg.sum,
      interval: agg.interval,
    }));
  }

  /**
   * Subscribe to real-time readings (WebSocket)
   * 
   * @param deviceId - Device to subscribe to
   * @param callback - Handler for new readings
   * @returns Subscription object
   */
  subscribe(
    deviceId: string,
    callback: (reading: SensorReading) => void
  ): Subscription {
    const wsUrl = this.client.getWebSocketUrl();
    const ws = new WebSocket(`${wsUrl}/sensor-readings/${deviceId}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(this.parseReading(data));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const subscription: Subscription = {
      unsubscribe: () => {
        ws.close();
        this.subscriptions.delete(deviceId);
      },
      isActive: () => ws.readyState === WebSocket.OPEN,
    };

    this.subscriptions.set(deviceId, subscription);
    return subscription;
  }

  /**
   * Unsubscribe from device updates
   */
  unsubscribe(deviceId: string): void {
    const sub = this.subscriptions.get(deviceId);
    if (sub) {
      sub.unsubscribe();
    }
  }

  /**
   * Unsubscribe from all devices
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }

  private parseReading(data: any): SensorReading {
    return {
      id: data.id,
      deviceId: data.device_id,
      timestamp: new Date(data.timestamp),
      metric: data.metric,
      value: data.value,
      unit: data.unit,
      confidence: data.confidence,
      receivedAt: new Date(data.received_at),
    };
  }
}
