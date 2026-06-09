# Master Timeline v3

Cross-project timeline with milestones, deadlines, and dependencies.
Aligned to LEAFENGINES_LAUNCH_PLAN.md v2.0 (Telegram-driven).
Updated: 2026-06-08 — patches v4 canonical (2026-06-07) with:
  (a) **Track G** (Global Location Expansion) re-appended with v4-aligned dates
  (b) Track D international arm (D7–D9) tagged "deferred with D1"
  (c) Q3 rows adjusted to match deferred Bigfoot pipeline
  (d) **Track M reconciliation** — inlines 5 monetization gaps (Founders collision guard, `x-free-tier` debit rule, fingerprint-abuse per-pathway rules, dormancy clause, QA sandbox credit pool) into M2/M4

Supersedes: MASTER_TIMELINE.md (v4, 2026-06-07) and MASTER_TIMELINE_v2.md (2026-06-02).
Track G remains **plan-only** until T4 closes green and the global-expansion review gate (per `DEFERRED_GLOBAL_EXPANSION.md`) clears.

---

## Q2 2026 (May-June) — canonical from v4

### Track L: Platform (enabler)

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 17-19 | Wire infrastructure | L0 | COMPLETED | CircuitBreaker, Cache, Telemetry, Arg fixes |
| May 20-22 | Dual meter + real data | L1 | COMPLETED | ai_count/data_count meters, no more hardcoded previews |
| May 23-25 | AI Gateway → OpenRouter | L2 | **COMPLETED** | `llm-router.ts`, per-function model routing, streaming, cost caps, Lovable removed |

### Track T: Telegram Backbone

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 23 | Data model + migration | T0 | COMPLETED | telegram_link table, channel column, Storage bucket |
| May 23-25 | Webhook + commands | T1 | **COMPLETED** | 13/13 commands, real data, BotFather setMyCommands |
| May 26-28 | Photo + AI commands | T2 | **COMPLETED** | /identify with Storage signed URL, /ag, streaming |
| Jun 8-11 | Hardening + compliance | T3 | active | Redaction, health probe, ROPA, rollback runbook |
| Jun 12-14 | Trial launch | T4 | blocked (T3) | 5-10 users, 48hr burn test, zero 500s |

### Track D: Bigfoot Blueprint (Planetary Directory)

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 29 | Schema deployment | D0 | COMPLETED | 8 tables, 2 triggers, 3 cron jobs, RLS live |
| **Deferred** | Webhook → telegram_query_signals | D1 | **deferred to production** | logQuerySignal() in telegram-webhook |
| Blocked on D1 | Bigfoot autogen processor | D2 | deferred (D1) | Edge function consumes queue, generates pages |
| Blocked on D1 | Directory page renderer (MVP) | D3 | deferred (D1) | SSG: 7 mega-directories, FIPS pages, sitemap.xml |
| Blocked on D1 | Vendor onboarding flow | D4 | deferred (D1) | Self-service registration, admin review |
| Blocked on D1 | Privacy hardening + FAO export | D5 | deferred (D1) | Audit log, SHA-256 verification, export endpoint |
| Post-T4 | resolve_model() integration | D6 | unblocked (L2 done) | llm-service.ts refactored, fallback chain |

### Track Q: QGIS / OGC / ArcGIS

| Week | Milestone | Phase | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| May 23 | Plugin verify | Q0 | COMPLETED | Free-tier key works end-to-end |
| May 26-28 | QGIS v2.0 | Q1 | active | Dual-meter display, free-tier support, resubmitted |
| May 29-31 | OGC CITE | Q2 | COMPLETED via Track A | CITE 94% pass |
| Jun 1-3 | ArcGIS Marketplace | Q3 | pending | .esriAddinX submitted |
| Jun 15-21 | QGIS v1.0.3 dual-auth + reduced-resolution | Q4 | planned (gates M3) | Plugin honors credit-vs-sub token split |

### Track A: Anti-Gravity SDK v3.0

| Phase | Status | Deliverable |
|-------|--------|-------------|
| Phase 3 (full) | **COMPLETED** (11/11, CITE 94%) | WFS server GA, OGC CITE, ArcGIS compat, production deploy |

