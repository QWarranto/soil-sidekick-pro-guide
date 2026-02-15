import { useState, useEffect, useRef, useCallback } from 'react';

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
  /** Current heading in degrees (0 = north) */
  heading: number | null;
}

interface SensorReading {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

const STEP_LENGTH_METERS = 0.75; // average stride length
const DRIFT_RATE_PER_STEP = 0.15; // ~15% drift per step (conservative)
const EARTH_RADIUS_M = 6_371_000;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Offset a lat/lng by a distance and bearing.
 * Uses Vincenty-style direct formula (spherical approximation).
 */
function offsetPosition(
  lat: number,
  lng: number,
  distanceM: number,
  bearingDeg: number
): { latitude: number; longitude: number } {
  const bearingRad = bearingDeg * DEG_TO_RAD;
  const latRad = lat * DEG_TO_RAD;
  const lngRad = lng * DEG_TO_RAD;
  const angularDist = distanceM / EARTH_RADIUS_M;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDist) +
    Math.cos(latRad) * Math.sin(angularDist) * Math.cos(bearingRad)
  );
  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDist) * Math.cos(latRad),
      Math.cos(angularDist) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  return {
    latitude: newLatRad * RAD_TO_DEG,
    longitude: newLngRad * RAD_TO_DEG,
  };
}

/**
 * Simple pedometer: detects a step when accelerometer magnitude
 * crosses a threshold on a rising edge.
 */
function detectStep(
  current: number,
  previous: number,
  threshold = 11.5
): boolean {
  return previous < threshold && current >= threshold;
}

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
  const prevAccelMag = useRef(0);
  const stepCount = useRef(0);
  const uncertainty = useRef(0);
  const heading = useRef<number | null>(null);
  const gpsFixTime = useRef<number>(Date.now());
  const sensorsActive = useRef(false);
  const accelSensor = useRef<any>(null);
  const orientSensor = useRef<any>(null);
  const gpsWatchId = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Acquire GPS position when online
  const acquireGPS = useCallback(() => {
    if (!navigator.geolocation) return;

    // Clear existing watch
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
        stepCount.current = 0;
        uncertainty.current = pos.coords.accuracy;

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
      // Accelerometer for step detection
      if ('Accelerometer' in window) {
        const accel = new (window as any).Accelerometer({ frequency: 20 });
        accel.addEventListener('reading', () => {
          const mag = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);

          if (detectStep(mag, prevAccelMag.current) && currentPosition.current && heading.current !== null) {
            stepCount.current += 1;
            uncertainty.current += STEP_LENGTH_METERS * DRIFT_RATE_PER_STEP;

            const newPos = offsetPosition(
              currentPosition.current.lat,
              currentPosition.current.lng,
              STEP_LENGTH_METERS,
              heading.current
            );
            currentPosition.current = { lat: newPos.latitude, lng: newPos.longitude };

            setState((prev) => ({
              ...prev,
              position: {
                latitude: newPos.latitude,
                longitude: newPos.longitude,
                accuracy: uncertainty.current,
                timestamp: Date.now(),
                source: 'dead-reckoning',
              },
              isEstimating: true,
              uncertaintyRadius: uncertainty.current,
              stepCount: stepCount.current,
            }));
          }

          prevAccelMag.current = mag;
        });
        accel.start();
        accelSensor.current = accel;
      }

      // AbsoluteOrientationSensor or magnetometer for heading
      if ('AbsoluteOrientationSensor' in window) {
        const orient = new (window as any).AbsoluteOrientationSensor({ frequency: 10 });
        orient.addEventListener('reading', () => {
          // Quaternion to euler heading
          const [qx, qy, qz, qw] = orient.quaternion;
          const yaw = Math.atan2(
            2 * (qw * qz + qx * qy),
            1 - 2 * (qy * qy + qz * qz)
          );
          const headingDeg = ((yaw * RAD_TO_DEG) + 360) % 360;
          heading.current = headingDeg;
          setState((prev) => ({ ...prev, heading: headingDeg }));
        });
        orient.start();
        orientSensor.current = orient;
      } else if ('DeviceOrientationEvent' in window) {
        // Fallback: deviceorientation (compass heading)
        const handleOrientation = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null) {
            // alpha is compass heading on some devices
            const h = (360 - e.alpha) % 360;
            heading.current = h;
            setState((prev) => ({ ...prev, heading: h }));
          }
        };
        window.addEventListener('deviceorientation', handleOrientation);
        orientSensor.current = { stop: () => window.removeEventListener('deviceorientation', handleOrientation) };
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
      // Go offline: stop GPS watch, start sensors
      if (gpsWatchId.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchId.current);
        gpsWatchId.current = null;
      }
      startSensors();
    } else {
      // Back online: stop sensors, re-acquire GPS
      stopSensors();
      acquireGPS();
      stepCount.current = 0;
      uncertainty.current = 0;
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

  /** Manually seed a position (e.g. from county centroid) */
  const seedPosition = useCallback((lat: number, lng: number, accuracy = 5000) => {
    currentPosition.current = { lat, lng };
    gpsFixTime.current = Date.now();
    uncertainty.current = accuracy;

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
