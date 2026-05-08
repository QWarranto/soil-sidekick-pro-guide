# SoilSidekick SDK Changelog

## Version Comparison: 1.2.0 → 2.0.0

---

## Version 2.0.0 (Current)

**Release Focus:** Skyline Instruments Sensor Integration & Real-Time APIs

**Published:** February 2026  
**NPM Package:** `@soilsidekick/sdk@2.0.0`

### What's New

#### 🛰️ Skyline Sensor Integration (NEW)
Full integration with Skyline Instruments sensor hardware:

| Feature | Description |
|---------|-------------|
| Sensor Device Management | Register, list, update, delete sensor devices per farm |
| Device Types | mmWave radar, quantum RF, precision timing |
| Sensor Readings | Send readings via HTTP (MQTT fallback) |
| Historical Queries | Query readings by time range with aggregation |
| Real-Time Streaming | WebSocket subscribe/unsubscribe pattern |
| MQTT Direct Connection | Connect directly to MQTT broker for high-frequency data |
| Alert Management | Subscribe to severity-filtered alerts, query & acknowledge |

### New API Namespaces

```typescript
client.sensors.devices.register({...})    // Device management
client.sensors.readings.send({...})       // Send sensor data
client.sensors.readings.query({...})      // Historical queries
client.sensors.readings.aggregate({...})  // Aggregated data
client.sensors.readings.subscribe(...)    // Real-time streaming
client.sensors.alerts.subscribe(...)      // Alert streaming
client.sensors.alerts.getAlerts({...})    // Query alerts
client.sensors.alerts.acknowledge(id)    // Acknowledge alerts
client.connectMQTT({...})                // Direct MQTT connection
```

### Quick Start (v2.0.0)

```typescript
import { LeafEnginesClient } from '@soilsidekick/sdk';

const client = new LeafEnginesClient({
  apiKey: 'sk_live_your_api_key',
  projectRef: 'your-project-ref',
});

// Register a Skyline sensor device
const device = await client.sensors.devices.register({
  deviceId: 'skyline-mmWave-001',
  deviceType: 'mmwave_radar',
  farmId: 'farm-123',
  firmwareVersion: '1.2.0',
});

// Send sensor data
await client.sensors.readings.send({
  deviceId: 'skyline-001',
  deviceType: 'mmwave_radar',
  timestamp: new Date(),
  readings: [
    { metric: 'reflectivity', value: 0.92, unit: 'ratio', confidence: 0.94 },
    { metric: 'canopy_density', value: 0.78, unit: 'ratio' },
  ],
});
```

### All Endpoints (v2.0.0)

All v1.2.0 endpoints are carried forward unchanged.

#### Free Tier (2 endpoints)
- `/get-soil-data`
- `/county-lookup`

#### Starter Tier (8 endpoints)
- `/territorial-water-quality`
- `/territorial-water-analytics`
- `/multi-parameter-planting-calendar`
- `/live-agricultural-data`
- `/environmental-impact-engine`
- `/safe-identification`
- `/dynamic-care`
- `/beginner-guidance`

#### Pro Tier (7 endpoints)
- `/alpha-earth-environmental-enhancement`
- `/agricultural-intelligence`
- `/seasonal-planning-assistant`
- `/smart-report-summary`
- `/carbon-credit-calculator`
- `/generate-vrt-prescription`
- `/leafengines-query`

#### Enterprise Tier (3 endpoints)
- `/visual-crop-analysis`
- `/gpt5-chat`
- `/geo-consumption-analytics`

#### Sensor API (NEW in v2.0.0)
- `sensors.devices.*` — Register, list, update, delete
- `sensors.readings.*` — Send, query, aggregate, subscribe
- `sensors.alerts.*` — Subscribe, query, acknowledge
- `connectMQTT()` — Direct MQTT broker connection

### Rate Limits (Unchanged)

| Tier | Per Minute | Per Hour | Per Day |
|------|-----------|----------|--------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |

