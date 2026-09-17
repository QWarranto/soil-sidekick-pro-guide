# LeafEngines Integration & Launch Plan — v2.0 (Telegram-Driven)

**Version:** 2.0
**Date:** May 17, 2026
**Status:** Active
**Owner:** Reggie Rice
**Reporting cycle:** 72-hour status reports in ~/.openclaw/workspace/status_reports/

---

## 0. Doctrine

1. **Telegram is the consumer backbone.** Every infrastructure decision is tested against what Telegram demands at scale.
2. **The codebase is the spec.** Existing contracts (SS_API_ key format, x-free-tier inbound-only, Lovable AI Gateway as sanctioned LLM path) are immovable until a migration is approved.
3. **Implementation changes, not contract changes.** Fix what's broken using existing interfaces. Don't change the contract to fix the bug.
4. **Dual metering is a functional requirement, not a pricing decision.** Telegram cannot enforce "3 IDs today, /soil unlimited" with a single counter.
5. **LLM failover is a reliability requirement, not a cost optimization.** If Telegram is the backbone, safe_identification going down = consumer-facing outage.
6. **Lovable dissolves in two independent steps, post-launch.** AI Gateway → OpenRouter (env var swap). Hosting → Vercel/Cloudflare (CI/CD pipeline). Neither blocks launch.

---

## 1. Workstreams and Their 72-Hour Report Tracks

Four parallel workstreams. Each reports progress in the 72-hour cycle. Each has its own tracking doc. Dependencies between workstreams are explicit.

| Track | Name | 72-hour report key | Tracking doc | Lead |
|-------|------|--------------------|--------------|------|
| T | Telegram Backbone | `telegram_backbone` | This doc | Reggie |
| A | Anti-Gravity SDK v3.0 / OGC | `antigravity_sdk` | ~/.openclaw workspace | Reggie |
| Q | QGIS / OGC / ArcGIS Distribution | `ogc_qgis` | ~/.openclaw workspace | Reggie |
| L | LeafEngines Platform (MCP + infra) | `leafengines_platform` | This doc | Reggie |

**Cross-track dependencies:**

```
Track T (Telegram) ─── depends on ──→ Track L (Platform: dual meter, LLM router, arg fixes)
Track A (Anti-Gravity) ─── independent ──→ shares QGIS plugin surface with Track Q
Track Q (QGIS/ArcGIS) ─── depends on ──→ Track L (Platform: real data flowing, free-tier path)
Track L (Platform) ─── enables ──→ Tracks T and Q
```

Track L is the enabler. It goes first. Then T and Q can parallel. Track A is independent.

---

## 2. Track L: LeafEngines Platform (Foundation)

Everything the other tracks need before they can ship.

### Phase L0 — Pre-flight + Wire Dormant Infrastructure (72 hours: May 17-19)

| # | Task | What it enables | Effort | Blocks | Report metric |
|---|------|-----------------|--------|--------|---------------|
| L0.1 | Run Supabase linter + security scan | Baseline | Low | — | errors: [] |
| L0.2 | Wire CircuitBreaker into MCP server for downstream calls (import from `_shared/graceful-degradation.ts`) | Cascade prevention | Low | — | Breaker wired for 5 providers |
| L0.3 | Wire APICacheManager into MCP server for data tool calls | Cache soil lookups | Low | — | Cache layer active |
| L0.4 | Fix telemetry writes: change MCP server `createClient` to use `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY` | Observability | 1 line | — | Telemetry rows visible |
| L0.5 | Fix MCP arg transform for `get_soil_data`: add FIPS lookup before forwarding (MCP sends `county_fips`, downstream needs `county_name`+`state_code`+`county_fips`) | Real data flows | Medium | T1 | soil data returns real values |
| L0.6 | Fix MCP arg transform for `safe_identification`: verify existing transform (lines 413-426) passes correctly | ID function works | Low | T1 | identify returns real results |
| L0.7 | Update free preview text (line 237: still says "GPT-4o") | Accuracy | Trivial | — | No stale model refs |
| L0.8 | Extend `mcp_tool_call_log` redaction list for `image_url`, `signed_url`, high-precision lat/lon | PII hygiene | Low | — | No PII in audit log |
| L0.9 | `search_path = ''` sweep for SECURITY DEFINER functions | Hardening | Low | — | Zero violations |

