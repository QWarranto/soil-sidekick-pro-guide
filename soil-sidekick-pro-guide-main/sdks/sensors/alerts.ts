import { LeafEnginesClient } from '../client';
import {
  SensorAlert,
  AlertsQueryParams,
  AlertSubscription,
  APIResponse,
  Subscription,
} from '../types';

/**
 * Sensor Alerts API
 * 
 * Manage real-time hazard detection and alerts
 */
export class SensorAlertsAPI {
  private client: LeafEnginesClient;
  private subscription: Subscription | null = null;

  constructor(client: LeafEnginesClient) {
    this.client = client;
  }

  /**
   * Get alerts with optional filtering
   * 
   * @param params - Filter parameters
   * @returns Array of alerts
   */
  async getAlerts(params?: AlertsQueryParams): Promise<SensorAlert[]> {
    const response = await this.client.request<APIResponse<any[]>>({
      method: 'GET',
      endpoint: '/sensor-alerts',
      params: {
        device_id: params?.deviceId,
        alert_type: params?.alertType,
        severity: params?.severity,
        acknowledged: params?.acknowledged,
        start_time: params?.startTime?.toISOString(),
        end_time: params?.endTime?.toISOString(),
        limit: params?.limit || 100,
      },
    });

    return response.data.map(this.parseAlert);
  }

  /**
   * Get unacknowledged critical alerts
   * 
   * @returns Array of critical alerts
   */
  async getCriticalAlerts(): Promise<SensorAlert[]> {
    const response = await this.client.request<APIResponse<any[]>>({
      method: 'GET',
      endpoint: '/sensor-alerts/critical',
    });

    return response.data.map(this.parseAlert);
  }

  /**
   * Acknowledge an alert
   * 
   * @param alertId - Alert to acknowledge
   * @returns Updated alert
   */
  async acknowledge(alertId: string): Promise<SensorAlert> {
    const response = await this.client.request<APIResponse<any>>({
      method: 'POST',
      endpoint: `/sensor-alerts/${alertId}/acknowledge`,
    });

    return this.parseAlert(response.data);
  }

  /**
   * Subscribe to real-time alerts
   * 
   * @param callback - Handler for new alerts
   * @param filter - Optional filter criteria
   * @returns Subscription object
   */
  subscribe(
    callback: (alert: SensorAlert) => void,
    filter?: AlertSubscription
  ): Subscription {
    const wsUrl = this.client.getWebSocketUrl();
    const params = new URLSearchParams();

    if (filter?.severity?.length) {
      filter.severity.forEach(s => params.append('severity', s));
    }
    if (filter?.deviceId) {
      params.append('device_id', filter.deviceId);
    }
    if (filter?.alertType) {
      params.append('alert_type', filter.alertType);
    }

    const ws = new WebSocket(`${wsUrl}/sensor-alerts?${params.toString()}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(this.parseAlert(data));
      } catch (error) {
        console.error('Failed to parse alert:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Alert WebSocket error:', error);
    };

    this.subscription = {
      unsubscribe: () => {
        ws.close();
        this.subscription = null;
      },
      isActive: () => ws.readyState === WebSocket.OPEN,
    };

    return this.subscription;
  }

  /**
   * Unsubscribe from alerts
   */
  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private parseAlert(data: any): SensorAlert {
    return {
      id: data.id,
      deviceId: data.device_id,
      alertType: data.alert_type,
      severity: data.severity,
      message: data.message,
      details: data.details,
      acknowledged: data.acknowledged,
      acknowledgedBy: data.acknowledged_by,
      acknowledgedAt: data.acknowledged_at
        ? new Date(data.acknowledged_at)
        : undefined,
      timestamp: new Date(data.timestamp),
      createdAt: new Date(data.created_at),
    };
  }
}