---

## Version 1.2.0

**Release Focus:** Core Agricultural Intelligence Platform

### Endpoints Available

#### Free Tier
| Endpoint | Description |
|----------|-------------|
| `/get-soil-data` | Comprehensive soil analysis by county FIPS |
| `/county-lookup` | Search counties by name, state, or FIPS code |

#### Starter Tier
| Endpoint | Description |
|----------|-------------|
| `/territorial-water-quality` | Water quality metrics by county |
| `/territorial-water-analytics` | Regional water quality analytics |
| `/multi-parameter-planting-calendar` | Climate and soil-based planting calendar |
| `/live-agricultural-data` | Real-time data from NOAA, USDA, EPA |
| `/environmental-impact-engine` | Environmental impact assessment |

#### Pro Tier
| Endpoint | Description |
|----------|-------------|
| `/alpha-earth-environmental-enhancement` | Satellite environmental data |
| `/agricultural-intelligence` | AI-powered agricultural insights |
| `/seasonal-planning-assistant` | AI seasonal planning with weather |
| `/smart-report-summary` | AI-generated report summaries |
| `/carbon-credit-calculator` | Carbon credit calculations |
| `/generate-vrt-prescription` | Variable rate technology maps |
| `/leafengines-query` | Plant-environment compatibility |

#### Enterprise Tier
| Endpoint | Description |
|----------|-------------|
| `/visual-crop-analysis` | Visual crop health analysis |
| `/gpt5-chat` | GPT-5 powered agricultural chat |
| `/geo-consumption-analytics` | Geographic usage analytics |

### Rate Limits (v1.1.0)
| Tier | Per Minute | Per Hour | Per Day |
|------|-----------|----------|---------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |

### SDK Features
- TypeScript/JavaScript SDK with fetch-based client
- Python SDK
- Go SDK
- API key authentication (`x-api-key` header)
- Rate limit headers in responses
- Tier-based access control

---

## Version 1.2.0

**Release Focus:** Consumer Plant Care APIs

**Published:** December 2025  
**NPM Package:** `@soilsidekick/sdk@1.2.0`

### What's New

#### 🌱 Consumer Plant Care APIs (NEW)
Three new endpoints addressing the top pain points in consumer plant identification apps:

| Endpoint | Tier | Description |
|----------|------|-------------|
| `/safe-identification` | Starter | Toxic lookalike warnings and environmental context |
| `/dynamic-care` | Starter | Hyper-localized, real-time care recommendations |
| `/beginner-guidance` | Starter | Judgment-free, jargon-free plant guidance |

### New Endpoint Details

#### 1. `/safe-identification` (Starter Tier)
**Problem Solved:** Plant misidentification can be dangerous, especially for foraging.

**Features:**
- Toxic lookalike database with visual similarity scores
- Environmental context (soil, climate, regional flora) to weight identification probability
- Confidence breakdowns showing why alternatives were considered
- Explicit warnings for dangerous lookalikes (e.g., Poison Hemlock vs Wild Carrot)
- Growth stage awareness (seedling identification challenges)

**Request Parameters:**
- `image` (required): Base64 encoded image or URL
- `location`: County FIPS, state code, or coordinates
- `context`: Environment (wild/garden/indoor), purpose (foraging/gardening), growth stage

---

#### 2. `/dynamic-care` (Starter Tier)
**Problem Solved:** Generic "water every 7 days" advice doesn't account for real conditions.

**Features:**
- Adjusts watering based on current humidity, temperature, and recent rainfall
- Considers container type, soil composition, and drainage
- Factors in seasonal changes and indoor environment conditions
- Accounts for plant maturity and growth phase
- Provides actionable guidance, not rigid schedules

**Request Parameters:**
- `plant_species` (required): Common or scientific plant name
- `location` (required): County FIPS and indoor/outdoor status
- `environment`: Light exposure, humidity level
- `container_details`: Type, size, drainage
- `soil_type`: Potting mix, succulent mix, garden soil, etc.
- `last_watered`: Date of last watering

