# Risk Assessment and Mitigation Documentation

**Classification: Internal Only**
**Documentation revision:** 2026-10-31
**Last updated:** 2026-10-31
**Owner:** Risk / Engineering / Compliance
**Status:** Source-reviewed; operational/release approval not inferred

## 1. Methodology

Prioritize by safety, confidentiality, integrity and operational impact. Previous likelihood/impact numbers were planning estimates, not measured probabilities. This review uses qualitative priorities pending owner scoring. Proposed controls do not close a risk.

## 2. Current risk register

| Risk | Priority | Source-backed status and mitigation required |
|---|---|---|
| Uncertain positional persistence | Critical | >500m prohibition required; sync/asset paths lack explicit checks. Enforce admission/replay/server gates and bypass tests |
| Unsafe VRT/controller output | Critical | Fixed/duplicate geometry, fallback rates and export placeholders. Independent geometry/domain validation, abstention, human approval, vendor/HIL testing |
| Record/product patent mismatch | High | Measurement-derived volatility differs from scope/source assertions; later design not earlier operation. Preserve dates and obtain Igor's review |
| Misleading water observations | High | Monitoring-station/density distance, missing units/results and stale observations. Normalize, disclose and bound degraded use |
| Tenant/auth/key mismatch | High | RLS/service-role ownership and direct key lookups need live verification. Trace grants, hash handling, scopes and invalid-key behavior |
| Unsupported security/compliance claims | High | Monitors/source are not audit reports. Require certification, settings, contracts and scoped assurance evidence |
| Offline loss/duplicate replay | High | Ten-table executor exists; exactly-once and universal write gate not proved. Test force-close, reconnect, duplicate creates and readback |
| Prompt/tool injection | High | Untrusted input may influence output. Strict permissions, independent validation, redaction and controlled tool use |
| Local model availability/latency | Medium | Browser/runtime/weights/GPU constraints. Capability tests and measured accelerated/degraded behavior |
| Quota/SDK contract drift | Medium | Client maps/OpenAPI/server/key limits differ. Reconcile per endpoint and registry artifact, test actual imports |
| Provider/edge limits | Medium | Upstream outages; 50-request/2MB budgets. Pagination, chunking, bounded advisory degradation |
| Billing/dependency risks | Medium | Usage replay and stale client floors. Reconciliation/idempotency, dependency audit and PHP execution validation |
| Public exposure | High | Allowlist limits inclusion; content still needs secrecy review. Keep internal records out of docs/public |

## 3. Integrity and insurance boundaries

Position uncertainty is meters, not validated 0–1 cryptographic location truth. Sensor continuity/timestamps do not prove an event, spoof prevention or fraud reduction. Satellite 10m pixels do not imply 10m report accuracy; soil fallback may be coarser. Do not claim automated loss verification, underwriting decisions or 90% analyst savings without measured evidence.

## 4. Compensations and release gates

Maintain advisory/simulation/operational separation, independent validation, meaningful provenance, human approval, target-specific HIL and bounded degradation. These are required compensations, not implemented controls. Permissive advisory APIs never authorize uncertain writes or unsafe operational commands.

## 5. Governance

Assign engineering/security/data/AI/legal owners before closing actions. Escalate critical integrity or safety gaps immediately to accountable leads. Reassess after each corrective change with executed evidence. Cyber insurance, liability caps, SLA credits and regulatory notification processes are contract-dependent and not confirmed by this checkout.

## Evidence and revision record

See [the October 31 review](../operations/DOCUMENTATION_REFRESH_2026-10-31.md) for the source inventory, executed validation, historical dates and outstanding compensations. This documentation revision does not deploy code or change a patent filing.