**L0 exit criteria:** Linter clean, telemetry writing, arg transforms verified with test calls, breakers wired.

### Phase L1 — Dual Meter + Real Data (72 hours: May 20-22)

| # | Task | What it enables | Effort | Blocks | Report metric |
|---|------|-----------------|--------|--------|---------------|
| L1.1 | Execute dual-meter migration SQL (~/operations/sql/dual_meter_migration.sql) against Supabase | Per-command quotas | Low (SQL) | T1, Q2 | Columns exist, cron jobs active |
| L1.2 | Update MCP server rate-limit logic to use dual meters (`daily_ai_count` vs `daily_data_count`) | Correct metering | Medium | T1 | AI and data calls metered separately |
| L1.3 | Replace `getFreePreview()` with real downstream calls: `county-lookup` and `get-soil-data` via `supabase.functions.invoke()` using a server-side provisioned key | Free-tier gets real data | Medium | Q2 | Free-tier returns real county/soil data |
| L1.4 | Replace `getFreePreview()` for `agricultural_intelligence`: rate-limited real call (5 AI/day free) | Free-tier AI access | Medium | T1 | Free-tier returns real analysis |
| L1.5 | Add `safe_identification` to free-tier set with strict rate limit (3/day) | Flagship accessible | Medium | T1 | Free-tier can identify plants |
| L1.6 | Remove `getFreePreview()` function entirely | Dead code gone | Trivial | — | No hardcoded previews |
| L1.7 | Paywall messages with dual-meter context: "3/3 identifications today. /soil still available!" | User experience | Low | T1 | Users see differentiated limits |

**L1 exit criteria:** All 3 critical functions return real data for free-tier users. Dual meter active. Single `daily_call_count` preserved for backward compatibility.

### Phase L2 — AI Gateway Migration (72 hours: May 23-25)

| # | Task | What it enables | Effort | Blocks | Report metric |
|---|------|-----------------|--------|--------|---------------|
| L2.1 | Sign up for OpenRouter, get API key, add `OPENROUTER_API_KEY` to Supabase Secrets | AI routing control | 30 min | — | Key in Secrets |
| L2.2 | Create `_shared/llm-router.ts`: thin wrapper over OpenRouter API with per-function model selection, cost caps, and streaming support | Single LLM entry point | Medium | T1, T4 | Router module created |
| L2.3 | Wire llm-router into `safe-identification`: route to `google/gemini-2.5-flash` (multimodal) | Optimal model for flagship | Medium | T4 | identify uses Gemini Flash |
| L2.4 | Wire llm-router into `agricultural-intelligence`: route to `openai/gpt-4o` (reasoning) | Best model for analysis | Medium | — | ag-intel uses GPT-4o |
| L2.5 | Wire llm-router into `beginner-guidance`: route to `anthropic/claude-3.5-haiku` (fast, cheap) | Cost-efficient guidance | Low | — | guidance uses Haiku |
| L2.6 | Add dual-path logic to 4 Lovable-only functions (`generate-comparison-image`, `generate-vrt-prescription`, `plant-id-comparison`, `smart-report-summary`): check `OPENROUTER_API_KEY` first, fall back to `LOVABLE_API_KEY` | Complete AI path coverage | Low | — | All functions route through OpenRouter |
| L2.7 | Test all 6+ LLM-dependent functions in staging with OpenRouter | Verification | 2 hours | — | All functions return valid JSON |
| L2.8 | Production cutover: verify OpenRouter works with live traffic for 24h | Confidence | Low | — | Zero regression vs Lovable |
| L2.9 | Remove `LOVABLE_API_KEY` from Supabase Secrets | Clean cutover | 5 min | — | Lovable Gateway gone |

**L2 exit criteria:** All LLM calls go through OpenRouter. Per-function model routing active. Lovable AI Gateway removed. Cost caps enforced. Streaming available.

