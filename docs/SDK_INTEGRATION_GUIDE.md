# LeafEngines™ SDK Integration Guide

**Version:** 2.0  
**Last Updated:** February 6, 2026  
**Status:** Production Ready

---

## Quick Start Summary

| Step | Time Estimate | Auth Required |
|------|---------------|---------------|
| 1. Try Interactive Sandbox | 5 minutes | ❌ No |
| 2. Install SDK | 10 minutes | ❌ No |
| 3. Get Production API Key | 5 minutes | ✅ Yes |
| 4. Configure & Deploy | 30-60 minutes | ✅ Yes |

**Total Integration Time:** < 2 hours (vs 18-24 months building from scratch)

---

## Step 1: Try Before You Integrate

**No authentication required.** Start here to evaluate the API using any of these no-code options:

### Option A: Interactive Developer Sandbox (Recommended)
- **URL:** [/developer-sandbox](/developer-sandbox)
- Visual endpoint explorer with tier-based categorization
- Request history with localStorage persistence
- Response visualization with headers and timing
- Copy-paste cURL commands

### Option B: Swagger UI / OpenAPI
- **URL:** [/swagger-ui](/swagger-ui)
- Full interactive API documentation
- Try endpoints directly in the browser
- Automatic sandbox fallback for free-tier endpoints

### Option C: Postman Collection
- **Download:** [/postman/leafengines-collection.json](/postman/leafengines-collection.json)
- Pre-configured requests for all endpoints
- Environment variables for easy API key management
- Organized by subscription tier

### Available Sandbox Endpoints

| Endpoint | Description |
|----------|-------------|
| `leafengines-query` | Plant/location compatibility scoring |
| `safe-identification` | Plant ID with toxic lookalike warnings |
| `dynamic-care` | Personalized care recommendations |
| `beginner-guidance` | Beginner-friendly plant tips |
| `get-soil-data` | County soil analysis data |

### Example cURL Request (No Auth)
```bash
curl -X POST \
  "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/sandbox-demo?endpoint=leafengines-query" \
  -H "Content-Type: application/json" \
  -d '{"plant_name": "Tomato", "location": "Miami-Dade, FL"}'
```

---

## Step 2: SDK Installation

### NPM (TypeScript/JavaScript)
```bash
npm install @leafengines/sdk
```

### Python
```bash
pip install leafengines-sdk
```

### Other Languages
SDKs for Go, Ruby, Java, and PHP available on request.

**Note:** SDKs are auto-generated from our OpenAPI specification using `openapi-generator-cli`.

---

## Step 3: SDK Initialization

### The "Zero-Server" Handshake

Instead of complex server-side polling, the SDK handles everything locally.

```typescript
import { LeafEnginesSDK } from '@leafengines/sdk';

const sdk = new LeafEnginesSDK({
  apiKey: 'your_production_api_key', // Required for production
  enablePrivacyMode: true,           // On-device AI inference
  enableOfflineCache: true           // 4-tier hierarchical cache
});

await sdk.initialize();
```

### What Happens During Initialization

1. **Model Loading:** The SDK pulls our ONNX-optimized Gemma model (`onnx-community/gemma-2b-it-onnx`) from Hugging Face Hub.

2. **Hardware Negotiation:** The SDK queries device capabilities:
   - **Primary:** WebGPU for hardware-accelerated inference
   - **Fallback:** CPU-optimized execution path for older devices

3. **Cache Warmup:** Local cache structures are initialized.

**Engineer's Lift:** ~30 minutes. You're plugging in a local brain, not building a pipeline.

---

## Step 4: Privacy Configuration (GDPR-Ready)

### On-Device AI Processing

When `enablePrivacyMode: true`, the SDK ensures:

| Data Type | Processing Location | Transmission |
|-----------|---------------------|--------------|
| Precise geolocation | Device only | ❌ Never sent |
| Plant identification | Device only | ❌ Never sent |
| Environmental queries | Anonymized | ✅ Aggregated only |
| Soil/water data | Cloud | ✅ County-level only |

### Configuration
```typescript
const sdk = new LeafEnginesSDK({
  apiKey: 'your_key',
  enablePrivacyMode: true,
  privacyConfig: {
    locationPrecision: 'county',     // 'county' | 'state' | 'region'
    analyticsEnabled: false,          // No behavioral tracking
    localInferencePreferred: true     // AI runs on-device when possible
  }
});
```

**Engineer's Lift:** ~1 hour. Configuring policies rather than writing encryption wrappers.

---

## Step 5: Data Fusion & Caching

### 4-Tier Hierarchical Cache

