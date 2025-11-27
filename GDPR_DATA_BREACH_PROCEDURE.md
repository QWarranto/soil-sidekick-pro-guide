# Data Breach Response Procedure
## GDPR Articles 33 & 34 Compliance - SoilSidekick Pro

**Document Version:** 1.0  
**Last Updated:** 2025-11-27  
**Procedure Owner:** Data Protection Officer  
**Review Frequency:** Annual

---

## 1. Overview

This procedure establishes the process for detecting, responding to, and reporting data breaches in compliance with GDPR Articles 33 (Notification to supervisory authority) and 34 (Communication to data subjects).

**Critical Deadlines:**
- **72 hours:** Notify supervisory authority (from becoming aware)
- **Without undue delay:** Notify affected individuals (if high risk)

---

## 2. What is a Personal Data Breach?

**GDPR Definition (Article 4(12)):**
> A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data transmitted, stored or otherwise processed.

### 2.1 Types of Breaches

**Confidentiality Breach:**
- Unauthorized or accidental disclosure
- Data stolen or accessed by unauthorized party
- Ransomware making data accessible to attackers
- Lost/stolen unencrypted devices

**Integrity Breach:**
- Unauthorized or accidental alteration of data
- Data corruption
- Malicious modification of records

**Availability Breach:**
- Permanent or temporary loss of access to data
- Destruction of data
- System outages preventing access
- Ransomware encrypting data

---

## 3. Breach Detection and Reporting

### 3.1 Detection Sources

**Technical Monitoring:**
- Security monitoring systems (see `SECURITY_CRITICAL_CORRECTIONS.md`)
- Automated alerts (see `supabase/functions/security-monitoring/`)
- Intrusion detection systems
- Audit log anomalies

**Human Reporting:**
- Staff discovery
- User reports
- Third-party notification
- Security researcher disclosure

### 3.2 Internal Breach Reporting

**All staff must immediately report suspected breaches to:**
- **Primary:** Data Protection Officer (DPO)
- **Email:** dpo@soilsidekick.com
- **Phone:** [DPO EMERGENCY NUMBER]
- **Secondary:** Security Team Lead

**Report via:**
- Breach reporting hotline
- Email to security@soilsidekick.com
- In-person notification

**Report even if:**
- Uncertain if it's a breach
- Seems minor
- No data actually compromised (attempted breach)

---

## 4. Immediate Response (First Hour)

### 4.1 Activate Breach Response Team

**Convene within 1 hour of detection:**

| Role | Responsibility | Contact |
|------|---------------|---------|
| **Incident Commander** | Overall coordination | [NAME/CONTACT] |
| **Data Protection Officer** | GDPR compliance, notifications | [NAME/CONTACT] |
| **Technical Lead** | Containment, investigation | [NAME/CONTACT] |
| **Legal Counsel** | Legal advice, liability | [NAME/CONTACT] |
| **Communications Lead** | Internal/external comms | [NAME/CONTACT] |
| **Management Rep** | Business decisions | [NAME/CONTACT] |

### 4.2 Initial Assessment (Within 1 Hour)

**Log the breach:**
- Breach ID: BREACH-YYYY-MM-DD-XXX
- Detection time
- Detection method
- Initial reporter

**Immediate questions:**
1. What happened? (brief description)
2. What data is involved?
3. How many individuals affected?
4. Is breach ongoing?
5. What immediate containment is needed?

### 4.3 Containment (Immediate)

