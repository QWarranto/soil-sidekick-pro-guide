# SoilSidekick Pro SDK

## Quick Start

### 1. Generate SDK

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript SDK
openapi-generator-cli generate \
  -i ../openapi-spec.yaml \
  -g typescript-fetch \
  -o ./typescript \
  --additional-properties=npmName=@soilsidekick/sdk,supportsES6=true

# Generate Python SDK
openapi-generator-cli generate \
  -i ../openapi-spec.yaml \
  -g python \
  -o ./python \
  --additional-properties=packageName=soilsidekick
```

### 2. Get API Key

Create an API key through the dashboard or API:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/api-key-management \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key_name": "My SDK Key",
    "subscription_tier": "pro"
  }'
```

### 3. Test SDK

```bash
# Install dependencies
npm install typescript ts-node @types/node

# Run test suite
npx ts-node test-sdk.ts YOUR_API_KEY

# Or with environment variable
export SOILSIDEKICK_API_KEY=ss_prod_xxx
npx ts-node test-sdk.ts
```

## API Endpoints

### Free Tier
| Endpoint | Description |
|----------|-------------|
| `GET /get-soil-data` | Soil analysis by county |
| `GET /county-lookup` | County search |

### Starter Tier
| Endpoint | Description |
|----------|-------------|
| `GET /territorial-water-quality` | Water quality metrics |
| `GET /territorial-water-analytics` | Regional water analytics |
| `GET /multi-parameter-planting-calendar` | Planting recommendations |
| `GET /live-agricultural-data` | Real-time NOAA/USDA data |
| `GET /environmental-impact-engine` | Environmental impact assessment |

### Pro Tier
| Endpoint | Description |
|----------|-------------|
| `GET /alpha-earth-environmental-enhancement` | Satellite data |
| `GET /agricultural-intelligence` | AI crop analysis |
| `GET /seasonal-planning-assistant` | AI seasonal planning |
| `GET /smart-report-summary` | AI report summaries |
| `GET /carbon-credit-calculator` | Carbon credit estimation |
| `GET /leafengines-query` | Plant-environment compatibility |
| `GET /generate-vrt-prescription` | VRT prescription maps |

### Enterprise Tier
| Endpoint | Description |
|----------|-------------|
| `GET /visual-crop-analysis` | AI image analysis |

## Rate Limits

| Tier | Per Minute | Per Hour | Per Day |
|------|------------|----------|---------|
| Free | 10 | 100 | 1,000 |
| Starter | 30 | 500 | 5,000 |
| Pro | 100 | 2,000 | 25,000 |
| Enterprise | 500 | 10,000 | 100,000 |

Rate limit info returned in headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Usage Examples

### TypeScript
```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

const api = new DefaultApi(new Configuration({
  apiKey: 'ss_prod_your_key',
  basePath: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
}));

// Get soil data
const soil = await api.getSoilData({ county_fips: '12086' });
console.log(soil.ph_level, soil.organic_matter);

// Calculate carbon credits
const carbon = await api.calculateCarbonCredits({
  field_name: 'North Field',
  field_size_acres: 150
});
console.log(`Credits earned: ${carbon.calculation_details.credits_earned}`);
```

### Python
```python
from soilsidekick import Configuration, DefaultApi

config = Configuration()
config.api_key['Authorization'] = 'ss_prod_your_key'
config.host = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'

api = DefaultApi(config)

# Get soil data
soil = api.get_soil_data(county_fips='12086')
print(f"pH: {soil.ph_level}, Organic Matter: {soil.organic_matter}%")

# Environmental impact
impact = api.calculate_environmental_impact(
    analysis_id='uuid',
    county_fips='12086',
    soil_data={'ph_level': 6.5, 'organic_matter': 3.2}
)
print(f"Runoff Risk: {impact.detailed_analysis.runoff_risk.risk_level}")
```

### cURL
```bash
# Get soil data
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data \
  -H "Authorization: Bearer ss_prod_your_key" \
  -H "Content-Type: application/json" \
  -d '{"county_fips": "12086"}'

# LeafEngines query (uses x-api-key header)
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/leafengines-query \
  -H "x-api-key: ss_prod_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"county_fips": "12086"},
    "plant": {"common_name": "Tomato"}
  }'
```

## Error Handling

```typescript
try {
  const data = await api.getSoilData({ county_fips: '12086' });
} catch (error) {
  if (error.status === 401) {
    console.error('Invalid API key');
  } else if (error.status === 403) {
    console.error('Tier restriction - upgrade required');
  } else if (error.status === 429) {
    const resetTime = error.headers.get('X-RateLimit-Reset');
    console.error(`Rate limited. Retry after: ${resetTime}`);
  }
}
```

## Support

- Documentation: https://soilsidekick.com/docs
- API Reference: See `openapi-spec.yaml`
- Email: support@soilsidekick.com
