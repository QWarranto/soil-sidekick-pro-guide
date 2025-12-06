# LeafEngines Enterprise Client Questionnaire

## Purpose

This questionnaire determines the optimal enterprise service configuration for prospective clients, identifies potential risk events requiring pre-engagement mitigation, and establishes realistic implementation timelines.

---

## Section A: Organization Profile

### A1. Company Information

| Question | Response |
|----------|----------|
| Company legal name | |
| Primary industry vertical | ☐ Urban Forestry / Municipal ☐ Crop Insurance ☐ Precision Agriculture ☐ Herbal Medicine/Nutraceuticals ☐ Other: _______ |
| Annual revenue range | ☐ $10M-$50M ☐ $50M-$200M ☐ $200M-$500M ☐ $500M+ |
| Number of employees | ☐ 50-200 ☐ 200-500 ☐ 500-2,000 ☐ 2,000+ |
| Geographic operating regions | ☐ US Only ☐ US + Canada ☐ North America + EU ☐ Global |
| Current botanical/plant ID solution | ☐ None ☐ In-house ☐ Competitor: _______ |

### A2. Technical Environment

| Question | Response |
|----------|----------|
| Primary cloud provider | ☐ AWS ☐ Azure ☐ GCP ☐ On-premises ☐ Hybrid |
| GIS platforms in use | ☐ Esri ArcGIS ☐ TreePlotter ☐ QGIS ☐ Custom ☐ None |
| API integration experience | ☐ Extensive (50+ integrations) ☐ Moderate (10-50) ☐ Limited (<10) |
| DevOps maturity | ☐ CI/CD established ☐ Manual deployments ☐ No formal process |
| Data residency requirements | ☐ US only ☐ EU (GDPR) ☐ Specific country: _______ |

---

## Section B: Service Configuration Assessment

### B1. Deployment Model Preference

**Question:** How critical is data isolation and infrastructure control to your organization?

| Option | Indicators | Recommended Service |
|--------|-----------|---------------------|
| ☐ **Maximum control required** | Regulated industry, government contracts, data sovereignty laws | **Private Cloud / On-Premises** |
| ☐ **Moderate control preferred** | Internal security policies, audit requirements | **Dedicated VPC** |
| ☐ **Standard SaaS acceptable** | No regulatory constraints, speed-to-market priority | **Shared Cloud (Pro Plan)** |

### B2. Model Customization Requirements

**Question:** Does your use case require species/cultivar identification beyond standard botanical classification?

| Option | Indicators | Recommended Service |
|--------|-----------|---------------------|
| ☐ **Highly specialized identification** | Proprietary cultivars, regional variants, disease-specific detection | **Custom Model Fine-Tuning** |
| ☐ **Industry-specific accuracy** | Crop insurance loss assessment, timber valuation, invasive species | **Domain-Specific Training** |
| ☐ **General botanical ID sufficient** | Standard plant identification, garden apps, educational | **Standard Models (Pro Plan)** |

### B3. Compliance & Certification Needs

**Question:** Which regulatory frameworks apply to your botanical data operations?

| Framework | Applies? | Implications |
|-----------|----------|--------------|
| ☐ SOC 2 Type II | | Annual audit, access controls, incident response |
| ☐ ISO 27001 | | ISMS certification, risk management framework |
| ☐ GDPR (EU data) | | Data processing agreements, right to erasure |
| ☐ HIPAA (health data) | | BAA required, PHI handling procedures |
| ☐ FDA 21 CFR Part 11 | | Electronic records, audit trails, validation |
| ☐ USDA/APHIS | | Plant health certification, import/export compliance |
| ☐ FedRAMP | | Federal authorization, continuous monitoring |
| ☐ State-specific (CA CCPA, etc.) | | Consumer privacy, disclosure requirements |

**If 3+ frameworks selected → Recommend: Compliance & Certification Package**

### B4. Integration Architecture

**Question:** How will LeafEngines integrate with your existing systems?

| Option | Indicators | Recommended Service |
|--------|-----------|---------------------|
| ☐ **Real-time event-driven** | Immediate alerts, automated workflows, IoT sensor networks | **Real-Time Streaming & Webhooks** |
| ☐ **Batch processing** | Nightly syncs, bulk analysis, historical data processing | **Standard API (Pro Plan)** |
| ☐ **Bi-directional GIS sync** | Asset management systems, field inventory updates | **GIS Interoperability Package** |

---

## Section C: Risk Assessment & Pre-Engagement Requirements

### C1. Legal & Contractual Risks

