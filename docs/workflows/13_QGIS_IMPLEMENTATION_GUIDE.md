# LeafEngines for QGIS — Implementation Guide

You're in the right place. This is the official home for the LeafEngines QGIS plugin.

**New here?** See **Get Started** in the sidebar for the [5-minute Quick Start](/docs/get-started/quick-start), a [free test API key](/docs/get-started/free-api-key), [sample reports](/docs/get-started/sample-reports), and [pricing](/docs/get-started/pricing). The rest of this page is the full implementation guide for developers ready to build.

---

## ⚡ Get Started Now

**Free tier — no signup, no credit card:**
- **Test key:** `leaf-test-370df0a2e62e` (works immediately in the QGIS plugin)
- **Free header:** `x-free-tier: true` (no key needed for direct API calls)

**Ready for production? Founder pricing ends June 1, 2026:**
- [Starter — $10/mo → lifetime $49/mo lock →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04)
- [Pro — $49/mo → lifetime $149/mo lock →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05)

**Need a turnkey soil report (no plugin required):** [soilcertify.com →](https://soilcertify.com)

**Preliminary Site Scan - SoilCertify**
Quick geotechnical overview with essential soil data and basic risk indicators.
https://buy.stripe.com/fZu00j44C0Jp4Nc3syaMU0f
---

> **Purpose:** A single, broad-audience guide that takes a team from zero to production with the LeafEngines QGIS plugin and SDK — covering install, configuration, day-to-day workflows, and enterprise deployment, with concrete use cases for each role.
> **Audience:** GIS analysts, agronomists / farm advisors, and enterprise IT / integrators
> **Companion docs:** [12 QGIS SDK Deep Dive](12_QGIS_SDK_DEEP_DIVE.md) · [Plugin README](../../plugins/qgis-leafengines/README.md) · [WFS Extension](../../plugins/qgis-leafengines/WFS_EXTENSION.md) · [MCP Specification](../MCP_SERVER_SPECIFICATION.md)

---

## 1. Who This Guide Is For

| Role | What you'll get out of this guide | Jump to |
|------|-----------------------------------|---------|
| 🗺️ **GIS Analyst** | WFS connections, attribute enrichment, VRT export | [§5](#5-use-case-track-a--gis-analyst) |
| 🌾 **Agronomist / Advisor** | Field-level soil, planting calendars, recommendations | [§6](#6-use-case-track-b--agronomist--advisor) |
| 🏢 **Enterprise IT / Integrator** | Deployment, auth, MCP, audit, scaling | [§7](#7-use-case-track-c--enterprise-it--integrator) |

Each track is self-contained — read the section that matches your role, then dip into the others when you need to collaborate.

---

## 2. Architecture at a Glance

```
   ┌──────────────────┐         ┌──────────────────────────┐
   │  QGIS Desktop    │ ──────► │  LeafEngines Plugin      │
   │  (any OS, ≥3.22) │         │  (PyQt5 + Python)        │
   └──────────────────┘         └────────────┬─────────────┘
                                             │
            ┌────────────────────────────────┼────────────────────────────────┐
            ▼                                ▼                                ▼
   ┌──────────────────┐           ┌──────────────────────┐         ┌──────────────────────┐
   │ Local on-device  │           │ LeafEngines Cloud    │         │ Customer WFS / WFS-T │
   │ Gemma + ONNX     │           │ (Edge Functions API) │         │ (PDOK, IGN, NRCS…)   │
   │ — offline AI     │           │ — soil, AI, VRT      │         │ — BYO field data     │
   └──────────────────┘           └──────────────────────┘         └──────────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │  MCP Server (v2.0.2) │
                                  │  Claude / agents     │
                                  └──────────────────────┘
```

Three planes:
1. **Presentation** — QGIS canvas + plugin UI (the "cockpit")
2. **Intelligence** — cloud API + on-device Gemma (the "brain")
3. **Data** — customer WFS layers + LeafEngines enrichment (the "fuel")

---

## 3. Prerequisites & Install

### 3.1 System requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| QGIS | 3.22 LTR | 3.34 LTR |
| Python (bundled with QGIS) | 3.9 | 3.12 |
| RAM | 8 GB | 16 GB+ (for local Gemma) |
| GPU | not required | WebGPU / CUDA / Metal for sub-100 ms local inference |
| Network | required for cloud endpoints | not required for offline AI mode |

### 3.2 Install the plugin

1. Download or clone `plugins/qgis-leafengines/` from this repo (or install from the QGIS Plugin Repository once published).
2. Copy the folder into your QGIS plugins directory:
   - **Linux/macOS:** `~/.local/share/QGIS/QGIS3/profiles/default/python/plugins/`
   - **Windows:** `%APPDATA%\QGIS\QGIS3\profiles\default\python\plugins\`
3. Restart QGIS → **Plugins → Manage and Install Plugins → Installed → enable "LeafEngines"**.
4. The plugin's interactive tour auto-opens on first run; re-open any time via **Plugins → LeafEngines → Interactive Tour…**.

### 3.3 Configure credentials

| Tier | API key required? | How to set |
|------|-------------------|------------|
| **Free** (`get_soil_data`, `county_lookup`, `safe_identification`, `turbo_quant_capabilities`) | ❌ No | Plugin sends `x-free-tier: true` automatically | Test key for the community tier -> leaf-test-370df0a2e62e
| **Starter / Pro / Enterprise** | ✅ Yes | Plugin **⚙ Settings → API Key**, or set `LEAFENGINES_API_KEY` env var |

> 🔓 You can demonstrate value to a stakeholder in 60 seconds with no key — soil + county lookups work straight out of the box.

---

## 4. Core Concepts (Cross-Role)

| Concept | What it means |
|---------|---------------|
| **BYO data** | The plugin enriches *your* layers (cadastre, parcels, fields) — it isn't US-only. Connect any OGC WFS source. |
| **Tiered tools** | Free tools are zero-friction; paid tools (`agricultural-intelligence`, VRT, MCP) require a key. |
| **Attribute round-trip** | API responses are written back into the layer's attribute table as `le_*` columns. |
| **Offline-first** | Gemma 2B/7B runs in-process; no signal required. Sync queue flushes on reconnect. |
| **Equipment round-trip** | Export ISOBUS TASKDATA / ADAPT 1.0 / Shapefile / GeoJSON for tractors and back. |
| **Agent control plane** | The MCP server lets Claude / ChatGPT call the same SDK endpoints the plugin uses. |

---

## 5. Use Case Track A — GIS Analyst

> **Persona:** Sam, a GIS analyst at a regional ag co-op. Already manages cadastral and crop layers in QGIS; needs to add agronomic intelligence without leaving the canvas.

### 5.1 Connect a customer / regional WFS source

1. **Plugins → LeafEngines → WFS Server**
2. Add an endpoint for your region:

| Region | Public WFS Source | Example URL |
|--------|-------------------|-------------|
| 🇳🇱 Netherlands | PDOK BRP crop parcels | `https://service.pdok.nl/rvo/brpgewaspercelen/wfs/v1_0` |
| 🇬🇧 UK | DEFRA MAGIC | `https://environment.data.gov.uk/spatialdata/.../wfs` |
| 🇫🇷 France | IGN RPG | `https://data.geopf.fr/wfs/ows` |
| 🇺🇸 USA | NRCS SDA | `https://sdmdataaccess.nrcs.usda.gov/Spatial/SDMWGS84Geographic.wfs` |

3. **Test Connection → Refresh Feature Types → Add Selected Layers**.

### 5.2 Enrich features with LeafEngines attributes

1. Select polygons → **Plugins → LeafEngines → Open Plugin**.
2. Plugin extracts centroid + admin code (FIPS where available) and calls the appropriate endpoint.
3. Results write back as `le_ph`, `le_om`, `le_risk_score`, `le_recommendation`, etc.
4. Symbolize / filter / export as a normal vector layer.

### 5.3 Export prescriptions

1. With enriched fields selected → **🚜 Export Prescription**.
2. Choose **ISOBUS TASKDATA**, **ADAPT 1.0**, **Shapefile (zoned)**, or **GeoJSON**.
3. Plugin calls `generate-vrt-prescription` + `isobus-task` and saves a USB-ready package.

### 5.4 Analyst checklist

- [ ] Connected at least one non-LeafEngines WFS source
- [ ] Enriched features with `le_*` attributes
- [ ] Symbolized a layer by an enriched attribute
- [ ] Exported a prescription in ISOBUS or ADAPT format
- [ ] Documented the refresh cadence for the team

---

## 6. Use Case Track B — Agronomist / Advisor

> **Persona:** Priya, an independent agronomist serving 40 growers. Wants soil chemistry, planting windows, and crop recommendations without becoming a GIS expert.

### 6.1 Quick soil query (no GIS skills needed)

1. **Plugins → LeafEngines → Soil Query (Map Click)**
2. Click anywhere on the canvas — plugin reverse-geocodes to a county/admin region and pulls pH, OM, texture, CEC.
3. A styled point layer appears on the map with the full soil attribute set.

### 6.2 Plant-location compatibility

1. Open the plugin → **🌱 Soil tab → Crop Compatibility**.
2. Pick a crop from the searchable list; the plugin calls `leafengines-query` and writes a 0-100 score per parcel.
3. Sort the attribute table by score to surface best-fit fields.

### 6.3 Multi-method planting calendar

1. Select one or more parcels → **🌾 Crops → Planting Calendar (Starter+)**.
2. Plugin calls `multi-parameter-planting-calendar` and writes 5-method windows (frost-free, GDD, lunar, soil temp, market timing).
3. Export the table as CSV for grower handouts.

### 6.4 Field recommendations (offline-capable)

1. **⚙ Settings → Local AI → Enable On-Device Mode** (one-time, ~600 MB Gemma download).
2. Select a parcel → **🌾 Crops → Generate Recommendation (Local)**.
3. A narrative recommendation writes into the attribute table — works on a field laptop with no signal.

### 6.5 Agronomist checklist

- [ ] Performed a map-click soil query without configuring anything
- [ ] Generated a crop compatibility score for a real parcel
- [ ] Produced a planting calendar your grower can act on
- [ ] Ran a local Gemma recommendation with Wi-Fi disabled
- [ ] Exported a CSV / PDF handout for a grower visit

---

## 7. Use Case Track C — Enterprise IT / Integrator

> **Persona:** Marcus, IT lead at a 1,200-seat ag-services firm. Needs centralized deployment, SSO-aligned key management, audit, and AI-agent automation.

### 7.1 Deployment model

| Model | When to use | How |
|-------|-------------|-----|
| **User-installed** | < 25 seats, mixed BYOD | Standard plugin install per workstation |
| **Profile-pushed** | 25–250 seats, managed Windows | Deploy plugin folder via GPO / MDM into shared QGIS profile |
| **Container / VDI** | 250+ seats or regulated env | Bundle plugin into a QGIS container image; mount per-user secrets |
| **Air-gapped** | EU privacy / defense | Pre-stage Gemma model + offline cache; disable cloud endpoints in Settings |

### 7.2 Key management

- **Storage:** API keys are SHA-256 hashed (`SS_API_{prefix}_2025`); the plugin reads from env (`LEAFENGINES_API_KEY`) or QGIS Settings. Test key for the community tier -> leaf-test-370df0a2e62e
- **Distribution:** Use your existing secret manager (HashiCorp Vault, AWS Secrets Manager, 1Password) to inject into a per-user env var on QGIS launch — never check keys into shared profiles.
- **Tier mapping:**
  - `ak_sandbox_*` — QA / smoke tests
  - `ak_starter_*` / `ak_pro_*` — production analysts
  - `ak_enterprise_*` — integrations and service accounts (bypass `subscribers` table via `public.api_keys` service_role)
- **Rotation:** Trigger via the `rotate-encryption-keys` Edge Function quarterly or on offboarding.

### 7.3 Network & compliance

| Concern | Default | Lever |
|---------|---------|-------|
| Egress | HTTPS to `*.soilsidekickpro.com` and `*.lovable.app` | Allowlist in firewall; pin to `app.soilsidekickpro.com` for authenticated routes |
| Data residency | EU customers can run fully offline (Gemma + cached WFS) | Disable cloud endpoints in Settings → Local AI |
| Audit | All MCP + API calls land in `client_telemetry_events` | Filter by `surface`, `client_version`, `api_key_prefix` |
| RLS | All Edge Function PII uses V3 AES-256 encryption | Mandatory `search_path = ''` on SECURITY DEFINER functions |

### 7.4 MCP — let agents drive QGIS

1. Install the MCP server (v2.0.2) in your agent host — see [MCP Specification](../MCP_SERVER_SPECIFICATION.md).
2. Provision a service-account API key (Pro+ for write tools). Test key for the community tier -> leaf-test-370df0a2e62e
3. Available tools include `get_soil_data`, `county_lookup`, `query_plant_location`, `get_planting_calendar`, `generate_vrt_prescription`, `safe_identification`, `turbo_quant_capabilities`, and 3 more.
4. Example agent prompt:

> *"For every parcel in `brp_2025_selected`, pull soil pH and recommend a cover crop. Flag parcels within 100 m of surface water. Push results back as attributes."*

5. Telemetry: filter `client_telemetry_events` by `surface='mcp'` and `client_version='2.0.2'` to verify adoption.

### 7.5 Observability

- **Telemetry Dashboard** (`/telemetry-dashboard`) — surface, version, latency, error rate
- **API Usage Analytics** (`/api-usage`) — per-endpoint volume and p95
- **API Error Triage** (`/api-error-triage`) — functional and transient errors with admin queue
- **Endpoint Activity Digest** — 6-hour rollup email per channel/endpoint

### 7.6 IT checklist

- [ ] Chosen a deployment model and documented it
- [ ] Wired API keys through your secret manager (no checked-in keys)
- [ ] Allowlisted required egress domains
- [ ] Enabled offline mode for any privacy-sensitive cohort
- [ ] Connected the MCP server to your agent platform (if applicable)
- [ ] Verified telemetry shows `surface='mcp'` events for v2.0.2 clients
- [ ] Documented rotation and offboarding procedure

---

## 8. End-to-End Implementation Roadmap

| Phase | Duration | Outcome | Owner |
|-------|----------|---------|-------|
| **0 — Pilot** | Week 1 | Plugin installed on 3 workstations, free-tier soil queries proven | GIS Analyst |
| **1 — Workflow proof** | Weeks 2–3 | One full WFS → enrichment → VRT export round-trip per region | Analyst + Agronomist |
| **2 — Procurement** | Week 4 | Starter/Pro keys provisioned via secret manager | IT |
| **3 — Rollout** | Weeks 5–8 | Plugin pushed to all seats; agronomists trained on map-click + planting calendar | IT + Agronomy lead |
| **4 — Offline hardening** | Weeks 9–10 | Gemma pre-staged on field laptops; offline sync verified | IT |
| **5 — Agent automation** | Weeks 11–12 | MCP server wired to internal Claude/agent host; first autonomous workflow live | Integrator |
| **6 — Steady state** | Ongoing | Telemetry dashboards, quarterly key rotation, version-adoption tracking | IT + Ops |

---

## 9. Tier Cheat Sheet

| Capability | Free | Starter | Pro | Enterprise |
|------------|:---:|:---:|:---:|:---:|
| WFS read (BYO data) | ✅ | ✅ | ✅ | ✅ |
| Soil + county lookup | ✅ | ✅ | ✅ | ✅ |
| Safe identification (photo) | ✅ | ✅ | ✅ | ✅ |
| FarmIQ intelligence | — | ✅ | ✅ | ✅ |
| Multi-method planting calendar | — | ✅ | ✅ | ✅ |
| Local Gemma 2B | ✅ | ✅ | ✅ | ✅ |
| Local Gemma 7B + TurboQuant | — | — | ✅ | ✅ |
| VRT / ISOBUS / ADAPT export | — | — | ✅ | ✅ |
| MCP agent tools | — | — | ✅ | ✅ |
| WFS-T transactional writes (SDK v3.0) | — | — | — | ✅ |
| Service-account / `ak_enterprise_*` keys | — | — | — | ✅ |

---

## 10. Troubleshooting Quick Reference

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| "Connection refused" on cloud call | Firewall blocks `*.soilsidekickpro.com` | Allowlist domain; retry |
| 401 / 403 on a paid endpoint | Missing or wrong key | Re-set in plugin Settings or env var |
| WFS layer empty | Wrong typename or bbox | Use QGIS Browser to inspect typenames first |
| Local Gemma slow (>10 s) | CPU-only fallback | Enable WebGPU/CUDA; check **TurboQuant Status** panel |
| `le_*` attributes missing after refresh | Layer is read-only WFS | Save a local copy (GeoPackage) before enrichment |
| MCP tool returns "tier required" | Free key calling Pro tool | Upgrade key or switch tool |

Curl smoke test (works without a key):

```bash
curl -X POST https://leafengines-emergency-api-1.onrender.com/v1/soil/analyze \
  -H "x-free-tier: true" \
  -H "Content-Type: application/json" \
  -d '{"county_fips":"01001"}'
```

---

## 💰 Pricing

### Free Tier — No Credit Card
- **Test key:** `leaf-test-370df0a2e62e`
- **Free header:** `x-free-tier: true`
- **Includes:** Basic soil analysis, county lookup, TurboQuant check, WFS read (BYO data)
- **Try it:** [soilcertify.com →](https://soilcertify.com)

### Pay-As-You-Go

| Tier | Price | Per-Call Rate | What You Get | Buy |
|------|-------|--------------|--------------|-----|
| Commoditized | $0.50/bundle | $0.001/call | Basic soil/weather, county lookup | [Buy →](https://buy.stripe.com/bJe3cvfNk77N5RgfbgaMU0e) |
| Enhanced | $1.50/bundle | $0.003/call | Environmental impact, crop suitability, water quality | [Buy →](https://buy.stripe.com/cNi9AT1Wu0Jp93s8MSaMU0c) |
| Proprietary | $5.00/bundle | $0.010/call | Planting optimization, carbon credits, VRT prescriptions | [Buy →](https://buy.stripe.com/28EeVd9oWeAf2F48MSaMU0d) |
| Exclusive | $10.00/bundle | $0.020/call | Patent-pending env compatibility scoring | [Buy →](https://buy.stripe.com/6oU4gzbx40Jp6Vk1kqaMU0a) |

### Monthly Subscriptions

| Plan | Price | Included Calls | Best For | Subscribe |
|------|-------|---------------|----------|-----------|
| **Founder Starter** | $10/mo → lifetime $49/mo | 10,000/mo | Solo GIS analysts | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| **Founder Pro** | $49/mo → lifetime $149/mo | 35,000/mo | Production teams | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Starter | $149/mo | 10,000/mo | Solo GIS analysts | [Subscribe →](https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04) |
| Pro | $499/mo | 35,000/mo | Agronomy + GIS teams, VRT export | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |
| Enterprise | $1,999/mo | 175,000+/mo | White-label, SLA, OEM, ADAPT | [Subscribe →](https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05) |

> ⏰ **Founder pricing expires June 1, 2026.** First 100 customers lock lifetime rates.

**Enterprise Bundle** (SoilSidekick Pro + LeafEngines MCP) — $3,499/mo, 685,000 included calls/mo. Contact: sales@leafengines.com or partnerships@leafengines.com

---

## 11. Next Steps

- **Deeper plugin walkthrough:** [12 QGIS SDK Deep Dive](12_QGIS_SDK_DEEP_DIVE.md)
- **Equipment formats:** [05 VRT Prescriptions](05_VRT_PRESCRIPTIONS.md) · [09 API & Equipment Integration](09_API_EQUIPMENT_INTEGRATION.md)
- **Offline AI internals:** [06 Offline AI](06_OFFLINE_AI.md)
- **Agent integration:** [AGENT_INTEGRATION_GUIDE](../AGENT_INTEGRATION_GUIDE.md) · [MCP Specification](../MCP_SERVER_SPECIFICATION.md)
- **Plugin source:** [`plugins/qgis-leafengines/`](../../plugins/qgis-leafengines/README.md)
- **Support:** developers@leafengines.com

---

🌱 **LeafEngines™** | SoilSidekick Pro® | SoilCertify | SoilTech Suite, Inc.
*Space gives the picture. We give the truth.*
