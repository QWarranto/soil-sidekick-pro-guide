# Records of Processing Activities (ROPA) - Data Controller
## SoilSidekick Pro

**Document Version:** 2.1  
**Last Updated:** 2026-02-10  
**Data Controller:** SoilSidekick Pro  
**DPO Contact:** [To be completed]

---

## Purpose

This document fulfills the Article 30 GDPR requirement for data controllers to maintain records of processing activities.

---

## 1. User Account Management

### 1.1 Basic Information

**Processing Activity Name:** User Account Management and Authentication

**Controller Details:**
- Name: SoilSidekick Pro
- Address: [To be completed]
- Contact: [To be completed]
- DPO: [To be completed]

### 1.2 Purposes of Processing

- User authentication and access control
- Account creation and management
- Service provision under user agreement
- Security monitoring and fraud prevention

### 1.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) - Performance of contract
- **Secondary:** Legitimate interests (Article 6(1)(f)) - Security and fraud prevention

### 1.4 Categories of Data Subjects

- Registered users (farmers, agricultural professionals)
- Trial users
- Account administrators

### 1.5 Categories of Personal Data

**Identification Data:**
- Email address (encrypted)
- Full name
- User ID (UUID)

**Authentication Data:**
- Password hash (bcrypt)
- Two-factor authentication settings
- Trusted device information
- Security questions (encrypted)

**Account Security Data:**
- Failed login attempts
- Last login timestamp
- IP addresses (hashed)
- User agent strings
- Session tokens

### 1.6 Categories of Recipients

**Internal:**
- Engineering team (access controlled)
- Support team (limited access)
- Security team (audit access)

**External Processors:**
- Supabase (authentication service)
- AWS (cloud infrastructure)

### 1.7 Transfers to Third Countries

- **USA:** Supabase, AWS (Standard Contractual Clauses)
- **Safeguards:** SCCs + supplementary technical measures (encryption)

### 1.8 Retention Period

- **Active accounts:** Duration of contract + 1 year
- **Deleted accounts:** 30 days (soft delete), then permanent deletion
- **Audit logs:** 7 years (legal compliance)

### 1.9 Technical and Organizational Measures

- End-to-end encryption for sensitive data (AES-256)
- Password hashing (bcrypt)
- Row-level security (RLS) policies
- Multi-factor authentication available
- Regular security audits
- Access control and role-based permissions
- Automated security monitoring

---

## 2. Soil Analysis and Agricultural Data

### 2.1 Basic Information

**Processing Activity Name:** Soil Analysis and Agricultural Recommendations

### 2.2 Purposes of Processing

- Soil composition analysis
- Crop recommendations
- Planting calendar optimization
- Field mapping and boundary management
- Carbon credit calculations

### 2.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) - Service delivery
- **Secondary:** Legitimate interests (Article 6(1)(f)) - Service improvement

### 2.4 Categories of Data Subjects

- Farmers
- Agricultural consultants
- Land managers

### 2.5 Categories of Personal Data

**Property/Location Data:**
- County FIPS codes
- Property addresses (user-provided)
- Field boundary coordinates (GPS)
- Area measurements (acres)

**Agricultural Data:**
- Soil pH levels
- Nutrient levels (NPK)
- Organic matter percentages
- Crop types and planting dates
- Harvest information
- Visual crop analysis results

**Analysis Results:**
- AI-generated recommendations
- Risk assessments
- Yield predictions
- Environmental impact scores

### 2.6 Categories of Recipients

**Internal:**
- Engineering team
- Data science team
- Support team

**External Processors:**
- OpenAI (AI analysis)
- Alpha Earth API (soil data enrichment)
- MapBox (mapping services)
- Supabase (database)

### 2.7 Transfers to Third Countries

- **USA:** OpenAI, MapBox, Supabase, AWS (SCCs)
- **Various:** Alpha Earth API (SCCs or adequacy decision)

### 2.8 Retention Period

- **Active field data:** Duration of contract + 2 years
- **Historical analysis:** 5 years for trend analysis
- **Deleted field data:** 30 days soft delete

### 2.9 Technical and Organizational Measures

- Row-level security on all data tables
- User-ID based access control
- Encrypted data at rest and in transit
- Anonymization for aggregated analytics
- Regular data quality audits

---

## 3. Payment and Subscription Management

### 3.1 Basic Information

**Processing Activity Name:** Payment Processing and Subscription Management

### 3.2 Purposes of Processing

- Payment processing
- Subscription management
- Invoice generation
- Refund processing
- Financial reporting

### 3.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) - Payment processing
- **Secondary:** Legal obligation (Article 6(1)(c)) - Tax compliance

