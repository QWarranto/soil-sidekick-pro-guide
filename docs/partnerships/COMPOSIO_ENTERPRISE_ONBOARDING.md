# Composio Enterprise Onboarding Playbook

> **Template note:** This document is the canonical onboarding playbook for autonomous-agent enterprise partners. To onboard a new partner (e.g., Plantum, Skyline, n8n), copy this file, replace the **Partner Profile** block, and adjust the **Tool Surface** and **Rate Limits** sections. All other sections are partner-agnostic by design.

---

## Partner Profile

| Field | Value |
|-------|-------|
| **Partner** | Composio.dev |
| **Tier** | Enterprise ($1,999/mo base + metered) |
| **Primary Use Case** | Autonomous agent tool-calling via MCP |
| **Integration Surface** | `mcp-server` edge function (10 tools) |
| **API Key Prefix** | `ak_enterprise_composio_*` |
| **Account Status** | Prospect → Pilot (target close: this quarter) |
| **Technical Contact** | TBD |
| **Commercial Contact** | TBD |
| **Internal Owner** | Partnerships lead |

---

## 1. Pre-Onboarding Checklist

- [ ] NDA + MSA executed
- [ ] Order Form signed (tier, term, metered ceiling)
- [ ] Technical contact identified on partner side
- [ ] Internal Slack channel created: `#partner-composio`
- [ ] PagerDuty rotation extended to cover partner SLA
- [ ] Enterprise API key provisioned (`ak_enterprise_composio_prod` + `_sandbox`)
- [ ] Rate-limit tier configured in `api_tier_limits` (see §4)
- [ ] Audit log retention confirmed (7 years, `mcp_tool_call_log`)
- [ ] Compliance package scope confirmed (SOC 2 report shared under NDA)

---

## 2. Tool Surface (Composio-Specific)

The 10 MCP tools exposed via `supabase/functions/mcp-server/index.ts`:

| Tool | Tier Required | Notes for Agent Authors |
|------|--------------|-------------------------|
| `soil_lookup` | Free+ | Cache-friendly; FIPS keyed |
| `crop_recommendation` | Starter+ | Requires county FIPS |
| `water_quality` | Pro+ | Territorial coverage only |
| `carbon_credits` | Pro+ | Returns provenance metadata |
| `planting_calendar` | Starter+ | Multi-parameter |
| `vrt_prescription` | Pro+ | ISOBUS-compliant export |
| `plant_id` | Free+ | Use offline mode for low-latency |
| `agricultural_intelligence` | Starter+ | Permissive input normalization |
| `seasonal_planning` | Pro+ | 5-method synthesis |
| `environmental_score` | Free+ | 64-dim AlphaEarth embeddings |

All tool calls flow through the standard `data_quality` envelope and are logged to `mcp_tool_call_log` with `correlation_id` for downstream tracing.

---

## 3. Authentication Flow

1. Composio creates an **MCP App** pointing at `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/mcp-server`.
2. Headers required on every JSON-RPC call:
   - `Authorization: Bearer ak_enterprise_composio_prod_<...>`
   - `Content-Type: application/json`
   - `Accept: application/json, text/event-stream`
   - Optional: `x-correlation-id` for partner-side trace stitching
3. The `mcp-server` function validates the key against `api_keys`, enforces tier limits, and records the call in `mcp_tool_call_log`.
4. Token refresh is **not** required — long-lived API keys with quarterly rotation reminders.

---

## 4. Rate Limits & Quotas

Default Composio configuration in `api_tier_limits`:

| Window | Limit | Burst |
|--------|-------|-------|
| Per minute | 600 | 900 |
| Per hour | 30,000 | — |
| Per day | 500,000 | — |
| Concurrent | 50 | — |

Overage policy: soft 429 with `Retry-After`; metered overage billed at $0.0008/call above ceiling.

---

## 5. Support SLA

| Severity | Definition | First Response | Resolution Target |
|----------|------------|---------------|-------------------|
| **S1** | Production down, all agents failing | 15 min, 24/7 | 4 hours |
| **S2** | Major degradation, partial failure | 1 hour, 24/7 | 1 business day |
| **S3** | Minor bug, workaround exists | 4 business hours | 5 business days |
| **S4** | Question, feature request | 1 business day | Best-effort |

**Channels (in escalation order):**
1. Shared Slack channel `#partner-composio` (primary)
2. `enterprise@soilsidekickpro.com` (ticketing record)
3. PagerDuty: Enterprise on-call (S1/S2 only)
4. Named escalation: VP Engineering → CTO

---

## 6. Onboarding Timeline (Compressed Enterprise Track)

Replaces the generic 4-week SDK plan with a 2-week agent-focused sprint.

### Week 1 — Integration
- **Day 1:** Kickoff, key handoff, MCP endpoint smoke test
- **Day 2-3:** Composio registers all 10 tools, validates schemas
- **Day 4:** Joint load test against sandbox (target: 10k calls/min sustained)
- **Day 5:** Audit log delivery validated; correlation IDs round-trip

### Week 2 — Production Cutover
- **Day 6-7:** Pilot with 5 internal Composio agents
- **Day 8:** Expand to design-partner agents
- **Day 9:** Production cutover, monitoring dashboard live
- **Day 10:** Post-launch review, QBR cadence agreed

---

## 7. Observability & Reporting

**Real-time:** Partner-scoped Grafana view filtering `mcp_tool_call_log` by `api_key_hash`.

**Weekly automated report** (delivered Mondays):
- Total calls, success rate, p50/p95/p99 latency
- Top 5 tools by volume
- Error breakdown by code
- Cost vs. ceiling

**Monthly QBR deck:** usage trends, roadmap alignment, expansion opportunities.

---

## 8. Compliance & Audit

Composio inherits the Enterprise tier of the [Compliance & Certification Package](../enterprise-solutions/COMPLIANCE_CERTIFICATION_PACKAGE.md):

- SOC 2 Type II report (annual, under NDA)
- 7-year audit trail in `mcp_tool_call_log` and `comprehensive_audit_log`
- Tamper-evident hash chain on tool-call records
- DPA executed (GDPR Art. 28)
- Subprocessor list shared and updated quarterly

---

## 9. Escalation Runbook

**S1 trigger conditions:**
- `mcp-server` 5xx rate > 5% over 5 min
- p95 latency > 2s sustained 10 min
- Partner-reported "all agents failing"

**Response:**
1. On-call ack in `#partner-composio` within 15 min
2. Status page updated within 30 min
3. Bridge call opened if not resolved in 1 hour
4. RCA delivered within 5 business days

---

## 10. Expansion Hooks (Designed-In, Not Added Later)

These sections exist so future enterprise partners require zero structural changes:

- **§ Partner Profile** — single front-matter block to swap
- **§ Tool Surface** — same table, partner-specific tier filter
- **§ Rate Limits** — per-partner row in `api_tier_limits`
- **§ Support SLA** — identical structure, contract-specific values
- **§ Compliance** — inherited from Enterprise package, no rewrite

To onboard partner N+1: copy this file → `docs/partnerships/{PARTNER}_ENTERPRISE_ONBOARDING.md`, replace §1, adjust §2/§4, done.

---

## Document Control

- **Version:** 1.0
- **Last Updated:** 2026-04-16
- **Owner:** Partnerships + Enterprise Support
- **Review Cycle:** Per partner renewal, or quarterly
- **Template Status:** Canonical — do not fork structure without owner approval
