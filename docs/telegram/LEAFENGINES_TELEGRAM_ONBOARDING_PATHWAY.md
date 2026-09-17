# LeafEngines Telegram — Trial User Onboarding Pathway

**Version:** 1.1 (Verified 2026-06-30)
**Date:** June 30, 2026
**Author:** Reggie Rice / Soil Sidekick Pro
**Status:** Active Design
**Target:** Trial launch complete (T4, Jun 12-14). Soft launch (T5) ready.

> **Verification Note (2026-06-30):** Telegram bot has no explicit package version; it is a deployed Supabase Edge Function (`telegram-webhook`). All T1 commands operational. Dual-meter enforcement active.

---

## 0. Design Premise

The bot has 9 tools across 4 tiers. Trial users arrive with zero context. The pathway must:
- Get them to a successful first call in under 30 seconds
- Expose them to features beyond basic /soil within the first 5 messages
- Make the dual-meter limits feel generous, not restrictive
- Create a natural pull toward paid tools without hard-selling

The design is NOT a tutorial. It's a progressive disclosure system — each interaction reveals the next capability.

---

## 1. Entry: /start

Current state: Returns a flat command list. No user provisioning. No metering.

**Redesigned /start flow:**

```
1. Auto-provision user (telegram_link + api_keys row, channel='telegram', tier='free')
2. Return welcome card with inline keyboard (not just text)
```

**Welcome card:**

```markdown
🌱 *LeafEngines — Soil Sidekick Pro*

Welcome, {first_name}. Your free account is ready.

📊 *Daily limits:*
  • Soil & water lookups: 20/day
  • AI analysis & plant ID: 5/day
  • Plant identifications: 3/day

👇 *Try one now:*
```

**Inline keyboard (3 buttons, not 8):**

| Button | Action |
|--------|--------|
| 🌍 Soil Lookup | Sends `/soil` (prompts for county) |
| 🌿 Identify a Plant | Sends `/identify` (prompts for name or photo) |
| 📖 See All Commands | Sends `/help` (full command reference) |

**Why 3 buttons, not 9:**
- Telegram inline keyboards max out visually at ~4 buttons before they look cluttered
- A new user needs 1 easy win, not a menu to study
- The third button ("See All Commands") is the escape hatch for power users who want everything now
- Photo identification is the flagship — it must be on the first screen, not buried

---

## 2. First Action: The Quick Win

### Path A: User taps "Soil Lookup"

Bot sends:
```
📍 Send me a county name and state, or a FIPS code.

Examples:
• "Fayette County KY"
• "01073"
• Just type a place name — I'll find the county.
```

User responds → bot calls `get_soil_data` → returns formatted soil card.

**After the soil card, append a discovery prompt:**

```
💡 *Did you know?* I can also analyze water quality for the same county.
Try: /water Fayette County KY
```

This is the first escalation: data tool → another data tool. Zero cost psychologically (same daily meter bucket, 20/day).

### Path B: User taps "Identify a Plant"

Bot sends:
```
🌿 Send me a plant name, or snap a photo!

I'll identify it and flag any toxic lookalikes in your area.

Examples:
• "wild carrot"
• 📷 (just send a photo)
• "poison ivy" — I'll tell you how to distinguish it
```

User responds → bot calls `safe_identification` → returns safety card with toxic lookalike warnings.

**After the identification card, append:**

```
🧠 *Go deeper:* Ask a farming or gardening question about this county.
Try: /ag What cover crops suit Fayette County KY?
```

This is the second escalation: data tool → AI tool. This is the meter boundary crossing (moves from 20/day bucket to 5/day bucket) but the user doesn't see the boundary — they see a natural follow-up question.

### Path C: User taps "See All Commands"

Returns the full command reference (current /help behavior, enhanced with tier markers — see section 4 below).

---

## 3. Progressive Disclosure: The 5-Message Arc

The goal: within 5 bot interactions, a trial user has touched at least 3 different tools and understands there are more.

