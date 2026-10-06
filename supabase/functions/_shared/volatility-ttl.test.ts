import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { computeVolatilityTTL, coefficientOfVariation } from "./volatility-ttl.ts";
const H = 3_600_000;
Deno.test("stable data keeps base TTL", () => assertEquals(computeVolatilityTTL(24*H, H, 0.75, 0), 24*H));
Deno.test("formula base*(1-a*v)", () => assertEquals(computeVolatilityTTL(24*H, H, 0.75, 0.5), 15*H));
Deno.test("min_ttl floor applies", () => assertEquals(computeVolatilityTTL(24*H, 8*H, 1, 1), 8*H));
Deno.test("volatility clamped", () => assertEquals(computeVolatilityTTL(24*H, H, 0.5, 5), 12*H));
Deno.test("CV zero for constant", () => assertEquals(coefficientOfVariation([2,2,2]), 0));
