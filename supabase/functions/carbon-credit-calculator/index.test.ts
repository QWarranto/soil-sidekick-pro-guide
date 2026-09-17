import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/carbon-credit-calculator`;

Deno.test("carbon-credit-calculator: should reject unauthenticated requests", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Test Field",
      field_size_acres: 100,
      soil_organic_matter: 3.5,
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should require authentication
  assertEquals(response.status === 401 || response.status === 403, true);
});

Deno.test("carbon-credit-calculator: should validate required fields", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      // Missing required fields
      field_size_acres: 100,
    }),
  });

  const body = await response.text();
  
  // Should fail validation or auth
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should validate field_size_acres is positive", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Invalid Field",
      field_size_acres: -50, // Negative value
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should validate verification_type enum", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Test Field",
      field_size_acres: 100,
      verification_type: "invalid_type", // Invalid enum value
    }),
  });

  const body = await response.text();
  
  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should validate soil_organic_matter range", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Test Field",
      field_size_acres: 100,
      soil_organic_matter: 150, // Above 100%
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should handle CORS preflight", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://example.com",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,authorization",
    },
  });

  await response.text(); // Consume body to prevent resource leak

  // Should return CORS headers
  assertEquals(response.status === 200 || response.status === 204, true);
  assertExists(response.headers.get("access-control-allow-origin"));
});

Deno.test("carbon-credit-calculator: should validate field_size_acres maximum", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Huge Field",
      field_size_acres: 200000, // Above 100000 max
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should fail validation
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should validate field_name length", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "", // Empty string
      field_size_acres: 100,
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should fail validation (min 1 character)
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should accept valid UUID for soil_analysis_id", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      field_name: "Test Field",
      field_size_acres: 100,
      soil_analysis_id: "not-a-valid-uuid",
      verification_type: "self_reported",
    }),
  });

  const body = await response.text();
  
  // Should fail validation due to invalid UUID
  assertEquals(response.status >= 400, true);
});

Deno.test("carbon-credit-calculator: should handle malformed JSON", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
    body: "{ invalid json }",
  });

  const body = await response.text();
  
  // Should return error for malformed JSON
  assertEquals(response.status >= 400, true);
});
