# CONTINUATION-IN-PART PATENT APPLICATION

## Inertial Dead Reckoning System with Complementary Sensor Fusion, Adaptive Stride Estimation, and Kalman-Inspired Uncertainty Propagation for Agricultural Field Surveying

---

**Filing Type:** Continuation-in-Part (CIP)  
**Parent Application:** U.S. App. No. 19/320,727, filed September 5, 2025  
**Parent Title:** "System and Method for AI-Powered Soil Analysis with Offline-First Architecture"  
**Applicant:** [Same as Parent]  
**Priority Date (New Matter):** [CIP Filing Date]  
**Status of Parent:** Pending (Petition to Make Special filed)

---

## CROSS-REFERENCE TO RELATED APPLICATIONS

This application is a continuation-in-part of U.S. Patent Application No. 19/320,727, filed September 5, 2025, entitled "System and Method for AI-Powered Soil Analysis with Offline-First Architecture," the entirety of which is incorporated herein by reference. This application claims the benefit of the filing date of the parent application for subject matter disclosed therein, and claims the filing date of this application for new matter disclosed herein relating to inertial dead reckoning, sensor fusion, adaptive stride estimation, and positional uncertainty modeling.

---

## SUMMARY OF THE INVENTION

The present invention extends the parent application's offline-first agricultural intelligence platform with **5 modules implementing sync-gated dead reckoning with complementary sensor fusion, adaptive stride estimation, and Kalman-inspired uncertainty propagation for agricultural field surveying**.

The system provides continuous geographic positioning during GPS signal loss—a common occurrence in remote agricultural environments—by fusing data from onboard inertial measurement unit (IMU) sensors to estimate device displacement and heading. Unlike conventional dead-reckoning systems that operate independently of application state, the disclosed system gates activation of inertial positioning on verification of the offline data synchronization infrastructure, ensuring that all positional estimates are persistable and recoverable.

It is expressly noted that the variance propagation and stride estimation models disclosed herein are not merely mathematical abstractions or mental processes. Rather, they are specific algorithmic tools integrated into the mobile device's operating loop to achieve a technical effect: specifically, the transformation of the device's user interface to guide field behavior during signal loss, and the automated gating of the device's storage controller. By preventing the persistence of data when positional uncertainty is high (e.g., >500m), the invention improves the functioning of the offline-first database by reducing the storage of 'garbage' data that would otherwise require computationally expensive post-processing to clean.

---

## TECHNICAL FIELD

The present invention relates generally to mobile positioning systems for agricultural applications, and more particularly to inertial navigation and dead-reckoning methods that operate during GPS signal denial, utilizing sensor fusion algorithms, adaptive stride estimation, and formal uncertainty quantification to provide continuous field surveying capability within an offline-first software architecture.

---

## BACKGROUND OF THE INVENTION

The parent application (App. No. 19/320,727) discloses an AI-powered soil analysis platform with offline-first architecture enabling agricultural professionals to perform soil analysis, crop recommendations, and environmental assessments without continuous network connectivity. However, the parent application does not address the problem of maintaining geographic positioning when GPS signals are unavailable.

Agricultural field surveying frequently occurs in environments where GPS signal reception is degraded or entirely unavailable due to dense vegetation canopy, terrain obstructions, electromagnetic interference from agricultural equipment, or deliberate operation in disconnected mode to conserve power. Existing solutions either cease location-dependent functionality entirely during GPS denial or provide unquantified estimates that may lead to incorrect field boundary delineations, misattributed soil sample locations, or inaccurate variable-rate application prescriptions.

There exists a need for a positioning system that: (a) seamlessly transitions between GPS and inertial estimation; (b) formally quantifies the degradation of positional accuracy over time; (c) adapts displacement estimates to the user's actual gait characteristics; and (d) integrates with offline data persistence infrastructure to ensure positional data survives device and network failures.

---

## DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS

The invention comprises five interconnected modules that collectively implement a multi-tier adaptive positioning system. Each module is described below with reference to its algorithmic foundations, configuration parameters, and integration points.

### Module 1: Spherical Geodesy Displacement Engine

**Reference Implementation:** `src/lib/dead-reckoning/geodesy.ts`

The displacement engine computes the geographic coordinates resulting from a linear displacement at a given bearing from a known starting position. The computation employs a Vincenty-style direct formula on a spherical Earth model (radius R = 6,371,000 meters).

