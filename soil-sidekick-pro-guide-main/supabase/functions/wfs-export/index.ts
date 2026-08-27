// Minimal OGC WFS 2.0.0 endpoint for managed_assets
// Supports GetCapabilities, DescribeFeatureType, GetFeature (GML 3.2 or application/json)
// Designed to be added as a WFS layer in QGIS: Layer → Add Layer → Add WFS Layer
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { resolveAuth } from "../_shared/apiKeyAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const FEATURE_TYPE = "sc:managed_assets";
const NS = "https://soilcertify.com/wfs";

const xmlEscape = (s: unknown) =>
  String(s ?? "").replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));

function capabilitiesXml(serviceUrl: string) {
  const secureUrl = serviceUrl.replace(/^http:/, "https:").replace(/\/wfs-export$/, "/functions/v1/wfs-export");
  return `<?xml version="1.0" encoding="UTF-8"?>
<wfs:WFS_Capabilities version="2.0.0"
  xmlns:wfs="http://www.opengis.net/wfs/2.0"
  xmlns:ows="http://www.opengis.net/ows/1.1"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:sc="${NS}">
  <ows:ServiceIdentification>
    <ows:Title>SoilCertify Managed Assets WFS</ows:Title>
    <ows:Abstract>OGC WFS 2.0 feed of managed landscape assets (ISA TRAQ / ANSI A300).</ows:Abstract>
    <ows:ServiceType>WFS</ows:ServiceType>
    <ows:ServiceTypeVersion>2.0.0</ows:ServiceTypeVersion>
  </ows:ServiceIdentification>
  <ows:OperationsMetadata>
    <ows:Operation name="GetCapabilities">
      <ows:DCP><ows:HTTP><ows:Get xlink:href="${secureUrl}"/></ows:HTTP></ows:DCP>
    </ows:Operation>
    <ows:Operation name="DescribeFeatureType">
      <ows:DCP><ows:HTTP><ows:Get xlink:href="${secureUrl}"/></ows:HTTP></ows:DCP>
    </ows:Operation>
    <ows:Operation name="GetFeature">
      <ows:DCP><ows:HTTP><ows:Get xlink:href="${secureUrl}"/></ows:HTTP></ows:DCP>
      <ows:Parameter name="outputFormat">
        <ows:AllowedValues>
          <ows:Value>application/gml+xml; version=3.2</ows:Value>
          <ows:Value>application/json</ows:Value>
        </ows:AllowedValues>
      </ows:Parameter>
    </ows:Operation>
  </ows:OperationsMetadata>
  <wfs:FeatureTypeList>
    <wfs:FeatureType>
      <wfs:Name>${FEATURE_TYPE}</wfs:Name>
      <wfs:Title>Managed Assets</wfs:Title>
      <wfs:DefaultCRS>urn:ogc:def:crs:EPSG::4326</wfs:DefaultCRS>
      <ows:WGS84BoundingBox>
        <ows:LowerCorner>-180 -90</ows:LowerCorner>
        <ows:UpperCorner>180 90</ows:UpperCorner>
      </ows:WGS84BoundingBox>
    </wfs:FeatureType>
  </wfs:FeatureTypeList>
</wfs:WFS_Capabilities>`;
}

function describeFeatureTypeXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:sc="${NS}"
  targetNamespace="${NS}"
  elementFormDefault="qualified">
  <xsd:import namespace="http://www.opengis.net/gml/3.2"
    schemaLocation="http://schemas.opengis.net/gml/3.2.1/gml.xsd"/>
  <xsd:element name="managed_assets" type="sc:managed_assetsType" substitutionGroup="gml:AbstractFeature"/>
  <xsd:complexType name="managed_assetsType">
    <xsd:complexContent>
      <xsd:extension base="gml:AbstractFeatureType">
        <xsd:sequence>
          <xsd:element name="geometry" type="gml:PointPropertyType"/>
          <xsd:element name="asset_type" type="xsd:string"/>
          <xsd:element name="common_name" type="xsd:string" minOccurs="0"/>
          <xsd:element name="species" type="xsd:string" minOccurs="0"/>
          <xsd:element name="dbh_in" type="xsd:double" minOccurs="0"/>
          <xsd:element name="height_ft" type="xsd:double" minOccurs="0"/>
          <xsd:element name="canopy_spread_ft" type="xsd:double" minOccurs="0"/>
          <xsd:element name="condition" type="xsd:string" minOccurs="0"/>
          <xsd:element name="risk_rating" type="xsd:string" minOccurs="0"/>
          <xsd:element name="maintenance_priority" type="xsd:int" minOccurs="0"/>
          <xsd:element name="last_inspection" type="xsd:date" minOccurs="0"/>
          <xsd:element name="next_inspection_due" type="xsd:date" minOccurs="0"/>
          <xsd:element name="notes" type="xsd:string" minOccurs="0"/>
        </xsd:sequence>
      </xsd:extension>
    </xsd:complexContent>
  </xsd:complexType>
