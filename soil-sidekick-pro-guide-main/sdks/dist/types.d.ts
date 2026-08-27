/**
 * LeafEngines SDK v2.0 - Sensor Types
 *
 * Core type definitions for Skyline Instruments sensor integration
 */
export type DeviceType = 'mmwave_radar' | 'quantum_rf' | 'precision_timing';
export type DeviceStatus = 'active' | 'inactive' | 'error' | 'maintenance';
export interface SensorDevice {
    id: string;
    deviceId: string;
    deviceType: DeviceType;
    farmId?: string;
    firmwareVersion: string;
    status: DeviceStatus;
    batteryLevel?: number;
    signalStrength?: number;
    lastSeenAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface RegisterDeviceParams {
    deviceId: string;
    deviceType: DeviceType;
    farmId?: string;
    firmwareVersion: string;
}
export interface UpdateDeviceParams {
    farmId?: string;
    firmwareVersion?: string;
    status?: DeviceStatus;
}
export interface SensorReading {
    id: string;
    deviceId: string;
    timestamp: Date;
    metric: string;
    value: number;
    unit: string;
    confidence?: number;
    receivedAt: Date;
}
export interface SensorReadingData {
    metric: string;
    value: number;
    unit: string;
    confidence?: number;
    timestamp: Date;
}
export interface SensorReadingPayload {
    deviceId: string;
    deviceType: DeviceType;
    timestamp: Date;
    readings: SensorReadingData[];
    metadata: {
        firmwareVersion: string;
        batteryLevel?: number;
        signalStrength?: number;
    };
}
export interface IngestionResponse {
    ingestionId: string;
    queuedAt: Date;
    processedReadings: number;
    estimatedProcessingMs: number;
    status: 'success' | 'partial' | 'failed';
}
export interface ReadingsQueryParams {
    deviceId?: string;
    metric?: string;
    startTime: Date;
    endTime: Date;
    limit?: number;
    offset?: number;
    order?: 'asc' | 'desc';
}
export interface ReadingsAggregation {
    deviceId: string;
    metric: string;
    startTime: Date;
    endTime: Date;
    count: number;
    avg?: number;
    min?: number;
    max?: number;
    sum?: number;
    interval: string;
}
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertType = 'heat_stress' | 'equipment_malfunction' | 'battery_low' | 'signal_lost' | 'anomaly_detected' | 'threshold_exceeded' | 'environmental_hazard';
export interface SensorAlert {
    id: string;
    deviceId: string;
    alertType: AlertType;
    severity: AlertSeverity;
    message: string;
    details?: Record<string, any>;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    timestamp: Date;
    createdAt: Date;
}
export interface AlertsQueryParams {
    deviceId?: string;
    alertType?: AlertType;
    severity?: AlertSeverity;
    acknowledged?: boolean;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
}
export interface AlertSubscription {
    severity?: AlertSeverity[];
    deviceId?: string;
    alertType?: AlertType;
}
export interface MQTTConfig {
    host: string;
    port: number;
    protocol: 'mqtts' | 'wss';
    username: string;
    password: string;
    reconnectPeriod?: number;
    connectTimeout?: number;
}
export interface MQTTPublishOptions {
    qos?: 0 | 1 | 2;
    retain?: boolean;
}
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export interface APIResponse<T> {
    data: T;
    meta?: {
        total?: number;
        limit?: number;
        offset?: number;
    };
}
export interface APIError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
export interface Subscription {
    unsubscribe(): void;
    isActive(): boolean;
}
export type MessageHandler<T> = (message: T) => void;
export interface ClientConfig {
    apiKey: string;
    projectRef: string;
    baseUrl?: string;
    environment?: 'production' | 'sandbox';
    timeout?: number;
}
export interface RequestOptions {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    endpoint: string;
    body?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}