Given a starting position (φ₁, λ₁) in radians, a displacement distance d in meters, and a bearing θ in radians measured clockwise from true north, the destination coordinates are computed as:

```
φ₂ = arcsin(sin(φ₁) × cos(d/R) + cos(φ₁) × sin(d/R) × cos(θ))
λ₂ = λ₁ + arctan2(sin(θ) × sin(d/R) × cos(φ₁), cos(d/R) − sin(φ₁) × sin(φ₂))
```

This formulation provides sub-meter accuracy for displacements up to several kilometers, which is sufficient for pedestrian dead reckoning in agricultural surveying contexts where individual step displacements are on the order of 0.3–1.2 meters.

### Module 2: Inertial Step Detection via Accelerometer Thresholding

**Reference Implementation:** `src/lib/dead-reckoning/step-detector.ts`

The step detection module implements a rising-edge threshold detector operating on the Euclidean magnitude of tri-axial accelerometer readings. The detection algorithm proceeds as follows:

1. **Magnitude computation:** For each accelerometer sample (aₓ, aᵧ, a_z), compute the vector magnitude m = √(aₓ² + aᵧ² + a_z²).

2. **Rising-edge detection:** A step event is registered when the magnitude crosses a configurable threshold T from below: m(t-1) < T AND m(t) ≥ T. The default threshold T = 11.5 m/s² is calibrated to detect the characteristic impact peak of a walking stride while rejecting static gravitational acceleration (≈9.81 m/s²).

3. **Temporal debounce:** To prevent false positives from high-frequency vibrations common in agricultural environments (e.g., tractor engine vibration, equipment handling), a minimum inter-step interval constraint is enforced. Steps occurring within 250 ms of the previous detected step are suppressed. This constrains the maximum detection rate to 4 steps/second, which exceeds the physiological maximum for walking (~3.5 steps/second) while rejecting oscillatory artifacts.

The module maintains mutable state comprising the previous magnitude sample, the timestamp of the last detected step, and a cumulative step counter.

### Module 3: Complementary Filter Sensor Fusion for Heading Estimation

**Reference Implementation:** `src/lib/dead-reckoning/sensor-fusion.ts`

The sensor fusion module implements a complementary filter combining high-frequency gyroscope rate data with low-frequency accelerometer gravity reference. Specifically, the system fuses orientation data from two sensor sources:

- **Primary source (high-frequency):** The `AbsoluteOrientationSensor` Web API, which provides device orientation as a quaternion [qₓ, qᵧ, q_z, q_w] at 10 Hz. The heading (yaw) is extracted via:

  ```
  ψ = arctan2(2(q_w × q_z + qₓ × qᵧ), 1 − 2(qᵧ² + q_z²))
  ```

- **Secondary source (low-frequency):** The `DeviceOrientationEvent` API, which provides a compass heading (alpha) derived from the device magnetometer. The compass heading is converted via h = 360° − α.

The complementary filter blends these sources using a weighting parameter α (default 0.96):

```
heading_fused = heading_secondary + α × angularDifference(heading_primary, heading_secondary)
```

where `angularDifference(a, b)` computes the shortest angular distance in [-180°, 180°]:

```
diff = normalize(a) − normalize(b)
if diff > 180: diff -= 360
if diff < -180: diff += 360
```

The high α value (0.96) weights the primary sensor for short-term accuracy (rejecting magnetometer noise from agricultural equipment ferrous masses), while the secondary sensor provides long-term absolute reference to prevent gyroscope integration drift.

**Alternative Embodiments:**

In alternative embodiments, an Extended Kalman Filter (EKF) fuses GPS position fixes with step-displacement measurements and fused heading estimates, propagating uncertainty through a covariance matrix updated at each measurement epoch. The EKF state vector comprises position (latitude, longitude), velocity magnitude, and heading:

```
x = [φ, λ, v, ψ]ᵀ
```

The prediction step propagates state using the displacement model:

```
φ(k+1) = φ(k) + (v(k) × Δt × cos(ψ(k))) / R
λ(k+1) = λ(k) + (v(k) × Δt × sin(ψ(k))) / (R × cos(φ(k)))
```

