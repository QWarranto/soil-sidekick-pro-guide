# LeafEngines™ Agent Integration Guide

## Overview

LeafEngines exposes its agricultural intelligence API as an **MCP (Model Context Protocol) server**, enabling AI agents to discover and invoke tools natively — no custom integration code required.

**MCP Endpoint**: `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`  
**Protocol**: MCP Streamable HTTP (JSON-RPC 2.0 over POST)  
**Auth**: `x-api-key` header on every request  

---

## ⚡ Get Started Now

**Free tier — no signup, no credit card:**
- **Test key:** `leaf-test-370df0a2e62e` (works immediately)
- **Free header:** `x-free-tier: true` (no key needed)

**Ready for production? Founder pricing ends June 1, 2026:**
- [Starter — $10/mo → lifetime $49/mo lock →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04)
- [Pro — $49/mo → lifetime $149/mo lock →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05)

**Get a professional soil report (no coding required):** [soilcertify.com →](https://soilcertify.com)

**Preliminary Site Scan - SoilCertify**
Quick geotechnical overview with essential soil data and basic risk indicators.
https://buy.stripe.com/fZu00j44C0Jp4Nc3syaMU0f
---

## Quick Start

### 1. Get an API Key

Register at [soilsidekick.com/api-keys](https://soilsidekick.com/api-keys) to receive a sandbox key (`ak_sandbox_*`) instantly.

### 2. Connect Your Agent

#### Claude Desktop / MCP-Compatible Agents

Add to your MCP configuration (`claude_desktop_config.json` or equivalent):

```json
{
  "mcpServers": {
    "leafengines": {
      "transport": "streamable-http",
      "url": "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server",
      "headers": {
        "x-api-key": "ak_sandbox_your_key_here"
      }
    }
  }
}
```

#### OpenAI Function Calling

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_soil_data",
            "description": "Retrieve USDA soil analysis for a US county by FIPS code. Returns pH, N-P-K, organic matter, drainage, texture.",
            "parameters": {
                "type": "object",
                "properties": {
                    "county_fips": {
                        "type": "string",
                        "pattern": "^[0-9]{5}$",
                        "description": "5-digit US county FIPS code"
                    }
                },
                "required": ["county_fips"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "county_lookup",
            "description": "Search for US counties by name, state, or FIPS code.",
            "parameters": {
                "type": "object",
                "properties": {
                    "term": {
                        "type": "string",
                        "description": "County name, state, or partial FIPS"
                    }
                },
                "required": ["term"]
            }
        }
    }
]

# When the model calls a tool, proxy it to LeafEngines:
import requests

def call_leafengines(tool_name, arguments):
    resp = requests.post(
        "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-api-key": "ak_sandbox_your_key_here",
        },
        json={
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments,
            },
        },
    )
    return resp.json()
```

#### LangChain / LlamaIndex

```python
from langchain_core.tools import StructuredTool
import requests

def get_soil_data(county_fips: str) -> str:
    """Retrieve USDA soil analysis for a US county."""
    resp = requests.post(
        "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY",
            "x-api-key": "ak_sandbox_your_key_here",
        },
        json={"county_fips": county_fips},
    )
    return resp.text

soil_tool = StructuredTool.from_function(
    func=get_soil_data,
    name="get_soil_data",
    description="Get USDA soil data for a US county by 5-digit FIPS code",
)
```

---

## Available Tools

| Tool | Description | Required Tier |
|------|-------------|---------------|
| `county_lookup` | Resolve location names → FIPS codes | Free |
| `get_soil_data` | USDA soil composition by county | Free |
| `agricultural_intelligence` | AI crop recommendations & yield predictions | Pro |
| `territorial_water_quality` | EPA water quality & contamination risk | Starter |
| `safe_identification` | Plant ID with toxic lookalike warnings | Free |
| `carbon_credit_calculator` | Carbon credit potential estimation | Starter |
| `generate_vrt_prescription` | Variable rate prescription maps | Pro |

---

## MCP Protocol Reference

### Initialize Session

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "my-agent", "version": "1.0.0" }
  }
}
```

### List Available Tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

