import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/api-key-request`;

// ── CORS ────────────────────────────────────────────────────────
Deno.test("OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  await res.text();
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
});

// ── Authentication ──────────────────────────────────────────────
Deno.test("GET without auth returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body.error, "Authentication required");
});

Deno.test("POST without auth returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "generate_sandbox" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body.error, "Authentication required");
});

Deno.test("GET with invalid Bearer token returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer invalid_token_abc123",
    },
  });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body.error, "Invalid token");
});

// ── Method validation ───────────────────────────────────────────
Deno.test("PUT returns 401 without auth (auth check first)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
});

Deno.test("DELETE returns 401 without auth (auth check first)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json();
  assertEquals(res.status, 401);
});

// ── Input validation (POST with forged auth header) ─────────────
Deno.test("POST with auth but invalid action returns 401 or 400", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_token",
    },
    body: JSON.stringify({ action: "invalid_action" }),
  });
  const body = await res.json();
  // Should fail at auth check before reaching action validation
  assertEquals(res.status, 401);
});

Deno.test("POST request_upgrade with invalid tier returns 401 (auth first)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_token",
    },
    body: JSON.stringify({ action: "request_upgrade", tier: "platinum" }),
  });
  const body = await res.json();
  assertEquals(res.status, 401);
});

// ── XSS / Injection resistance ──────────────────────────────────
Deno.test("XSS in key name is rejected at auth layer", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_token",
    },
    body: JSON.stringify({
      action: "generate_sandbox",
      keyName: '<script>alert("xss")</script>',
    }),
  });
  const body = await res.json();
  // Auth layer blocks before input reaches processing
  assertEquals(res.status, 401);
});

Deno.test("SQL injection in company name is rejected at auth layer", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fake_token",
    },
    body: JSON.stringify({
      action: "request_upgrade",
      tier: "starter",
      companyName: "'; DROP TABLE api_keys; --",
    }),
  });
  const text = await res.text();
  // Auth layer blocks before input reaches processing
  assertEquals(res.status === 401 || res.status === 400 || res.status === 403, true, `Expected 401/400/403 but got ${res.status}`);
});

// ── Response format consistency ─────────────────────────────────
Deno.test("Error responses include JSON content-type", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  await res.json(); // consume body
  const contentType = res.headers.get("content-type");
  assertExists(contentType);
  assertEquals(contentType!.includes("application/json"), true);
});
