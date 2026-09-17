/**
 * wfs-export v1
 * x-api-key auth. Returns caller's own assets scoped via api_keys.user_id.
 * GeoJSON default, GML optional. Bbox filter. OGC GetCapabilities unauthenticated.
 */
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!)
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return errorResponse(405, "Method not allowed");

  const url = new URL(req.url);
  const apiKey = req.headers.get("x-api-key") || url.searchParams.get("x-api-key");
  const requestType = (url.searchParams.get("request") || url.searchParams.get("REQUEST") || "").toLowerCase();
  const outputFormat = (url.searchParams.get("outputFormat") || url.searchParams.get("OUTPUTFORMAT") || url.searchParams.get("format") || url.searchParams.get("FORMAT") || "geojson").toLowerCase();
  const bbox = url.searchParams.get("bbox") || url.searchParams.get("BBOX");
  const limit = Math.min(Number(url.searchParams.get("limit") || url.searchParams.get("LIMIT") || 1000), 5000);

  // OGC GetCapabilities — unauthenticated
  if (requestType === "getcapabilities") {
    const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:WFS_Capabilities version="2.0.0"
  xmlns:wfs="http://www.opengis.net/wfs/2.0"
  xmlns:ows="http://www.opengis.net/ows/1.1"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <ows:ServiceIdentification>
    <ows:Title>LeafEngines WFS</ows:Title>
    <ows:Abstract>OGC WFS 2.0 for managed agricultural assets</ows:Abstract>
  </ows:ServiceIdentification>
  <ows:OperationsMetadata>
    <ows:Operation name="GetCapabilities">
      <ows:DCP><ows:HTTP><ows:Get xlink:href="${baseUrl}"/></ows:HTTP></ows:DCP>
    </ows:Operation>
    <ows:Operation name="GetFeature">
      <ows:DCP><ows:HTTP><ows:Get xlink:href="${baseUrl}"/><ows:Post xlink:href="${baseUrl}"/></ows:HTTP></ows:DCP>
    </ows:Operation>
  </ows:OperationsMetadata>
  <FeatureTypeList>
    <FeatureType>
      <Name>leafengines:managed_assets</Name>
      <Title>Managed Agricultural Assets</Title>
      <ows:WGS84BoundingBox>
        <ows:LowerCorner>-180 -90</ows:LowerCorner>
        <ows:UpperCorner>180 90</ows:UpperCorner>
      </ows:WGS84BoundingBox>
    </FeatureType>
  </FeatureTypeList>
</wfs:WFS_Capabilities>`;
    const capHeaders = new Headers(corsHeaders);
    capHeaders.set("Content-Type", "application/xml; charset=utf-8");
    return new Response(xml, { headers: capHeaders });
  }

  if (!apiKey) return errorResponse(401, "Missing x-api-key");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  const { data: keyRow, error: keyErr } = await supabase
    .from("api_keys")
    .select("user_id, daily_data_count, daily_data_limit, is_active, is_locked")
    .or(`key_hash.eq.${apiKey},key_hash_v2.eq.${apiKey}`)
    .maybeSingle();

  if (keyErr || !keyRow) return errorResponse(401, "Invalid API key");
  if (keyRow.is_locked || keyRow.is_active === false) {
    return errorResponse(403, "API key inactive or locked");
  }

  const quota = keyRow.daily_data_limit ?? 1000;
  const used = keyRow.daily_data_count ?? 0;
  if (used >= quota) return errorResponse(429, "Quota exceeded");

  // Fire-and-forget usage increment
  supabase.from("api_keys")
    .update({ daily_data_count: used + 1, last_used_at: new Date().toISOString() })
    .or(`key_hash.eq.${apiKey},key_hash_v2.eq.${apiKey}`)
    .then(() => {});

  const { data, error } = await supabase
    .from("managed_assets")
    .select("id,user_id,asset_type,species,common_name,latitude,longitude,geometry,dbh_inches,height_feet,condition_rating,risk_rating,custom_fields,updated_at,created_at")
    .eq("user_id", keyRow.user_id)
    .eq("is_deleted", false)
    .limit(limit);

  if (error) return errorResponse(500, error.message);

  // deno-lint-ignore no-explicit-any
  let rows: any[] = data ?? [];

  if (bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(",").map(Number);
    rows = rows.filter((r) => {
      const lon = r.longitude ?? r.geometry?.coordinates?.[0];
      const lat = r.latitude ?? r.geometry?.coordinates?.[1];
      return lon != null && lat != null &&
        lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
    });
  }

  // deno-lint-ignore no-explicit-any
  const label = (r: any) => r.common_name ?? r.species ?? r.asset_type ?? "asset";

  if (outputFormat === "gml" || outputFormat.includes("gml")) {
    const features = rows.map((r) => {
      const lon = r.longitude ?? r.geometry?.coordinates?.[0] ?? 0;
      const lat = r.latitude ?? r.geometry?.coordinates?.[1] ?? 0;
      return `<gml:featureMember>
  <leafengines:managed_assets gml:id="${r.id}">
    <leafengines:name>${escapeXml(label(r))}</leafengines:name>
    <leafengines:asset_type>${escapeXml(r.asset_type ?? "")}</leafengines:asset_type>
    <gml:Point srsName="urn:ogc:def:crs:EPSG::4326">
      <gml:pos>${lat} ${lon}</gml:pos>
    </gml:Point>
  </leafengines:managed_assets>
</gml:featureMember>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection
  xmlns:wfs="http://www.opengis.net/wfs/2.0"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:leafengines="https://app.soilsidekickpro.com/wfs">
  ${features}
</wfs:FeatureCollection>`;

    const capHeaders = new Headers(corsHeaders);
    capHeaders.set("Content-Type", "application/xml; charset=utf-8");
    return new Response(xml, { headers: capHeaders });
  }

  return new Response(
    JSON.stringify({
      type: "FeatureCollection",
      features: rows.map((r) => {
        const lon = r.longitude ?? r.geometry?.coordinates?.[0];
        const lat = r.latitude ?? r.geometry?.coordinates?.[1];
        return {
          type: "Feature",
          id: r.id,
          geometry: (lon != null && lat != null)
            ? { type: "Point", coordinates: [lon, lat] }
            : r.geometry,
          properties: {
            name: label(r),
            asset_type: r.asset_type,
            species: r.species,
            common_name: r.common_name,
            dbh_inches: r.dbh_inches,
            height_feet: r.height_feet,
            condition_rating: r.condition_rating,
            risk_rating: r.risk_rating,
            updated_at: r.updated_at,
            ...(r.custom_fields ?? {}),
          },
        };
      }),
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
