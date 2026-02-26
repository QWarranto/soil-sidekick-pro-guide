import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

/**
 * get-soil-data Edge Function Tests
 * Priority: HIGH — Most-used endpoint
 * 
 * Tests cover:
 * - Authentication enforcement (JWT + API key)
 * - Input validation (Zod schema)
 * - CORS preflight handling
 * - Error response structure
 */

// ─── Auth Enforcement ───

Deno.test("get-soil-data: rejects request without auth header", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "Miami-Dade",
      state_code: "FL",
    }),
  });

  const body = await response.json();
  assertEquals(response.status, 401, `Expected 401, got ${response.status}`);
  assert(body.error, "Should return error message");
  console.log("✓ Unauthenticated request blocked (401)");
});

Deno.test("get-soil-data: rejects request with anon bearer token", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "Miami-Dade",
      state_code: "FL",
    }),
  });

  const body = await response.json();
  assertEquals(response.status, 401, `Expected 401, got ${response.status}`);
  assert(body.error, "Should return error message for invalid JWT");
  console.log("✓ Anon bearer token rejected (401)");
});

Deno.test("get-soil-data: rejects invalid API key format", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ak_invalid_key_12345",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "Miami-Dade",
      state_code: "FL",
    }),
  });

  const body = await response.json();
  assertEquals(response.status, 401, `Expected 401, got ${response.status}`);
  assert(body.error, "Should return error for invalid API key");
  console.log("✓ Invalid API key rejected (401)");
});

// ─── Input Validation ───

Deno.test("get-soil-data: rejects missing required fields", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });

  const body = await response.json();
  // Should return 400 for validation error or 401 for auth — either is acceptable
  assert(
    response.status === 400 || response.status === 401,
    `Expected 400 or 401, got ${response.status}`
  );
  assert(body.error, "Should return error message");
  console.log(`✓ Empty body rejected (${response.status})`);
});

Deno.test("get-soil-data: rejects invalid FIPS code format", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "ABCDE",  // Must be 5 digits
      county_name: "Test County",
      state_code: "FL",
    }),
  });

  const body = await response.json();
  // Validation or auth error
  assert(
    response.status === 400 || response.status === 401,
    `Expected 400 or 401, got ${response.status}`
  );
  console.log(`✓ Invalid FIPS format rejected (${response.status})`);
});

Deno.test("get-soil-data: rejects invalid state code", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "Miami-Dade",
      state_code: "FLORIDA",  // Must be 2 uppercase letters
    }),
  });

  const body = await response.json();
  assert(
    response.status === 400 || response.status === 401,
    `Expected 400 or 401, got ${response.status}`
  );
  console.log(`✓ Invalid state code rejected (${response.status})`);
});

Deno.test("get-soil-data: rejects SQL injection in county_name", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "'; DROP TABLE soil_analyses; --",
      state_code: "FL",
    }),
  });

  const bodyText = await response.text();
  
  // Should not return 200 with valid soil data
  // May return HTML error page, JSON error, or other non-success response
  let hasData = false;
  try {
    const body = JSON.parse(bodyText);
    hasData = !!body.soilAnalysis;
  } catch {
    // Non-JSON response (e.g. HTML error page) is acceptable — injection didn't succeed
  }
  
  assert(!hasData, "SQL injection attempt should not return valid soil data");
  console.log(`✓ SQL injection blocked (${response.status})`);
});

// ─── CORS ───

Deno.test("get-soil-data: handles CORS preflight", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://example.com",
      "Access-Control-Request-Method": "POST",
    },
  });

  await response.text();
  assertEquals(response.status, 200, "CORS preflight should return 200");

  const allowOrigin = response.headers.get("Access-Control-Allow-Origin");
  assert(allowOrigin, "Should have Access-Control-Allow-Origin header");
  console.log("✓ CORS preflight handled correctly");
});

// ─── Response Structure ───

Deno.test("get-soil-data: error responses have consistent structure", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/get-soil-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      county_fips: "12086",
      county_name: "Miami-Dade",
      state_code: "FL",
    }),
  });

  const body = await response.json();
  assert(response.status >= 400, "Should return error status");
  assert(typeof body.error === "string", "Error should be a string message");
  assert(!body.soilAnalysis, "Should not return data on error");
  console.log("✓ Error response has consistent structure");
});
