import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Code, Zap, Book, ClipboardList, Copy, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SANDBOX_URL = "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/sandbox-demo";

const ENDPOINTS = [
  { value: "leafengines-query", label: "LeafEngines Query", description: "Plant/location compatibility scoring" },
  { value: "safe-identification", label: "Safe Identification", description: "Plant ID with toxic lookalike warnings" },
  { value: "dynamic-care", label: "Dynamic Care", description: "Personalized care recommendations" },
  { value: "beginner-guidance", label: "Beginner Guidance", description: "Beginner-friendly plant tips" },
  { value: "get-soil-data", label: "Soil Data", description: "County soil analysis data" },
];

const SAMPLE_REQUESTS: Record<string, object> = {
  "leafengines-query": {
    plant: { common_name: "Tomato" },
    location: { county_fips: "12086" }
  },
  "safe-identification": {
    image_url: "https://example.com/plant.jpg"
  },
  "dynamic-care": {
    plant_identifier: "monstera"
  },
  "beginner-guidance": {
    experience_level: "beginner"
  },
  "get-soil-data": {
    county_fips: "12086"
  }
};

export default function DeveloperSandbox() {
  const [endpoint, setEndpoint] = useState("leafengines-query");
  const [requestBody, setRequestBody] = useState(JSON.stringify(SAMPLE_REQUESTS["leafengines-query"], null, 2));
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleEndpointChange = (value: string) => {
    setEndpoint(value);
    setRequestBody(JSON.stringify(SAMPLE_REQUESTS[value] || {}, null, 2));
    setResponse("");
    setResponseTime(null);
  };

  const handleTestAPI = async () => {
    setLoading(true);
    setResponse("");
    setResponseTime(null);
    
    const startTime = Date.now();
    
    try {
      let body: object;
      try {
        body = JSON.parse(requestBody);
      } catch {
        throw new Error("Invalid JSON in request body");
      }

      const res = await fetch(`${SANDBOX_URL}?endpoint=${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      
      setResponse(JSON.stringify(data, null, 2));
      setResponseTime(elapsed);
      
      toast({
        title: "API call successful",
        description: `Response received in ${elapsed}ms`,
      });
    } catch (error) {
      const elapsed = Date.now() - startTime;
      setResponseTime(elapsed);
      setResponse(JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        hint: "Check your request body JSON format"
      }, null, 2));
      
      toast({
        title: "API call failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCurl = () => {
    const curl = `curl -X POST "${SANDBOX_URL}?endpoint=${endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}'`;
    
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "cURL command ready to paste",
    });
  };

  const selectedEndpoint = ENDPOINTS.find(e => e.value === endpoint);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Code className="mr-2 h-3 w-3" />
            Live Sandbox • No Auth Required
          </Badge>
          <h1 className="mb-2 text-4xl font-bold text-foreground">LeafEngines™ Developer Sandbox</h1>
          <p className="text-lg text-muted-foreground">
            Test the Environmental Intelligence API in real-time — no API key needed for sandbox
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to="/leafengines-api">
                <Book className="mr-2 h-4 w-4" />
                API Documentation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/client-integration-guide">
                <ClipboardList className="mr-2 h-4 w-4" />
                Integration Guide
              </Link>
            </Button>
            <Button asChild>
              <Link to="/impact-simulator">
                <Zap className="mr-2 h-4 w-4" />
                ROI Calculator
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            {/* Endpoint Selector */}
            <Card className="mb-6 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label className="mb-2 block text-sm font-medium">Select Endpoint</Label>
                  <Select value={endpoint} onValueChange={handleEndpointChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENDPOINTS.map((ep) => (
                        <SelectItem key={ep.value} value={ep.value}>
                          <span className="font-medium">{ep.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedEndpoint?.description}
                </div>
              </div>
            </Card>

            {/* Request/Response Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Request Panel */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Request</h3>
                  <Button variant="ghost" size="sm" onClick={handleCopyCurl}>
                    {copied ? (
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy cURL"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block text-sm text-muted-foreground">
                      POST {SANDBOX_URL}?endpoint={endpoint}
                    </Label>
                    <Textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Enter JSON request body..."
                    />
                  </div>
                  
                  <Button 
                    onClick={handleTestAPI} 
                    disabled={loading} 
                    className="w-full"
                    size="lg"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {loading ? "Sending Request..." : "Send Request"}
                  </Button>
                </div>
              </Card>

              {/* Response Panel */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Response</h3>
                  {responseTime !== null && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {responseTime}ms
                    </Badge>
                  )}
                </div>
                
                <Textarea
                  value={response || "// Response will appear here after sending a request..."}
                  className={`min-h-[370px] font-mono text-sm ${
                    response.includes('"error"') 
                      ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950' 
                      : response 
                        ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950'
                        : ''
                  }`}
                  readOnly
                />
              </Card>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Code className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Demo Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Returns realistic sample data. Production uses live integrations.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Rate Limited</h4>
                    <p className="text-sm text-muted-foreground">
                      Sandbox: 10 req/min. Production tiers: 60-600 req/min.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Ready for Production?</h4>
                    <p className="text-sm text-muted-foreground">
                      <Link to="/api-keys" className="text-primary hover:underline">
                        Get your API key
                      </Link>
                      {" "}— instant sandbox or request paid tiers.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
