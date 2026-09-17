# Operations & Maintenance Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03
**Owner:** SRE / Platform

---

## 1. Purpose

Runbooks and SOPs for operating, monitoring, and maintaining the SoilSidekick Pro platform in production.

## 2. Service Inventory

| Service | Provider | Criticality |
|---|---|---|
| Web app | Lovable / CDN | P1 |
| Edge functions | Supabase Edge (Deno) | P0 |
| Postgres | Supabase | P0 |
| Storage | Supabase | P1 |
| AI Gateway | Lovable AI | P1 |
| Stripe | Stripe | P1 (billing) |
| GEE / AlphaEarth | Google | P2 |

## 3. Environments
- **Production** — `app.soilsidekickpro.com`
- **Sandbox** — `sandbox.leafengines.com`
- **Staging** — `staging.app.soilsidekickpro.com`
- **Preview** — auto-provisioned per PR

## 4. Deployment Process
1. PR → CI (lint, tsgo, vitest, security scan)
2. Merge → Lovable auto-deploys preview
3. Publish → propagates to production
4. Post-deploy smoke tests (Playwright)
5. Sentry / logs monitored for 30 min

Database migrations follow the four-step contract (CREATE → GRANT → RLS → POLICY). Approved via `supabase--migration` tool.

## 5. Monitoring

| Signal | Source | Threshold |
|---|---|---|
| Edge fn p95 latency | edge_function_logs | > 300 ms |
| Error rate | supabase logs | > 1% |
| DB CPU | supabase | > 75% |
| Storage bucket size | supabase | > 80% quota |
| Stripe sync lag | stripe-usage-sync logs | > 5 min |
| MCP tool abuse | mcp_tool_call_log | anomaly |
| Sensor drift | sensor_data_quality | score < 60 |
| Cost | cost_alerts | > budget |

## 6. Alerting
- PagerDuty for P0/P1
- Slack `#ops-alerts` for P2+
- Weekly digest of `endpoint_digest_log`
- MCP audit anomalies → security channel

## 7. On-Call
- Primary + secondary rotation, weekly
- Escalation: Primary → Secondary (15 min) → Eng Lead (30 min) → CTO (60 min)
- Runbook link required in every alert

## 8. Runbooks

### 8.1 Edge Function Down
1. Check `supabase--edge_function_logs`
2. Redeploy latest good SHA if regression suspected
3. Enable graceful UI degradation (regional estimates)
4. Post status page update

### 8.2 Database Slow
1. `supabase--slow_queries`
2. Check RLS policy explains
3. Add missing GIN/GIST index if fuzzy/spatial
4. Scale read replica if sustained

### 8.3 Stripe Sync Failure
1. Inspect `stripe-usage-sync` logs
2. Replay last hour from usage_analytics
3. Notify finance if > 4 h lag

### 8.4 Free Tier Abuse
1. `anonymous_api_usage` shows IP-hash spike
2. Tighten quota via `api_tier_limits`
3. Block IP hash if malicious pattern

### 8.5 Sensor Ingest Backlog
1. Check Redis Stream lag
2. Scale consumer group
3. If sustained, throttle upstream via HMAC 5s TTL

### 8.6 Local LLM Regression
1. Verify WebGPU compatibility per `mem://constraints/webgpu-preview-limitations`
2. Fall back to Lovable AI Gateway via smart router
3. Ship hotfix if model file mis-hashed

## 9. Backups & DR
- Postgres PITR 7 days
- Nightly logical backup to encrypted storage
- Quarterly restore drill; RTO 4 h / RPO 15 min
- URLLC nodes target sub-minute per `mem://operations/5g-mec-recovery-targets`

## 10. Secret & Key Management
- Supabase Vault for `APP_ENCRYPTION_KEY`, provider keys
- Quarterly rotation (see Security Doc)
- No `.env` in repo; ephemeral env only for scripts

## 11. Capacity Planning
- Reviewed monthly against `telemetry_daily_summary`
- Scale plan for 2× projected peak

## 12. Maintenance Windows
- Non-critical: Sunday 06:00-08:00 UTC
- Emergency: any time with status page + email notice

## 13. Change Freeze Policy
- Freeze during Black Friday, harvest peak (Sep 1 – Oct 15)
- Only P0 fixes allowed

## 14. Incident Post-Mortems
- Required for P0/P1
- Blameless template in `docs/operations/incident-template.md`
- Root causes tracked in Jira

## 15. Housekeeping Tasks
- Weekly: log rotation, cost review
- Monthly: expired key cleanup, RLS audit
- Quarterly: key rotation, DR drill, dependency audit
- Annually: SOC 2 audit, pen test

## 16. Contacts
- SRE: sre@soilsidekickpro.com
- Security: security@soilsidekickpro.com
- Support: support@soilsidekickpro.com
