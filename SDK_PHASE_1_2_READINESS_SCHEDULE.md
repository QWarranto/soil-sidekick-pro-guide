# LeafEngines™ SDK Phase 1-2 Readiness Schedule

**Objective:** Increase SDK readiness from 78% → 99% (Phase 1) and 72% → 99% (Phase 2)  
**Timeline:** 12 weeks total  
**Start Date:** Q1 Week 1

---

## Executive Summary

| Phase | Current | Target | Gap | Timeline |
|-------|---------|--------|-----|----------|
| **Phase 1** | 78% | 99% | 21% | Weeks 1-4 |
| **Phase 2** | 72% | 99% | 27% | Weeks 1-12 (parallel) |

---

## Phase 1: Quick Wins Readiness (78% → 99%)

### Target Clients: Plantum, Plant Parent, Flora Incognita

| Week | Action | Owner | Deliverable | Success Criteria | % Gain |
|------|--------|-------|-------------|------------------|--------|
| **1** | Add `X-Response-Time` header to all edge functions | Engineering | Code PR | Header visible in all API responses | +3% |
| **1** | Document response time targets in OpenAPI spec | Engineering | `openapi-spec.yaml` update | SLA section in spec | +2% |
| **1** | Create Flora Incognita GDPR pitch deck | Sales/Legal | PDF/slides | Privacy-first messaging, WebGPU architecture highlighted | +3% |
| **1** | ✅ Patent protection confirmed | Legal | Documentation | Sustainability Scoring (Claims 8, 18, 19) covers Environmental Compatibility Score | +5% |
| **2** | Create API sandbox environment | Engineering | `sandbox.leafengines.dev` | Working demo endpoint with test data | +4% |
| **2** | Build Impact Simulator export for sales demos | Engineering | PDF/JSON export | Licensee-specific ROI projections exportable | +2% |
| **3** | Document integration case study (internal demo) | Product | Markdown + video | <4 hour integration proof | +2% |
| **4** | Complete Phase 1 client-specific API configurations | Engineering | Config files | Plantum, Plant Parent, Flora Incognita ready | +1% |

**Phase 1 Total: 78% + 21% = 99%**

---

## Phase 1: Detailed Task Breakdown

### Week 1: Technical Foundation

#### Task 1.1: Response Time Header Implementation
**File:** `supabase/functions/_shared/request-handler.ts`

```typescript
// Add to all edge function responses
headers: {
  ...corsHeaders,
  'X-Response-Time': `${Date.now() - startTime}ms`,
  'X-Cache-Status': cacheHit ? 'HIT' : 'MISS'
}
```

**Affected Functions:**
- [ ] `agricultural-intelligence/index.ts`
- [ ] `leafengines-query/index.ts`
- [ ] `get-soil-data/index.ts`
- [ ] `county-lookup/index.ts`
- [ ] `visual-crop-analysis/index.ts`
- [ ] `safe-identification/index.ts`
- [ ] `dynamic-care/index.ts`
- [ ] `beginner-guidance/index.ts`
- [ ] `seasonal-planning-assistant/index.ts`

#### Task 1.2: OpenAPI SLA Documentation
**File:** `openapi-spec.yaml`

Add to info section:
```yaml
x-sla:
  latency:
    p50: "50ms"
    p95: "100ms"
    p99: "500ms"
  availability:
    target: "99.9%"
    measurement_period: "monthly"
  rate_limits:
    starter: "10 req/min"
    professional: "100 req/min"
    enterprise: "500 req/min"
```

#### Task 1.3: Flora Incognita Pitch Deck
**Content Outline:**
1. Privacy Crisis in Plant ID (competitor cloud dependencies)
2. LeafEngines Privacy-First Architecture (WebGPU, on-device AI)
3. GDPR Compliance Documentation (ROPA, DPIA ready)
4. Zero PII Transmission for Core Features
5. Integration Timeline (<4 hours)
6. ROI Projection (Impact Simulator demo)

**Deliverable:** `docs/sales/Flora_Incognita_Privacy_Pitch.pdf`

---

### Week 2: Demo Infrastructure

#### Task 2.1: ✅ Patent Protection (COMPLETE)
**Status:** Already covered by SoilSidekick Pro patent application (filed August/September 2024)

