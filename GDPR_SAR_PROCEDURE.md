# Subject Access Request (SAR) Procedure
## GDPR Article 15 Compliance - SoilSidekick Pro

**Document Version:** 1.0  
**Last Updated:** 2025-11-27  
**Procedure Owner:** Data Protection Officer  
**Review Frequency:** Annual

---

## 1. Overview

This procedure ensures compliance with GDPR Article 15 (Right of Access) by establishing a standardized process for handling Subject Access Requests (SARs).

**Deadline:** 1 month from receipt (extendable by 2 months if complex)

---

## 2. What is a Subject Access Request?

A SAR is a request by a data subject to obtain:
- Confirmation whether their personal data is being processed
- Access to their personal data
- Information about the processing (purpose, categories, recipients, retention, rights)

---

## 3. Receiving a SAR

### 3.1 Valid Request Channels

SARs can be received via:
- Email to: privacy@soilsidekick.com
- Written letter to registered address
- In-app support ticket marked "Data Access Request"
- Verbal request (must be confirmed in writing)

### 3.2 Initial Assessment

**Within 24 hours of receipt:**

1. **Log the request** in SAR tracking system
   - Request ID: SAR-YYYY-MM-DD-XXX
   - Date received
   - Request method
   - Requestor details

2. **Verify it's a valid SAR**
   - ✅ Made by data subject or authorized representative
   - ✅ Sufficient information to identify individual
   - ✅ Clear request for personal data access

3. **Not a SAR if:**
   - General inquiry about data practices
   - Request for information not containing personal data
   - Request from unauthorized third party

---

## 4. Identity Verification

### 4.1 Verification Requirements

**Purpose:** Prevent unauthorized disclosure

**Standard Verification (Registered Users):**
1. Email confirmation to registered email address
2. Login to account to confirm identity
3. Security question verification (if enabled)
4. Last 4 digits of payment method (for paying customers)

**Enhanced Verification (High-Risk Requests):**
- Government-issued ID copy
- Recent utility bill for address verification
- Video call verification
- Multi-factor authentication

### 4.2 Verification Timeline

- Request additional information within 3 days
- Pause 1-month deadline until verification complete
- Inform requestor: "We need to verify your identity. The 1-month deadline is paused until we receive [specific information]."

### 4.3 Unable to Verify

If identity cannot be verified:
- Document all verification attempts
- Refuse request (Article 12(6))
- Explain why to requestor
- Inform of right to complain to supervisory authority

---

## 5. Data Collection Process

### 5.1 Systems to Search

**Comprehensive search across:**

1. **Production Database (Supabase)**
   - `profiles` table
   - `soil_analyses` table
   - `fields` table
   - `user_tasks` table
   - `subscription_usages` table
   - `subscribers` table
   - `carbon_credits` table
   - `prescription_maps` table
   - `visual_analysis_results` table
   - `user_feedback` table
   - All user-linked tables

2. **Analytics Databases**
   - `usage_analytics` table
   - `cost_tracking` table (user_id linked)
   - `pwa_analytics` table

3. **Security and Audit Logs**
   - `auth_security_log` table
   - `comprehensive_audit_log` table
   - `security_audit_log` table
   - API access logs

4. **Third-Party Systems**
   - Stripe (customer and payment data)
   - Email service provider (communications)
   - Support system (ticket history)
   - Backup systems

5. **Communication Records**
   - Email correspondence
   - Support tickets
   - Marketing communications
   - System notifications

6. **Offline/Archive Storage**
   - Backups
   - Archived data
   - Deleted/soft-deleted records

### 5.2 Data Collection SQL Query Template

```sql
-- Example comprehensive data collection query
-- Run for specific user_id

-- Profile data
SELECT * FROM profiles WHERE user_id = '[USER_ID]';

-- Soil analyses
SELECT * FROM soil_analyses WHERE user_id = '[USER_ID]';

-- Fields
SELECT * FROM fields WHERE user_id = '[USER_ID]';

-- Tasks
SELECT * FROM user_tasks WHERE user_id = '[USER_ID]';

-- Subscription data
SELECT * FROM subscribers WHERE user_id = '[USER_ID]';

-- Carbon credits
SELECT * FROM carbon_credits WHERE user_id = '[USER_ID]';

-- Usage analytics (last 90 days)
SELECT * FROM usage_analytics 
WHERE user_id = '[USER_ID]' 
AND created_at > NOW() - INTERVAL '90 days';

-- Security logs (last 1 year)
SELECT event_type, created_at, ip_address, success, metadata 
FROM auth_security_log 
WHERE user_id = '[USER_ID]' 
AND created_at > NOW() - INTERVAL '1 year';

-- Audit trail (last 1 year)
SELECT operation, table_name, created_at, metadata 
FROM comprehensive_audit_log 
WHERE user_id = '[USER_ID]' 
AND created_at > NOW() - INTERVAL '1 year';

-- Continue for all relevant tables...
```

