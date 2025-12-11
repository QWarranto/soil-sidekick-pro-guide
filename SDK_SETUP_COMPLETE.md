# SDK Generation Setup - Complete ✓

## What's Been Implemented

### 1. Database Infrastructure ✓
- **Added `subscription_tier` column** to `api_keys` table (free, starter, pro, enterprise)
- **Created `api_tier_limits` table** with rate limits and feature access for each tier:
  - Free: 10/min, 100/hr, 1K/day
  - Starter: 30/min, 500/hr, 5K/day
  - Pro: 100/min, 2K/hr, 25K/day
  - Enterprise: 500/min, 10K/hr, 100K/day
- **Created `validate_api_key_with_tier()` function** - Enhanced validation that returns tier information

### 2. API Key Management ✓
- Updated edge function to support tier assignment during API key creation
- API keys now automatically inherit rate limits from their tier
- Tier information is returned when listing API keys

### 3. OpenAPI Specification ✓ (v1.1.0)
- **15 documented endpoints** organized by tier
- Full request/response schemas
- Rate limiting headers documented
- Tier requirements per endpoint (`x-tier-required`)

| Tier | Endpoints |
|------|-----------|
| Free | get-soil-data, county-lookup |
| Starter | territorial-water-quality, territorial-water-analytics, multi-parameter-planting-calendar, live-agricultural-data, environmental-impact-engine |
| Pro | alpha-earth-environmental-enhancement, agricultural-intelligence, seasonal-planning-assistant, smart-report-summary, carbon-credit-calculator, leafengines-query, generate-vrt-prescription |
| Enterprise | visual-crop-analysis |

### 4. SDK Generation Tools ✓
- **`sdks/package.json`** - npm scripts for SDK generation
- **`sdks/generate-sdk.sh`** - Shell script for generating SDKs
- **`sdks/openapitools.json`** - Configuration for all 6 language targets
- **`sdks/generated/`** - Output directory for generated SDKs

### 5. SDK Testing ✓
- **`sdks/test-sdk.ts`** - Comprehensive test suite
- **`sdks/README.md`** - Usage documentation with examples

### 6. CI/CD Pipeline ✓
- **`.github/workflows/sdk-generation.yml`** - Automated SDK generation on OpenAPI changes

---

## Quick Start

### Generate All SDKs
```bash
cd sdks

# Install dependencies
npm install

# Generate all SDKs (TypeScript, Python, Go, Ruby, Java, PHP)
npm run generate:all

# Or use shell script
chmod +x generate-sdk.sh
./generate-sdk.sh all
```

### Generate Single Language
```bash
# TypeScript
npm run generate:typescript

# Python
npm run generate:python

# Go
npm run generate:go

# Using shell script
./generate-sdk.sh typescript
./generate-sdk.sh python 1.2.0  # with version
```

### Test SDK
```bash
# Set API key
export SOILSIDEKICK_API_KEY=ak_your_api_key_here

# Run tests
npm test
```

---

## SDK Structure

```
sdks/
├── package.json           # npm scripts
├── generate-sdk.sh        # Shell script generator
├── openapitools.json      # Generator configuration
├── test-sdk.ts            # Test suite
├── README.md              # Documentation
└── generated/             # Output directory
    ├── typescript/
    ├── python/
    ├── go/
    ├── ruby/
    ├── java/
    └── php/
```

---

## Tier-Based Feature Access

| Feature | Free | Starter | Pro | Enterprise |
|---------|:----:|:-------:|:---:|:----------:|
| Soil Analysis | ✓ | ✓ | ✓ | ✓ |
| County Lookup | ✓ | ✓ | ✓ | ✓ |
| Water Quality | | ✓ | ✓ | ✓ |
| Planting Calendar | | ✓ | ✓ | ✓ |
| Live Agricultural Data | | ✓ | ✓ | ✓ |
| Environmental Impact | | ✓ | ✓ | ✓ |
| Satellite Data | | | ✓ | ✓ |
| AI Intelligence | | | ✓ | ✓ |
| Seasonal Planning | | | ✓ | ✓ |
| Report Summaries | | | ✓ | ✓ |
| Carbon Credits | | | ✓ | ✓ |
| LeafEngines API | | | ✓ | ✓ |
| VRT Prescriptions | | | ✓ | ✓ |
| Visual Crop Analysis | | | | ✓ |

---

## Create API Key

### Via Dashboard
Navigate to Settings → API Keys → Create New Key

### Via API
```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/api-key-management \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key_name": "Production SDK Key",
    "subscription_tier": "pro"
  }'
```

---

## Usage Examples

### TypeScript
```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

const api = new DefaultApi(new Configuration({
  apiKey: 'ak_your_api_key_here',
  basePath: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
}));

const soil = await api.getSoilData({ county_fips: '12086' });
console.log(soil.ph_level);
```

### Python
```python
from soilsidekick import Configuration, DefaultApi

config = Configuration()
config.api_key['x-api-key'] = 'ak_your_api_key_here'
api = DefaultApi(config)

soil = api.get_soil_data(county_fips='12086')
print(soil.ph_level)
```

---

## Rate Limiting

Rate limits are returned in response headers:
- `X-RateLimit-Limit` - Max requests per window
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Unix timestamp when limit resets

### Handling 429 Responses
```typescript
try {
  const data = await api.getSoilData({ county_fips: '12086' });
} catch (error) {
  if (error.status === 429) {
    const resetTime = error.headers.get('X-RateLimit-Reset');
    await sleep(resetTime * 1000 - Date.now());
    // Retry
  }
}
```

---

## Publishing SDKs

### NPM (TypeScript)
```bash
cd generated/typescript
npm publish --access public
```

### PyPI (Python)
```bash
cd generated/python
python -m build
twine upload dist/*
```

### Go Modules
```bash
cd generated/go
git tag v1.1.0
git push origin v1.1.0
```

---

## Support

- **OpenAPI Spec**: `openapi-spec.yaml`
- **Generation Guide**: `docs/SDK_GENERATION_GUIDE.md`
- **Test Suite**: `sdks/test-sdk.ts`
- **CI/CD**: `.github/workflows/sdk-generation.yml`

---

🎉 **SDK infrastructure is production-ready!**
