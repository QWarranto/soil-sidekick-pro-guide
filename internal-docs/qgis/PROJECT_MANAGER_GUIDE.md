# Project Manager Reference

On-disk reference for managing LeafEngines multi-track projects via GitHub Issues and Milestones.
Last updated: 2026-06-07

---

## Quick Links

- **Timeline source of truth:** `operations/MASTER_TIMELINE.md`
- **Epics & GTM:** `operations/PRODUCT/ROADMAP.md`
- **GitHub repo:** `QWarranto/soil-sidekick-pro-guide`
- **Open issues:** https://github.com/QWarranto/soil-sidekick-pro-guide/issues
- **Milestones:** https://github.com/QWarranto/soil-sidekick-pro-guide/milestones

---

## 6-Track Taxonomy

Every piece of work maps to one track. Multi-track work lists all applicable.

| Track | Domain | Color |
|-------|--------|-------|
| L | Platform / Infra | `6f42c1` |
| T | Telegram Bot | `1f77b4` |
| D | Bigfoot / Planetary Directory | `2ca02c` |
| Q | QGIS / ArcGIS | `ff7f0e` |
| A | Anti-Gravity SDK | `9467bd` |
| G | GTM / Marketing | `8c564b` |
| M | Monetization | `e377c2` |

---

## Label Quick Reference

### Required on every issue
- **Track:** `track:L`, `track:T`, `track:D`, `track:Q`, `track:A`, `track:G`, `track:M`
- **Priority:** `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Type:** `type:migration`, `type:sdk`, `type:performance`, `type:cost`, `type:compliance`, `type:launch`, `type:architecture`, `type:feature`, `type:backend`, `type:frontend`, `type:integration`, `type:seo`, `type:revenue`, `type:distribution`, `type:maintenance`, `type:billing`, `type:marketing`, `type:partnership`, `type:growth`

### Optional status
- `status:blocked` — Halted by dependency
- `status:ready` — Unblocked, ready to start

---

## Milestone Naming

**Format:** `{Track}{Phase} — Human-readable title`

| Milestone | Due Date | Status |
|-----------|----------|--------|
| L0 — Wire Infrastructure | 2026-05-19 | COMPLETED |
| L1 — Dual Meter + Real Data | 2026-05-22 | COMPLETED |
| L2 — AI Gateway → OpenRouter | 2026-05-25 | COMPLETED |
| L3 — Hosting Migration | 2026-06-16 | OPEN |
|| L4 — SDK v3.0 / ak_ prefix | 2026-07-15 | COMPLETED |
| L5 — Edge Caching | 2026-08-01 | OPEN |
| L6 — Photo Storage → R2 | 2026-08-15 | OPEN |
| T0 — Telegram Data Model | 2026-05-23 | COMPLETED |
| T1 — Webhook + Commands | 2026-06-02 | COMPLETED |
| T2 — Photo + AI Commands | 2026-06-07 | COMPLETED |
| T3 — Hardening + Compliance | 2026-06-11 | OPEN |
| T4 — Trial Launch | 2026-06-14 | OPEN |
| T5 — Soft Launch | 2026-07-01 | OPEN |
| T6 — Unified Identity | 2026-07-15 | OPEN |
| D0 — Schema Deployment | 2026-05-29 | COMPLETED |
| D1 — Webhook Signals | 2026-06-30 | OPEN (deferred) |
| D2 — Autogen Processor | 2026-06-16 | OPEN |
| D3 — Directory Renderer MVP | 2026-06-16 | OPEN |
| D4 — Vendor Onboarding | 2026-06-19 | OPEN |
| D5 — Privacy Hardening | 2026-06-22 | OPEN |
| D6 — resolve_model() Integration | 2026-06-25 | OPEN |
| D7 — 1,000 Pages Live | 2026-08-01 | OPEN |
| D8 — Vendor Marketplace Live | 2026-09-30 | OPEN |
| Q3 — ArcGIS Marketplace Approved | 2026-09-01 | OPEN |
| A — Anti-Gravity SDK v3.0 | 2026-06-07 | COMPLETED |

Cross-track milestones: `Stripe /subscribe`, `200 DAU Target`, `First OEM Integration`, `Cross-channel Sessions + Teams`.

---

## Dependency Map

```
L → T  (L2 unblocks T2+)
L → D  (L2 unblocks D6)
L → Q  (L2 provides model routing)
T → T  (T3 → T4 → T5 pipeline)
D → D  (D2 → D3 → D4 chain; D1 deferred)
A → Q  (A Phase 3 provides CITE/ArcGIS metrics for Q3)
M    → staged post-T4, unblocked (QGIS v1.0.10 shipped)
```

When a milestone completes:
1. Close it in GitHub
2. Update MASTER_TIMELINE.md
3. Remove `status:blocked` from downstream issues
4. Add `status:ready` to unblocked work

---

## Issue Template

```markdown
## Title: [Track{Phase}] Brief description

