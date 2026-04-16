# LeafEngines™ × ClawHub / OpenClaw Deep Dive

> **Audience:** ClawHub affiliates, OpenClaw partner-network operators, agency resellers, content creators monetizing agricultural audiences
> **Repository target:** ClawHub partner portal docs + OpenClaw GitHub org
> **Last updated:** 2026-04-16

---

## TL;DR

OpenClaw is the LeafEngines affiliate and partner-network engine; ClawHub is the operator-facing portal. Together they let you **monetize traffic, content, or workflows** that touch agriculture, sustainability, foraging, or land due-diligence — with attribution that survives across click → trial → paid conversion → renewal.

If you publish ag content, run an agency, ship a SaaS adjacent to farming/foraging, or operate a community of land owners, this is your playbook.

---

## The Three-Stage Funnel (How OpenClaw Actually Works)

```
   ┌────────────┐      ┌──────────────┐      ┌─────────────────────────┐
   │  Click     │ ───▶ │  Intake      │ ───▶ │  Personalized Landing   │
   │  (your URL)│      │  (qualifying │      │  (their use case +      │
   │            │      │   questions) │      │   your branding)        │
   └────────────┘      └──────────────┘      └─────────────────────────┘
        │                     │                          │
        ▼                     ▼                          ▼
  affiliate_codes    affiliate_referrals       conversion_funnel
  (your code, rate)  (attribution row)         (event_type per step)
```

Three database tables back the entire flow:

- `affiliate_codes` — your code, commission rate, lifetime totals
- `affiliate_referrals` — one row per referred user, with `attribution_date`, `commission_rate`, `subscription_amount`, `last_commission_date`
- `affiliate_payouts` — period-bounded payout records with Stripe transfer IDs

Attribution is **first-touch**, **365-day window**, **recurring** (you keep earning while the customer pays).

---

## Commission Structure

| Customer Tier | Customer Pays | Default Commission | Lifetime Value (avg) | Your Cut (LTV) |
|---------------|--------------|---------------------|----------------------|----------------|
| Starter       | $149/mo      | 25%                 | ~$2,200              | ~$550 |
| Pro           | $499/mo      | 25%                 | ~$8,400              | ~$2,100 |
| Enterprise    | $1,999/mo    | 15% (negotiable)    | ~$48,000             | ~$7,200 |
| One-time tools (PDF reports, county packs) | $9–$99 | 30% | — | $3–$30 per |

Custom rates available for ClawHub partners with proven volume — 30%+ for top quartile.

---

## Three Ways to Earn

### 1. Content Affiliate (lowest lift)

You write/podcast/YouTube about gardening, foraging, regenerative ag, hobby farms, land investing, or rural homesteading. You drop your link.

**Best landing pages to send traffic to:**
- `/?aff=YOUR_CODE` — generic homepage
- `/foraging?aff=YOUR_CODE` — toxic-lookalike plant ID (high-converting for foragers)
- `/carbon-credits?aff=YOUR_CODE` — landowners with 5+ acres
- `/county-report/{fips}?aff=YOUR_CODE` — drop-in for "soil quality in [town]" SEO content

Conversion benchmarks (last 90 days):
- Foraging traffic → Free signup: **22%**
- Free → Starter (90-day): **8%**
- Landowner traffic → one-time PDF: **14%**

### 2. Workflow Reseller (highest margin)

You run an n8n / Node-RED / Zapier agency. You bundle LeafEngines into client workflows.

- Buy one **Pro key** ($499/mo)
- Power 20–50 client workflows on it
- Charge clients $50–$200/mo each
- Net margin: 80–95%

OpenClaw gives you a **multi-tenant attribution token** — every API call your workflows make is tagged so when one of those clients eventually buys their own LeafEngines account, you still get the commission.

### 3. White-Label / Embed Partner (deepest moat)

You ship a SaaS product (farm management, ag insurance, land marketplace, ESG reporting) and embed LeafEngines under your brand. ClawHub provides:

- Co-branded API endpoints (`api.{yourdomain}.com` → LeafEngines)
- White-label SDK components (`EnvironmentalScore`, `PlantCareCard`, `SeasonalCalendar`, `SatelliteHealth`, `TurboQuantStatus`)
- Embedded sandbox for your support team
- Revenue share negotiated on volume (typically 15–25% of gross)

---

## ClawHub Portal: What You Get

The operator portal at `app.soilsidekickpro.com/affiliate-dashboard` provides:

### Real-time analytics
- Click → signup → trial → paid conversion at each step
- Top landing pages by EPC (earnings per click)
- Geographic heatmap of your referrals (US states + counties)
- Cohort retention curves for your referred users

### Creative assets
- Branded logo bundle (SVG, PNG, dark/light)
- Pre-written copy blocks (foraging, carbon, soil, VRT)
- Comparison pages (vs Farmonaut, OneSoil, SoilTestPro, PictureThis, Heirloom)
- Embeddable widgets (county soil card, foraging safety lookup)

### Payouts
- Stripe Connect onboarding (3-day funds)
- Net-30 payment terms; $50 minimum threshold
- 1099-NEC issued automatically each January for US partners

### Compliance
- Pre-approved disclosure language for FTC §255 compliance
- GDPR-compliant cookie banner snippet
- Brand-safety guardrails (no medical/legal/financial advice claims)

---

## API Access for OpenClaw Partners

Your affiliate code unlocks programmatic access to **your own** referral data:

```bash
curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/affiliate-management \
  -H "x-api-key: ak_<your_partner_key>" \
  -H "Content-Type: application/json" \
  -d '{ "action": "list_referrals", "period": "last_30_days" }'
```

Returns:
```json
{
  "code": "YOURCODE",
  "totals": { "clicks": 1240, "signups": 187, "paid": 22, "mrr": 487.50 },
  "referrals": [
    { "id": "...", "tier": "starter", "attribution_date": "2026-03-12", "status": "active", "commission_amount": 37.25 }
  ]
}
```

Build your own dashboards, integrate with your existing affiliate stack (Tapfiliate, Rewardful, FirstPromoter), or feed it into ClawHub for unified reporting.

---

## OpenClaw Open-Source Components

The pieces of OpenClaw that live in public GitHub (MIT licensed):

| Repo | Purpose |
|------|---------|
| `openclaw-tracker.js` | Lightweight client-side click + UTM attribution beacon (~3KB gzipped) |
| `openclaw-react` | React components: `<AffiliateLink>`, `<ConversionFunnel>`, `<PayoutTable>` |
| `openclaw-postback` | Server-to-server postback receiver (Express, FastAPI, Hono variants) |
| `openclaw-cli` | `openclaw stats` / `openclaw payouts` from your terminal |
| `clawhub-themes` | Tailwind theme presets matching ClawHub partner portal branding |

PRs welcome. The IP-protected pieces (attribution algorithm, fraud-detection scoring, recurring-commission calculator) stay closed-source and live in the platform.

---

## Required Pieces Before Going Live (Current Status)

Per the OpenClaw implementation memo, four items are required to flip this to public-launch state:

1. **Stripe Connect Express onboarding** — backend wired, partner-facing flow needs final UX pass
2. **Branded creative pack** — base assets exist; need final QA for foraging + carbon verticals
3. **Comparison-page coverage** — 5 of 8 published; PictureThis + Heirloom + GenericSoilApp pending
4. **Public partner-program landing page** — `/affiliates` slug reserved, content drafted

ETA to public launch: **~2 weeks** from sign-off on creative pack.

---

## Fraud / Quality Guardrails

OpenClaw refuses commission on:

- Self-referrals (same email/IP/device fingerprint)
- Cookie-stuffing / iframe-pixel abuse
- Trademark bidding on `LeafEngines`, `SoilSidekick Pro`, or competitor terms (per partner agreement)
- Spam / unsolicited bulk email
- Misrepresentation of product capability (especially safety-critical claims around plant ID)

Violations: warning → 30-day suspension → permanent ban + clawback. Two-strike minimum for first-time content creators acting in good faith.

---

## Partner Tiers within ClawHub

| Tier | Threshold | Perks |
|------|-----------|-------|
| **Sprout** | 0–9 paying referrals | Standard commission, self-serve portal |
| **Vine** | 10–49 | +5% commission, monthly newsletter feature opt-in |
| **Canopy** | 50–199 | Custom commission, dedicated Slack, co-marketing |
| **Forest** | 200+ | Revenue share, white-label option, quarterly business review |

Tier reviewed monthly based on trailing-90-day paying-referral count.

---

## Integration Examples

### WordPress (one line)
```html
<a href="https://soilsidekickpro.com/?aff=YOURCODE">Check your soil quality →</a>
```

### Substack / Newsletter
```markdown
[Run a free soil report on your county →](https://soilsidekickpro.com/county-lookup?aff=YOURCODE)
```

### React app
```jsx
import { AffiliateLink } from '@openclaw/react';

<AffiliateLink code="YOURCODE" landing="/foraging">
  Identify any plant safely
</AffiliateLink>
```

### Server-side (preserve attribution across signup flow)
```ts
import { tagReferral } from '@openclaw/server';

app.post('/signup', async (req, res) => {
  await tagReferral({
    user_email: req.body.email,
    aff_code: req.cookies.openclaw_aff,
    landing_page: req.cookies.openclaw_landing,
  });
  // ...rest of signup
});
```

---

## Roadmap

- **Q2 2026:** Public launch, `/affiliates` page live, first cohort of 50 founding partners
- **Q2 2026:** Tapfiliate + Rewardful + FirstPromoter sync adapters
- **Q3 2026:** Multi-currency payouts (EUR, GBP, AUD)
- **Q3 2026:** ClawHub mobile app (iOS/Android) for stat checks + payout requests
- **Q4 2026:** Sub-affiliate (2-tier) for ClawHub Forest-tier partners
- **Q4 2026:** OpenClaw v2 with on-chain optional payout rails for international partners

---

## Getting Started

1. Apply: https://soilsidekickpro.com/affiliates (waitlist while in soft-launch)
2. Existing customers: enable in `app.soilsidekickpro.com/affiliate-dashboard` instantly
3. Read the partner agreement (5-minute read; plain English, not legalese)
4. Drop your link, watch attribution flow

---

## Support

- **Partner success:** partners@leafengines.com
- **Technical (OpenClaw open-source):** github.com/openclaw/issues
- **Payouts / billing:** payouts@leafengines.com
- **Brand / co-marketing:** brand@leafengines.com

---

© 2026 SoilSidekick Pro™ / LeafEngines™. ClawHub™ and OpenClaw™ are trademarks of SoilSidekick Pro. Affiliate program subject to partner agreement and local regulations.