**Existing Coverage:**
- **Claim 8:** Method for "performing environmental impact assessment" including "generating sustainability scores and eco-alternative recommendations"
- **Claim 18:** Instructions to "calculate carbon footprint and sustainability metrics"
- **Claim 19:** Adaptive caching for assessment results
- **Claim 1:** Environmental Impact Assessment Engine (runoff risk, water body proximity, carbon footprint)

**Terminology Mapping:**
| B2B Marketing Term | Patent Term | Coverage |
|--------------------|-------------|----------|
| Environmental Compatibility Score | Sustainability Score | ✅ Claims 8, 18, 19 |
| Environmental Intelligence Layer | Environmental Impact & Recommendation Engine | ✅ Claim 1 |

**Note:** "Environmental Compatibility Score" is a B2B branding term for the patented "Sustainability Scoring" methodology. No additional patent filing required.

#### Task 2.2: API Sandbox Environment
**Deliverable:** `sandbox.leafengines.dev`

**Features:**
- Pre-populated test data (sample counties, plants)
- No authentication required for demo
- Rate limited (10 req/min)
- Response time visualization
- Code snippets for all languages

**Implementation:**
```typescript
// New edge function: supabase/functions/sandbox-demo/index.ts
// Serves demo data without auth
// Logs sandbox usage for sales analytics
```

---

### Week 3: Sales Enablement

#### Task 3.1: Impact Simulator Export
**Current State:** Web-only visualization
**Enhancement:** Add PDF/JSON export for sales decks

**Export Contents:**
- Client name and metrics
- Projected churn reduction (%)
- Projected revenue retention ($)
- Integration cost savings vs build
- ROI timeline visualization

**File:** `src/components/impact-simulator/ImpactSimulatorExport.tsx`

#### Task 3.2: Integration Case Study
**Format:** Markdown document + 5-minute video

**Content:**
1. Starting point (new project)
2. SDK installation (npm)
3. First API call (species ID)
4. Environmental Compatibility integration
5. Dynamic Care implementation
6. Total time: <4 hours

**Deliverable:** `docs/case-studies/SDK_Integration_Under_4_Hours.md`

---

### Week 4: Client-Specific Readiness

#### Task 4.1: Plantum Configuration
- Starter tier API key template
- Rate limit: 10 req/min
- Features: Species ID, Environmental Compatibility
- Upsell trigger: Usage approaching limit

#### Task 4.2: Plant Parent Configuration
- Satellite Monitoring Pro tier template
- Rate limit: 100 req/min
- Features: Full suite including satellite integration
- "Death-Prevention Notification System" documentation

#### Task 4.3: Flora Incognita Configuration
- Privacy-first configuration (offline-capable endpoints)
- GDPR DPA template prepared
- EU data handling documentation
- WebGPU integration guide

---

## Phase 2: Strategic Scaling Readiness (72% → 99%)

### Client Phasing Strategy: Revenue Before Compliance

**Principle:** Onboard low-compliance clients first to generate revenue that offsets costs for compliance-heavy enterprise clients.

| Tier | Clients | Compliance Burden | Timeline | Revenue Model |
|------|---------|-------------------|----------|---------------|
| **Tier A (Weeks 1-4)** | Plantum, Plant Parent | Low (US-only, no SOC 2 requirement) | Immediate | ARR funds Tier B prep |
| **Tier B (Weeks 5-8)** | LeafSnap, iNaturalist | Medium (research focus, flexible DPAs) | Post-revenue | GRC tooling operational |
| **Tier C (Weeks 9-16)** | Flora Incognita, PlantNet | High (EU GDPR, institutional compliance) | Post-SOC 2 prep | Full compliance stack ready |
| **Tier D (Weeks 17-24)** | PictureThis, PlantSnap | Very High (SOC 2 required, enterprise procurement) | Post-audit | Audit report in hand |

### Revenue-to-Compliance Flow

