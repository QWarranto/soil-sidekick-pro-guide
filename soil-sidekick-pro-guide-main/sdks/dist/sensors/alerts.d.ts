import { LeafEnginesClient } from '../client';
import { SensorAlert, AlertsQueryParams, AlertSubscription, Subscription } from '../types';
/**
 * Sensor Alerts API
 *
 * Manage real-time hazard detection and alerts
 */
export declare class SensorAlertsAPI {
    private client;
    private subscription;
    constructor(client: LeafEnginesClient);
    /**
     * Get alerts with optional filtering
     *
     * @param params - Filter parameters
     * @returns Array of alerts
     */
    getAlerts(params?: AlertsQueryParams): Promise<SensorAlert[]>;
    /**
     * Get unacknowledged critical alerts
     *
     * @returns Array of critical alerts
     */
    getCriticalAlerts(): Promise<SensorAlert[]>;
    /**
     * Acknowledge an alert
     *
     * @param alertId - Alert to acknowledge
     * @returns Updated alert
     */
    acknowledge(alertId: string): Promise<SensorAlert>;
    /**
     * Subscribe to real-time alerts
     *
     * @param callback - Handler for new alerts
     * @param filter - Optional filter criteria
     * @returns Subscription object
     */
    subscribe(callback: (alert: SensorAlert) => void, filter?: AlertSubscription): Subscription;
    /**
     * Unsubscribe from alerts
     */
    unsubscribe(): void;
    private parseAlert;
}
