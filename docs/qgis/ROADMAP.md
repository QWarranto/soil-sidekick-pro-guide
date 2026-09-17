# Roadmap

Product roadmap with themes, epics, and milestones.
Aligned to LEAFENGINES_LAUNCH_PLAN.md v2.0 (Telegram-driven).

## Now (Current Cycle — May 17 – Jun 6)

| # | Epic | Track | Theme | Owner | Status | Target |
|---|------|-------|-------|-------|--------|--------|
| E1 | Wire existing infrastructure | L | Reliability | Reggie | **DONE** | May 19 |
| E2 | Dual meter + real data | L | Core product | Reggie | **DONE** | May 22 |
| E3 | AI Gateway → OpenRouter | L | AI control | Reggie | pending | May 25 |
| E4 | Telegram data model + webhook + BotFather registration | T | Consumer backbone | Reggie | unblocked | May 25 |
| E5 | Telegram photo + AI commands | T | Flagship on mobile | Reggie | blocked (E3) | May 28 |
| E6 | Telegram hardening + trial (/crop free taste) | T | Production readiness | Reggie | blocked (E5) | Jun 2 |
| E7 | QGIS v2.0 + dual-meter display | Q | Distribution | Reggie | unblocked | May 28 |
| E8 | OGC CITE compliance | Q+A | Standards | Reggie | pending | May 31 |
| E9 | ArcGIS Marketplace submission | Q | Distribution | Reggie | blocked (E8) | Jun 3 |
| E10 | GTM launch sequence (channels + paid) | G | Revenue | Reggie | draft ready | Jun 6 |

## Track G: Go-To-Market

Channel-driven user acquisition with per-channel attribution. Starts when L1 ships real data (now).

| # | Task | Channel | Effort | Dependencies | Metric |
|---|------|---------|--------|--------------|--------|
| G0 | Provision per-channel evaluation keys | Internal | Low | L1 complete | 5 keys created (gis, locallama, linkedin, agtalk, tff) |
| G1 | r/gis launch post (soil + ISOBUS + offline AI) | Reddit | Low | G0 | Post live, 50+ upvotes |
| G2 | r/LocalLLaMA launch post (offline Gemma angle) | Reddit | Low | G0 | Post live, 100+ upvotes |
| G3 | LinkedIn organic launch (enterprise angle) | LinkedIn | Low | G0 | Post live, 500+ impressions |
| G4 | AgTalk forum post (ISOBUS + VRT angle) | Forum | Low | G0 | Thread live, 10+ replies |
| G5 | The Farming Forum UK post (MAGIC + PDOK angle) | Forum | Low | G0 | Thread live, 5+ replies |
| G6 | 60–90s demo video (WFS → soil → ISOBUS → offline query) | Video | Medium | E7 (v2.0 QGIS) | Video published |
| G7 | LinkedIn Ads campaign (Agronomist, GIS Analyst titles) | Paid | Low | G3 | Campaign live, $50 test budget |
| G8 | Reddit Ads campaign (r/gis, r/agronomy targeting) | Paid | Low | G1, G2 | Campaign live, $25 test budget |
| G9 | Google Search Ads (QGIS ISOBUS, VRT export keywords) | Paid | Low | G1 | Campaign live, $25 test budget |
| G10 | QGIS promotional channels markdown published | Internal | Trivial | — | PRODUCT/QGIS_Promotional_Channels.md |
| G11 | Promotion sequence schedule (4–6 week stagger) | Internal | Low | G0 | Schedule doc published |
| G12 | Per-channel attribution report (key → signup mapping) | Internal | Low | G0 + 2 weeks | Attribution data flowing |

**G0 exit criteria:** 5 isolated evaluation keys provisioned in api_keys table with channel label and daily limits.

**G-Gate (launch gate):** E2 (real data) complete, E4 (Telegram) live, E7 (QGIS v2.0) shipped. GTM channels activate.

## Next (Post-Launch)

| # | Epic | Track | Theme | Owner | Dependencies |
|---|------|-------|-------|-------|--------------|
| E20 | Hosting migration (Lovable → Vercel/CF) | L | Independence | Reggie | E6 complete |
| E21 | SDK v3.0 / ak_ prefix | L | Developer experience | Reggie | E2 stable (dual meter proven) |
| E22 | Edge caching (Cloudflare Worker) | L | Performance | Reggie | >1k soil requests/day |
| E23 | Photo storage → R2 | L | Cost | Reggie | Egress > $5/mo |
| E24 | Discord bot (developer community bridge) | T+G | Reach | Reggie | E6 + unified identity |
| E25 | Slack bot (professional agronomy hub) | T+G | Revenue | Reggie | E6 + unified identity + Team tier proven |
| E26 | Microsoft Teams bot (institutional gateway) | T+G | Revenue | Reggie | E6 + Enterprise tier proven |

