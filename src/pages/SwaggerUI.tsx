import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Code, FileJson, Lock, Unlock, ChevronDown, ChevronRight,
  PlayCircle, Copy, CheckCircle2, ExternalLink, Book, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const BASE_URL = "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1";

interface EndpointDoc {
  path: string;
  method: string;
  summary: string;
  description: string;
  tag: string;
  tier: string;
  requestBody?: {
    required: boolean;
    schema: Record<string, unknown>;
    example: Record<string, unknown>;
  };
  responses: Record<string, { description: string }>;
}

const API_ENDPOINTS: EndpointDoc[] = [
  {
    path: "/get-soil-data",
    method: "POST",
    summary: "Get soil analysis data",
    description: "Retrieve comprehensive soil analysis for a specific county",
    tag: "Soil Analysis",
    tier: "free",
    requestBody: {
      required: true,
      schema: { county_fips: "string (5-digit FIPS code)" },
      example: { county_fips: "12086" }
    },
    responses: { "200": { description: "Soil data returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/county-lookup",
    method: "POST",
    summary: "Search for counties",
    description: "Search counties by name, state, or FIPS code",
    tag: "Geographic",
    tier: "free",
    requestBody: {
      required: true,
      schema: { term: "string (search term)" },
      example: { term: "Miami-Dade" }
    },
    responses: { "200": { description: "Counties list returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/leafengines-query",
    method: "POST",
    summary: "LeafEngines plant compatibility",
    description: "Get plant-location compatibility scoring and environmental intelligence",
    tag: "LeafEngines",
    tier: "free",
    requestBody: {
      required: true,
      schema: { plant: "object", location: "object" },
      example: { plant: { common_name: "Tomato" }, location: { county_fips: "12086" } }
    },
    responses: { "200": { description: "Compatibility score returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/safe-identification",
    method: "POST",
    summary: "Safe plant identification",
    description: "Plant ID with toxic lookalike warnings and edibility info",
    tag: "Consumer Plant Care",
    tier: "free",
    requestBody: {
      required: true,
      schema: { image_url: "string", include_toxicity: "boolean" },
      example: { image_url: "https://example.com/plant.jpg", include_toxicity: true }
    },
    responses: { "200": { description: "Plant identification returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/dynamic-care",
    method: "POST",
    summary: "Dynamic care recommendations",
    description: "Personalized, real-time care recommendations based on location and conditions",
    tag: "Consumer Plant Care",
    tier: "free",
    requestBody: {
      required: true,
      schema: { plant_identifier: "string", user_experience: "string" },
      example: { plant_identifier: "monstera", user_experience: "beginner" }
    },
    responses: { "200": { description: "Care recommendations returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/beginner-guidance",
    method: "POST",
    summary: "Beginner-friendly guidance",
    description: "Judgment-free, jargon-free plant tips for new gardeners",
    tag: "Consumer Plant Care",
    tier: "free",
    requestBody: {
      required: true,
      schema: { experience_level: "string", plant_type: "string" },
      example: { experience_level: "beginner", plant_type: "indoor" }
    },
    responses: { "200": { description: "Guidance returned" }, "401": { description: "Unauthorized" } }
  },
  {
    path: "/territorial-water-quality",
    method: "POST",
    summary: "Get water quality data",
    description: "Retrieve water quality metrics for a specific county",
    tag: "Water Quality",
    tier: "starter",
    requestBody: {
      required: true,
      schema: { county_fips: "string (5-digit FIPS code)" },
      example: { county_fips: "12086" }
    },
    responses: { "200": { description: "Water quality data returned" }, "403": { description: "Tier required: Starter" } }
  },
  {
    path: "/multi-parameter-planting-calendar",
    method: "POST",
    summary: "Planting calendar recommendations",
    description: "Multi-parameter planting calendar with climate and soil factors",
    tag: "Soil Analysis",
    tier: "starter",
    requestBody: {
      required: true,
      schema: { county_fips: "string", crop_type: "string" },
      example: { county_fips: "12086", crop_type: "corn" }
    },
    responses: { "200": { description: "Planting calendar returned" }, "403": { description: "Tier required: Starter" } }
  },
  {
    path: "/agricultural-intelligence",
    method: "POST",
    summary: "AI-powered agricultural insights",
    description: "Agricultural intelligence with AI recommendations",
    tag: "AI Services",
    tier: "pro",
    requestBody: {
      required: true,
      schema: { county_fips: "string", analysis_type: "string" },
      example: { county_fips: "12086", analysis_type: "crop_recommendation" }
    },
    responses: { "200": { description: "AI insights returned" }, "403": { description: "Tier required: Pro" } }
  },
  {
    path: "/carbon-credit-calculator",
    method: "POST",
    summary: "Calculate carbon credits",
    description: "Calculate potential carbon credit value from sustainable farming practices",
    tag: "Carbon",
    tier: "pro",
    requestBody: {
      required: true,
      schema: { acreage: "number", practice_type: "string", years: "number" },
      example: { acreage: 100, practice_type: "cover_cropping", years: 5 }
    },
    responses: { "200": { description: "Carbon credit calculation returned" }, "403": { description: "Tier required: Pro" } }
  },
  {
    path: "/visual-crop-analysis",
    method: "POST",
    summary: "AI visual crop analysis",
    description: "Analyze crop images for health, disease, and recommendations",
    tag: "AI Services",
    tier: "enterprise",
    requestBody: {
      required: true,
      schema: { image_url: "string", crop_type: "string" },
      example: { image_url: "https://example.com/crop.jpg", crop_type: "tomato" }
    },
    responses: { "200": { description: "Visual analysis returned" }, "403": { description: "Tier required: Enterprise" } }
  }
];

const TIER_COLORS: Record<string, string> = {
  free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  starter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  pro: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  enterprise: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
};

export default function SwaggerUI() {
  const [apiKey, setApiKey] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc | null>(null);
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Group endpoints by tag
  const groupedEndpoints = API_ENDPOINTS.reduce((acc, ep) => {
    if (!acc[ep.tag]) acc[ep.tag] = [];
    acc[ep.tag].push(ep);
    return acc;
  }, {} as Record<string, EndpointDoc[]>);

  const handleSelectEndpoint = (ep: EndpointDoc) => {
    setSelectedEndpoint(ep);
    setRequestBody(JSON.stringify(ep.requestBody?.example || {}, null, 2));
    setResponse("");
    setResponseTime(null);
  };

  const handleTryIt = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    setResponse("");
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (apiKey) {
        headers["x-api-key"] = apiKey;
      }

      // Use sandbox for free tier endpoints without API key
      const url = !apiKey && selectedEndpoint.tier === "free"
        ? `https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/sandbox-demo?endpoint=${selectedEndpoint.path.slice(1)}`
        : `${BASE_URL}${selectedEndpoint.path}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: requestBody
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setResponseTime(Date.now() - startTime);

      toast({
        title: res.ok ? "Request successful" : "Request failed",
        description: `Status: ${res.status} • ${Date.now() - startTime}ms`,
        variant: res.ok ? "default" : "destructive"
      });
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }, null, 2));
      setResponseTime(Date.now() - startTime);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCurl = () => {
    if (!selectedEndpoint) return;
    
    const headers = apiKey ? `-H "x-api-key: ${apiKey}"` : "";
    const curl = `curl -X POST "${BASE_URL}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  ${headers}
  -d '${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}'`;
    
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileJson className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">LeafEngines™ API Reference</h1>
            <Badge variant="outline">OpenAPI 3.0</Badge>
          </div>
          <p className="text-muted-foreground">
            Interactive API documentation • Try endpoints directly in your browser
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/developer-sandbox">
                <PlayCircle className="mr-2 h-4 w-4" />
                Sandbox
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/openapi-spec.yaml" target="_blank" rel="noopener">
                <FileJson className="mr-2 h-4 w-4" />
                OpenAPI Spec
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/api-keys">
                <Zap className="mr-2 h-4 w-4" />
                Get API Key
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* API Key Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              {apiKey ? <Lock className="h-4 w-4 text-green-600" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
              API Key
            </Label>
            <Input
              type="password"
              placeholder="ak_your_api_key_here (optional for sandbox)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="max-w-md font-mono text-sm"
            />
            <span className="text-xs text-muted-foreground">
              {apiKey ? "Authenticated" : "Using sandbox mode for free tier"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar - Endpoint List */}
          <Card className="h-fit p-4">
            <h3 className="mb-3 font-semibold text-foreground">Endpoints</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
                  <Collapsible key={tag} defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                      {tag}
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 pt-1">
                      {endpoints.map((ep) => (
                        <button
                          key={ep.path}
                          onClick={() => handleSelectEndpoint(ep)}
                          className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                            selectedEndpoint?.path === ep.path
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Badge variant="secondary" className="shrink-0 font-mono text-[10px] px-1">
                            {ep.method}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-mono text-xs">{ep.path}</div>
                            <div className={`truncate text-xs ${selectedEndpoint?.path === ep.path ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {ep.summary}
                            </div>
                          </div>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Main Panel - Endpoint Details */}
          {selectedEndpoint ? (
            <div className="space-y-6">
              {/* Endpoint Header */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="font-mono">
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono text-foreground">{selectedEndpoint.path}</code>
                      <Badge className={TIER_COLORS[selectedEndpoint.tier]}>
                        {selectedEndpoint.tier}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{selectedEndpoint.summary}</h2>
                    <p className="text-muted-foreground mt-1">{selectedEndpoint.description}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      Request Body
                      {selectedEndpoint.requestBody.required && (
                        <Badge variant="destructive" className="text-[10px]">required</Badge>
                      )}
                    </h3>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full min-h-[120px] p-3 rounded-md border bg-muted font-mono text-sm"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleTryIt} disabled={loading}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {loading ? "Sending..." : "Try it out"}
                  </Button>
                  <Button variant="outline" onClick={handleCopyCurl}>
                    {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied!" : "Copy cURL"}
                  </Button>
                </div>
              </Card>

              {/* Response */}
              {response && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Response</h3>
                    {responseTime !== null && (
                      <Badge variant="outline">{responseTime}ms</Badge>
                    )}
                  </div>
                  <pre className={`p-4 rounded-md font-mono text-sm overflow-x-auto ${
                    response.includes('"error"') 
                      ? 'bg-destructive/10 border border-destructive/30' 
                      : 'bg-muted'
                  }`}>
                    {response}
                  </pre>
                </Card>
              )}

              {/* Responses Reference */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Responses</h3>
                <div className="space-y-2">
                  {Object.entries(selectedEndpoint.responses).map(([code, info]) => (
                    <div key={code} className="flex items-center gap-3">
                      <Badge variant={code.startsWith('2') ? 'default' : code.startsWith('4') ? 'destructive' : 'secondary'}>
                        {code}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{info.description}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileJson className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Select an endpoint</h2>
              <p className="text-muted-foreground">
                Choose an API endpoint from the list to view documentation and try it out
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
