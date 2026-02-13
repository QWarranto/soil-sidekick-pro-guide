# Skyline Instruments Technical Integration Plan
## LeafEngines™ Sensor Fusion Implementation

**Version:** 1.0  
**Created:** February 6, 2026  
**Status:** Planning Phase

---

## Executive Summary

This document defines the specific technical modifications and quality control schedule revisions required to integrate Skyline Instruments' precision RF hardware with the LeafEngines Intelligence Layer.

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Data Ingestion Protocols | REST only | REST + MQTT + WebSocket | 🔴 Critical |
| Edge Inference Latency | <100ms ✅ | <100ms | ✅ Complete |
| Cloud Analytics Latency | <1000-3000ms ✅ | <1000ms | ✅ Complete |
| Throughput Capacity | ~500 req/min | 10,000+ readings/min | 🔴 Critical |
| Equipment Standards | ADAPT 1.0 ✅ + ISO-XML v4.3 ✅ | ADAPT 1.0 + ISO 11783 validated | ✅ Complete |
| Sensor Correlation Engine | None | mmWave ↔ Environmental | 🔴 Critical |

---

## Part 1: Specific Technical Modifications

### 1.1 New Edge Functions Required

| Function | Purpose | Priority | Estimated Effort |
|----------|---------|----------|------------------|
| `sensor-data-ingestion` | High-frequency sensor data intake | 🔴 Critical | 16 hrs |
| `vital-signs-processor` | mmWave radar health monitoring | 🔴 Critical | 24 hrs |
| `canopy-reflectivity-analyzer` | Crop stress correlation engine | 🟡 High | 20 hrs |
| `equipment-sync-gateway` | ADAPT 1.0 prescription delivery | 🟡 High | 16 hrs |
| `environmental-hazard-dashboard` | <60s threat detection | 🟡 High | 12 hrs |

#### 1.1.1 `sensor-data-ingestion` Specification

```typescript
// Endpoint: POST /functions/v1/sensor-data-ingestion
interface SensorDataPayload {
  device_id: string;
  device_type: 'mmwave_radar' | 'quantum_rf' | 'precision_timing';
  timestamp: string; // ISO 8601
  readings: SensorReading[];
  metadata: {
    firmware_version: string;
    battery_level?: number;
    signal_strength?: number;
  };
}

interface SensorReading {
  metric: string;
  value: number;
  unit: string;
  confidence?: number;
}

// Response: 202 Accepted (async processing)
interface SensorDataResponse {
  ingestion_id: string;
  queued_at: string;
  estimated_processing_ms: number;
}
```

#### 1.1.2 `vital-signs-processor` Specification

```typescript
// Edge inference for worker safety (WebGPU accelerated)
interface VitalSignsInput {
  worker_id: string;
  mmwave_signature: number[]; // Raw radar return
  ambient_temperature: number;
  humidity: number;
  location?: { lat: number; lng: number };
}

interface VitalSignsOutput {
  heart_rate_estimate: number;
  respiratory_rate_estimate: number;
  fatigue_score: number; // 0-100
  heat_stress_risk: 'low' | 'moderate' | 'high' | 'critical';
  alerts: VitalAlert[];
}

interface VitalAlert {
  type: 'fall_detected' | 'heat_stress' | 'fatigue' | 'irregular_vitals';
  severity: 'warning' | 'critical';
  recommended_action: string;
  timestamp: string;
}
```

### 1.2 Protocol Infrastructure Additions

#### MQTT Broker Integration

| Component | Implementation | Notes |
|-----------|----------------|-------|
| Broker | AWS IoT Core or HiveMQ Cloud | Managed service preferred |
| Topics | `skyline/{device_id}/readings` | Per-device partitioning |
| QoS | Level 1 (at least once) | Balance reliability/throughput |
| Bridge | Edge function webhook relay | MQTT → REST translation |

**Architecture:**
```
Skyline Hardware → MQTT Broker → Lambda/Edge Bridge → sensor-data-ingestion
                       ↓
              WebSocket Gateway (real-time dashboard)
```

#### WebSocket Gateway

```typescript
// New: supabase/functions/sensor-websocket-gateway/index.ts
// Provides real-time streaming to dashboard clients

interface WebSocketMessage {
  type: 'sensor_update' | 'alert' | 'heartbeat';
  device_id: string;
  payload: SensorReading | VitalAlert | null;
  timestamp: string;
}
```

