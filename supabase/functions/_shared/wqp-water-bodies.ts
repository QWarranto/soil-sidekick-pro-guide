/**
 * Real-time EPA Water Quality Portal (WQP) surface-water feed for the
 * environmental impact engine. Results are cached with volatility-adaptive
 * expiration and refreshed from WQP once the stored expiration passes.
 */
import { APICacheManager } from './api-cache-manager.ts';
import { coefficientOfVariation } from './volatility-ttl.ts';

export const WQP_WATER_BODY_TTL = {
  baseTtlMs: 24 * 60 * 60 * 1000, // 24h
  minTtlMs: 60 * 60 * 1000,       // 1h floor
  alpha: 0.75,
};

export interface WaterBodyData {
  source: 'EPA_WQP';
  distance_miles: number;
  distance_method: 'field_coordinates' | 'station_density';
  surface_water_station_count: number;
  nutrient_samples: number;
  mean_nitrate_mg_l: number | null;
  mean_phosphorus_mg_l: number | null;
  nutrient_values: number[];
  retrieved_at: string;
}

const SURFACE_TYPES = ['Stream', 'Lake, Reservoir, Impoundment', 'Estuary', 'Wetland'];

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8, r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchJson(url: string, timeoutMs: number): Promise<any[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`WQP responded ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : [];
}

async function fetchFromWQP(countyFips: string): Promise<Omit<WaterBodyData, 'distance_miles' | 'distance_method'> & { stations: { lat: number; lon: number }[] }> {
  const state = countyFips.slice(0, 2), county = countyFips.slice(2);
  const types = SURFACE_TYPES.map((t) => `siteType=${encodeURIComponent(t)}`).join('&');
  const stationsRaw = await fetchJson(
    `https://www.waterqualitydata.us/data/Station/search?countrycode=US&statecode=US:${state}&countycode=US:${state}:${county}&${types}&mimeType=json&zip=no`,
    12000,
  );
  const stations = stationsRaw
    .map((s: any) => ({ id: s.MonitoringLocationIdentifier, lat: Number(s.LatitudeMeasure), lon: Number(s.LongitudeMeasure) }))
    .filter((s) => s.id && Number.isFinite(s.lat) && Number.isFinite(s.lon));

  let nitrate: number[] = [], phosphorus: number[] = [];
  const ids = stations.slice(0, 10).map((s) => s.id);
  if (ids.length) {
    const year = new Date().getUTCFullYear() - 3;
    const results = await fetchJson(
      `https://www.waterqualitydata.us/data/Result/search?siteid=${ids.map(encodeURIComponent).join(';')}&characteristicName=Nitrate&characteristicName=Phosphorus&startDateLo=01-01-${year}&mimeType=json&zip=no&sorted=no`,
      15000,
    ).catch(() => []);
    for (const r of results) {
      const v = parseFloat(r.ResultMeasureValue);
      if (!Number.isFinite(v)) continue;
      if (r.CharacteristicName === 'Nitrate') nitrate.push(v);
      else if (r.CharacteristicName === 'Phosphorus') phosphorus.push(v);
    }
  }
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  return {
    source: 'EPA_WQP',
    surface_water_station_count: stations.length,
    nutrient_samples: nitrate.length + phosphorus.length,
    mean_nitrate_mg_l: mean(nitrate),
    mean_phosphorus_mg_l: mean(phosphorus),
    nutrient_values: [...nitrate, ...phosphorus].slice(0, 500),
    retrieved_at: new Date().toISOString(),
    stations: stations.map(({ lat, lon }) => ({ lat, lon })),
  };
}

/** County-level proximity from station spread when no field coordinates exist. */
function densityDistance(stations: { lat: number; lon: number }[]): number {
  if (stations.length < 2) return 6.5;
  const lats = stations.map((s) => s.lat), lons = stations.map((s) => s.lon);
  const h = haversineMiles(Math.min(...lats), Math.min(...lons), Math.max(...lats), Math.min(...lons));
  const w = haversineMiles(Math.min(...lats), Math.min(...lons), Math.min(...lats), Math.max(...lons));
  const areaPerStation = Math.max(h * w, 1) / stations.length;
  return Math.max(0.1, 0.5 * Math.sqrt(areaPerStation));
}

export async function getWaterBodyData(
  cache: APICacheManager,
  countyFips: string,
  coords?: { latitude?: number; longitude?: number },
): Promise<{ data: WaterBodyData; fromCache: boolean; cacheLevel: string }> {
  const { data: raw, fromCache, cacheLevel } = await cache.getOrFetch(
    {
      provider: 'EPA_WQP',
      key: `surface_water_${countyFips}`,
      countyFips,
      ttl: WQP_WATER_BODY_TTL.baseTtlMs,
      staleWhileRevalidate: true,
      volatility: {
        ...WQP_WATER_BODY_TTL,
        volatilityOf: (d: any) => coefficientOfVariation(d?.nutrient_values ?? []),
      },
    },
    () => fetchFromWQP(countyFips),
  );

  const stations: { lat: number; lon: number }[] = (raw as any).stations ?? [];
  const lat = Number(coords?.latitude), lon = Number(coords?.longitude);
  let distance_miles: number, distance_method: WaterBodyData['distance_method'];
  if (Number.isFinite(lat) && Number.isFinite(lon) && stations.length) {
    distance_miles = Math.min(...stations.map((s) => haversineMiles(lat, lon, s.lat, s.lon)));
    distance_method = 'field_coordinates';
  } else {
    distance_miles = densityDistance(stations);
    distance_method = 'station_density';
  }
  const { stations: _s, ...rest } = raw as any;
  return {
    data: { ...rest, distance_miles: Number(distance_miles.toFixed(2)), distance_method },
    fromCache,
    cacheLevel,
  };
}