### 3.4 Categories of Data Subjects

- Paying customers
- Subscription holders

### 3.5 Categories of Personal Data

**Payment Data (Tokenized):**
- Stripe customer ID (encrypted)
- Subscription tier
- Payment method type (not card numbers)
- Billing email
- Transaction history

**Subscription Data:**
- Subscription start/end dates
- Subscription status
- Payment frequency
- Renewal status

**Invoicing Data:**
- Business name (if provided)
- Billing address
- Tax information

### 3.6 Categories of Recipients

**External Processors:**
- Stripe (payment processor) - **Primary PCI DSS compliant processor**
- Supabase (subscription status only)

**Note:** Card details never stored by SoilSidekick - handled entirely by Stripe

### 3.7 Transfers to Third Countries

- **USA:** Stripe (adequacy decision + SCCs)

### 3.8 Retention Period

- **Active subscriptions:** Duration of subscription
- **Cancelled subscriptions:** 7 years (tax/legal requirements)
- **Transaction records:** 7 years (legal compliance)

### 3.9 Technical and Organizational Measures

- No direct storage of payment card data (PCI DSS compliance via Stripe)
- Encrypted Stripe customer IDs
- RLS policies on subscription data
- Secure API communication (HTTPS only)
- Regular security audits of payment flows

---

## 4. Usage Analytics and Service Improvement

### 4.1 Basic Information

**Processing Activity Name:** Usage Analytics and Service Optimization

### 4.2 Purposes of Processing

- Service performance monitoring
- Feature usage analysis
- User experience improvement
- Error tracking and debugging
- Capacity planning

### 4.3 Legal Basis

- **Primary:** Legitimate interests (Article 6(1)(f)) - Service improvement and security
- **Balancing Test:** Conducted - see `GDPR_LEGITIMATE_INTEREST_ASSESSMENT.md`

### 4.4 Categories of Data Subjects

- All registered users
- Anonymous visitors (cookie consent)

### 4.5 Categories of Personal Data

**Usage Data:**
- Feature interaction timestamps
- Session duration
- Page views
- Action types (clicks, submissions)
- Error events

**Technical Data:**
- IP address (hashed)
- User agent
- Device type
- Browser type
- Screen resolution

**Performance Data:**
- API response times
- Error rates
- Success rates

### 4.6 Categories of Recipients

**Internal:**
- Engineering team
- Product team

**External Processors:**
- Supabase Analytics
- Error monitoring services (if applicable)

### 4.7 Transfers to Third Countries

- **USA:** Supabase, AWS (SCCs)

### 4.8 Retention Period

- **Detailed logs:** 90 days
- **Aggregated analytics:** 2 years
- **Error logs:** 1 year

### 4.9 Technical and Organizational Measures

- IP address hashing
- Session ID pseudonymization
- Aggregation and anonymization for reporting
- Access controls on analytics dashboards
- Cookie consent management

---

## 5. Marketing and Communications

### 5.1 Basic Information

**Processing Activity Name:** Marketing Communications and Newsletters

### 5.2 Purposes of Processing

- Sending product updates
- Marketing communications
- Educational content delivery
- Feature announcements

### 5.3 Legal Basis

- **Primary:** Consent (Article 6(1)(a)) - Explicit opt-in
- **Withdrawal:** Unsubscribe link in every email

### 5.4 Categories of Data Subjects

- Newsletter subscribers
- Users who opted in to marketing

### 5.5 Categories of Personal Data

- Email address
- Name (if provided)
- Subscription preferences
- Consent timestamp
- Consent withdrawal timestamp

### 5.6 Categories of Recipients

**External Processors:**
- Email service provider (to be specified)

### 5.7 Transfers to Third Countries

- Depends on email provider selected (SCCs required)

### 5.8 Retention Period

- **Active subscribers:** Until consent withdrawn
- **Unsubscribed:** 30 days (bounce prevention), then deleted
- **Consent records:** 3 years after withdrawal (proof of compliance)

### 5.9 Technical and Organizational Measures

- Double opt-in confirmation
- Unsubscribe link in every email
- Consent timestamp recording
- Separate consent for different communication types
- Regular list cleaning

---

## 6. Customer Support and Communications

### 6.1 Basic Information

**Processing Activity Name:** Customer Support and Help Desk

### 6.2 Purposes of Processing

- Responding to user inquiries
- Technical support
- Issue resolution
- Service improvement

### 6.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) - Customer support as part of service
- **Secondary:** Legitimate interests (Article 6(1)(f)) - Service quality

### 6.4 Categories of Data Subjects

- Users requesting support
- Users reporting issues

### 6.5 Categories of Personal Data