### 1.3 Database Schema Additions

```sql
-- New tables for sensor data pipeline

CREATE TABLE sensor_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('mmwave_radar', 'quantum_rf', 'precision_timing')),
  farm_id UUID REFERENCES fields(id),
  firmware_version TEXT,
  last_seen_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT REFERENCES sensor_devices(device_id),
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  confidence NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ DEFAULT NOW(),
  -- Partitioning for high-volume data
  PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- Create monthly partitions for sensor data
CREATE TABLE sensor_readings_2026_02 PARTITION OF sensor_readings
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE vital_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id TEXT NOT NULL,
  device_id TEXT REFERENCES sensor_devices(device_id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  vital_data JSONB,
  environmental_context JSONB,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-throughput queries
CREATE INDEX idx_sensor_readings_device_time ON sensor_readings(device_id, recorded_at DESC);
CREATE INDEX idx_vital_alerts_worker ON vital_alerts(worker_id, created_at DESC);
CREATE INDEX idx_vital_alerts_unacknowledged ON vital_alerts(acknowledged_at) WHERE acknowledged_at IS NULL;
```

### 1.4 Correlation Engine Modifications

**File:** `supabase/functions/canopy-reflectivity-analyzer/index.ts`

```typescript
// Correlation logic: mmWave radar ↔ LeafEngines environmental data
interface CanopyCorrelationInput {
  mmwave_reflectivity: number[];  // Skyline radar return
  location: { county: string; state: string };
  timestamp: string;
}

interface CanopyCorrelationOutput {
  stress_detected: boolean;
  stress_type?: 'water_deficit' | 'nutrient_deficiency' | 'disease' | 'pest' | 'unknown';
  confidence: number;
  contributing_factors: {
    source: 'soil_moisture' | 'weather' | 'satellite_ndvi' | 'water_quality';
    correlation_strength: number;
    data_point: any;
  }[];
  recommended_action: string;
  days_before_visible_symptoms?: number;
}
```

**Integration with existing endpoints:**
- `get-soil-data`: Soil moisture context
- `territorial-water-quality`: Contamination risk
- `alpha-earth-environmental-enhancement`: Satellite NDVI

### 1.5 ADAPT 1.0 & ISO 11783 Compliance Implementation ✅

**Status:** ✅ **COMPLETE** — Deployed as Supabase edge function `isobus-task`

**Endpoint:** `POST /functions/v1/isobus-task`

