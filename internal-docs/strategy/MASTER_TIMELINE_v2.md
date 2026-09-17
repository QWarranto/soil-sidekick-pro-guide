# Master Timeline v2

Cross-project timeline with milestones, deadlines, and dependencies.
Aligned to LEAFENGINES_LAUNCH_PLAN.md v2.0 (Telegram-driven).
Updated: 2026-06-02 — adds **Track G: Global Location Expansion** (non-US: ISRIC SoilGrids, UKSO/NSRI, EU NUTS).
Supersedes: MASTER_TIMELINE.md (2026-05-29). Track G is **plan-only** until T4 closes and the global-expansion review gate (per `DEFERRED_GLOBAL_EXPANSION.md`) clears.

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
| May 23-25 | Webhook + commands | T1 | pending | /start, /help, /county, /soil, /water, /ag, /identify, /crop, /usage, /link, BotFather setMyCommands |
| May 26-28 | Photo + AI commands | T2 | pending (needs L2) | /identify with Storage signed URL, /ag, streaming |
| May 29-30 | Hardening + compliance | T3 | blocked (T2) | Redaction, health probe, ROPA, rollback runbook |
| May 31-Jun 2 | Trial launch | T4 | blocked (T3) | 5-10 users, 48hr burn test, zero 500s |

### Track D: Bigfoot Blueprint (Planetary Directory)

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 29 | Schema deployment | D0 | COMPLETED | 8 tables, 2 triggers, 3 cron jobs, RLS live |
| May 29-31 | Webhook → telegram_query_signals | D1 | pending (needs T1) | logQuerySignal() in telegram-webhook |
| Jun 1-3 | Bigfoot autogen processor | D2 | pending (needs D1) | Edge function consumes queue, generates pages |
| Jun 4-6 | Directory page renderer (MVP) | D3 | pending (needs D2) | SSG: 7 mega-directories, FIPS pages, sitemap.xml |
| Jun 7-9 | Vendor onboarding flow | D4 | pending (needs D3) | Self-service registration, admin review |
| Jun 10-12 | Privacy hardening + FAO export | D5 | pending (needs D1) | Audit log, SHA-256 verification, export endpoint |
| Jun 13-15 | resolve_model() integration | D6 | pending (needs L2) | llm-service.ts refactored, fallback chain |

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

### Track G: Global Location Expansion — PLANNED (gated)

**Status:** Plan-only. **Do not execute** until both gates clear:
1. T4 closes successfully (US trial: 48hr burn, zero 500s, ≥5 active users).
2. Global-expansion review gate per `DEFERRED_GLOBAL_EXPANSION.md` (revenue / capital prerequisites or explicit override).

Replaces the previous US-centric `{county_fips, state_code, county_name}` triple with a universal location envelope: `{lat, lon, country_iso, admin1_code, admin2_code, us_county_fips?, uk_grid_ref?, soilgrids_cell?, provider_source}`.

Routing rule: `country_iso==='US'` → SSURGO/USDA/FCC; `country_iso==='GB'` → UKSO/NSRI; else → ISRIC SoilGrids (universal 250 m fallback). EU adds NUTS-3 / ESDAC / LUCAS in Q3.

| Week | Milestone | Phase | Status | Depends on | Deliverable |
|------|-----------|-------|--------|------------|-------------|
| Jun 3-5 | Location envelope schema | G0 | planned | T4 | Add `country_iso`, `admin1_code`, `admin2_code`, `lat/lon`, `uk_grid_ref`, `soilgrids_cell`, `provider_source` to `counties` cache + indexes; backfill existing rows as `US` |
| Jun 6-8 | `global-geocode` edge function | G1 | planned | G0 | Nominatim + ISRIC 250 m cell resolver; `x-free-tier` supported; db-cached |
| Jun 9-11 | `uk-geocode` edge function | G2 | planned | G0 | postcodes.io + OS Names → OSGB grid ref + admin2 |
| Jun 12-14 | Router in `get-soil-data` | G3 | planned | G1, G2 | Country-ISO branch; graceful fallback to SoilGrids per error-handling memory |
| Jun 15-17 | `LocationIndicator` country selector | G4 | planned | G3 | GPS-first; country gate; postcode/place fields per locale |

### Track T extension: Non-US Telegram surface — PLANNED (gated on G3 + T4)

| Day | Milestone | Phase | Depends on | Deliverable |
|-----|-----------|-------|------------|-------------|
| Jun 18-19 | `/soil` accepts non-US input | T5 | G3, T4 | `/soil SW1A 1AA`, `/soil -1.25,52.95`, `/soil Bavaria DE` |
| Jun 20 | `/country` discovery command | T5 | T5 | Lists supported providers per ISO code; BotFather refresh |
| Jun 21-22 | International trial cohort | T6 | T5 | 5 UK + 5 EU testers, 48hr burn, parity with US T4 metrics |

### Track D extension: Bigfoot international shards — PLANNED (gated on D3 + D7 prerequisites)

