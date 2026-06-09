# LeafEngines MCP Server — 4 ROI-Maximizing Use Cases

**Audience:** Agencies, AgTech operators, hedge desks, OEM integrators evaluating API-call bundle purchases
**MCP Endpoint:** `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`
**Pay-as-you-go bundles referenced below:**

| Bundle | Per-call | Tools unlocked |
|---|---|---|
| Commoditized ($0.50) | $0.001 | `county_lookup`, `get_soil_data`, basic weather |
| Enhanced ($1.50) | $0.003 | `environmental_impact_analysis`, `territorial_water_quality` |
| Proprietary ($5.00) | $0.010 | `planting_optimization`, `carbon_credit_calculator` |
| Exclusive ($10.00) | $0.020 | Patent-pending environmental compatibility scoring |

Every use case below pairs the **cheapest tier that delivers the answer** with the **revenue or cost-avoidance event** it unlocks. ROI is computed against the bundle price, not the headline subscription.

---

## Use Case 1 — Carbon Credit Portfolio Triage (Proprietary tier, $0.010/call)

**Buyer:** Regen-ag aggregator or carbon project developer managing 500–5,000 enrolled fields.

**MCP chain (per field):**
1. `county_lookup` — $0.001
2. `get_soil_data` — $0.001
3. `carbon_credit_calculator` — $0.010
**Cost per field: $0.012. 1,000 fields = $12.**

**ROI math:**
- Verra/CAR credits clear $15–$45 per tonne CO₂e. A single 80-acre field enrolled in no-till + cover crop conservatively generates **1.2–2.5 t CO₂e/yr** → **$18–$112/yr/field**.
- Triaging 1,000 candidate fields for $12 and surfacing the top 20% by ROI (200 fields × $40 avg) = **$8,000/yr recurring revenue against a $12 one-time spend.**
- **ROI: ~666× in year one**, compounding annually because the same triage feeds re-enrollment.

**Why MCP wins:** The agent loops `carbon_credit_calculator` across the portfolio in one conversation turn — no GIS analyst, no spreadsheet. Batch JSON-RPC counts as one rate-limited call.

---

## Use Case 2 — Commodity & Crop-Insurance Arbitrage Signals (Enhanced tier, $0.003/call)

**Buyer:** Boutique ag hedge fund, prop desk, or crop-insurance underwriter pricing county-level basis risk.

**MCP chain (per county-week):**
1. `county_lookup` — $0.001 (cached after first call)
2. `territorial_water_quality` — $0.003
3. `environmental_impact_analysis` — $0.003
**Cost per county-week: ~$0.007. 1,000 counties weekly = $7/week = $364/yr.**

**ROI math:**
- The patent-pending environmental fusion surfaces yield-deviation signals **2–6 weeks ahead** of USDA NASS prints. Even a **0.5¢/bu edge** on a 5,000-contract corn position = **$125,000 per print** (corn futures 5,000 bu/contract × $0.005 × 5,000).
- For underwriters, a single avoided mispriced policy in a high-risk county (~$50K average loss avoidance) **pays for 7,000 years of weekly scans.**
- **ROI: 343,000× per avoided mispriced policy; ~$125K per print for trading desks.**

**Why MCP wins:** Agent runs the same chain nightly across the Corn Belt, persists deltas, and only escalates anomalies to humans. `x-free-tier` covers the lookup leg, so 100% of paid budget hits the signal tools.

---

## Use Case 3 — White-Label ESG Scorecards for CPG Supply Chains (Exclusive tier, $0.020/call)

**Buyer:** Mid-market sustainability consultancy reselling supplier-farm ESG reports to CPG brands at **$500–$2,500 per supplier**.

**MCP chain (per supplier farm):**
1. `county_lookup` — $0.001
2. `get_soil_data` + `territorial_water_quality` — $0.004
3. `environmental_impact_analysis` (Exclusive: patent-pending compatibility scoring) — $0.020
**Cost per supplier scorecard: $0.025.**

