import { LeafEnginesClient } from '../client';
import {
  SensorDevice,
  RegisterDeviceParams,
  UpdateDeviceParams,
  APIResponse,
} from '../types';

/**
 * Sensor Devices API
 * 
 * Manage Skyline sensor hardware registration and status
 */
export class SensorDevicesAPI {
  private client: LeafEnginesClient;

  constructor(client: LeafEnginesClient) {
    this.client = client;
  }

  /**
   * Register a new sensor device
   * 
   * @param params - Device registration parameters
   * @returns Registered device
   * 
   * @example
   * ```typescript
   * const device = await client.sensors.devices.register({
   *   deviceId: 'skyline-mmWave-001',
   *   deviceType: 'mmwave_radar',
   *   farmId: 'farm-123',
   *   firmwareVersion: '1.2.0',
   * });
   * ```
   */
  async register(params: RegisterDeviceParams): Promise<SensorDevice> {
    const response = await this.client.request<APIResponse<any>>({
      method: 'POST',
      endpoint: '/sensor-devices',
      body: {
        device_id: params.deviceId,
        device_type: params.deviceType,
        farm_id: params.farmId,
        firmware_version: params.firmwareVersion,
      },
    });

    return this.parseDevice(response.data);
  }

  /**
   * Get device by ID
   * 
   * @param deviceId - Unique device identifier
   * @returns Device details
   */
  async get(deviceId: string): Promise<SensorDevice> {
    const response = await this.client.request<APIResponse<any>>({
      method: 'GET',
      endpoint: `/sensor-devices/${deviceId}`,
    });

    return this.parseDevice(response.data);
  }

  /**
   * List all devices with optional filtering
   * 
   * @param params - Filter parameters
   * @returns Array of devices
   */
  async list(params?: {
    farmId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SensorDevice[]> {
    const response = await this.client.request<APIResponse<any[]>>({
      method: 'GET',
      endpoint: '/sensor-devices',
      params: {
        farm_id: params?.farmId,
        status: params?.status,
        limit: params?.limit || 100,
        offset: params?.offset || 0,
      },
    });

    return response.data.map(this.parseDevice);
  }

  /**
   * Update device information
   * 
   * @param deviceId - Device to update
   * @param updates - Fields to update
   * @returns Updated device
   */
  async update(
    deviceId: string,
    updates: UpdateDeviceParams
  ): Promise<SensorDevice> {
    const response = await this.client.request<APIResponse<any>>({
      method: 'PATCH',
      endpoint: `/sensor-devices/${deviceId}`,
      body: {
        farm_id: updates.farmId,
        firmware_version: updates.firmwareVersion,
        status: updates.status,
      },
    });

    return this.parseDevice(response.data);
  }

  /**
   * Delete a device
   * 
   * @param deviceId - Device to delete
   */
  async delete(deviceId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      endpoint: `/sensor-devices/${deviceId}`,
    });
  }

  /**
   * Parse API response into SensorDevice
   */
  private parseDevice(data: any): SensorDevice {
    return {
      id: data.id,
      deviceId: data.device_id,
      deviceType: data.device_type,
      farmId: data.farm_id,
      firmwareVersion: data.firmware_version,
      status: data.status,
      batteryLevel: data.battery_level,
      signalStrength: data.signal_strength,
      lastSeenAt: new Date(data.last_seen_at),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
