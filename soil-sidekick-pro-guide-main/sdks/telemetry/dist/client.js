"use strict";
/**
 * @leafengines/telemetry - TelemetryClient
 *
 * Core client class that manages event batching, offline queuing,
 * privacy sanitization, and flush lifecycle.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryClient = void 0;
const types_1 = require("./types");
// Simple UUID v4 generator (no external deps)
function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
class TelemetryClient {
    constructor(config) {
        this.buffer = [];
        this.offlineQueue = [];
        this.reporters = [];
        this.flushTimer = null;
        this.isFlushing = false;
        this.isOnline = true;
        this.config = { ...types_1.DEFAULT_CONFIG, ...config };
        this.sessionId = uuid();
        this.detectOnlineStatus();
        this.loadOfflineQueue();
        this.startFlushTimer();
    }
    // ──────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────
    /** Track a single event */
    track(type, name, properties = {}, severity) {
        const event = this.createEvent(type, name, properties, severity);
        // Apply reporters filter
        for (const reporter of this.reporters) {
            if (reporter.filter && !reporter.filter(event))
                return;
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
    trackToolCall(toolName, durationMs, success, args, errorMessage) {
        this.track('tool_call', `tool:${toolName}`, {
            tool_name: toolName,
            arguments: args || {},
            duration_ms: durationMs,
            success,
            error_message: errorMessage,
        });
    }
    /** Convenience: track an API request */
    trackApiRequest(endpoint, method, statusCode, durationMs, extras) {
        this.track('api_request', `api:${endpoint}:${method}`, {
            endpoint,
            method,
            status_code: statusCode,
            duration_ms: durationMs,
            ...extras,
        });
    }
    /** Convenience: track an error */
    trackError(endpoint, errorMessage, statusCode, errorCode) {
        this.track('api_error', `error:${endpoint}`, {
            endpoint,
            method: '',
            status_code: statusCode || 0,
            error_code: errorCode,
            error_message: errorMessage,
        }, 'error');
    }
    /** Convenience: track cost */
    trackCost(provider, costUsd, operation, extras) {
        this.track('cost', `cost:${provider}:${operation}`, {
            provider,
            cost_usd: costUsd,
            operation,
            ...extras,
        });
    }
    /** Flush the current buffer to the ingest endpoint */
    async flush() {
        if (this.isFlushing || this.buffer.length === 0)
            return null;
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
                if (reporter.onFlush)
                    reporter.onFlush(events);
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
        }
        catch (err) {
            // On failure, re-queue events
            this.buffer.unshift(...events);
            // Notify reporters
            for (const reporter of this.reporters) {
                if (reporter.onError)
                    reporter.onError(err, events);
            }
            // If network error, queue offline
            if (!this.isOnline) {
                this.queueOffline(events);
            }
            return null;
        }
        finally {
            this.isFlushing = false;
        }
    }
    /** Add a reporter plugin */
    addReporter(reporter) {
        this.reporters.push(reporter);
    }
    /** Update configuration */
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        // Restart flush timer if interval changed
        if (updates.flushIntervalMs !== undefined) {
            this.stopFlushTimer();
            this.startFlushTimer();
        }
    }
    /** Set the current user ID */
    setUserId(userId) {
        // Will be included in subsequent events via context
        this.config.context = {
            ...this.config.context,
            userId,
        };
    }
    /** Get current session ID */
    getSessionId() {
        return this.sessionId;
    }
    /** Get buffered event count */
    getBufferSize() {
        return this.buffer.length;
    }
    /** Get offline queue size */
    getOfflineQueueSize() {
        return this.offlineQueue.length;
    }
    /** Graceful shutdown - flush remaining events */
    async shutdown() {
        this.stopFlushTimer();
        await this.flush();
    }
    // ──────────────────────────────────────────────
    // Private Methods
    // ──────────────────────────────────────────────
    createEvent(type, name, properties, severity) {
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
    async sendToIngest(events) {
        const headers = {
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
    queueOffline(events) {
        const now = Date.now();
        // Filter out expired events
        const valid = this.offlineQueue.filter((e) => now - new Date(e.timestamp).getTime() < this.config.offlineTtlMs);
        valid.push(...events);
        // Trim to max size
        if (valid.length > this.config.maxOfflineQueueSize) {
            valid.splice(0, valid.length - this.config.maxOfflineQueueSize);
        }
        this.offlineQueue = valid;
        this.saveOfflineQueue();
    }
    loadOfflineQueue() {
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem('leafengines_telemetry_offline');
                if (stored) {
                    this.offlineQueue = JSON.parse(stored);
                }
            }
        }
        catch {
            // Ignore storage errors
        }
    }
    saveOfflineQueue() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('leafengines_telemetry_offline', JSON.stringify(this.offlineQueue));
            }
        }
        catch {
            // Ignore storage errors
        }
    }
    detectOnlineStatus() {
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
    startFlushTimer() {
        if (this.config.flushIntervalMs > 0 && typeof setInterval !== 'undefined') {
            this.flushTimer = setInterval(() => {
                if (this.buffer.length > 0) {
                    this.flush();
                }
            }, this.config.flushIntervalMs);
        }
    }
    stopFlushTimer() {
        if (this.flushTimer !== null) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
    }
    meetsMinSeverity(severity) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(severity) >= levels.indexOf(this.config.minSeverity);
    }
    sanitize(event) {
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
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32-bit int
        }
        return Math.abs(hash).toString(36);
    }
}
exports.TelemetryClient = TelemetryClient;