```
WEEKS 1-4: Tier A Revenue ($X ARR)
    ↓ funds
WEEKS 3-6: GRC Tooling + Fractional DPO setup ($11K-16K)
    ↓ automates
WEEKS 5-8: Tier B Onboarding (streamlined DPAs)
    ↓ revenue compounds
WEEKS 9-12: SOC 2 Evidence Collection (automated via GRC)
    ↓ 
WEEKS 12-16: Tier C Onboarding (GDPR-ready)
    ↓
WEEKS 16-20: SOC 2 Audit Completion ($10K-25K)
    ↓
WEEKS 20-24: Tier D Enterprise Deals (audit report closes deals)
```

### Phase 2 Task Schedule (Resequenced)

| Week | Action | Owner | Deliverable | Success Criteria | % Gain |
|------|--------|-------|-------------|------------------|--------|
| **1-2** | Deploy GRC platform (Vanta/Drata) | Ops | Platform live | Automated evidence collection running | +3% |
| **1-2** | Contract fractional DPO service | Legal | Service agreement | DPO available <24hr response | +2% |
| **2-3** | Configure GitProtect.io backups | Engineering | Backup verification | Daily GitHub backups verified | +1% |
| **3-4** | Execute DPA with Supabase | Legal (GRC-assisted) | Signed DPA | Template from GRC platform | +3% |
| **3-4** | Execute DPA with Stripe | Legal (GRC-assisted) | Signed DPA | Dashboard-enabled DPA | +2% |
| **5-6** | Build `/api/v2/usage` endpoint | Engineering | Edge function | Licensees can query usage | +4% |
| **5-6** | Execute DPA with OpenAI | Legal (GRC-assisted) | Signed DPA | API terms addendum | +3% |
| **5-6** | Execute DPA with MapBox | Legal (GRC-assisted) | Signed DPA | Email request fulfilled | +2% |
| **6-8** | Create white-label UI component library | Engineering | npm package | React components published | +3% |
| **8-12** | SOC 2 Type II evidence collection | Ops (GRC-automated) | Evidence package | Controls auto-documented | +2% |
| **12-16** | SOC 2 Type II audit completion | External | Audit report | Unqualified opinion | +2% |

**Phase 2 Total: 72% + 27% = 99%**

---

## Phase 2: Detailed Task Breakdown

### Weeks 1-2: Compliance Initiation

#### Task 2.1: SOC 2 Type II Auditor Selection

**Evaluation Criteria:**
- SaaS/API experience
- Timeline (target: 12 weeks)
- Cost ($15,000-40,000 typical)
- Remote audit capability

**Recommended Firms:**
1. Prescient Assurance (startup-friendly)
2. A-LIGN (fast turnaround)
3. Johanson Group (cost-effective)

**Existing Framework Leverage:**
- `soc2-compliance-monitor` edge function ✅
- `soc2_compliance_checks` table ✅
- `comprehensive_audit_log` table ✅
- `security_audit_log` table ✅

**Gap Analysis for Audit:**
- [ ] Formal security policies (draft from existing docs)
- [ ] Vendor management policy (DPAs)
- [ ] Incident response plan (exists: `GDPR_DATA_BREACH_PROCEDURE.md`)
- [ ] Change management documentation
- [ ] Access control matrix

### Weeks 3-6: Vendor DPA Execution

#### Task 2.2: Supabase DPA
**Status:** Standard DPA available at supabase.com/legal
**Action:** Download, review, countersign
**Data Categories:** User auth, database storage, edge function logs

#### Task 2.3: Stripe DPA
**Status:** GDPR DPA available in Stripe Dashboard
**Action:** Enable in dashboard settings
**Data Categories:** Payment processing, subscription management

#### Task 2.4: OpenAI DPA
**Status:** Enterprise agreement includes DPA
**Action:** Request via enterprise sales or API terms addendum
**Data Categories:** AI model inference (note: PII minimization already in place)

#### Task 2.5: MapBox DPA
**Status:** Available upon request
**Action:** Email legal@mapbox.com
**Data Categories:** Geolocation data, map rendering

### Weeks 1-2: GRC & DPO Infrastructure (Cost-Optimized)

#### Task 2.6: GRC Platform Deployment

**Recommended Platforms (Startup-Tier Pricing):**
| Platform | Annual Cost | Key Features |
|----------|-------------|--------------|
| **Vanta** | $8K-12K | SOC 2 automation, DPA templates, continuous monitoring |
| **Drata** | $10K-15K | SOC 2 + ISO 27001, vendor management, trust center |
| **Sprinto** | $6K-10K | Budget option, SOC 2 focus, good for <50 employees |

