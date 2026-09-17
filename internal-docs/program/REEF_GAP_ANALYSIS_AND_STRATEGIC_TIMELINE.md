# REEF Gap Analysis & Strategic Convergence Timeline

**Date:** March 2026  
**Status:** Strategic Planning Document  
**Reference:** DIU CSO — Robotic Exclusion & Engagement Framework (REEF)  
**Baseline:** LeafEngines™ SDK v2.2 / SoilSidekick Pro Platform

---

## Executive Summary

The REEF qualification analysis identifies three REEF Solution Components (1, 3, 4) where the SSKP/LeafEngines platform has architectural alignment. This document evaluates the **actual delta** between what exists in the codebase today and what REEF requires, then provides a phased convergence timeline.

**Overall Assessment:** ~60% architectural alignment, ~25% validated alignment, ~15% net-new capability required.

---

## 1. Gap Analysis: What We Have vs. What REEF Requires

### Component 1: Detect, Track, and Classify

| REEF Requirement | Current Platform State | Gap Severity | Notes |
|-----------------|----------------------|-------------|-------|
| Multi-modal sensor fusion (acoustic, optical, RF) | ✅ EO/IR + RF fusion demonstrated (DV005 demo); complementary filter (α=0.96) validated | 🟡 Moderate | Architecture is modality-agnostic. Acoustic/sonar ingestion adapters are **net-new** — no hydrophone or sonar data pipeline exists. |
| Low-cost COTS sensor integration | ✅ Platform built on COTS; Skyline mmWave partnership validates hardware path | 🟢 Low | Sensor-agnostic ingestion is a core design principle. |
| Edge inference <100ms | ✅ WebGPU <100ms validated; ONNX native <100ms in embedded architecture | 🟢 Low | Patent-protected. Directly transferable. |
| Target tracking (bearing, range, rate) | 🟡 Vincenty geodesy provides sub-meter positioning; dead-reckoning provides continuous tracking | 🟠 High | Current tracking is **terrain/position** tracking, not **object** tracking. Need: multi-target tracker (Kalman/Hungarian assignment), track-to-track correlation. |
| Classification/discrimination (threat vs. benign) | 🟡 AI/ML classification exists for vegetation/soil/crop | 🔴 Critical | **No maritime target classifier exists.** Domain transfer from environmental classification to underwater target classification requires new training data, new model heads, and maritime-specific feature engineering. |
| Clutter rejection & false alarm mitigation | 🟡 Environmental noise filtering in sensor fusion | 🟠 High | Terrestrial clutter models ≠ maritime clutter. Need: maritime clutter models (surface vessels, marine life, tidal noise, multipath). |
| GPS-denied positioning | ✅ Patent-protected dead-reckoning (CIP #19/544,827) with Kalman-inspired variance propagation | 🟡 Moderate | Validated for pedestrian/vehicle. Underwater adaptation requires pressure/depth sensor integration and acoustic positioning (USBL/LBL). |
| Deployment on fixed + mobile platforms | ✅ Architecture supports edge, mobile (Capacitor), and cloud | 🟡 Moderate | No **underwater housing** or **marine-grade deployment** experience. Hardware integration is partner-dependent. |
| MOSA compliance | ✅ Open API (OpenAPI spec), modular edge functions, SDK in 6 languages | 🟢 Low | Strong alignment. Would need MOSA-specific documentation artifacts. |

### Component 3: Data and Network Architecture

| REEF Requirement | Current Platform State | Gap Severity | Notes |
|-----------------|----------------------|-------------|-------|
| Near real-time sensor-level data transmission | ✅ MQTT <50ms validated; 10,000+ msg/min throughput | 🟢 Low | Direct alignment. |
| Secure data transmission (DoD-compliant) | 🟡 SOC 2–aligned; TLS 1.3; AES-256 at rest | 🟠 High | **FIPS 140-2/140-3 validation is not complete.** SOC 2 ≠ DoD ATO. Need: FIPS-validated crypto modules, STIG compliance, potential IL4/IL5 accreditation path. |
| Edge-to-cloud data flow with disconnected ops | ✅ Offline-first architecture; delayed sync; offline caching | 🟢 Low | Core platform strength. Directly transferable. |
| Scalability across distributed sensor network | ✅ Edge functions auto-scale; multi-tier caching | 🟡 Moderate | Validated for API clients, not for **hundreds of physical sensor nodes** in a mesh topology. |
| Underwater acoustic communication | ❌ Not present | 🔴 Critical | **Net-new.** No acoustic modem, JANUS protocol, or underwater networking stack exists. Requires partner or COTS integration. |
| Maritime protocol support (NMEA, AIS) | ❌ Not present | 🔴 Critical | **Net-new.** Current protocols: MQTT, HTTP, ISOBUS/ADAPT, CAN Bus. Maritime protocols require new adapters. |
| Network redundancy & self-healing | 🟡 Three-tier fallback chain (GPS → DR → Centroid) | 🟡 Moderate | Fallback exists for positioning. Network-level redundancy (mesh, store-and-forward) needs extension. |

### Component 4: Common Operating Picture / Command and Control (COP/C2)

| REEF Requirement | Current Platform State | Gap Severity | Notes |
|-----------------|----------------------|-------------|-------|
| Integration with USG COP/C2 systems | 🟡 Open API; integrates with NOAA, USDA, EPA data | 🟠 High | No integration with **military C2 systems** (e.g., GCCS-M, DCGS, TAK). Need: TAK plugin or NIEM/MIL-STD data export. |
| User-friendly interface (hours to learn) | ✅ React dashboard, mobile-responsive, Mapbox visualization | 🟢 Low | Strong alignment. Maritime-specific map layers (charts, bathymetry) would be additive. |
| AI/ML decision assistance with explainability | ✅ AI recommendations with reasoning traces; regulatory-grade audit | 🟡 Moderate | Reasoning engine exists. Maritime threat-specific decision logic is **net-new**. |
| Multi-modal fusion in COP display | 🟡 DV005 demonstrates EO/IR + RF co-registration on a shared grid | 🟠 High | COP currently shows environmental data. Need: target track overlay, threat symbology (MIL-STD-2525), engagement zones. |
| Command/control of autonomous assets | ❌ Not present | 🔴 Critical | **Net-new.** No USV/UUV command interface, no waypoint planning, no engagement authorization workflow. |
| Maritime-specific visualization | ❌ Not present | 🟠 High | Need: nautical chart integration, tide/current overlays, water depth contours, AIS vessel overlay. |

---

## 2. Consolidated Gap Categories

### 🔴 Critical Gaps (Net-New Capability Required)

1. **Maritime target classification model** — no underwater threat detection ML exists
2. **Underwater acoustic communication** — no JANUS/acoustic modem integration
3. **Maritime protocol adapters** — no NMEA 0183/2000, AIS, or MIL-STD-1553 support
4. **Autonomous asset C2** — no USV/UUV command/control interface
5. **DoD security accreditation path** — FIPS 140-2/3, STIG, ATO documentation

### 🟠 High Gaps (Significant Extension of Existing Capability)

6. **Multi-target tracker** — extend Kalman from position-only to multi-object tracking
7. **Maritime clutter models** — domain-specific false alarm suppression
8. **Military COP integration** — TAK plugin, MIL-STD-2525 symbology
9. **Maritime visualization** — nautical charts, bathymetry, tidal overlays
10. **FIPS-validated cryptography** — upgrade from SOC 2–aligned to FIPS-validated

### 🟡 Moderate Gaps (Adaptation of Existing Capability)

11. **Underwater dead-reckoning** — add pressure/depth sensor, USBL/LBL
12. **Distributed sensor mesh** — extend current edge architecture to physical sensor networks
13. **Maritime decision logic** — train reasoning engine on threat scenarios

### 🟢 Direct Alignment (Ready or Near-Ready)

14. Edge inference <100ms ✅
15. MQTT real-time data ✅
16. Offline-first / DIL resilience ✅
17. Open API / MOSA ✅
18. User-friendly dashboard ✅
19. Sensor-agnostic ingestion architecture ✅
20. Patent-protected positioning ✅

---

## 3. Strategic Convergence Timeline

### Phase 0: Foundation & Positioning (Now – Q2 2026) — 8 weeks

**Objective:** Establish credibility artifacts and close documentation gaps without new engineering.

| Week | Deliverable | Owner |
|------|-------------|-------|
| 1–2 | REEF-specific Technical Response Document mapping existing capabilities to Components 1/3/4 | BD/Engineering |
| 1–2 | MOSA compliance documentation package | Engineering |
| 3–4 | FIPS 140-2 gap assessment; identify COTS crypto libraries (e.g., OpenSSL FIPS module, AWS-LC) | Security |
| 3–4 | TAK (Team Awareness Kit) plugin feasibility study | Engineering |
| 5–6 | Maritime domain ontology definition (target types, threat levels, engagement rules) | Domain SME |
| 5–6 | Partner identification: acoustic sensor OEM, maritime comms vendor, UUV integrator | BD |
| 7–8 | DIU CSO white paper submission with architecture diagrams | BD/Engineering |

### Phase 1: Core Maritime Adaptation (Q3 2026) — 12 weeks

**Objective:** Demonstrate maritime sensor ingestion and basic target tracking.

| Week | Deliverable | Dependency |
|------|-------------|------------|
| 1–3 | **NMEA 0183/2000 protocol adapter** — ingest maritime navigation data into existing pipeline | None |
| 1–3 | **AIS data integration** — surface vessel tracking overlay on existing Mapbox dashboard | None |
| 4–6 | **Multi-target tracker** — extend Kalman filter to multi-object tracking with Hungarian assignment | Existing DR engine |
| 4–6 | **MIL-STD-2525 symbology layer** — threat/friendly/unknown icons on COP map | None |
| 7–9 | **Acoustic sensor adapter** — COTS hydrophone/sonar data ingestion (partner-dependent) | Partner ID (Phase 0) |
| 7–9 | **Nautical chart integration** — S-57/S-100 chart rendering in dashboard | Mapbox/OpenSeaMap |
| 10–12 | **Maritime clutter model v1** — basic false alarm suppression for harbor environments | Acoustic adapter |
| 10–12 | **Phase 1 demo** — live AIS + simulated acoustic detection on maritime COP | All above |

### Phase 2: Classification & Security Hardening (Q4 2026) — 12 weeks

**Objective:** Maritime target classification, FIPS crypto, and C2 prototype.

| Week | Deliverable | Dependency |
|------|-------------|------------|
| 1–4 | **Maritime target classifier v1** — UUV vs. marine life vs. debris (transfer learning from existing models) | Acoustic adapter + training data |
| 1–4 | **FIPS 140-2 validated crypto integration** — replace current TLS/AES with FIPS-validated modules | Gap assessment (Phase 0) |
| 5–8 | **TAK plugin v1** — export tracks and detections to Team Awareness Kit | TAK feasibility (Phase 0) |
| 5–8 | **Underwater dead-reckoning extension** — pressure/depth sensor + USBL positioning | Existing DR engine |
| 9–12 | **Autonomous asset C2 prototype** — waypoint planning, status monitoring for USV (read-only initially) | Partner UUV/USV |
| 9–12 | **STIG compliance baseline** — document and remediate against applicable STIGs | FIPS completion |
| 12 | **Phase 2 demo** — classified target on maritime COP with TAK export and FIPS-secured data flow | All above |

### Phase 3: Integration & Accreditation (Q1–Q2 2027) — 24 weeks

**Objective:** Full REEF compliance demo, ATO-ready posture.

| Week | Deliverable | Dependency |
|------|-------------|------------|
| 1–6 | **Acoustic communication stack** — JANUS protocol or COTS acoustic modem integration | Partner |
| 1–6 | **Maritime classifier v2** — expanded threat taxonomy, improved clutter rejection | Phase 2 classifier + field data |
| 7–12 | **Full C2 integration** — engage/disengage authorization workflow, human-in-the-loop controls | C2 prototype |
| 7–12 | **Distributed sensor mesh** — multi-node coordination, store-and-forward, mesh redundancy | Edge architecture |
| 13–18 | **ATO documentation package** — SSP, SAR, CONOPS, IA controls evidence | FIPS + STIG |
| 13–18 | **Maritime field trial** — harbor environment with real sensors (partner facility) | All above |
| 19–24 | **DIU prototype demonstration** — full Components 1/3/4 with live maritime scenario | All above |

---

## 4. Resource Estimate

| Phase | Duration | Estimated Engineering Effort | Key Dependencies |
|-------|----------|------------------------------|-----------------|
| Phase 0 | 8 weeks | 1 FTE + BD support | None (documentation + partnerships) |
| Phase 1 | 12 weeks | 2–3 FTE | Maritime sensor partner |
| Phase 2 | 12 weeks | 3–4 FTE | Training data, FIPS modules, TAK access |
| Phase 3 | 24 weeks | 4–5 FTE | Partner facility, ATO sponsor |
| **Total** | **~14 months** | **~10–13 FTE-months** | **Partner ecosystem critical** |

---

## 5. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| No acoustic sensor partner identified | Medium | Critical | Begin outreach in Phase 0; fallback to simulated acoustic data for demos |
| FIPS 140-2 validation timeline exceeds estimate | High | High | Use pre-validated COTS crypto (AWS-LC, BoringSSL FIPS) rather than custom validation |
| Maritime training data unavailable | Medium | Critical | Partner with Navy lab or use synthetic maritime data generation |
| TAK integration more complex than assessed | Low | Moderate | TAK has well-documented plugin API; fallback to KML/CoT export |
| DIU CSO timeline doesn't align with development | Medium | High | Submit Phase 0 white paper with Phase 1 demo commitment |
| Underwater DR accuracy insufficient | Medium | Moderate | Partner with USBL vendor; existing Vincenty engine provides foundation |

---

## 6. What's Directly Transferable Today

These existing capabilities require **zero additional engineering** for REEF alignment:

1. **Vincenty geodesy engine** — sub-meter coordinate grounding (Patent CIP #19/544,827)
2. **Complementary filter fusion** (α=0.96) — cross-modal consistency (Patent Prov #63/861,944)
3. **Kalman-inspired variance propagation** — uncertainty quantification with reliability gating
4. **Offline-first architecture** — DIL resilience with delayed sync
5. **MQTT <50ms edge messaging** — real-time sensor data transport
6. **OpenAPI SDK in 6 languages** — MOSA-compliant integration surface
7. **Edge inference <100ms** — WebGPU/ONNX Runtime (patent-protected latency SLA)
8. **DV005 technical demonstration** — validated cross-modal synthetic scene construction

---

## Related Documents

- `docs/BITNET_VS_GEMMA_ANALYSIS.md` — Offline LLM selection rationale
- `TECHNICAL_ARCHITECTURE.md` — Platform architecture reference
- `CIP_DEAD_RECKONING_PATENT.md` — Patent-protected positioning system
- `docs/partnerships/SKYLINE_TECHNICAL_INTEGRATION_PLAN.md` — Hardware OEM integration
- `src/lib/dead-reckoning/geodesy.ts` — Vincenty engine implementation
- `src/lib/dead-reckoning/sensor-fusion.ts` — Complementary filter implementation

---

*Last Updated: March 2026*