---

## 3. Track T: Telegram Backbone

Depends on L1 (dual meter, real data) and L2 (LLM router).

### Phase T0 — Data Model (24 hours, starts when L1 completes)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| T0.1 | Migration: `telegram_link` table + `api_keys.channel` column + Storage bucket `telegram-uploads` with RLS | Low | Table + bucket created |
| T0.2 | `channel='web'` backfill on existing `api_keys` rows | Low | Zero null channel rows |
| T0.3 | Founders auto-upgrade: skip `channel='telegram' AND linked_user_id IS NULL` | Low | Ghost keys excluded |

### Phase T1 — Webhook + Commands (72 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| T1.1 | `telegram-webhook` edge function: secret-token validation, idempotent on `update_id` | Medium | Webhook accepts valid token, rejects invalid |
| T1.2 | `/start` auto-provision: creates `telegram_link` + `api_keys` row with `channel='telegram'`, tier `free`, dual-meter key | Medium | New user gets provisioned key |
| T1.3 | `/help`, `/county`, `/soil` — route through mcp-server with dual-meter enforcement | Medium | Commands return real data |
| T1.4 | `/link` one-time-code: issuance page at `app.soilsidekickpro.com/link-telegram` | Low | Link flow works end-to-end |
| T1.5 | Inbound `/start` rate-limit: 1 per IP/hour via `rate_limit_tracking` | Low | Abuse bounded |

### Phase T2 — Photo + AI Commands (72 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| T2.1 | `/identify` photo flow: getFile → Storage signed URL → safe-identification via llm-router → response | Medium | 4MB photo succeeds via Storage, not inline base64 |
| T2.2 | Streaming: `sendChatAction("typing")` heartbeat for AI calls >2s | Low | No 5-second silence |
| T2.3 | `/ag` and `/recommend`: AI commands through llm-router with dual-meter enforcement | Low | AI commands return real analysis |
| T2.4 | Quota messages: "3/3 identifications today. /soil still available!" | Low | Users see differentiated limits |

### Phase T3 — Hardening + Compliance (48 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| T3.1 | Redaction: extend list for `image_url`, `signed_url`; set `access_source='telegram'` | Low | No PII in audit log |
| T3.2 | `api-health-monitor` Telegram `getMe` probe + per-channel breaker scope | Low | Telegram outage can't brown out web |
| T3.3 | ROPA amendment: add Telegram + OpenRouter sub-processor rows | Low | ROPA current |
| T3.4 | SAR amendment for Telegram-only users | Low | GDPR procedure covers new channel |
| T3.5 | Rollback runbook in `OPERATIONAL_MAINTENANCE.md` | Low | 4-step rollback documented |
| T3.6 | Register webhook via connector gateway with derived secret_token | Low | Webhook registered |

### Phase T4 — Trial Launch (72 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| T4.1 | Trial with 5-10 invited users | Low | Real users, real commands |
| T4.2 | 48-hour burn test: zero 500s on critical functions | Low | P95 <2s data, <5s AI |
| T4.3 | Verify `mcp_tool_call_log` shows `access_source='telegram'`, dual-meter counts correct | Low | Telemetry confirms |
| T4.4 | Lovable AI Gateway cost-ceiling alert for Telegram traffic class | Low | Alert fires on synthetic spike |

---

## 4. Track Q: QGIS / OGC / ArcGIS Distribution

Depends on L1 (real data flowing, free-tier path). Partially overlaps with Track A (Anti-Gravity).

### Phase Q0 — Current Plugin Verification (24 hours, starts when L1 completes)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| Q0.1 | Verify QGIS plugin works against free-tier key (single meter → dual meter) | Low | Free-tier county_lookup succeeds |
| Q0.2 | Update README with launch URL + key-issuance flow | Low | README current |
| Q0.3 | Verify API response shape unchanged (no SDK regen needed) | Low | Plugin works without SDK update |