### 5.3 Data from Third-Party Processors

**Request data from:**
- **Stripe:** Customer data, payment history (use Stripe API or dashboard export)
- **Email provider:** Communication history
- **Support system:** Ticket history and attachments

---

## 6. Data Compilation and Review

### 6.1 Information to Provide

**Required Information (Article 15(1)):**

1. **Confirmation** that we process their data
2. **Purposes** of processing
3. **Categories** of personal data
4. **Recipients** or categories of recipients
5. **Retention period** or criteria
6. **Rights information:**
   - Right to rectification
   - Right to erasure
   - Right to restriction
   - Right to object
   - Right to lodge complaint with supervisory authority
7. **Source** of data (if not collected from subject)
8. **Automated decision-making** information (if applicable)
9. **Third country transfers** and safeguards

**Personal Data Categories to Include:**

- Identification data (name, email, user ID)
- Authentication data (password change dates, 2FA status - NOT actual passwords)
- Profile information
- Agricultural data (soil analyses, fields, tasks)
- Payment/subscription data (tokenized, no full card numbers)
- Usage analytics
- Communication history
- Support interactions
- Security events (high-level, not security-sensitive details)

### 6.2 Data Format

**Structured Data:**
- JSON format (machine-readable)
- CSV format (human-readable tables)
- Organized by data category

**Accompanying Document:**
- PDF cover letter explaining data
- Plain language descriptions
- Glossary of technical terms

### 6.3 Redaction and Exclusions

**Must Redact:**
- Other individuals' personal data (Article 15(4))
- Trade secrets
- Security-sensitive information (e.g., password hashes, security keys)
- Legally privileged information

**Can Refuse if:**
- Request is manifestly unfounded or excessive (Article 12(5))
- Charge reasonable fee or refuse
- Document reasoning thoroughly

### 6.4 Quality Assurance Review

**Before sending, verify:**
- ✅ All systems searched
- ✅ Data complete and accurate
- ✅ Third-party data personal data redacted
- ✅ Security-sensitive data excluded
- ✅ Format is readable
- ✅ Explanatory information included
- ✅ Reviewed by DPO or legal counsel

---

## 7. Response Delivery

### 7.1 Delivery Methods

**Secure Delivery Options:**
1. **Secure download link** (password-protected, time-limited)
2. **Encrypted email** (PGP or S/MIME if requestor has public key)
3. **Encrypted USB drive** (if postal delivery requested)
4. **In-app secure download** (if verified via account login)

**Never:**
- Send unencrypted personal data via regular email
- Use unsecured file sharing services
- Send to unverified email addresses

### 7.2 Response Letter Template

```
Subject: Your Data Access Request - Reference [SAR-YYYY-MM-DD-XXX]

Dear [Name],

Re: Subject Access Request under GDPR Article 15

Thank you for your data access request received on [DATE].

We confirm that we process personal data about you. Please find attached:

1. A copy of your personal data in JSON and CSV formats
2. Information about how we process your data (attached PDF)

Your personal data has been organized into the following categories:
- Account and profile information
- Agricultural data (soil analyses, fields, planting calendars)
- Payment and subscription information
- Usage analytics
- Communication history
- Security events

The attached document explains the purposes for which we process your data, how long we retain it, your rights, and other required information under Article 15 GDPR.

**Your Rights:**
You have the right to:
- Request rectification of inaccurate data
- Request erasure of your data
- Request restriction of processing
- Object to processing
- Lodge a complaint with the supervisory authority [INSERT RELEVANT DPA]

If you have any questions about this response, please contact our Data Protection Officer at [DPO_EMAIL].

Secure Download Link: [PASSWORD-PROTECTED LINK]
Password: [PROVIDED SEPARATELY]
Link expires: [DATE - 7 days from now]

Yours sincerely,
[NAME]
Data Protection Officer
SoilSidekick Pro
```

### 7.3 Timeline Compliance

- **Standard:** 1 month from receipt
- **Extension:** Additional 2 months if complex (inform within 1 month)
- **Calculate:** Calendar month from date of verified request