**Selected:** Vanta (best startup experience, fast auditor matching)

**Automation Benefits:**
- Evidence collection: 70% automated vs manual
- Auditor time reduced: 40% fewer billable hours
- DPA templates: Pre-negotiated vendor agreements
- Continuous compliance: Real-time control monitoring

#### Task 2.7: Fractional DPO Service

**DPO-as-a-Service Providers:**
| Provider | Monthly Cost | Response SLA | GDPR Expertise |
|----------|--------------|--------------|----------------|
| **PrivacyTeam.io** | $150-300 | 24 hours | EU-certified DPOs |
| **Privasee** | $200-400 | 12 hours | UK/EU focus |
| **DPEX Network** | $300-500 | Same-day | Enterprise-grade |

**Selected:** PrivacyTeam.io ($150-300/month = $1,800-3,600/year)

**Service Scope (5 hrs/month):**
- GDPR compliance oversight
- SAR handling supervision (template-based)
- DPIA review and approval
- Supervisory authority liaison (as needed)
- Quarterly compliance review calls

#### Task 2.8: GitProtect.io Backup Configuration

**Purpose:** SOC 2 Control CC7.4 (Data Backup)

**Configuration:**
- Daily incremental backups of all repositories
- Weekly full backups retained 90 days
- Encrypted storage (AES-256)
- Restoration testing: Monthly automated verification

**Cost:** $50-150/month ($600-1,800/year)

### Weeks 5-8: Usage Transparency API

#### Task 2.7: `/api/v2/usage` Endpoint

**File:** `supabase/functions/api-usage-dashboard/index.ts`

**Response Schema:**
```typescript
interface UsageResponse {
  licensee_id: string;
  period: {
    start: string;
    end: string;
  };
  usage: {
    total_requests: number;
    by_endpoint: Record<string, number>;
    by_day: Array<{ date: string; count: number }>;
  };
  billing: {
    tier: string;
    included_requests: number;
    overage_requests: number;
    overage_cost: number;
  };
  rate_limits: {
    current_minute: number;
    limit_minute: number;
    remaining: number;
  };
}
```

**Database Query:**
```sql
SELECT 
  feature_name,
  COUNT(*) as request_count,
  SUM(cost_usd) as total_cost,
  date_bucket
FROM cost_tracking
WHERE user_id = $1
  AND date_bucket >= $2
  AND date_bucket <= $3
GROUP BY feature_name, date_bucket
ORDER BY date_bucket;
```

### Weeks 6-8: White-Label UI Components

#### Task 2.8: Component Library

**Package:** `@leafengines/react-components`

**Components:**
1. `<EnvironmentalScore />` - Compatibility score display
2. `<PlantCareCard />` - Dynamic care recommendations
3. `<SeasonalCalendar />` - Planting calendar widget
4. `<SatelliteHealth />` - Real-time monitoring badge

**Features:**
- Theme customization (CSS variables)
- Responsive design
- Accessibility (WCAG 2.1 AA)
- TypeScript definitions
- Storybook documentation

**Deliverable:** Published npm package + Storybook site

### Weeks 8-12: SOC 2 Audit Completion

#### Task 2.9: Evidence Collection

**Control Categories:**
1. **CC1 - Control Environment**
   - Security policies
   - Organizational structure
   - Code of conduct

2. **CC2 - Communication**
   - Security awareness training records
   - Incident communication procedures

3. **CC3 - Risk Assessment**
   - Annual risk assessment
   - Vendor risk assessments

4. **CC4 - Monitoring**
   - `soc2-compliance-monitor` logs
   - Security incident records

5. **CC5 - Control Activities**
   - Access control evidence
   - Change management records
   - Encryption configurations

6. **CC6 - Logical Access**
   - User access reviews
   - Authentication logs
   - API key management

7. **CC7 - System Operations**
   - Monitoring dashboards
   - Incident response records
   - Backup verification

8. **CC8 - Change Management**
   - GitHub PR history
   - Deployment logs
   - Testing evidence

9. **CC9 - Risk Mitigation**
   - Vendor agreements (DPAs)
   - Insurance certificates

---

