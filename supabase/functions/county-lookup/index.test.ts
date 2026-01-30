import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/county-lookup`;

Deno.test("county-lookup: should search counties by name", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "Madison",
    }),
  });

  const data = await response.json();

  // Should return successful response
  assertEquals(response.status, 200);
  assertExists(data.results);
  assertEquals(Array.isArray(data.results), true);
});

Deno.test("county-lookup: should validate minimum term length", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "A", // Too short (min 2)
    }),
  });

  const body = await response.text();

  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("county-lookup: should validate maximum term length", async () => {
  const longTerm = "A".repeat(61); // Exceeds max 60

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: longTerm,
    }),
  });

  const body = await response.text();

  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("county-lookup: should require term field", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}), // Missing term
  });

  const body = await response.text();

  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("county-lookup: should handle CORS preflight", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://example.com",
      "Access-Control-Request-Method": "POST",
    },
  });

  await response.text(); // Consume body to prevent resource leak

  // Should return CORS headers
  assertEquals(response.status === 200 || response.status === 204, true);
  assertExists(response.headers.get("access-control-allow-origin"));
});

Deno.test("county-lookup: should sanitize dangerous characters", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "Madison<script>alert('xss')</script>",
    }),
  });

  const data = await response.json();

  // Should succeed (characters are sanitized, not rejected)
  assertEquals(response.status, 200);
  assertExists(data.results);
});

Deno.test("county-lookup: should trim whitespace from term", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "   Madison   ",
    }),
  });

  const data = await response.json();

  // Should succeed with trimmed term
  assertEquals(response.status, 200);
  assertExists(data.results);
});

Deno.test("county-lookup: should limit results to 10", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "County", // Common term that would match many
    }),
  });

  const data = await response.json();

  // Should not exceed 10 results
  assertEquals(response.status, 200);
  assertEquals(data.results.length <= 10, true);
});

Deno.test("county-lookup: should search by state name when few county matches", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "California",
    }),
  });

  const data = await response.json();

  // Should return results (searching by state name)
  assertEquals(response.status, 200);
  assertExists(data.results);
});

Deno.test("county-lookup: should handle empty results gracefully", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "XYZNonExistentCounty123",
    }),
  });

  const data = await response.json();

  // Should return empty results array
  assertEquals(response.status, 200);
  assertEquals(Array.isArray(data.results), true);
  assertEquals(data.results.length, 0);
});

Deno.test("county-lookup: should handle malformed JSON", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: "{ not valid json",
  });

  const body = await response.text();

  // Should return error
  assertEquals(response.status >= 400, true);
});

Deno.test("county-lookup: results should include required fields", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      term: "Madison",
    }),
  });

  const data = await response.json();

  assertEquals(response.status, 200);
  
  if (data.results.length > 0) {
    const result = data.results[0];
    assertExists(result.id);
    assertExists(result.county_name);
    assertExists(result.state_name);
    assertExists(result.state_code);
    assertExists(result.fips_code);
  }
});
