# Master Timeline

Cross-project timeline with milestones, deadlines, and dependencies.
Aligned to LEAFENGINES_LAUNCH_PLAN.md v2.0 (Telegram-driven).
Updated: 2026-05-29 — incorporates Bigfoot Blueprint (Planetary Directory schema deployed).

## Q2 2026 (May-June)

### Track L: Platform (enabler)

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 17-19 | Wire infrastructure | L0 | COMPLETED | CircuitBreaker, Cache, Telemetry, Arg fixes |
| May 20-22 | Dual meter + real data | L1 | COMPLETED | ai_count/data_count meters, no more hardcoded previews |
| May 23-25 | AI Gateway → OpenRouter | L2 | pending | Per-function model routing, streaming, cost caps, Lovable removed |

### Track T: Telegram Backbone

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 23 | Data model + migration | T0 | UNDERWAY | telegram_link table, channel column, Storage bucket |
| May 23-25 | Webhook + commands | T1 | pending | /start (welcome card + inline keyboard), /help (tier-grouped + live usage), /county, /soil, /water, /ag, /identify, /crop (1 free trial call), /usage, /link, BotFather setMyCommands registration |
| May 26-28 | Photo + AI commands | T2 | pending (needs L2) | /identify with Storage signed URL, /ag, streaming |
| May 29-30 | Hardening + compliance | T3 | blocked (T2) | Redaction, health probe, ROPA, rollback runbook |
| May 31-Jun 2 | Trial launch | T4 | blocked (T3) | 5-10 users, 48hr burn test, zero 500s |

### Track D: Bigfoot Blueprint (Planetary Directory) — NEW

Schema deployed 2026-05-29. Application bridge in progress.

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 29 | Schema deployment | D0 | COMPLETED | 8 tables, 2 triggers, 3 cron jobs, RLS policies live on Supabase |
| May 29-31 | Webhook → telegram_query_signals | D1 | pending (needs T1) | logQuerySignal() in telegram-webhook, triggers fire on every query |
| Jun 1-3 | Bigfoot autogen processor | D2 | pending (needs D1) | Edge function consumes queue, generates directory pages |
| Jun 4-6 | Directory page renderer (MVP) | D3 | pending (needs D2) | SSG: 7 mega-directories, FIPS-level pages, sitemap.xml |
| Jun 7-9 | Vendor onboarding flow | D4 | pending (needs D3) | Self-service registration, admin review, vendor pages |
| Jun 10-12 | Privacy hardening + FAO export | D5 | pending (needs D1) | Audit log, SHA-256 verification, export endpoint |
| Jun 13-15 | resolve_model() integration | D6 | pending (needs L2) | llm-service.ts refactored, model_used logged, fallback chain |

### Track Q: QGIS / OGC / ArcGIS

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 23 | Plugin verify | Q0 | UNDERWAY | Free-tier key works end-to-end |
| May 26-28 | QGIS v2.0 | Q1 | pending | Dual-meter display, free-tier support, resubmitted |
| May 29-31 | OGC CITE | Q2 | pending | Compliance test suite pass |
| Jun 1-3 | ArcGIS Marketplace | Q3 | blocked (Q2) | .esriAddinX submitted |

### Track A: Anti-Gravity SDK v3.0 (independent)

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 17+ | Phase 3: OGC CITE | 3 | pending | CITE compliance |
| May 24+ | Phase 3: ArcGIS compat | 3 | pending | ArcGIS integration |
| May 31+ | Phase 3: Production deploy | 3 | pending | WFS server GA |

### Post-launch

| Week | Milestone | Track | Deliverable |
|------|-----------|-------|-------------|
| Jun 4-6 | Hosting migration (Lovable → Vercel/CF) | L | Frontend independent |
| Jun 7+ | SDK v3.0 / ak_ prefix | L | 6-language regen |
| When volume | Edge caching (Cloudflare Worker) | L | Cached soil data |
| When egress | Photo storage → R2 | L | Zero egress photos |

## Q3 2026 (July-September)

