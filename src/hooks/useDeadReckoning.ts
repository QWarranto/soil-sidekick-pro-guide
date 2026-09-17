import { useState, useEffect, useRef, useCallback } from 'react';
import {
  offsetPosition,
  createStepDetectorState,
  processAccelerometerReading,
  recordMagnitudeSample,
  createSensorFusionState,
  updatePrimaryHeading,
  updateSecondaryHeading,
  quaternionToHeading,
  deviceOrientationToHeading,
  createAdaptiveStrideState,
  computeAdaptiveStride,
  createUncertaintyState,
  accumulateStepUncertainty,
  resetUncertaintyFromGPS,
} from '@/lib/dead-reckoning';
import type {
  StepDetectorState,
  SensorFusionState,
  AdaptiveStrideState,
  UncertaintyState,
} from '@/lib/dead-reckoning';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  timestamp: number;
  source: 'gps' | 'dead-reckoning';
}

export interface DeadReckoningState {
  /** Current estimated position (GPS or dead-reckoned) */
  position: GeoPosition | null;
  /** Whether dead-reckoning is actively estimating */
  isEstimating: boolean;
  /** Cumulative drift uncertainty in meters */
  uncertaintyRadius: number;
  /** Seconds since last GPS fix */
  secondsSinceGPSFix: number;
  /** Whether sensors are available */
  sensorsAvailable: boolean;
  /** Step count since DR started */
  stepCount: number;
  /** Current fused heading in degrees (0 = north) */
  heading: number | null;
}

/**
 * Dead Reckoning Hook
 * 
 * Provides continuous positioning by switching between GPS (online)
 * and inertial dead reckoning (offline). Uses:
 * - Complementary filter sensor fusion for heading
 * - Adaptive stride estimation from accelerometer amplitude
 * - Kalman-inspired uncertainty accumulation with GPS reset
 * 
 * Fallback chain: GPS → Sensor DR → Seeded Centroid
 */
