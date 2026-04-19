# LeafEngines n8n Deep Dive

**Audience:** n8n workflow authors, automation engineers, agency builders  
**Repository target:** n8n community node / workflow templates repo  
**Last updated:** 2026-04-16  
**API Version:** emergency_1.0

---

n8n excels at gluing services together. LeafEngines provides the agricultural and environmental intelligence layer that most automation stacks lack: USDA soil data, EPA water quality, AI crop recommendations, carbon credit math, and patent-pending dead-reckoning positioning — all reachable over plain HTTP or via the MCP Streamable HTTP endpoint.

If your workflow needs to answer **"what is the ground actually like at this lat/lon, and what should we do about it?"** — this is your integration.

## The Simplest Path: Direct HTTP Calls

Every LeafEngines tool is a single POST to our primary API.

### Example: Soil Lookup by FIPS Code

| n8n Node | Setting | Value |
|----------|---------|-------|
| **HTTP Request** | Method | POST |
| | URL | `https://leafengines-emergency-api-1.onrender.com/v1/soil/analyze` |
| | Authentication | Header Auth |
| | Header Name | `x-api-key` |
| | Header Value | `={{ $credentials.leafengines.apiKey }}` |
| | Body Content Type | JSON |
| | JSON Body | `{ "county_fips": "{{ $json.fips }}" }` |

Wire this after a **Webhook**, **Schedule Trigger**, or any node producing a FIPS code, and downstream nodes receive structured soil data:

```json
{
  "analysis_date": "2026-04-16T23:11:39.388307",
  "api_version": "emergency_1.0",
  "calls_remaining": 4997,
  "location": "Unknown",
  "nutrients": {
    "calcium": "adequate",
    "magnesium": "adequate",
    "nitrogen": "medium",
    "phosphorus": "high",
    "potassium": "low"
  },
  "organic_matter": "medium",
  "ph": 6.8,
  "recommendations": [
    "Add potassium fertilizer (0-0-60)",
    "Maintain current nitrogen levels",
    "Consider cover cropping for organic matter"
  ],
  "soil_type": "loam",
  "suitable_crops": ["corn", "soybeans", "wheat", "alfalfa"]
}
```

## AI Agent Integration: MCP Server

If you're using n8n's **AI Agent node**, register LeafEngines once as an MCP tool source and the agent gets all 10 tools automatically.

**MCP endpoint:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`

**Headers:**
```
Accept: application/json, text/event-stream
Content-Type: application/json
x-api-key: ak_<your_key>
```

The AI Agent will discover these 10 tools without any per-tool wiring:
- `county_lookup`
- `get_soil_data`
- `agricultural_intelligence`
- `territorial_water_quality`
- `carbon_credit_calculator`
- `generate_vrt_prescription`
- `safe_identification`
- `environmental_impact_analysis`
- `planting_optimization`
- `turbo_quant_capabilities`

## Bidirectional Integration: LeafEngines → n8n

If you want LeafEngines agents to call your n8n workflows (e.g., **"trigger irrigation when soil moisture < X"**), enable n8n's MCP server:

1. **Settings → MCP access**
2. Toggle **Available in MCP** on each workflow
3. Share the MCP URL with your enterprise account manager

We can register it as a downstream tool, letting LeafEngines agents orchestrate your n8n automations.

## API Reference

### Primary API (Recommended)
- **Base URL:** `https://leafengines-emergency-api-1.onrender.com`
- **Authentication:** `x-api-key` header
- **Parameters:** Use `county_fips` (5-digit FIPS code)

### Available Endpoints
1. **Soil Analysis:** `/v1/soil/analyze`
2. **Crop Recommendation:** `/v1/crop/recommend`
3. **Health Check:** `/v1/health` (GET, no auth)
4. **Auth Validation:** `/v1/auth/validate`

### Legacy API (Supabase)
- **Base URL:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1`
- **Use for:** MCP server only
- **Note:** Different parameter requirements

## Rate Limits & Tiers

| Tier | Monthly Calls | Requests/Minute | Price |
|------|---------------|-----------------|-------|
| **Free** | 100 | 10 | $0 |
| **Starter** | 10,000 | 100 | $10/mo |
| **Pro** | 50,000 | 500 | $49/mo |
| **Enterprise** | 500,000 | 5,000 | $1,999/mo |

## Troubleshooting

### Common Issues:
1. **401 Unauthorized:** Check `x-api-key` header spelling (case-insensitive)
2. **400 Bad Request:** Ensure `county_fips` is a valid 5-digit FIPS code
3. **429 Too Many Requests:** Upgrade tier or wait for rate limit reset

### Test Credentials:
- **Test Key:** `leaf-test-370df0a2e62e`
- **Test FIPS:** `01001` (Autauga County, AL)

## Support & Resources

- **Complete API Reference:** [API_ENDPOINT_REFERENCE.md](https://github.com/QWarranto/soil-sidekick-pro-guide/blob/main/docs/API_ENDPOINT_REFERENCE.md)
- **Other Platform Guides:** [QGIS](https://github.com/QWarranto/soil-sidekick-pro-guide/blob/main/docs/workflows/12_QGIS_SDK_DEEP_DIVE.md) • [Node-RED](https://github.com/QWarranto/soil-sidekick-pro-guide/blob/main/docs/partnerships/NODE_RED_DEEP_DIVE.md) • [Claude MCP](https://github.com/QWarranto/soil-sidekick-pro-guide/blob/main/docs/partnerships/CLAUDE_MCP_DEEP_DIVE.md)
- **GitHub Issues:** [Repository Issues](https://github.com/QWarranto/soil-sidekick-pro-guide/issues)
- **Enterprise Support:** `partnerships@leafengines.com`

---

**Next Steps:**  
1. Test with the free tier key  
2. Build your first soil analysis workflow  
3. Explore MCP integration for AI agents  

## 💰 Pricing for Business Automation

As an n8n user automating business processes across regions, our pricing supports your international workflows:

**Monthly Subscription Plans:**

| Plan | USD | EUR (EU) | GBP (UK) | Notes |
|------|-----|----------|----------|-------|
| **Starter** | $49 | €45 | £38 | Basic automation & API access |
| **Pro** | $149 | €135 | £115 | Advanced workflows, higher limits |
| **Enterprise** | Custom | Custom | Custom | Volume discounts, SLA |

**Regional Payment Support:**
- **EU Businesses:** Klarna (DE), iDEAL (NL), EPS (AT) + standard cards
- **UK Businesses:** Afterpay/Clearpay for flexible payments
- **Global:** Credit cards, Apple Pay, Google Pay
- **All prices include applicable taxes** (VAT/GST/sales tax)

**Free Testing:** Use `leaf-test-370df0a2e62e` test key for evaluation

**Integration Value:**
- Predictable costs for global automation deployments
- Local payment methods for distributed teams
- Tax compliance built-in for international clients
- Scalable from prototype to production
4. Contact us for enterprise bidirectional integration