| Week | Milestone | Track | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| Jul 1 | Telegram soft launch (open access) | T | pending | Free tier live for all |
| Jul 1 | Unified identity | T | pending | One API key, all channels |
| Jul 15 | Stripe /subscribe | L | pending | Pro/Team/Enterprise billing |
| Aug 1 | 200 DAU target | T | pending | Telegram + MCP combined |
| Aug 1 | 1,000 directory pages live | D | pending | Planetary directory visible to Google |
| Aug 15 | First OEM integration | L | pending | Dedicated endpoint + SLA |
| Sep 1 | ArcGIS Marketplace approved | Q | pending | Public listing |
| Sep 15 | 10,000 directory pages | D | pending | Self-building flywheel at scale |
| Sep 30 | Cross-channel sessions + teams | T | pending | /recent, /deepdive, group chat |
| Sep 30 | Vendor marketplace live (5+ vendors) | D | pending | Pay-per-lead revenue active |

## Upcoming Deadlines

| Date | Item | Track | Lead Time | Status |
|------|------|-------|-----------|--------|
| May 19 | L0 complete | L | 2 days | COMPLETED |
| May 22 | L1 complete | L | 5 days | COMPLETED |
| May 25 | L2 complete + T0/T1 start | L+T | 8 days | active |
| May 28 | T2 + Q1 complete | T+Q | 11 days | pending |
| May 29 | D0 schema deployed | D | — | COMPLETED |
| May 31 | D1 webhook signal logging | D | 2 days | pending (needs T1) |
| Jun 2 | T4 trial launch | T | 16 days | blocked by T3 |
| Jun 3 | D2 autogen processor | D | 3 days | pending (needs D1) |
| Jun 6 | D3 directory renderer MVP | D | 3 days | pending (needs D2) |
| Jun 6 | All channels live | All | 20 days | blocked by T4+Q3 |
| Jun 9 | D4 vendor onboarding | D | 3 days | pending (needs D3) |
| Jun 12 | D5 privacy hardening | D | 2 days | pending (needs D1) |
| Jun 15 | D6 resolve_model() | D | 2 days | pending (needs L2) |

## Completed (keep last 15)

| Date | Milestone | Project | Result |
|------|-----------|---------|--------|
| 2026-05-29 | Bigfoot Blueprint schema deployed | D | 8 tables, 2 triggers, 3 cron jobs on Supabase |
| 2026-05-22 | L1 dual meter + real data complete | L | ai_count/data_count active, getFreePreview removed |
| 2026-05-19 | L0 wire infrastructure complete | L | CircuitBreaker, Cache, Telemetry, Arg fixes |
| 2026-05-17 | Launch plan v2.0 (Telegram-driven) | LeafEngines | PRODUCT/LEAFENGINES_LAUNCH_PLAN.md |
| 2026-05-16 | Launch plan v1.0 | LeafEngines | Superseded by v2.0 |
| 2026-05 | Telemetry SDK 1.0.0 | SDK | npm published |
| 2026-04 | QGIS plugin v1.0.1 | QGIS | 229 downloads, 25 countries |
| 2026-04 | Free-tier bypass | API | x-free-tier header deployed |
| 2026-Q1 | n8n + Node-RED + MCP published | SDK | All three on npm |

## Dependency Map (updated with Track D)

```
Track L (Platform) ─── enables ──→ Track T (Telegram) ─── enables ──→ Track D (Bigfoot)
                                 ─── enables ──→ Track Q (QGIS/OGC)
Track L ─── enables ──→ Track D (via L2 for resolve_model)
Track A (Anti-Gravity) ─── independent
Track D1 ─── blocked by ──→ T1 (webhook must exist to log signals)
Track D2 ─── blocked by ──→ D1 (queue needs signals)
Track D3 ─── blocked by ──→ D2 (renderer needs pages)
Track D4 ─── blocked by ──→ D3 (vendors need directory pages)
Track D6 ─── blocked by ──→ L2 (model routing needs AI Gateway)
```

## Bigfoot Blueprint KPIs (Track D)

| Metric | Day 1 Target | Day 30 Target | Day 90 Target |
|--------|-------------|---------------|---------------|
| Directory pages generated | 0 (schema only) | 1,000 | 10,000 |
| Pages indexed by Google | 0 | 200 | 5,000 |
| Correlation edges | 0 | 500 | 10,000 |
| Vendor leads captured | 0 | 0 | 50 |
| Privacy snapshots exported | 0 | 30 (daily) | 90 (daily) |
| Auto-gen queue throughput | 0 | 100/day | 500/day |
