/**
 * Adaptive Stride Estimation Module
 * 
 * Dynamically estimates stride length based on accelerometer signal
 * characteristics. Rather than using a fixed stride length, this module
 * analyzes the peak-to-peak amplitude of each detected step to infer
 * walking speed and adjust the displacement per step accordingly.
 * 
 * The estimation model is:
 *   stride_m = baseStride + scaleFactor × (peakMagnitude − restMagnitude)
 * 
 * This accounts for the biomechanical relationship between step force
 * (reflected in accelerometer magnitude peaks) and stride length:
 * faster walking produces both higher peaks and longer strides.
 * 
 * Patent CIP Reference: Adaptive Stride Estimation via Accelerometer Amplitude Analysis
 */

export interface AdaptiveStrideConfig {
  /** Base stride length in meters (minimum stride, ~slow walk) */
  baseStride: number;
  /** Scale factor mapping excess magnitude to additional stride length */
  scaleFactor: number;
  /** Resting accelerometer magnitude (gravity ≈ 9.81 m/s²) */
  restMagnitude: number;
  /** Maximum plausible stride in meters (cap for safety) */
  maxStride: number;
  /** Minimum plausible stride in meters */
  minStride: number;
  /** Exponential moving average weight for smoothing (0–1) */
  smoothingAlpha: number;
}

export const DEFAULT_STRIDE_CONFIG: AdaptiveStrideConfig = {
  baseStride: 0.55,
  scaleFactor: 0.12,
  restMagnitude: 9.81,
  maxStride: 1.2,
  minStride: 0.3,
  smoothingAlpha: 0.3,
};

export interface AdaptiveStrideState {
  /** Current smoothed stride estimate in meters */
  currentStride: number;
  /** Number of samples used for estimation */
  sampleCount: number;
  /** Running peak magnitude for current step cycle */
  cyclePeakMagnitude: number;
}

export function createAdaptiveStrideState(config: AdaptiveStrideConfig = DEFAULT_STRIDE_CONFIG): AdaptiveStrideState {
  return {
    currentStride: config.baseStride,
    sampleCount: 0,
    cyclePeakMagnitude: config.restMagnitude,
  };
}

/**
 * Record an accelerometer magnitude sample during the current step cycle.
 * Tracks the peak magnitude between steps.
 */
export function recordMagnitudeSample(
  magnitude: number,
  state: AdaptiveStrideState
): void {
  if (magnitude > state.cyclePeakMagnitude) {
    state.cyclePeakMagnitude = magnitude;
  }
}

/**
 * Compute the adaptive stride length when a step is detected.
 * Resets the cycle peak for the next step.
 * 
 * @returns Estimated stride length in meters for this step
 */
export function computeAdaptiveStride(
  state: AdaptiveStrideState,
  config: AdaptiveStrideConfig = DEFAULT_STRIDE_CONFIG
): number {
  const excessMagnitude = Math.max(0, state.cyclePeakMagnitude - config.restMagnitude);
  const rawStride = config.baseStride + config.scaleFactor * excessMagnitude;
  const clampedStride = Math.max(config.minStride, Math.min(config.maxStride, rawStride));

  // Exponential moving average for smoothing
  state.currentStride =
    config.smoothingAlpha * clampedStride +
    (1 - config.smoothingAlpha) * state.currentStride;

  state.sampleCount += 1;
  state.cyclePeakMagnitude = config.restMagnitude; // reset for next cycle

  return state.currentStride;
}