| Risk Category | Assessment Questions | Mitigation Required |
|---------------|---------------------|---------------------|
| **Data Ownership** | Who owns botanical identification results? Can results be used for model improvement? | ☐ Data processing agreement ☐ IP assignment clause |
| **Liability Allocation** | What happens if misidentification causes financial loss? (e.g., crop insurance claim denial) | ☐ Limitation of liability ☐ Professional liability insurance ☐ Indemnification clause |
| **Subprocessor Authorization** | Are third-party services (AWS, OpenAI, etc.) pre-approved? | ☐ Subprocessor list review ☐ DPA amendments |
| **Termination & Data Return** | What data portability is required upon contract end? | ☐ Data export SLA ☐ Destruction certification |
| **Audit Rights** | Does client require on-site audit capability? | ☐ Audit clause ☐ Annual assessment schedule |

### C2. Compliance Risks

| Risk Category | Pre-Engagement Requirements | Timeline Impact |
|---------------|----------------------------|-----------------|
| **SOC 2 Gap** | Current SOC 2 Type I; Type II in progress | +60-90 days if Type II required before go-live |
| **Data Residency** | EU data requires Frankfurt region deployment | +30 days for regional infrastructure |
| **HIPAA BAA** | Requires legal review and execution | +14-21 days |
| **FedRAMP** | Not currently authorized; requires sponsoring agency | +12-18 months (blocking for federal clients) |
| **Export Controls** | Certain regions may have OFAC/EAR restrictions | Legal review required pre-contract |

### C3. Technical Risks

| Risk Category | Assessment | Mitigation |
|---------------|------------|------------|
| **Integration Complexity** | Legacy systems, non-standard APIs, data format incompatibility | ☐ Technical discovery sprint (+2-4 weeks) |
| **Volume Uncertainty** | Unknown API call volumes, seasonal spikes | ☐ Usage monitoring period ☐ Elastic pricing |
| **Model Accuracy Requirements** | >99% accuracy expectations for regulated use cases | ☐ Validation study ☐ Accuracy SLA with exceptions |
| **Uptime Requirements** | Mission-critical (99.99%) vs. standard (99.9%) | ☐ HA architecture ☐ Multi-region deployment |

### C4. Financial Risks

| Risk Category | Warning Signs | Pre-Contract Requirements |
|---------------|--------------|---------------------------|
| **Payment Risk** | Startup, cash flow concerns, international entity | ☐ Credit check ☐ Prepayment ☐ LOC |
| **Scope Creep** | Undefined requirements, "we'll figure it out" | ☐ Fixed scope SOW ☐ Change order process |
| **Hidden Costs** | Underestimated data volumes, integration effort | ☐ Discovery phase ☐ Cost ceiling clause |

---

## Section D: Implementation Timelines by Service

### D1. Private Cloud / On-Premises Deployment

| Phase | Duration | Activities | Dependencies |
|-------|----------|-----------|--------------|
| **Discovery & Planning** | 2-4 weeks | Infrastructure assessment, security review, architecture design | Client IT team availability |
| **Legal & Procurement** | 3-6 weeks | Contract negotiation, security questionnaire, vendor onboarding | Legal/procurement bandwidth |
| **Infrastructure Provisioning** | 4-8 weeks | Hardware procurement (on-prem) or VPC setup, network configuration | Hardware lead times, cloud account setup |
| **Deployment & Configuration** | 2-4 weeks | Application deployment, SSO integration, firewall rules | Infrastructure completion |
| **Testing & Validation** | 2-3 weeks | UAT, performance testing, security scanning | Test environment access |
| **Training & Go-Live** | 1-2 weeks | Admin training, documentation, production cutover | User availability |
| **Total Timeline** | **14-27 weeks** | | |

**Accelerated Option:** Pre-built Kubernetes package on client's existing K8s cluster: **8-12 weeks**

---

### D2. Custom Model Fine-Tuning

| Phase | Duration | Activities | Dependencies |
|-------|----------|-----------|--------------|
| **Data Requirements Gathering** | 1-2 weeks | Species list, accuracy targets, edge case definition | Domain expert availability |
| **Training Data Preparation** | 4-8 weeks | Image collection, annotation, quality validation | Client data provision, annotation resources |
| **Model Training & Iteration** | 6-10 weeks | Initial training, evaluation, refinement cycles | GPU compute availability |
| **Validation Study** | 2-4 weeks | Blind testing, accuracy measurement, bias analysis | Independent test dataset |
| **Integration & Deployment** | 2-3 weeks | Model deployment, A/B testing, monitoring setup | Standard API integration |
| **Total Timeline** | **15-27 weeks** | | |

**Accelerated Option:** Use existing domain-specific base model (agriculture, forestry): **8-14 weeks**

---

### D3. Compliance & Certification Package

