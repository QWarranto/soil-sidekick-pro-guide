# Workflow 12: QGIS SDK Deep Dive — Maximizing LeafEngines Inside QGIS

> **Goal:** Go beyond the basic plugin install and unlock the full LeafEngines SDK from inside QGIS — bring-your-own GIS data, fuse it with agricultural intelligence, run offline AI on field polygons, round-trip prescriptions to equipment, and drive everything from an AI agent via MCP.
> **Time:** ~45 minutes | **Difficulty:** Advanced | **Tier:** Free (BYO data + soil) → Pro (AI + VRT) → Enterprise (MCP + WFS-T writes)

---

## Video Overview

```
[VIDEO NARRATION — INTRO]
"Most QGIS users install the LeafEngines plugin, run a soil query, and stop
there. That's like buying a sports car and only driving it to the mailbox.
In this workflow we'll layer five capabilities on top of the plugin —
bring-your-own data, AI fusion, on-device inference, equipment round-trip,
and agent automation — so QGIS becomes the cockpit for the entire SDK."
```

---

## Prerequisites

- QGIS ≥ 3.22 with the LeafEngines plugin installed (see [plugin README](../../plugins/qgis-leafengines/README.md))
- LeafEngines API key saved in plugin **⚙ Settings** (or `LEAFENGINES_API_KEY` env var)
- Internet for cloud endpoints; offline AI works without
- Optional: Pro/Enterprise tier for AI, VRT export, and WFS-T writes

---

## Layer 1: Bring Your Own Data via WFS (Geography-Agnostic)

The plugin is **not US-only**. Any OGC-compliant WFS source works as your base layer — LeafEngines just adds intelligence on top.

1. **Plugins → LeafEngines → WFS Server** (see [WFS_EXTENSION.md](../../plugins/qgis-leafengines/WFS_EXTENSION.md)).
2. Add a public WFS endpoint for your region:

| Region | Public WFS Source | Example URL |
|--------|-------------------|-------------|
| 🇳🇱 Netherlands | PDOK Cadastral / BRP crop parcels | `https://service.pdok.nl/rvo/brpgewaspercelen/wfs/v1_0` |
| 🇬🇧 United Kingdom | DEFRA MAGIC, BGS Soilscapes | `https://environment.data.gov.uk/spatialdata/.../wfs` |
| 🇫🇷 France | IGN Géoportail (RPG parcels) | `https://data.geopf.fr/wfs/ows` |
| 🇯🇵 Japan | GSI / MLIT base maps | `https://www.gsi.go.jp/.../wfs` |
| 🇺🇸 USA | USGS, NRCS SDA, EPA WATERS | `https://sdmdataaccess.nrcs.usda.gov/Spatial/SDMWGS84Geographic.wfs` |

3. Click **Test Connection → Refresh Feature Types → Add Selected Layers**.
4. Your field boundaries now sit in QGIS as a normal vector layer — symbolize, filter, and edit as usual.

```
[VIDEO NARRATION]
"Whether you're farming in Iowa, Yorkshire, or Hokkaido, point the plugin
at your local cadastral or parcel WFS. Your boundaries become the canvas;
LeafEngines becomes the brush."
```

> 💡 **SDK v3.0 preview:** WFS-T (transactional) writes are arriving in the next release — you'll be able to push edited geometries back to compliant servers with idempotency keys. Read-only WFS works today.

---

## Layer 2: Fuse BYO Data with LeafEngines Intelligence

Once your parcels are loaded, run SDK endpoints against the selected features.

1. Select one or more polygons in your WFS layer.
2. **Plugins → LeafEngines → Open Plugin → 🌱 Soil tab**.
3. The plugin extracts the centroid + (when available) FIPS / admin code and calls:

| Endpoint | Returns | Tier |
|----------|---------|------|
| `get-soil-data` | pH, OM, texture, CEC | Free |
| `leafengines-query` | Plant-location compatibility score | Free |
| `agricultural-intelligence` | Structured FarmIQ insights, risk flags | Starter+ |
| `safe-identification` | Toxicity & edibility from a photo | Pro |
| `multi-parameter-planting-calendar` | 5-method planting windows | Starter+ |
| `territorial-water-quality` | EPA / EEA WISE water quality | Starter+ |
| `environmental-impact-engine` | Runoff, biodiversity, carbon scores | Pro |

4. Results write back into the layer's **attribute table** as new columns (`le_ph`, `le_risk_score`, `le_recommendation`, etc.) — symbolize by any of them.

```
[VIDEO NARRATION]
"This is the magic moment: your boundary polygon, your local cadastral
data, enriched in place with soil chemistry, planting windows, and risk
scores. No GIS-to-spreadsheet round trip — the intelligence lives on the
feature."
```

---

## Layer 3: Offline AI Inside QGIS (No Internet Required)

LeafEngines ships an on-device Gemma model (TurboQuant 3-bit on Pro+) that runs **entirely in the plugin's Python process** — perfect for field laptops with no signal.