## Later (Planned — Cross-Platform Expansion)

Sourced from Later Phase Expansions document. All require unified identity (E14) as foundation.

| # | Epic | Track | Theme | Priority | Confidence | Notes |
|---|------|-------|-------|----------|------------|-------|
| E14 | Unified identity (one key, all channels) | T | Cross-platform | High | High | Foundation for E24–E26; links user_channels across platforms |
| E15 | Cross-channel session continuity | T | Stickiness | Medium | Medium | /recent, /deepdive, /favorites across MCP + mobile |
| E16 | WhatsApp channel (Twilio webhook) | T | Reach | Low | High | twilio-webhook already in launch plan |
| E17 | Fine-tuned Gemma 4 model | L | Quality | Low | Low | Dependent on sufficient training data |
| E18 | Discord: workflow control + push alerts | T | Developer funnel | Medium | Medium | /wf commands, n8n/Node-RED pipeline management via Discord |
| E19 | Slack: pooled team limits + group analysis | T | Team tier | Medium | High | Team API key shared across workspace; 150 AI/500 data daily |
| E30 | MS Teams: institutional export + compliance | T | Enterprise | Low | Medium | /export csv for compliance; Extension Agent target |
| E31 | Omnichannel support (tickets from any platform) | T | Operations | Low | High | /support + /feedback → single support_tickets table |
| E32 | n8n frost/soil alerts → Discord + Slack channels | T+L | Automation | Low | High | Extend notify-user edge function beyond Telegram DM |

### Architectural Prerequisites for Later Phase

The channel-agnostic architecture already supports multi-platform expansion with minimal refactoring:

1. **Channel Layer Expansion:** telegram-webhook + twilio-webhook router logic extends to slack-webhook, discord-webhook. Channel code handles input parsing + output formatting (Discord embeds, Slack block kit). Tool executor edge functions stay unchanged.
2. **Unified Identity Scaling:** user_channels table stores telegram_id, discord_id, slack_id. Single Pro/Team user queries across platforms with same dual-meter limits.
3. **Team Pooling:** Workspace-bound Team API keys pool daily resources (150 AI / 500 data) across all channels. Shared /soil outputs post to group chat.

## Milestones

| Date | Milestone | Contributes To | Status |
|------|-----------|----------------|--------|
| May 19 | Infrastructure wired (L0) | E1 | **DONE** |
| May 22 | Real data flowing + dual meter (L1) | E2 | **DONE** |
| May 23 | INFRA_TRACK synced, status report 013 | E1, E2 | **DONE** |
| May 25 | OpenRouter live, Lovable gone (L2) | E3 | pending |
| May 25 | Telegram data model + webhook + BotFather setMyCommands (T0-T1) | E4 | unblocked |
| May 28 | Telegram photo + AI live (T2) + QGIS v2.0 (Q1) | E5, E7 | blocked (E3) |
| May 31 | OGC CITE (Q2/A) + Telegram hardened (T3) | E8 | pending |
| Jun 2 | Telegram trial launch + /crop free taste (T4) | E6 | blocked |
| Jun 3 | ArcGIS submitted (Q3) | E9 | blocked |
| Jun 6 | All channels live + GTM sequence active | E10, Launch | pending |

## Completed

| Date | Epic | Result |
|------|------|--------|
| 2026-05-23 | L1 closed: dual-meter free-tier + real data + getFreePreview removed | mcp-server-v100-L1 deployed |
| 2026-05-23 | L0 closed: CircuitBreaker + Cache + telemetry + arg transforms + redaction | mcp-server-v99-L0 deployed |
| 2026-05-23 | INFRA_TRACK synced + status report 013 | INFRA/INFRA_TRACK.md, status_report_20260523 |
| 2026-05-23 | QGIS promotional channels RTF → markdown | PRODUCT/QGIS_Promotional_Channels.md |
| 2026-05-17 | Launch plan v2.0 (Telegram-driven) | PRODUCT/LEAFENGINES_LAUNCH_PLAN.md |
| 2026-05-16 | Launch plan v1.0 drafted | Superseded by v2.0 |
| 2026-05 | Telemetry SDK 1.0.0 published to npm | npm @ancientwhispers54/leafengines-telemetry |
| 2026-06 | QGIS plugin v1.0.10 published | 392 downloads (v1.0.2: 313, v1.0.4: 68, v1.0.10: 11), 25 countries |
| 2026-04 | Free-tier bypass deployed | x-free-tier header for get-soil-data |
| 2026-Q1 | n8n nodes published | npm n8n-nodes-leafengines |
| 2026-Q1 | Node-RED nodes published | npm node-red-contrib-leafengines |
| 2026-Q1 | MCP server published | npm @ancientwhispers54/leafengines-mcp-server |