---

## Track M: Monetization (Credit Economy + Pathway Expansion) — from v4, reconciled

**Gates:** M0 starts only after **T4 closes green**. M3 (Zapier) requires **QGIS v1.0.3 dual-auth (Q4)** shipped.

| Week | Milestone | Phase | Status | Depends on | Deliverable |
|------|-----------|-------|--------|------------|-------------|
| Jun 15-17 | Credit ledger + Stripe products | M0 | planned | T4 | `credits_ledger` table, `lf_live_…` token unification on existing SHA-256 hash, Stripe one-time products ($5/$25/$100/$300) |
| Jun 18-20 | Stripe webhook → credit grant | M1 | planned | M0 | `stripe-credit-grant` edge function, idempotency on `event.id`, audit row per grant |
| Jun 21-24 | **Precedence rule + collision guards** | M2 | planned | M1 | **(a) Precedence:** subscription quota → credits → metered overage. **(b) Founders Program guard:** `source='credit_topup'` flag excluded from 500/5k/25k auto-upgrade thresholds. **(c) `x-free-tier` debit rule:** free-tier endpoints (`get-soil-data`, `county-lookup`) do NOT debit credits even when a token is present — header wins. **(d) `stripe-usage-sync` reconciliation:** sub-tier callers never double-charged. |
| Jun 25-28 | QGIS v1.0.3 dual-auth ship | M3-gate | planned | Q4 | Hard block clears before pathway expansion |
| Jun 29 – Jul 5 | Zapier pathway | M3 | planned | M2, Q4 | Public Zapier app, 6 triggers, credit debit per zap-run |
| Jul 6-12 | ArcGIS pathway | M4 | planned | M3 | .esriAddinX consumes credits via dual-auth token |
| Jul 13-19 | **Fingerprint-abuse + dormancy + sandbox** | M4.5 | planned | M3 | **(a) Per-pathway fingerprint rules:** Telegram/WhatsApp/MCP callers exempted from IP+UA dedup (shared infra); web + Zapier + ArcGIS keep strict rules. **(b) 24-month dormancy clause** on unused credits (bounds deferred-revenue liability for SOC 2). **(c) QA sandbox credit pool:** hardcoded test keys get isolated pool that auto-resets nightly; real balances never drained by sandbox traffic. |
| Jul 20-26 | WhatsApp pathway | M5 | planned | M4.5 | Twilio webhook + credit debit |

---

## Track G: Global Location Expansion — PLANNED (gated)

**Status:** Plan-only. Re-appended from v2 with v4-aligned dates. **Do not execute** until both gates clear:
1. T4 closes successfully (US trial: 48hr burn, zero 500s, ≥5 active users).
2. Global-expansion review gate per `DEFERRED_GLOBAL_EXPANSION.md` (revenue / capital prerequisites or explicit override).

Replaces US-centric `{county_fips, state_code, county_name}` triple with a universal location envelope: `{lat, lon, country_iso, admin1_code, admin2_code, us_county_fips?, uk_grid_ref?, soilgrids_cell?, provider_source}`.

Routing rule: `country_iso==='US'` → SSURGO/USDA/FCC; `country_iso==='GB'` → UKSO/NSRI; else → ISRIC SoilGrids (universal 250 m fallback). EU adds NUTS-3 / ESDAC / LUCAS in Q3.

| Week | Milestone | Phase | Status | Depends on | Deliverable |
|------|-----------|-------|--------|------------|-------------|
| Jun 15-17 | Location envelope schema | G0 | planned | T4 | Add `country_iso`, `admin1_code`, `admin2_code`, `lat/lon`, `uk_grid_ref`, `soilgrids_cell`, `provider_source` to `counties` cache + indexes; backfill existing rows as `US` |
| Jun 18-20 | `global-geocode` edge function | G1 | planned | G0 | Nominatim + ISRIC 250 m cell resolver; `x-free-tier` supported; db-cached |
| Jun 21-23 | `uk-geocode` edge function | G2 | planned | G0 | postcodes.io + OS Names → OSGB grid ref + admin2 |
| Jun 24-26 | Router in `get-soil-data` | G3 | planned | G1, G2 | Country-ISO branch; graceful fallback to SoilGrids |
| Jun 27-29 | `LocationIndicator` country selector | G4 | planned | G3 | GPS-first; country gate; postcode/place fields per locale |

