/**
 * Shared helpers for the endpoint regression suite (keyless + auth-gated).
 * Used by *_test.ts files under supabase/functions/<name>/.
 */

export const SUPABASE_URL =
  Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL") ?? "";
export const ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY") ??
  "";
/** Optional: a real `ak_` key to exercise the auth-gated path. */
export const API_KEY = Deno.env.get("REGRESSION_API_KEY") ?? "";

export const FN = (name: string) => `${SUPABASE_URL}/functions/v1/${name}`;

export type CallMode = "keyless" | "anon" | "apikey" | "bad-apikey";

export function headersFor(mode: CallMode): Record<string, string> {
  const base: Record<string, string> = { "Content-Type": "application/json" };
  switch (mode) {
    case "keyless":
      return base;
    case "anon":
      return { ...base, apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
    case "apikey":
      return { ...base, apikey: ANON_KEY, Authorization: `Bearer ${API_KEY}` };
    case "bad-apikey":
      return {
        ...base,
        apikey: ANON_KEY,
        Authorization: "Bearer ak_live_definitely_not_a_real_key_000000",
      };
  }
}

export interface CallResult {
  status: number;
  // deno-lint-ignore no-explicit-any
  body: any;
  text: string;
  ms: number;
}

export async function callFn(
  name: string,
  payload: unknown,
  mode: CallMode = "keyless",
): Promise<CallResult> {
  const started = Date.now();
  const res = await fetch(FN(name), {
    method: "POST",
    headers: headersFor(mode),
    body: JSON.stringify(payload),
  });
  const text = await res.text(); // always consume — avoids Deno resource leaks
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  return { status: res.status, body, text, ms: Date.now() - started };
}

export async function preflight(name: string): Promise<Response> {
  const res = await fetch(FN(name), {
    method: "OPTIONS",
    headers: {
      Origin: "https://example.com",
      "Access-Control-Request-Method": "POST",
    },
  });
  await res.text();
  return res;
}

/** Skip auth-gated assertions cleanly when no `ak_` key is configured in CI. */
export const hasApiKey = API_KEY.startsWith("ak_");

export function logResult(label: string, r: CallResult) {
  console.log(`  ${label}: ${r.status} in ${r.ms}ms`);
}

/** Canonical fixtures — Houston County GA / Rockdale County GA. */
export const FIXTURES = {
  houstonGA: { fips: "13153", county: "Houston", state: "GA" },
  rockdaleGA: { fips: "13247", county: "Rockdale", state: "GA" },
};
