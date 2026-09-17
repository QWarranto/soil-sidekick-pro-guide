# LeafEngines Telegram Bot — Product Requirements Document

**Product:** LeafEngines Bot (Telegram)
**Version:** 1.0 (Verified 2026-06-30)
**Date:** June 30, 2026
**Author:** Reggie Rice / Soil Sidekick Pro
**Status:** Active — reflects deployed architecture

> **Verification Note (2026-06-30):** Telegram bot has no explicit package version; it is a deployed Supabase Edge Function (`telegram-webhook`). LLM provider references updated from Gemma 4 to deployed Lovable AI Gateway + OpenAI direct.

---

## 1. Vision

Deliver LeafEngines agricultural intelligence tools to any user on Telegram — no install, no API key, no setup. A farmer, agronomist, or curious gardener opens Telegram, sends a message, and gets a soil analysis, plant identification with toxic lookalike warnings, or environmental impact report in seconds. Gemma 4 powers the intelligence. Freemium funds the growth.

## 2. Channel Positioning

Telegram is a **parallel primary channel** alongside MCP — not a secondary or derivative product.

```
PRIMARY (parallel):
  MCP Server ──→ AI power users (Claude, Codex, desktop workflows)
  Telegram Bot ─→ Everyone (mobile, instant, zero-friction)

SECONDARY:
  OEM ──→ Skyline Instruments (embedded hardware integration)

TERTIARY:
  Government Grants ──→ Institutional / research adoption
```

Both MCP and Telegram serve the same tools from the same backend. MCP offers depth (multi-turn reasoning, function chaining, structured output). Telegram offers reach (mobile-first, zero install, always available). A user who starts on Telegram and needs more depth naturally migrates to MCP. A user who starts with MCP and needs mobile access naturally uses Telegram. Neither is subordinate to the other.

The OEM channel (Skyline Instruments) operates independently — embedded hardware with LeafEngines intelligence baked in. Government grants fund research and institutional deployments.

## 3. Target Users

| Persona | Needs | Volume Potential |
|---------|-------|-----------------|
| **Row-crop farmer** | Soil data, planting advice, carbon credits | High (US: 2M farms) |
| **Agronomist / crop consultant** | Multi-county analysis, environmental reports | Medium |
| **Home gardener** | Plant ID, basic soil info | Very high |
| **Student / researcher** | Ag intelligence, water quality data | Medium |
| **Extension agent** | County-level reports, water quality | Low but influential |

## 4. Product Requirements

### 4.1 Core Features (MVP)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F1 | Slash commands | P0 | /soil, /identify, /ag, /env, /water, /carbon, /start, /help |
| F2 | Natural language | P0 | "soil data for Autauga County AL" routes to get_soil_data |
| F3 | FIPS code detection | P0 | Auto-detect 5-digit FIPS in any message |
| F4 | Formatted responses | P0 | Markdown with emoji headers, structured data cards |
| F5 | Auto-provisioning | P0 | New users get free API key on first message |
| F6 | Rate limiting | P0 | Dual meter: AI calls and data calls per user per day |
| F7 | Paywall message | P1 | When limit hit, message with upgrade link |
| F8 | Help system | P0 | /start and /help return full command reference |
| F9 | Plant photo identification | P0 | Send a photo to the bot for safe-identification with toxic lookalike warnings (existing feature, not new) |

### 4.2 Intelligence Layer (Gemma 4)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| G1 | Gemma 4 26B IT as default LLM | P0 | Replaces OpenAI for agricultural_intelligence, safe_identification, environmental_impact_analysis |
| G2 | Structured output | P0 | Function calling mode for consistent JSON responses |
| G3 | Graceful fallback | P1 | If Gemma 4 fails or times out, fall back to cached/template response |
| G4 | Prompt versioning | P1 | System prompts stored in DB, not hardcoded — iterate without redeploy |
| G5 | Thinking mode toggle | P2 | Enable Gemma 4 thinking for complex queries (costs more tokens) |

### 4.3 User Management

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| U1 | telegram_users table | P0 | telegram_id, api_key, tier, daily_count, created_at |
| U2 | Free tier auto-creation | P0 | First message creates user row + api_keys row |
| U3 | Daily counter reset | P0 | pg_cron job resets daily_count at midnight UTC |
| U4 | Tier levels | P1 | free (10/day), pro (100/day), enterprise (unlimited) |
| U5 | /subscribe command | P1 | Links to Stripe checkout |
| U6 | /usage command | P2 | Shows remaining calls today |

### 4.4 Multi-Channel (Phase 2)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| C1 | WhatsApp via Twilio | P1 | Same backend, Twilio webhook channel |
| C2 | Inline mode | P2 | @LeafEnginesBot soil 01001 in any chat |
| C3 | Group chat support | P2 | Bot responds only when @mentioned |

