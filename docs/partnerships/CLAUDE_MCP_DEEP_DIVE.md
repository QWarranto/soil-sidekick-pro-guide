# LeafEngines™ × Claude MCP Server Deep Dive

> **Audience:** Claude Desktop users, Anthropic API developers, agentic-app builders, IDE/MCP host integrators
> **Repository target:** [`leafengines-claude-mcp`](https://github.com/QWarranto/leafengines-claude-mcp) (Apache 2.0)
> **Last updated:** 2026-05-07

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

## What This Is

LeafEngines exposes its full agricultural-intelligence platform as a **Model Context Protocol** server, speaking the official **Streamable HTTP** transport. Drop the URL into Claude Desktop's config (or any MCP-compatible host: Cursor, Cline, Zed, Continue, Goose, etc.) and Claude gains 10 grounded tools for soil, water, plants, carbon, and precision-ag prescriptions.

No SDK install. No proxy. No glue code. Just one `mcpServers` entry.

---

## 60-Second Setup (Claude Desktop)

### macOS / Linux

```bash
# 1. Get a free sandbox key
open https://soilsidekick.com/api-keys

# 2. Edit Claude config
$EDITOR "~/Library/Application Support/Claude/claude_desktop_config.json"
```

### Windows

```powershell
notepad "$env:APPDATA\Claude\claude_desktop_config.json"
```

### Add this block

```json
{
  "mcpServers": {
    "leafengines": {
      "transport": "streamable-http",
      "url": "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server",
      "headers": {
        "x-api-key": "ak_sandbox_REPLACE_ME"
      }
    }
  }
}
```

Restart Claude Desktop. You'll see a 🔌 icon — click it to confirm `leafengines` is connected and 10 tools are available.

---

## The 10 Tools Claude Will See

| Tool | What It Does | Tier |
|------|--------------|------|
| `county_lookup` | Resolves "Napa Valley" → FIPS `06055`. Always call first if user gives a place name. | Free |
| `get_soil_data` | USDA soil composition by FIPS: pH, N-P-K, organic matter, texture, drainage, AWC. | Free |
| `safe_identification` | Plant ID with **toxic lookalike warnings** — designed for forager safety. | Free |
| `environmental_score` | 64-dim AlphaEarth embedding-derived health score for any FIPS. | Free |
| `territorial_water_quality` | EPA water quality, contamination risk, watershed context. | Starter |
| `carbon_credit_calculator` | Carbon-credit potential by acreage + practice + organic matter. | Starter |
| `planting_calendar` | Multi-parameter phenology model (frost dates, GDD, photoperiod). | Starter |
| `agricultural_intelligence` | AI crop recommendations + yield estimates, TurboQuant-accelerated. | Pro |
| `generate_vrt_prescription` | ISO 11783-compliant variable-rate prescription map. | Pro |
| `turbo_quant_capabilities` | Query supported model tiers, memory profiles, context modes. | Free |

---

## Sample Prompts That Light Up the Tool Chain

### "What's the soil like at my place in Napa?"
Claude calls `county_lookup` → `get_soil_data` → narrates the profile in natural language. ~2 seconds end-to-end.

### "I'm thinking of planting heirloom tomatoes on 12 acres in Fulton County, GA — give me a real plan."
Claude chains `county_lookup` → `get_soil_data` → `agricultural_intelligence` (with crop=tomato, acres=12) → `planting_calendar` → `carbon_credit_calculator` → produces a structured plan with planting window, expected yield, amendment recommendations, and carbon revenue estimate.

### "I found this mushroom in the woods — is it safe?"
Attach photo → Claude invokes `safe_identification` → returns ID, confidence, and any toxic lookalikes with warning copy. **This is the headline use case for the Free tier.**

### "Generate a nitrogen prescription map for this field."
Provide GeoJSON → Claude calls `generate_vrt_prescription` → returns ISOBUS XML download URL Claude can drop into the conversation.

---

## Protocol Details (for MCP Host Implementers)

### Transport
**Streamable HTTP** — JSON-RPC 2.0 over POST. Server may respond with either `application/json` (single response) or `text/event-stream` (streamed for long-running tool calls like `agricultural_intelligence`).

### Required Headers on Every Request
```
Content-Type: application/json
Accept: application/json, text/event-stream
x-api-key: ak_<your_key>
```

> **Critical:** the `Accept` header **must** include both MIME types. Hosts that send only `application/json` get a clean `406 Not Acceptable` per the MCP spec.

### Initialize
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "claude-desktop", "version": "0.10.x" }
  }
}
```

### Discover tools
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

### Call a tool
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

### Batch (recommended for chained reasoning)
Send a JSON array — counts as **one** rate-limited request:
```json
[
  { "jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": { "name": "county_lookup", "arguments": { "term": "Fulton" } } },
  { "jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": { "name": "get_soil_data", "arguments": { "county_fips": "13121" } } }
]
```

---

## TurboQuant Hints (Advanced)

Three optional fields on AI-tool arguments unlock memory-aware execution on the offline path:

| Field | Values | When to use |
|-------|--------|-------------|
| `context_mode` | `"standard"` (8K) / `"extended"` (16K) / `"maximum"` (24K) | Multi-year analyses or long crop-history reasoning |
| `kv_cache_hint` | `"none"` / `"reuse"` / `"persist"` | Multi-turn chains over the same field — `"persist"` cuts repeat latency 60–80% |
| `preferred_model_tier` | `"local"` / `"hybrid"` / `"cloud"` | Force local Gemma for privacy, or cloud GPT-5 for max accuracy |

Example:
```json
{
  "name": "agricultural_intelligence",
  "arguments": {
    "county_fips": "13121",
    "crop": "tomato",
    "context_mode": "extended",
    "kv_cache_hint": "persist"
  }
}
```

Query `turbo_quant_capabilities` first to confirm what your tier supports.

---

## Working with Other MCP Hosts

### Cursor
Settings → MCP → Add Server → paste the same `streamable-http` block. Tools appear in `@`-mention autocomplete.

### Cline (VS Code)
`cline_mcp_settings.json`, identical schema to Claude Desktop.

### Continue.dev
`config.yaml`:
```yaml
mcpServers:
  - name: leafengines
    transport:
      type: streamable-http
      url: https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server
      headers:
        x-api-key: ak_sandbox_xxx