---

#### 3. `/beginner-guidance` (Starter Tier)
**Problem Solved:** Plant community gatekeeping and overwhelming jargon.

**Features:**
- Plain language explanations (no botanical jargon)
- Step-by-step instructions for new plant parents
- Non-judgmental tone for common mistakes
- Progressive learning path
- Visual aids and simple analogies

---

### All Endpoints (v1.2.0)

#### Free Tier (2 endpoints)
- `/get-soil-data`
- `/county-lookup`

#### Starter Tier (8 endpoints) — *+3 new*
- `/territorial-water-quality`
- `/territorial-water-analytics`
- `/multi-parameter-planting-calendar`
- `/live-agricultural-data`
- `/environmental-impact-engine`
- `/safe-identification` ✨ NEW
- `/dynamic-care` ✨ NEW
- `/beginner-guidance` ✨ NEW

#### Pro Tier (7 endpoints)
- `/alpha-earth-environmental-enhancement`
- `/agricultural-intelligence`
- `/seasonal-planning-assistant`
- `/smart-report-summary`
- `/carbon-credit-calculator`
- `/generate-vrt-prescription`
- `/leafengines-query`

#### Enterprise Tier (3 endpoints)
- `/visual-crop-analysis`
- `/gpt5-chat`
- `/geo-consumption-analytics`

---

### Rate Limits (Unchanged)
| Tier | Per Minute | Per Hour | Per Day |
|------|-----------|----------|---------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |

---

## Migration Guide

### From 1.2.0 to 2.0.0

**Breaking Changes:** None. This is a backwards-compatible release. All v1.2.0 endpoints continue to work.

**New Dependencies:** None required.

**Upgrade Steps:**
```bash
# NPM
npm install @soilsidekick/sdk@2.0.0
```

### From 1.1.0 to 1.2.0

**Breaking Changes:** None. This is a backwards-compatible release.

**New Dependencies:** None required.

**Upgrade Steps:**
```bash
# NPM
npm update @soilsidekick/sdk

# Or install specific version
npm install @soilsidekick/sdk@1.2.0
```

### Using New Endpoints

```typescript
import { Configuration, ConsumerPlantCareApi } from '@soilsidekick/sdk';

const config = new Configuration({
  apiKey: 'ak_your_api_key'
});

const plantCareApi = new ConsumerPlantCareApi(config);

// Safe plant identification
const identification = await plantCareApi.safeIdentification({
  image: 'base64_or_url',
  location: { county_fips: '12086' },
  context: { environment: 'wild', purpose: 'foraging' }
});

// Dynamic care recommendations
const care = await plantCareApi.dynamicCare({
  plant_species: 'Monstera deliciosa',
  location: { county_fips: '12086', indoor: true },
  container_details: { type: 'terracotta', has_drainage: true }
});

// Beginner guidance
const guidance = await plantCareApi.beginnerGuidance({
  plant_species: 'Pothos',
  experience_level: 'first_plant',
  concerns: ['watering', 'light']
});
```

---

## Summary

| Metric | v1.2.0 | v2.0.0 | Change |
|--------|--------|--------|--------|
| Total API Endpoints | 20 | 20+ | +sensor namespace |
| Sensor APIs | 0 | 6+ | ✨ NEW |
| Free Tier Endpoints | 2 | 2 | — |
| Starter Tier Endpoints | 8 | 8 | — |
| Pro Tier Endpoints | 7 | 7 | — |
| Enterprise Tier Endpoints | 3 | 3 | — |
| Real-Time Streaming | No | Yes | ✨ NEW |
| MQTT Direct Connection | No | Yes | ✨ NEW |
| Alert Management | No | Yes | ✨ NEW |

**Key Differentiator:** Version 2.0.0 adds Skyline Instruments sensor integration, transforming SoilSidekick from a data-query platform into a real-time sensor management and alerting system for precision agriculture.