| Message # | Action | Tool | Meter bucket | Discovery prompt after response |
|-----------|--------|------|-------------|-------------------------------|
| 1 | /start | — (provisioning) | — | Inline keyboard: soil, identify, all commands |
| 2 | First query | get_soil_data OR safe_identification | Data or AI | "Try /water" or "Try /ag" |
| 3 | Second query | territorial_water_quality OR agricultural_intelligence | Data or AI | "Want a planting calendar? /crop" |
| 4 | Third query | planting_optimization | Trial bucket (1 free) | **Paywall after trial call used** — see section 5 |
| 5 | User hits a limit OR asks /help | — | — | Tier upgrade prompt |

**Key insight:** The discovery prompts chain tools in a natural progression:

```
/soil → /water → /crop → 💎 upgrade
/identify → /ag → /crop → 💎 upgrade
```

Each link in the chain answers "what can I do next?" with a specific, actionable suggestion. Not "explore more features" — but "/water Fayette County KY" — a command they can copy-paste or tap.

---

## 4. /help Redesign: Tier-Aware Command Reference

Current /help is a flat list. Redesigned version groups by tier and shows meter status:

```markdown
🌱 *LeafEngines — Soil Sidekick Pro*

📍 *Data Tools* (20/day free)
/soil — County soil analysis
/water — Water quality data
/county — Look up FIPS codes

🧠 *AI Tools* (5/day free)
/identify — Plant ID + toxic lookalike warnings 📷
/ag — Agricultural intelligence & advice

🌱 *Trial Taste*
/crop — Planting optimization (1 free call, then Pro)

💎 *Pro Tools* (upgrade to unlock)
/carbon — Carbon credit calculator
/vrt — Variable-rate prescription
/env — Environmental impact analysis

📊 *Your usage today:* 2/20 data · 1/5 AI · 0/3 IDs

💬 *Or just type naturally:*
"soil data for Fayette County KY"
"is this poison ivy?"
```

**Critical detail:** The usage line is live — it calls the dual-meter counts from `api_keys` before rendering. This makes limits visible but non-threatening. A user at 18/20 data sees they have 2 left and can plan. A user at 0/5 AI sees the paywall coming.

**The photo hint (📷) next to /identify** — this is the only tool that accepts images. The emoji flags it for users who would send a photo but don't know the bot can handle it.

---

## 5. The Paywall: Soft Gate, Not Hard Wall

When a free-tier user hits a limit, the response must:
1. Deliver what they asked for IF they have quota remaining
2. If quota is exhausted, tell them specifically what's depleted and what's still available
3. Offer the upgrade path without being obnoxious

### Paywall response templates:

**AI meter exhausted:**
```
🧠 You've used all 5 AI calls for today.
Your AI limit resets at midnight UTC.

📍 *Still available:* Soil & water lookups (14/20 remaining today)

💎 Want more AI calls? /subscribe for Pro — 100/day, $5/mo
```

**Identification sub-limit exhausted:**
```
🌿 You've used all 3 plant identifications for today.
Your ID limit resets at midnight UTC.

🧠 *Still available:* General AI questions (2/5 remaining)
📍 *Still available:* Soil & water lookups (17/20 remaining)

💎 Need more IDs? /subscribe for Pro — unlimited
```

**Pro tool attempted on free tier:**
```
💎 /carbon is a Pro feature.

Calculate carbon credits from field size + practice type.
Sample output: "120 acres no-till → 1.8 credits × $25 = $45/year"

💎 /subscribe — Pro $5/mo (100 calls/day + all tools)
💎 /subscribe — Enterprise $25/mo (unlimited + batch API)
```

**Trial /crop call used:**
```
🌱 You've used your free planting optimization call.

Your result: Corn planting window for Fayette County KY
  → Optimal: Apr 15–May 10
  → Risk-free: Apr 20–May 1
  → Recommended population: 32,000 plants/acre

💎 Want unlimited /crop access + all Pro tools?
/subscribe — Pro $5/mo (100 calls/day)
```

**Design principle:** Always show what's still available. Never leave the user feeling like the whole bot is locked. The dual-meter system makes this natural — "AI is out, but soil lookups work fine."

---

## 6. /subscribe Flow

New command. Not in current code. Two-step flow:

**Step 1 — /subscribe**
```markdown
💎 *LeafEngines Pro*

🛠 All 9 tools unlocked
📊 100 AI calls/day + unlimited data
⚡ Priority responses
🔗 API key for MCP / n8n / QGIS access

*Pro — $5/mo*
*Enterprise — $25/mo* (unlimited + batch)

👇 Choose a plan:
```