The `isobus-task` edge function provides a full ADAPT 1.0 → ISO-XML v4.3 converter with three sub-routes:

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/isobus-task` | POST | JWT | Convert ADAPT JSON → ISO-XML TASKDATA.XML |
| `/isobus-task/validate` | POST | JWT | Validate ADAPT input before conversion |
| `/isobus-task/ddi-mappings` | GET | Public | List available DDI codes (11 mappings) |

**Supported DDI Mappings:** ApplicationRate, SeedRate, Yield, WorkingWidth, FuelConsumption, NitrogenRate, PhosphorusRate, PotassiumRate, SprayPressure, GroundSpeed, WorkState

**ISO-XML v4.3 Element Mapping:**

| ADAPT Concept | ISO-XML Element | Description |
|---------------|----------------|-------------|
| Grower | CUS | Customer entity |
| Farm | FRM | Farm entity linked to customer |
| Field | PFD + PLN | Partfield with polygon boundary |
| Operation | TSK + TLG | Task with time log and data values |
| Product | PDT | Product definition |
| Equipment | DVC + DPD | Device with device property descriptions |
| Prescription Zones | GRD + TZN + PDV | Grid with treatment zones and process data |
| Field Boundary | PLN + LSG + PNT | Polygon linestring with GPS points |

**Output formats:** Raw XML (`Content-Type: application/xml`) or JSON-wrapped (`?format=json`)

**Standalone bridge:** Also available at `~/clawd/iso-xml-bridge/` as an Express API for offline/CI use.

---

## Part 2: Quality Control Schedule Revisions

### 2.1 Current QC Baseline (Pre-Skyline)

| Metric | Current Value | Source Document |
|--------|---------------|-----------------|
| Frontend test coverage | 111 tests, ~22% line | `docs/TEST_COVERAGE_REPORT.md` |
| Edge function coverage | 2/42 functions (5%) | `docs/COMPREHENSIVE_TEST_REPORT_2026-02.md` |
| Critical path coverage | 85% average | `docs/COMPREHENSIVE_TEST_REPORT_2026-02.md` |
| Load test capacity | ~500 req/min validated | `load-tests/BASELINE_METRICS.md` |
| Sub-100ms SLA | ✅ WebGPU offline only | Memory constraint |

### 2.2 Revised QC Targets (Post-Skyline Integration)

| Metric | Current | Week 4 Target | Week 10 Target | Justification |
|--------|---------|---------------|----------------|---------------|
| Edge function coverage | 5% | 25% | 50% | Sensor functions are safety-critical |
| Sensor pipeline tests | 0 | 20 tests | 50 tests | MQTT/WebSocket validation |
| Throughput validated | 500/min | 2,000/min | 10,000/min | Skyline requirement |
| Vital signs latency | N/A | <100ms verified | <100ms + 99.9% SLA | Worker safety |
| ADAPT 1.0 conformance | ✅ 100% | 80% | 100% | Equipment interoperability |
| ISO 11783 validation | ✅ 100% | 50% | 100% | ISOBUS compatibility |

### 2.3 Revised Testing Schedule

#### Phase 3A: Sensor Infrastructure (Weeks 1-2)

| Day | Task | Owner | Success Criteria |
|-----|------|-------|------------------|
| 1-2 | MQTT broker provisioning | DevOps | Broker accessible, topics created |
| 2-3 | `sensor-data-ingestion` implementation | Engineering | POST endpoint live |
| 3-4 | `sensor-data-ingestion` unit tests | QA | 10 tests passing |
| 4-5 | WebSocket gateway prototype | Engineering | Real-time demo working |
| 5-6 | Database schema migration | Engineering | Tables created, indexes verified |
| 6-7 | Integration test: MQTT → DB | QA | End-to-end data flow verified |

#### Phase 3B: Vital Signs & Safety (Weeks 3-4)

| Day | Task | Owner | Success Criteria |
|-----|------|-------|------------------|
| 8-9 | `vital-signs-processor` implementation | Engineering | WebGPU inference working |
| 9-10 | Fall detection algorithm | Engineering | 95% accuracy on test dataset |
| 10-11 | Heat stress correlation | Engineering | Integration with weather API |
| 11-12 | Alert delivery pipeline | Engineering | <5s alert latency |
| 12-13 | Vital signs test suite | QA | 15 tests, edge cases covered |
| 14 | Pilot deployment prep | All | Single-farm ready |

#### Phase 3C: Correlation & Equipment (Weeks 5-6)

| Day | Task | Owner | Success Criteria |
|-----|------|-------|------------------|
| 15-16 | `canopy-reflectivity-analyzer` | Engineering | Correlation engine working |
| 17-18 | Soil/weather/NDVI fusion | Engineering | Multi-source correlation |
| 19-20 | ~~ADAPT 1.0 prescription export~~ | ~~Engineering~~ | ✅ **COMPLETE** — `isobus-task` edge function deployed |
| 21-22 | ~~ISO 11783 schema validation~~ | ~~Engineering~~ | ✅ **COMPLETE** — ISO-XML v4.3 output validated |
| 23-24 | Equipment sync tests | QA | 10 tests, timing verified |

#### Phase 3D: Load Testing & Hardening (Weeks 7-8)

| Day | Task | Owner | Success Criteria |
|-----|------|-------|------------------|
| 25-26 | 2,000 readings/min load test | QA | No errors, <200ms p95 |
| 27-28 | 5,000 readings/min load test | QA | <5% error rate |
| 29-30 | 10,000 readings/min load test | QA | Target throughput achieved |
| 31-32 | Chaos engineering (network failures) | QA | Graceful degradation verified |
| 33-34 | Security audit (sensor endpoints) | Security | No critical vulnerabilities |

### 2.4 New Load Test Scripts Required

```javascript
// load-tests/scripts/test-sensor-ingestion.js
export const options = {
  scenarios: {
    sensor_burst: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1m',
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { duration: '2m', target: 2000 },
        { duration: '5m', target: 5000 },
        { duration: '3m', target: 10000 },
        { duration: '2m', target: 10000 }, // Sustain
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### 2.5 Revised Monitoring & Alerting

| Alert | Threshold | Response | Escalation |
|-------|-----------|----------|------------|
| Vital signs latency | >100ms p95 | Auto-scale edge | Page on-call |
| Sensor ingestion errors | >1% rate | Circuit breaker | Notify DevOps |
| MQTT backlog | >10,000 messages | Scale consumers | Page on-call |
| Worker alert delivery | >5s | Priority queue | Page on-call |
| Canopy analysis failures | >5% | Fallback to satellite-only | Notify Engineering |

---

## Part 3: Integration Milestones

### Milestone 1: Technical Discovery Complete (Week 2)
- [ ] Skyline data format documentation received
- [ ] MQTT topic structure agreed
- [ ] API workshop completed
- [ ] Database schema finalized

### Milestone 2: Sensor Pipeline Live (Week 4)
- [ ] `sensor-data-ingestion` deployed
- [ ] MQTT bridge operational
- [ ] WebSocket gateway functional
- [ ] 2,000 readings/min validated

### Milestone 3: Vital Signs MVP (Week 6)
- [ ] `vital-signs-processor` deployed (WebGPU)
- [ ] Fall detection <100ms latency
- [ ] Heat stress alerts operational
- [ ] Pilot farm deployment ready

### Milestone 4: Full Integration (Week 8)
- [ ] Canopy correlation engine live
- [x] ADAPT 1.0 export functional ✅ (`isobus-task` edge function)
- [ ] 10,000 readings/min validated
- [x] ISO 11783 compliance verified ✅ (ISO-XML v4.3 TASKDATA.XML output)

### Milestone 5: Production Launch (Week 10+)
- [ ] SOC 2 audit evidence updated
- [ ] Co-branded solution announced
- [ ] Production monitoring active
- [ ] SLA documentation published

---

## Part 4: Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Skyline data format changes | Medium | High | Version negotiation in contract |
| 10K/min throughput not achievable | Low | Critical | Early load testing, partition strategy |
| WebGPU unavailable on field devices | Medium | Medium | CPU fallback already implemented |
| MQTT broker latency | Low | High | Multi-region broker deployment |
| ADAPT 1.0 spec ambiguity | Medium | Medium | Direct OEM consultation |

---

## Part 5: Resource Requirements

### Engineering Effort

| Component | Hours | Skills Required |
|-----------|-------|-----------------|
| Sensor ingestion pipeline | 40 | Edge functions, MQTT |
| Vital signs processor | 32 | WebGPU, ML inference |
| Correlation engine | 24 | Data fusion, APIs |
| ADAPT 1.0 compliance | 20 | GIS, equipment standards |
| Load testing & hardening | 24 | k6, chaos engineering |
| **Total** | **140 hours** | ~3.5 weeks FTE |

### Infrastructure Costs (Monthly)

| Component | Estimated Cost | Notes |
|-----------|----------------|-------|
| MQTT broker (managed) | $200-500 | AWS IoT Core or HiveMQ |
| Database scaling (partitions) | $100-300 | Additional storage |
| Edge function scaling | $50-200 | Higher concurrency |
| Monitoring (Datadog/Grafana) | $100-200 | Sensor-specific dashboards |
| **Total** | **$450-1,200/mo** | Scales with deployment size |

---

## Appendices

### A. Related Documentation

- `docs/partnerships/SKYLINE_SENSOR_FUSION_ONE_PAGER.md` - Partnership overview
- `docs/SDK_INTEGRATION_GUIDE.md` - SDK technical specifications
- `docs/COMPREHENSIVE_TEST_REPORT_2026-02.md` - Current test status
- `load-tests/BASELINE_METRICS.md` - Performance baselines
- `SDK_PHASE_1_2_READINESS_SCHEDULE.md` - SDK readiness tracking

### B. External References

- ADAPT 1.0 Standard: https://adaptframework.org
- ISO 11783 (ISOBUS): https://www.isobus.net
- AWS IoT Core MQTT: https://aws.amazon.com/iot-core/

---

*Document Version: 1.0*  
*Next Review: Week 2 (Post-Discovery)*  
*Owner: Engineering Lead*