| Day | Milestone | Phase | Depends on | Deliverable |
|-----|-----------|-------|------------|-------------|
| Jun 23-25 | `telegram_query_signals` country dimension | D7 | D1, G3 | Signal rows tagged with `country_iso`, `admin1_code` |
| Jun 26-28 | Directory renderer i18n shards | D8 | D3, D7 | `/gb/<grid>`, `/eu/<nuts3>`, `/world/<soilgrids-cell>` templates |
| Jun 29-30 | Sitemap + hreflang | D9 | D8 | Per-country sitemap split; hreflang on shared concepts |

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
| Jul 1 | Telegram soft launch (open access, US) | T | pending | Free tier live for all |
| Jul 1 | Unified identity | T | pending | One API key, all channels |
| Jul 8 | Non-US soft launch on Telegram | T+G | planned (gated) | `app.` subdomain + free-tier flow live for GB/EU |
| Jul 15 | Stripe /subscribe | L | pending | Pro/Team/Enterprise billing |
| Jul 22 | UKSO/NSRI provider hardening | G | planned | Cache TTLs, OS Names quota guard, attribution |
| Aug 1 | 200 DAU target (incl. 50 non-US) | T+G | pending | Geo split in analytics |
| Aug 1 | 1,000 directory pages live | D | pending | Planetary directory visible to Google |
| Aug 15 | First OEM integration | L | pending | Dedicated endpoint + SLA |
| Aug 15 | First EU directory pages indexed | D+G | planned | 200+ pages crawled by Google |
| Sep 1 | ArcGIS Marketplace approved | Q | pending | Public listing |
| Sep 1 | ESDAC / LUCAS connector (EU NUTS-3) | G | planned | EU-native soil layer beyond SoilGrids |
| Sep 15 | 10,000 directory pages | D | pending | Self-building flywheel at scale |
| Sep 30 | Cross-channel sessions + teams | T | pending | /recent, /deepdive, group chat |
| Sep 30 | Vendor marketplace live (5+ vendors) | D | pending | Pay-per-lead revenue active |
| Sep 30 | International vendor onboarding | D+G | planned | Country-scoped vendor pages in marketplace |

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
| Jun 2 | **Global-expansion review gate** | G | — | **decision required** (proceed with G0 or hold per `DEFERRED_GLOBAL_EXPANSION.md`) |
| Jun 3 | D2 autogen processor | D | 3 days | pending (needs D1) |
| Jun 5 | G0 schema (if gate cleared) | G | 3 days | planned |
| Jun 6 | D3 directory renderer MVP | D | 3 days | pending (needs D2) |
| Jun 6 | All US channels live | All | 20 days | blocked by T4+Q3 |
| Jun 9 | D4 vendor onboarding | D | 3 days | pending (needs D3) |
| Jun 11 | G2 uk-geocode | G | planned | depends on G0 |
| Jun 12 | D5 privacy hardening | D | 2 days | pending (needs D1) |
| Jun 14 | G3 router live | G | planned | depends on G1+G2 |
| Jun 15 | D6 resolve_model() | D | 2 days | pending (needs L2) |
| Jun 22 | T6 international trial complete | T+G | planned | depends on G4 |
| Jun 30 | D9 international sitemap | D+G | planned | depends on D8 |

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

## Dependency Map (with Track G)

```
Track L (Platform) ─── enables ──→ Track T (Telegram) ─── enables ──→ Track D (Bigfoot)
                                 ─── enables ──→ Track Q (QGIS/OGC)
Track L ─── enables ──→ Track D (via L2 for resolve_model)
Track A (Anti-Gravity) ─── independent

Track G (Global) ─── BLOCKED by ──→ T4 (US trial validation)
Track G ─── BLOCKED by ──→ Global-expansion review gate (DEFERRED_GLOBAL_EXPANSION.md)
Track G0 ─── enables ──→ G1 + G2 (geocoders)
Track G1 + G2 ─── enables ──→ G3 (router)
Track G3 ─── enables ──→ G4 (UI) + T5 (Telegram non-US) + D7 (signal country dim)
Track T5 ─── enables ──→ T6 (international trial)
Track D7 ─── enables ──→ D8 (i18n shards) ─── enables ──→ D9 (sitemap/hreflang)
```

## Track G Gate Criteria (must all be true to begin G0)

1. **T4 closed green:** 48hr burn test passed, zero unhandled 500s, ≥5 active users, telegram_query_signals flowing into D1.
2. **Budget cleared:** Review per `DEFERRED_GLOBAL_EXPANSION.md` — either revenue milestones met OR explicit founder override accepting the $80K dev cost.
3. **No regression in US KPIs:** ai_count/data_count meters stable; SSURGO + FCC paths healthy in the 7 days prior.
4. **L2 complete:** OpenRouter routing live so SoilGrids/UKSO AI summaries inherit the same model resolver.

## Track G KPIs (Day-30 / Day-90 after launch)

| Metric | Day 30 | Day 90 |
|--------|--------|--------|
| Non-US queries / day (Telegram) | 50 | 500 |
| Countries with ≥10 queries | 3 | 10 |
| ISRIC SoilGrids cache hit ratio | ≥60% | ≥80% |
| UK postcode resolutions / day | 20 | 200 |
| International directory pages live | 100 | 2,000 |
| Non-US pages indexed by Google | 20 | 500 |

## Bigfoot Blueprint KPIs (Track D) — unchanged

| Metric | Day 1 Target | Day 30 Target | Day 90 Target |
|--------|-------------|---------------|---------------|
| Directory pages generated | 0 (schema only) | 1,000 | 10,000 |
| Pages indexed by Google | 0 | 200 | 5,000 |
| Correlation edges | 0 | 500 | 10,000 |
| Vendor leads captured | 0 | 0 | 50 |
| Privacy snapshots exported | 0 | 30 (daily) | 90 (daily) |
| Auto-gen queue throughput | 0 | 100/day | 500/day |