### Phase Q1 — QGIS v2.0 + Dual-Meter Display (72 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| Q1.1 | Add dual-meter display in QGIS dialog ("3/5 AI calls today") | Medium | Users see differentiated limits |
| Q1.2 | Add free-tier support (no API key required for basic soil lookups) | Low | Zero-config start |
| Q1.3 | Version bump to 2.0.0, resubmit to QGIS plugin repo | Low | Submitted |

### Phase Q2 — OGC CITE Compliance (72 hours, overlaps Track A Phase 3)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| Q2.1 | Run OGC CITE compliance test suite against WFS server | Medium | CITE test results |
| Q2.2 | Fix any compliance failures | Varies | Pass rate |
| Q2.3 | Document WFS endpoint for ArcGIS consumption | Low | ArcGIS can connect |

### Phase Q3 — ArcGIS Marketplace (72 hours)

| # | Task | Effort | Report metric |
|---|------|--------|---------------|
| Q3.1 | ArcGIS Pro SDK: create add-in project | High | Project scaffolded |
| Q3.2 | Implement soil/plant tools as ArcGIS geoprocessing tools | High | Tools functional |
| Q3.3 | Package as .esriAddinX, submit to ArcGIS Marketplace | Medium | Submitted |

---

## 5. Track A: Anti-Gravity SDK v3.0 / OGC

Independent. Runs in parallel. Shares QGIS plugin surface with Track Q.

| Phase | Scope | Status | Report metric |
|-------|-------|--------|---------------|
| Phase 1 (Foundation) | GetCapabilities, Server structure, QGIS plugin, Config management | DONE (4/4) | 100% |
| Phase 2 (Compliance) | GetFeature, DescribeFeatureType, Transaction (WFS-T), Testing framework | DONE (4/4) | 100% |
| Phase 3 (Enterprise) | OGC CITE compliance, ArcGIS compatibility, Production deployment | PENDING (0/3) | 0% |

**Cross-track coordination:**
- A Phase 3 OGC CITE testing overlaps with Q2 — share test results
- A Phase 3 ArcGIS compatibility overlaps with Q3 — share integration patterns
- A QGIS plugin (v1.0.10 published) is the base for Q1 upgrade

---

## 6. 72-Hour Report Cycle Integration

Each report (JSON in ~/.openclaw/workspace/status_reports/) gains four track sections:

```json
{
  "report_id": "report_011",
  "timestamp": "2026-05-19T10:00:00",
  "period": "May 16 – May 19, 2026",
  "overall_pct": 15,
  "tracks": {
    "telegram_backbone": {
      "name": "📱 Telegram Backbone",
      "pct": 0,
      "status": "BLOCKED",
      "phase": "T0",
      "blocked_by": "L1",
      "accomplishments": [],
      "blockers": ["Waiting for L1 dual meter + real data"],
      "next": ["T0.1: telegram_link migration"]
    },
    "antigravity_sdk": {
      "name": "🚀 Anti-Gravity / SDK v3.0",
      "pct": 72,
      "status": "AHEAD",
      "phase": "Phase 3",
      "accomplishments": ["Phase 1-2 complete"],
      "blockers": ["OGC CITE pending", "ArcGIS compatibility pending"],
      "next": ["Run CITE test suite", "ArcGIS integration"]
    },
    "ogc_qgis": {
      "name": "🗺️ QGIS / OGC / ArcGIS",
      "pct": 5,
      "status": "BLOCKED",
      "phase": "Q0",
      "blocked_by": "L1",
      "accomplishments": [],
      "blockers": ["Waiting for L1 real data + free-tier path"],
      "next": ["Q0.1: verify plugin against free-tier key"]
    },
    "leafengines_platform": {
      "name": "🌱 LeafEngines Platform",
      "pct": 10,
      "status": "IN_PROGRESS",
      "phase": "L0",
      "accomplishments": ["Launch plan v2.0 written", "Codebase audit complete"],
      "blockers": [],
      "next": ["L0.2: wire CircuitBreaker", "L0.4: fix telemetry", "L0.5: fix arg transforms"],
      "detail": {
        "critical_functions": {
          "get_soil_data": "auth-only, no free path",
          "agricultural_intelligence": "hardcoded preview",
          "safe_identification": "401 without key"
        },
        "telemetry": "RLS blocks writes",
        "dual_meter": "SQL written, not executed",
        "llm_provider": "Lovable Gateway (6 functions), OpenAI direct (4 functions)"
      }
    }
  },
  "cross_track_deps": {
    "T depends on L1": "Telegram needs dual meter + real data",
    "Q depends on L1": "QGIS needs real data + free-tier path",
    "A independent": "Anti-Gravity runs on its own timeline",
    "A shares with Q": "OGC CITE + ArcGIS overlap in Q2/Q3"
  }
}
```