### Call a Tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_soil_data",
    "arguments": { "county_fips": "13121" }
  }
}
```

### Batch Requests

Send an array of JSON-RPC requests in a single POST for efficiency:

```json
[
  { "jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": { "name": "county_lookup", "arguments": { "term": "Fulton" } } },
  { "jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": { "name": "get_soil_data", "arguments": { "county_fips": "13121" } } }
]
```

---

## Agent Design Patterns

### Pattern 1: Location Resolution Chain

Most users provide place names, not FIPS codes. Agents should resolve first:

```
User: "What's the soil like in Napa Valley?"
Agent: 
  1. tools/call → county_lookup({ term: "Napa" })  → FIPS "06055"
  2. tools/call → get_soil_data({ county_fips: "06055" })
  3. Synthesize response from structured data
```

### Pattern 2: Multi-Factor Environmental Assessment

Combine endpoints for comprehensive analysis:

```
Agent:
  1. get_soil_data(fips)           → soil composition
  2. territorial_water_quality(fips) → water contamination risk
  3. agricultural_intelligence(fips, crop) → planting recommendations
  4. Synthesize into unified environmental report
```

### Pattern 3: Carbon ROI Calculator

```
Agent:
  1. Ask user for field size and current practices
  2. carbon_credit_calculator(acres, organic_matter, practice)
  3. Present monetary value and verification timeline
```

---

## Rate Limits for Agent Traffic

| Tier | Requests/min | Requests/day | Best For |
|------|-------------|-------------|----------|
| Free | 10 | 1,000 | Development & testing |
| Starter | 30 | 5,000 | Single-agent deployment |
| Pro | 100 | 25,000 | Multi-agent orchestration |
| Enterprise | 500 | 100,000 | Fleet-scale agent operations |

**Tip**: Use batch requests to reduce round trips. A single POST with 5 JSON-RPC calls counts as 1 rate-limited request.

---

## Agent Pricing Tier (Coming Soon)

Dedicated pricing for autonomous agent traffic:
- **Per-completion billing** — pay per successful tool call, not raw requests
- **Burst allowance** — agents can exceed rate limits briefly during reasoning chains
- **Volume discounts** — progressive pricing above 50K calls/month

Contact `sales@leafengines.com` for early access.

---

## Discovery

### ai-plugin.json

Available at `/.well-known/ai-plugin.json` for agent platforms that support plugin manifests.

### OpenAPI Spec

Full specification at: `https://soil-sidekick-pro-guide.lovable.app/openapi-spec.yaml`

---

## Security Notes

- API keys are **never** embedded in agent system prompts — use environment variables or secrets managers
- Sandbox keys (`ak_sandbox_*`) are rate-limited and read-only
- All responses include `X-RateLimit-Remaining` headers — agents should respect these
- Tool call results are sanitized; no PII is returned

---

## Support

- **Docs**: [soilsidekick.com/api-docs](https://soilsidekick.com/api-docs)
- **Email**: support@soilsidekickpro.com
- **Agent-specific issues**: agents@leafengines.com

## 💰 Pricing

### Free Tier — No Credit Card
- **Test key:** `leaf-test-370df0a2e62e`
- **Free header:** `x-free-tier: true`
- **Includes:** Basic soil analysis, county lookup, TurboQuant check
- **Try it:** [soilcertify.com →](https://soilcertify.com)

### Pay-As-You-Go

| Tier | Price | Per-Call Rate | What You Get | Buy |
|------|-------|--------------|--------------|-----|
| Commoditized | $0.50/bundle | $0.001/call | Basic soil/weather, county lookup | [Buy →](https://buy.stripe.com/bJe3cvfNk77N5RgfbgaMU0e) |
| Enhanced | $1.50/bundle | $0.003/call | Environmental impact, crop suitability | [Buy →](https://buy.stripe.com/cNi9AT1Wu0Jp93s8MSaMU0c) |
| Proprietary | $5.00/bundle | $0.010/call | Planting optimization, carbon credits | [Buy →](https://buy.stripe.com/28EeVd9oWeAf2F48MSaMU0d) |
| Exclusive | $10.00/bundle | $0.020/call | Patent-pending env compatibility scoring | [Buy →](https://buy.stripe.com/6oU4gzbx40Jp6Vk1kqaMU0a) |

### Monthly Subscriptions

| Plan | Price | Included Calls | Best For | Subscribe |
|------|-------|---------------|----------|-----------|
| **Founder Starter** | $10/mo → lifetime $49/mo | 10,000/mo | Solo developers | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| **Founder Pro** | $49/mo → lifetime $149/mo | 35,000/mo | Production apps | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Starter | $149/mo | 10,000/mo | Solo developers | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| Pro | $499/mo | 35,000/mo | Production apps, teams | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Enterprise | $1,999/mo | 175,000+/mo | White-label, SLA, OEM | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |

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
