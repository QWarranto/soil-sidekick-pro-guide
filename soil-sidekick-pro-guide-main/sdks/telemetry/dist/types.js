"use strict";
/**
 * @leafengines/telemetry - Event types and configuration
 *
 * Defines the telemetry event schema, configuration options,
 * and type definitions for the LeafEngines telemetry system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
    endpoint: '',
    maxBatchSize: 20,
    flushIntervalMs: 10000, // 10 seconds
    offlineTtlMs: 86400000, // 24 hours
    maxOfflineQueueSize: 500,
    privacyMode: true,
    minSeverity: 'info',
    sampleRate: 1.0,
    context: {
        appVersion: '1.0.0',
        platform: 'web',
    },
};
