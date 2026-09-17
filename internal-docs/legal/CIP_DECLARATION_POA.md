# DECLARATION AND POWER OF ATTORNEY

## For Continuation-in-Part Patent Application

---

**Application Title:** "Inertial Dead Reckoning System with Complementary Sensor Fusion, Adaptive Stride Estimation, and Kalman-Inspired Uncertainty Propagation for Geographic Positioning During GPS Signal Denial"

**Filing Type:** Continuation-in-Part (CIP)  
**Parent Application:** U.S. Patent Application No. 19/320,727  
**Parent Filing Date:** September 5, 2025  
**Parent Title:** "System and Method for AI-Powered Soil Analysis with Offline-First Architecture"

---

## DECLARATION

As the below-named inventor(s), I/we hereby declare that:

### 1. Inventorship

I/we believe I am/we are the original and first inventor(s) of the subject matter which is claimed and for which a patent is sought in the above-identified application.

### 2. Review of Application

I/we have reviewed and understand the contents of the above-identified application, including the claims, as amended by any amendment specifically referred to herein.

### 3. Duty of Disclosure

I/we acknowledge the duty to disclose to the United States Patent and Trademark Office all information known to be material to patentability as defined in 37 C.F.R. § 1.56, including:

- Prior art references known to the inventor(s);
- Any information that is material to the examination of this application; and
- Any related applications or proceedings.

### 4. New Matter Disclosure

I/we declare that this continuation-in-part application contains new matter not disclosed in the parent application (U.S. App. No. 19/320,727), specifically:

**(a)** A spherical geodesy displacement engine computing destination coordinates via Vincenty-style direct formula on a spherical Earth model;

**(b)** An inertial step detection module using rising-edge accelerometer thresholding (T = 11.5 m/s²) with temporal debounce (250 ms minimum inter-step interval);

**(c)** A complementary filter sensor fusion module (α = 0.96) combining AbsoluteOrientationSensor quaternion data with magnetometer-derived compass heading, and in alternative embodiments, an Extended Kalman Filter (EKF) fusing GPS fixes with step-displacement measurements;

**(d)** An adaptive stride estimation module computing displacement per step from accelerometer peak amplitude with exponential moving average smoothing;

**(e)** A Kalman-inspired positional uncertainty model with variance propagation (σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise²) and GPS-triggered reset;

**(f)** A multi-tier adaptive positioning fallback chain (GPS → Sensor Dead Reckoning → Seeded Centroid) with infrastructure-gated activation conditioned on verification of the offline data synchronization subsystem.

### 5. Priority Claim

I/we claim the benefit of the filing date of the parent application (September 5, 2025) for subject matter disclosed therein, and claim the filing date of this application for the new matter identified in Section 4 above.

### 6. Prior Applications

The following prior applications are related to this application:

| Application No. | Filing Date | Relationship | Status |
|-----------------|-------------|--------------|--------|
| 19/320,727 | September 5, 2025 | Parent (CIP basis) | Pending |

### 7. Statements Under 37 C.F.R. § 1.63

I/we declare that all statements made herein of my/our own knowledge are true and that all statements made on information and belief are believed to be true; and further that these statements were made with the knowledge that willful false statements and the like so made are punishable by fine or imprisonment, or both, under 18 U.S.C. § 1001, and that such willful false statements may jeopardize the validity of the application or any patent issued thereon.

---

## POWER OF ATTORNEY

### Appointment of Attorney(s) or Agent(s)

I/we hereby appoint the following attorney(s) and/or agent(s) to prosecute this application and to transact all business in the United States Patent and Trademark Office connected therewith:

**Attorney/Agent Name:** ____________________________________

**Registration Number:** ____________________________________

**Firm Name:** ____________________________________

**Address:**  
____________________________________  
____________________________________  
____________________________________

**Telephone:** ____________________________________

**Email:** ____________________________________

### Scope of Authority

The appointed attorney(s)/agent(s) is/are authorized to:

1. File, prosecute, and maintain the above-identified application;
2. Receive and respond to all correspondence from the USPTO;
3. File amendments, responses, and other papers as necessary;
4. Pay all required fees;
5. File continuation, divisional, or continuation-in-part applications;
6. File appeals and petitions;
7. Take any and all actions necessary to advance prosecution of this application to issuance.

### Revocation of Prior Powers

All previous powers of attorney granted in connection with this application, if any, are hereby revoked.

---

## INVENTOR SIGNATURE(S)

### Inventor 1

**Full Legal Name:** ____________________________________

**Residence (City, State, Country):** ____________________________________

**Mailing Address:**  
____________________________________  
____________________________________  
____________________________________

**Citizenship:** ____________________________________

**Signature:** ____________________________________

**Date:** ____________________________________

---

### Inventor 2 *(if applicable)*

**Full Legal Name:** ____________________________________

**Residence (City, State, Country):** ____________________________________

**Mailing Address:**  
____________________________________  
____________________________________  
____________________________________

**Citizenship:** ____________________________________

**Signature:** ____________________________________

**Date:** ____________________________________

---

## CORRESPONDENCE ADDRESS

Please direct all correspondence to:

**Name:** ____________________________________

**Address:**  
____________________________________  
____________________________________  
____________________________________

**Telephone:** ____________________________________

**Fax:** ____________________________________

**Email:** ____________________________________

---

*This Declaration and Power of Attorney is submitted in compliance with 37 C.F.R. §§ 1.63 and 1.32.*

*End of Declaration and Power of Attorney*
