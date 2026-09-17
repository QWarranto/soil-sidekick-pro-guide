import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

/**
 * get-soil-data Edge Function Tests
 * Priority: HIGH — Most-used endpoint
 *
 * Contract (since Aug 2026): this is a PUBLIC free-tier tool.
 * Keyless / anon callers (Telegram bot, MCP free tier, social funnels) are
 * served free-tier data. Only malformed `ak_` API keys are rejected with 401.
 */

const ENDPOINT = `${SUPABASE_URL}/functions/v1/get-soil-data`;
const VALID_BODY = {
  county_fips: "12086",
  county_name: "Miami-Dade",
  state_code: "FL",
};

// ─── Free-tier access ───

Deno.test("get-soil-data: serves keyless request as free tier", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
    body: JSON.stringify(VALID_BODY),
  });

  const body = await response.json();
  assertEquals(response.status, 200, `Expected 200, got ${response.status}`);
  assert(!body.error, "Free-tier request should not error");
  console.log("✓ Keyless request served as free tier (200)");
});

Deno.test("get-soil-data: serves anon bearer token as free tier", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(VALID_BODY),
  });

  await response.text();
  assertEquals(response.status, 200, `Expected 200, got ${response.status}`);
  console.log("✓ Anon bearer token served as free tier (200)");
});

Deno.test("get-soil-data: rejects invalid API key format", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ak_invalid_key_12345",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(VALID_BODY),
  });

  const body = await response.json();
  assertEquals(response.status, 401, `Expected 401, got ${response.status}`);
  assert(body.error, "Should return error for invalid API key");
  console.log("✓ Invalid API key rejected (401)");
});

// ─── Input Validation ───

Deno.test("get-soil-data: rejects missing required fields", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });

  const body = await response.json();
  assertEquals(response.status, 400, `Expected 400, got ${response.status}`);
  assert(body.error, "Should return error message");
  console.log("✓ Empty body rejected (400)");
});

Deno.test("get-soil-data: rejects invalid FIPS code format", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ ...VALID_BODY, county_fips: "ABCDE" }),
  });

  await response.text();
  assertEquals(response.status, 400, `Expected 400, got ${response.status}`);
  console.log("✓ Invalid FIPS format rejected (400)");
});

Deno.test("get-soil-data: does not leak data on SQL injection attempt", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      ...VALID_BODY,
      county_name: "'; DROP TABLE soil_analyses; --",
    }),
  });

  const bodyText = await response.text();
  assert(response.status !== 500, "Injection attempt should not crash the function");
  assert(
    !bodyText.includes("DROP TABLE soil_analyses"),
    "Injected SQL should not be echoed back verbatim",
  );
  console.log(`✓ SQL injection handled safely (${response.status})`);
});

// ─── CORS ───

Deno.test("get-soil-data: handles CORS preflight", async () => {
  const response = await fetch(ENDPOINT, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://example.com",
      "Access-Control-Request-Method": "POST",
    },
  });

  await response.text();
  assertEquals(response.status, 200, "CORS preflight should return 200");
  assert(
    response.headers.get("Access-Control-Allow-Origin"),
    "Should have Access-Control-Allow-Origin header",
  );
  console.log("✓ CORS preflight handled correctly");
});

// ─── Response Structure ───

Deno.test("get-soil-data: error responses have consistent structure", async () => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
    body: JSON.stringify({ county_fips: "1", county_name: "", state_code: "X" }),
  });

  const body = await response.json();
  assert(response.status >= 400, "Should return error status");
  assert(typeof body.error === "string", "Error should be a string message");
  assert(!body.soilAnalysis, "Should not return data on error");
  console.log("✓ Error response has consistent structure");
});
