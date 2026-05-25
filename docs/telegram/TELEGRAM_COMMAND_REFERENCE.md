# Telegram Command Reference

**Bot:** @LeafEnginesBot
**Channel:** Telegram
**Docs version:** May 2026

---

## Command Surface

Commands are split into two groups: **registered** (visible in Telegram's `/` autocomplete menu) and **discoverable** (visible only via `/help`).

### Registered Commands (BotFather `setMyCommands`)

These appear when a user types `/` in the chat:

| Command | Tool | Description |
|---|---|---|
| `/start` | — | Welcome card + account provisioning |
| `/help` | — | Tier-grouped command list + live usage |
| `/soil` | `get_soil_data` | County soil analysis |
| `/water` | `territorial_water_quality` | Water quality data |
| `/county` | `county_lookup` | Look up FIPS code by name |
| `/identify` | `safe_identification` | Plant ID + toxic lookalike warnings (accepts photos) |
| `/ag` | `agricultural_intelligence` | Agricultural intelligence & advice |
| `/crop` | `planting_optimization` | Planting optimization (1 free trial call, then Pro) |
| `/subscribe` | — | Upgrade to Pro or Enterprise |
| `/usage` | — | Your daily call counts |

### Discoverable Commands (Pro only, `/help` visible)

These are NOT registered with BotFather on the free tier. They appear in `/help` under the Pro section with sample output descriptions. After a user upgrades to Pro, they are added to the user's command menu dynamically via scoped `setMyCommands`.

| Command | Tool | Tier | Description |
|---|---|---|---|
| `/carbon` | `carbon_credit_calculator` | Proprietary | Carbon credit calculator — field size + practice type → credit estimate |
| `/vrt` | `generate_vrt_prescription` | Proprietary | Variable-rate prescription for precision ag equipment |
| `/env` | `environmental_impact_analysis` | Exclusive | Environmental impact analysis (institutional audience) |

**Rationale for hiding Pro commands:** Trial users who see `/carbon` in autocomplete and hit an immediate paywall feel friction. Showing these in `/help` with a sample output ("120 acres no-till → 1.8 credits × $25 = $45/year") communicates value without the paywall sting.

---

## Tier Breakdown

### Data Tools (Free: 20/day)

```text
/soil — County soil analysis
  Input: County name + state, FIPS code, or place name
  Output: Texture, pH, drainage class, organic matter, slope, capability class

/water — Water quality data
  Input: Same as /soil
  Output: EPA assessment results, impairments, designated use support

/county — Look up FIPS codes
  Input: State + county name
  Output: FIPS code, state code, admin unit name
```

### AI Tools (Free: 5/day)

```text
/identify — Plant identification + toxic lookalike warnings
  Input: Plant name, or send a photo directly in chat
  Output: Species, safety status, toxic lookalikes in your area
  Sub-limit: 3 photo identifications per day

/ag — Agricultural intelligence & advice
  Input: Farming or gardening question, optionally with location
  Output: Context-aware agricultural recommendation
```

### Trial Taste (1 free call, then Pro)

```text
/crop — Planting optimization
  Input: County or location + crop type
  Output: Optimal planting window, risk-free window, recommended population
  After free call used: paywall with upgrade prompt
```

### Pro Tools (upgrade required)

```text
/carbon — Carbon credit calculator
  Input: Field size + practice type
  Output: Credit quantity × market price = annual revenue

/vrt — Variable-rate prescription
  Input: Field boundary + soil/zone data
  Output: Zone-based prescription map for precision ag equipment

/env — Environmental impact analysis
  Input: Project area + activity type
  Output: Impact assessment by category (soil, water, air, biodiversity)
```

### Utility Commands

```text
/start  — Welcome card with inline keyboard (Soil Lookup, Identify a Plant, See All Commands)
/help   — Tier-grouped command list with live usage counts
/usage  — Daily meter display (data lookups, AI calls, plant IDs remaining)
/subscribe — Plans + inline keyboard with payment URLs
/link   — One-time code to connect Telegram account to web/MCP account
```

---

## Input Formats

The bot accepts both structured and natural language input:

**County-based tools** (`/soil`, `/water`, `/county`, `/crop`):
```text
/soil Fayette County KY
/soil 01073
/soil soil data for Fayette County Kentucky
```

**Plant identification**:
```text
/identify wild carrot
/identify poison ivy
(Or just send a photo — no command needed if the bot detects an image)
```

**Agricultural intelligence**:
```text
/ag What cover crops suit Fayette County KY?
/ag best nitrogen rate for corn in central Kentucky
```

The bot uses FIPS codes internally but never mandates them. Natural language county resolution is the preferred UX.

---

## Paywall Behavior

When a free-tier user hits a limit, the response always shows:

1. What's depleted (specific meter)
2. What's still available (other meters)
3. The upgrade path (`/subscribe`)

Example — AI meter exhausted:
```text
🧠 You've used all 5 AI calls for today.
Your AI limit resets at midnight UTC.

📍 Still available: Soil & water lookups (14/20 remaining today)

💎 Want more AI calls? /subscribe for Pro — 100/day, $5/mo
```

See [Telegram Bot Architecture](./TELEGRAM_BOT_ARCHITECTURE.md) for the technical implementation of metering and the dual-meter system.

---

## Progressive Disclosure Arc

The bot chains discovery prompts after each tool response to naturally expose the next capability:

```text
/soil → "Try /water"       (data → data, same meter bucket)
/water → "Want a planting calendar? /crop" (data → trial, crossing meter boundary)
/identify → "Try /ag"      (AI → AI, same meter bucket)
/ag → "Try /crop"          (AI → trial, crossing meter boundary)
/crop (after free call) → upgrade prompt (trial → paid)
```

This is not a tutorial — it's a progressive disclosure system. Each interaction reveals the next capability with a specific, actionable command the user can tap.

---

## BotFather Registration

The command list is registered via the Telegram Bot API:

```text
POST https://api.telegram.org/bot{TOKEN}/setMyCommands
```

Pro-only commands (`/carbon`, `/vrt`, `/env`) use **scoped** `setMyCommands` — they are registered only for users whose `api_keys.tier` is `pro` or `enterprise`. Free-tier users never see them in autocomplete.

For the full list of registered commands with their BotFather descriptions, see the [Onboarding Pathway](./TELEGRAM_QUICK_START.md) design doc.
