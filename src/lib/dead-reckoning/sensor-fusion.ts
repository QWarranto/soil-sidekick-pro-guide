/**
 * Sensor Fusion Module — Complementary Filter
 * 
 * Fuses orientation data from multiple sensor sources using a weighted
 * complementary filter. This approach blends high-frequency gyroscope
 * (or AbsoluteOrientationSensor) data with low-frequency magnetometer
 * (or DeviceOrientation) data to produce a stable heading estimate
 * resistant to both gyroscope drift and magnetic interference.
 * 
 * The complementary filter is defined as:
 *   heading_fused = α × heading_gyro + (1 − α) × heading_mag
 * 
 * where α (typically 0.95–0.98) weights the gyroscope-derived heading
 * for short-term accuracy, while the magnetometer provides long-term
 * absolute reference.
 * 
 * Patent CIP Reference: Complementary Filter Sensor Fusion for Heading Estimation
 */

export interface SensorFusionConfig {
  /** Complementary filter weight for high-frequency source (0–1, default 0.96) */
  alpha: number;
  /** Minimum heading change to propagate (degrees, default 0.5) */
  headingDeadband: number;
}

export const DEFAULT_FUSION_CONFIG: SensorFusionConfig = {
  alpha: 0.96,
  headingDeadband: 0.5,
};

export interface SensorFusionState {
  /** Fused heading in degrees (0 = north, clockwise) */
  fusedHeading: number | null;
  /** Last raw heading from primary source (orientation sensor) */
  primaryHeading: number | null;
  /** Last raw heading from secondary source (deviceorientation / magnetometer) */
  secondaryHeading: number | null;
  /** Whether fusion has been initialized with at least one reading */
  initialized: boolean;
  /** Timestamp of last fusion update */
  lastUpdateMs: number;
}

export function createSensorFusionState(): SensorFusionState {
  return {
    fusedHeading: null,
    primaryHeading: null,
    secondaryHeading: null,
    initialized: false,
    lastUpdateMs: 0,
  };
}

/**
 * Normalize an angle to [0, 360) range.
 */
function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the shortest angular difference between two headings.
 * Returns a value in [-180, 180].
 */
function angularDifference(a: number, b: number): number {
  let diff = normalizeAngle(a) - normalizeAngle(b);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

/**
 * Update the fused heading from the primary (high-frequency) source.
 * 
 * When only the primary source is available, the fused heading tracks
 * it directly. When both sources are available, the complementary
 * filter blends them.
 * 
 * @param rawHeadingDeg - Heading from primary sensor (degrees)
 * @param timestamp - Reading timestamp (ms)
 * @param state - Mutable fusion state
 * @param config - Filter parameters
 * @returns Updated fused heading in degrees, or null if below deadband
 */
export function updatePrimaryHeading(
  rawHeadingDeg: number,
  timestamp: number,
  state: SensorFusionState,
  config: SensorFusionConfig = DEFAULT_FUSION_CONFIG
): number | null {
  const heading = normalizeAngle(rawHeadingDeg);
  state.primaryHeading = heading;
  state.lastUpdateMs = timestamp;

  if (!state.initialized) {
    state.fusedHeading = heading;
    state.initialized = true;
    return heading;
  }

  if (state.secondaryHeading !== null) {
    // Complementary filter: blend primary (gyro/orientation) with secondary (mag)
    const diff = angularDifference(heading, state.secondaryHeading);
    state.fusedHeading = normalizeAngle(
      state.secondaryHeading + config.alpha * diff
    );
  } else {
    state.fusedHeading = heading;
  }

  return state.fusedHeading;
}

/**
 * Update the secondary (low-frequency / magnetometer) heading.
 * This corrects long-term drift in the primary sensor.
 */
export function updateSecondaryHeading(
  rawHeadingDeg: number,
  state: SensorFusionState
): void {
  state.secondaryHeading = normalizeAngle(rawHeadingDeg);

  // If primary hasn't initialized yet, seed from secondary
  if (!state.initialized) {
    state.fusedHeading = state.secondaryHeading;
    state.initialized = true;
  }
}

/**
 * Extract heading from a quaternion (AbsoluteOrientationSensor).
 * Converts quaternion [x, y, z, w] to yaw (heading) in degrees.
 */
export function quaternionToHeading(qx: number, qy: number, qz: number, qw: number): number {
  const yaw = Math.atan2(
    2 * (qw * qz + qx * qy),
    1 - 2 * (qy * qy + qz * qz)
  );
  return normalizeAngle(yaw * (180 / Math.PI));
}

/**
 * Convert DeviceOrientationEvent alpha to compass heading.
 * alpha is measured clockwise from north on most devices.
 */
export function deviceOrientationToHeading(alpha: number): number {
  return normalizeAngle(360 - alpha);
}