### Report Schedule

| Report | Date | Expected track progress |
|--------|------|------------------------|
| report_011 | May 19 | L0 complete (breaker, telemetry, arg fixes) |
| report_012 | May 22 | L1 complete (dual meter live, real data flowing) |
| report_013 | May 25 | L2 complete (OpenRouter live, Lovable gone). T0-T1 starting. Q0 starting. |
| report_014 | May 28 | T1 complete. T2 in progress. Q1 in progress. A Phase 3 starting. |
| report_015 | May 31 | T2-T3 complete. T4 trial launch. Q2 starting. |
| report_016 | Jun 3 | T4 burn test passing. Q2-Q3 in progress. A Phase 3 in progress. |
| report_017 | Jun 6 | Telegram soft launch. Q3 ArcGIS submitted. A Phase 3 advancing. |
| report_018 | Jun 6 | All channels live. Observability dashboards. L3 hosting migration begins. |

---

## 7. Dependency Map (Updated)

```
L0 (wire infrastructure) ─── May 17-19
  |
  v
L1 (dual meter + real data) ─── May 20-22
  |
  ├──→ T0 (data model) ─── May 23
  |      |
  |      v
  |    T1 (webhook + commands) ─── May 23-25
  |      |
  |      v
  |    T2 (photo + AI) ─── May 26-28
  |      |
  |      v
  |    T3 (hardening) ─── May 29-30
  |      |
  |      v
  |    T4 (trial launch) ─── May 31-Jun 2
  |
  ├──→ Q0 (plugin verify) ─── May 23
  |      |
  |      v
  |    Q1 (QGIS v2.0) ─── May 26-28
  |      |
  |      v
  |    Q2 (OGC CITE) ─── May 29-31 (shares with A Phase 3)
  |      |
  |      v
  |    Q3 (ArcGIS Marketplace) ─── Jun 1-3
  |
  ├──→ L2 (AI Gateway → OpenRouter) ─── May 23-25
  |      |
  |      └──→ enables T2 streaming + T4 cost caps
  |
  └──→ A (Anti-Gravity) ─── independent, Phase 3 starts when ready

Post-launch:
  L3: Hosting migration (Vercel/Cloudflare) ─── Jun 4-6
  L4: Edge caching (Cloudflare Worker) ─── when volume justifies
```

**No circular dependencies.** L0 → L1 → L2 is linear. T and Q branch after L1. A is independent.

---

## 8. Performance Safeguards by Critical Function

### 8.1 get_soil_data (data-only, no LLM)

| Failure Mode | Detection | Response | Cost |
|---|---|---|---|
| USDA SDA timeout (>5s) | Promise.race timeout | Regional estimates from state FIPS table | $0 |
| USDA SDA down (circuit open) | CircuitBreaker (3 failures) | Cached stale data from fips_data_cache | $0 |
| Cache miss + USDA down | APICacheManager miss | Regional estimates | $0 |
| Flood of identical requests | APICacheManager hit | Memory cache → DB cache → stale | $0 |

### 8.2 agricultural_intelligence (LLM-dependent)

| Failure Mode | Detection | Response | Cost |
|---|---|---|---|
| OpenRouter GPT-4o rate limit | CircuitBreaker (3 failures) | OpenRouter auto-failover to fallback model | Same API |
| OpenRouter entirely down | CircuitBreaker open | Structured template: real soil data + static crop tables, no AI reasoning | $0 |
| Slow LLM (>8s) | Promise.race timeout | Return cached analysis if available, else template | $0 |
| Cost spike | costTracker accumulation | Alert at $5/day; return template + notify | $0 |

