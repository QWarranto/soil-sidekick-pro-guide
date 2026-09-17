/**
 * Positional Uncertainty / Drift Model
 * 
 * Models the growth of positional uncertainty during dead reckoning
 * using a Kalman-inspired linear accumulation with per-step variance.
 * 
 * The uncertainty model is:
 *   σ²(n) = σ²(n-1) + (stride × driftRate)² + processNoise²
 *   uncertainty(n) = √σ²(n)
 * 
 * When a GPS fix is acquired, uncertainty is reset to the GPS accuracy.
 * This provides a formal, monotonically increasing confidence bound
 * that accurately reflects positioning degradation over time.
 * 
 * Patent CIP Reference: Kalman-Inspired Linear Drift Model with GPS Correction
 */

export interface UncertaintyConfig {
  /** Fractional drift per step (0.15 = 15% of stride adds to uncertainty) */
  driftRatePerStep: number;
  /** Process noise per step in meters (accounts for heading errors) */
  processNoisePerStep: number;
  /** Maximum uncertainty before DR is considered unreliable (meters) */
  maxUncertaintyM: number;
}

export const DEFAULT_UNCERTAINTY_CONFIG: UncertaintyConfig = {
  driftRatePerStep: 0.15,
  processNoisePerStep: 0.05,
  maxUncertaintyM: 500,
};

export interface UncertaintyState {
  /** Current variance (σ²) in meters² */
  variance: number;
  /** Current uncertainty radius (σ) in meters */
  radius: number;
  /** Whether DR is considered unreliable */
  unreliable: boolean;
}

export function createUncertaintyState(initialAccuracyM: number = 0): UncertaintyState {
  return {
    variance: initialAccuracyM * initialAccuracyM,
    radius: initialAccuracyM,
    unreliable: false,
  };
}

/**
 * Accumulate uncertainty for one dead-reckoned step.
 * 
 * @param strideM - The stride length used for this step (meters)
 * @param state - Mutable uncertainty state
 * @param config - Drift model parameters
 * @returns Updated uncertainty radius in meters
 */
export function accumulateStepUncertainty(
  strideM: number,
  state: UncertaintyState,
  config: UncertaintyConfig = DEFAULT_UNCERTAINTY_CONFIG
): number {
  const stepVariance = (strideM * config.driftRatePerStep) ** 2;
  const processVariance = config.processNoisePerStep ** 2;

  state.variance += stepVariance + processVariance;
  state.radius = Math.sqrt(state.variance);
  state.unreliable = state.radius >= config.maxUncertaintyM;

  return state.radius;
}

/**
 * Reset uncertainty upon receiving a GPS fix.
 * The variance is set to the GPS accuracy squared.
 */
export function resetUncertaintyFromGPS(
  gpsAccuracyM: number,
  state: UncertaintyState
): void {
  state.variance = gpsAccuracyM * gpsAccuracyM;
  state.radius = gpsAccuracyM;
  state.unreliable = false;
}