The SDK implements our patent-protected hierarchical caching system:

| Tier | Scope | TTL | Use Case |
|------|-------|-----|----------|
| L1 | County | 1 hour | Local soil conditions |
| L2 | State | 6 hours | Regional weather patterns |
| L3 | Region | 24 hours | Climate zone data |
| L4 | National | 168 hours | Baseline references |

### Automatic Data Fusion

When your app requests a "Survival Score," the SDK automatically:

1. Pings AlphaEarth (Satellite) endpoints
2. Queries EPA Water Quality data
3. Fuses with local soil cache
4. Returns a single JSON object

```typescript
const result = await sdk.query({
  plant: 'Tomato',
  location: { county: 'Miami-Dade', state: 'FL' }
});

// Returns:
{
  environmentalCompatibilityScore: 85,
  waterQualityAlerts: ['Moderate Salinity'],
  satelliteHealthTrends: { ndvi: 0.72, trend: 'stable' },
  recommendations: [...]
}
```

**Engineer's Lift:** Zero. This is baked into the `leafengines-query` endpoint.

---

## Step 6: UI Implementation

### Output Fields

| Field | Type | Description |
|-------|------|-------------|
| `environmentalCompatibilityScore` | 0-100 | Overall plant-location match |
| `waterQualityAlerts` | string[] | Active water quality warnings |
| `satelliteHealthTrends` | object | NDVI and vegetation indices |
| `deathPreventionTriggers` | object | Push notification hooks |

### Example React Integration
```tsx
import { useLeafEngines } from '@leafengines/react';

function PlantDetails({ plantName, location }) {
  const { data, loading } = useLeafEngines(plantName, location);
  
  if (loading) return <Skeleton />;
  
  return (
    <div>
      <CompatibilityScore value={data.environmentalCompatibilityScore} />
      <WaterAlerts alerts={data.waterQualityAlerts} />
      <HealthTrends trends={data.satelliteHealthTrends} />
    </div>
  );
}
```

---

## Authentication Reference

### Sandbox (No Auth Required)
```bash
# No headers needed
curl -X POST "https://.../functions/v1/sandbox-demo?endpoint=leafengines-query"
```

### Production (Auth Required)
```bash
# x-api-key header required
curl -X POST "https://.../functions/v1/leafengines-query" \
  -H "x-api-key: ak_your_production_key"
```

### Get Your Production Key
1. Visit [/api-keys](/api-keys)
2. Select your tier (Free, Starter, Pro, Enterprise)
3. Generate and securely store your key

---

## Subscription Tiers

| Tier | Rate Limits | Key Features |
|------|-------------|--------------|
| **Free** | 10/min, 1K/day | Soil data, county lookup |
| **Starter** | 30/min, 5K/day | Water quality, planting calendar, live agricultural data |
| **Pro** | 100/min, 25K/day | AI crop analysis, carbon credits, VRT prescriptions |
| **Enterprise** | 500/min, 100K/day | Visual crop analysis, custom integrations |

---

## Technical Specifications

### Local AI Engine
- **Model:** `onnx-community/gemma-2b-it-onnx`
- **Source:** Hugging Face Hub (ONNX format)
- **Primary Accelerator:** WebGPU
- **Fallback:** CPU (automatic if WebGPU unavailable)
- **Cold Start:** < 5 seconds (model download + initialization)
- **Inference Latency:** < 100ms (warm, on-device)

### API Performance
- **Cloud Endpoints:** < 1000-3000ms (varies by data source)
- **Cached Responses:** < 500ms
- **Availability SLA:** 99.9% (monthly)

### Standards Compliance
- **Equipment:** ADAPT 1.0, ISO 11783
- **Security:** SOC 2 Type I certified
- **Privacy:** GDPR-ready architecture

---

## Support & Resources

| Resource | URL | Description |
|----------|-----|-------------|
| **Interactive Sandbox** | [/developer-sandbox](/developer-sandbox) | Visual endpoint testing |
| **Swagger UI** | [/swagger-ui](/swagger-ui) | Interactive API documentation |
| **Postman Collection** | [/postman/leafengines-collection.json](/postman/leafengines-collection.json) | Downloadable API collection |
| **API Overview** | [/leafengines](/leafengines) | B2B platform information |
| **API Keys** | [/api-keys](/api-keys) | Key management dashboard |
| **Quickstart Guide** | [SDK_QUICKSTART.md](./SDK_QUICKSTART.md) | 5-minute setup guide |
| **Contact** | partnerships@leafengines.com | Partnership inquiries |

---

*Document Version: 2.1*  
*Accuracy Verified: February 6, 2026*