### 8.3 safe_identification (LLM-dependent, multimodal)

| Failure Mode | Detection | Response | Cost |
|---|---|---|---|
| OpenRouter Gemini Flash error | CircuitBreaker | OpenRouter auto-failover to GPT-4o (supports vision) | ~$0.001/call |
| OpenRouter entirely down | CircuitBreaker open | Lookalike DB query: match plant_name against pre-built toxic lookalike database | $0 |
| Photo too large (>10MB) | Size check | Resize + retry, else text-only identification | $0 |
| Name-only (no photo) | MCP arg: plant_name without image | Text-only Gemini Flash call (~800 tokens) | ~$0.0005/call |
| Cost spike | costTracker accumulation | Alert at $5/day; return lookalike DB + notify | $0 |

---

## 9. Cost Controls

### 9.1 Per-Function Spend Caps

| Function | Daily Cap | Trigger | Action |
|---|---|---|---|
| agricultural_intelligence | $5/day | costTracker | Return template + alert |
| safe_identification | $5/day | costTracker | Return lookalike DB + alert |
| get_soil_data | $0.50/day | costTracker | Cache-only mode + alert |
| Global | $15/day | Sum | All functions to fallback mode |

### 9.2 Free Tier Economics (Dual Meter)

| Scenario | AI calls/day | Data calls/day | LLM cost/day |
|---|---|---|---|
| Casual gardener | 2-3 | 5 | $0.003 |
| n8n workflow (data only) | 0 | 20 | $0 |
| Power user hitting AI limit | 5 | 20 | $0.008 |

At $0.008/day per free user, 200 free DAU = $48/mo total LLM cost. One Team subscriber ($29/mo) covers 60%.

---

## 10. Deferred Items (Addendums)

Each independently shippable. None block the launch.

| ID | Title | Triggered by |
|---|---|---|
| D | Multi-channel router (WhatsApp, SMS) | Confirmed second messaging channel demand |
| E | Prompt versioning store | Addendum D (second channel needs identical prompts) |
| F | Operator console + MFA | Support volume or compliance audit |
| G | SSP tier rename (Hobby/Grower/Pro) | Marketing-led cutover window |
| H | Telemetry scale-out (Protobuf/Redis, 100k msg/min) | Sustained >10k msg/min on mcp_tool_call_log |
| I | Offline plant-ID GA on WebGPU | Hardware coverage + battery-impact study |
| J | Edge caching (Cloudflare Worker for soil data) | >1k soil requests/day sustained |
| K | Photo storage migration (Supabase Storage → R2) | Egress costs > $5/mo |
| L | Hosting migration (Lovable → Vercel/Cloudflare) | Post-launch, any time after T4 |

---

## 11. File Locations

| Artifact | Path |
|---|---|
| This launch plan | ~/operations/PRODUCT/LEAFENGINES_LAUNCH_PLAN.md |
| Roadmap | ~/operations/PRODUCT/ROADMAP.md |
| Feature matrix | ~/operations/PRODUCT/FEATURE_MATRIX.md |
| SDK track | ~/operations/SDK/SDK_TRACK.md |
| Infra track | ~/operations/INFRA/INFRA_TRACK.md |
| Master timeline | ~/operations/MASTER_TIMELINE.md |
| Dual-meter migration SQL | ~/operations/sql/dual_meter_migration.sql |
| 72-hour reports | ~/.openclaw/workspace/status_reports/ |
| Bot architecture (v0.2) | GitHub: LEAFENGINES_BOT_ARCHITECTURE_v0.2.md |
| Conflict resolution | GitHub: LEAFENGINES_CONFLICT_RESOLUTION_SUMMARY.md |
| Launch regression checklist | GitHub: LEAFENGINES_LAUNCH_REGRESSION_CHECKLIST.md |
| MCP server source | ~/clawd/soil-sidekick-pro-guide-main/supabase/functions/mcp-server/index.ts |
| Shared modules | ~/clawd/soil-sidekick-pro-guide-main/supabase/functions/_shared/ |
