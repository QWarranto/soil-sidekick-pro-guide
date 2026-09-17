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

const FN = "multi-parameter-planting-calendar";
const { fips, county, state } = FIXTURES.rockdaleGA;

// NOTE: param name is crop_type (not `crop`).
const payload = {
  crop_type: "soybeans",
  county_fips: fips,
  county_name: county,
  state_code: state,
};

Deno.test("calendar: keyless request returns free-tier windows", async () => {
  const r = await callFn(FN, payload, "keyless");
  logResult("keyless", r);
  assertEquals(r.status, 200, `keyless calendar must not 401/500: ${r.text.slice(0, 200)}`);
  assert(r.body, "expected JSON body");
  assert(
    JSON.stringify(r.body).includes("plant"),
    "expected planting window fields in response",
  );
});

Deno.test("calendar: window is in the future (roll-forward guard)", async () => {
  const r = await callFn(FN, payload, "keyless");
  const match = JSON.stringify(r.body).match(/\d{4}-\d{2}-\d{2}/g) ?? [];
  assert(match.length > 0, "expected at least one ISO date in response");
  const latest = match.map((d) => new Date(d).getTime()).sort((a, b) => b - a)[0];
  assert(
    latest >= Date.now() - 86_400_000,
    "planting window must roll forward to the next season, not return a past date",
  );
});

Deno.test("calendar: invalid ak_ key is rejected", async () => {
  const r = await callFn(FN, payload, "bad-apikey");
  logResult("bad-apikey", r);
  assertEquals(r.status, 401, "malformed ak_ keys must be rejected");
});

Deno.test({
  name: "calendar: valid ak_ key returns authenticated-tier data",
  ignore: !hasApiKey,
  fn: async () => {
    const r = await callFn(FN, payload, "apikey");
    logResult(`apikey(${API_KEY.slice(0, 12)}…)`, r);
    assertEquals(r.status, 200, r.text.slice(0, 200));
  },
});

Deno.test("calendar: rejects wrong param name `crop` (contract guard)", async () => {
  const r = await callFn(FN, { crop: "soybeans", county_fips: fips }, "keyless");
  assert(r.status >= 400, `expected validation error, got ${r.status}`);
});

Deno.test("calendar: CORS preflight returns 200 with allow-origin", async () => {
  const res = await preflight(FN);
  assertEquals(res.status, 200);
  assert(res.headers.get("Access-Control-Allow-Origin"), "missing allow-origin");
});