| Phase | Duration | Activities | Dependencies |
|-------|----------|-----------|--------------|
| **Gap Analysis** | 2-3 weeks | Current state assessment, framework mapping | Access to existing policies |
| **Remediation Planning** | 1-2 weeks | Control implementation roadmap, resource allocation | Executive approval |
| **Control Implementation** | 8-16 weeks | Policy updates, technical controls, process changes | Varies by gap severity |
| **Evidence Collection** | 4-6 weeks | Control testing, documentation, audit preparation | Control maturity |
| **Third-Party Audit** | 4-8 weeks | Auditor engagement, fieldwork, report issuance | Auditor availability |
| **Total Timeline** | **19-35 weeks** | | |

**Note:** SOC 2 Type II requires 6-12 month observation period after controls are implemented.

---

### D4. Real-Time Event Streaming & Webhooks

| Phase | Duration | Activities | Dependencies |
|-------|----------|-----------|--------------|
| **Requirements & Design** | 1-2 weeks | Event catalog, payload design, retry policies | Integration architect availability |
| **Infrastructure Setup** | 1-2 weeks | Message queue provisioning, endpoint registration | Client webhook endpoints |
| **Development & Testing** | 2-4 weeks | Event handlers, transformation logic, error handling | Development resources |
| **Security Configuration** | 1 week | HMAC signing, IP allowlisting, TLS configuration | Security team approval |
| **Load Testing & Optimization** | 1-2 weeks | Throughput testing, latency optimization | Production-like environment |
| **Go-Live & Monitoring** | 1 week | Production deployment, alerting, runbook creation | Operations team |
| **Total Timeline** | **7-12 weeks** | | |

**Accelerated Option:** Standard webhook templates with minimal customization: **3-5 weeks**

---

## Section E: Third-Party Services Analysis

### E1. Services INCLUDED in Enterprise Pricing

| Service | Purpose | Provider Options | Included In |
|---------|---------|------------------|-------------|
| **Cloud Infrastructure** | Compute, storage, networking | AWS / Azure / GCP | Private Cloud, Dedicated VPC |
| **Container Orchestration** | Application deployment | Kubernetes (EKS/AKS/GKE) | Private Cloud |
| **API Gateway** | Rate limiting, authentication | Kong / AWS API Gateway | All Enterprise tiers |
| **Monitoring & Observability** | Performance, error tracking | Datadog / New Relic | All Enterprise tiers |
| **Log Management** | Audit trails, debugging | Elasticsearch / Splunk | Compliance Package |
| **Secrets Management** | API keys, credentials | HashiCorp Vault / AWS Secrets | All Enterprise tiers |
| **CDN** | Global edge delivery | Cloudflare / AWS CloudFront | All Enterprise tiers |
| **Message Queue** | Event streaming | Apache Kafka / AWS SQS | Streaming Package |

### E2. Services EXCLUDED (Client-Procured or Add-On Priced)

| Service | Purpose | Estimated Cost | When Required |
|---------|---------|----------------|---------------|
| **SOC 2 Auditor** | Third-party certification | $30,000-$80,000/year | Compliance Package (audit only) |
| **ISO 27001 Certification Body** | ISMS certification | $15,000-$40,000 | Compliance Package (certification only) |
| **Penetration Testing** | Security validation | $15,000-$50,000/engagement | Compliance Package, On-Prem |
| **Legal Review (Client-Side)** | Contract negotiation | Client's legal rates | All Enterprise |
| **Data Annotation Services** | Training data labeling | $0.05-$0.50/image | Custom Model Fine-Tuning |
| **Domain Expert Consultation** | Species validation | $200-$500/hour | Custom Model Fine-Tuning |
| **Hardware (On-Premises)** | GPU servers, storage | $50,000-$500,000 | On-Premises only |
| **Network Equipment** | Firewalls, load balancers | $10,000-$100,000 | On-Premises only |
| **SSO/IdP Integration** | Okta, Azure AD, etc. | Client's existing license | All Enterprise |
| **GIS Platform Licenses** | Esri, TreePlotter | Client's existing license | GIS Interoperability |
| **Cyber Insurance** | Liability coverage | Varies by coverage | Recommended for all |

### E3. Optional Add-On Services

| Service | Description | Pricing Model |
|---------|-------------|---------------|
| **24/7 Premium Support** | Phone support, 15-min response SLA | +$2,500-$10,000/month |
| **Dedicated Success Manager** | Named contact, QBRs, roadmap input | +$5,000-$15,000/month |
| **Custom SLA** | 99.99% uptime, financial credits | +15-30% of base contract |
| **Multi-Region Deployment** | Geographic redundancy | +$25,000-$100,000 setup + ongoing |
| **Air-Gapped Deployment** | Fully disconnected operation | +$50,000-$200,000 setup |
| **Source Code Escrow** | Business continuity protection | +$5,000-$15,000/year |
| **Custom Reporting Dashboard** | Branded analytics portal | +$15,000-$50,000 one-time |