export function useDeadReckoning(isOffline: boolean) {
  const [state, setState] = useState<DeadReckoningState>({
    position: null,
    isEstimating: false,
    uncertaintyRadius: 0,
    secondsSinceGPSFix: 0,
    sensorsAvailable: false,
    stepCount: 0,
    heading: null,
  });

  const lastGPSFix = useRef<GeoPosition | null>(null);
  const currentPosition = useRef<{ lat: number; lng: number } | null>(null);
  const gpsFixTime = useRef<number>(Date.now());
  const sensorsActive = useRef(false);
  const accelSensor = useRef<any>(null);
  const orientSensor = useRef<any>(null);
  const gpsWatchId = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Formal sub-system states
  const stepDetector = useRef<StepDetectorState>(createStepDetectorState());
  const sensorFusion = useRef<SensorFusionState>(createSensorFusionState());
  const strideEstimator = useRef<AdaptiveStrideState>(createAdaptiveStrideState());
  const uncertaintyModel = useRef<UncertaintyState>(createUncertaintyState());

  // Acquire GPS position when online
  const acquireGPS = useCallback(() => {
    if (!navigator.geolocation) return;

    if (gpsWatchId.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
    }

    gpsWatchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const gpsPos: GeoPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          source: 'gps',
        };

        lastGPSFix.current = gpsPos;
        currentPosition.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        gpsFixTime.current = Date.now();

        // Reset sub-systems on GPS correction
        stepDetector.current = createStepDetectorState();
        strideEstimator.current = createAdaptiveStrideState();
        resetUncertaintyFromGPS(pos.coords.accuracy, uncertaintyModel.current);

        setState((prev) => ({
          ...prev,
          position: gpsPos,
          isEstimating: false,
          uncertaintyRadius: pos.coords.accuracy,
          secondsSinceGPSFix: 0,
          stepCount: 0,
        }));
      },
      (err) => {
        console.warn('[DeadReckoning] GPS error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }, []);

  // Start sensor listeners for dead-reckoning
  const startSensors = useCallback(() => {
    if (sensorsActive.current) return;

    try {
      // Accelerometer for step detection + adaptive stride
      if ('Accelerometer' in window) {
        const accel = new (window as any).Accelerometer({ frequency: 20 });
        accel.addEventListener('reading', () => {
          const now = Date.now();

          // Feed magnitude to adaptive stride estimator
          const mag = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
          recordMagnitudeSample(mag, strideEstimator.current);

          // Step detection with debounce
          const stepped = processAccelerometerReading(
            accel.x, accel.y, accel.z,
            now,
            stepDetector.current
          );

          if (stepped && currentPosition.current && sensorFusion.current.fusedHeading !== null) {
            // Compute adaptive stride for this step
            const stride = computeAdaptiveStride(strideEstimator.current);

            // Accumulate uncertainty
            const radius = accumulateStepUncertainty(stride, uncertaintyModel.current);

            // Displace position
            const newPos = offsetPosition(
              currentPosition.current.lat,
              currentPosition.current.lng,
              stride,
              sensorFusion.current.fusedHeading
            );
            currentPosition.current = { lat: newPos.latitude, lng: newPos.longitude };

            setState((prev) => ({
              ...prev,
              position: {
                latitude: newPos.latitude,
                longitude: newPos.longitude,
                accuracy: radius,
                timestamp: now,
                source: 'dead-reckoning',
              },
              isEstimating: true,
              uncertaintyRadius: radius,
              stepCount: stepDetector.current.totalSteps,
            }));
          }
        });
        accel.start();
        accelSensor.current = accel;
      }

      // AbsoluteOrientationSensor — primary heading (high-frequency)
      if ('AbsoluteOrientationSensor' in window) {
        const orient = new (window as any).AbsoluteOrientationSensor({ frequency: 10 });
        orient.addEventListener('reading', () => {
          const [qx, qy, qz, qw] = orient.quaternion;
          const heading = quaternionToHeading(qx, qy, qz, qw);
          const fused = updatePrimaryHeading(heading, Date.now(), sensorFusion.current);
          if (fused !== null) {
            setState((prev) => ({ ...prev, heading: fused }));
          }
        });
        orient.start();
        orientSensor.current = orient;
      } else if ('DeviceOrientationEvent' in window) {
        // Fallback: deviceorientation as secondary heading source
        const handleOrientation = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null) {
            const heading = deviceOrientationToHeading(e.alpha);
            updateSecondaryHeading(heading, sensorFusion.current);
            // If no primary, use secondary directly
            if (sensorFusion.current.primaryHeading === null) {
              setState((prev) => ({ ...prev, heading }));
            }
          }
        };
        window.addEventListener('deviceorientation', handleOrientation);
        orientSensor.current = {
          stop: () => window.removeEventListener('deviceorientation', handleOrientation),
        };
      }

      sensorsActive.current = true;
      setState((prev) => ({ ...prev, sensorsAvailable: true }));
    } catch (err) {
      console.warn('[DeadReckoning] Sensor init failed:', err);
      setState((prev) => ({ ...prev, sensorsAvailable: false }));
    }
  }, []);

  const stopSensors = useCallback(() => {
    if (accelSensor.current) {
      accelSensor.current.stop?.();
      accelSensor.current = null;
    }
    if (orientSensor.current) {
      orientSensor.current.stop?.();
      orientSensor.current = null;
    }
    sensorsActive.current = false;
  }, []);

  // Timer to track seconds since last GPS fix
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        secondsSinceGPSFix: Math.floor((Date.now() - gpsFixTime.current) / 1000),
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Switch between GPS and dead-reckoning based on connectivity
  useEffect(() => {
    if (isOffline) {
      if (gpsWatchId.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchId.current);
        gpsWatchId.current = null;
      }
      startSensors();
    } else {
      stopSensors();
      acquireGPS();
      // Reset sub-systems
      stepDetector.current = createStepDetectorState();
      sensorFusion.current = createSensorFusionState();
      strideEstimator.current = createAdaptiveStrideState();
      setState((prev) => ({
        ...prev,
        isEstimating: false,
        stepCount: 0,
      }));
    }

    return () => {
      stopSensors();
      if (gpsWatchId.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchId.current);
      }
    };
  }, [isOffline, startSensors, stopSensors, acquireGPS]);

  /** Manually seed a position (e.g. from county centroid) — Tier 3 fallback */
  const seedPosition = useCallback((lat: number, lng: number, accuracy = 5000) => {
    currentPosition.current = { lat, lng };
    gpsFixTime.current = Date.now();
    resetUncertaintyFromGPS(accuracy, uncertaintyModel.current);

    const pos: GeoPosition = {
      latitude: lat,
      longitude: lng,
      accuracy,
      timestamp: Date.now(),
      source: 'gps',
    };
    lastGPSFix.current = pos;
    setState((prev) => ({
      ...prev,
      position: pos,
      uncertaintyRadius: accuracy,
      secondsSinceGPSFix: 0,
    }));
  }, []);

  return {
    ...state,
    seedPosition,
    lastGPSFix: lastGPSFix.current,
  };
}
