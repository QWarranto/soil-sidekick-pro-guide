# Compliance & Legal Documentation

**Version:** 3.1.0
**Last updated:** 2026-07-03
**Owner:** Legal & Compliance

---

## 1. Scope

Regulatory frameworks, legal obligations, IP posture, and licensing that apply to the SoilSidekick Pro / LeafEngines platform.

## 2. Applicable Frameworks

| Framework | Status | Evidence |
|---|---|---|
| SOC 2 Type 1 | Certified | Annual auditor report |
| GDPR (EU) | Compliant | DPA, DPO on file, DSAR flow |
| CCPA / CPRA (California) | Compliant | Do-not-sell toggle, deletion flow |
| ISA TRAQ | Aligned | Data pipeline attestation |
| GMP / FDA | Applicable to agri-input recommendations | Disclaimers, safety limits |
| CEJST | Data standards followed | Mapping documentation |
| WCAG 2.1 AA | Compliant | Axe scans + manual audit |
| ISO 27001 | Roadmap 2026-Q4 | Gap analysis complete |
| PCI DSS | Via Stripe (SAQ A) | Stripe attestation |

## 3. Data Classification

Managed in `data_classification` table:

| Class | Examples | Handling |
|---|---|---|
| Public | County soil averages | Free tier |
| Internal | Aggregated usage | Auth-gated |
| Confidential | Field boundaries, sensor data | RLS, encrypted |
| Restricted | PII, payment metadata | AES-256, MFA admin |

## 4. Privacy Rights (GDPR / CCPA)
- Right to access — Settings → Export Data (JSON)
- Right to rectification — profile edits
- Right to erasure — Settings → Delete Account; 30-day hard delete
- Right to portability — GeoJSON, CSV exports
- Right to object — opt-out toggle
- Breach notification: 72 h to supervisory authority; user notice as required

## 5. Data Processing Agreements
- Standard DPA available at `docs.leafengines.com/dpa`
- Sub-processors: Supabase, Stripe, Google (GEE), Lovable AI Gateway, Composio, Sentry
- List updated when sub-processors change; 30-day notice

## 6. Retention & Deletion

| Data | Retention |
|---|---|
| Account (active) | Life of account |
| Account (deleted) | Purged in 30 days |
| Backups | 7 days rolling |
| Audit logs | 400 days minimum |
| Compliance logs | 7 years |
| Anonymous usage | 90 days |

## 7. Intellectual Property

### 7.1 Patents
- **U.S. #19/320,727** — Positional integrity write-inhibition
- **U.S. #19/544,827** — CIP: Inertial Dead Reckoning + Kalman logic
- Additional filings in progress (defense / PNT stack)

### 7.2 Trademarks
- SoilSidekick Pro®
- LeafEngines™
- SoilCertify (unregistered)

### 7.3 Copyright
- Integration code released under Apache 2.0 / MIT (see `docs/open-source/`)
- Core algorithms proprietary, patent-protected

### 7.4 Open-Source Licenses
- Tracked in `sdks/` and per-package `LICENSE` files
- SBOM produced with each release

## 8. Marketing & Public Statements
- No disclosure of algorithmic specifics or methodology in customer-facing docs (`mem://strategy/patent-secrecy-in-marketing-materials`)
- Claims verified by Legal before publishing
- Testimonials require written consent

## 9. Contractual Framework
- MSA + Order Forms for Enterprise
- Click-through ToS for Free / Starter / Pro
- SLA credits for Enterprise (99.9% uptime)
- Liability caps per contract; carve-outs for gross negligence

## 10. Export Controls
- Encryption classified ECCN 5D002; EAR compliant
- No sanctioned country access; geo-block enforced

## 11. Accessibility Statement
- WCAG 2.1 AA
- Contact: `accessibility@soilsidekickpro.com`

## 12. Cookie & Tracking
- Cookie banner in EU/UK
- Only strictly-necessary by default; analytics opt-in
- No cross-site tracking

## 13. Third-Party Compliance Impact
- Stripe processes payments (PCI)
- Supabase hosts data (SOC 2, HIPAA-ready for enterprise plan)
- Google GEE subject to Google's T&C; monitored quarterly

## 14. Regulatory Reporting
- Annual SOC 2 report to enterprise on NDA
- Quarterly compliance dashboard internal
- Ad-hoc breach reports as required

## 15. Legal Contacts
- Legal: `legal@soilsidekickpro.com`
- Privacy: `privacy@soilsidekickpro.com`
- DPO (EU representative): via legal
- Abuse: `abuse@leafengines.com`

## 16. Amendments
- ToS / Privacy Policy versioned; email notice 30 days prior
- Historical versions archived on docs site

## 17. Related
- Security Documentation
- Risk Assessment
- User Documentation
