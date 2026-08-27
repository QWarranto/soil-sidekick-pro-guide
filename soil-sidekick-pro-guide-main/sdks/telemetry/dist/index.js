"use strict";
/**
 * @leafengines/telemetry - Main entry point
 *
 * Re-exports all public APIs from the telemetry package.
 *
 * Usage:
 *   import { TelemetryClient } from '@ancientwhispers54/leafengines-telemetry';
 *
 *   const telemetry = new TelemetryClient({
 *     endpoint: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/telemetry-ingest',
 *     apiKey: 'ak_...',
 *     anonKey: 'eyJ...',
 *   });
 *
 *   telemetry.trackToolCall('agricultural_intelligence', 1250, true);
 *   telemetry.trackApiRequest('/get-soil-data', 'POST', 200, 890);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.TelemetryClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "TelemetryClient", { enumerable: true, get: function () { return client_1.TelemetryClient; } });
var types_1 = require("./types");
Object.defineProperty(exports, "DEFAULT_CONFIG", { enumerable: true, get: function () { return types_1.DEFAULT_CONFIG; } });