## Combined Timeline View (Extended to 24 Weeks)

```
Week:  1    2    3    4    5    6    7    8    9    10   11   12   ...  16   ...  20   ...  24
       |----|----|----|----|----|----|----|----|----|----|----|----|    |----|    |----|    |----|

PHASE 1 (78% → 99%):
[==Response Headers==]
[==OpenAPI SLA==]
[==Flora Pitch==]
[✓ Patent COMPLETE]
     [==Sandbox Env==]
     [==Impact Export==]
          [==Case Study==]
               [==Client Configs==]
                              ✓ PHASE 1 COMPLETE (99%)

PHASE 2 - INFRASTRUCTURE (GRC + DPO):
[====GRC Platform Deploy====]
[====Fractional DPO Contract====]
     [==GitProtect Backup Config==]

PHASE 2 - DPAs (GRC-Assisted):
          [====DPA Supabase/Stripe====]
                    [====DPA OpenAI/MapBox====]

PHASE 2 - ENGINEERING:
                    [========Usage API========]
                         [======UI Components======]

PHASE 2 - SOC 2 (GRC-Automated):
                                   [============SOC 2 Evidence (Automated)============]
                                                     [========SOC 2 Audit========]
                                                                    ✓ PHASE 2 COMPLETE (99%)

CLIENT ONBOARDING TIERS:
[========TIER A: Plantum, Plant Parent========]     ← Revenue starts
                    [========TIER B: LeafSnap, iNaturalist========]     ← Revenue compounds
                                             [========TIER C: Flora, PlantNet========]     ← GDPR-ready
                                                                    [========TIER D: PictureThis, PlantSnap========]
                                                                                          ↑ SOC 2 report closes deals

REVENUE vs COMPLIANCE TIMELINE:
$$$  Tier A Revenue ─────────────────────────────────────────────────────────────────────────→
          ↓ funds
     [GRC+DPO $11K-16K]
               $$$ Tier B Revenue ───────────────────────────────────────────────────────────→
                         ↓ funds
                    [SOC 2 Audit $10K-25K]
                              $$$$$ Tier C+D Revenue ────────────────────────────────────────→
                                                    ↑ BREAK-EVEN (Week 8)
```

---

## Resource Requirements

### Engineering (Internal)
| Task | Effort | Priority |
|------|--------|----------|
| Response headers | 4 hours | P0 |
| OpenAPI SLA update | 2 hours | P0 |
| Sandbox environment | 16 hours | P1 |
| Impact Simulator export | 8 hours | P1 |
| Usage API endpoint | 24 hours | P1 |
| White-label components | 40 hours | P2 |

**Total Engineering:** ~94 hours (2.5 weeks FTE)

### Legal/External (Cost-Optimized with GRC Tooling)

| Task | Traditional Cost | Optimized Cost | Savings | Priority |
|------|-----------------|----------------|---------|----------|
| ~~Provisional patent~~ | ~~$3,000-5,000~~ | $0 | 100% | ✅ Complete |
| **GRC Platform (Vanta)** | N/A | $8,000-12,000/yr | Enables below ↓ | P0 |
| **GitProtect.io** | N/A | $600-1,800/yr | SOC 2 backup control | P1 |
| SOC 2 Type II audit | $15,000-40,000 | $10,000-25,000 | 33-38% | P1 |
| External DPO (annual) | $6,000-24,000 | $1,800-3,600/yr | 70-85% | P1 |
| DPA review (4 vendors) | $2,000-4,000 | $500-1,000 | 75% | P1 |

**Traditional Total:** $23,000-68,000  
**Optimized Total:** $20,900-43,400  
**Net Savings:** $2,100-24,600 (9-36% reduction)

**Note:** GRC platform cost ($8K-12K) is additive but enables audit cost reduction ($5K-15K) and DPA automation ($1.5K-3K), yielding net positive ROI in Year 1.

### Revenue Offset Model

| Phase | Target ARR | Clients | Compliance Cost Coverage |
|-------|-----------|---------|--------------------------|
| Tier A (Weeks 1-4) | $15K-30K | Plantum, Plant Parent | Covers GRC + DPO setup |
| Tier B (Weeks 5-8) | $25K-50K | LeafSnap, iNaturalist | Covers SOC 2 audit |
| Tier C (Weeks 9-16) | $40K-80K | Flora Incognita, PlantNet | Profit margin begins |
| Tier D (Weeks 17-24) | $100K+ | PictureThis, PlantSnap | Full enterprise margin |

