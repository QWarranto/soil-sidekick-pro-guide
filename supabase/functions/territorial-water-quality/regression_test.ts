import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  API_KEY,
  callFn,
  FIXTURES,
  hasApiKey,
  logResult,
  preflight,
} from "../_shared/regression-helpers.ts";

const FN = "territorial-water-quality";
const { fips, county, state } = FIXTURES.houstonGA;

// NOTE: param names are strict — fips_code / state_code / admin_unit_name.
const payload = {
  fips_code: fips,
  state_code: state,
  admin_unit_name: `${county} County`,
};

Deno.test("water: keyless request returns free-tier data", async () => {
  const r = await callFn(FN, payload, "keyless");
  logResult("keyless", r);
  assertEquals(r.status, 200, `keyless water lookup must not 401: ${r.text.slice(0, 200)}`);
  assert(
    r.body?.waterQuality ?? r.body?.water_quality ?? r.body?.data ?? r.body?.success,
    "expected water quality payload",
  );
});

Deno.test("water: anon-key request returns free-tier data", async () => {
  const r = await callFn(FN, payload, "anon");
  logResult("anon", r);
  assertEquals(r.status, 200, `anon water lookup must not 401: ${r.text.slice(0, 200)}`);
});

Deno.test("water: invalid ak_ key is rejected", async () => {
  const r = await callFn(FN, payload, "bad-apikey");
  logResult("bad-apikey", r);
  assertEquals(r.status, 401, "malformed ak_ keys must be rejected");
});

Deno.test({
  name: "water: valid ak_ key returns authenticated-tier data",
  ignore: !hasApiKey,
  fn: async () => {
    const r = await callFn(FN, payload, "apikey");
    logResult(`apikey(${API_KEY.slice(0, 12)}…)`, r);
    assertEquals(r.status, 200, r.text.slice(0, 200));
  },
});

Deno.test("water: rejects wrong param names (contract guard)", async () => {
  const r = await callFn(FN, { county_fips: fips, state: state }, "keyless");
  assert(r.status >= 400, `expected validation error, got ${r.status}`);
});

Deno.test("water: CORS preflight returns 200 with allow-origin", async () => {
  const res = await preflight(FN);
  assertEquals(res.status, 200);
  assert(res.headers.get("Access-Control-Allow-Origin"), "missing allow-origin");
});
