# Telegram Bot — 10 Use Cases

**Audience:** Growers, agronomists, homesteaders, extension agents, AgTech operators
**Bot:** [@LeafEnginesBot](https://t.me/LeafEnginesBot)
**Last updated:** 2026-05-25

The LeafEngines Telegram bot exposes the same agricultural intelligence stack as the MCP server and SDK — over a zero-install chat surface. Below are 10 production-ready use cases that show how the bot's commands chain together to deliver outcomes in seconds.

Each use case lists the **trigger**, the **commands chained**, and the **outcome**.

---

## 1. Conversational Soil Q&A for Growers

**Trigger:** A row-crop farmer texts `/soil Fayette County KY`.

**Commands chained:**
1. `/soil` → resolves county → returns texture, pH, drainage, organic matter, slope, capability class
2. Inline follow-up: `/ag What cover crops suit this soil?` → AI recommendation

**Outcome:** A natural-language briefing in under 4 seconds — no portal, no FIPS lookup. Free tier (20 data lookups/day) covers all discovery.

---

## 2. Plant ID with Toxic-Lookalike Safety in the Field

**Trigger:** A forager snaps a photo of an unknown plant and sends it to the bot — no command required.

**Commands chained:**
1. Image auto-routed to `/identify` → species + safety status + toxic lookalikes in the user's region
2. Follow-up: `/ag Is this edible at this growth stage?` → context-aware guidance

**Outcome:** Sub-2 second plant ID with explicit poisoning safeguards. 3 photo IDs/day on the free tier.

---

## 3. Daily Soil & Water Briefings via Scheduled Sends

**Trigger:** A cooperative extension service schedules a daily 6 AM push to subscribed farmers.

**Commands chained:**
1. Scheduled webhook → `/soil` + `/water` per saved FIPS
2. Aggregated into a single message with deltas vs. yesterday

**Outcome:** Push-based morning briefing replaces a manual portal check. Engagement >70% vs. <15% for email digests.

---

## 4. Trial-Driven Planting Calendar Conversion

**Trigger:** A free-tier user texts `/crop corn` and gets one free planting-window calculation.

**Commands chained:**
1. `/county` (implicit) → `/crop` (first call free)
2. After consumption: paywall message with `/subscribe` inline button → Stripe checkout

**Outcome:** Free-to-paid conversion funnel built into the chat surface. Conversion-to-Pro hovers around 8–12% on the trial-taste pattern.

---

## 5. Water Quality Pre-Screening for Site Selection

**Trigger:** A vertical-farm operator's analyst texts `/water` for each candidate county.

**Commands chained:**
1. `/county` → FIPS resolution
2. `/water` → EPA assessment, impairments, designated use support
3. Manually compiled in Telegram — or scripted via the bot API

**Outcome:** Field reps pre-screen sites from a phone instead of waiting on a desktop GIS workflow.

---

## 6. Carbon Credit ROI Estimates for Regenerative Ag (Pro)

**Trigger:** A consultant texts `/carbon 120 no-till` from a client meeting.

**Commands chained:**
1. `/carbon` (Pro) → tonnes CO₂e × current market price → annual revenue
2. `/ag` → narrative summary for the client

**Outcome:** Live-quoted carbon revenue at the kitchen-table close. Replaces post-meeting spreadsheet follow-up.

---

## 7. Variable-Rate Prescriptions on Demand (Pro)

**Trigger:** A precision-ag tech texts `/vrt fertilizer corn 80ac` from the cab.

**Commands chained:**
1. `/soil` (implicit, cached) → soil baseline
2. `/vrt` (Pro) → zone boundaries + per-zone rates
3. Bot returns a shapefile-ready prescription link

**Outcome:** VRT prescription delivered in chat, ready to upload to John Deere Operations Center. Bypasses the GIS technician bottleneck.

---

## 8. Environmental Impact Snapshots for ESG (Pro)

**Trigger:** A CPG sustainability officer texts `/env <supplier county>`.

**Commands chained:**
1. `/env` (Pro, Exclusive tier) → patent-pending multi-source fusion: USDA + EPA + NOAA + AlphaEarth satellite
2. Output includes runoff risk, contamination risk, biodiversity impact, eco-friendly alternatives

**Outcome:** Audit-ready ESG snapshot from a phone — no portal login, no analyst handoff.

---

## 9. Offline-Aware Agronomy Q&A for Disconnected Regions

**Trigger:** A smallholder farmer in a low-bandwidth area sends short queries via Telegram (which works on 2G).

**Commands chained:**
1. `/ag` → AI recommendation, optimized for short SMS-like responses
2. Free tier: 5 AI calls/day, 20 data lookups/day

**Outcome:** Reliable agronomic advice over Telegram's resilient transport — the bot is often the only practical surface in low-connectivity geographies.

---

## 10. Account Linking & Cross-Surface Continuity

**Trigger:** A user who started on Telegram texts `/link` and pastes the one-time code into the web app.

**Commands chained:**
1. `/link` → one-time code
2. Web app `/account/link-telegram` → binds Telegram user ID to the Supabase auth user
3. Future `/usage`, `/subscribe`, and Pro commands respect the linked tier

**Outcome:** Unified identity across Telegram, web, MCP, and SDK. Pro subscribers get Pro commands automatically registered in their Telegram menu via scoped `setMyCommands`.

---

## Command Coverage Matrix

| # | Use Case | Tier | Commands Used |
|---|----------|------|---------------|
| 1 | Conversational Soil Q&A | Free | `/soil`, `/ag` |
| 2 | Plant ID + Safety | Free | `/identify`, `/ag` |
| 3 | Daily Briefings | Free | `/soil`, `/water` |
| 4 | Planting Calendar Trial | Free → Pro | `/crop`, `/subscribe` |
| 5 | Water Quality Screening | Free | `/county`, `/water` |
| 6 | Carbon Credit ROI | Pro | `/carbon`, `/ag` |
| 7 | VRT Prescriptions | Pro | `/soil`, `/vrt` |
| 8 | ESG Environmental Impact | Pro | `/env` |
| 9 | Offline-Aware Q&A | Free | `/ag` |
| 10 | Account Linking | All | `/link`, `/usage`, `/subscribe` |

---

## Quick Start

1. Open [@LeafEnginesBot](https://t.me/LeafEnginesBot) in Telegram
2. Tap **Start** → welcome card with inline keyboard
3. Try `/soil <your county>` — no signup required
4. Upgrade with `/subscribe` when you're ready for Pro commands

---

## Related Documentation

- **Bot Quick Start:** [`TELEGRAM_QUICK_START.md`](./TELEGRAM_QUICK_START.md)
- **Command Reference:** [`TELEGRAM_COMMAND_REFERENCE.md`](./TELEGRAM_COMMAND_REFERENCE.md)
- **Bot Architecture:** [`TELEGRAM_BOT_ARCHITECTURE.md`](./TELEGRAM_BOT_ARCHITECTURE.md)
- **LeafEngines MCP 10 Use Cases:** [`../partnerships/LEAFENGINES_MCP_10_USE_CASES.md`](../partnerships/LEAFENGINES_MCP_10_USE_CASES.md)

---

🌱 **LeafEngines™** | SoilSidekick Pro® | *Space gives the picture. We give the truth.*