1. Plugin **⚙ Settings → Local AI → Enable On-Device Mode**.
2. First launch downloads the Gemma model (~600 MB, cached forever).
3. With a polygon selected, click **🌾 Crops → Generate Recommendation (Local)**.
4. The plugin runs inference locally and writes a narrative recommendation into the attribute table.

| Mode | Latency | Network | Best for |
|------|---------|---------|----------|
| Cloud (`gpt5-chat`) | ~1-3 s | Required | Headquarters, deep analysis |
| Local Gemma 2B | ~2-5 s | None | Field laptops, EU privacy mode |
| Local Gemma 7B + TurboQuant | ~3-8 s | None | High-quality offline (Pro+) |

```
[VIDEO NARRATION]
"Drive into a canyon, lose signal, keep working. The model is in the
plugin; the inference runs on your laptop's GPU or CPU. When you reconnect,
the offline sync queue pushes everything back."
```

> 🔒 **Privacy advantage:** EU and defense customers can run the entire workflow without a single byte leaving the machine — see [PRIVACY_ADVANTAGE](../../src/pages/PrivacyAdvantage.tsx).

---

## Layer 4: Round-Trip to Equipment (VRT / ISOBUS / ADAPT)

Turn your enriched QGIS layer into a prescription map your tractor understands.

1. Select the field(s) with attributes you want to act on (e.g., `le_n_recommendation_lbs_ac`).
2. **Plugins → LeafEngines → 🚜 Export Prescription**.
3. Choose format:

| Format | Use Case | Compatible Systems |
|--------|----------|--------------------|
| **ISOBUS TASKDATA.XML** | Universal precision-ag | John Deere, Case IH, AGCO, Trimble |
| **ADAPT 1.0** | Modern equipment | FieldView, AgLeader SMS, Trimble Ag |
| **Shapefile (zoned)** | Legacy controllers | Older monitors |
| **GeoJSON** | Custom integrations | In-house tools |

4. Plugin calls `generate-vrt-prescription` and `isobus-task` endpoints, packages the result, and writes it to disk ready to load on a USB stick.
5. Imports of yield / as-applied data go the other way: drop the file into the plugin's **Equipment** tab and it round-trips back into a QGIS layer.

```
[VIDEO NARRATION]
"You went from a raw cadastral parcel to a tractor-ready prescription
without leaving QGIS. That's the whole loop — observe, decide, act."
```

See [Workflow 5: VRT Prescriptions](05_VRT_PRESCRIPTIONS.md) and [Workflow 9: API & Equipment Integration](09_API_EQUIPMENT_INTEGRATION.md) for format deep dives.

---

## Layer 5: Drive QGIS from an AI Agent (MCP)

LeafEngines exposes an MCP server so Claude, ChatGPT, or a custom agent can call the same SDK endpoints the plugin uses — and then write results back into your QGIS project.

1. Install the MCP server in your agent host (see [MCP_SERVER_SPECIFICATION](../MCP_SERVER_SPECIFICATION.md)).
2. Authenticate with your LeafEngines API key.
3. Available tools include `get_soil_data`, `query_plant_location`, `get_planting_calendar`, `generate_vrt_prescription`, `safe_identification`, and 5 more.
4. Example agent prompt:

> *"For every parcel in my QGIS layer `brp_2025_selected`, get the soil pH, recommend a cover crop, and write the recommendation back as an attribute. Flag any parcel within 100 m of a surface water body."*

5. The agent calls the MCP tools, the plugin polls for results, and your attribute table fills in automatically.

```
[VIDEO NARRATION]
"This is where it gets interesting. Your AI assistant becomes a GIS analyst.
You describe the outcome; the agent orchestrates the SDK calls; QGIS shows
you the answer rendered on the map."
```

> 🤖 **Composio.dev integration** is available for Enterprise tier — autonomous agents can chain LeafEngines tools with 250+ other SaaS tools.

---

## Putting It Together: A 10-Minute Demo Script

1. **Connect** PDOK WFS → pull 200 Dutch parcels (Layer 1).
2. **Select** 5 parcels → run `agricultural-intelligence` → attribute table fills with FarmIQ insights (Layer 2).
3. **Disconnect Wi-Fi** → run local Gemma → narrative recommendation appears (Layer 3).
4. **Export ISOBUS TASKDATA** → drag the .zip onto a virtual John Deere display (Layer 4).
5. **Ask Claude:** *"Find the riskiest parcel and explain why."* → agent calls MCP, highlights the polygon (Layer 5).

That's the full SDK, surfaced through QGIS, in ten minutes.

---

## ✅ Workflow Checklist

- [ ] Connected at least one non-LeafEngines WFS source
- [ ] Enriched a feature with `agricultural-intelligence` attributes
- [ ] Ran a local Gemma inference with Wi-Fi disabled
- [ ] Exported a prescription in ISOBUS or ADAPT format
- [ ] Called at least one MCP tool from an AI agent
- [ ] Confirmed offline sync queue flushed when reconnected

