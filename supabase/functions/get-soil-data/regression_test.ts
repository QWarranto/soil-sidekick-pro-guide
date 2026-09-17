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

const FN = "get-soil-data";
const { fips, county, state } = FIXTURES.houstonGA;
const payload = {
  county_fips: fips,
  county_name: county,
  state_code: state,
};

// ─── Keyless free tier (Telegram bot / MCP free-tier path) ───

Deno.test("soil: keyless request returns free-tier data", async () => {
  const r = await callFn(FN, payload, "keyless");
  logResult("keyless", r);
  assertEquals(r.status, 200, `keyless soil lookup must not 401: ${r.text.slice(0, 200)}`);
  assert(r.body?.soilAnalysis ?? r.body?.soil_data ?? r.body?.data, "expected soil payload");
});

Deno.test("soil: anon-key request returns free-tier data", async () => {
  const r = await callFn(FN, payload, "anon");
  logResult("anon", r);
  assertEquals(r.status, 200, `anon soil lookup must not 401: ${r.text.slice(0, 200)}`);
});

// ─── Auth-gated path ───

Deno.test("soil: invalid ak_ key is rejected", async () => {
  const r = await callFn(FN, payload, "bad-apikey");
  logResult("bad-apikey", r);
  assertEquals(r.status, 401, "malformed ak_ keys must be rejected");
  assert(r.body?.error, "expected error message");
});

Deno.test({
  name: "soil: valid ak_ key returns full-tier data",
  ignore: !hasApiKey,
  fn: async () => {
    const r = await callFn(FN, payload, "apikey");
    logResult(`apikey(${API_KEY.slice(0, 12)}…)`, r);
    assertEquals(r.status, 200, r.text.slice(0, 200));
  },
});

// ─── Contract / CORS ───

Deno.test("soil: rejects malformed FIPS", async () => {
  const r = await callFn(FN, { ...payload, county_fips: "ABCDE" }, "keyless");
  assert(r.status === 400 || r.status === 422, `expected validation error, got ${r.status}`);
});

Deno.test("soil: CORS preflight returns 200 with allow-origin", async () => {
  const res = await preflight(FN);
  assertEquals(res.status, 200);
  assert(res.headers.get("Access-Control-Allow-Origin"), "missing allow-origin");
});
