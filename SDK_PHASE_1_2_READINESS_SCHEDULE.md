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

### Target Clients: PictureThis, PlantSnap, LeafSnap, iNaturalist, PlantNet

| Week | Action | Owner | Deliverable | Success Criteria | % Gain |
|------|--------|-------|-------------|------------------|--------|
| **1-2** | Initiate SOC 2 Type II audit engagement | Legal/Ops | Auditor contract | Audit firm selected, timeline agreed | +5% |
| **3-4** | Execute DPA with Supabase | Legal | Signed DPA | Legal review complete, countersigned | +3% |
| **3-4** | Execute DPA with Stripe | Legal | Signed DPA | Legal review complete, countersigned | +2% |
| **5-6** | Execute DPA with OpenAI | Legal | Signed DPA | Legal review complete, countersigned | +3% |
| **5-6** | Execute DPA with MapBox | Legal | Signed DPA | Legal review complete, countersigned | +2% |
| **4-6** | Appoint Data Protection Officer | Legal/HR | DPO designation | Internal or external DPO named | +3% |
| **5-8** | Build `/api/v2/usage` cost transparency endpoint | Engineering | Edge function | Licensees can query their usage | +4% |
| **6-8** | Create white-label UI component library | Engineering | npm package | React components for licensee embedding | +3% |
| **8-10** | Complete SOC 2 Type II evidence collection | Ops | Evidence package | All controls documented | +0% |
| **10-12** | SOC 2 Type II audit completion | External | Audit report | Unqualified opinion | +2% |

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

### Weeks 4-6: DPO Appointment

#### Task 2.6: Data Protection Officer

**Options:**
1. **Internal DPO** - Designate existing employee (legal/compliance background)
2. **External DPO** - Contract with DPO-as-a-Service provider

**Recommended:** External DPO for cost efficiency ($500-2,000/month)

**Providers:**
- Dataguard
- OneTrust DPO Services
- DPEX Network

**Responsibilities:**
- GDPR compliance oversight
- SAR handling supervision
- DPIA review and approval
- Supervisory authority liaison

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

## Combined Timeline View

```
Week:  1    2    3    4    5    6    7    8    9    10   11   12
       |----|----|----|----|----|----|----|----|----|----|----|----|

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

PHASE 2 (72% → 99%):
[====SOC 2 Initiation====]
          [====DPA Supabase/Stripe====]
                    [====DPA OpenAI/MapBox====]
               [====DPO Appointment====]
                    [========Usage API========]
                         [======UI Components======]
                                   [========SOC 2 Evidence========]
                                             [==SOC 2 Audit==]
                                                        ✓ PHASE 2 COMPLETE (99%)
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

### Legal/External
| Task | Cost Estimate | Priority |
|------|---------------|----------|
| ~~Provisional patent~~ | ~~$3,000-5,000~~ | ✅ Complete (SoilSidekick Pro) |
| SOC 2 Type II audit | $15,000-40,000 | P1 |
| External DPO (annual) | $6,000-24,000 | P1 |
| DPA review (4 vendors) | $2,000-4,000 | P1 |

**Total Legal/External:** $23,000-68,000

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

### Phase 2 Completion Criteria (Week 12)
- [ ] SOC 2 Type II audit report received (unqualified)
- [ ] DPAs signed with all 4 vendors
- [ ] DPO appointed and registered
- [ ] `/api/v2/usage` endpoint live
- [ ] White-label component library published to npm
- [ ] All enterprise clients can query their usage in real-time

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SOC 2 audit delays | Medium | High | Start evidence collection Week 1 |
| Patent prior art issues | Low | Medium | Comprehensive prior art search |
| DPA negotiation delays | Medium | Medium | Use standard vendor DPAs where available |
| Engineering resource constraints | Medium | High | Prioritize P0 tasks, defer P2 if needed |

---

## Governance

**Weekly Check-ins:** Monday 10am
**Stakeholders:** Engineering Lead, Legal, Sales, Product
**Escalation Path:** CEO for budget/timeline decisions

---

*Document Version: 1.0*  
*Created: December 2024*  
*Review Cadence: Weekly during execution*
