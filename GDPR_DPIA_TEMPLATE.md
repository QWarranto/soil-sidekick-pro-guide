# Data Protection Impact Assessment (DPIA) Template
## GDPR Article 35 - SoilSidekick Pro

**DPIA Reference:** DPIA-[FEATURE/PROCESS]-YYYY-MM-DD  
**Assessment Date:** [DATE]  
**Assessor:** [NAME]  
**DPO Review:** [NAME/DATE]  
**Status:** ☐ Draft ☐ Final ☐ Approved

---

## 1. Introduction

### 1.1 Purpose

This Data Protection Impact Assessment (DPIA) evaluates the privacy and data protection risks associated with [FEATURE/PROCESSING ACTIVITY] and identifies measures to mitigate those risks.

**DPIA Required When:**
- Systematic and extensive profiling with legal/similar significant effects
- Large-scale processing of special category data
- Systematic monitoring of publicly accessible areas
- Use of new technologies
- Processing operations that pose high risk to rights and freedoms

### 1.2 Scope

**Processing Activity:** [NAME AND DESCRIPTION]

**Business Purpose:** [WHY THIS PROCESSING IS NEEDED]

**Data Subjects:** [WHO IS AFFECTED]

**Data Categories:** [WHAT PERSONAL DATA]

---

## 2. Description of Processing

### 2.1 Nature of Processing

**What personal data is processed?**
[List all categories of personal data]

Example:
- Name
- Email address
- Location data (GPS coordinates)
- Agricultural data (soil analyses, crop information)
- Payment information (tokenized)
- Usage analytics

**How is it processed?**
[Describe collection, storage, use, disclosure, retention, deletion]

Example:
- Collected via: Web form, mobile app, API integration
- Stored in: Supabase database with encryption at rest
- Used for: Soil analysis, crop recommendations, service delivery
- Disclosed to: OpenAI (AI analysis), MapBox (mapping)
- Retained for: Duration of service + 2 years
- Deleted when: User deletes account or data retention period expires

### 2.2 Scope of Processing

**How many individuals?**
[Estimated number of data subjects]

**Geographic scope:**
[Which countries/regions?]

**Duration:**
[How long will processing continue?]

**Data volume:**
[Approximate amount of data]

### 2.3 Context of Processing

**Relationship with data subjects:**
[Customer, employee, visitor, etc.]

**Control over their data:**
[Can they access, correct, delete? How?]

**Expectations:**
[What would individuals reasonably expect?]

**Technology used:**
[New or established technologies? Which?]

---

## 3. Consultation

### 3.1 Internal Stakeholders Consulted

| Stakeholder | Role | Date | Input |
|-------------|------|------|-------|
| [Name] | Product Manager | [Date] | [Key points] |
| [Name] | Tech Lead | [Date] | [Key points] |
| [Name] | Security Team | [Date] | [Key points] |
| [Name] | Legal Counsel | [Date] | [Key points] |

### 3.2 Data Protection Officer

**DPO Consulted:** ☐ Yes ☐ No ☐ N/A

**DPO Name:** [NAME]  
**Date Consulted:** [DATE]  
**DPO Advice:** [SUMMARY]

### 3.3 Data Subjects

**Were data subjects consulted?** ☐ Yes ☐ No

**If Yes:**
- Method: [Survey, focus group, user testing, etc.]
- Date: [DATE]
- Key feedback: [SUMMARY]

**If No:**
- Reason: [EXPLAIN WHY NOT]

---

## 4. Necessity and Proportionality

### 4.1 Lawful Basis

**Legal basis for processing (Article 6):**
☐ Consent (Art 6(1)(a))  
☐ Contract (Art 6(1)(b))  
☐ Legal obligation (Art 6(1)(c))  
☐ Vital interests (Art 6(1)(d))  
☐ Public task (Art 6(1)(e))  
☐ Legitimate interests (Art 6(1)(f))

**Justification:** [EXPLAIN WHY THIS BASIS APPLIES]

**If special category data (Art 9):**
☐ Explicit consent (Art 9(2)(a))  
☐ Other specific condition: [SPECIFY]

### 4.2 Necessity Assessment

**Is this processing necessary?**
[Explain why you need to process this data]

**Could you achieve the same purpose with:**
- Less data? ☐ Yes ☐ No [Explain]
- Anonymized data? ☐ Yes ☐ No [Explain]
- Different processing method? ☐ Yes ☐ No [Explain]

