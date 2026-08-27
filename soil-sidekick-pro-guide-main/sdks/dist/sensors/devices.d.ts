import { LeafEnginesClient } from '../client';
import { SensorDevice, RegisterDeviceParams, UpdateDeviceParams } from '../types';
/**
 * Sensor Devices API
 *
 * Manage Skyline sensor hardware registration and status
 */
export declare class SensorDevicesAPI {
    private client;
    constructor(client: LeafEnginesClient);
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
    register(params: RegisterDeviceParams): Promise<SensorDevice>;
    /**
     * Get device by ID
     *
     * @param deviceId - Unique device identifier
     * @returns Device details
     */
    get(deviceId: string): Promise<SensorDevice>;
    /**
     * List all devices with optional filtering
     *
     * @param params - Filter parameters
     * @returns Array of devices
     */
    list(params?: {
        farmId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<SensorDevice[]>;
    /**
     * Update device information
     *
     * @param deviceId - Device to update
     * @param updates - Fields to update
     * @returns Updated device
     */
    update(deviceId: string, updates: UpdateDeviceParams): Promise<SensorDevice>;
    /**
     * Delete a device
     *
     * @param deviceId - Device to delete
     */
    delete(deviceId: string): Promise<void>;
    /**
     * Parse API response into SensorDevice
     */
    private parseDevice;
}
