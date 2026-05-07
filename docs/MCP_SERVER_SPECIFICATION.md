# LeafEngines™ MCP Server — Technical Specification

**Version:** 1.1.0  
**Protocol:** MCP Streamable HTTP (JSON-RPC 2.0)  
**Last Updated:** 2026-04-01  
**Repository:** [github.com/QWarranto/leafengines-claude-mcp](https://github.com/QWarranto/leafengines-claude-mcp)  
**License:** Apache 2.0  

---

## ⚡ Get Started Now

**Free tier — no signup, no credit card:**
- **Test key:** `leaf-test-370df0a2e62e` (works immediately)
- **Free header:** `x-free-tier: true` (no key needed)

**Ready for production? Founder pricing ends June 1, 2026:**
- [Starter — $10/mo → lifetime $49/mo lock →](https://buy.stripe.com/14A7sL30y8bR2F4fbgaMU02)
- [Pro — $49/mo → lifetime $149/mo lock →](https://buy.stripe.com/cNi3cv1WuajZcfE7IOaMU03)

**Get a professional soil report (no coding required):** [soilcertify.com →](https://soilcertify.com)

---

## 1. Overview

The LeafEngines MCP Server exposes the SoilSidekick Pro agricultural intelligence platform as MCP-callable tools for AI agents (Claude, GPT, Gemini, and open-source models). It runs as a Supabase Edge Function and implements the MCP Streamable HTTP transport specification.

### Key Capabilities

- **10 tools** covering soil analysis, crop planning, water quality, carbon credits, environmental impact, precision agriculture, plant identification, and TurboQuant hardware profiling
- **TurboQuant Integration** — 3-bit KV cache quantization metadata for extended context windows (up to 24K tokens) and 6× memory reduction
- **Batch request support** — process multiple JSON-RPC calls in a single HTTP request
- **x-api-key authentication** — bypasses Supabase JWT validation; uses custom API key logic

---

## 2. Endpoint

| Property | Value |
|----------|-------|
| **URL** | `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server` |
| **Method** | `POST` only (returns `405` for other methods) |
| **Content-Type** | `application/json` |
| **Accept (required)** | Must include `application/json` or `*/*` (returns `406` otherwise) |
| **Auth Header** | `x-api-key: <your-api-key>` |
| **Discovery Manifest** | `/.well-known/ai-plugin.json` |
| **JWT Bypass** | `verify_jwt = false` in `supabase/config.toml` |

---

## 3. Authentication

The MCP server does **not** use Supabase JWT validation. Instead, it reads the `x-api-key` header from each request.

- **`initialize`**, **`tools/list`**, and **`turbo_quant_capabilities`** do NOT require an API key.
- All other **`tools/call`** invocations require a valid `x-api-key`. Missing keys return JSON-RPC error code `-32000`.
- API keys are provisioned at `app.soilsidekickpro.com/api-docs` and use the `ak_sandbox_` prefix for developer sandbox environments.

---

## 4. Protocol Flow

### 4.1 Initialize

```
→ { "jsonrpc": "2.0", "id": 1, "method": "initialize" }
← {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "protocolVersion": "2024-11-05",
      "capabilities": {
        "tools": { "listChanged": false },
        "turboQuant": {
          "enabled": true,
          "version": "1.0.0",
          "kvCacheBits": 3,
          "contextModes": ["standard", "extended", "maximum"],
          "supportedTiers": ["starter", "professional", "enterprise"],
          "benefits": { ... }
        }
      },
      "serverInfo": {
        "name": "leafengines-mcp",
        "version": "1.1.0",
        "provider": "LeafEngines™ by Soil Sidekick Pro"
      }
    }
  }
```

### 4.2 List Tools

```
→ { "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
← { "jsonrpc": "2.0", "id": 2, "result": { "tools": [...] } }
```

### 4.3 Call a Tool

```
→ {
    "jsonrpc": "2.0", "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_soil_data",
      "arguments": { "county_fips": "13121" }
    }
  }
← {
    "jsonrpc": "2.0", "id": 3,
    "result": {
      "content": [{ "type": "text", "text": "{...}" }]
    }
  }
```

### 4.4 Notifications

Notifications (`notifications/initialized`, etc.) return `204 No Content` — no JSON-RPC response is generated.

### 4.5 Batch Requests

Send a JSON array of JSON-RPC requests. Responses are returned as a JSON array (excluding notifications).

---

## 5. Tool Reference

### 5.1 `county_lookup`

Resolve a US place name, state, or partial FIPS code to structured county records.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `term` | string (2–100 chars) | ✅ | Search term (e.g., "Miami-Dade", "Georgia", "13") |

**Returns:** Array of `{ fips_code, county_name, state_name, state_code }`.

---

### 5.2 `get_soil_data`

Retrieve USDA soil composition for a US county.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string (`^\d{5}$`) | ✅ | 5-digit FIPS code |

**Returns:** pH, N-P-K, organic matter %, drainage class, texture.

---

### 5.3 `agricultural_intelligence`

AI-powered crop recommendations, yield predictions, and risk assessments. Supports TurboQuant extended context.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string (`^\d{5}$`) | ✅ | 5-digit FIPS code |
| `crop_type` | string | | Crop to analyze |
| `question` | string | | Specific agricultural question |
| `context_mode` | enum | | `standard` \| `extended` \| `maximum` |
| `kv_cache_hint` | enum | | `none` \| `reuse` \| `persist` |
| `preferred_model_tier` | enum | | `starter` \| `professional` \| `enterprise` |

---

### 5.4 `territorial_water_quality`

EPA water quality data: contamination risk, water body proximity, parameter readings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string (`^\d{5}$`) | ✅ | 5-digit FIPS code |

---

### 5.5 `safe_identification`

Plant identification with toxic lookalike warnings and confidence scores.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plant_name` | string | ✅ | Common or scientific name |
| `location` | string | | Geographic context |

---

### 5.6 `carbon_credit_calculator`

Estimate carbon credit potential for agricultural land.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field_size_acres` | number | ✅ | Field size in acres |
| `soil_organic_matter` | number | | Current SOM % (0–100) |
| `practice_type` | enum | | `cover_cropping` \| `no_till` \| `reduced_till` \| `agroforestry` \| `nutrient_management` |

**Returns:** Credit estimates (tonnes CO₂e), USD value, verification timeline, registry requirements.

---

### 5.7 `generate_vrt_prescription`

Variable rate technology prescription maps for precision agriculture.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string | ✅ | 5-digit FIPS code |
| `application_type` | enum | ✅ | `fertilizer` \| `seed` \| `water` \| `pesticide` |
| `crop_type` | string | | Target crop |
| `field_size_acres` | number | | Field size in acres |

**Returns:** Zone boundaries, per-zone rates, rate units, estimated savings.

---

### 5.8 `environmental_impact_analysis`

Patent-pending multi-source environmental assessment fusing USDA, EPA, NOAA, and AlphaEarth satellite data. Supports TurboQuant extended context for multi-year trend analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string (`^\d{5}$`) | ✅ | 5-digit FIPS code |
| `lat` | number (-90 to 90) | ✅ | Latitude |
| `lng` | number (-180 to 180) | ✅ | Longitude |
| `soil_data` | object | ✅ | `{ drainage_class, slope_percentage, organic_matter_percentage, permeability }` |
| `water_body_data` | object | | `{ proximity_km }` |
| `analysis_id` | string (UUID) | | Session ID |
| `context_mode` | enum | | TurboQuant context mode |
| `kv_cache_hint` | enum | | TurboQuant KV cache strategy |
| `preferred_model_tier` | enum | | Preferred model tier |

**Returns:** Runoff risk (0–100), contamination risk, biodiversity impact, carbon footprint score, satellite-derived vegetation health, eco-friendly alternatives.

---

### 5.9 `planting_optimization`

Multi-parameter planting calendar fusing soil, climate, frost models, and crop phenology. Supports TurboQuant iterative scenario modeling.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `county_fips` | string (`^\d{5}$`) | ✅ | 5-digit FIPS code |
| `crop_type` | string | ✅ | Crop to optimize |
| `field_size_acres` | number | | Field size for yield estimation |
| `planting_year` | integer | | Target year |
| `context_mode` | enum | | TurboQuant context mode |
| `kv_cache_hint` | enum | | TurboQuant KV cache strategy |
| `preferred_model_tier` | enum | | Preferred model tier |

**Returns:** Optimal planting window (start/end), yield prediction (bu/acre), sustainability score (0–100), risk factors, alternative crops.

---

### 5.10 `turbo_quant_capabilities`

Query TurboQuant runtime capabilities and hardware profiling. **No API key required.**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `device_ram_gb` | number | | Available device RAM; filters to compatible models |
| `runtime` | enum | | `webgpu` \| `wasm` \| `native-cpp` \| `all` (default: `all`) |

**Returns:** Supported models with RAM/KV cache requirements, context modes, runtime compatibility, performance benefits, and device-specific recommendations.

---

## 6. TurboQuant Integration

TurboQuant provides 3-bit KV cache quantization for on-device inference, reducing memory requirements by ~5.3× while maintaining reasoning quality.

### 6.1 Context Modes

| Mode | Tokens | Description |
|------|--------|-------------|
| `standard` | ~4K | Default context window (~5 messages) |
| `extended` | ~16K | TQ-enabled extended context (~20 messages) |
| `maximum` | ~24K | Maximum with KV cache persistence (~30 messages) |

### 6.2 Supported Models

| Model | Min RAM | KV Cache (3-bit) | Tier | Max Tokens |
|-------|---------|-------------------|------|------------|
| `gemma-2b-it-onnx` | 1 GB | 0.5 GB | Starter | 24K |
| `gemma-7b-it` | 4 GB | 1.3 GB | Professional | 24K |
| `phi-4-mini` | 4 GB | 1.0 GB | Professional | 16K |
| `bitnet-70b` | 8 GB | 2.0 GB | Enterprise | 48K |
| `bitnet-100b` | 12 GB | 4.0 GB | Enterprise | 48K |

### 6.3 KV Cache Strategies

| Strategy | Description |
|----------|-------------|
| `none` | Fresh inference (default) |
| `reuse` | Reuse cached KV state for follow-up queries (40–60% faster) |
| `persist` | Persist KV cache across sessions for continuous analysis |

### 6.4 Runtime Compatibility

| Runtime | Compatible Models |
|---------|-------------------|
| `webgpu` | gemma-2b, gemma-7b, phi-4-mini |
| `wasm` | gemma-2b, gemma-7b, phi-4-mini |
| `native-cpp` | All models (including bitnet-70b/100b) |

### 6.5 TQ Metadata Forwarding

When TurboQuant parameters are provided in a `tools/call`, they are:
1. **Stripped** from the arguments before forwarding to downstream edge functions.
2. **Forwarded** as custom headers: `x-tq-context-mode`, `x-tq-kv-cache-hint`, `x-tq-model-tier`.
3. **Echoed** in the response under `_turboQuant` metadata (when TQ params were used).

---

## 7. Endpoint Routing

Tool calls are proxied to dedicated Supabase Edge Functions:

| Tool | Edge Function |
|------|---------------|
| `get_soil_data` | `get-soil-data` |
| `county_lookup` | `county-lookup` |
| `agricultural_intelligence` | `agricultural-intelligence` |
| `territorial_water_quality` | `territorial-water-quality` |
| `safe_identification` | `safe-identification` |
| `carbon_credit_calculator` | `carbon-credit-calculator` |
| `generate_vrt_prescription` | `generate-vrt-prescription` |
| `environmental_impact_analysis` | `alpha-earth-environmental-enhancement` |
| `planting_optimization` | `multi-parameter-planting-calendar` |
| `turbo_quant_capabilities` | *Handled locally (no edge function)* |

---

## 8. Error Handling

| Code | Meaning |
|------|---------|
| `-32700` | Parse error — invalid JSON body |
| `-32601` | Method not found |
| `-32602` | Unknown tool name |
| `-32000` | Missing `x-api-key` header |
| HTTP `405` | Non-POST request |
| HTTP `406` | Missing `Accept: application/json` header |

Downstream edge function errors are returned as tool results with `isError: true` and the HTTP status code in the text content.

---

## 9. Discovery Manifest

The `/.well-known/ai-plugin.json` file enables automatic discovery by AI platforms:

```json
{
  "schema_version": "v1",
  "name_for_model": "leafengines",
  "auth": {
    "type": "user_http",
    "authorization_type": "custom_header",
    "custom_auth_header": "x-api-key"
  },
  "mcp": {
    "transport": "streamable-http",
    "url": "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server"
  }
}
```

**Categories:** agriculture, environmental, geospatial, sustainability, data-analysis, science  
**Keywords:** 35+ discovery keywords covering agriculture, environmental, AI, geospatial, and TurboQuant terms.

---

## 10. Integration Paths

### Path A — Claude Desktop (MCP Registry)

```json
{
  "mcpServers": {
    "leafengines": {
      "command": "npx",
      "args": ["-y", "@leafengines/mcp-server"],
      "env": { "LEAFENGINES_API_KEY": "your-key-here" }
    }
  }
}
```

### Path B — OpenClaw Agent Config

```yaml
mcpServers:
  leafengines:
    url: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server
    headers:
      x-api-key: YOUR_API_KEY_HERE
```

### Path C — Direct HTTP

```bash
curl -X POST "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"county_lookup","arguments":{"term":"Fulton"}}}'
```

---

## 11. Service Tiers & Pricing

| Tier | Monthly | Calls/Month | Includes |
|------|---------|-------------|----------|
| Developer | $149 | 25,000 | EPA Water Quality |
| Professional | $499 | 100,000 | EPA + Satellite |
| Enterprise | $1,999 | 500,000 | EPA + Satellite + White-labeling |
| Enterprise Platform Bundle | $3,499 | 500K + 185K | SoilSidekick Pro + LeafEngines-MCP |

---

## 12. CORS Configuration

All responses include standard CORS headers from `_shared/cors.ts`. The OPTIONS preflight handler explicitly allows the `x-api-key` and `accept` headers.

---

## 13. Related Resources

| Resource | URL |
|----------|-----|
| API Documentation | `app.soilsidekickpro.com/api-docs` |
| Swagger UI | `app.soilsidekickpro.com/swagger-ui` |
| SDK Integration Guide | `docs/SDK_INTEGRATION_GUIDE.md` |
| OpenAPI Spec | `openapi-spec.yaml` |
| GitHub Repository | [github.com/QWarranto/leafengines-claude-mcp](https://github.com/QWarranto/leafengines-claude-mcp) |
| TurboQuant Tester | `app.soilsidekickpro.com/turbo-quant-capabilities` |
| Contact | support@soilsidekickpro.com |

## 💰 Pricing

### Free Tier — No Credit Card
- **Test key:** `leaf-test-370df0a2e62e`
- **Free header:** `x-free-tier: true`
- **Includes:** Basic soil analysis, county lookup, TurboQuant check
- **Try it:** [soilcertify.com →](https://soilcertify.com)

### Pay-As-You-Go

| Tier | Price | Per-Call Rate | What You Get | Buy |
|------|-------|--------------|--------------|-----|
| Commoditized | $0.50/bundle | $0.001/call | Basic soil/weather, county lookup | [Buy →](https://buy.stripe.com/3cIdR99oWajZdjI6EKaMU07) |
| Enhanced | $1.50/bundle | $0.003/call | Environmental impact, crop suitability | [Buy →](https://buy.stripe.com/7sY28reJg1NtenM8MSaMU0b) |
| Proprietary | $5.00/bundle | $0.010/call | Planting optimization, carbon credits | [Buy →](https://buy.stripe.com/3cIeVd9oW1NtgvU1kqaMU09) |
| Exclusive | $10.00/bundle | $0.020/call | Patent-pending env compatibility scoring | [Buy →](https://buy.stripe.com/6oU4gzbx40Jp6Vk1kqaMU0a) |

### Monthly Subscriptions

| Plan | Price | Included Calls | Best For | Subscribe |
|------|-------|---------------|----------|-----------|
| **Founder Starter** | $10/mo → lifetime $49/mo | 10,000/mo | Solo developers | [Subscribe →](https://buy.stripe.com/14A7sL30y8bR2F4fbgaMU02) |
| **Founder Pro** | $49/mo → lifetime $149/mo | 35,000/mo | Production apps | [Subscribe →](https://buy.stripe.com/cNi3cv1WuajZcfE7IOaMU03) |
| Starter | $149/mo | 10,000/mo | Solo developers | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| Pro | $499/mo | 35,000/mo | Production apps, teams | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Enterprise | $1,999/mo | 175,000+/mo | White-label, SLA, OEM | [Subscribe →](https://buy.stripe.com/eVqaEXfNkajZ6Vk0gmaMU06) |

> ⏰ **Founder pricing expires June 1, 2026.** First 100 customers lock lifetime rates.

### International Pricing

| Region | Starter | Pro | Local Payment Methods |
|--------|---------|-----|----------------------|
| **United States** | $49/mo | $149/mo | Card, Apple Pay, Google Pay, Affirm |
| **European Union** | €45/mo (VAT incl.) | €135/mo (VAT incl.) | Klarna, iDEAL, EPS, Apple/Google Pay |
| **United Kingdom** | £38/mo (VAT incl.) | £115/mo (VAT incl.) | Afterpay/Clearpay, Apple/Google Pay |
| **Australia** | AU$75/mo (GST incl.) | AU$225/mo (GST incl.) | Afterpay, Apple/Google Pay |

---

🌱 **LeafEngines™** | SoilSidekick Pro® | SoilCertify | SoilTech Suite, Inc.
*Space gives the picture. We give the truth.*
