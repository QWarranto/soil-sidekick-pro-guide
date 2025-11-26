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

### 3. SDK Configuration Files ✓
- **`src/lib/sdk-tier-limits.ts`** - TypeScript tier configuration with helper functions
- **`openapi-spec.yaml`** - Complete OpenAPI 3.0 specification with:
  - All major endpoints documented
  - Tier requirements per endpoint (`x-tier-required`)
  - Rate limit headers
  - Authentication schemes
  - Request/response schemas

### 4. Documentation ✓
- **`docs/SDK_GENERATION_GUIDE.md`** - Complete guide for:
  - Generating SDKs in 6+ languages (TypeScript, Python, Go, Ruby, PHP, Java)
  - Tier-specific SDK generation
  - Authentication examples
  - Rate limiting handling
  - Testing and publishing SDKs
  - CI/CD integration

## What You Can Do Now

### Generate Your First SDK

#### TypeScript/JavaScript
```bash
npm install @openapitools/openapi-generator-cli -g

openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g typescript-fetch \
  -o ./sdks/typescript \
  --additional-properties=npmName=@soilsidekick/sdk,supportsES6=true
```

#### Python
```bash
openapi-generator-cli generate \
  -i openapi-spec.yaml \
  -g python \
  -o ./sdks/python \
  --additional-properties=packageName=soilsidekick
```

### Create API Keys with Tiers

```bash
# Via API
curl -X POST https://your-project.supabase.co/functions/v1/api-key-management \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key_name": "My Pro API Key",
    "subscription_tier": "pro",
    "permissions": {
      "soil_analysis": true,
      "satellite_data": true
    }
  }'
```

### Use the SDK

```typescript
import { Configuration, DefaultApi } from '@soilsidekick/sdk';

const config = new Configuration({
  apiKey: 'ss_prod_your_api_key_here',
  basePath: 'https://your-project.supabase.co/functions/v1'
});

const api = new DefaultApi(config);

// Fetch soil data
const result = await api.getSoilData({ county_fips: '12345' });
console.log(result);
```

## Tier-Based Feature Access

Each endpoint in the OpenAPI spec is annotated with `x-tier-required`:

| Feature | Tier Required | Endpoints |
|---------|--------------|-----------|
| Soil Analysis | Free | `/get-soil-data` |
| County Lookup | Free | `/county-lookup` |
| Water Quality | Starter | `/territorial-water-quality` |
| Planting Calendar | Starter | `/multi-parameter-planting-calendar` |
| Satellite Data | Pro | `/alpha-earth-environmental-enhancement` |
| AI Services | Pro | `/agricultural-intelligence` |
| VRT Maps | Pro | `/generate-vrt-prescription` |

## Next Steps

1. **Test API Key Creation** - Create API keys with different tiers via the dashboard or API
2. **Generate Your First SDK** - Follow the guide to generate an SDK in your preferred language
3. **Add More Endpoints** - Update `openapi-spec.yaml` to include additional edge functions
4. **Publish SDKs** - Publish to NPM, PyPI, RubyGems, etc.
5. **Set Up CI/CD** - Automate SDK generation on OpenAPI spec changes

## Rate Limiting

Rate limits are enforced automatically based on API key tier:

- Limits are returned in response headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

- 429 responses when exceeded:
  ```json
  {
    "error": "Rate limit exceeded",
    "message": "You have exceeded your rate limit. Retry after reset time.",
    "code": "RATE_LIMITED"
  }
  ```

## Updating the OpenAPI Spec

When you add new edge functions, update `openapi-spec.yaml`:

```yaml
/your-new-endpoint:
  post:
    tags:
      - Category
    summary: Description
    operationId: yourNewEndpoint
    x-tier-required: pro  # Set minimum tier
    requestBody:
      # ... request schema
    responses:
      '200':
        # ... response schema
```

Then regenerate SDKs to include the new endpoint.

## Support

- OpenAPI Spec: `openapi-spec.yaml`
- Generation Guide: `docs/SDK_GENERATION_GUIDE.md`
- Tier Config: `src/lib/sdk-tier-limits.ts`
- Database Functions: `validate_api_key_with_tier()` in Supabase

## Testing

Test tier restrictions:
```sql
-- Check tier limits
SELECT * FROM api_tier_limits;

-- Check your API keys
SELECT id, key_name, subscription_tier, rate_limit, created_at 
FROM api_keys 
WHERE user_id = auth.uid();

-- Test validation function
SELECT * FROM validate_api_key_with_tier('your_key_hash_here');
```

---

🎉 **Your SDK infrastructure is ready!** Start generating SDKs for your API in minutes.