**ROI math:**
- Resell price floor: **$500/scorecard** → margin per report = **$499.975**.
- Consultancy delivering 200 supplier scorecards/quarter = **$100,000 revenue against $5 in API spend.**
- **ROI: 19,999×.** The patent-pending fusion is the defensibility moat — buyers can't replicate it by stitching free USDA/EPA endpoints together, so price holds.

**Why MCP wins:** Exclusive-tier output ships with the audit trail (USDA + EPA + NOAA + AlphaEarth source IDs) that CPG procurement requires. The agent compiles the PDF; the consultant signs it.

---

## Use Case 4 — OEM Precision-Ag Job Planning at Fleet Scale (Stacked tiers)

**Buyer:** Sprayer/drone/tractor OEM running nightly autonomous job-plan generation for **10,000 customer fields**.

**MCP chain (per field):**
1. `county_lookup` + `get_soil_data` — $0.002 (Commoditized)
2. `planting_optimization` — $0.010 (Proprietary)
3. `generate_vrt_prescription` — $0.010 (Proprietary)
4. `environmental_impact_analysis` — $0.020 (Exclusive) — only on flagged fields (~10%)
**Cost per field: ~$0.024. 10,000 fields nightly = $240/night = ~$7,200/month.**

**ROI math:**
- Documented input savings from VRT prescriptions: **12–22% of fertilizer spend.** On a typical 160-acre corn field at $180/acre N spend, that's **$3,456–$6,336/yr saved per field.**
- Passing **half** the savings back to the grower as an OEM "smart-plan" subscription at **$15/field/month** = **$150,000/month revenue** against **$7,200/month API cost.**
- **Net margin: $142,800/month (~95%). ROI on API spend: ~20×.**
- Enterprise Bundle ($3,499/mo, 685K calls) absorbs the volume with 25%+ headroom for growth — switching from à-la-carte to bundle drops effective per-call cost to **$0.0051**, doubling margin again.

**Why MCP wins:** The whole pipeline runs as one agent loop with `kv_cache_hint: reuse`, cutting inference cost ~50%. White-label response wrapping ships under the OEM's brand — the grower never sees LeafEngines.

---

## ROI Summary

| # | Use Case | Tier | Cost Basis | Revenue / Avoidance | ROI |
|---|----------|------|------------|---------------------|-----|
| 1 | Carbon Credit Triage | Proprietary | $12 / 1K fields | $8,000/yr recurring | ~666× |
| 2 | Commodity Arbitrage | Enhanced | $364/yr | $125K per print / $50K per policy | 343× – 343,000× |
| 3 | ESG Scorecards (white-label) | Exclusive | $5 / 200 reports | $100,000/quarter | ~19,999× |
| 4 | OEM Fleet Job Planning | Stacked → Enterprise Bundle | $7.2K/mo | $150K/mo | ~20× (95% margin) |

---

## Buying Path

| Use Case | Recommended Purchase | Link |
|---|---|---|
| 1 | Proprietary bundle ($5) → upgrade to Founder Pro at scale | [Proprietary →](https://buy.stripe.com/3cIeVd9oW1NtgvU1kqaMU09) · [Founder Pro →](https://buy.stripe.com/cNi3cv1WuajZcfE7IOaMU03) |
| 2 | Enhanced bundle ($1.50) weekly, then Pro $499/mo | [Enhanced →](https://buy.stripe.com/7sY28reJg1NtenM8MSaMU0b) |
| 3 | Exclusive bundle ($10) per project, Pro for delivery | [Exclusive →](https://buy.stripe.com/6oU4gzbx40Jp6Vk1kqaMU0a) |
| 4 | Enterprise Bundle $3,499/mo (685K calls) | partnerships@leafengines.com |

---

🌱 **LeafEngines™** | *Space gives the picture. We give the truth.*