Inline keyboard:

| Button | URL |
|--------|-----|
| Pro — $5/mo | `https://app.soilsidekickpro.com/subscribe?plan=pro&tg={telegram_id}` |
| Enterprise — $25/mo | `https://app.soilsidekickpro.com/subscribe?plan=enterprise&tg={telegram_id}` |
| Maybe later | Callback: dismiss |

**Step 2 — After payment (webhook confirms)**
Bot sends:
```
💎 *Welcome to Pro, {first_name}!*

Your limits are now:
  • Data lookups: Unlimited
  • AI calls: 100/day
  • All 9 tools unlocked

🔑 Your API key for MCP/n8n: \`ss_live_xxx...\`
(Copy this for use in Claude, n8n, or QGIS)
```

---

## 7. BotFather Command Registration

The current code has commands defined in the parseMessage switch but NOT registered with Telegram via `setMyCommands`. Without registration, users don't see the autocomplete menu when they type `/`.

**Register these commands via BotFather API:**

```typescript
const commands = [
  // ── Trial surface (visible to all users) ──
  { command: 'start',       description: 'Welcome & setup' },
  { command: 'help',        description: 'All commands & your usage' },
  { command: 'soil',        description: 'County soil analysis' },
  { command: 'water',       description: 'Water quality data' },
  { command: 'county',      description: 'Look up FIPS code' },
  { command: 'identify',    description: 'Plant ID + toxic lookalikes (📷 photos ok)' },
  { command: 'ag',          description: 'Agricultural intelligence & advice' },
  { command: 'crop',        description: 'Planting optimization (1 free trial call)' },
  // ── Utility ──
  { command: 'subscribe',   description: 'Upgrade to Pro or Enterprise' },
  { command: 'usage',       description: 'Your daily call counts' },
];
```

**Pro-only commands (NOT registered with BotFather — discoverable via /help only):**

| Command | Tool | Tier | Rationale |
|---------|------|------|-----------|
| /carbon | carbon_credit_calculator | Proprietary | Analytical, not action-driving. Better as /help discovery. |
| /vrt | generate_vrt_prescription | Proprietary | Niche (precision ag equipment operators). |
| /env | environmental_impact_analysis | Exclusive | Institutional audience. |

These three are hidden from the / autocomplete to avoid paywall friction on trial users.
They appear in /help under the 💎 Pro Tools section with sample output descriptions.
Users who upgrade to Pro get them added to their command menu dynamically via scoped setMyCommands.

**Implementation:** Add a one-time script or a `/register` admin command that calls:
```
POST https://api.telegram.org/bot{TOKEN}/setMyCommands
```

This makes all commands visible in Telegram's `/` autocomplete menu. Users who type `/` see the full list with descriptions — including which tools are Pro-tier.

---

## 8. /usage Command (New)

Live meter display. Not in current code. Simple and essential.

```markdown
📊 *Your usage today*

📍 Data lookups: 7/20
🧠 AI calls: 2/5
🌿 Plant IDs: 1/3

 Resets at midnight UTC.
💎 /subscribe for higher limits
```

Implementation: query `api_keys` for the user's `daily_ai_count`, `daily_data_count`, `monthly_alert_count`. Render with emoji headers matching the /help format.

---

## 9. The Missing Piece: /link

From the cross-platform doc (LEAFENGINES_CROSS_PLATFORM.md). A Telegram user who upgrades to Pro gets an API key. `/link` connects their Telegram identity to an existing web/MCP account.

**/link flow:**
```
1. User sends /link
2. Bot generates a one-time code (8 chars, TTL 10 min)
3. Bot displays: "Enter this code at app.soilsidekickpro.com/link-telegram"
4. User opens the web app, enters the code
5. Web app calls Supabase: links telegram_link row to existing api_keys row
6. Bot confirms: "✅ Linked! Your Telegram and web accounts are now connected."
```

This is critical for the escalation pathway: a trial user who starts on Telegram and wants MCP depth needs account continuity. Without /link, they're two separate accounts.

---

## 10. Implementation Sequence

What needs to happen in the webhook code to enable this pathway:

### T1 (Webhook + Commands — required before trial):

