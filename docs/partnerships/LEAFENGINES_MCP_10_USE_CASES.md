# LeafEngines MCP Server — 10 Use Cases

**Audience:** AI agent builders, MCP integrators, automation engineers, enterprise architects
**Repository target:** `leafengines-claude-mcp` use-case companion doc
**Last updated:** 2026-04-30
**MCP Endpoint:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`
**Transport:** MCP Streamable HTTP (JSON-RPC 2.0)
**Auth:** `x-api-key` header (Free-tier tools require none)

---

## ⚡ Get Started Now

**Free tier — no signup, no credit card:**
- **Test key:** `leaf-test-370df0a2e62e` (works immediately)
- **Free header:** `x-free-tier: true` (no key needed)

**Ready for production?**
- [Starter — $149/mo →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04)
- [Pro — $499/mo →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05)

**Get a professional soil report (no coding required):** [soilcertify.com →](https://soilcertify.com)

---

The LeafEngines MCP server exposes 10 agricultural and environmental intelligence tools to any MCP-compatible AI agent (Claude Desktop, OpenAI, Gemini, OpenClaw, n8n AI Agent, Node-RED, LangChain, custom). Below are 10 production-ready use cases that show how those tools chain together to deliver business outcomes — not just raw data.

Each use case lists the **agent prompt**, the **tools chained**, and the **outcome**.

---

## 1. Conversational Soil Q&A for Growers

**Scenario:** A row-crop farmer asks Claude Desktop, *"What's the soil like on my farm in Fulton County, Georgia, and what should I plant this spring?"*

**Tools chained:**
1. `county_lookup` → resolves "Fulton County, Georgia" → FIPS `13121`
2. `get_soil_data` → returns pH, N-P-K, organic matter, drainage, texture
3. `agricultural_intelligence` → AI-generated crop recommendations and yield estimates

**Outcome:** A natural-language briefing in under 4 seconds — no portal, no FIPS lookup, no spreadsheet. Free-tier discovery (steps 1–2) requires no API key, removing all friction from the first interaction.

---

## 2. Carbon Credit ROI Calculator for Land Managers

**Scenario:** A regenerative-ag consultant uses an internal LangChain agent to estimate carbon revenue across a 50-field portfolio.

**Tools chained:**
1. `get_soil_data` (looped per field FIPS) → current organic matter %
2. `carbon_credit_calculator` → tonnes CO₂e and USD value per practice (`cover_cropping`, `no_till`, `agroforestry`)
3. Agent aggregates portfolio totals and ranks fields by ROI

**Outcome:** A ranked list of which fields to enroll first, with verification timeline and registry requirements per Verra/CAR standards. Replaces a 2-day consulting deliverable with a 90-second agent run.

---

## 3. Variable-Rate Prescription Generation for Precision Ag

**Scenario:** An equipment dealer's customer-success agent generates VRT prescriptions on demand for John Deere Operations Center customers.

**Tools chained:**
1. `county_lookup` + `get_soil_data` → soil baseline
2. `generate_vrt_prescription` (`application_type: fertilizer`, crop, acreage) → zone boundaries + per-zone rates
3. Optional: `planting_optimization` for application timing

**Outcome:** A shapefile-ready prescription delivered in chat, with estimated input savings (typically 12–22%). Pro-tier endpoint; bypasses the GIS technician bottleneck.

---

## 4. EPA-Compliant Water Quality Pre-Screening

**Scenario:** A site-selection agent for a vertical-farm operator screens 200 candidate counties for water contamination risk before scheduling site visits.

**Tools chained:**
1. `county_lookup` (batched JSON-RPC array) → bulk FIPS resolution
2. `territorial_water_quality` (one call per county) → contamination risk, water-body proximity, parameter readings
3. Agent filters counties below risk threshold

**Outcome:** Site-visit calendar focused on the top 12 candidates instead of all 200. Batch JSON-RPC reduces 400 HTTP round trips to ~15.

---

## 5. Patent-Pending Environmental Impact Assessments for ESG Reporting

**Scenario:** A sustainability officer at a CPG company needs a defensible environmental impact score for every supplier farm in their footprint.

**Tools chained:**
1. `county_lookup` → supplier FIPS
2. `get_soil_data` + `territorial_water_quality` → ground-truth inputs
3. `environmental_impact_analysis` (lat/lng + soil object) → multi-source fusion: USDA + EPA + NOAA + AlphaEarth satellite
4. Agent compiles per-supplier scorecards

**Outcome:** Audit-ready ESG reports referencing patent-pending fusion methodology — runoff risk, contamination risk, biodiversity impact, satellite vegetation health, eco-friendly alternatives.

---

## 6. Offline / Disconnected Plant Identification with Toxic-Lookalike Safety

**Scenario:** A field guide app embeds an MCP-aware on-device agent for foragers and homesteaders operating without cell coverage.

**Tools chained:**
1. `turbo_quant_capabilities` (`device_ram_gb`, `runtime: webgpu`) → selects compatible local model (e.g., `gemma-2b-it-onnx` for 1 GB devices)
2. `safe_identification` (`plant_name`, `location`) → confidence score + toxic lookalike warnings
3. Local LLM synthesizes safety guidance using TurboQuant 3-bit KV cache for 24K-token context

**Outcome:** Sub-100 ms identification with explicit poisoning safeguards — no cloud dependency, no PII leakage. Free-tier (no API key required for either tool).

---

## 7. Multi-Year Planting Calendar Optimization

**Scenario:** A cooperative extension service builds a Telegram bot that gives smallholder farmers crop-rotation guidance.

**Tools chained:**
1. `county_lookup` + `get_soil_data` → baseline
2. `planting_optimization` (`crop_type`, `planting_year`, `context_mode: extended`) → optimal window, yield forecast, sustainability score, alternative crops
3. Agent loops for 3 years to model rotation

**Outcome:** A 3-year rotation plan with risk factors and sustainability scoring. TurboQuant `extended` context (16K tokens) enables iterative scenario modeling in a single agent turn.

---

## 8. n8n / Node-RED IoT Sensor Workflows

**Scenario:** A Node-RED flow reads moisture from Skyline Instruments mmWave sensors and triggers an MCP agent when readings drift.

**Tools chained:**
1. Sensor → Node-RED MQTT node → threshold trigger
2. Node-RED `function` node calls MCP `get_soil_data` for the field's FIPS
3. `agricultural_intelligence` (`question: "Why is moisture dropping faster than expected?"`)
4. Workflow fires SMS alert + opens irrigation valve via downstream node

**Outcome:** Closed-loop irrigation control fusing live telemetry with USDA baselines. The same MCP endpoint works identically from n8n's AI Agent node.

---

## 9. Composio / OpenClaw Agent Marketplaces

**Scenario:** A Composio-hosted agent advertises "agricultural intelligence" as a callable capability across hundreds of partner SaaS apps (Salesforce, HubSpot, Slack).

**Tools chained:**
- All 10 LeafEngines tools registered via the discovery manifest at `/.well-known/ai-plugin.json`
- Composio handles auth proxying via `x-api-key`
- Partner apps invoke via natural-language intents (e.g., "look up soil for this lead's address")

**Outcome:** Zero-integration distribution to thousands of CRM/SaaS users. LeafEngines counts a single Composio API key while reaching the long tail.

---

## 10. Fleet-Scale Agent Orchestration for AgTech OEMs

**Scenario:** An OEM (tractor, drone, or sprayer manufacturer) runs a fleet of autonomous agents that plan jobs across thousands of customer fields nightly.

**Tools chained:** (per field, batched)
1. `county_lookup` → FIPS resolution
2. `get_soil_data` + `territorial_water_quality` → environmental baseline
3. `planting_optimization` → window
4. `generate_vrt_prescription` → equipment-ready zones
5. `environmental_impact_analysis` → compliance check
6. `carbon_credit_calculator` → revenue capture for enrolled fields

**Outcome:** Overnight job-plan generation for 10,000+ fields on the Enterprise tier (500K calls/month). Batch JSON-RPC + TurboQuant `kv_cache_hint: reuse` cuts inference cost ~50%. White-label response wrapping ships under the OEM's brand.

---

## Tool Coverage Matrix

| # | Use Case | Tier | Tools Used |
|---|----------|------|------------|
| 1 | Conversational Soil Q&A | Free → Pro | `county_lookup`, `get_soil_data`, `agricultural_intelligence` |
| 2 | Carbon Credit ROI | Starter | `get_soil_data`, `carbon_credit_calculator` |
| 3 | VRT Prescription | Pro | `get_soil_data`, `generate_vrt_prescription`, `planting_optimization` |
| 4 | Water Quality Screening | Starter | `county_lookup`, `territorial_water_quality` |
| 5 | ESG Environmental Impact | Pro | `get_soil_data`, `territorial_water_quality`, `environmental_impact_analysis` |
| 6 | Offline Plant ID | Free | `turbo_quant_capabilities`, `safe_identification` |
| 7 | Planting Calendar | Pro | `get_soil_data`, `planting_optimization` |
| 8 | IoT Sensor Workflows | Pro | `get_soil_data`, `agricultural_intelligence` |
| 9 | Agent Marketplaces | All | All 10 tools |
| 10 | OEM Fleet Orchestration | Enterprise | All 10 tools |

---

## Quick-Start: Wire LeafEngines into Any MCP Agent

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

Required HTTP headers for direct calls:
```
Accept: application/json, text/event-stream
Content-Type: application/json
x-api-key: ak_<your_key>   # optional for Free-tier tools
```

---

## Pricing for Agent Workloads

| Tier | Monthly | Calls/Month | Best For |
|------|---------|-------------|----------|
| Free | $0 | 1,000 | Prototyping, free-tier tools |
| Developer | $149 | 25,000 | Single-agent deployment |
| Professional | $499 | 100,000 | Multi-agent orchestration |
| Enterprise | $1,999 | 500,000 | Fleet-scale OEM operations |
| Enterprise Bundle | $3,499 | 685,000 | SoilSidekick Pro + LeafEngines-MCP |

Batch JSON-RPC requests count as a single rate-limited call, dramatically improving throughput for use cases 4, 9, and 10.

---

## Related Documentation

- **MCP Server Specification:** [`docs/MCP_SERVER_SPECIFICATION.md`](../MCP_SERVER_SPECIFICATION.md)
- **Agent Integration Guide:** [`docs/AGENT_INTEGRATION_GUIDE.md`](../AGENT_INTEGRATION_GUIDE.md)
- **Claude MCP Deep Dive:** [`docs/partnerships/CLAUDE_MCP_DEEP_DIVE.md`](./CLAUDE_MCP_DEEP_DIVE.md)
- **n8n Deep Dive:** [`docs/partnerships/N8N_DEEP_DIVE.md`](./N8N_DEEP_DIVE.md)
- **Node-RED Deep Dive:** [`docs/partnerships/NODE_RED_DEEP_DIVE.md`](./NODE_RED_DEEP_DIVE.md)
- **Composio Onboarding:** [`docs/partnerships/COMPOSIO_ENTERPRISE_ONBOARDING.md`](./COMPOSIO_ENTERPRISE_ONBOARDING.md)

---

## Support

- **Docs Portal:** [docs.leafengines.com](https://docs.leafengines.com)
- **API Keys:** [app.soilsidekickpro.com/api-keys](https://app.soilsidekickpro.com/api-keys)
- **Agent Issues:** `agents@leafengines.com`
- **Enterprise / OEM:** `partnerships@leafengines.com`

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
| Starter | $149/mo | 10,000/mo | Solo developers | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| Pro | $499/mo | 35,000/mo | Production apps, teams | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Enterprise | $1,999/mo | 175,000+/mo | White-label, SLA, OEM | [Subscribe →](https://buy.stripe.com/eVqaEXfNkajZ6Vk0gmaMU06) |

### International Pricing

| Region | Starter | Pro | Local Payment Methods |
|--------|---------|-----|----------------------|
| **United States** | $149/mo | $499/mo | Card, Apple Pay, Google Pay, Affirm |
| **European Union** | €139/mo (VAT incl.) | €459/mo (VAT incl.) | Klarna, iDEAL, EPS, Apple/Google Pay |
| **United Kingdom** | £119/mo (VAT incl.) | £395/mo (VAT incl.) | Afterpay/Clearpay, Apple/Google Pay |
| **Australia** | AU$229/mo (GST incl.) | AU$759/mo (GST incl.) | Afterpay, Apple/Google Pay |

---

🌱 **LeafEngines™** | SoilSidekick Pro® | SoilCertify | SoilTech Suite, Inc.
*Space gives the picture. We give the truth.*
