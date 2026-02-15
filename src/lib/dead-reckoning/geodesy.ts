/**
 * Geodesy Utilities for Dead Reckoning
 * 
 * Spherical-Earth displacement calculations using the Vincenty-style
 * direct formula. Used to project a new lat/lng from a starting point
 * given a distance (meters) and bearing (degrees from true north).
 * 
 * Patent CIP Reference: Displacement Computation via Spherical Geodesy
 */

const EARTH_RADIUS_M = 6_371_000;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export { DEG_TO_RAD, RAD_TO_DEG, EARTH_RADIUS_M };

/**
 * Offset a geographic position by a given distance and bearing.
 * 
 * Uses the spherical law of cosines (Vincenty direct approximation)
 * to compute the destination point from a start lat/lng.
 * 
 * @param lat  - Starting latitude in decimal degrees
 * @param lng  - Starting longitude in decimal degrees
 * @param distanceM - Displacement distance in meters
 * @param bearingDeg - Bearing in degrees (0 = true north, clockwise)
 * @returns New latitude and longitude in decimal degrees
 */
export function offsetPosition(
  lat: number,
  lng: number,
  distanceM: number,
  bearingDeg: number
): { latitude: number; longitude: number } {
  const bearingRad = bearingDeg * DEG_TO_RAD;
  const latRad = lat * DEG_TO_RAD;
  const lngRad = lng * DEG_TO_RAD;
  const angularDist = distanceM / EARTH_RADIUS_M;

  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinAngDist = Math.sin(angularDist);
  const cosAngDist = Math.cos(angularDist);

  const newLatRad = Math.asin(
    sinLat * cosAngDist +
    cosLat * sinAngDist * Math.cos(bearingRad)
  );
  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * sinAngDist * cosLat,
      cosAngDist - sinLat * Math.sin(newLatRad)
    );

  return {
    latitude: newLatRad * RAD_TO_DEG,
    longitude: newLngRad * RAD_TO_DEG,
  };
}