## Acceptance Criteria
- [ ] Verifiable item 1
- [ ] Verifiable item 2

## Dependencies
- Milestone or issue that must complete first

## Target Date
YYYY-MM-DD
```

---

## CLI Cheat Sheet

### Create a label
```bash
gh label create track:T --color "1f77b4" --description "Telegram bot track"
```

### Create a milestone
```bash
gh api repos/QWarranto/soil-sidekick-pro-guide/milestones \
  --method POST \
  -f title="T3 — Hardening + Compliance" \
  -f state="open" \
  -f description="Redaction, health probe, ROPA" \
  -f due_on="2026-06-11T23:59:59Z"
```

### Create an issue (body from file)
```bash
cat > /tmp/issue.md << 'EOF'
## Acceptance Criteria
- [ ] ...
EOF

gh issue create -t "[T3] Hardening" --body-file /tmp/issue.md \
  -l "track:T,priority:critical,type:compliance" \
  -m "T3 — Hardening + Compliance"
```

### List open issues by track
```bash
gh issue list -l "track:T" --state open
```

### Close a milestone
```bash
gh api repos/QWarranto/soil-sidekick-pro-guide/milestones/{number} \
  --method PATCH -f state="closed"
```

---

## Current Active Issues (as of 2026-06-07)

| # | Title | Track | Priority | Milestone |
|---|-------|-------|----------|-----------|
| #2 | [L3] Frontend hosting migration | L | high | L3 |
| #3 | [L4] SDK v3.0 regeneration | L | medium | L4 |
| #4 | [L5] Edge caching | L | medium | L5 |
| #5 | [L6] Photo storage migration | L | low | L6 |
| #6 | [T3] Telegram hardening | T | critical | T3 |
| #7 | [T4] Trial launch | T | critical | T4 |
| #8 | [T5] Soft launch | T | critical | T5 |
| #9 | [T6] Unified identity | T | high | T6 |
| #10 | [T] Cross-channel sessions | T | medium | Cross-channel |
| #11 | [D2] Autogen processor | D | high | D2 |
| #12 | [D3] Directory renderer MVP | D | high | D3 |
| #13 | [D4] Vendor onboarding | D | medium | D4 |
| #14 | [D5] Privacy hardening | D | medium | D5 |
| #15 | [D6] resolve_model() integration | D | medium | D6 |
| #16 | [D7] 1,000 pages indexed | D | medium | D7 |
| #17 | [D8] Vendor marketplace | D | low | D8 |
| #18 | [Q3] ArcGIS Marketplace | Q | high | Q3 |
| #19 | [A] Anti-Gravity monitoring | A | medium | A |
| #20 | [L] Stripe /subscribe | L | high | Stripe |
| #21 | [GTM] Channel activation | G | high | — |
| #22 | [L] First OEM integration | L | medium | First OEM |
| #23 | [T+G] 200 DAU target | T,G | high | 200 DAU |

---

## Update Protocol

1. **Weekly:** Read `MASTER_TIMELINE.md`, sync any date/status changes to GitHub milestones
2. **On completion:** Close milestone, update timeline, unblock downstream
3. **On slip:** Edit milestone date, update timeline, alert downstream owners
4. **On new work:** Create issue using template, assign labels + milestone, add to this reference

*This file is maintained manually or via agent update. Do not let it drift from MASTER_TIMELINE.md.*
