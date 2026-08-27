"use strict";
/**
 * LeafEngines SDK v2.0
 *
 * SoilSidekick Pro / LeafEngines API Client
 *
 * @module @leafengines/sdk
 * @version 2.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.MQTTClient = exports.SensorAlertsAPI = exports.SensorReadingsAPI = exports.SensorDevicesAPI = exports.LeafEnginesError = exports.LeafEnginesClient = void 0;
// Main client
var client_1 = require("./client");
Object.defineProperty(exports, "LeafEnginesClient", { enumerable: true, get: function () { return client_1.LeafEnginesClient; } });
Object.defineProperty(exports, "LeafEnginesError", { enumerable: true, get: function () { return client_1.LeafEnginesError; } });
// Sensor APIs
var sensors_1 = require("./sensors");
Object.defineProperty(exports, "SensorDevicesAPI", { enumerable: true, get: function () { return sensors_1.SensorDevicesAPI; } });
Object.defineProperty(exports, "SensorReadingsAPI", { enumerable: true, get: function () { return sensors_1.SensorReadingsAPI; } });
Object.defineProperty(exports, "SensorAlertsAPI", { enumerable: true, get: function () { return sensors_1.SensorAlertsAPI; } });
Object.defineProperty(exports, "MQTTClient", { enumerable: true, get: function () { return sensors_1.MQTTClient; } });
// All types
__exportStar(require("./types"), exports);
// Version
exports.VERSION = '2.0.0';
