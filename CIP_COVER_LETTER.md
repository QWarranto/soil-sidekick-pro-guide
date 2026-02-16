# COVER LETTER — CONTINUATION-IN-PART APPLICATION

---

**IN THE UNITED STATES PATENT AND TRADEMARK OFFICE**

---

**Mail Stop Patent Application**  
Commissioner for Patents  
P.O. Box 1450  
Alexandria, VA 22313-1450

---

**Re:** Continuation-in-Part of U.S. Patent Application No. 19/320,727  
**Parent Title:** "System and Method for AI-Powered Soil Analysis with Offline-First Architecture"  
**CIP Title:** "Inertial Dead Reckoning System with Complementary Sensor Fusion, Adaptive Stride Estimation, and Kalman-Inspired Uncertainty Propagation for Agricultural Field Surveying"  
**Filing Type:** Continuation-in-Part (CIP) under 35 U.S.C. § 120

---

Dear Commissioner:

Enclosed please find the Continuation-in-Part (CIP) patent application filed pursuant to 35 U.S.C. § 120, claiming priority to and incorporating by reference the entirety of U.S. Patent Application No. 19/320,727, filed September 5, 2025, entitled "System and Method for AI-Powered Soil Analysis with Offline-First Architecture," which remains pending.

## Purpose of This Filing

The parent application discloses an AI-powered environmental intelligence platform with offline-first architecture enabling professionals to perform soil analysis, crop recommendations, and environmental assessments without continuous network connectivity. The parent application does not, however, address the problem of maintaining continuous geographic positioning during GPS signal denial—a critical operational requirement for autonomous systems operating in remote, obstructed, or electromagnetically contested environments.

This CIP application introduces new matter comprising **five interconnected modules implementing sync-gated dead reckoning with complementary sensor fusion, adaptive stride estimation, and Kalman-inspired uncertainty propagation**. These modules collectively solve the GPS-denial positioning problem by providing continuous, formally quantified positional estimates that integrate with the parent application's offline data persistence infrastructure.

## Summary of New Matter

The new matter disclosed herein comprises:

1. **Spherical Geodesy Displacement Engine** — Computes geographic coordinates from linear displacement and bearing using Vincenty-style direct formulae on a spherical Earth model, providing sub-meter accuracy for pedestrian-scale displacements.

2. **Inertial Step Detection** — A rising-edge threshold detector operating on tri-axial accelerometer magnitude with temporal debounce (250 ms minimum inter-step interval), calibrated to reject vibration artifacts common in field and industrial environments.

3. **Complementary Filter Sensor Fusion** — Fuses high-frequency orientation sensor data (quaternion-derived heading at 10 Hz) with low-frequency magnetometer compass reference using a weighted complementary filter (α = 0.96). An alternative embodiment employing an Extended Kalman Filter (EKF) is also disclosed, fusing GPS position fixes with step-displacement measurements and propagating uncertainty through a covariance matrix.

4. **Adaptive Stride Estimation** — Dynamically estimates displacement per step based on peak accelerometer amplitude within each step cycle, exploiting the biomechanical relationship between walking speed and impact force, with exponential moving average smoothing.

5. **Kalman-Inspired Positional Uncertainty Model** — Formally tracks positional variance accumulation per step (σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise²), providing monotonically increasing confidence bounds that reset to GPS-reported accuracy upon signal recovery.

These modules are orchestrated by a supervisory controller implementing a **three-tier adaptive positioning fallback chain** (GPS → Sensor-Based Dead Reckoning → Seeded Centroid). A distinguishing feature is that dead-reckoning activation is **gated on verification of the offline data synchronization infrastructure**, ensuring all positional estimates are persistable and recoverable—maintaining the data integrity guarantees of the parent application.

## Strategic and Commercial Context

The applicant's technology platform serves as a Universal Environmental Intelligence Layer, providing mission-critical ground-truth calibration for sensor and satellite data across multiple sectors including agriculture, carbon measurement/reporting/verification (MRV), insurance, urban infrastructure, and supply-chain operations. The inertial dead-reckoning capability disclosed in this CIP extends the platform's operational envelope to GPS-denied environments—a critical requirement for autonomous systems operating in urban canyons, dense canopy, indoor facilities, and electromagnetically contested zones.

The applicant maintains a strategic partnership integrating high-precision sensing hardware with the disclosed software intelligence layer, creating an end-to-end "Sense-and-Interpret" ecosystem. The technology disclosed herein provides the interpretive intelligence and positioning resilience component of this integrated solution.

## Claims Summary

This application presents **3 independent claims and 7 dependent claims** covering:

- A computer-implemented method for estimating geographic position during GPS signal denial using step detection, complementary-filter sensor fusion, adaptive stride estimation, spherical geodesy displacement, and Kalman-inspired uncertainty propagation (Claim 1);
- A multi-tier adaptive positioning system with infrastructure-gated activation for offline-first platforms (Claims 2–3);
- Specific parameters, alternative embodiments (including EKF), and user-interface uncertainty indication (Claims 4–10).

## Enclosures

The following documents are submitted herewith:

- [ ] CIP Specification and Claims
- [ ] Abstract
- [ ] Declaration and Power of Attorney
- [ ] Application Data Sheet (ADS) with priority claim to App. No. 19/320,727
- [ ] Information Disclosure Statement (IDS), if applicable
- [ ] Filing Fee

## Priority Claim

This application claims the benefit of the filing date of U.S. Patent Application No. 19/320,727, filed September 5, 2025, for subject matter disclosed therein, and claims the filing date of this application for new matter relating to inertial dead reckoning, sensor fusion, adaptive stride estimation, and positional uncertainty modeling.

---

Respectfully submitted,

**[Applicant Name]**  
[Address]  
[City, State ZIP]  
[Telephone]  
[Email]

Date: _______________

---

*This cover letter accompanies the Continuation-in-Part application and should be filed with all required documents per 37 C.F.R. § 1.53(b).*
