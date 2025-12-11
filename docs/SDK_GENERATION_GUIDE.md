# SoilSidekick Pro SDK Generation Guide

This guide explains how to generate SDKs for different programming languages using the OpenAPI specification.

## Overview

SoilSidekick Pro provides tier-based API access with automatic SDK generation for multiple languages. Each SDK is tailored to the subscription tier, enforcing rate limits and feature access at the API key level.

## Subscription Tiers

| Tier | Rate Limits | Features | Price |
|------|-------------|----------|-------|
| **Free** | 10/min, 100/hr, 1K/day | Soil Analysis, County Lookup | $0/month |
| **Starter** | 30/min, 500/hr, 5K/day | + Water Quality, Planting Calendar | $29/month |
| **Pro** | 100/min, 2K/hr, 25K/day | + Satellite Data, AI, VRT Maps | $99/month |
| **Enterprise** | 500/min, 10K/hr, 100K/day | All Features + Custom | Custom |

## SDK Generation Process

### 1. Install OpenAPI Generator

```bash
# Using npm
npm install @openapitools/openapi-generator-cli -g

# Using brew (macOS)
brew install openapi-generator

# Using Docker
docker pull openapitools/openapi-generator-cli
```

### 2. Generate SDKs

#### JavaScript/TypeScript SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g typescript-fetch \
  -o ./sdks/typescript \
  --additional-properties=npmName=@soilsidekick/sdk,npmVersion=1.0.0,supportsES6=true
```

#### Python SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g python \
  -o ./sdks/python \
  --additional-properties=packageName=soilsidekick,packageVersion=1.0.0
```

#### Go SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g go \
  -o ./sdks/go \
  --additional-properties=packageName=soilsidekick,packageVersion=1.0.0
```

#### Ruby SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g ruby \
  -o ./sdks/ruby \
  --additional-properties=gemName=soilsidekick,gemVersion=1.0.0
```

#### PHP SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g php \
  -o ./sdks/php \
  --additional-properties=packageName=soilsidekick/sdk,packageVersion=1.0.0
```

#### Java SDK

```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g java \
  -o ./sdks/java \
  --additional-properties=groupId=com.soilsidekick,artifactId=soilsidekick-sdk,artifactVersion=1.0.0
```

### 3. Tier-Specific SDK Generation

You can generate tier-specific SDKs by filtering endpoints based on the `x-tier-required` field:

```bash
# Generate a Free-tier only SDK
jq 'walk(if type == "object" and has("x-tier-required") then
  if .["x-tier-required"] == "free" then . else empty end
  else . end)' openapi-spec.yaml > openapi-spec-free.yaml

openapi-generator-cli generate \
  -i openapi-spec-free.yaml \
  -g typescript-fetch \
  -o ./sdks/typescript-free
```

## API Key Management

### Creating API Keys

API keys are created through the SoilSidekick Pro dashboard or API:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/api-key-management \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key_name": "Production API Key",
    "subscription_tier": "pro",
    "permissions": {
      "soil_analysis": true,
      "satellite_data": true,
      "vrt_maps": true
    }
  }'
```

### SDK Authentication

All SDKs use API key authentication:

#### TypeScript Example

```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

const config = new Configuration({
  apiKey: 'ak_your_api_key_here',
  basePath: 'https://your-project.supabase.co/functions/v1'
});

const api = new DefaultApi(config);

// Fetch soil data
const soilData = await api.getSoilData({
  countyFips: '12345'
});
```

#### Python Example

```python
import soilsidekick
from soilsidekick.rest import ApiException

# Configure API key
configuration = soilsidekick.Configuration(
    api_key={'x-api-key': 'ak_your_api_key_here'},
    host='https://your-project.supabase.co/functions/v1'
)

# Create API client
with soilsidekick.ApiClient(configuration) as api_client:
    api_instance = soilsidekick.DefaultApi(api_client)
    
    try:
        # Fetch soil data
        api_response = api_instance.get_soil_data(county_fips='12345')
        print(api_response)
    except ApiException as e:
        print(f"Exception: {e}")
```

## Rate Limiting

All SDKs respect tier-based rate limits. Rate limit information is returned in response headers:

