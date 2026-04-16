# LeafEngines™ × n8n Deep Dive

> **Audience:** n8n workflow authors, automation engineers, agency builders
> **Repository target:** n8n community node / workflow templates repo
> **Last updated:** 2026-04-16

---

## Why LeafEngines + n8n

n8n excels at gluing services together. LeafEngines provides the **agricultural and environmental intelligence layer** that most automation stacks lack: USDA soil data, EPA water quality, AI crop recommendations, carbon credit math, and patent-pending dead-reckoning positioning — all reachable over plain HTTP or via the **MCP Streamable HTTP** endpoint.

If your workflow needs to answer *"what is the ground actually like at this lat/lon, and what should we do about it?"* — this is your integration.

---

## Three Ways to Call LeafEngines from n8n

### 1. HTTP Request Node (zero setup, works today)

The simplest path. Every LeafEngines tool is a single POST.

**Example: soil lookup by FIPS code**

| n8n Node | Setting | Value |
|----------|---------|-------|
| HTTP Request | Method | `POST` |
| | URL | `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data` |
| | Authentication | Header Auth |
| | Header Name | `x-api-key` |
| | Header Value | `={{ $credentials.leafengines.apiKey }}` |
| | Body Content Type | JSON |
| | JSON Body | `{ "county_fips": "{{ $json.fips }}" }` |

Wire this after a **Webhook**, **Schedule Trigger**, or any node producing a FIPS code, and downstream nodes receive structured soil data (pH, N-P-K, organic matter, drainage, texture).

### 2. MCP Client Node (recommended for AI workflows)

If you're using n8n's **AI Agent** node, register LeafEngines once as an MCP tool source and the agent gets all 10 tools automatically.

**MCP endpoint:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`

**Headers:**
```
x-api-key: ak_<your_key>
Accept: application/json, text/event-stream
Content-Type: application/json
```

The AI Agent will discover `county_lookup`, `get_soil_data`, `agricultural_intelligence`, `territorial_water_quality`, `carbon_credit_calculator`, `generate_vrt_prescription`, `safe_identification`, `environmental_impact_analysis`, `planting_optimization`, and `turbo_quant_capabilities` without any per-tool wiring.

### 3. Expose n8n Workflows Back to LeafEngines (advanced)

If you want LeafEngines agents to *call your n8n workflows* (e.g., "trigger irrigation when soil moisture < X"), enable n8n's MCP server in **Settings → MCP access**, toggle **Available in MCP** on each workflow, and share the MCP URL with your enterprise account manager. We can register it as a downstream tool for your tenant.

---

## Workflow Recipes

### Recipe A: Daily Field Health Digest

```
Schedule Trigger (daily 06:00)
  → Postgres / Sheets (read list of FIPS codes you monitor)
    → Loop Over Items
      → HTTP: get-soil-data
      → HTTP: territorial-water-quality
      → HTTP: agricultural-intelligence (input: soil + crop)
    → Merge
  → AI Agent (summarize)
  → Slack / Email
```

**Why this works:** Each LeafEngines call is independently cacheable; even 50 fields cost <$0.10/day on the Starter tier.

### Recipe B: Lead-to-Soil-Report SaaS

```
Webhook (lead form submission with address)
  → HTTP: county_lookup ({ term: address })
  → HTTP: get-soil-data ({ county_fips })
  → HTTP: carbon_credit_calculator ({ acres, organic_matter })
  → Function (format PDF payload)
  → HTTP: your PDF service
  → SendGrid (deliver to lead)
  → CRM upsert
```

This is the canonical "automated land due-diligence" pattern — a real revenue play for agronomy agencies.

### Recipe C: Carbon Credit Scoring at Scale

```
Cron (weekly)
  → Supabase / Airtable (list customer fields)
    → Split In Batches (size 25)
      → HTTP: carbon_credit_calculator
    → Aggregate
  → Conditional (notify if credits Δ > threshold)
  → Email + Dashboard webhook
```

Use **Split In Batches** to stay under burst limits. Starter tier handles 30 req/min comfortably.

### Recipe D: VRT Prescription Pipeline

```
Webhook (field boundary GeoJSON + crop)
  → HTTP: generate-vrt-prescription
  → Function (extract ISOBUS export URL)
  → HTTP: download .zip
  → S3 / Dropbox upload
  → Notify operator
```

Output is **ISO 11783-compliant**, ready for John Deere, Case IH, AGCO, and Trimble displays.

---

## Authentication & Key Management

| Tier | Key Prefix | Best Workflow Pattern |
|------|-----------|----------------------|
| Free | `ak_sandbox_*` | Dev / template authoring |
| Starter ($149/mo) | `ak_starter_*` | Single agency, <5k req/day |
| Pro ($499/mo) | `ak_pro_*` | Multi-tenant agencies, 25k req/day |
| Enterprise ($1,999/mo) | `ak_enterprise_*` | Fleet automation, 500k+ req/day |

**Store the key in n8n Credentials** (Settings → Credentials → New → Header Auth). Never paste it into a workflow's HTTP node directly — it leaks via export JSON.

---

## Rate Limits & Backoff

n8n's HTTP Request node respects standard `Retry-After` headers if you enable **Continue On Fail → Retry On Fail**. Recommended settings:

- **Max Tries:** 3
- **Wait Between Tries:** 2000ms
- **Retry On Status Codes:** 429, 502, 503, 504

For burst workflows (>50 items), use **Split In Batches** with `batchSize` matching your tier's per-minute limit divided by 2.

---

## Error Handling

LeafEngines returns structured errors with a `data_quality` envelope:

```json
{
  "error": "INSUFFICIENT_DATA",
  "data_quality": {
    "confidence": 0.4,
    "sources": ["USDA-2023-partial"],
    "fallback_used": true
  }
}
```

**Recommended pattern:** branch on `data_quality.confidence` — if `< 0.6`, route to a human-review queue instead of acting automatically. This is how enterprise customers stay safe at scale.

---

## Templates Available

These are designed for one-click import into n8n:

1. **`leafengines-soil-digest.json`** — Recipe A, ready to wire to Slack
2. **`leafengines-lead-to-report.json`** — Recipe B, hooks into HubSpot
3. **`leafengines-carbon-monitor.json`** — Recipe C with Airtable
4. **`leafengines-vrt-pipeline.json`** — Recipe D with S3
5. **`leafengines-mcp-agent.json`** — AI Agent + LeafEngines MCP, all 10 tools

(Hosted in the n8n community templates gallery; PRs welcome.)

---

## Pricing Notes for Automation Agencies

A single n8n instance can comfortably power 20–50 client workflows on a single **Pro key** ($499/mo). At Enterprise tier, you get:

- Per-tenant audit logging (`mcp_tool_call_log`)
- 600 req/min sustained, 900 burst
- SOC 2 Type II report under NDA
- 15-minute S1 SLA

Agencies typically resell at $50–$200 per client/month, yielding 80–95% gross margin.

---

## Support

- **Docs hub:** https://soilsidekick.com/api-docs
- **n8n-specific issues:** automation@leafengines.com
- **Community forum:** https://community.leafengines.com/c/n8n
- **Slack (Pro+):** invite via account manager

---

© 2026 SoilSidekick Pro™ / LeafEngines™. n8n is a trademark of n8n GmbH.