**Data minimization:**
[How are you limiting data collection to what's necessary?]

### 4.3 Proportionality

**Is the processing proportionate to the purpose?**
[Balance between objective and privacy impact]

**Retention period justification:**
[Why this retention period is appropriate]

**Alternatives considered:**
[What other approaches were evaluated?]

---

## 5. Risk Assessment

### 5.1 Risk Identification

For each risk, assess:
- **Likelihood:** Low / Medium / High
- **Severity:** Low / Medium / High
- **Overall Risk:** Low / Medium / High / Very High

---

#### Risk 1: Unauthorized Access

**Description:** Personal data accessed by unauthorized individuals or systems

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Row-level security policies]
- [Control 2: e.g., Access controls and authentication]
- [Control 3: e.g., Encryption at rest]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 2: Data Breach / Loss

**Description:** Personal data lost, destroyed, or improperly disclosed

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Regular backups]
- [Control 2: e.g., Breach detection monitoring]
- [Control 3: e.g., Incident response plan]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 3: Inaccurate or Outdated Data

**Description:** Processing inaccurate data leading to wrong decisions/outcomes

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Data validation on input]
- [Control 2: e.g., Right to rectification]
- [Control 3: e.g., Regular data quality checks]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 4: Function Creep / Scope Expansion

**Description:** Data used for purposes beyond original collection

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Purpose limitation policy]
- [Control 2: e.g., Privacy policy transparency]
- [Control 3: e.g., Data governance oversight]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 5: Third-Party Processing

**Description:** Data processors failing to protect data adequately

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Data Processing Agreements (DPAs)]
- [Control 2: e.g., Vendor security assessments]
- [Control 3: e.g., Regular audits]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 6: International Transfers

**Description:** Inadequate protection when transferring data to third countries

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Standard Contractual Clauses]
- [Control 2: e.g., Transfer Impact Assessment]
- [Control 3: e.g., Supplementary technical measures]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 7: Lack of Transparency

**Description:** Data subjects unaware of processing or unable to exercise rights

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Clear privacy policy]
- [Control 2: e.g., User-friendly rights exercise]
- [Control 3: e.g., Just-in-time notices]

**Residual Risk (After Controls):** [Low/Medium/High]

---

#### Risk 8: Automated Decision-Making

**Description:** Automated processing with significant effects on individuals

**Applicable?** ☐ Yes ☐ No

**If Yes:**

**Likelihood:** [Low/Medium/High]  
**Severity:** [Low/Medium/High]  
**Overall Risk:** [Low/Medium/High/Very High]

**Potential Impact on Data Subjects:**
- [Impact 1]
- [Impact 2]

**Current Controls:**
- [Control 1: e.g., Human oversight]
- [Control 2: e.g., Right to contest decision]
- [Control 3: e.g., Algorithm transparency]

**Residual Risk (After Controls):** [Low/Medium/High]

---

### 5.2 Additional Risks

**[Risk Name]:**
[Description, likelihood, severity, impact, controls, residual risk]

---

### 5.3 Overall Risk Summary

| Risk Category | Initial Risk | Residual Risk (After Controls) |
|---------------|-------------|--------------------------------|
| Unauthorized Access | [Level] | [Level] |
| Data Breach | [Level] | [Level] |
| Inaccurate Data | [Level] | [Level] |
| Function Creep | [Level] | [Level] |
| Third-Party Processing | [Level] | [Level] |
| International Transfers | [Level] | [Level] |
| Lack of Transparency | [Level] | [Level] |
| Automated Decision-Making | [Level] | [Level] |

**Overall Assessment:**
☐ Low Risk (continue processing)  
☐ Medium Risk (implement additional controls)  
☐ High Risk (significant controls required)  
☐ Very High Risk (may not proceed without DPO/authority consultation)

---

## 6. Measures to Address Risks

### 6.1 Technical Measures

| Measure | Description | Implementation Status | Responsible | Due Date |
|---------|-------------|----------------------|-------------|----------|
| Encryption | AES-256 encryption at rest | ☐ Implemented | [Name] | [Date] |
| Access Controls | Role-based access, RLS policies | ☐ Implemented | [Name] | [Date] |
| Pseudonymization | Hash IPs, tokenize sensitive data | ☐ Implemented | [Name] | [Date] |
| Security Monitoring | Automated threat detection | ☐ Implemented | [Name] | [Date] |
| [Add more] | | | | |

### 6.2 Organizational Measures

| Measure | Description | Implementation Status | Responsible | Due Date |
|---------|-------------|----------------------|-------------|----------|
| Staff Training | Data protection training program | ☐ Implemented | [Name] | [Date] |
| Privacy Policy | Clear, accessible privacy notice | ☐ Implemented | [Name] | [Date] |
| DPA | Data Processing Agreements with vendors | ☐ Implemented | [Name] | [Date] |
| Incident Response | Breach response procedures | ☐ Implemented | [Name] | [Date] |
| [Add more] | | | | |

