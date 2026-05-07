# Node-RED × LeafEngines SDK — 10 Use Cases by Tier

**Audience:** Node-RED flow developers, IoT integrators, industrial automation engineers
**Repository target:** `docs/partnerships/` companion to `NODE_RED_DEEP_DIVE.md`
**Last updated:** 2026-04-30

Concrete Node-RED flow examples for each LeafEngines API tier, demonstrating how environmental intelligence can be wired into automated workflows with quantifiable ROI.

## Endpoint Reference

| Tier | Endpoints |
|------|-----------|
| **Free (2)** | `get-soil-data`, `county-lookup` |
| **Starter (+8)** | `territorial-water-quality`, `territorial-water-analytics`, `multi-parameter-planting-calendar`, `live-agricultural-data`, `environmental-impact-engine`, `safe-identification`, `dynamic-care`, `beginner-guidance` |
| **Pro (+7)** | `alpha-earth-environmental-enhancement`, `agricultural-intelligence`, `seasonal-planning-assistant`, `smart-report-summary`, `carbon-credit-calculator`, `generate-vrt-prescription`, `leafengines-query` |
| **Enterprise (+3)** | `visual-crop-analysis`, `gpt5-chat`, `geo-consumption-analytics` |

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

## Free Tier — $0/month

**Endpoints:** `get-soil-data`, `county-lookup` | 1,000 calls/day

### Use Case 1: Automated Soil Health Dashboard for Community Gardens

**Flow:** `inject` (cron 6 AM) → `county-lookup` (ZIP → FIPS) → `get-soil-data` → `function` (extract pH, organic matter, nutrients) → InfluxDB/Grafana dashboard + Slack alert if pH < 5.5 or > 8.0

**Who:** Urban agriculture nonprofits, Master Gardener programs, school garden coordinators.

**Cost/Benefit:** Replaces $400–$600/year in manual soil lab tests per site. A 10-garden network saves $4,000–$6,000/yr with daily monitoring instead of quarterly snapshots. Alert-driven amendments prevent ~15% crop loss (~$1,200/season per community garden).

---

### Use Case 2: Real Estate Parcel Soil Pre-Screening Bot

