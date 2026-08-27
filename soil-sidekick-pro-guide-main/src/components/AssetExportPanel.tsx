import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Globe, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = "https://efwqkzayfdtbycfxgwwc.supabase.co";

type AssetTypeFilter = "all" | "tree" | "shrub" | "turf" | "hardscape" | "other";

export function AssetExportPanel() {
  const { toast } = useToast();
  const [assetType, setAssetType] = useState<AssetTypeFilter>("all");
  const [since, setSince] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const wfsCapabilitiesUrl = `${SUPABASE_URL}/functions/v1/wfs-export?service=WFS&version=2.0.0&request=GetCapabilities`;

  const handleDownloadGeoJson = async () => {
    setDownloading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("You must be signed in to export.");

      const params = new URLSearchParams();
      if (assetType !== "all") params.set("asset_type", assetType);
      if (since) params.set("since", new Date(since).toISOString());

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/export-geojson?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Export failed (${res.status}): ${txt.slice(0, 200)}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `managed_assets_${new Date().toISOString().slice(0, 10)}.geojson`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Export ready", description: "GeoJSON downloaded." });
    } catch (e) {
      toast({
        title: "Export failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyWfs = async () => {
    await navigator.clipboard.writeText(wfsCapabilitiesUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied", description: "WFS GetCapabilities URL copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            GeoJSON Export
            <Badge variant="outline">RFC 7946</Badge>
            <Badge variant="outline">ISA TRAQ / ANSI A300</Badge>
          </CardTitle>
          <CardDescription>
            Download your managed assets as a GeoJSON FeatureCollection. Drop directly into QGIS, ArcGIS Pro, Mapbox, or Leaflet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="export-type">Asset Type</Label>
              <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetTypeFilter)}>
                <SelectTrigger id="export-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="tree">Tree</SelectItem>
                  <SelectItem value="shrub">Shrub</SelectItem>
                  <SelectItem value="turf">Turf</SelectItem>
                  <SelectItem value="hardscape">Hardscape</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="export-since">Updated since (optional)</Label>
              <Input
                id="export-since"
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleDownloadGeoJson} disabled={downloading}>
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "Generating…" : "Download GeoJSON"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            WFS 2.0 Live Feed
            <Badge variant="outline">OGC WFS 2.0.0</Badge>
            <Badge variant="outline">GML 3.2</Badge>
          </CardTitle>
          <CardDescription>
            Connect QGIS or ArcGIS to a live feed of your assets. In QGIS: Layer → Add Layer → Add WFS Layer →
            New → paste the URL below. Append <code>&amp;access_token=YOUR_TOKEN</code> for authenticated GetFeature requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input readOnly value={wfsCapabilitiesUrl} className="font-mono text-xs" />
            <Button variant="outline" size="sm" onClick={handleCopyWfs}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports <code>GetCapabilities</code>, <code>DescribeFeatureType</code>, and <code>GetFeature</code> (GML 3.2 or GeoJSON via <code>outputFormat=application/json</code>). bbox and count parameters supported.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssetExportPanel;
