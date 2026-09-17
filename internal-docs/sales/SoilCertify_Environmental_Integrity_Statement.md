# Environmental Integrity Statement
**SoilCertify × SoilSidekick Pro (SSP) — Buyer Due-Diligence One-Pager**
*Version 1.0 · June 30, 2026*

---

## Purpose

This statement is intended for inclusion in SoilCertify buyer due-diligence packets. It documents the technical and governance controls that ensure carbon credits issued under the SoilCertify program — measured, modeled, and verified through the SoilSidekick Pro stack — do **not** contribute to negative environmental, social, or climate outcomes.

---

## Our Commitment

> SoilCertify does not issue, broker, or endorse carbon credits earned at the expense of water quality, biodiversity, soil health, food security, or environmental justice. Every credit is backed by auditable, multi-source evidence and is subject to automatic reversal detection.

---

## Five Integrity Guarantees

| # | Guarantee | Technical Backing |
|---|-----------|-------------------|
| 1 | **No phantom credits** — every credit is tied to a measured SOC delta | USDA SSURGO baselines + AlphaEarth 64-dim satellite embeddings + (optional) Skyline mmWave sensor fusion. Each credit record carries a `confidence_score` and `data_sources[]`. |
| 2 | **No greenwashed claims** — credits are flagged Estimated → Verified → Traded | Three-stage lifecycle in `credit_record.verification_status`; only third-party-verified credits are eligible for transfer. |
| 3 | **No silent reversals** — tillage, fire, or land-use change is auto-detected | Continuous AlphaEarth NDVI/thermal monitoring; reversal events trigger credit clawback workflows, not self-reporting. |
| 4 | **No co-pollutant trade-offs** — water and ecosystem impacts are tracked alongside carbon | EPA water-quality overlay + Environmental Impact Scoring run on every field; credit issuance is gated by non-degradation thresholds. |
| 5 | **No exclusion of smallholders** — free-tier access prevents pay-to-verify gatekeeping | Public `get-soil-data` and `county-lookup` endpoints via `x-free-tier` header; anyone can audit the underlying data. |

---

## Anti-Greenwashing Controls (Mapped to Common Allegations)

- **"Credits are imaginary."** → Field-level SOC deltas with confidence scores, satellite corroboration, and immutable verification hashes.
- **"Practices reverse silently."** → Automated remote-sensing reversal detection on a continuous cadence; no reliance on grower self-attestation.
- **"Carbon gains hide water/biodiversity harm."** → EPA overlay + Environmental Impact score must clear thresholds before a credit advances to Verified.
- **"Only large operators benefit."** → Permissive free-tier API and QGIS plugin distribution let researchers, NGOs, and smallholders audit and participate.
- **"Verification is a black box."** → Every credit record exposes `calculation_factors`, `data_sources`, and `confidence_score` via the public SDK.

---

## Governance & Auditability

- **Data integrity lock:** Database writes are inhibited when positional uncertainty exceeds 500 m, preventing speculative geolocated credits.
- **Permissive degradation:** Authenticated requests fall back to regional estimates rather than fail silently; all functional errors are logged to `/api-error-triage`.
- **Encryption & access:** AES-256 (V3) encryption on all PII; SOC 2-aligned RLS policies; `SECURITY DEFINER` functions hardened with `search_path = ''`.
- **Open SDKs:** Six-language SDK surface (Ruby, Python, PHP, Java, Go, TypeScript) means buyers and auditors can independently re-query any credit's evidence chain.
- **QGIS interoperability:** v1.0.6 plugin exposes WFS feature types (`sc:managed_assets`) for direct GIS audit by third-party verifiers.

---

## What Buyers Can Expect in a Due-Diligence Response

For any credit ID, SoilCertify can produce on request:

1. Source SSURGO baseline + sampling date
2. AlphaEarth embedding timeseries (baseline → current)
3. Sensor stream excerpts (where deployed)
4. Practice attestation + verifier sign-off
5. Water-quality and environmental impact deltas over the credit period
6. Reversal-monitoring log
7. Confidence score and methodology version

---

## Plain-Language Buyer Talking Points

1. *"Every SoilCertify credit ships with its receipts — satellite, soil, and sensor evidence are queryable by ID."*
2. *"We publicly commit: no carbon credit at the expense of water, biodiversity, or environmental justice."*
3. *"Reversal detection is automatic, not self-reported — the #1 complaint in voluntary markets is structurally addressed."*
4. *"Smallholder free-tier access is our anti-greenwashing receipt: anyone can audit us."*

---

*Contact: support@soilsidekickpro.com · Docs: https://app.soilsidekickpro.com/doc*