```

### Goose (Block)
`~/.config/goose/config.yaml` under `extensions:`, type `streamable_http`.

### Zed
`settings.json` → `assistant.mcp_servers`.

### Custom host (TypeScript)
```ts
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const transport = new StreamableHTTPClientTransport(
  new URL("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server"),
  { requestInit: { headers: { "x-api-key": process.env.LEAFENGINES_KEY! } } }
);
const client = new Client({ name: "my-agent", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);
const tools = await client.listTools();
```

### Custom host (Python)
```python
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

async with streamablehttp_client(
    "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server",
    headers={"x-api-key": os.environ["LEAFENGINES_KEY"]},
) as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()
```

---

## Rate Limits per Tier

| Tier | Req/min | Req/day | Best for |
|------|---------|---------|----------|
| Free (sandbox) | 10 | 1,000 | Personal Claude Desktop use |
| Starter | 30 | 5,000 | Single-agent prosumer apps |
| Pro | 100 | 25,000 | Multi-agent / multi-user products |
| Enterprise | 600 | 500,000 | Composio-class fleet operations |

Batch requests count as one. Use them.

---

## Security Posture

- API keys live in the host's config file — **never** put them in Claude system prompts (Claude can leak them in responses)
- Sandbox keys (`ak_sandbox_*`) are read-only and rate-limited; safe for screen-sharing demos
- Every tool call logged server-side to `mcp_tool_call_log` with `correlation_id` for round-trip tracing
- Responses contain a `data_quality` envelope — agents should branch on `confidence < 0.6` rather than acting blindly
- Enterprise tier: SOC 2 Type II report under NDA, 7-year audit retention, tamper-evident hash chain

---

## Architecture (under the hood, for the curious)

```
┌──────────────────┐        ┌──────────────────────────────────────┐
│ Claude Desktop   │ HTTPS  │ mcp-server (Supabase Edge Function) │
│ (or other host)  ├───────▶│                                      │
└──────────────────┘        │  • API key verify (api_keys table)  │
                            │  • Tier rate-limit (api_tier_limits)│
                            │  • Audit (mcp_tool_call_log)        │
                            │  • Tool dispatch                    │
                            └────────────┬─────────────────────────┘
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            ▼               ▼            ▼            ▼               ▼
       get-soil-data  county-lookup  agricultural-  carbon-credit  visual-crop
                                     intelligence   calculator      analysis
            │
            └─▶ USDA SSURGO / FIPS cache (fips_data_cache)
```

The MCP server is a **thin orchestration layer** — it's the contract surface, not where the data lives. Each tool call fans out to a specialized edge function, with caching at the FIPS layer to absorb agent retries.

---

## Roadmap

- **Q2 2026:** SSE long-poll for streaming `agricultural_intelligence` responses (>2s reasoning chains)
- **Q2 2026:** Resource subscriptions (`resources/subscribe`) for live field-monitoring updates
- **Q3 2026:** Sampling support so LeafEngines can ask the host's LLM follow-up questions
- **Q3 2026:** Public OAuth flow for end-user-scoped keys (today: account-scoped only)

---

## Contributing

The Apache 2.0 MCP-server adapter lives at https://github.com/QWarranto/leafengines-claude-mcp. PRs welcome for:

- Additional MCP host configuration examples (LM Studio, Open WebUI, etc.)
- Sample prompts and conversation transcripts
- Translation of error messages
- Bug fixes in the adapter

**Out of scope** (do not PR): anything that re-implements platform algorithms, especially the dead-reckoning / sensor-fusion engine (US patent apps #19/320,727 and #19/544,827). See `CONTRIBUTING.md` IP checklist.

---

## API Reference & Troubleshooting

### MCP Server Endpoint
The Claude MCP integration uses LeafEngines' MCP server:

**MCP Server URL:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`

### Authentication
- **Header:** `x-api-key: your-api-key`
- **Test Key:** `leaf-test-370df0a2e62e` (limited functionality)
- **Content-Type:** `application/json`
- **Accept:** `application/json, text/event-stream`

### Available Tools (10 Total)
The MCP server exposes these agricultural intelligence tools:
1. `county_lookup` - Search US counties by name, state, or FIPS code
2. `get_soil_data` - Get soil analysis by FIPS code
3. `agricultural_intelligence` - Structured FarmIQ insights
4. `territorial_water_quality` - EPA/EEA WISE water quality data
5. `carbon_credit_calculator` - Carbon credit calculations
6. `generate_vrt_prescription` - Generate VRT prescription maps
7. `safe_identification` - Plant toxicity & edibility identification
8. `environmental_impact_analysis` - Runoff, biodiversity, carbon scores
9. `planting_optimization` - Multi-parameter planting calendars
10. `turbo_quant_capabilities` - TurboQuant offline AI capabilities

### Troubleshooting

#### Connection Issues
1. **Check API Key:** Verify key in Claude Desktop config
2. **Test MCP Server:** Use `curl` to test:
   ```bash
   curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server \
     -H "x-api-key: leaf-test-370df0a2e62e" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
   ```
3. **Restart Claude:** Always restart Claude Desktop after config changes
4. **Check Connection:** Click 🔌 icon in Claude to verify connection

#### Tool Discovery Issues
1. **Verify Tools List:** MCP server should return 10 tools
2. **Check Permissions:** Some tools require Pro/Enterprise tier
3. **Update Config:** Ensure config file syntax is correct JSON

### HTTP API Reference
For direct HTTP API access (outside MCP), use our primary API:

**Base URL:** `https://leafengines-emergency-api-1.onrender.com`

For full endpoint documentation, see:  
[API Endpoint Reference](../API_ENDPOINT_REFERENCE.md)

## Support

- **GitHub Issues:** https://github.com/QWarranto/leafengines-claude-mcp/issues
- **MCP-specific:** mcp@leafengines.com
- **General:** support@soilsidekickpro.com
- **API Reference:** [API Endpoint Reference](../API_ENDPOINT_REFERENCE.md)

---

© 2026 SoilSidekick Pro™ / LeafEngines™. Claude is a trademark of Anthropic PBC. Model Context Protocol is an open spec maintained by Anthropic.

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