**Break-even Point:** End of Tier B (Week 8) — compliance costs fully recovered

### Sales/Marketing
| Task | Effort | Priority |
|------|--------|----------|
| Flora Incognita pitch deck | 8 hours | P0 |
| Integration case study | 16 hours | P1 |
| Storybook documentation | 8 hours | P2 |

**Total Sales/Marketing:** ~32 hours

---

## Success Metrics

### Phase 1 Completion Criteria (Week 4)
- [ ] All API responses include `X-Response-Time` header
- [ ] OpenAPI spec includes SLA section
- [ ] Flora Incognita pitch deck approved
- [x] Patent protection confirmed (SoilSidekick Pro Claims 8, 18, 19)
- [ ] Sandbox environment live at `sandbox.leafengines.dev`
- [ ] Impact Simulator PDF export functional
- [ ] Integration case study published
- [ ] 3 client-specific configurations ready

### Phase 2 Infrastructure Criteria (Week 4)
- [ ] GRC platform (Vanta/Drata) deployed and collecting evidence
- [ ] Fractional DPO service contracted (<24hr response SLA)
- [ ] GitProtect.io daily backups verified

### Tier A Client Onboarding (Week 4)
- [ ] Plantum: Signed contract, API keys issued
- [ ] Plant Parent: Signed contract, API keys issued
- [ ] **Revenue Target:** $15K-30K ARR achieved

### Tier B Client Onboarding (Week 8)
- [ ] DPAs signed with Supabase + Stripe (via GRC templates)
- [ ] LeafSnap: Signed contract, integration complete
- [ ] iNaturalist: Signed contract, integration complete
- [ ] **Revenue Target:** $25K-50K additional ARR
- [ ] **Break-even:** Compliance costs recovered

### Tier C Client Onboarding (Week 16)
- [ ] DPAs signed with OpenAI + MapBox
- [ ] SOC 2 evidence collection 80%+ complete
- [ ] Flora Incognita: GDPR-compliant integration live
- [ ] PlantNet: GDPR-compliant integration live
- [ ] `/api/v2/usage` endpoint live
- [ ] White-label component library published to npm

### Tier D Client Onboarding (Week 24)
- [ ] SOC 2 Type II audit report received (unqualified)
- [ ] PictureThis: Enterprise contract signed (SOC 2 required)
- [ ] PlantSnap: Enterprise contract signed (SOC 2 required)
- [ ] **Revenue Target:** $100K+ ARR from Tier D clients

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SOC 2 audit delays | Medium | High | GRC automation reduces prep time by 40% |
| ~~Patent prior art issues~~ | ~~Low~~ | ~~Medium~~ | ✅ Covered by existing SoilSidekick Pro patent |
| DPA negotiation delays | Low | Medium | GRC platform provides pre-negotiated templates |
| Engineering resource constraints | Medium | High | Prioritize P0 tasks, defer P2 if needed |
| Tier A revenue shortfall | Medium | High | 2 backup clients identified (Blossom, Planta) |
| GRC platform learning curve | Low | Low | Vanta includes onboarding support |

---

## Governance

**Weekly Check-ins:** Monday 10am
**Stakeholders:** Engineering Lead, Legal, Sales, Product
**Escalation Path:** CEO for budget/timeline decisions

---

## Cost-Benefit Summary

| Approach | Year 1 Cost | Compliance Achieved | Revenue Offset |
|----------|-------------|---------------------|----------------|
| **Traditional** | $23K-68K | Week 12 | None (upfront) |
| **GRC-Optimized + Phased Clients** | $21K-43K | Week 20 | $40K-80K by Week 8 |

**Net Position at Week 8:**
- Traditional: -$23K to -$68K (all cost, no revenue)
- Optimized: +$19K to +$37K (revenue exceeds costs)

**Recommendation:** GRC-optimized approach with tiered client onboarding is self-funding by Week 8.

---

*Document Version: 1.0*  
*Created: December 2024*  
*Review Cadence: Weekly during execution*
