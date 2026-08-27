// GeoJSON export for managed_assets
// Returns RFC 7946 FeatureCollection compatible with QGIS, ArcGIS, Mapbox, Leaflet
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { resolveAuth } from "../_shared/apiKeyAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface AssetRow {
  id: string;
  user_id: string;
  asset_type: string;
  species: string | null;
  common_name: string | null;
  latitude: number | null;
  longitude: number | null;
  geometry: Record<string, unknown> | null;
  dbh_inches: number | null;
  height_feet: number | null;
  canopy_spread_feet: number | null;
  condition_rating: string | null;
  risk_rating: string | null;
  maintenance_priority: number | null;
  last_inspection_date: string | null;
  next_inspection_due: string | null;
  notes: string | null;
  custom_fields: Record<string, unknown> | null;
  sync_source: string | null;
  external_id: string | null;
  sync_status: string | null;
  version: number | null;
  is_deleted: boolean | null;
  created_at: string;
  updated_at: string;
}

// ISA TRAQ-aligned property keys (per ANSI A300 Part 9 / ISA Tree Risk Assessment)
// Geometry preference: stored GeoJSON geometry first; fall back to lat/lng centroid Point.
function toFeature(a: AssetRow) {
  const stored = a.geometry as { type?: string; coordinates?: unknown } | null;
  const hasGeom = stored && typeof stored === "object" && typeof stored.type === "string" && stored.coordinates !== undefined;
  const geom = hasGeom
    ? stored
    : (a.longitude != null && a.latitude != null
        ? { type: "Point", coordinates: [Number(a.longitude), Number(a.latitude)] }
        : null);

  return {
    type: "Feature",
    id: a.id,
    geometry: geom,
    properties: {
      asset_id: a.id,
      asset_type: a.asset_type,
      common_name: a.common_name,
      species: a.species,
      // ISA / ANSI A300 standard fields
      dbh_in: a.dbh_inches,
      height_ft: a.height_feet,
      canopy_spread_ft: a.canopy_spread_feet,
      condition: a.condition_rating,
      risk_rating: a.risk_rating,
      maintenance_priority: a.maintenance_priority,
      last_inspection: a.last_inspection_date,
      next_inspection_due: a.next_inspection_due,
      notes: a.notes,
      custom_fields: a.custom_fields ?? {},
      sync_source: a.sync_source,
      external_id: a.external_id,
      sync_status: a.sync_status,
      version: a.version,
      created_at: a.created_at,
      updated_at: a.updated_at,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const auth = await resolveAuth(req);
    if (auth.error || !auth.userId) {
      return new Response(JSON.stringify({ error: auth.error || "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filters via query string or JSON body
    const url = new URL(req.url);
    let assetType = url.searchParams.get("asset_type");
    let bbox = url.searchParams.get("bbox"); // "minLon,minLat,maxLon,maxLat"
    let since = url.searchParams.get("since");
    if (req.method === "POST") {
      try {
        const body = await req.json();
        assetType = body.asset_type ?? assetType;
        bbox = body.bbox ?? bbox;
        since = body.since ?? since;
      } catch { /* ignore */ }
    }

    let q = supabase
      .from("managed_assets")
      .select("*")
      .eq("user_id", auth.userId)
      .eq("is_deleted", false);

    if (assetType) q = q.eq("asset_type", assetType);
    if (since) q = q.gte("updated_at", since);
    if (bbox) {
      const [minLon, minLat, maxLon, maxLat] = bbox.split(",").map(Number);
      if ([minLon, minLat, maxLon, maxLat].every((n) => Number.isFinite(n))) {
        q = q.gte("longitude", minLon).lte("longitude", maxLon)
             .gte("latitude", minLat).lte("latitude", maxLat);
      }
    }

    const { data, error } = await q;
    if (error) {
      console.error("[export-geojson] query error", error);
      return new Response(JSON.stringify({ error: "Query failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const features = (data as AssetRow[]).map(toFeature);
    const fc = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      metadata: {
        generator: "SoilCertify / LeafEngines GIS Export",
        standard: "RFC 7946 + ISA TRAQ / ANSI A300",
        exported_at: new Date().toISOString(),
        count: features.length,
        user_id: auth.userId,
      },
      features,
    };

    const filename = `managed_assets_${new Date().toISOString().slice(0, 10)}.geojson`;
    return new Response(JSON.stringify(fc, null, 2), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/geo+json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("[export-geojson] error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