---

## Section F: Scoring & Recommendation Matrix

### F1. Service Recommendation Scoring

Based on questionnaire responses, calculate the recommended service tier:

| Factor | Weight | Private Cloud | Custom Model | Compliance Pkg | Streaming |
|--------|--------|---------------|--------------|----------------|-----------|
| Data residency requirements | 20% | +3 if required | 0 | +1 if EU | 0 |
| Regulatory frameworks (count) | 20% | +1 per framework | 0 | +2 per framework | 0 |
| Species specialization need | 15% | 0 | +3 if specialized | 0 | 0 |
| Real-time integration need | 15% | 0 | 0 | 0 | +3 if event-driven |
| Infrastructure control need | 15% | +3 if maximum | 0 | 0 | 0 |
| API volume (calls/month) | 15% | +1 if >10M | 0 | 0 | +2 if >1M events |

**Scoring Interpretation:**
- Score 0-2: Pro Plan likely sufficient
- Score 3-5: Single Enterprise add-on recommended
- Score 6-8: Multiple Enterprise services needed
- Score 9+: Full Enterprise Suite recommended

### F2. Budget Alignment Check

| Annual Budget Range | Recommended Configuration |
|---------------------|--------------------------|
| $50,000-$100,000 | Pro Plan + 1 Enterprise add-on |
| $100,000-$250,000 | Pro Plan + 2-3 Enterprise add-ons |
| $250,000-$500,000 | Full Enterprise Suite (2-3 services) |
| $500,000+ | Full Enterprise Suite + Premium Support + Multi-Region |

---

## Section G: Next Steps Checklist

### G1. Pre-Contract Requirements

- [ ] Complete this questionnaire with client stakeholders
- [ ] Conduct technical discovery call (if complexity score > 5)
- [ ] Perform legal/compliance pre-screen for identified risks
- [ ] Obtain budget confirmation and procurement timeline
- [ ] Identify executive sponsor and project lead
- [ ] Review subprocessor list and obtain pre-approval
- [ ] Confirm data residency requirements and deployment region

### G2. Documents to Prepare

- [ ] Master Services Agreement (MSA)
- [ ] Data Processing Agreement (DPA) - if applicable
- [ ] Statement of Work (SOW) with timeline
- [ ] Service Level Agreement (SLA)
- [ ] Business Associate Agreement (BAA) - if HIPAA
- [ ] Security questionnaire responses
- [ ] Insurance certificates (E&O, Cyber, General Liability)

### G3. Internal Approvals Required

| Approval | Required For | Approver |
|----------|--------------|----------|
| Pricing deviation | Discounts >15% | Sales VP |
| Custom SLA | Non-standard terms | Engineering VP |
| On-premises deployment | Any on-prem | CTO |
| Source code escrow | Any escrow request | Legal + CTO |
| HIPAA BAA | Healthcare clients | Legal + Compliance |
| Payment terms >Net 30 | Extended terms | Finance |

---

## Appendix: Vertical-Specific Considerations

### Urban Forestry / Municipal

- **Common Requirements:** GIS integration (Esri/TreePlotter), ISA TRAQ compliance, i-Tree compatibility
- **Typical Timeline:** 12-20 weeks (GIS integration complexity)
- **Key Risks:** Procurement delays, IT security reviews, council approval cycles
- **Third-Party Services:** GIS platform licenses, arborist consultation

### Crop Insurance

- **Common Requirements:** Damage quantification API, audit trails, claims integration
- **Typical Timeline:** 16-24 weeks (compliance + integration)
- **Key Risks:** Accuracy liability, regulatory approval, legacy system integration
- **Third-Party Services:** Actuarial validation, legal review for liability caps

### Precision Agriculture

- **Common Requirements:** IoT integration, real-time streaming, offline capability
- **Typical Timeline:** 10-16 weeks (standard integration)
- **Key Risks:** Seasonal deployment windows, connectivity constraints
- **Third-Party Services:** IoT platform (AWS IoT, Azure IoT Hub)

### Herbal Medicine / Nutraceuticals

- **Common Requirements:** FDA 21 CFR Part 11, GMP compliance, authenticity verification
- **Typical Timeline:** 20-30 weeks (regulatory compliance intensive)
- **Key Risks:** Validation requirements, audit readiness, toxicological liability
- **Third-Party Services:** GxP consulting, validation specialists, regulatory counsel

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Contact: enterprise@soilsidekickpro.com*