The covariance matrix P is updated via P(k+1) = F × P(k) × Fᵀ + Q, where F is the Jacobian of the state transition and Q is the process noise covariance. When GPS measurements are available, the standard Kalman update step corrects the state estimate using the innovation (measurement residual) and Kalman gain K = P × Hᵀ × (H × P × Hᵀ + R)⁻¹.

### Module 4: Adaptive Stride Estimation via Accelerometer Amplitude Analysis

**Reference Implementation:** `src/lib/dead-reckoning/adaptive-stride.ts`

Rather than employing a fixed stride length, this module dynamically estimates stride length based on the peak-to-peak amplitude of accelerometer readings within each step cycle. This exploits the biomechanical relationship between walking speed and step impact force: faster walking produces both higher accelerometer peaks and longer strides.

The estimation model is:

```
stride_raw = baseStride + scaleFactor × max(0, peakMagnitude − restMagnitude)
stride_clamped = clamp(stride_raw, minStride, maxStride)
stride_smoothed = β × stride_clamped + (1 − β) × stride_previous
```

Default parameters:
- **baseStride:** 0.55 m (minimum stride for slow walking)
- **scaleFactor:** 0.12 m per (m/s²) excess magnitude
- **restMagnitude:** 9.81 m/s² (gravitational acceleration at rest)
- **maxStride:** 1.2 m (biomechanical maximum for walking)
- **minStride:** 0.3 m (shuffling/constrained movement)
- **smoothingAlpha (β):** 0.3 (exponential moving average weight)

The module tracks the peak accelerometer magnitude between consecutive step events. Upon step detection, the peak is consumed to compute the stride estimate, then reset to the rest magnitude for the next cycle. The exponential moving average smoothing suppresses sudden stride variations caused by terrain irregularities common in agricultural fields (furrows, soil compaction boundaries, irrigation channels).

### Module 5: Kalman-Inspired Positional Uncertainty Model with GPS Correction

**Reference Implementation:** `src/lib/dead-reckoning/uncertainty-model.ts`

The uncertainty model provides a formal, monotonically increasing confidence bound on the dead-reckoned position estimate. The model tracks positional variance (σ²) that accumulates with each step and resets upon GPS signal recovery.

The variance propagation equation per step is:

```
σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise²
uncertainty(n) = √(σ²(n))
```

Default parameters:
- **driftRatePerStep:** 0.15 (15% of stride length adds to positional variance per step)
- **processNoisePerStep:** 0.05 m (accounts for heading estimation errors and terrain-induced stride variability)
- **maxUncertaintyM:** 500 m (threshold beyond which the dead-reckoned estimate is flagged as unreliable)

Upon acquisition of a GPS fix with reported accuracy A, the uncertainty state is reset:

```
σ²(reset) = A²
uncertainty(reset) = A
unreliable = false
```

This ensures that positional uncertainty contracts to the GPS accuracy upon signal recovery, providing a natural "rubber-banding" correction that aligns the dead-reckoned trajectory with ground truth.

It is expressly noted that the variance propagation and stride estimation models disclosed herein are not merely mathematical abstractions or mental processes. Rather, they are specific algorithmic tools integrated into the mobile device's operating loop to achieve a technical effect: specifically, the transformation of the device's user interface to guide field behavior during signal loss, and the automated gating of the device's storage controller. By preventing the persistence of data when positional uncertainty is high (e.g., >500m), the invention improves the functioning of the offline-first database by reducing the storage of 'garbage' data that would otherwise require computationally expensive post-processing to clean.

---

## MULTI-TIER ADAPTIVE POSITIONING FALLBACK CHAIN

**Reference Implementation:** `src/hooks/useDeadReckoning.ts`

The five modules described above are orchestrated by a supervisory control layer that implements a three-tier positioning fallback chain:

| Tier | Source | Activation Condition | Typical Accuracy |
|------|--------|---------------------|-----------------|
| 1 | GPS (Geolocation API) | Device online, GPS available | 3–15 m |
| 2 | Sensor-based Dead Reckoning | Device offline, IMU sensors available, sync infrastructure verified | Degrades from GPS accuracy at ~0.15×stride/step |
| 3 | Seeded Centroid | No sensors available, manual or cached position | ~5,000 m (county-level) |

### Tier Transition Logic

- **Online → Offline transition:** GPS watch is terminated. Accelerometer and orientation sensors are activated at 20 Hz and 10 Hz respectively. The step detector, stride estimator, and sensor fusion modules are initialized. The last GPS fix becomes the starting position for dead reckoning.