**Flow:** `HTTP-in` (webhook from CRM) → `county-lookup` (address → FIPS) → `get-soil-data` → `function` (score buildability: drainage, shrink-swell, bearing capacity) → `HTTP-response` (JSON scorecard) + `email` (PDF to buyer's agent)

**Who:** Rural land brokers, homestead agents, land investment funds.

**Cost/Benefit:** Geotechnical pre-assessments cost $1,500–$3,000 each. Automated pre-screening eliminates ~60% of unnecessary site visits, saving a 50-parcel/month brokerage $18,000–$36,000/yr. Reduces avg days-to-close by 4 days per transaction.

---

## Starter Tier — $149/month

Adds: water quality, planting calendar, live NOAA/USDA data, environmental impact, `safe-identification`, `dynamic-care`, `beginner-guidance`

### Use Case 3: Municipal Drinking Water Early-Warning System

**Flow:** `inject` (every 4 hrs) → `territorial-water-quality` (FIPS) → `function` (threshold: nitrate > 5 mg/L, turbidity > 1 NTU, lead > 10 ppb) → `switch` → [alert] `email` + SMS (Twilio) to operators → [log] PostgreSQL for compliance

**Who:** Small municipal water utilities (<10,000 population).

Also wires `territorial-water-analytics` weekly for trend reports to the county board.

**Cost/Benefit:** Replaces $8,000–$15,000/yr in contracted lab sampling. Early nitrate detection avoids a single EPA violation fine of $25,000–$50,000. **Annual net savings: $30,000+** including avoided boil-water advisory costs.

---

### Use Case 4: Precision Planting Calendar with Weather Integration

**Flow:** `inject` (weekly, Feb–May) → `live-agricultural-data` (NOAA frost dates, soil temp) → `multi-parameter-planting-calendar` (crop list + FIPS) → `function` (merge into per-field schedule) → Google Sheets node (shared calendar) + push notification to farm crew

**Who:** Mid-size row crop operations, cooperative agronomists.

**Cost/Benefit:** Optimized planting windows increase germination 12–18%, adding $45–$80/acre in yield. A 500-acre operation gains **$22,500–$40,000/season**. Eliminates $2,500/yr in agronomist consultation for timing decisions.

---

### Use Case 5: Garden Center Plant Care Kiosk

**Flow:** `HTTP-in` (QR scan on plant tag) → `safe-identification` (verify species, flag toxic lookalikes) → `dynamic-care` (localized care for store's county) → `beginner-guidance` (plain-language care card) → `template` (HTML) → `HTTP-response` (kiosk display or email)

**Who:** Independent garden centers, nursery chains, big-box garden departments.

**Cost/Benefit:** Reduces plant return rates by 25–35% (industry avg: 15%). For 50,000 plants/yr at $12 avg: **$22,500–$31,500 in avoided losses**. 18% satisfaction increase drives 12% repeat purchase lift (~$36,000/yr for a mid-size retailer).

---

## Pro Tier — $499/month

Adds: satellite data, AI crop analysis, seasonal planning, report summaries, carbon credits, VRT prescriptions, LeafEngines query

### Use Case 6: Automated Carbon Credit Portfolio Manager

**Flow:** `inject` (monthly) → [fan-out] `carbon-credit-calculator` (per field) → `function` (aggregate credits) → `smart-report-summary` (AI narrative) → PDF generation → email to farm CFO + Airtable audit trail

**Who:** Regenerative agriculture operations, carbon aggregators, ESG-focused farm funds.

Companion: `alpha-earth-environmental-enhancement` quarterly validates soil organic matter trends via satellite NDVI.

**Cost/Benefit:** Carbon credits at $15–$30/ton. A 2,000-acre operation generating 1.2 tons/acre earns **$36,000–$72,000/yr**. Automated tracking replaces $8,000–$12,000/yr in verification consultants. Net new revenue after $5,988/yr API cost: **$28,000–$60,000/yr**.

---

### Use Case 7: VRT Prescription Auto-Generator

**Flow:** `inject` (pre-season) → `get-soil-data` (per zone) → `agricultural-intelligence` (AI nutrient analysis) → `generate-vrt-prescription` (zone rates) → `function` (ISOBUS shapefile) → FTP (John Deere Ops Center or Climate FieldView)

**Who:** Precision ag service providers, large-scale row crop operations.

**Cost/Benefit:** VRT reduces fertilizer over-application by 15–25%, saving $18–$35/acre on 1,000 acres ($18,000–$35,000/yr). Yield optimization adds $30–$50/acre. **Total value: $48,000–$85,000/yr** vs. $5,988/yr API cost. **ROI: 700–1,300%.**

---

### Use Case 8: AI Seasonal Planning Autopilot

**Flow:** `inject` (bi-weekly) → `leafengines-query` (compatibility scores) → `seasonal-planning-assistant` (AI + weather) → `environmental-impact-engine` (runoff risk) → `switch` → [approve] update farm DB + notify crew → [flag] alert agronomist

**Who:** Diversified farms, organic operations with complex rotations.

**Cost/Benefit:** Reduces crop failure by 20–30%. For an 800-acre farm ($1,200/acre gross), avoiding a single 50-acre failure saves $60,000. Environmental compliance avoids $10,000–$25,000 in EPA fines. **Annual value: $70,000–$85,000.**

---

## Enterprise Tier — $1,999/month

Adds: `visual-crop-analysis`, `gpt5-chat`, `geo-consumption-analytics` | Full 20-endpoint access

### Use Case 9: Drone Fleet Crop Health Command Center

**Flow:** `MQTT-in` (drone images) → `visual-crop-analysis` (AI disease detection) → `agricultural-intelligence` (cross-ref soil + weather) → `gpt5-chat` (natural-language field report) → `smart-report-summary` (exec summary) → [parallel] dashboard WebSocket + email + Salesforce case

**Who:** Ag service providers, cooperative scouting programs, crop insurance adjusters.

Companion: `geo-consumption-analytics` tracks field-level API consumption for capacity planning.

**Cost/Benefit:** Early detection (2–5 days faster) reduces crop loss by 8–15%. For a 5,000-acre provider managing $6M crop value: **$480,000–$900,000 preserved yield**. Replaces 2 FTE scouts ($120,000/yr). Net value after $24,000/yr API cost: **$576,000–$996,000/yr**.

---

### Use Case 10: Multi-Tenant AgTech SaaS Platform Backend

**Flow:** `HTTP-in` (tenant gateway) → `function` (auth + tier routing) → [subflows]: soil, water, calendar, vision, AI chat → `function` (usage metering) → `geo-consumption-analytics` (geographic patterns) → `HTTP-response` (branded JSON) + PostgreSQL (billing)

**Who:** AgTech startups, farm management SaaS companies, agricultural data resellers.

**Cost/Benefit:** Building in-house: 4–6 engineers × 12 months ($800K–$1.2M) + $200K/yr data licensing. LeafEngines Enterprise at $24K/yr = **2–3% of build cost**. Reselling at $50/user/month to 500 users generates **$300K ARR on $24K infrastructure — 12.5× margin**.

---

**Related:** [`NODE_RED_DEEP_DIVE.md`](./NODE_RED_DEEP_DIVE.md) · [`N8N_10_USE_CASES.md`](./N8N_10_USE_CASES.md) · [`LEAFENGINES_MCP_10_USE_CASES.md`](./LEAFENGINES_MCP_10_USE_CASES.md)

LeafEngines Node-RED Integration Guide | April 2026 | [soilsidekickpro.com](https://soilsidekickpro.com)
Questions? `support@soilsidekickpro.com` · Node-RED module: `node-red-contrib-leafengines`

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