**Extension Notification Template:**
```
We have received your data access request. Due to the complexity and 
volume of information, we require an additional [1/2] month(s) to 
complete your request. We will provide your data by [NEW DATE].

This extension is permitted under Article 12(3) GDPR.
```

---

## 8. Follow-Up Actions

### 8.1 Record Keeping

**Maintain records of:**
- Request details (date, method, requestor)
- Verification steps taken
- Systems searched
- Data provided
- Response date
- Any issues or complications

**Storage:** SAR log in `comprehensive_audit_log` table

**Retention:** 3 years from completion (evidence of compliance)

### 8.2 Post-Response Monitoring

- Confirm requestor received data (delivery receipt)
- Address any follow-up questions within 5 business days
- Update internal procedures if issues identified

---

## 9. Special Situations

### 9.1 Requests from Children

- Verify age (if under 16, parental consent may be required)
- Use age-appropriate language in response
- Extra care with identity verification

### 9.2 Requests via Authorized Representative

- Verify authorization (power of attorney, written authorization)
- Confirm representative's identity
- Deliver response to representative

### 9.3 Requests for Deceased Individuals

- UK/EU: No GDPR right (but may have national law obligations)
- Verify relationship (executor, next of kin)
- Consult legal counsel
- Follow local law requirements

### 9.4 Manifestly Unfounded or Excessive Requests

**Indicators:**
- Repetitive requests without new circumstances
- Clearly intended to harass
- Overly broad or vague

**Action:**
- Charge reasonable fee (based on administrative costs)
- OR refuse request
- Document reasoning thoroughly
- Inform requestor of right to complain to DPA

---

## 10. Training and Awareness

### 10.1 Staff Training

**All staff handling SARs must be trained on:**
- GDPR Article 15 requirements
- Identity verification procedures
- Data collection processes
- Confidentiality and security
- Deadline calculations

**Training Frequency:** Annual + when procedures updated

### 10.2 Escalation Procedures

**Escalate to DPO if:**
- Identity verification concerns
- Suspected fraudulent request
- Complex legal issues
- Request involves other individuals' data
- Deadline at risk

---

## 11. Metrics and Reporting

### 11.1 SAR Metrics to Track

- Total SARs received (monthly/quarterly/annually)
- Average response time
- Requests completed within 1 month (%)
- Requests requiring extension (%)
- Identity verification issues (%)
- Requests refused (number and reasons)
- Complaints to supervisory authority

### 11.2 Regular Reporting

**To Management:**
- Quarterly SAR statistics report
- Issues and trends
- Process improvement recommendations

**To DPO:**
- All SAR requests logged immediately
- Weekly status updates on pending SARs
- Immediate notification of issues

---

## 12. Continuous Improvement

### 12.1 Process Review

- Review procedure annually
- Analyze metrics for improvement opportunities
- Update based on new guidance from supervisory authorities
- Incorporate lessons learned from completed SARs

### 12.2 Technology Solutions

**Consider implementing:**
- Automated SAR portal
- Data discovery tools
- Redaction software
- Secure delivery systems

---

## 13. Quick Reference Checklist

### SAR Response Checklist

- [ ] Request logged with unique ID
- [ ] Acknowledged within 24 hours
- [ ] Identity verified
- [ ] All systems searched (use checklist)
- [ ] Third-party data requested
- [ ] Data compiled and organized
- [ ] Other individuals' data redacted
- [ ] Security-sensitive data excluded
- [ ] Explanatory document prepared
- [ ] QA review completed
- [ ] Response delivered securely
- [ ] Within 1-month deadline (or extension granted)
- [ ] Delivery confirmed
- [ ] Records updated
- [ ] Request closed

---

## 14. Contact Information

**For SAR Requests:**
- Email: privacy@soilsidekick.com
- Address: [REGISTERED ADDRESS]

**Data Protection Officer:**
- Name: [DPO NAME]
- Email: [DPO EMAIL]
- Phone: [DPO PHONE]

**Supervisory Authority:**
- [INSERT RELEVANT DPA]
- Website: [DPA WEBSITE]
- Complaint form: [DPA COMPLAINT URL]

---

## 15. Related Documents

- `GDPR_COMPLIANCE_DOCUMENTATION.md`
- `GDPR_ROPA_CONTROLLER.md`
- `PRIVACY_POLICY.md`
- Data Subject Rights Policy
- Identity Verification Policy

---

## 16. Document Control

**Approval:**
- Prepared by: _________________________
- Reviewed by DPO: _________________________
- Approved by: _________________________
- Date: _________________________

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-27 | System | Initial procedure |

**Next Review:** 2026-11-27

---

**END OF DOCUMENT**