**Note:** G0 (Jun 15-17) and M0 (Jun 15-17) overlap in calendar. Both gate on T4 close; if T4 slips, both slide together. Sequence within the week: M0 schema first (touches `api_keys`/`credits_ledger`), then G0 schema (touches `counties`) — no table conflict.

### Track T extension: Non-US Telegram surface — PLANNED (gated on G3 + T4)

| Day | Milestone | Phase | Depends on | Deliverable |
|-----|-----------|-------|------------|-------------|
| Jun 30 – Jul 2 | `/soil` non-US + `/country` discovery | T5 | G3, T4 | `/soil SW1A 1AA`, `/soil -1.25,52.95`, `/soil Bavaria DE`; BotFather refresh |
| Jul 3-4 | International trial cohort | T6 | T5 | 5 UK + 5 EU testers, 48hr burn, parity with US T4 metrics |

### Track D extension: Bigfoot international shards — DEFERRED with D1

| Milestone | Phase | Status | Deliverable |
|-----------|-------|--------|-------------|
| `telegram_query_signals` country dimension | D7 | **deferred with D1** | Signal rows tagged with `country_iso`, `admin1_code` (lights up once D1 ships in production) |
| Directory renderer i18n shards | D8 | **deferred with D1/D3** | `/gb/<grid>`, `/eu/<nuts3>`, `/world/<soilgrids-cell>` templates |
| Sitemap + hreflang | D9 | **deferred with D1/D3** | Per-country sitemap split; hreflang on shared concepts |

---

## Q3 2026 (July-September) — adjusted

| Week | Milestone | Track | Status | Deliverable |
|------|-----------|-------|--------|-------------|
| Jul 1 | Telegram soft launch (open access, US) | T | pending | Free tier live for all |
| Jul 1 | Unified identity (`lf_live_…`) | T+M | pending | One API key, all channels |
| Jul 8 | Non-US soft launch on Telegram | T+G | planned (gated) | `app.` subdomain + free-tier flow live for GB/EU |
| Jul 15 | Stripe /subscribe | L+M | pending | Pro/Team/Enterprise billing live alongside credit top-ups |
| Jul 22 | UKSO/NSRI provider hardening | G | planned | Cache TTLs, OS Names quota guard, attribution |
| Aug 1 | 200 DAU target (incl. ~25 non-US) | T+G | pending | Scaled down from v2's 50 non-US to match deferred D-pipeline |
| Aug 15 | First OEM integration | L | pending | Dedicated endpoint + SLA |
| Sep 1 | ArcGIS Marketplace approved | Q | pending | Public listing |
| Sep 1 | ESDAC / LUCAS connector (EU NUTS-3) | G | planned | EU-native soil layer beyond SoilGrids |
| Sep 30 | Cross-channel sessions + teams | T | pending | /recent, /deepdive, group chat |

**Removed from v2 Q3** (depend on deferred D1/D3/D4):
- ~~Aug 1: 1,000 directory pages live~~ → moves to "when D1 ships in production"
- ~~Aug 15: First EU directory pages indexed~~ → same
- ~~Sep 15: 10,000 directory pages~~ → same
- ~~Sep 30: Vendor marketplace live~~ → same
- ~~Sep 30: International vendor onboarding~~ → same

---

## Upcoming Deadlines

| Date | Item | Track | Status |
|------|------|-------|--------|
| Jun 11 | T3 complete | T | active |
| Jun 14 | T4 trial complete (gates G0 + M0) | T | blocked by T3 |
| Jun 14 | **Global-expansion review gate** | G | **decision required** |
| Jun 17 | M0 credit ledger + G0 schema | M+G | planned |
| Jun 24 | M2 precedence + collision guards live | M | planned |
| Jun 26 | G3 router live | G | planned |
| Jun 28 | QGIS v1.0.3 dual-auth (gates M3) | Q | planned |
| Jul 4 | T6 international trial complete | T+G | planned |
| Jul 5 | M3 Zapier pathway live | M | planned |
| Jul 19 | M4.5 fingerprint + dormancy + sandbox | M | planned |