</xsd:schema>`;
}

interface AssetRow {
  id: string;
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
}

// Convert any GeoJSON geometry to a minimal GML 3.2 representation.
// Falls back to lat/lng centroid Point when geometry is null.
function geomToGml(a: AssetRow): string {
  const g = a.geometry as { type?: string; coordinates?: unknown } | null;
  const srs = `srsName="urn:ogc:def:crs:EPSG::4326"`;
  const posList = (coords: number[][]) =>
    coords.map((c) => `${Number(c[1])} ${Number(c[0])}`).join(" ");

  if (g && typeof g === "object" && typeof g.type === "string") {
    try {
      if (g.type === "Point") {
        const c = g.coordinates as number[];
        return `<gml:Point ${srs} gml:id="g.${xmlEscape(a.id)}"><gml:pos>${Number(c[1])} ${Number(c[0])}</gml:pos></gml:Point>`;
      }
      if (g.type === "LineString") {
        return `<gml:LineString ${srs} gml:id="g.${xmlEscape(a.id)}"><gml:posList>${posList(g.coordinates as number[][])}</gml:posList></gml:LineString>`;
      }
      if (g.type === "Polygon") {
        const rings = (g.coordinates as number[][][])
          .map((ring, i) => {
            const which = i === 0 ? "exterior" : "interior";
            return `<gml:${which}><gml:LinearRing><gml:posList>${posList(ring)}</gml:posList></gml:LinearRing></gml:${which}>`;
          })
          .join("");
        return `<gml:Polygon ${srs} gml:id="g.${xmlEscape(a.id)}">${rings}</gml:Polygon>`;
      }
    } catch (e) {
      console.warn("[wfs-export] geometry parse failed", e);
    }
  }
  // Fallback to centroid Point
  if (a.latitude != null && a.longitude != null) {
    return `<gml:Point ${srs} gml:id="g.${xmlEscape(a.id)}"><gml:pos>${Number(a.latitude)} ${Number(a.longitude)}</gml:pos></gml:Point>`;
  }
  return "";
}

function featureGml(a: AssetRow) {
  const opt = (tag: string, val: unknown) =>
    val === null || val === undefined || val === ""
      ? ""
      : `<sc:${tag}>${xmlEscape(val)}</sc:${tag}>`;
  return `<wfs:member>
    <sc:managed_assets gml:id="a.${xmlEscape(a.id)}">
      <sc:geometry>${geomToGml(a)}</sc:geometry>
      <sc:asset_type>${xmlEscape(a.asset_type)}</sc:asset_type>
      ${opt("common_name", a.common_name)}
      ${opt("species", a.species)}
      ${opt("dbh_in", a.dbh_inches)}
      ${opt("height_ft", a.height_feet)}
      ${opt("canopy_spread_ft", a.canopy_spread_feet)}
      ${opt("condition", a.condition_rating)}
      ${opt("risk_rating", a.risk_rating)}
      ${opt("maintenance_priority", a.maintenance_priority)}
      ${opt("last_inspection", a.last_inspection_date)}
      ${opt("next_inspection_due", a.next_inspection_due)}
      ${opt("notes", a.notes)}
    </sc:managed_assets>
  </wfs:member>`;
}

function getFeatureGml(rows: AssetRow[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection
  xmlns:wfs="http://www.opengis.net/wfs/2.0"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:sc="${NS}"
  numberMatched="${rows.length}" numberReturned="${rows.length}"
  timeStamp="${new Date().toISOString()}">
  ${rows.map(featureGml).join("\n")}
</wfs:FeatureCollection>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const params = new URLSearchParams();
    url.searchParams.forEach((v, k) => params.set(k.toLowerCase(), v));
    const request = (params.get("request") || "GetCapabilities");
    const serviceUrl = `${url.origin}${url.pathname}`;

    // GetCapabilities + DescribeFeatureType: unauthenticated metadata (no row data)
    if (request.toLowerCase() === "getcapabilities") {
      return new Response(capabilitiesXml(serviceUrl), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
      });
    }
    if (request.toLowerCase() === "describefeaturetype") {
      return new Response(describeFeatureTypeXml(), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    // GetFeature requires auth (returns user's rows only)
    if (request.toLowerCase() !== "getfeature") {
      return new Response(JSON.stringify({ error: `Unsupported request: ${request}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Auth: Bearer header OR x-api-key (QGIS supports custom headers)
    const auth = await resolveAuth(req);
    if (auth.error || !auth.userId) {
      return new Response(JSON.stringify({ error: auth.error || "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const typeName = params.get("typenames") || params.get("typename") || FEATURE_TYPE;
    if (!typeName.includes("managed_assets")) {
      return new Response(JSON.stringify({ error: `Unknown typeName: ${typeName}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let q = supabase.from("managed_assets").select("*").eq("user_id", auth.userId).eq("is_deleted", false);
    const bbox = params.get("bbox");
    if (bbox) {
      const [minLat, minLon, maxLat, maxLon] = bbox.split(",").map(Number);
      // WFS bbox order for EPSG:4326 is lat,lon,lat,lon
      if ([minLat, minLon, maxLat, maxLon].every((n) => Number.isFinite(n))) {
        q = q.gte("latitude", minLat).lte("latitude", maxLat)
             .gte("longitude", minLon).lte("longitude", maxLon);
      }
    }
    const count = params.get("count") || params.get("maxfeatures");
    if (count && Number.isFinite(Number(count))) q = q.limit(Number(count));

    const { data, error } = await q;
    if (error) {
      console.error("[wfs-export] query error", error);
      return new Response(JSON.stringify({ error: "Query failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const outputFormat = (params.get("outputformat") || "").toLowerCase();
    const wantJson = outputFormat.includes("json");
    if (wantJson) {
      const features = (data as AssetRow[]).map((a) => ({
        type: "Feature",
        id: a.id,
        geometry: { type: "Point", coordinates: [Number(a.longitude), Number(a.latitude)] },
        properties: a,
      }));
      return new Response(
        JSON.stringify({ type: "FeatureCollection", features, totalFeatures: features.length }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(getFeatureGml(data as AssetRow[]), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/gml+xml; version=3.2; charset=utf-8" },
    });
  } catch (e) {
    console.error("[wfs-export] error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