- Name and email
- Support ticket content
- Issue descriptions
- Screenshots (user-provided)
- Correspondence history
- Account information relevant to issue

### 6.6 Categories of Recipients

**Internal:**
- Support team
- Engineering team (escalated issues)

**External Processors:**
- Support ticketing system (if applicable)

### 6.7 Transfers to Third Countries

- Depends on support platform (SCCs if required)

### 6.8 Retention Period

- **Active tickets:** Until resolution + 90 days
- **Closed tickets:** 2 years
- **Deleted accounts:** Support history deleted after 1 year

### 6.9 Technical and Organizational Measures

- Support team access controls
- Encrypted communications
- Regular training on data handling
- Secure ticket system

---

## 7. Security Monitoring and Incident Response

### 7.1 Basic Information

**Processing Activity Name:** Security Monitoring and Threat Detection

### 7.2 Purposes of Processing

- Detecting security threats
- Preventing fraud and abuse
- Incident response
- Compliance monitoring
- Audit trail maintenance

### 7.3 Legal Basis

- **Primary:** Legitimate interests (Article 6(1)(f)) - Security and fraud prevention
- **Secondary:** Legal obligation (Article 6(1)(c)) - Security incident reporting

### 7.4 Categories of Data Subjects

- All users
- Potential threat actors

### 7.5 Categories of Personal Data

**Security Event Data:**
- IP addresses (hashed)
- Failed login attempts
- Suspicious activity patterns
- Access attempts
- Security alerts

**Audit Trail Data:**
- User actions (high-level)
- Data access logs
- Configuration changes
- API access patterns

### 7.6 Categories of Recipients

**Internal:**
- Security team
- DevOps team
- DPO (incident notifications)

### 7.7 Transfers to Third Countries

- **USA:** Supabase logs, AWS CloudWatch (SCCs)

### 7.8 Retention Period

- **Security logs:** 1 year
- **Incident reports:** 7 years
- **Audit trails:** 7 years (compliance requirement)

### 7.9 Technical and Organizational Measures

- Automated threat detection
- Real-time alerting
- IP hashing for storage
- Access-controlled log systems
- Regular security audits
- Incident response procedures

---

## 8. API and SDK Client Integration

### 8.1 Basic Information

**Processing Activity Name:** API Access and SDK Client Management

### 8.2 Purposes of Processing

- Third-party integration support
- API key management
- Rate limiting and access control
- Usage monitoring

### 8.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) - API service agreement
- **Secondary:** Legitimate interests (Article 6(1)(f)) - Service security

### 8.4 Categories of Data Subjects

- API users
- SDK clients
- Third-party integrators

### 8.5 Categories of Personal Data

- API key hashes
- Organization name
- Technical contact information
- Usage statistics
- Access logs

### 8.6 Categories of Recipients

**Internal:**
- Engineering team
- DevOps team

### 8.7 Transfers to Third Countries

- **USA:** Supabase, AWS (SCCs)

### 8.8 Retention Period

- **Active API keys:** Duration of agreement
- **Revoked keys:** 90 days then deleted
- **Access logs:** 1 year

### 8.9 Technical and Organizational Measures

- API key hashing
- Rate limiting
- Access logging
- Secure key generation
- Regular security reviews

---

## 9. Document Control and Maintenance

### 9.1 Review Schedule

This ROPA must be reviewed and updated:
- Quarterly (routine review)
- When new processing activities are added
- When processing purposes change
- When new third parties are engaged
- After data protection incidents

### 9.2 Approval

**Prepared by:** _________________________  
**Reviewed by DPO:** _________________________  
**Approved by:** _________________________  
**Date:** _________________________

### 9.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-27 | System | Initial ROPA creation |
| 2.1 | 2026-02-10 | System | Added OEM Device Telemetry and 5G/MEC Edge Processing activities |

### 9.4 Related Documents

- `GDPR_COMPLIANCE_DOCUMENTATION.md`
- `GDPR_ROPA_PROCESSOR.md`
- `SECURITY_CRITICAL_CORRECTIONS.md`
- `PRIVACY_POLICY.md`

---

## 9. OEM Device Telemetry Processing

### 9.1 Basic Information

**Processing Activity Name:** OEM Embedded Device Telemetry and Fleet Management

### 9.2 Purposes of Processing

- Device registration and lifecycle management
- CAN Bus and J1939 telemetry ingestion
- Equipment performance monitoring
- Royalty metering and usage tracking
- OTA firmware update delivery
- ISOBUS task data generation

### 9.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) — OEM licensing agreement
- **Secondary:** Legitimate interests (Article 6(1)(f)) — Fleet security and safety monitoring

### 9.4 Categories of Data Subjects

