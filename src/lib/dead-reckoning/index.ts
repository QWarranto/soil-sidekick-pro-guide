/**
 * Dead Reckoning Module — Public API
 * 
 * Inertial navigation system for estimating device position when GPS
 * is unavailable. Combines step detection, adaptive stride estimation,
 * complementary-filter sensor fusion, and Kalman-inspired uncertainty
 * modeling to provide continuous positioning with quantified confidence.
 * 
 * Adaptive Positioning Fallback Chain:
 *   Tier 1: GPS (live fix) — highest accuracy
 *   Tier 2: Sensor-based Dead Reckoning — IMU step + heading fusion
 *   Tier 3: Seeded Centroid — county/region centroid fallback
 * 
 * Patent CIP Reference: Multi-Tier Adaptive Positioning System
 */

export { offsetPosition, EARTH_RADIUS_M, DEG_TO_RAD, RAD_TO_DEG } from './geodesy';

export {
  type StepDetectorConfig,
  type StepDetectorState,
  DEFAULT_STEP_CONFIG,
  createStepDetectorState,
  processAccelerometerReading,
} from './step-detector';

export {
  type SensorFusionConfig,
  type SensorFusionState,
  DEFAULT_FUSION_CONFIG,
  createSensorFusionState,
  updatePrimaryHeading,
  updateSecondaryHeading,
  quaternionToHeading,
  deviceOrientationToHeading,
} from './sensor-fusion';

export {
  type AdaptiveStrideConfig,
  type AdaptiveStrideState,
  DEFAULT_STRIDE_CONFIG,
  createAdaptiveStrideState,
  recordMagnitudeSample,
  computeAdaptiveStride,
} from './adaptive-stride';

export {
  type UncertaintyConfig,
  type UncertaintyState,
  DEFAULT_UNCERTAINTY_CONFIG,
  createUncertaintyState,
  accumulateStepUncertainty,
  resetUncertaintyFromGPS,
} from './uncertainty-model';
