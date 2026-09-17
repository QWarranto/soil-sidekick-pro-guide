# Infra Track

> **ARCHIVAL NOTICE — June 26, 2026**
> This document was last meaningful on May 23, 2026. It has been superseded by `MASTER_TIMELINE.md` and direct code inspection. Do not use this file for current-state decisions. Refer to the deployed codebase and MASTER_TIMELINE for infrastructure status.
>
> Known staleness: L2 status, Telegram webhook status, streaming support, and several "FIXED" items that are still listed as open issues below. Retained for historical reference only.

Infrastructure state, changes, and operational health.
Aligned to LEAFENGINES_LAUNCH_PLAN.md v2.0 (Telegram-driven).

## Current State

| System | Status | Version | Last Deploy | Owner | Notes |
|--------|--------|---------|-------------|-------|-------|
| Supabase edge functions | RUNNING | 44 functions | 2026-05-23 | Reggie | 6 Lovable-dependent, 4 OpenAI direct, 34 no LLM |
| MCP server | LIVE (L1) | mcp-server-v100-L1 | 2026-05-23 | Reggie | Dual-meter free-tier, real data calls, arg transforms fixed, telemetry writing |
| Lovable AI Gateway | ACTIVE | — | 2026-05 | Lovable | 6 functions route through it. Replacing with OpenRouter in L2 |
| Lovable hosting | ACTIVE | — | 2026-05 | Lovable | Frontend build+deploy. Replacing post-launch |
| WFS server | RUNNING | v1.0.10 | 2026-06 | Reggie | wfs-export Edge Function + QGIS plugin v1.0.10, x-api-key only |
| QGIS plugin | PUBLISHED | v1.0.10 | 2026-06 | Reggie | 392 total downloads, security-clean, zero Bandit issues |
| npm packages | PUBLISHED | various | 2026-Q1 | Reggie | MCP server, n8n, Node-RED, Telemetry SDK |

## Known Issues

| # | Issue | System | Severity | Detected | Action | Status | Phase |
|---|-------|--------|----------|----------|--------|--------|-------|
| I1 | Telemetry writes fail silently (RLS blocks anon key) | MCP server | HIGH | 2026-05-17 | Use service_role key in createClient | **FIXED** | L0.4 |
| I2 | MCP arg transform: county_fips → county_name+state_code missing | MCP server | HIGH | 2026-05-17 | Add FIPS lookup before forwarding | **FIXED** | L0.5 |
| I3 | Hardcoded previews instead of real data | MCP server | HIGH | 2026-05-17 | Replace with real downstream calls | **FIXED** | L1.3-L1.6 |
| I4 | Single meter can't differentiate AI vs data calls | api_keys | MEDIUM | 2026-05-17 | Execute dual_meter_migration.sql | **FIXED** (code; DB columns verified) | L1.1 |
| I5 | CircuitBreaker + APICacheManager built but never imported | _shared | MEDIUM | 2026-05-17 | Wire into MCP server | **FIXED** | L0.2-L0.3 |
| I6 | 4 Lovable-only functions have no dual-path logic | Edge functions | LOW | 2026-05-17 | Add isLovableAI conditional | Not started | L2.6 |
| I7 | Free preview text references "GPT-4o" (stale) | MCP server | TRIVIAL | 2026-05-17 | Update text | **FIXED** | L0.7 |
| I8 | No streaming support for LLM responses | AI path | MEDIUM | 2026-05-17 | OpenRouter + streaming in llm-router | Not started | L2.2 |
| I9 | Redaction list missing authorization, service_role_key, openrouter_api_key | logging-utils | LOW | 2026-05-23 | Extend switch cases | **FIXED** | L0.8 |

## In-Flight Changes

| Change | System | Risk | ETA | Rollback Plan | Status | Phase |
|--------|--------|------|-----|---------------|--------|-------|
| Wire CircuitBreaker | MCP server | LOW | May 19 | Remove import | **DONE** | L0.2 |
| Wire APICacheManager | MCP server | LOW | May 19 | Remove import | **DONE** | L0.3 |
| Fix telemetry key | MCP server | NONE | May 19 | Revert to anon key | **DONE** | L0.4 |
| Fix arg transforms | MCP server | LOW | May 19 | Revert to current transform | **DONE** | L0.5-L0.6 |
| Extend redaction list | logging-utils | NONE | May 23 | Remove added cases | **DONE** | L0.8 |
| Dual-meter migration | Supabase DB | LOW | May 22 | Migration is additive, backward compatible | **DONE** (code + DB columns) | L1.1 |
| Replace previews with real calls | MCP server | MEDIUM | May 22 | Restore getFreePreview() | **DONE** | L1.3-L1.6 |
| Dual-meter free-tier with paywall messages | MCP server | MEDIUM | May 22 | Revert to flat 401 | **DONE** | L1.2, L1.7 |
| OpenRouter migration | 6 edge functions | MEDIUM | May 25 | Set LOVABLE_API_KEY back | Not started | L2.1-L2.9 |
| Telegram webhook | New edge function | LOW | May 25 | Disable webhook in Telegram | Not started | T0-T1 |

## Capacity Planning

| System | Current Usage | Headroom | Scaling Trigger | Plan |
|--------|---------------|----------|-----------------|------|
| Supabase edge functions | ~50 calls/day (testing) | Massive | 10k calls/day | Monitor |
| USDA SDA (external) | ~5 calls/day | Unknown | Rate limit or 429 | APICacheManager 1hr TTL + stale-while-revalidate |
| OpenRouter (planned) | $0 | $15/day cap | $10/day sustained | Alert at $5, fallback at $15 |
| Supabase Storage | ~0 photos | Massive | 1k photos/day | Monitor, consider R2 at scale |
| Lovable hosting | 1 SPA | Unlimited | N/A | Migrate to Vercel/CF post-launch |
| Free-tier dual-meter | 3 ID/day, 5 AI/day, 20 data/day | Per-IP | Abuse pattern detection | pg_cron resets at midnight UTC |