- OEM partner technical contacts
- Equipment operators (indirect — via device telemetry)
- Field workers (safety monitoring data)

### 9.5 Categories of Personal Data

**Device Data (Pseudonymized):**
- Device ID (UUID)
- GPS coordinates (rounded to field-level precision per data minimization policy)
- Firmware version and update history
- mTLS certificate metadata (not private keys)

**Operational Data:**
- CAN Bus sensor readings (soil moisture, temperature, pressure)
- J1939 engine diagnostics (RPM, fuel consumption — no operator PII)
- ISOBUS task execution logs
- Equipment runtime hours

**Metering Data:**
- API call counts per device
- Royalty heartbeat timestamps
- Subscription tier and usage quotas

### 9.6 Categories of Recipients

**Internal:**
- Engineering team (fleet monitoring)
- DevOps team (OTA updates)
- Finance team (royalty reconciliation)

**External Processors:**
- Supabase (device registry, telemetry storage)
- OEM Partners (aggregated fleet reports only — no raw PII)

### 9.7 Transfers to Third Countries

- **USA:** Supabase, AWS (SCCs)
- **OEM Partner jurisdictions:** Per individual DPA with each OEM partner

### 9.8 Retention Period

- **Active devices:** Duration of OEM agreement
- **Decommissioned devices:** 90 days then permanent deletion
- **Telemetry data:** 12 months rolling window
- **Royalty records:** 7 years (financial/legal compliance)

### 9.9 Technical and Organizational Measures

- Mutual TLS (mTLS) for all device communications
- GPS coordinate rounding (data minimization)
- CAN Bus HMAC message authentication
- J1939 PGN whitelisting (only permitted parameter groups)
- ISOBUS ISO-XML digital signatures
- Short-lived device registration tokens (24hr TTL)
- Certificate revocation list (CRL) enforcement
- Tamper-evident royalty heartbeats

---

## 10. Private 5G / MEC Edge Processing

### 10.1 Basic Information

**Processing Activity Name:** Private 5G Multi-Access Edge Computing (MEC) for Safety-Critical Operations

### 10.2 Purposes of Processing

- Real-time autonomous equipment coordination
- Worker vital signs monitoring
- Canopy reflectivity and environmental analysis
- Safety-critical alert generation
- Geofence compliance enforcement

### 10.3 Legal Basis

- **Primary:** Contract (Article 6(1)(b)) — Service delivery under 5G partnership agreement
- **Secondary:** Vital interests (Article 6(1)(d)) — Worker safety monitoring
- **Tertiary:** Legitimate interests (Article 6(1)(f)) — Equipment safety and operational security

### 10.4 Categories of Data Subjects

- Field workers (vital signs data)
- Equipment operators
- Farm/site managers

### 10.5 Categories of Personal Data

**Safety Data (Real-time, ephemeral):**
- Worker vital signs (heart rate, temperature — 5-second TTL)
- Worker proximity to autonomous equipment
- Personal protective equipment compliance status

**Coordination Data (Ephemeral):**
- Equipment GPS positions (5-second TTL)
- Path planning coordinates
- Speed and heading vectors
- Emergency stop signals

**Operational Data (Retained):**
- Safety incident logs
- Geofence violation records
- Equipment coordination audit trail
- Edge node attestation records

### 10.6 Categories of Recipients

**Internal:**
- Safety Officer (real-time alerts)
- Engineering team (system monitoring)
- Incident response team

**External Processors:**
- Telecom partner (network infrastructure only — no application data)
- Edge computing provider (MEC node hosting)

### 10.7 Transfers to Third Countries

- **Edge processing is local by design** — MEC nodes process data at the edge, minimizing cross-border transfers
- Aggregated operational metrics may sync to central Supabase (USA — SCCs)

### 10.8 Retention Period

- **Real-time coordination data:** 5-second TTL (ephemeral, never persisted)
- **Vital signs data:** 5-second TTL (ephemeral, never persisted)
- **Safety incident logs:** 7 years (regulatory compliance)
- **Geofence violation records:** 2 years
- **Edge attestation records:** 1 year

### 10.9 Technical and Organizational Measures

- URLLC network slice isolation (dedicated safety channel)
- 5-second TTL enforcement for all coordination/vital signs data
- Edge node hardware attestation (24-hour cycle)
- Anti-replay protection (monotonic sequence numbers)
- Automatic failover to local inference on network degradation
- Emergency stop protocol with <100ms execution
- Dual sign-off requirement (Engineering + Safety Officer) for all safety-critical changes
- Worker consent for vital signs monitoring
- Data minimization — vital signs processed at edge, only anomaly alerts transmitted

---

**END OF DOCUMENT**
