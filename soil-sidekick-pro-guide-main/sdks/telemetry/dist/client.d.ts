/**
 * @leafengines/telemetry - TelemetryClient
 *
 * Core client class that manages event batching, offline queuing,
 * privacy sanitization, and flush lifecycle.
 */
import { TelemetryEvent, TelemetryConfig, TelemetryReporter, IngestResponse, SeverityLevel } from './types';
export declare class TelemetryClient {
    private config;
    private buffer;
    private offlineQueue;
    private reporters;
    private flushTimer;
    private sessionId;
    private isFlushing;
    private isOnline;
    constructor(config: Partial<TelemetryConfig> & {
        endpoint: string;
    });
    /** Track a single event */
    track(type: TelemetryEvent['type'], name: string, properties?: Record<string, unknown>, severity?: SeverityLevel): void;
    /** Convenience: track a tool call */
    trackToolCall(toolName: string, durationMs: number, success: boolean, args?: Record<string, unknown>, errorMessage?: string): void;
    /** Convenience: track an API request */
    trackApiRequest(endpoint: string, method: string, statusCode: number, durationMs: number, extras?: Record<string, unknown>): void;
    /** Convenience: track an error */
    trackError(endpoint: string, errorMessage: string, statusCode?: number, errorCode?: string): void;
    /** Convenience: track cost */
    trackCost(provider: string, costUsd: number, operation: string, extras?: Record<string, unknown>): void;
    /** Flush the current buffer to the ingest endpoint */
    flush(): Promise<IngestResponse | null>;
    /** Add a reporter plugin */
    addReporter(reporter: TelemetryReporter): void;
    /** Update configuration */
    updateConfig(updates: Partial<TelemetryConfig>): void;
    /** Set the current user ID */
    setUserId(userId: string | undefined): void;
    /** Get current session ID */
    getSessionId(): string;
    /** Get buffered event count */
    getBufferSize(): number;
    /** Get offline queue size */
    getOfflineQueueSize(): number;
    /** Graceful shutdown - flush remaining events */
    shutdown(): Promise<void>;
    private createEvent;
    private sendToIngest;
    private queueOffline;
    private loadOfflineQueue;
    private saveOfflineQueue;
    private detectOnlineStatus;
    private startFlushTimer;
    private stopFlushTimer;
    private meetsMinSeverity;
    private sanitize;
    private simpleHash;
}