- **Offline → Online transition:** Sensor listeners are stopped. GPS watch is re-established. Sub-system states (step detector, stride estimator, sensor fusion) are reset to prevent stale state contamination. The uncertainty model is reset upon the first GPS fix.

- **Seeded Centroid fallback:** When no sensor hardware is available, the system accepts a manually seeded position (e.g., from a county centroid lookup in the parent application's FIPS-based county database). This position carries a large initial uncertainty (default 5,000 m) that accurately reflects the coarse nature of the estimate.

### Infrastructure Gating

A distinguishing feature of this invention is that dead-reckoning activation is gated on verification of the offline data synchronization infrastructure disclosed in the parent application. Specifically, the sensor-based positioning subsystem (Tier 2) is activated only when:

1. The device has transitioned to offline mode (network connectivity lost);
2. The offline storage subsystem (IndexedDB / Capacitor Preferences) has been verified as operational; and
3. The synchronization queue is capable of persisting positional measurements for eventual upload.

This gating ensures that positional estimates generated during GPS denial are never lost due to storage failures, maintaining the data integrity guarantees of the parent application's offline-first architecture.

---

## USER INTERFACE INDICATION OF POSITIONAL UNCERTAINTY

The system communicates positional source and uncertainty to the user through a tiered visual indicator:

- **Green badge ("GPS Lock"):** Tier 1 active, position derived from live GPS fix
- **Yellow badge ("Estimating" with uncertainty radius):** Tier 2 active, dead-reckoned position with displayed uncertainty in meters
- **Red badge ("Unreliable"):** Tier 2 active but uncertainty exceeds maxUncertaintyM threshold, user advised to re-acquire GPS

This visualization enables agricultural professionals to make informed decisions about the reliability of location-dependent operations (soil sampling, boundary marking, application zone delineation) based on the current positioning accuracy.

---

## CLAIMS

### Independent Claims

**Claim 1.** A computer-implemented method for estimating geographic position of a mobile device during GPS signal denial, the method comprising:
   (a) detecting pedestrian steps from tri-axial accelerometer readings using a rising-edge threshold detector with temporal debounce;
   (b) estimating a heading of the mobile device by fusing orientation data from a first sensor operating at a first frequency with orientation data from a second sensor operating at a second, lower frequency using a complementary filter with a weighting parameter α, wherein the fused heading is computed as heading_fused = heading_secondary + α × angularDifference(heading_primary, heading_secondary);
   (c) for each detected step, computing an adaptive stride length based on peak accelerometer magnitude during the step cycle;
   (d) displacing a current estimated position along the fused heading by the adaptive stride length using spherical geodesy;
   (e) accumulating positional uncertainty according to a variance propagation model σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise²; and
   (f) upon acquisition of a GPS fix, resetting the positional uncertainty to the GPS-reported accuracy; and
   (g) inhibiting a write operation to the offline data storage subsystem for any collected agricultural data when the accumulated positional uncertainty exceeds a pre-determined reliability threshold, thereby preventing corruption of the agricultural field survey database with unreliable geospatial metadata.

**Claim 2.** A multi-tier adaptive positioning system for an offline-first agricultural intelligence platform, the system comprising:
   a first positioning tier utilizing GPS geolocation when the mobile device has network connectivity;
   a second positioning tier utilizing inertial dead reckoning comprising step detection, complementary-filter sensor fusion, and adaptive stride estimation, activated when the mobile device loses network connectivity and an offline data synchronization infrastructure has been verified as operational;
   a third positioning tier accepting a manually seeded geographic position with an associated uncertainty radius; and
   a supervisory controller that transitions between said tiers based on connectivity state, sensor availability, and infrastructure verification status.

**Claim 3.** The system of Claim 2, further comprising a method for gating activation of the second positioning tier, the method comprising:
   detecting loss of network connectivity on the mobile device;
   verifying that an offline data storage subsystem is operational and capable of persisting positional measurements;
   verifying that a synchronization queue is available for eventual upload of persisted measurements;
   only upon successful verification of both conditions, activating accelerometer and orientation sensor listeners for dead-reckoning position estimation; and
   deactivating said sensor listeners and resetting accumulated state upon restoration of network connectivity.

### Dependent Claims

**Claim 4.** The method of Claim 1, wherein the complementary filter weighting parameter α is in the range of 0.90 to 0.99, and wherein the first sensor comprises an AbsoluteOrientationSensor providing quaternion orientation data at a frequency of at least 10 Hz, and the second sensor comprises a magnetometer-derived compass heading.

**Claim 5.** The method of Claim 1, wherein in an alternative embodiment, an Extended Kalman Filter fuses GPS position fixes with step-displacement measurements and fused heading estimates, propagating uncertainty through a covariance matrix updated at each measurement epoch, the state vector comprising position, velocity magnitude, and heading.

**Claim 6.** The method of Claim 1, wherein the adaptive stride length is computed as stride = baseStride + scaleFactor × max(0, peakMagnitude − restMagnitude), clamped to a range of [minStride, maxStride], and smoothed by an exponential moving average.

**Claim 7.** The method of Claim 1, wherein the rising-edge threshold detector suppresses step events occurring within a debounce interval of 200–300 ms from a preceding step event, thereby rejecting vibration artifacts from agricultural equipment.

**Claim 8.** The system of Claim 2, further comprising a visual uncertainty indicator displayed to the user, the indicator comprising a first visual state indicating GPS-derived positioning, a second visual state indicating dead-reckoned positioning with a displayed uncertainty radius, and a third visual state indicating that accumulated uncertainty has exceeded a reliability threshold.

**Claim 9.** The system of Claim 2, wherein the positional uncertainty is flagged as unreliable when the uncertainty radius exceeds a configurable maximum threshold, the default maximum being 500 meters.

**Claim 10.** The method of Claim 3, wherein the offline data storage subsystem verification comprises confirming availability of at least one of IndexedDB storage and native device preferences storage, and the synchronization queue verification comprises confirming that queued operations can be serialized and persisted for later batch transmission.

---

## REMARKS

The claimed invention is patent-eligible under 35 U.S.C. § 101 because it is not directed to an abstract idea, but rather to an improvement in the functioning of a mobile device in a specific environment (GPS-denied agricultural fields).

The claims do not merely calculate a position; they apply that calculation to control the specific operation of the device. Specifically, Claim 1 requires [rendering a specific UI state / inhibiting storage operations].

As held in Thales Visionix Inc. v. United States, 850 F.3d 1343 (Fed. Cir. 2017), claims that use inertial sensors to determine orientation and position are patent-eligible when the sensors are used in a specific configuration to improve accuracy. Similarly here, the claimed invention uses inertial sensors to gate the operation of an offline storage queue, providing a specific technical solution to the problem of data integrity during network outages.

---

A system for continuous geographic positioning during GPS signal denial, comprising five interconnected modules implementing sync-gated dead reckoning. A step detection module identifies pedestrian steps via rising-edge accelerometer thresholding with temporal debounce. A complementary filter fuses high-frequency orientation sensor data with low-frequency magnetometer reference for stable heading estimation. An adaptive stride estimation module computes displacement per step from accelerometer peak amplitude. A Kalman-inspired uncertainty model tracks variance accumulation per step, resetting upon GPS recovery. A supervisory controller implements a three-tier fallback chain with activation gated on verification of offline data synchronization infrastructure, ensuring positional data persistence and recoverability.

---

## INCORPORATION BY REFERENCE

The following source code files, maintained under version control in the applicant's repository, are incorporated by reference as part of the technical disclosure:

| Module | File Path | Function |
|--------|-----------|----------|
| Geodesy Engine | `src/lib/dead-reckoning/geodesy.ts` | Spherical displacement computation |
| Step Detector | `src/lib/dead-reckoning/step-detector.ts` | Accelerometer-based pedometry |
| Sensor Fusion | `src/lib/dead-reckoning/sensor-fusion.ts` | Complementary filter heading estimation |
| Adaptive Stride | `src/lib/dead-reckoning/adaptive-stride.ts` | Amplitude-based stride estimation |
| Uncertainty Model | `src/lib/dead-reckoning/uncertainty-model.ts` | Kalman-inspired drift accumulation |
| Public API | `src/lib/dead-reckoning/index.ts` | Module orchestration and exports |
| Integration Hook | `src/hooks/useDeadReckoning.ts` | Multi-tier fallback controller |

---

*End of CIP Application Draft*
