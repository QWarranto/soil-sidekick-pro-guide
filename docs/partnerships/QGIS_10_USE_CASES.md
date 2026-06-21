# LeafEngines™ + QGIS — 10 Use Cases by Tier

**Audience:** GIS analysts, agronomists, precision-ag consultants, enterprise GIS teams, public-sector mappers
**Repository target:** `docs/partnerships/` companion to the [QGIS Implementation Guide](../workflows/13_QGIS_IMPLEMENTATION_GUIDE.md) and [QGIS SDK Deep Dive](../workflows/12_QGIS_SDK_DEEP_DIVE.md)
**Last updated:** 2026-05-01

10 production-ready QGIS workflows with measurable ROI for environmental, agricultural, and land-management intelligence. Every use case works **today** using the open-source **LeafEngines QGIS Plugin** (PyQt5) plus standard QGIS tooling — Processing Toolbox, WFS/WFS-T, Field Calculator, Print Layouts, and the QGIS Python console. Get a free sandbox key at [`soilsidekickpro.com/podcast`](https://soilsidekickpro.com/podcast) and start mapping in under 10 minutes.

| Tier | Endpoints | Use Cases | Combined Annual ROI |
|------|-----------|-----------|---------------------|
| Free ($0) | 2 | 2 | $10K–$22K |
| Starter ($149/mo) | 10 | 3 | $35K–$90K |
| Pro ($499/mo) | 17 | 3 | $80K–$220K |
| Enterprise ($1,500/mo) | 20 | 2 | $300K–$1.5M |

**Related:** [`NODE_RED_10_USE_CASES.md`](./NODE_RED_10_USE_CASES.md) · [`N8N_10_USE_CASES.md`](./N8N_10_USE_CASES.md) · [`LEAFENGINES_MCP_10_USE_CASES.md`](./LEAFENGINES_MCP_10_USE_CASES.md) · [`LEAFENGINES_WHITE_PAPER_DATA_INTEGRITY_AT_THE_EDGE.md`](./LEAFENGINES_WHITE_PAPER_DATA_INTEGRITY_AT_THE_EDGE.md)

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

## FREE TIER — $0/month — 2 Endpoints, 1,000 req/day

### 1. County-Level Soil Atlas for Extension Offices

**Target Audience:** USDA county extension agents, Master Gardener programs, conservation districts

**Problem:** Extension offices field hundreds of "what's my soil like?" calls per season. Pulling the underlying SSURGO mosaics, clipping to county boundaries, and styling layers manually consumes 1–2 days of GIS staff time per county.

**QGIS Workflow:**
- **LeafEngines Plugin** → "County Lookup" tool, click any U.S. county on the canvas → resolves FIPS code
- **LeafEngines Plugin** → "Get Soil Data" → returns pH, N-P-K, organic matter, texture as a styled vector layer
- **Processing Toolbox** → Buffer/Dissolve to produce sub-county management zones
- **Print Layout** → auto-generated 11×17 atlas page with legend, scale bar, and methodology footer
- **Atlas Generator** → iterate over all counties in a region to publish a multi-page PDF atlas

**LeafEngines Endpoints:** `county-lookup`, `get-soil-data`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| GIS staff hours saved | 12–16 hrs/county @ $55/hr = $660–$880/county |
| Counties mapped per season | 8–15 |
| Annual labor savings | $5,300–$13,200 |
| Walk-in / call-in deflection (self-serve atlas) | ~200 hrs/yr saved across staff = $5,000–$8,000 |
| **Total Annual Savings** | **$10,300–$21,200** |
| API Cost | $0 |
| ROI | Infinite (free tier) |

---

### 2. Pre-Acquisition Land Suitability Heatmap

**Target Audience:** Conservation land trusts, rural realtors, smallholder farm cooperatives

**Problem:** Land trusts evaluate dozens of candidate parcels per quarter. Each parcel typically requires a $300–$800 desktop assessment before a site visit, and most candidates are screened out anyway.

**QGIS Workflow:**
- Load candidate parcels (Shapefile, GeoPackage, or WFS feed from county GIS)
- **LeafEngines Plugin** → "Batch County Lookup" against parcel centroids
- **LeafEngines Plugin** → "Get Soil Data" with a Python loop in the QGIS console (≤1,000 req/day)
- **Field Calculator** → composite suitability score (pH band + drainage + organic matter + slope from DEM)
- **Symbology** → graduated color ramp (red = unsuitable, green = high-priority)
- **Print Layout** → quarterly board-meeting-ready map deck

**LeafEngines Endpoints:** `county-lookup`, `get-soil-data`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Desktop assessments avoided | 30–50/yr × $400 = $12,000–$20,000/yr |
| Site visits avoided (failed pre-screen) | 8–15/yr × $250 fuel/time = $2,000–$3,750 |
| Faster acquisition decisions | 2–3 weeks shorter cycle time |
| **Total Annual Savings** | **$14,000–$23,750** |
| API Cost | $0 |
| ROI | Infinite (free tier) |

---

## STARTER TIER — $149/month — 10 Endpoints, 10K req/month

### 3. Municipal Water-Quality Monitoring Map

**Target Audience:** City stormwater departments, watershed councils, environmental nonprofits

**Problem:** Stormwater compliance reports require quarterly water-quality summaries across dozens of monitoring stations. GIS techs spend a week each quarter joining lab CSVs to point layers and producing maps.

**QGIS Workflow:**
- Load monitoring station point layer (lat/lon)
- **LeafEngines Plugin** → "Water Quality" tool batches all stations
- **Joins** → attach pH, turbidity, conductivity, nitrate to each point
- **Heatmap (kernel density)** → render contamination hotspots
- **Time Manager plugin** → animate quarterly trends
- **Print Layout** → standardized MS4 compliance report template

**LeafEngines Endpoints:** `water-quality`, `county-lookup`, `get-soil-data`, `sensor-data-quality`, `smart-report-summary`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Quarterly report prep | 40 hrs → 8 hrs × 4 quarters = 128 hrs/yr saved |
| Labor savings @ $60/hr | $7,680/yr |
| Lab cost reduction (targeted re-sampling only) | $4,000–$8,000/yr |
| Avoided NPDES non-compliance fine risk | $5,000–$25,000 risk reduction |
| **Total Annual Savings** | **$16,680–$40,680** |
| API Cost | $1,788/yr |
| Net ROI | 9×–22× |

---

### 4. Seasonal Planting Calendar Atlas for Co-ops

**Target Audience:** Regional grower co-ops, seed dealers, USDA NRCS partner organizations

**Problem:** Co-ops produce printed planting guides each spring. Compiling crop windows, frost dates, and amendment recommendations across 30–50 counties takes 3–4 weeks of agronomist + GIS time.

**QGIS Workflow:**
- Define service area (counties / ZIP polygons)
- **LeafEngines Plugin** → "Multi-Parameter Planting Calendar" → returns crop window vectors per county
- **LeafEngines Plugin** → "Seasonal Planning" + "Dynamic Care" enrich attributes
- **Categorized symbology** → color-code by recommended cash-crop window
- **Atlas Generator** → one page per county, branded for the co-op
- Export 60–80 page PDF for distribution

**LeafEngines Endpoints:** `multi-parameter-planting-calendar`, `seasonal-planning`, `dynamic-care`, `beginner-guidance`, `safe-identification`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Production time | 120 hrs → 24 hrs = 96 hrs saved @ $65/hr = $6,240 |
| Member yield uplift (timely planting) | 4–7% on covered acreage = $25,000–$60,000 across membership |
| Print run reduction (digital-first) | $2,000–$4,000 |
| **Total Annual Value** | **$33,240–$70,240** |
| API Cost | $1,788/yr |
| Net ROI | 18×–39× |

---

### 5. Beginner-Friendly Garden Plan Cards for Retail Nurseries

**Target Audience:** Garden center chains, plant retailers, e-commerce horticulture brands

**Problem:** In-store kiosks and online plant pages need location-specific care advice. Without a GIS-backed system, advice is generic and conversion suffers.

**QGIS Workflow:**
- Build a master nursery service-area polygon (delivery radius)
- **LeafEngines Plugin** → enrich each ZIP centroid with `dynamic-care` + `beginner-guidance`
- **GeoPackage export** → ship cached attributes to in-store kiosk app
- **WFS publish** (via QGIS Server) → e-commerce site queries by buyer ZIP
- **Print Layout** → "What grows here?" shelf-talker generator

**LeafEngines Endpoints:** `beginner-guidance`, `dynamic-care`, `safe-identification`, `seasonal-planning`, `smart-report-summary`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Conversion lift on plant-detail pages | 6–12% → $8,000–$18,000/yr per location |
| Plant return reduction | 15–25% fewer returns = $3,000–$8,000/yr |
| Staff training time reduction | 30 hrs/yr × $20 = $600 |
| **Total Annual Value** | **$11,600–$26,600/location** |
| API Cost | $1,788/yr |
| Net ROI | 6×–14× per location |

---

## PRO TIER — $499/month — 17 Endpoints, 50K req/month

### 6. Variable-Rate Fertilizer Prescription (VRT) Workshop

**Target Audience:** Precision-ag consultants, custom applicators, mid-size row-crop farms

**Problem:** Generating a VRT prescription per field today requires juggling agronomy software, ESRI shapefiles, and equipment-specific exporters. Per-field cost is $15–$40 in consultant time alone.

**QGIS Workflow:**
- Load field boundary (Shapefile / WFS from FieldView, John Deere Ops Center, etc.)
- **LeafEngines Plugin** → "Generate VRT Prescription" returns a styled raster + zone polygons
- **Processing Toolbox** → smooth zones with focal mean, snap to equipment swath width
- **Export** → ISO-XML (via `isobus-task`), Shapefile, or GeoTIFF for monitor upload
- **Print Layout** → operator-ready map for cab tablet

**LeafEngines Endpoints:** `generate-vrt-prescription`, `agricultural-intelligence`, `isobus-task`, `live-agricultural-data`, `carbon-credit-calculator`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Prescriptions generated per consultant | 80–150/season |
| Time per prescription | 45 min → 8 min = 50–100 hrs saved @ $90/hr = $4,500–$9,000 |
| Fertilizer input savings (passed to grower) | 12–18% on N applied = $25,000–$70,000 across book of business |
| Avoided 3rd-party VRT software license | $2,400–$6,000/yr |
| **Total Annual Value** | **$31,900–$85,000** |
| API Cost | $5,988/yr |
| Net ROI | 5×–14× |

---

### 7. Carbon Credit Field Inventory & MRV Map

**Target Audience:** Carbon program aggregators, regenerative-ag verification bodies, ESG consultants

**Problem:** Monitoring, Reporting & Verification (MRV) for soil-carbon programs requires per-field baseline maps and annual delta maps. Manual prep is expensive and audit-fragile.

**QGIS Workflow:**
- Import enrolled-field WFS feed
- **LeafEngines Plugin** → "Carbon Credit Calculator" returns baseline t-CO₂e/ha as polygon attribute
- **LeafEngines Plugin** → "Environmental Impact Engine" attaches uncertainty bounds
- **Year-over-year join** → compute delta layer with QGIS Field Calculator
- **Print Layout** → audit-ready report (map + table + provenance footer including data quality envelope)

**LeafEngines Endpoints:** `carbon-credit-calculator`, `environmental-impact-engine`, `agricultural-intelligence`, `generate-vrt-prescription`, `plant-id-comparison`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Per-field MRV prep | 6 hrs → 1.2 hrs = 4.8 hrs × 200 fields = 960 hrs/yr saved @ $85/hr = $81,600 |
| Audit pass rate improvement | +12 percentage points → fewer re-verifications |
| Verification cost reduction | $40–$120/field × 200 = $8,000–$24,000/yr |
| Net new credit issuance | 3–7% uplift = high five-figure to low six-figure revenue |
| **Total Annual Value** | **$95,000–$170,000** |
| API Cost | $5,988/yr |
| Net ROI | 16×–28× |

---

### 8. Rapid Agronomic Damage Assessment (Hail / Drought / Flood)

**Target Audience:** Crop insurance adjusters, USDA RMA contractors, farm risk advisors

**Problem:** After a damaging weather event, adjusters need defensible field-level damage maps within 72 hours. Today this involves windshield surveys plus multiple proprietary platforms.

**QGIS Workflow:**
- Load affected polygon (storm path, drought designation, FEMA flood layer)
- **LeafEngines Plugin** → "Live Agricultural Data" + "Agricultural Intelligence" enrich each field
- **LeafEngines Plugin** → "Plant ID Comparison" against the cropping system on file
- **Heatmap symbology** → severity gradient
- **Print Layout** → adjuster's field packet (one page per field, with QR code linking back to attribute table)

**LeafEngines Endpoints:** `agricultural-intelligence`, `live-agricultural-data`, `plant-id-comparison`, `environmental-impact-engine`, `generate-vrt-prescription`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Adjuster productivity | 6 fields/day → 14 fields/day = 2.3× throughput |
| Surge cost per event avoided | $15,000–$45,000 in overtime / contractor surge |
| Litigation risk reduction (defensible methodology) | $5,000–$25,000/event |
| **Total Annual Value (3–5 events)** | **$60,000–$350,000** |
| API Cost | $5,988/yr |
| Net ROI | 10×–58× |

---

## ENTERPRISE TIER — $1,500/month — 20 Endpoints, Unlimited

### 9. National-Scale Crop Visual Analytics Platform

**Target Audience:** Ag input manufacturers, commodity traders, government statistical agencies

**Problem:** Building an in-house national crop health and visual analytics product requires teams of remote-sensing specialists and a multi-million-dollar imagery budget.

**QGIS Workflow:**
- Tiled WFS coverage of the contiguous U.S. (or any country)
- **LeafEngines Plugin** → "Visual Crop Analysis" against drone / satellite tile catalog
- **LeafEngines Plugin** → "GPT-5 Chat" for narrative summarization at the state / district level
- **LeafEngines Plugin** → "Geo Consumption Analytics" for aggregated demand signals
- **QGIS Server** → publish as WMS/WMTS to internal BI tools (Tableau, Power BI)
- **Print Layout** → quarterly market intelligence report, board-ready

**LeafEngines Endpoints:** `visual-crop-analysis`, `gpt5-chat`, `geo-consumption-analytics`, `agricultural-intelligence`, `live-agricultural-data`, `carbon-credit-calculator`, `generate-vrt-prescription`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Replaced in-house remote-sensing build | $400,000–$1,200,000/yr (3–6 FTE + imagery licenses) |
| Trading desk edge (early-season yield signal) | High six- to low seven-figure P&L |
| Time-to-insight | Weeks → hours |
| **Total Annual Value** | **$500,000–$2,000,000+** |
| API Cost | $18,000/yr |
| Net ROI | 27×–110×+ |

---

### 10. ISOBUS / OEM Fleet Operations Command Center

**Target Audience:** OEM dealers, large-fleet operators (>50 machines), custom-application service providers

**Problem:** Coordinating mixed-fleet (John Deere, CNH, AGCO, Kubota) prescription deployment, in-cab guidance, and post-application reporting requires brittle middleware and per-machine handholding.

**QGIS Workflow:**
- Live machine telemetry ingested via PostGIS (from `live-agricultural-data` & MQTT)
- **LeafEngines Plugin** → "ISOBUS Task" generates ISO-XML task files per machine assignment
- **LeafEngines Plugin** → "Generate VRT Prescription" + "Agricultural Intelligence" feed into task setup
- **WFS-T** → machines write back as-applied data to PostGIS
- **Time Manager** → replay daily fleet activity
- **Print Layout** → daily ops dashboard for fleet manager

**LeafEngines Endpoints:** `isobus-task`, `generate-vrt-prescription`, `agricultural-intelligence`, `live-agricultural-data`, `visual-crop-analysis`, `gpt5-chat`, `carbon-credit-calculator`, `environmental-impact-engine`

**Measurable Cost/Benefit**

| Metric | Value |
|--------|-------|
| Machine utilization uplift | 8–14% across 50+ machines = $200,000–$700,000/yr |
| Mis-application rework eliminated | $30,000–$90,000/yr in reapplied product |
| Fleet manager labor recovered | 15 hrs/wk × $90 = $70,000/yr |
| Customer retention (precision service quality) | $50,000–$250,000/yr renewal lift |
| **Total Annual Value** | **$350,000–$1,100,000** |
| API Cost | $18,000/yr |
| Net ROI | 19×–60× |

---

## How to Get Started

1. **Install QGIS 3.22+** (LTR recommended) — [qgis.org/download](https://qgis.org/download/)
2. **Install the LeafEngines plugin** — see [`plugins/qgis-leafengines/README.md`](../../plugins/qgis-leafengines/README.md)
3. **Get a free sandbox API key** — [`soilsidekickpro.com/podcast`](https://soilsidekickpro.com/podcast)
4. **Pick a use case above** that matches your tier and start with the included sample project
5. **Scale up** when ready — Starter, Pro, and Enterprise plans unlock the full 20-endpoint surface

**Need help?** Reference the [QGIS Implementation Guide](../workflows/13_QGIS_IMPLEMENTATION_GUIDE.md) for end-to-end walkthroughs, or the [QGIS SDK Deep Dive](../workflows/12_QGIS_SDK_DEEP_DIVE.md) for Python scripting patterns.

---

© 2026 SoilSidekick Pro™ / LeafEngines™. All rights reserved.
U.S. Patent Applications #19/320,727 & #19/544,827

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
| **United States** | $49/mo | $149/mo | Card, Apple Pay, Google Pay, Affirm |
| **European Union** | €45/mo (VAT incl.) | €135/mo (VAT incl.) | Klarna, iDEAL, EPS, Apple/Google Pay |
| **United Kingdom** | £38/mo (VAT incl.) | £115/mo (VAT incl.) | Afterpay/Clearpay, Apple/Google Pay |
| **Australia** | AU$75/mo (GST incl.) | AU$225/mo (GST incl.) | Afterpay, Apple/Google Pay |

---

🌱 **LeafEngines™** | SoilSidekick Pro® | SoilCertify | SoilTech Suite, Inc.
*Space gives the picture. We give the truth.*
