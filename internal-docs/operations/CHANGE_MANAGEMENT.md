# Change Management Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Engineering / Change owner
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Purpose and process status

Provide traceable proposals, reviews, tests, deployments, rollbacks and communication. Roles/cadences below are required process assignments, not proof of a staffed CAB, configured branch protection or historical sign-off.

| Change | Required review |
|---|---|
| Documentation/presentation | Content owner; confidentiality review for public material |
| Feature/API/cache | Engineering, contract and relevant product review |
| Identity/data integrity/security | Engineering + security; migration/grants review |
| Safety-critical OEM/autonomy | Engineering + Safety Officer; HIL release evidence |
| Patent/legal statement | Counsel approval; separate from engineering release |

## 2. Change record

Capture purpose, source revision, affected contracts, implementation status, risk, test/rollback plan, owner, approvals, deployment evidence and post-deploy readback. Internal RFCs/ADRs belong under internal-docs, not public docs. Never infer implementation date from document date or describe a design artifact as deployed.

## 3. October reconciliation

The October 6 adaptive water-cache deployment is a prior reported engineering event; this revision reruns arithmetic tests and reviews source, not that deployment. October 30 schema/spec files are design-only. October 31 updates all 13 documentation categories without runtime fixes or new legal filings.

Explicitly record the remaining scope/source-volatility mismatch, WQP station-distance/unit caveats, local strict-decoding gap and VRT/controller safety limitations. Preserve original filing dates and evidence; do not backdate upgrades to satisfy prosecution statements.

## 4. Contract and publication gates

Update machine-readable and human contracts together when behavior changes, but a documentation refresh alone must not alter the OpenAPI contract or regenerate a claimed release. Actual behavior currently differs from old asset idempotency/If-Match/cursor examples and quota prose; treat reconciliation as separate engineering work.

Publish customer-facing docs only through the existing allowlist/generated import boundary and content review. Internal docs remain internal. docs:check verifies exposure structure, not factual accuracy, certification or patent secrecy of every sentence.

## 5. Validation and deployment

Run selective tests, authenticated central-flow verification and applicable source/provider checks. Retain executed results and skips; do not mark demo/mock/signed-out flows as production proof. Deployment of web, edge functions and migrations are distinct steps. Flag irreversible changes and test bounded rollback/forward-fix before execution; do not promise automatic data reversal.

## 6. Completion and communication

A change is done only for its stated scope. Distinguish source implemented, executed validation, deployment unverified, proposal and external approval. SLA targets, maintenance windows, rollout percentages, CAB tools and response timelines require approved operational evidence rather than copied boilerplate. Safety/counsel findings remain open until accountable reviewers resolve them.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