---

## Tier Cheat Sheet

| Capability | Free | Starter | Pro | Enterprise |
|------------|:---:|:---:|:---:|:---:|
| WFS read (BYO data) | ✅ | ✅ | ✅ | ✅ |
| Soil + county lookup | ✅ | ✅ | ✅ | ✅ |
| FarmIQ intelligence | — | ✅ | ✅ | ✅ |
| Local Gemma 2B | ✅ | ✅ | ✅ | ✅ |
| Local Gemma 7B + TurboQuant | — | — | ✅ | ✅ |
| VRT / ISOBUS export | — | — | ✅ | ✅ |
| MCP agent tools | — | — | ✅ | ✅ |
| WFS-T writes (SDK v3.0) | — | — | — | ✅ |

---

## API Reference & Troubleshooting

### Standardized API Endpoints
The QGIS plugin uses LeafEngines' primary API for all cloud-based intelligence:

**Base URL:** `https://leafengines-emergency-api-1.onrender.com`

| Endpoint | Method | Parameters | Authentication |
|----------|--------|------------|----------------|
| `/v1/soil/analyze` | POST | `{"county_fips": "01001"}` | `x-api-key` header |
| `/v1/crop/recommend` | POST | `{"crop": "corn", "county_fips": "01001"}` | `x-api-key` header |
| `/v1/health` | GET | None | None required |
| `/v1/auth/validate` | POST | `{"api_key": "your-key"}` | None required |

### Authentication
- **Header:** `x-api-key: your-api-key` (configured in plugin settings)
- **Test Key:** `leaf-test-370df0a2e62e` (limited functionality)
- **Free Tier:** Plugin automatically adds `x-free-tier: true` when no API key is set

### Common Parameters
- **`county_fips`:** 5-digit FIPS code (e.g., `01001` for Autauga County, AL)
- **`crop`:** Crop name (e.g., `"corn"`, `"soybeans"`, `"wheat"`)

### Troubleshooting

#### Plugin Connection Issues
1. **Check API Key:** Verify key is saved in plugin settings
2. **Test Connection:** Use `curl` to test API directly:
   ```bash
   curl -X POST https://leafengines-emergency-api-1.onrender.com/v1/soil/analyze \
     -H "x-api-key: leaf-test-370df0a2e62e" \
     -H "Content-Type: application/json" \
     -d '{"county_fips":"01001"}'
   ```
3. **Check Firewall:** Ensure QGIS can access external APIs

#### WFS Connection Issues
1. **Test WFS URL:** Use QGIS Browser panel to test connection
2. **Check Region:** Ensure WFS endpoint matches your geographic region
3. **Layer Visibility:** Some WFS servers require specific layer names

### Complete API Reference
For full endpoint documentation and parameter details, see:  
[API Endpoint Reference](../API_ENDPOINT_REFERENCE.md)

---

## Next Steps

## 🏷️ Pricing & International Support

LeafEngines Agricultural Intelligence supports users worldwide with localized pricing and payment options:

| Region | Starter (Monthly) | Pro (Monthly) | Local Payment Methods |
|--------|-------------------|---------------|----------------------|
| **United States** | $49 | $149 | Card, Apple Pay, Google Pay, Affirm |
| **European Union** | €45 (VAT incl.) | €135 (VAT incl.) | Klarna (DE), iDEAL (NL), EPS (AT), Apple/Google Pay |
| **United Kingdom** | £38 (VAT incl.) | £115 (VAT incl.) | Afterpay/Clearpay, Apple/Google Pay |
| **Australia** | AU$75 (GST incl.) | AU$225 (GST incl.) | Afterpay, Apple/Google Pay |
| **Other Countries** | $49 equivalent | $149 equivalent | Credit/Debit Cards, Apple/Google Pay |

**Free Tier Available:** Test with `x-free-tier: true` header or test key `leaf-test-370df0a2e62e`  
**Founder Pricing:** First 100 customers get lifetime pricing lock

**Why This Matters for QGIS Users:**
- GIS professionals work globally with international clients
- Local pricing reduces friction for team/agency purchases
- Tax-inclusive pricing simplifies budgeting for projects
- Currency stability for long-term agricultural planning

→ **Plugin docs:** [README](../../plugins/qgis-leafengines/README.md) · [WFS Extension](../../plugins/qgis-leafengines/WFS_EXTENSION.md)
→ **Related workflows:** [05 VRT Prescriptions](05_VRT_PRESCRIPTIONS.md) · [06 Offline AI](06_OFFLINE_AI.md) · [09 API & Equipment](09_API_EQUIPMENT_INTEGRATION.md)
→ **SDK reference:** [SDK Quickstart](../SDK_QUICKSTART.md) · [MCP Specification](../MCP_SERVER_SPECIFICATION.md)
→ **API Reference:** [API Endpoint Reference](../API_ENDPOINT_REFERENCE.md)
→ **Get help:** partnerships@leafengines.com
