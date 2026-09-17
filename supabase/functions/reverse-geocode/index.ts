import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

const FCC_API = "https://geo.fcc.gov/api/census/area";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();

    if (typeof lat !== "number" || typeof lon !== "number") {
      return new Response(
        JSON.stringify({ error: "lat and lon must be numbers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (lat < 17 || lat > 72 || lon < -180 || lon > -65) {
      return new Response(
        JSON.stringify({ error: "Coordinates outside US coverage area" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call FCC Area API — free, no key required
    const fccUrl = `${FCC_API}?lat=${lat}&lon=${lon}&censusYear=2020&format=json`;
    const fccRes = await fetch(fccUrl);

    if (!fccRes.ok) {
      throw new Error(`FCC API returned ${fccRes.status}`);
    }

    const fccData = await fccRes.json();
    const results = fccData.results;

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No county found at these coordinates",
          lat,
          lon,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const county = results[0];
    const countyFips = county.county_fips;
    const stateFips = county.state_fips;
    const fips = stateFips + countyFips;

    const response = {
      county_fips: fips,
      county_name: county.county_name,
      state_code: county.state_code,
      state_name: county.state_name,
      state_fips: stateFips,
      lat,
      lon,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
