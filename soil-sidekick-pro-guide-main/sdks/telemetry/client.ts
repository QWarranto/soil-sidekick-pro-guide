/**
 * @leafengines/telemetry - TelemetryClient
 *
 * Core client class that manages event batching, offline queuing,
 * privacy sanitization, and flush lifecycle.
 */

import {
  TelemetryEvent,
  TelemetryConfig,
  TelemetryContext,
  TelemetryReporter,
  IngestResponse,
  SeverityLevel,
  DEFAULT_CONFIG,
} from './types';

// Simple UUID v4 generator (no external deps)
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class TelemetryClient {
  private config: TelemetryConfig;
  private buffer: TelemetryEvent[] = [];
  private offlineQueue: TelemetryEvent[] = [];
  private reporters: TelemetryReporter[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private sessionId: string;
  private isFlushing = false;
  private isOnline = true;

  constructor(config: Partial<TelemetryConfig> & { endpoint: string }) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = uuid();
    this.detectOnlineStatus();
    this.loadOfflineQueue();
    this.startFlushTimer();
  }

  // ──────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────

  /** Track a single event */
  track(
    type: TelemetryEvent['type'],
    name: string,
    properties: Record<string, unknown> = {},
    severity?: SeverityLevel,
  ): void {
    const event = this.createEvent(type, name, properties, severity);

    // Apply reporters filter
    for (const reporter of this.reporters) {
      if (reporter.filter && !reporter.filter(event)) return;
    }

    // Apply reporters enrichment
    let enriched = event;
    for (const reporter of this.reporters) {
      if (reporter.enrich) {
        enriched = reporter.enrich(enriched);
      }
    }

    // Sample rate check
    if (this.config.sampleRate < 1.0 && Math.random() > this.config.sampleRate) {
      return;
    }

    // Severity check
    if (severity && !this.meetsMinSeverity(severity)) {
      return;
    }

    // Privacy sanitization
    if (this.config.privacyMode) {
      this.sanitize(enriched);
    }

    this.buffer.push(enriched);

    if (this.buffer.length >= this.config.maxBatchSize) {
      this.flush();
    }
  }

  /** Convenience: track a tool call */
  trackToolCall(
    toolName: string,
    durationMs: number,
    success: boolean,
    args?: Record<string, unknown>,
    errorMessage?: string,
  ): void {
    this.track('tool_call', `tool:${toolName}`, {
      tool_name: toolName,
      arguments: args || {},
      duration_ms: durationMs,
      success,
      error_message: errorMessage,
    });
  }

  /** Convenience: track an API request */
  trackApiRequest(
    endpoint: string,
    method: string,
    statusCode: number,
    durationMs: number,
    extras?: Record<string, unknown>,
  ): void {
    this.track('api_request', `api:${endpoint}:${method}`, {
      endpoint,
      method,
      status_code: statusCode,
      duration_ms: durationMs,
      ...extras,
    });
  }

  /** Convenience: track an error */
  trackError(
    endpoint: string,
    errorMessage: string,
    statusCode?: number,
    errorCode?: string,
  ): void {
    this.track('api_error', `error:${endpoint}`, {
      endpoint,
      method: '',
      status_code: statusCode || 0,
      error_code: errorCode,
      error_message: errorMessage,
    }, 'error');
  }

  /** Convenience: track cost */
  trackCost(
    provider: string,
    costUsd: number,
    operation: string,
    extras?: Record<string, unknown>,
  ): void {
    this.track('cost', `cost:${provider}:${operation}`, {
      provider,
      cost_usd: costUsd,
      operation,
      ...extras,
    });
  }

  /** Flush the current buffer to the ingest endpoint */
  async flush(): Promise<IngestResponse | null> {
    if (this.isFlushing || this.buffer.length === 0) return null;

    this.isFlushing = true;
    const events = [...this.buffer];
    this.buffer = [];

    try {
      // If offline, queue for later
      if (!this.isOnline) {
        this.queueOffline(events);
        return null;
      }

      const response = await this.sendToIngest(events);

      // Notify reporters
      for (const reporter of this.reporters) {
        if (reporter.onFlush) reporter.onFlush(events);
      }

      // If there are offline events and we're back online, flush those too
      if (this.offlineQueue.length > 0) {
        const offlineEvents = [...this.offlineQueue];
        this.offlineQueue = [];
        this.saveOfflineQueue();
        // Merge back into buffer for next flush
        this.buffer.unshift(...offlineEvents);
        if (this.buffer.length > 0) {
          setTimeout(() => this.flush(), 100);
        }
      }

      return response;
    } catch (err) {
      // On failure, re-queue events
      this.buffer.unshift(...events);

      // Notify reporters
      for (const reporter of this.reporters) {
        if (reporter.onError) reporter.onError(err as Error, events);
      }

      // If network error, queue offline
      if (!this.isOnline) {
        this.queueOffline(events);
      }

      return null;
    } finally {
      this.isFlushing = false;
    }
  }

  /** Add a reporter plugin */
  addReporter(reporter: TelemetryReporter): void {
    this.reporters.push(reporter);
  }

  /** Update configuration */
  updateConfig(updates: Partial<TelemetryConfig>): void {
    this.config = { ...this.config, ...updates };

    // Restart flush timer if interval changed
    if (updates.flushIntervalMs !== undefined) {
      this.stopFlushTimer();
      this.startFlushTimer();
    }
  }

  /** Set the current user ID */
  setUserId(userId: string | undefined): void {
    // Will be included in subsequent events via context
    this.config.context = {
      ...this.config.context!,
      userId,
    } as TelemetryContext & { userId: string };
  }

  /** Get current session ID */
  getSessionId(): string {
    return this.sessionId;
  }

  /** Get buffered event count */
  getBufferSize(): number {
    return this.buffer.length;
  }

  /** Get offline queue size */
  getOfflineQueueSize(): number {
    return this.offlineQueue.length;
  }

  /** Graceful shutdown - flush remaining events */
  async shutdown(): Promise<void> {
    this.stopFlushTimer();
    await this.flush();
  }

  // ──────────────────────────────────────────────
  // Private Methods
  // ──────────────────────────────────────────────

  private createEvent(
    type: TelemetryEvent['type'],
    name: string,
    properties: Record<string, unknown>,
    severity?: SeverityLevel,
  ): TelemetryEvent {
    return {
      id: uuid(),
      type,
      timestamp: new Date().toISOString(),
      name,
      properties,
      severity,
      sessionId: this.sessionId,
      context: this.config.context,
    };
  }

  private async sendToIngest(events: TelemetryEvent[]): Promise<IngestResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.customHeaders,
    };

    if (this.config.apiKey) {
      headers['x-api-key'] = this.config.apiKey;
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    if (this.config.anonKey) {
      headers['apikey'] = this.config.anonKey;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`Ingest failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private queueOffline(events: TelemetryEvent[]): void {
    const now = Date.now();
    // Filter out expired events
    const valid = this.offlineQueue.filter(
      (e) => now - new Date(e.timestamp).getTime() < this.config.offlineTtlMs,
    );
    valid.push(...events);

    // Trim to max size
    if (valid.length > this.config.maxOfflineQueueSize) {
      valid.splice(0, valid.length - this.config.maxOfflineQueueSize);
    }

    this.offlineQueue = valid;
    this.saveOfflineQueue();
  }

  private loadOfflineQueue(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('leafengines_telemetry_offline');
        if (stored) {
          this.offlineQueue = JSON.parse(stored);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveOfflineQueue(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'leafengines_telemetry_offline',
          JSON.stringify(this.offlineQueue),
        );
      }
    } catch {
      // Ignore storage errors
    }
  }

  private detectOnlineStatus(): void {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        // Auto-flush when coming back online
        if (this.buffer.length > 0 || this.offlineQueue.length > 0) {
          this.flush();
        }
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  private startFlushTimer(): void {
    if (this.config.flushIntervalMs > 0 && typeof setInterval !== 'undefined') {
      this.flushTimer = setInterval(() => {
        if (this.buffer.length > 0) {
          this.flush();
        }
      }, this.config.flushIntervalMs);
    }
  }

  private stopFlushTimer(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private meetsMinSeverity(severity: SeverityLevel): boolean {
    const levels: SeverityLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(severity) >= levels.indexOf(this.config.minSeverity);
  }

  private sanitize(event: TelemetryEvent): void {
    // Hash user IDs
    if (event.userId && event.userId.length > 0) {
      event.userId = `hashed:${this.simpleHash(event.userId)}`;
    }
    // Remove PII-like fields from properties
    const piiKeys = ['email', 'phone', 'address', 'ip', 'name', 'ssn'];
    for (const key of piiKeys) {
      if (event.properties[key]) {
        event.properties[key] = '[REDACTED]';
      }
    }
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit int
    }
    return Math.abs(hash).toString(36);
  }
}