**Priority actions:**
- Stop the breach (if ongoing)
- Isolate affected systems
- Revoke compromised credentials
- Block unauthorized access
- Preserve evidence (don't destroy logs)
- Document all actions taken

**Do NOT:**
- Delete logs or evidence
- Restore from backups immediately (may destroy evidence)
- Notify users yet (until full assessment)

---

## 5. Investigation and Assessment (Hours 2-24)

### 5.1 Detailed Investigation

**Investigate:**
1. **What happened?**
   - Timeline of events
   - Root cause analysis
   - How breach occurred
   - Security control failures

2. **What data was affected?**
   - Types of personal data
   - Data sensitivity level
   - Volume of records
   - Data encryption status

3. **Whose data?**
   - Number of affected individuals
   - Categories of data subjects
   - Jurisdictions

4. **What is the impact?**
   - Actual vs. potential impact
   - Risk to individuals' rights and freedoms
   - Likelihood of harm

**Document everything:**
- Maintain breach investigation log
- Timestamp all findings
- Preserve evidence
- Take screenshots/logs

### 5.2 Risk Assessment

**Assess risk to individuals:**

**Low Risk Indicators:**
- Data already public
- Data encrypted (strong encryption)
- Limited sensitive data
- Immediate containment successful
- No realistic harm scenario

**High Risk Indicators:**
- Sensitive/special category data
- Financial data
- Authentication credentials
- Children's data
- Large-scale breach (>1000 individuals)
- Identity theft risk
- Financial loss risk
- Reputational damage risk
- Physical harm risk

**Risk Assessment Matrix:**

| Impact | Likelihood Low | Likelihood Medium | Likelihood High |
|--------|---------------|-------------------|-----------------|
| High | Medium Risk | High Risk | High Risk |
| Medium | Low Risk | Medium Risk | High Risk |
| Low | Low Risk | Low Risk | Medium Risk |

**Notification Requirements:**
- **Low Risk:** Document only, no notification
- **Medium Risk:** Notify supervisory authority (72 hours)
- **High Risk:** Notify authority AND data subjects

---

## 6. Supervisory Authority Notification (Within 72 Hours)

### 6.1 When to Notify

**Must notify if:**
- Risk to individuals' rights and freedoms
- This is the DEFAULT - notify unless clearly low risk

**Can skip notification if:**
- Unlikely to result in risk to rights and freedoms
- Document reasoning thoroughly in breach log

### 6.2 72-Hour Deadline

**"Becoming aware":**
- Starts when organization has reasonable degree of certainty that breach occurred
- Not when first suspicion arises
- Not when fully investigated (don't delay notification)

**Countdown starts:** When incident commander confirms breach

**If deadline missed:**
- Still notify (better late than never)
- Explain reasons for delay
- Document why deadline missed

### 6.3 Notification Content (Article 33(3))

**Required information:**

1. **Nature of breach:**
   - Description of what happened
   - Types of breach (confidentiality/integrity/availability)
   - Timeline of events

2. **Contact point:**
   - Name of DPO or other contact
   - Email and phone number

3. **Likely consequences:**
   - Potential impact on individuals
   - Risk assessment summary
   - Possible harms

4. **Measures taken/proposed:**
   - Containment actions
   - Mitigation measures
   - Steps to prevent recurrence

5. **Categories and numbers:**
   - Categories of data subjects affected (approximate)
   - Number of individuals affected (approximate)
   - Categories of personal data records
   - Number of records affected (approximate)

**Phased notification:**
- If full information not available within 72 hours
- Submit initial notification with available information
- Follow up with additional information as investigation progresses
- Clearly mark as "Phased notification - part X of Y"

### 6.4 Notification Submission

**Supervisory Authority:**
- [INSERT RELEVANT DPA]
- Notification portal: [DPA BREACH NOTIFICATION URL]
- Email: [DPA BREACH EMAIL]
- Phone: [DPA BREACH HOTLINE]

**Submission method:**
- Online form (preferred)
- Email to designated address
- Secure upload portal

**Receipt confirmation:**
- Request confirmation of receipt
- Log submission time and method
- Keep copy of submission

---

## 7. Data Subject Notification (Without Undue Delay)

### 7.1 When to Notify Individuals

**Must notify if:**
- Breach likely to result in HIGH RISK to rights and freedoms
- Potential for significant harm

**Can skip if:**
1. **Encryption/technical protection:**
   - Data rendered unintelligible to unauthorized parties
   - Encryption key not compromised
   - Strong encryption (AES-256)

2. **Subsequent measures:**
   - Took measures ensuring high risk no longer likely
   - E.g., recovered data before accessed, revoked credentials

3. **Disproportionate effort:**
   - Too many individuals to contact individually
   - Contact details unknown
   - Use public communication instead

### 7.2 Notification Content (Article 34(2))

**Required information:**

1. **Description of breach:**
   - What happened (clear, plain language)
   - When it happened
   - What data was involved

2. **Contact point:**
   - Name of DPO or contact person
   - Email and phone number

3. **Likely consequences:**
   - Possible impact on individuals
   - What harm might occur

4. **Measures taken:**
   - What we've done to contain breach
   - What we're doing to mitigate harm
   - What we're doing to prevent recurrence

5. **Recommendations for individuals:**
   - Steps they can take to protect themselves
   - E.g., change password, monitor accounts, credit freeze

**Plain language required:**
- No jargon or technical terms
- Clear and concise
- Accessible to average person

### 7.3 Notification Method

**Direct communication (preferred):**
- Email to affected individuals
- SMS if phone number available
- Postal mail if no email
- In-app notification

**Public communication (if disproportionate effort):**
- Website banner
- Press release
- Social media announcement
- Must be equally effective to direct communication

### 7.4 Notification Template

**Email Subject:** Important Security Notice - Action Required

```
Dear [Name],

We are writing to inform you of a security incident that may affect your personal information held by SoilSidekick Pro.

**What happened:**
[Clear description of the breach in plain language]

**What information was involved:**
[List specific types of data: name, email, etc.]

**What we are doing:**
We have taken the following steps:
- [Containment action 1]
- [Containment action 2]
- [Investigation action]
- [Prevention measure]

**What you should do:**
We recommend you take the following steps to protect yourself:
1. [Recommendation 1 - e.g., change your password]
2. [Recommendation 2 - e.g., monitor your accounts]
3. [Recommendation 3 - e.g., enable two-factor authentication]

**Additional information:**
[Any other relevant details]

We sincerely apologize for this incident. The security of your information is our top priority, and we are taking this matter very seriously.

If you have any questions or concerns, please contact us:
- Email: [DPO EMAIL]
- Phone: [DPO PHONE]
- Hours: [AVAILABILITY]

You also have the right to lodge a complaint with the supervisory authority:
[INSERT RELEVANT DPA NAME AND CONTACT]

Sincerely,
[NAME]
[TITLE]
SoilSidekick Pro
```

---

## 8. Post-Incident Activities

### 8.1 Root Cause Analysis

**Conduct thorough investigation:**
- What happened (detailed timeline)
- Why it happened (root cause)
- How to prevent recurrence
- Lessons learned

**Deliverable:** Post-incident report (within 2 weeks)

### 8.2 Remediation Actions

**Implement fixes:**
- Technical improvements
- Process improvements
- Policy updates
- Staff training
- Security enhancements

**Track:**
- Action item list
- Responsible party
- Due date
- Completion status

### 8.3 Breach Log Maintenance

**Required by Article 33(5):**
- Document ALL breaches (even if no notification)
- Maintain comprehensive breach log
- Include: facts, effects, remedial action
- Available for supervisory authority inspection

**Location:** `comprehensive_audit_log` table + dedicated breach register

**Retention:** Indefinite (or per organizational policy minimum 5 years)

### 8.4 Follow-Up with Authorities

- Respond to any queries from supervisory authority
- Provide additional information if requested
- Submit follow-up reports as required
- Implement any recommendations

---

## 9. Breach Scenarios and Response Guides

### 9.1 Scenario: Ransomware Attack

**Initial Response:**
1. Isolate affected systems immediately
2. Do NOT pay ransom yet
3. Assess data exfiltration risk
4. Preserve forensic evidence

**Notification:**
- Notify supervisory authority (data access presumed)
- Notify individuals if high risk data
- Even if data encrypted by ransomware (availability breach)

**Considerations:**
- Were backups also encrypted?
- Was data exfiltrated before encryption?
- Are decryption tools available?

### 9.2 Scenario: Phishing Attack (Credential Compromise)

**Initial Response:**
1. Force password reset for affected accounts
2. Review access logs for unauthorized activity
3. Check for data exfiltration
4. Revoke active sessions

**Notification:**
- If credentials used to access data: notify authority
- If data actually accessed: notify individuals
- If no data accessed: document only (low risk)

### 9.3 Scenario: Database Misconfiguration

**Initial Response:**
1. Immediately restrict access
2. Review server logs for access attempts
3. Assess what data was exposed
4. Determine exposure duration

**Notification:**
- Depends on data sensitivity and actual access
- If exposed to internet: presume accessed
- If no evidence of access: assess risk

### 9.4 Scenario: Lost/Stolen Device

**Initial Response:**
1. Remote wipe if possible
2. Assess encryption status
3. Review what data was on device
4. Revoke device access

**Notification:**
- If unencrypted: notify
- If encrypted: likely low risk (document)

### 9.5 Scenario: Insider Threat

**Initial Response:**
1. Revoke access immediately
2. Preserve audit logs
3. Assess data accessed/exfiltrated
4. Consider law enforcement involvement

**Notification:**
- Depends on data accessed and intent
- Consider ongoing investigation
- Consult legal counsel

### 9.6 Scenario: Third-Party Processor Breach

**Initial Response:**
1. Demand immediate notification from processor
2. Assess impact on your data subjects
3. Coordinate response with processor

**Notification:**
- Controller (you) must notify authority
- Processor must notify you "without undue delay"
- Don't wait for processor to notify authority

---

## 10. Third-Party Breach Notifications

### 10.1 As Data Controller

**When processor notifies you of breach:**
1. Receive full details from processor
2. Conduct own risk assessment
3. Notify supervisory authority (72 hours from YOUR awareness)
4. Notify affected individuals if high risk
5. Document processor's response
6. Review DPA compliance

**Don't assume:**
- Processor will notify authority (that's your job)
- Processor's risk assessment is correct

### 10.2 As Data Processor (for SDK/API clients)

**When you discover breach affecting client data:**
1. Notify client "without undue delay" (Article 33(2))
2. Provide full details:
   - What happened
   - What client data affected
   - Number of client's users affected
   - Containment actions
3. Assist client with their notifications
4. Document notification to client

---

## 11. Training and Drills

### 11.1 Staff Training

**All staff must be trained on:**
- What is a data breach
- How to recognize breaches
- Reporting procedures
- Importance of immediate reporting
- Preservation of evidence

**Frequency:** Annual + onboarding

### 11.2 Breach Response Drills

**Conduct tabletop exercises:**
- Frequency: Bi-annual
- Scenarios: Different breach types
- Test: Response time, roles, communication
- Document: Lessons learned, improvements

**Drill scenarios:**
- Ransomware attack
- Phishing campaign
- Database exposure
- Lost device
- Insider threat

---

## 12. Communication Management

### 12.1 Internal Communications

**During breach response:**
- Regular status updates to management
- Need-to-know basis
- Confidential information
- Designated spokesperson only

### 12.2 External Communications

**Media inquiries:**
- Refer to Communications Lead
- Consistent messaging
- Protect investigation integrity
- Balance transparency with ongoing investigation

**Customer support:**
- Prepare FAQs
- Train support staff
- Consistent responses
- Escalation procedures

### 12.3 Public Relations

**If public disclosure needed:**
- Draft public statement (Communications Lead + Legal)
- Key messages:
  - What happened
  - What we're doing
  - How to contact us
  - Commitment to security
- Monitor social media
- Respond to concerns professionally

---

## 13. Metrics and Reporting

### 13.1 Breach Metrics

**Track:**
- Total breaches (annually)
- Breaches by type
- Time to detection (mean)
- Time to containment (mean)
- Time to notification (mean)
- Individuals affected (total)
- Supervisory authority inquiries
- Enforcement actions

### 13.2 Reporting to Management

**Monthly:**
- Breach summary (if any)
- Near-miss incidents
- Security improvements

**Quarterly:**
- Breach trends analysis
- Response effectiveness
- Training status
- Drill results

**Annually:**
- Comprehensive breach report
- Year-over-year comparison
- Risk assessment
- Investment recommendations

---

## 14. Legal and Regulatory Considerations

### 14.1 Potential Consequences

**GDPR Fines:**
- Tier 2: Up to €10 million or 2% global turnover
  - Breach of notification requirements
  - Processor obligations
- Tier 3: Up to €20 million or 4% global turnover
  - Breach of security principles

**Other consequences:**
- Corrective measures ordered
- Processing restrictions
- Data subject compensation claims
- Reputational damage
- Loss of customer trust

### 14.2 Regulatory Investigations

**If supervisory authority investigates:**
- Cooperate fully
- Provide requested information
- Implement recommendations
- Regular status updates

### 14.3 Legal Advice

**Consult legal counsel for:**
- High-risk breaches
- Potential litigation
- Law enforcement involvement
- Public disclosure decisions
- Regulatory investigations

---

## 15. Breach Prevention

### 15.1 Preventive Measures

**Technical:**
- Encryption (data at rest and in transit)
- Access controls
- Multi-factor authentication
- Security monitoring
- Patch management
- Secure configuration
- Data minimization

**Organizational:**
- Staff training
- Access policies
- Incident response plan
- Regular audits
- Vendor management
- Business continuity planning

### 15.2 Continuous Improvement

**After each breach (or drill):**
- Update procedures based on lessons learned
- Implement technical improvements
- Enhance training
- Review and update policies

---

## 16. Emergency Contacts

### Breach Response Team

| Role | Name | Email | Phone | Alternate |
|------|------|-------|-------|-----------|
| Incident Commander | [NAME] | [EMAIL] | [PHONE] | [NAME] |
| Data Protection Officer | [NAME] | [EMAIL] | [PHONE] | [NAME] |
| Technical Lead | [NAME] | [EMAIL] | [PHONE] | [NAME] |
| Legal Counsel | [NAME] | [EMAIL] | [PHONE] | [NAME] |
| Communications Lead | [NAME] | [EMAIL] | [PHONE] | [NAME] |

### External Contacts

- **Supervisory Authority:** [DPA BREACH HOTLINE]
- **Legal Counsel (External):** [LAW FIRM CONTACT]
- **Forensics Firm:** [INCIDENT RESPONSE FIRM]
- **Cyber Insurance:** [INSURER CONTACT / POLICY NUMBER]
- **Law Enforcement:** [CYBERCRIME UNIT CONTACT]

---

## 17. Related Documents

- `GDPR_COMPLIANCE_DOCUMENTATION.md`
- `SECURITY_CRITICAL_CORRECTIONS.md`
- `OPERATIONAL_MAINTENANCE.md`
- Business Continuity Plan
- Disaster Recovery Plan
- Incident Response Runbooks

---

## 18. Document Control

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
**Next Drill:** _________________________

---

**END OF DOCUMENT**
