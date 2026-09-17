# Risk Assessment & Mitigation

**Version:** 3.1.0
**Last updated:** 2026-07-03
**Owner:** Risk & Compliance

---

## 1. Methodology

Risks scored on Likelihood (1-5) × Impact (1-5) → Risk Score (1-25).
Categories: Technical, Security, Operational, Compliance, Financial, Strategic.
Reviewed quarterly; critical risks (score ≥ 15) reviewed monthly.

## 2. Risk Register

| ID | Category | Risk | L | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|---|
| R01 | Security | RLS misconfiguration exposes tenant data | 2 | 5 | 10 | Security scan every PR; RLS unit tests; annual pen test | Security |
| R02 | Security | API key theft / abuse | 3 | 4 | 12 | SHA-256 hashing, rotation, `api_key_access_log`, IP anomaly alerts | Security |
| R03 | Security | Vulnerable transitive dependency (e.g., protobufjs) | 3 | 4 | 12 | Weekly scan, auto PRs, patched to safe versions | Platform |
| R04 | Technical | WebGPU browser fragmentation degrades local LLM | 4 | 3 | 12 | Cloud fallback via smart router; capability probe on load | AI |
| R05 | Technical | AlphaEarth / GEE outage | 2 | 3 | 6 | Graceful UI degradation, regional estimate cache | Platform |
| R06 | Technical | Edge fn 2 MB payload / 50-conc limits | 3 | 3 | 9 | Streaming + pagination + Redis backpressure | Platform |
| R07 | Data | Positional error corrupts DB | 3 | 5 | 15 | 500 m write-inhibition lock (patented) | Platform |
| R08 | Data | Sensor drift undetected | 3 | 4 | 12 | Quality score, drift detection, HIL validation | OEM |
| R09 | Ops | Stripe sync lag / billing mismatch | 2 | 4 | 8 | Replay tools, daily reconciliation, alert on > 5 min lag | Finance |
| R10 | Ops | Free-tier abuse | 4 | 2 | 8 | IP-hash quotas, `anonymous_api_usage` monitoring | Platform |
| R11 | Ops | Offline sync data loss | 2 | 5 | 10 | Capacitor Preferences queue, idempotent executor, tests | Platform |
| R12 | Compliance | GDPR / CCPA breach notification miss | 2 | 5 | 10 | 72 h workflow, audit logs, DPA training | Legal |
| R13 | Compliance | SOC 2 lapse | 2 | 5 | 10 | Continuous control monitors, annual audit | Compliance |
| R14 | Financial | Cost overrun on AI Gateway | 3 | 4 | 12 | Cost alerts, tier-based routing, local Gemma fallback | Finance |
| R15 | Strategic | Competitor undercutting free tier | 3 | 3 | 9 | Distribution moat (9 channels), patents, offline USP | Product |
| R16 | Strategic | Google GEE T&C change | 2 | 4 | 8 | Alternative satellite feeds evaluated (ESA, Planet) | Product |
| R17 | Compliance | Marketing exposes patented algorithm details | 2 | 4 | 8 | Marketing secrecy rule (`mem://strategy/patent-secrecy-in-marketing-materials`) | Marketing |
| R18 | Security | Prompt injection via user content in LLM | 4 | 3 | 12 | System-prompt hardening, tool allowlist, MCP audit governance | AI |
| R19 | Technical | SDK generation regression | 2 | 3 | 6 | Contract tests, OpenAPI diff gate | SDK |
| R20 | Ops | Supabase edge cold starts | 3 | 2 | 6 | Warmers on hot paths | SRE |

## 3. Critical Risk Deep Dives

### R07 — Positional Corruption
Ground truth is core value. Mitigations:
- Uncertainty gate at 500 m (write-inhibition)
- Complementary filter + adaptive stride
- Kalman gate on fusion
- IP-protected; database enforced

### R12 — Regulatory Breach Notification
- 72 h GDPR clock from awareness
- Runbook in `docs/security/`
- Automated incident timer on Sentry escalation

### R18 — Prompt Injection
- MCP tool allowlist per API key
- Redaction of PII in prompts
- Response validators on structured tools

## 4. Risk Appetite

| Category | Appetite |
|---|---|
| Security | Very low |
| Compliance | Very low |
| Data integrity | Very low |
| Technical | Moderate |
| Financial | Moderate |
| Strategic | Moderate to high |

## 5. Review Cadence
- Quarterly full review
- Monthly for score ≥ 15
- Ad-hoc on incident, new feature, or vendor change

## 6. Escalation
- Score 15-19 → Eng Lead
- Score 20-25 → CTO + Board briefing

## 7. Insurance & Contractual Transfer
- Cyber liability policy in force
- Enterprise contracts include liability caps
- SLA credits for downtime

## 8. Business Continuity
- DR plan documented in Operations
- Backups + PITR + quarterly restore
- Alternate provider evaluation biennial

## 9. Related Documents
- Security Documentation
- Compliance & Legal
- Operations & Maintenance
- Performance Documentation
