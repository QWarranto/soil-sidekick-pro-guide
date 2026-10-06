/**
 * Volatility-adaptive cache expiration.
 *
 *   ttl = max(min_ttl, base_ttl × (1 − α × volatility))
 *
 * - volatility is normalized to [0, 1] (0 = stable data, 1 = highly volatile)
 * - α (alpha) is a tunable sensitivity coefficient in [0, 1]
 * - min_ttl is a floor so highly volatile data is never refetched on every call
 *
 * The computed TTL is stored as the cache entry's expiration timestamp; once that
 * timestamp passes, the entry is treated as expired and refreshed from the source.
 */

export interface VolatilityTTLConfig {
  baseTtlMs: number;
  minTtlMs: number;
  alpha: number;
  /** Returns a volatility score for freshly fetched data; clamped to [0, 1]. */
  volatilityOf: (data: any) => number;
}

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

export function computeVolatilityTTL(
  baseTtlMs: number,
  minTtlMs: number,
  alpha: number,
  volatility: number,
): number {
  const a = clamp01(alpha);
  const v = clamp01(volatility);
  return Math.round(Math.max(minTtlMs, baseTtlMs * (1 - a * v)));
}

/** Coefficient of variation of a numeric series, normalized to [0, 1]. */
export function coefficientOfVariation(values: number[]): number {
  const xs = values.filter((x) => Number.isFinite(x));
  if (xs.length < 2) return 0;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  if (mean === 0) return 0;
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
  return clamp01(Math.sqrt(variance) / Math.abs(mean));
}

/**
 * Volatility of water-quality measurements: blends how close contaminants run
 * to their regulatory limits with the spread of the measured values.
 */
export function waterQualityVolatility(data: any): number {
  const contaminants: any[] = data?.contaminants ?? [];
  if (!contaminants.length) return 0;
  const nearLimit = contaminants.filter(
    (c) => c?.mcl > 0 && Number(c.level) >= 0.5 * Number(c.mcl),
  ).length / contaminants.length;
  const ratios = contaminants
    .filter((c) => c?.mcl > 0)
    .map((c) => Number(c.level) / Number(c.mcl));
  return clamp01(0.6 * nearLimit + 0.4 * coefficientOfVariation(ratios));
}
