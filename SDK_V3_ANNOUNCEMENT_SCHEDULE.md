# SDK v3 Announcement Schedule

**Owner:** LeafEngines / SoilSidekick Pro Marketing + DevRel
**Status:** Living document — update at each phase gate
**Cross-references:** `PHASED_EUROPEAN_ROLLOUT.md`, `GLOBAL_INTEGRATION_SCHEDULE.md`, `SDK_GLOBAL_EXPANSION_READINESS_ASSESSMENT.md`, `SDK_CHANGELOG.md`

> **Marketing-secrecy rule:** Never expose algorithmic specifics, model routing logic, or proprietary methodology in any customer-facing announcement. Refer only to outcomes, coverage, and supported regions.

---

## Phase Map

| Phase | Code Milestone | Public Theme | Target Window |
|-------|----------------|--------------|----------------|
| A | `environmental_data_cache` view + GIST index live; `global-soil-data` edge function scaffolded (`verify_jwt = false`); `StandardizedSoilData` + `fromISRIC` exposed in `_shared/data-harmonizer.ts` | Internal only — no external comms | Week 0 (shipped) |
| B | Teagasc (IE) + UKSO (UK) adapters; `get-soil-data` bbox router patch | "SDK v3 preview: first non-US soil coverage" | Week 2–3 |
| C | ISRIC global fallback + Germany/Netherlands pilot live | "SDK v3 EU pilot — DE + NL generally available" | Week 4–6 |
| D | FAO GLOSIS + UNEP integrations; expanded EU coverage | "SDK v3 — EU expansion wave 2" | Week 8–10 |
| E | SDK v3.0 GA across all generated language SDKs (6 languages) | "SDK v3.0 General Availability" | Week 12 |

---

## Channels & Sequencing

For each phase gate, run announcements in this order to avoid premature disclosure:

1. **T-7 days — Internal**
   - `#sdk-release` Slack channel
   - Founders Program private digest (no quota changes communicated yet)
2. **T-2 days — Design partners & enterprise prospects**
   - Direct email to Composio, Skyline Instruments, named pilot customers
   - Update `SDK_CLIENT_ONBOARDING_PLAN.md` with phase status
3. **T-0 — Public**
   - `SDK_CHANGELOG.md` entry (version-bumped)
   - `/docs` "Announcements" tile + `/sdk-changelog` page
   - `docs.leafengines.com` banner
   - LinkedIn + X post (outcome-focused, no internals)
4. **T+3 days — Long-form**
   - Blog post / case study on `/docs/case-studies/...`
   - Partner co-marketing (n8n, Node-RED, Composio, QGIS plugin listing)

---

## Approval Gates

Every external announcement must clear:

- [ ] Engineering: phase code merged, smoke tests green, edge function freemium contract preserved
- [ ] Data: coverage map verified for the regions named in the announcement
- [ ] Legal/IP: copy reviewed against marketing-secrecy memory; no algorithmic detail
- [ ] Support: KB articles + sample requests staged in Developer Sandbox
- [ ] Billing: any tier or quota changes reflected in `create-checkout` aliases and `/pricing`

A phase **cannot** announce externally until all five boxes are checked.

---

## Suppression Rules

Do **not** announce when any of the following are true:

- US SSURGO path in `get-soil-data` is not byte-identical to pre-phase baseline
- Write-inhibition (>500 m positional uncertainty) regression detected
- Any new edge function exceeds the 50-concurrency / 2 MB payload envelope under load test
- A region's data freshness flag in the data-quality envelope is below the published SLA
- An open Sev-1/Sev-2 ticket exists against the affected SDK surface

If suppressed, push the announcement to the next weekly gate and log the reason in `QC_CHANGE_LOG_AND_REVISED_SCHEDULE.md`.

---

## Templates

### Changelog entry

```
## v3.<minor>.<patch> — <YYYY-MM-DD>
### Added
- <Region/source> coverage via <adapter name> (no breaking changes)
### Changed
- Bbox router in get-soil-data now selects <region> for matching coordinates
### Notes
- US SSURGO path unchanged; freemium contract preserved
```

### Public post (≤ 280 chars)

> SDK v3 now covers <region>. Same call, broader ground truth. No key changes for existing users. Docs: docs.leafengines.com

### Email to design partners

- Subject: `SDK v3 — <Phase> available in your sandbox`
- Body: phase name, regions added, sandbox endpoint, sample request, calendar link for office hours, opt-out line.

---

## Per-Phase Detail

### Phase A — Internal scaffolding (shipped)
- **Comms:** none external. Internal note in `#sdk-release` only.
- **Why silent:** no user-visible surface; freemium contract for `global-soil-data` set to `verify_jwt = false` to mirror `get-soil-data`, but no regions are routed yet.

### Phase B — Teagasc (IE) + UKSO (UK)
- **Pre-announce:** design partners with UK/IE field interest
- **Public theme:** "First non-US soil coverage in the SDK"
- **Assets:** updated coverage map, 1 sample notebook per adapter, QGIS plugin screenshot
- **Risk callouts:** rate limits on UKSO; document graceful degradation to ISRIC

### Phase C — DE + NL pilot (ISRIC)
- **Pre-announce:** Germany + Netherlands prospects, EU partners
- **Public theme:** "EU pilot generally available"
- **Assets:** pricing confirmation (no tier change), localized care variables note, Consumer API v2 compatibility statement
- **Tie-in:** reference `PHASED_EUROPEAN_ROLLOUT.md` budget/scope publicly only at the outcome level

### Phase D — FAO GLOSIS + UNEP
- **Pre-announce:** enterprise + compliance buyers (ISA TRAQ, GMP, FDA, CEJST adjacencies)
- **Public theme:** "EU expansion wave 2 — broader environmental context"
- **Assets:** updated data-quality envelope examples; freshness/confidence flags highlighted

### Phase E — SDK v3.0 GA
- **Pre-announce:** full customer base, founders program (auto-upgrade thresholds noted), Stripe metered billing customers
- **Public theme:** "SDK v3.0 GA across 6 languages"
- **Assets:** regenerated OpenAPI SDKs via GitHub Actions, migration guide from v2.x, updated `/docs` landing tiles, MCP tool catalog refresh

---

## Change Log

| Date | Editor | Change |
|------|--------|--------|
| 2026-05-05 | DevRel | Initial schedule created alongside Phase A scaffolding |
