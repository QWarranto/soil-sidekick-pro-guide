# Stripe Product Copy — LeafEngines API (June 2026 Refresh)

Aligned to current per-call pack rates and subscription blend in `src/lib/sdk-tier-limits.ts`.

**Per-call pack rates (canonical):**
- Commoditized: **$0.001/call**
- Enhanced: **$0.003/call**
- Proprietary: **$0.010/call**
- Exclusive: **$0.020/call**

---

## 🟢 Credit Packs (One-Time Purchase)

Credit packs are tier-specific samplers priced at face value (no discount vs. per-call rates). Subscriptions are where the economies of scale live. Credits never expire.

### LeafEngines API — Starter Credit Pack — $10.00 USD
**Buy:** https://buy.stripe.com/bJe3cvfNk77N5RgfbgaMU0e

**Marketing feature list**
- Type: One-time credit pack
- Tier: **Commoditized** ($0.001/call)
- Included: **10,000 calls** ($10 face value)
- Credits never expire

**Description**
Entry-level sampler for the Commoditized tier — public-data endpoints including County Lookup, Soil Data, and basic Water lookups. Ideal for evaluation, prototyping, and low-volume Telegram or scripting use. 10,000 calls included at the standard $0.001/call rate. No subscription required, no expiration. Upgrade to a monthly subscription for blended Enhanced/Proprietary/Exclusive access at up to ~49% off pack rates.

---

### LeafEngines API — Pro Credit Pack — $25.00 USD
**Buy:** https://buy.stripe.com/cNi9AT1Wu0Jp93s8MSaMU0c

**Marketing feature list**
- Type: One-time credit pack
- Tier: **Enhanced** ($0.003/call)
- Included: **8,333 calls** ($25 face value)
- Credits never expire

**Description**
Enhanced-tier credit pack covering value-added integrations: Territorial Water Quality, Multi-Parameter Planting Calendar, Live Agricultural Data, Environmental Impact, Safe Identification, Dynamic Care, and Beginner Guidance. 8,333 calls included at the standard $0.003/call rate. Best for regular Telegram users and small n8n / Node-RED workflows that need richer data than the Commoditized tier. One-time purchase. Credits do not expire.

---

### LeafEngines API — Enterprise Credit Pack — $50.00 USD
**Buy:** https://buy.stripe.com/28EeVd9oWeAf2F48MSaMU0d

**Marketing feature list**
- Type: One-time credit pack
- Tier: **Proprietary** ($0.010/call)
- Included: **5,000 calls** ($50 face value)
- Credits never expire

**Description**
Proprietary-tier credit pack for AI-powered intelligence endpoints: Agricultural Intelligence, Seasonal Planning Assistant, Smart Report Summary, Carbon Credit Calculator, VRT Prescription generation, LeafEngines Query, and AlphaEarth Environmental Enhancement. 5,000 calls included at the standard $0.010/call rate. Best for production MCP, advanced n8n / Node-RED flows, and pilot integrations. One-time purchase. Credits do not expire. For patent-pending Exclusive endpoints (GPT-5 chat, Visual Crop Analysis, Geo-Consumption Analytics), see the monthly subscriptions below.

---

## 🔵 Monthly Subscriptions (Blended Quotas — Volume Discount)

Subscriptions pre-allocate calls across all four tiers so the included face value exceeds the sticker price. The discount widens at higher tiers.

### LeafEngines API — Starter Subscription — $149.00 USD / month
**Subscribe:** https://buy.stripe.com/5kQ6oHcB88bR93s8MSaMU04

**Marketing feature list**
- Commoditized: **20,000 calls** ($20 value)
- Enhanced: **15,000 calls** ($45 value)
- Proprietary: **7,500 calls** ($75 value)
- Exclusive: **4,000 calls** ($80 value)
- **Total included face value: $220 (~32% off pack rates)**
- Overage billed at standard tier rates

**Description**
Monthly plan for small teams running production MCP, n8n, Node-RED, or Telegram flows. Blended quota across all four tiers — Commoditized, Enhanced, Proprietary, and Exclusive — for a total face value of $220 (vs. $149 price, ~32% effective discount). Includes 60 req/min, 1,500 req/hour, 15,000 req/day, and 5 concurrent requests. Overage billed at standard per-call rates: $0.001 / $0.003 / $0.010 / $0.020. Cancel anytime.

---

### LeafEngines API — Pro Subscription — $499.00 USD / month
**Subscribe:** https://buy.stripe.com/14A6oH7gO3VBcfE1kqaMU05

**Marketing feature list**
- Commoditized: **80,000 calls** ($80 value)
- Enhanced: **60,000 calls** ($180 value)
- Proprietary: **30,000 calls** ($300 value)
- Exclusive: **17,000 calls** ($340 value)
- **Total included face value: $900 (~45% off pack rates)**
- Overage billed at standard tier rates

**Description**
Monthly plan for growing teams and ISVs embedding LeafEngines in their product. Blended quota across all four tiers for a total face value of $900 (vs. $499 price, ~45% effective discount). Includes 250 req/min, 6,000 req/hour, 65,000 req/day, and 15 concurrent requests. Unlocks satellite data, AI recommendations, VRT maps, and TurboQuant. Overage billed at standard per-call rates. Cancel anytime.

---

### LeafEngines API — Enterprise Subscription — $1,999.00 USD / month
**Subscribe:** https://buy.stripe.com/eVqaEXfNkajZ6Vk0gmaMU06

**Marketing feature list**
- Commoditized: **400,000 calls** ($400 value)
- Enhanced: **250,000 calls** ($750 value)
- Proprietary: **120,000 calls** ($1,200 value)
- Exclusive: **80,000 calls** ($1,600 value)
- **Total included face value: $3,950 (~49% off pack rates)**
- Overage billed at standard tier rates with additional **20% discount**

**Description**
Monthly plan for enterprise integrators, OEMs, and high-volume MCP / agent workloads. Blended quota across all four tiers for a total face value of $3,950 (vs. $1,999 price, ~49% effective discount). Includes 800 req/min, 20,000 req/hour, 290,000 req/day, and 50 concurrent requests. All features unlocked. Overage billed at standard per-call rates with a further 20% volume discount. Priority support, SLA, and usage analytics included. Cancel anytime.

---

## Notes for Stripe Dashboard Updates

1. **Remove all references** to the legacy "Founder $10/mo" and "$49/mo" pricing — these expired June 1, 2026.
2. **Remove inconsistent per-call rates** (e.g. "$0.005 per call", "$0.02 per call") from credit-pack marketing features — those numbers conflicted with the canonical pack rates.
3. **Credit packs are now tier-aligned** (one tier per pack) so customers can self-select; subscriptions remain the blended/discounted path.
4. **Subscription face values** must match `src/lib/sdk-tier-limits.ts` — if quotas change in code, update Stripe copy in lockstep.
