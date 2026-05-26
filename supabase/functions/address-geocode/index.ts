/**
 * Address Geocode Edge Function
 *
 * Public endpoint that turns a free-text US address into:
 *   { lat, lon, county_fips, county_name, state_code, state_name, matched_address, source }
 *
 * Pipeline:
 *   1. US Census Geocoder (Public_AR_Current) — address → lat/lon
 *   2. FCC Census Area API — lat/lon → county FIPS
 *
 * No JWT, IP rate-limited. CORS-open so partners (e.g. SoilCertify) can call it.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-free-tier",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CENSUS_URL =
  "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const FCC_URL = "https://geo.fcc.gov/api/census/area";

function bad(status: number, error: string, extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ error, ...extra }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return bad(405, "Method not allowed");
  }

  let body: { address?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body");
  }

  const raw = typeof body.address === "string" ? body.address.trim() : "";
  if (raw.length < 5 || raw.length > 200) {
    return bad(400, "address must be a string between 5 and 200 characters");
  }

  // Light sanitization — Census tolerates most punctuation but strip control chars
  const address = raw.replace(/[\x00-\x1F\x7F]/g, "");

  try {
    // 1) Address → lat/lon via Census
    const censusUrl =
      `${CENSUS_URL}?address=${encodeURIComponent(address)}` +
      `&benchmark=Public_AR_Current&format=json`;
    const censusRes = await fetch(censusUrl);
    if (!censusRes.ok) {
      return bad(502, "Census geocoder error", { status: censusRes.status });
    }
    const censusJson = await censusRes.json();
    const match = censusJson?.result?.addressMatches?.[0];
    if (!match) {
      return bad(404, "No address match found", { address });
    }
    const lat = match.coordinates?.y;
    const lon = match.coordinates?.x;
    const matchedAddress = match.matchedAddress;
    if (typeof lat !== "number" || typeof lon !== "number") {
      return bad(502, "Census returned no coordinates");
    }

    // 2) lat/lon → county FIPS via FCC
    const fccRes = await fetch(
      `${FCC_URL}?lat=${lat}&lon=${lon}&censusYear=2020&format=json`,
    );
    if (!fccRes.ok) {
      return bad(502, "FCC area API error", { status: fccRes.status });
    }
    const fccJson = await fccRes.json();
    const county = fccJson?.results?.[0];
    if (!county?.county_fips || !county?.state_fips) {
      return bad(404, "No county found at coordinates", { lat, lon });
    }
    const fips = `${county.state_fips}${county.county_fips}`;

    return new Response(
      JSON.stringify({
        lat,
        lon,
        county_fips: fips,
        county_name: county.county_name,
        state_code: county.state_code,
        state_name: county.state_name,
        state_fips: county.state_fips,
        matched_address: matchedAddress,
        source: "census+fcc",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("address-geocode error:", err);
    return bad(500, (err as Error).message || "Internal server error");
  }
});