## 5. User Stories

**MVP:**

1. As a first-time user, I send /start to LeafEnginesBot and get a welcome message with all available commands. I am automatically enrolled in the free tier.

2. As a farmer, I type /soil 01073 and get a formatted soil analysis card with pH, organic matter, NPK, and recommendations — in under 5 seconds.

3. As a gardener, I send a photo of a plant and get a safety-first identification card with species name, toxic lookalike warnings, pet safety alerts, and environmental context — the bot's flagship feature.

4. As a forager, I type "identify wild carrot" and get the full lookalike analysis including the fatal poison hemlock warning with differentiators.

5. As a power user who hits the daily AI call limit, I get a paywall message with a link to upgrade to Pro.

6. As a returning user, my daily count resets at midnight and I can use the bot again.

**Phase 2:**

6. As a WhatsApp user, I send the same commands to the LeafEngines WhatsApp number and get identical responses.

7. As a group chat member, I type @LeafEnginesBot soil 01073 and the bot replies inline.

## 6. Success Metrics

| Metric | Target (Trial, 2 weeks) | Target (Production, 90 days) |
|--------|------------------------|------------------------------|
| DAU (Telegram) | 10 | 200 |
| Messages per user per day | 3+ | 5+ |
| Free-to-paid conversion | — | 3-5% |
| P95 response latency | <5s | <3s |
| Tool call success rate | >90% | >95% |
| Per-user daily cost | <$0.05 | <$0.03 |
| 7-day retention | >40% | >50% |

## 7. Monetization Model

| Tier | Price | Daily Calls | Features |
|------|-------|-------------|----------|
| Free | $0 | 10 | All tools, basic responses |
| Pro | $5/mo | 100 | All tools, extended analysis, priority |
| Enterprise | $25/mo | Unlimited | All tools, batch API, webhook integration |

**Unit economics (Gemma 4 26B on Groq):**
- Average tool call: ~500 input + 800 output tokens = ~1,300 tokens
- Cost per call: ~$0.001 (Groq) or ~$0.0008 (AI Studio free tier)
- Free user (10 calls/day): ~$0.01/day = ~$0.30/mo
- Pro user ($5/mo, 100 calls/day max): ~$0.10/day = ~$3/mo cost, $2 margin

## 8. Phased Rollout

### Trial (Week 1-2)
- Deploy with Gemma 4 integration
- Auto-provisioning + rate limiting
- Invite 5-10 users
- Monitor cost, quality, latency
- Iterate on response formatting

### Soft Launch (Week 3-4)
- Open to all Telegram users
- Free tier at 10 calls/day
- Add /subscribe with Stripe link
- Announce in ag/gardening communities
- Daily cost alerts

### Full Production (Week 5+)
- WhatsApp channel
- Group chat + inline mode
- Prompt versioning via DB
- Premium tools (VRT prescriptions, carbon credit filing)
- Fine-tune Gemma 4 on agricultural domain data

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Gemma 4 quality insufficient for ag domain | Medium | High | Keep OpenAI as fallback; build template responses |
| Abuse / spam overwhelms free tier | High | Medium | Strict per-user rate limit; global daily cap; block repeat offenders |
| Groq/AI Studio rate limits hit during peak | Medium | Medium | Multi-provider failover (Groq -> AI Studio -> Together) |
| Telegram bot token leaked | Low | High | Rotate immediately; webhook secret verification |
| Low free-to-paid conversion | High | Medium | A/B test free tier limits; add premium-only features |

## 10. Support Requirements (V1 — Day One)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| S1 | /support command | P0 | Creates ticket, notifies operator, acknowledges user |
| S2 | /status command | P0 | Real-time system health display |
| S3 | /feedback command | P1 | Non-urgent user feedback collection |
| S4 | /usage command | P1 | Shows remaining daily calls |
| S5 | /admin commands | P0 | Operator-only: view tickets, resolve, stats, health, broadcast, block |
| S6 | Auto-triage | P1 | Bot classifies ticket severity by keyword |
| S7 | Auto-response | P1 | Bot answers common issues without human |
| S8 | Health monitoring | P0 | pg_cron + edge function pings all services every 60s |
| S9 | Alerting | P0 | Telegram DM to operator on SEV1/2 within 5 min |
| S10 | Daily digest | P1 | Support metrics included in existing digest pipeline |

Full details: ~/operations/PRODUCT/LEAFENGINES_BOT_SUPPORT.md

## 11. Out of Scope (V1)

- Voice message support
- Proactive notifications / alerts (available via n8n/Node-RED integration)
- Custom tool creation by users
- Fine-tuned Gemma 4 model
- iOS/Android native app
