# Project Management Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03

---

## 1. Purpose

Describes how work is planned, tracked, and delivered on the SoilSidekick Pro / LeafEngines platform.

## 2. Delivery Model

Hybrid Scrum + Kanban:
- **Scrum** for feature work (2-week sprints)
- **Kanban** for platform / on-call / incident response
- Continuous deployment; feature flags for gated rollout

## 3. Team Structure

| Team | Focus | Lead |
|---|---|---|
| Product | Roadmap, PRDs, discovery | Product Lead |
| Platform | Edge fns, DB, infra | Eng Lead |
| Frontend | Web app, PWA, mobile shell | FE Lead |
| AI | LLM routing, embeddings, TurboQuant | AI Lead |
| SDK | Codegen, six languages, MCP | SDK Lead |
| Data / Sensor | Ingestion, quality, OEM | Data Lead |
| SRE | Ops, monitoring, on-call | SRE Lead |
| Security & Compliance | Audit, RLS, incident response | Security Lead |
| Growth | Marketing, community, docs | Growth Lead |

## 4. Roles & RACI

| Activity | Product | Eng | SRE | Security | Legal |
|---|---|---|---|---|---|
| PRD | A/R | C | I | C | I |
| Design / TDD | C | A/R | C | C | I |
| Release | I | R | A | C | I |
| Incident | I | R | A/R | R | I |
| Compliance audit | C | C | I | A/R | R |

## 5. Roadmap

| Quarter | Theme | Highlights |
|---|---|---|
| 2026-Q3 | Assets & GIS interop | 3.1.0 shipped (Assets, WFS) |
| 2026-Q4 | White-label & EU | 3.2 console, EU LUCAS data |
| 2027-Q1 | Defense hardening | DV005 GA prep |
| 2027-Q2 | 4.0 GA | ARL-hardened PNT, new base path |

Master timeline: `MASTER_TIMELINE.md`.

## 6. Ceremonies

| Ceremony | Cadence | Owner |
|---|---|---|
| Sprint planning | Bi-weekly | Team lead |
| Daily stand-up | Daily | Team |
| Sprint review | End of sprint | Product |
| Retro | End of sprint | Team lead |
| Roadmap review | Monthly | Product Lead |
| Ops review | Weekly | SRE |
| Security review | Monthly | Security Lead |
| CAB | Weekly / on-demand | Change Manager |

## 7. Tools

| Purpose | Tool |
|---|---|
| Backlog | Linear / Jira |
| Docs | Markdown in repo + docs.leafengines.com |
| Design | Figma |
| Comms | Slack |
| Incident | PagerDuty + Statuspage |
| CI/CD | GitHub Actions + Lovable |
| Metrics | Supabase + internal dashboards |

## 8. Estimation
- Story points (Fibonacci 1-13)
- Rolling velocity per team
- Confidence tag (H/M/L)

## 9. Definition of Ready
- User story with acceptance criteria
- Design attached (if UI)
- Dependencies identified
- Estimate + owner

## 10. Definition of Done
- Code merged, CI green
- Tests added (unit + integration)
- Docs updated (README, CHANGELOG, relevant `docs/`)
- Feature flag configured
- Monitoring / alerts added
- Security review if applicable
- Deployed to prod behind flag

## 11. Reporting
- Weekly status to leadership
- Monthly KPI review (`kpi_history`)
- Quarterly business review

## 12. Budget & Cost
- Cloud spend tracked in `cost_tracking`
- Alerts on 80% burn
- Monthly finance review

## 13. Vendor Management
- Approved vendor list in `vendors` table
- Renewal calendar 60-day heads-up
- Sub-processor changes trigger DPA update

## 14. Documentation Ownership
- Each doc has a named owner in front matter
- Reviewed at least annually
- Stale flag if untouched > 12 months

## 15. Onboarding
- 30-60-90 plan template
- Repo tour, architecture read-out
- Shadow on-call in week 2
- First PR within week 1

## 16. Community & OSS Governance
- CoC in repo
- OSS licenses: Apache 2.0 / MIT
- Contributor guide in `docs/open-source/CONTRIBUTING.md`

## 17. Partnerships
Documented playbook per partner in `docs/partnerships/`. Canonical template: `COMPOSIO_ENTERPRISE_ONBOARDING.md` — copy & swap front matter for new partners.

## 18. Metrics That Matter

| Metric | Target |
|---|---|
| Deploy frequency | ≥ daily |
| Lead time for change | ≤ 2 days |
| Change failure rate | ≤ 5% |
| MTTR | ≤ 60 min |
| Sprint completion | ≥ 85% |
| Bug escape rate | ≤ 2% |
| Doc coverage of features | 100% |

## 19. Risks & Escalation
See Risk Assessment. Escalation path:
Team Lead → Eng Lead → CTO → CEO / Board (for score ≥ 20).

## 20. Related Documents
- Change Management
- Operations & Maintenance
- Risk Assessment
- Product Requirements
