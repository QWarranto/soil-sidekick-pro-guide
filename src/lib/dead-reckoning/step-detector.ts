/**
 * Pedometer / Step Detection Module
 * 
 * Implements a rising-edge threshold detector on accelerometer magnitude.
 * When the magnitude crosses a configurable threshold from below, a step
 * is registered. Includes debounce logic to prevent false positives from
 * high-frequency vibrations.
 * 
 * Patent CIP Reference: Inertial Step Detection via Accelerometer Thresholding
 */

export interface StepDetectorConfig {
  /** Magnitude threshold for step detection (m/s², default 11.5) */
  threshold: number;
  /** Minimum interval between steps in ms (default 250ms = 4 steps/sec max) */
  minStepIntervalMs: number;
}

export const DEFAULT_STEP_CONFIG: StepDetectorConfig = {
  threshold: 11.5,
  minStepIntervalMs: 250,
};

export interface StepDetectorState {
  previousMagnitude: number;
  lastStepTimestamp: number;
  totalSteps: number;
}

export function createStepDetectorState(): StepDetectorState {
  return {
    previousMagnitude: 0,
    lastStepTimestamp: 0,
    totalSteps: 0,
  };
}

/**
 * Process a new accelerometer reading and determine if a step occurred.
 * 
 * Detection algorithm:
 * 1. Compute vector magnitude: √(x² + y² + z²)
 * 2. Check rising-edge: previous < threshold AND current ≥ threshold
 * 3. Apply debounce: elapsed time since last step ≥ minStepIntervalMs
 * 
 * @param ax - Accelerometer X axis (m/s²)
 * @param ay - Accelerometer Y axis (m/s²)
 * @param az - Accelerometer Z axis (m/s²)
 * @param timestamp - Current reading timestamp (ms)
 * @param state - Mutable detector state
 * @param config - Detection parameters
 * @returns true if a step was detected
 */
export function processAccelerometerReading(
  ax: number,
  ay: number,
  az: number,
  timestamp: number,
  state: StepDetectorState,
  config: StepDetectorConfig = DEFAULT_STEP_CONFIG
): boolean {
  const magnitude = Math.sqrt(ax * ax + ay * ay + az * az);
  const isRisingEdge = state.previousMagnitude < config.threshold && magnitude >= config.threshold;
  const debounceOk = (timestamp - state.lastStepTimestamp) >= config.minStepIntervalMs;

  state.previousMagnitude = magnitude;

  if (isRisingEdge && debounceOk) {
    state.lastStepTimestamp = timestamp;
    state.totalSteps += 1;
    return true;
  }

  return false;
}
