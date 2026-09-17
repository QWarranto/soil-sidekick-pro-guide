	# Feature Matrix

Full feature inventory with status, ownership, and linkage.

## Features

| ID | Feature | Area | Status | Owner | Targets | Linked To |
|----|---------|------|--------|-------|---------|-----------|
| F1 | get_soil_data (USDA SSURGO) | Data tool | shipped | Reggie | MCP, Telegram, n8n, Node-RED, QGIS | AG-1, ARCH-1 |
| F2 | county_lookup (FIPS resolver) | Data tool | shipped | Reggie | MCP, Telegram, QGIS | F1 |
| F3 | territorial_water_quality (EPA WQX) | Data tool | shipped | Reggie | MCP, n8n, Node-RED | ARCH-1 |
| F4 | carbon_credit_calculator | Proprietary tool | shipped | Reggie | MCP, n8n | PRICING-1 |
| F5 | agricultural_intelligence (Lovable AI Gateway + Gemini) | LLM tool | shipped | Reggie | MCP, Telegram | LLMSDK-1, PHASE1-3 |
| F6 | safe_identification (plant ID + toxic lookalikes) | LLM tool | building | Reggie | MCP, Telegram | LLMSDK-1, PHASE1-5 |
| F7 | environmental_impact_analysis | LLM tool | scoped | Reggie | MCP, n8n | PHASE-LATER |
| F8 | generate_vrt_prescription | Proprietary tool | scoped | Reggie | MCP | PHASE-LATER |
| F9 | planting_optimization | Proprietary tool | scoped | Reggie | MCP | PHASE-LATER |
| I1 | CircuitBreaker (graceful degradation) | Infrastructure | shipped (unused) | Reggie | All edge functions | ARCH-1, PHASE0-1 |
| I2 | APICacheManager (3-tier cache) | Infrastructure | shipped (partial) | Reggie | Data tools | ARCH-1, PHASE0-2 |
| I3 | withFallback (retry + fallback) | Infrastructure | shipped (unused) | Reggie | All tools | ARCH-1, PHASE0-1 |
| I4 | LLM failover chain (Gemma 4 -> AI Studio -> GPT-4o-mini -> template) | Infrastructure | partial | Reggie | LLM tools | LLMSDK-1, PHASE1-2 |
| I5 | Dual-meter rate limiting | Infrastructure | shipped | Reggie | All channels | PRICING-1, PHASE2 |
| I6 | Cost tracker (daily spend caps) | Infrastructure | shipped (unused) | Reggie | All tools | PHASE0 |
| I7 | Telemetry (service_role writes) | Infrastructure | shipped | Reggie | All channels | PHASE0-3 |
| C1 | MCP server (primary channel) | Channel | shipped | Reggie | Claude, Codex, desktop | ARCH-1 |
| C2 | Telegram bot (parallel primary) | Channel | shipped | Reggie | Mobile, instant | PRD-1 |
| C3 | n8n nodes (extension channel) | Channel | shipped | Reggie | Workflow automation | CROSS-1 |
| C4 | Node-RED nodes (extension channel) | Channel | shipped | Reggie | IoT/edge | CROSS-1 |
| C5 | QGIS plugin (extension channel) | Channel | shipped | Reggie | Geospatial desktop | QGIS-1, PHASE4 |
| C6 | ArcGIS Marketplace (extension channel) | Channel | scoped | Reggie | Enterprise GIS | PHASE5 |
| U1 | Unified identity (one API key, all channels) | Cross-platform | scoped | Reggie | All channels | CROSS-1, PHASE6 |
| U2 | /link command (channel linking) | Cross-platform | scoped | Reggie | Telegram + MCP | CROSS-1 |
| U3 | Pooled daily limits across channels | Cross-platform | scoped | Reggie | All channels | PRICING-1 |
| U4 | Cross-channel session continuity | Cross-platform | ideation | Reggie | MCP + Telegram | CROSS-5 |
| U5 | Team coordination (group chat) | Cross-platform | ideation | Reggie | Telegram groups | CROSS-6 |
| P1 | Free tier ($0, 5 AI/20 data calls/day) | Revenue | shipped | Reggie | All channels | PRICING-1, PHASE2 |
| P2 | Pro tier ($9/mo, 50 AI/200 data calls/day) | Revenue | shipped | Reggie | All channels | PRICING-1, PHASE2 |
| P3 | Team tier ($29/mo, 150 AI/500 data calls, pooled) | Revenue | scoped | Reggie | Teams | PRICING-1 |
| P4 | Enterprise tier ($79/mo, unlimited) | Revenue | shipped | Reggie | Organizations | PRICING-1 |
| P5 | OEM tier (Skyline, custom pricing) | Revenue | scoped | Reggie | Hardware integrators | SKYLINE-1 |
| P6 | Stripe integration (/subscribe) | Revenue | shipped | Reggie | All channels | PHASE6 |

## Status Definitions

- `ideation` -- Concept, not yet scoped
- `scoped` -- Requirements defined, awaiting capacity
- `building` -- In active development
- `shipped` -- In production (may need wiring/connecting)
- `broken` -- Deployed but non-functional
- `deprecated` -- Scheduled for removal

## Gaps

| Gap | Impact | Proposed Fill | Confidence |
|-----|--------|---------------|------------|
| MCP server returns hardcoded previews, not real data | Users get fake responses | Wire through to downstream functions with free-tier auth | High |
| safe_identification locked behind API key | Flagship feature unreachable | Add to FREE_PREVIEW_TOOLS with rate limit | High |
| Telemetry writes silently fail (RLS + anon key) | Zero observability | Use SUPABASE_SERVICE_ROLE_KEY for server-side writes | **RESOLVED** (L0, May 2026) |
| No LLM client shared module | Each function implements its own LLM call | Create _shared/llm-client.ts with failover chain | High |
| Free-tier path missing for critical tools | Users must get API key before trying | Auto-provision on first call, x-free-tier header | High |