### 6.3 Rights Management

**How data subjects can exercise their rights:**

- **Right of Access:** [Method and timeline]
- **Right to Rectification:** [Method and timeline]
- **Right to Erasure:** [Method and timeline]
- **Right to Restriction:** [Method and timeline]
- **Right to Data Portability:** [Method and timeline]
- **Right to Object:** [Method and timeline]

**Contact Point:** [DPO EMAIL/CONTACT]

---

## 7. Compliance with GDPR Principles

### 7.1 Lawfulness, Fairness, Transparency

**How is processing lawful?**
[Legal basis under Art 6/9]

**How is it fair?**
[No hidden processing, reasonable expectations]

**How is it transparent?**
[Privacy policy, notices, easy-to-understand language]

### 7.2 Purpose Limitation

**Specified purposes:**
[List specific, explicit, legitimate purposes]

**Compatible use:**
[If used for other purposes, how is compatibility assessed?]

### 7.3 Data Minimization

**What data is collected:**
[Only what's necessary]

**What is not collected:**
[What unnecessary data is explicitly NOT collected]

### 7.4 Accuracy

**How is accuracy ensured?**
[Validation, correction procedures, regular reviews]

### 7.5 Storage Limitation

**Retention period:** [Specific period or criteria]

**Deletion process:** [How and when is data deleted]

### 7.6 Integrity and Confidentiality

**Security measures:** [Technical and organizational measures]

**Testing:** [Security testing frequency and methods]

### 7.7 Accountability

**How is compliance demonstrated?**
- This DPIA
- Privacy policy
- Consent records
- Training records
- Audit logs
- [Others]

---

## 8. International Transfers

**Are there international transfers?** ☐ Yes ☐ No

**If Yes:**

| Recipient | Country | Transfer Mechanism | Adequacy Decision | Additional Safeguards |
|-----------|---------|-------------------|-------------------|----------------------|
| [Name] | [Country] | SCCs / Other | ☐ Yes ☐ No | [TIA, encryption, etc.] |

**Transfer Impact Assessment (TIA) completed?** ☐ Yes ☐ No

**Reference:** [TIA DOCUMENT REFERENCE]

---

## 9. Conclusion and Approval

### 9.1 Risk Assessment Outcome

**Overall risk level (after controls):**
☐ Acceptable - Proceed with processing  
☐ Elevated - Implement additional measures before proceeding  
☐ High - Consult with DPO and/or supervisory authority

### 9.2 Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

### 9.3 Action Plan

| Action | Responsible | Due Date | Status |
|--------|-------------|----------|--------|
| [Action 1] | [Name] | [Date] | ☐ Complete |
| [Action 2] | [Name] | [Date] | ☐ Complete |

### 9.4 Review Schedule

**DPIA review frequency:** [Annual / When significant changes / Other]

**Next review date:** [DATE]

**Trigger for review:**
- Significant change to processing
- New technology introduced
- Data breach or security incident
- Change in legal requirements
- DPO or supervisory authority recommendation

### 9.5 DPO Sign-Off

**DPO consulted:** ☐ Yes ☐ No

**DPO Comments:**
[DPO REVIEW AND RECOMMENDATIONS]

**DPO Approval:**
- Name: _________________________
- Signature: _________________________
- Date: _________________________

### 9.6 Management Approval

**Processing approved to proceed?** ☐ Yes ☐ No ☐ Conditional

**Approved by:**
- Name: _________________________
- Title: _________________________
- Signature: _________________________
- Date: _________________________

**Conditions (if applicable):**
[LIST ANY CONDITIONS]

---

## 10. Document Control

**Version History:**

| Version | Date | Author | Changes | Approved By |
|---------|------|--------|---------|-------------|
| 0.1 | [Date] | [Name] | Initial draft | - |
| 1.0 | [Date] | [Name] | Final version | [Name] |

**Related Documents:**
- `GDPR_COMPLIANCE_DOCUMENTATION.md`
- `GDPR_ROPA_CONTROLLER.md`
- `PRIVACY_POLICY.md`
- `SECURITY_CRITICAL_CORRECTIONS.md`

**Accessibility:**
- Stored: [LOCATION]
- Available to: DPO, Management, Supervisory Authority (on request)

---

**END OF DPIA TEMPLATE**

**Note:** This is a template. Each new processing activity requiring a DPIA should create a new document from this template with the DPIA reference number and complete all sections thoroughly.