| # | Task | Depends on | Enables |
|---|------|-----------|---------|
| 1 | Auto-provision on /start: create telegram_link + api_keys (channel='telegram', tier='free', dual-meter cols) | L1 (dual meter live) | All metering |
| 2 | Register commands with BotFather via setMyCommands API call | None | / autocomplete |
| 3 | Redesign /start: welcome card + inline keyboard (3 buttons) | #1 | First interaction |
| 4 | Redesign /help: tier-grouped + live usage line | #1 | Feature discovery |
| 5 | Add /usage command | #1 | Transparency |
| 5b | Add /crop command with trial-bucket (1 free call, then paywall) | #1 + trial_bucket col on api_keys | Conversion driver |
| 6 | Add /subscribe command with inline keyboard (URL buttons) | Stripe setup (Phase 2) | Monetization |
| 7 | Add discovery prompts after tool responses (soil→water, identify→ag, water→crop) | None | Escalation chain |
| 8 | Dual-meter-aware paywall responses (separate AI/data/ID messages) | L1 | Soft gates |
| 9 | Webhook secret validation (re-enable) | None | Security |
| 10 | /link one-time-code flow | #1 | Cross-platform identity |

### T2 (Photo + AI — before trial, parallel):

| # | Task | Depends on | Enables |
|---|------|-----------|---------|
| 11 | Photo flow: getFile → Storage signed URL → safe_identification | L2 (llm-router) | Flagship feature |
| 12 | sendChatAction("typing") heartbeat for AI calls >2s | None | UX polish |
| 13 | /ag through llm-router with dual-meter enforcement | L1 + L2 | AI analysis |

### Priority for trial launch (T4):
Must-haves: 1, 2, 3, 4, 5, 5b, 7, 8
Nice-to-haves: 6, 9, 10, 11, 12, 13

---

## 11. Trial User Scouting Packet

When you invite trial users, send them this message (or a link to it):

```markdown
🌱 *You're invited to try LeafEngines on Telegram.*

What it does:
• Instant soil analysis for any US county
• Plant identification with toxic lookalike warnings (send a photo!)
• Water quality data
• Agricultural intelligence — ask farming/gardening questions

How to start:
1. Open @LeafEnginesBot
2. Send /start
3. That's it. No signup, no install.

Free for 2 weeks. 20 data lookups + 5 AI calls per day.

Got questions? Reply here or type /help in the bot.
```

---

## 12. Metrics to Watch During Trial

| Metric | What it tells you | Warning threshold |
|--------|-------------------|-------------------|
| /start → first tool call rate | Is the welcome card working? | <60% |
| Messages per user per day | Is discovery happening? | <2 |
| Tool distribution | Are users only using /soil? | >70% on one tool |
| Paywall hit rate | Are free limits right? | >50% hitting AI limit daily |
| /subscribe click-through | Is the upgrade path visible? | <5% of paywall hits |
| 7-day retention | Is the bot sticky? | <30% |
| P95 response latency | Is it fast enough? | >5s on AI calls |

The tool distribution metric is the most important one. If 70%+ of calls are /soil, the discovery prompts aren't working. If usage spreads across soil + water + identify + ag within the first 3 sessions, the pathway is working.

---

## Appendix: Tool Tier Quick Reference

| Tool | /command | Tier | Meter bucket | Free daily limit | Surface |
|------|----------|------|-------------|-----------------|---------|
| get_soil_data | /soil | Commoditized | Data | 20 | Trial |
| county_lookup | /county | Commoditized | Data | 20 | Trial |
| territorial_water_quality | /water | Commoditized | Data | 20 | Trial |
| agricultural_intelligence | /ag | Enhanced | AI | 5 | Trial |
| safe_identification | /identify | Enhanced | AI + ID sub-limit | 5 AI / 3 ID | Trial |
| planting_optimization | /crop | Exclusive | Trial bucket | 1 per trial period | Trial (1 free taste) |
| carbon_credit_calculator | /carbon | Proprietary | Paid only | 0 (upgrade) | /help only |
| generate_vrt_prescription | /vrt | Proprietary | Paid only | 0 (upgrade) | /help only |
| environmental_impact_analysis | /env | Exclusive | Paid only | 0 (upgrade) | /help only |