- `X-RateLimit-Limit`: Maximum requests allowed in the window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

### Handling Rate Limits in SDKs

#### TypeScript Example with Retry Logic

```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

async function fetchWithRetry(apiCall: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error: any) {
      if (error.status === 429) {
        const resetTime = parseInt(error.headers['x-ratelimit-reset']);
        const waitTime = resetTime - Math.floor(Date.now() / 1000);
        console.log(`Rate limited. Waiting ${waitTime}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const data = await fetchWithRetry(() => 
  api.getSoilData({ countyFips: '12345' })
);
```

## Feature Access Control

Each endpoint specifies its minimum required tier via the `x-tier-required` annotation. The API automatically enforces these requirements based on your API key's tier.

### Feature Matrix

| Feature | Endpoint | Free | Starter | Pro | Enterprise |
|---------|----------|:----:|:-------:|:---:|:----------:|
| Soil Analysis | `/get-soil-data` | ✓ | ✓ | ✓ | ✓ |
| County Lookup | `/county-lookup` | ✓ | ✓ | ✓ | ✓ |
| Water Quality | `/territorial-water-quality` | ✗ | ✓ | ✓ | ✓ |
| Planting Calendar | `/multi-parameter-planting-calendar` | ✗ | ✓ | ✓ | ✓ |
| Satellite Data | `/alpha-earth-environmental-enhancement` | ✗ | ✗ | ✓ | ✓ |
| AI Recommendations | `/agricultural-intelligence` | ✗ | ✗ | ✓ | ✓ |
| VRT Maps | `/generate-vrt-prescription` | ✗ | ✗ | ✓ | ✓ |

## Testing SDKs

### Integration Tests

Create integration tests for each SDK:

```typescript
// TypeScript test example
import { Configuration, DefaultApi } from '@soilsidekick/sdk';
import { describe, it, expect } from 'vitest';

describe('SoilSidekick SDK', () => {
  const config = new Configuration({
    apiKey: process.env.SOILSIDEKICK_API_KEY,
    basePath: process.env.SOILSIDEKICK_BASE_URL
  });
  
  const api = new DefaultApi(config);
  
  it('should fetch soil data', async () => {
    const response = await api.getSoilData({ countyFips: '12345' });
    expect(response).toBeDefined();
    expect(response.data).toHaveProperty('ph_level');
  });
  
  it('should respect rate limits', async () => {
    // Make requests until rate limited
    let rateLimited = false;
    
    try {
      for (let i = 0; i < 100; i++) {
        await api.getCountyLookup({ term: 'test' });
      }
    } catch (error: any) {
      if (error.status === 429) {
        rateLimited = true;
      }
    }
    
    expect(rateLimited).toBe(true);
  });
});
```

## SDK Publishing

### NPM (TypeScript/JavaScript)

```bash
cd sdks/typescript
npm publish --access public
```

### PyPI (Python)

```bash
cd sdks/python
python setup.py sdist bdist_wheel
twine upload dist/*
```

### RubyGems (Ruby)

```bash
cd sdks/ruby
gem build soilsidekick.gemspec
gem push soilsidekick-1.0.0.gem
```

## Documentation

Auto-generated SDK documentation is available in each SDK's directory:

- TypeScript: `sdks/typescript/README.md`
- Python: `sdks/python/README.md`
- Go: `sdks/go/README.md`

## Support

For SDK issues or questions:
- Email: sdk@soilsidekick.com
- GitHub: https://github.com/soilsidekick/sdks
- Documentation: https://docs.soilsidekick.com/sdk

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Generate and Publish SDKs

on:
  push:
    paths:
      - 'openapi-spec.yaml'
    branches:
      - main

jobs:
  generate-sdks:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install OpenAPI Generator
        run: npm install @openapitools/openapi-generator-cli -g
      
      - name: Generate TypeScript SDK
        run: |
          openapi-generator-cli generate \
            -i openapi-spec.yaml \
            -g typescript-fetch \
            -o ./sdks/typescript
      
      - name: Publish to NPM
        run: |
          cd sdks/typescript
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## License

All generated SDKs are licensed under the MIT License.
