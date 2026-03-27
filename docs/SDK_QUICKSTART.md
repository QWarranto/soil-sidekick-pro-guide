# LeafEngines™ SDK — 5-Minute Quickstart

**Time to first API call: ~2 minutes**

---

## 1. Try It Now (No Code Required)

### Option A: Interactive Sandbox (Recommended)
Test endpoints visually with our enhanced developer sandbox:
- **URL:** [/developer-sandbox](/developer-sandbox)
- Endpoint explorer with tier-based categorization
- Request history with localStorage persistence
- Response visualization with headers and timing

### Option B: Swagger UI
Interactive API documentation with try-it-now functionality:
- **URL:** [/swagger-ui](/swagger-ui)
- Full OpenAPI specification
- Automatic sandbox fallback for free-tier endpoints

### Option C: Postman Collection
Import our pre-configured collection for rapid testing:
- **Download:** [/postman/leafengines-collection.json](/postman/leafengines-collection.json)
- All endpoints pre-configured across tiers
- Environment variables for API keys

### Option D: cURL (Terminal)
```bash
curl -X POST \
  "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/sandbox-demo?endpoint=leafengines-query" \
  -H "Content-Type: application/json" \
  -d '{"plant_name": "Tomato", "location": "Miami-Dade, FL"}'
```

**Expected Response:**
```json
{
  "environmentalCompatibilityScore": 85,
  "waterQualityAlerts": ["Moderate Salinity"],
  "recommendations": ["Consider raised beds for better drainage"]
}
```

---

## 2. Install the SDK

```bash
# TypeScript/JavaScript
npm install @leafengines/sdk

# Python
pip install leafengines-sdk
```

---

## 3. Initialize (30 seconds)

```typescript
import { LeafEnginesSDK } from '@leafengines/sdk';

const sdk = new LeafEnginesSDK({
  apiKey: 'your_api_key',        // Get at /api-keys
  enablePrivacyMode: true,       // On-device AI (GDPR-ready)
  enableOfflineCache: true,      // Works without internet
  turboQuant: {                  // TurboQuant KV cache optimization (Pro+)
    enabled: true,               // Auto-detects device support
    kvCacheMode: '3bit',         // 6x memory reduction, zero accuracy loss
    reuseKVCache: true,          // 40-60% faster follow-up queries
  },
});

await sdk.initialize();
```

**What happens:**
- Downloads Gemma 2B/7B model (cached after first load)
- Detects WebGPU → falls back to WASM + TurboQuant if unavailable
- With TurboQuant: Gemma 7B viable on 4GB+ devices (~1.3GB KV cache)
- Ready for offline inference in <5 seconds

---

## 4. Make Your First Query

```typescript
const result = await sdk.query({
  plant: 'Tomato',
  location: { county: 'Miami-Dade', state: 'FL' }
});

console.log(result.environmentalCompatibilityScore); // 85
console.log(result.waterQualityAlerts);              // ["Moderate Salinity"]
console.log(result.recommendations);                 // [...]
```

---

## 5. Common Use Cases

### Plant Identification (Offline)
```typescript
const id = await sdk.identify({
  image: base64Image,
  includeEdibility: true
});
// Returns: { species: "Solanum lycopersicum", edible: true, confidence: 0.94 }
```

### Care Recommendations
```typescript
const care = await sdk.getCare({
  plant: 'Fiddle Leaf Fig',
  userExperience: 'beginner'
});
// Returns: { waterSchedule: "weekly", sunlight: "bright indirect", tips: [...] }
```

### Environmental Risk Check
```typescript
const risk = await sdk.checkEnvironment({
  county: 'Los Angeles',
  state: 'CA'
});
// Returns: { waterQuality: "good", soilType: "clay loam", alerts: [] }
```

---

## 6. API Reference (Key Endpoints)

| Endpoint | Description | Auth |
|----------|-------------|------|
| `sandbox-demo` | Test any endpoint | ❌ None |
| `leafengines-query` | Plant-location compatibility | ✅ API Key |
| `safe-identification` | Plant ID + toxicity check | ✅ API Key |
| `dynamic-care` | Personalized care tips | ✅ API Key |
| `get-soil-data` | County soil analysis | ✅ API Key |

**Full API Docs:** [/leafengines](/leafengines)

---

## 7. Get Your API Key

1. Visit [/api-keys](/api-keys)
2. Sign up (free tier: 10 req/min, 1K/day)
3. Copy your `ak_...` key

**Production requests:**
```bash
curl -X POST "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/leafengines-query" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ak_your_key_here" \
  -d '{"plant_name": "Basil", "location": "Austin, TX"}'
```

---

## Subscription Tiers

| Tier | Rate | Monthly | Best For |
|------|------|---------|----------|
| **Free** | 10/min | 1K | Testing |
| **Starter** | 30/min | 5K | Small apps |
| **Pro** | 100/min | 25K | Production |
| **Enterprise** | 500/min | 100K | Scale |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Check `x-api-key` header |
| `429 Too Many Requests` | Upgrade tier or wait |
| Slow first load | Normal — model caching (~5s) |
| No WebGPU | Falls back to WASM + TurboQuant automatically |
| TurboQuant not activating | Requires Pro tier or higher |

---

## TurboQuant (Pro+)

TurboQuant compresses KV caches from 16-bit to 3-bit with zero accuracy loss, enabling Gemma 7B on mobile devices.

```typescript
// Check device capabilities
const caps = await sdk.turboQuant.getCapabilities({
  device_memory_gb: 4,
  has_webgpu: true,
  platform: 'mobile'
});
// Returns: { recommended_model: "gemma-7b-tq", max_context_tokens: 16384, ... }

// Pass TQ headers on API requests for optimized inference
const result = await sdk.query({
  plant: 'Tomato',
  location: { county: 'Miami-Dade', state: 'FL' },
}, {
  headers: {
    'x-tq-context-mode': '16384',
    'x-tq-kv-cache-hint': 'reuse',
    'x-tq-model-tier': 'gemma-7b-tq',
  }
});
```

---

## Next Steps

- 📖 [Full SDK Guide](./SDK_INTEGRATION_GUIDE.md)
- 🧪 [Interactive Sandbox](/developer-sandbox) — Visual endpoint testing
- 📚 [Swagger UI](/swagger-ui) — Interactive API documentation
- 📦 [Postman Collection](/postman/leafengines-collection.json) — Import & test
- 🔑 [Get API Keys](/api-keys)
- 💬 **Support:** partnerships@leafengines.com

---

*Total setup time: ~5 minutes*  
*Time to first API call: ~10 seconds (no-code sandbox)*