## Completed (keep last 15)

| Date | Milestone | Project | Result |
|------|-----------|---------|--------|
| 2026-06-07 | Track A Phase 3 complete | A | 11/11, CITE 94% |
| 2026-06-06 | T2 photo + AI commands | T | /identify + /ag streaming |
| 2026-06-05 | T1 commands complete | T | 13/13 real data |
| 2026-05-29 | Bigfoot Blueprint schema deployed | D | 8 tables, 2 triggers, 3 cron jobs |
| 2026-05-25 | L2 AI Gateway → OpenRouter | L | llm-router.ts live |
| 2026-05-22 | L1 dual meter + real data | L | ai_count/data_count active |
| 2026-05-19 | L0 wire infrastructure | L | CircuitBreaker, Cache, Telemetry |
| 2026-05-17 | Launch plan v2.0 (Telegram-driven) | LeafEngines | LEAFENGINES_LAUNCH_PLAN.md |
| 2026-05 | Telemetry SDK 1.0.0 | SDK | npm published |
| 2026-04 | QGIS plugin v1.0.1 | QGIS | 229 downloads, 25 countries |
| 2026-04 | Free-tier bypass | API | x-free-tier header deployed |
| 2026-Q1 | n8n + Node-RED + MCP published | SDK | All three on npm |

---

## Dependency Map

```
Track L ─── enables ──→ T, D, G (AI summaries)
Track T (T0–T4) ─── enables ──→ T5/T6 (intl, via G3) and M0 (post-T4)
Track Q (Q4 dual-auth) ─── gates ──→ M3 (Zapier)
Track A ─── COMPLETED, independent

Track G ─── BLOCKED by ──→ T4 + global-expansion review gate
G0 ─── enables ──→ G1 + G2 ─── enables ──→ G3 ─── enables ──→ G4 + T5 + (D7 once D1 unblocks)
T5 ─── enables ──→ T6

Track M ─── BLOCKED by ──→ T4
M0 → M1 → M2 (precedence + guards) → M3 (needs Q4) → M4 → M4.5 → M5

D1 ─── DEFERRED to production ──→ blocks D2–D9, including international shards D7–D9
```

## Track G Gate Criteria (must all be true to begin G0)

1. **T4 closed green:** 48hr burn, zero 500s, ≥5 active users.
2. **Budget cleared:** Review per `DEFERRED_GLOBAL_EXPANSION.md` — revenue milestones met OR explicit founder override accepting $80K dev cost.
3. **No US KPI regression** in the 7 days prior.
4. **L2 complete** ✅ (cleared 2026-05-25).

## Track M Gate Criteria

1. **T4 closed green** (same as G).
2. **`stripe-usage-sync` precedence rule** specified before M3 launches.
3. **QGIS v1.0.3 dual-auth (Q4)** shipped before Zapier (M3).
4. **Founders Program collision guard** in place before any credit-purchase endpoint goes live (M2).

## Track G KPIs (Day-30 / Day-90 after G launch)

| Metric | Day 30 | Day 90 |
|--------|--------|--------|
| Non-US queries / day (Telegram) | 50 | 500 |
| Countries with ≥10 queries | 3 | 10 |
| ISRIC SoilGrids cache hit ratio | ≥60% | ≥80% |
| UK postcode resolutions / day | 20 | 200 |

(International directory-page KPIs removed — depend on deferred D1.)

## Track M KPIs (Day-30 / Day-90 after M0)

| Metric | Day 30 | Day 90 |
|--------|--------|--------|
| Credit top-up GMV / month | $2K | $15K |
| % of API calls debited from credits (vs sub quota) | 10% | 25% |
| Founders Program false-promotions from credit top-ups | 0 | 0 |
| Sandbox-driven real-balance debits | 0 | 0 |
| Dormant-credit liability on books | bounded ≤24mo | bounded ≤24mo |
