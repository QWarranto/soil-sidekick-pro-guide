import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  PlayCircle, Code, Zap, Book, ClipboardList, Copy, CheckCircle2, 
  Clock, AlertCircle, History, Trash2, Download, FileJson, ExternalLink,
  ChevronDown, ChevronRight, Leaf, Droplets, MapPin, Brain, Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SANDBOX_URL = "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/sandbox-demo";

interface Endpoint {
  value: string;
  label: string;
  description: string;
  category: string;
  tier: string;
  icon: React.ElementType;
}

const ENDPOINTS: Endpoint[] = [
  { value: "leafengines-query", label: "LeafEngines Query", description: "Plant/location compatibility scoring", category: "Core", tier: "Free", icon: Leaf },
  { value: "safe-identification", label: "Safe Identification", description: "Plant ID with toxic lookalike warnings", category: "Plant Care", tier: "Free", icon: Shield },
  { value: "dynamic-care", label: "Dynamic Care", description: "Personalized care recommendations", category: "Plant Care", tier: "Free", icon: Leaf },
  { value: "beginner-guidance", label: "Beginner Guidance", description: "Beginner-friendly plant tips", category: "Plant Care", tier: "Free", icon: Brain },
  { value: "get-soil-data", label: "Soil Data", description: "County soil analysis data", category: "Geographic", tier: "Free", icon: MapPin },
  { value: "territorial-water-quality", label: "Water Quality", description: "County water quality metrics", category: "Geographic", tier: "Starter", icon: Droplets },
];

const SAMPLE_REQUESTS: Record<string, object> = {
  "leafengines-query": {
    plant: { common_name: "Tomato" },
    location: { county_fips: "12086" }
  },
  "safe-identification": {
    image_url: "https://example.com/plant.jpg",
    include_toxicity: true
  },
  "dynamic-care": {
    plant_identifier: "monstera",
    user_experience: "beginner"
  },
  "beginner-guidance": {
    experience_level: "beginner",
    plant_type: "indoor"
  },
  "get-soil-data": {
    county_fips: "12086"
  },
  "territorial-water-quality": {
    county_fips: "12086"
  }
};

interface HistoryEntry {
  id: string;
  endpoint: string;
  request: string;
  response: string;
  responseTime: number;
  timestamp: Date;
  success: boolean;
}

export default function DeveloperSandbox() {
  const [endpoint, setEndpoint] = useState("leafengines-query");
  const [requestBody, setRequestBody] = useState(JSON.stringify(SAMPLE_REQUESTS["leafengines-query"], null, 2));
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sandbox_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((h: HistoryEntry) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        })));
      } catch {}
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("sandbox_history", JSON.stringify(history.slice(0, 20)));
    }
  }, [history]);

  const handleEndpointChange = (value: string) => {
    setEndpoint(value);
    setRequestBody(JSON.stringify(SAMPLE_REQUESTS[value] || {}, null, 2));
    setResponse("");
    setResponseTime(null);
    setResponseHeaders({});
  };

  const handleTestAPI = async () => {
    setLoading(true);
    setResponse("");
    setResponseTime(null);
    setResponseHeaders({});
    
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
      
      // Capture response headers
      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('x-') || key.toLowerCase() === 'content-type') {
          headers[key] = value;
        }
      });
      setResponseHeaders(headers);
      
      const responseStr = JSON.stringify(data, null, 2);
      setResponse(responseStr);
      setResponseTime(elapsed);
      
      // Add to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        endpoint,
        request: requestBody,
        response: responseStr,
        responseTime: elapsed,
        timestamp: new Date(),
        success: res.ok
      };
      setHistory(prev => [entry, ...prev].slice(0, 20));
      
      toast({
        title: "API call successful",
        description: `Response received in ${elapsed}ms`,
      });
    } catch (error) {
      const elapsed = Date.now() - startTime;
      setResponseTime(elapsed);
      const errorResponse = JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        hint: "Check your request body JSON format"
      }, null, 2);
      setResponse(errorResponse);
      
      // Add failed request to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        endpoint,
        request: requestBody,
        response: errorResponse,
        responseTime: elapsed,
        timestamp: new Date(),
        success: false
      };
      setHistory(prev => [entry, ...prev].slice(0, 20));
      
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

  const handleLoadFromHistory = (entry: HistoryEntry) => {
    setEndpoint(entry.endpoint);
    setRequestBody(entry.request);
    setResponse(entry.response);
    setResponseTime(entry.responseTime);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("sandbox_history");
    toast({
      title: "History cleared",
      description: "All request history has been removed",
    });
  };

  const handleDownloadPostman = () => {
    window.open('/postman/leafengines-collection.json', '_blank');
    toast({
      title: "Downloading Postman Collection",
      description: "Import the JSON file into Postman or Insomnia",
    });
  };

  const selectedEndpoint = ENDPOINTS.find(e => e.value === endpoint);
  const EndpointIcon = selectedEndpoint?.icon || Code;

  // Group endpoints by category
  const groupedEndpoints = ENDPOINTS.reduce((acc, ep) => {
    if (!acc[ep.category]) acc[ep.category] = [];
    acc[ep.category].push(ep);
    return acc;
  }, {} as Record<string, Endpoint[]>);

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
              <Link to="/swagger-ui">
                <FileJson className="mr-2 h-4 w-4" />
                Swagger UI
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/leafengines-api">
                <Book className="mr-2 h-4 w-4" />
                API Documentation
              </Link>
            </Button>
            <Button variant="outline" onClick={handleDownloadPostman}>
              <Download className="mr-2 h-4 w-4" />
              Postman Collection
            </Button>
            <Button asChild>
              <Link to="/api-keys">
                <Zap className="mr-2 h-4 w-4" />
                Get Production Key
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Sidebar - Endpoint Explorer */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="mb-3 font-semibold text-foreground flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Endpoints
                  </h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {Object.entries(groupedEndpoints).map(([category, endpoints]) => (
                        <Collapsible key={category} defaultOpen>
                          <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                            {category}
                            <ChevronDown className="h-4 w-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-1 pt-1">
                            {endpoints.map((ep) => {
                              const Icon = ep.icon;
                              return (
                                <button
                                  key={ep.value}
                                  onClick={() => handleEndpointChange(ep.value)}
                                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                                    endpoint === ep.value
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted"
                                  }`}
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium">{ep.label}</div>
                                    <div className={`truncate text-xs ${endpoint === ep.value ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                      {ep.tier} tier
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Request History */}
                <Card className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History
                    </h3>
                    {history.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No requests yet</p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {history.slice(0, 10).map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => handleLoadFromHistory(entry)}
                            className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-muted"
                          >
                            <div className={`h-2 w-2 rounded-full ${entry.success ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{entry.endpoint}</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.responseTime}ms • {entry.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </Card>
              </div>

              {/* Main Panel */}
              <div className="space-y-6">
                {/* Endpoint Info Bar */}
                <Card className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <EndpointIcon className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">{selectedEndpoint?.label}</span>
                    </div>
                    <Badge variant="outline">{selectedEndpoint?.tier}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedEndpoint?.description}</span>
                    <div className="ml-auto flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopyCurl}>
                        {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "cURL"}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Request/Response Panels */}
                <div className="grid gap-6 xl:grid-cols-2">
                  {/* Request Panel */}
                  <Card className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">Request</h3>
                      <Badge variant="secondary" className="font-mono text-xs">
                        POST
                      </Badge>
                    </div>
                    
                    <div className="mb-2 rounded-md bg-muted p-2 font-mono text-xs text-muted-foreground overflow-x-auto">
                      {SANDBOX_URL}?endpoint={endpoint}
                    </div>
                    
                    <div className="space-y-4">
                      <Textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="min-h-[280px] font-mono text-sm"
                        placeholder="Enter JSON request body..."
                      />
                      
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
                      <h3 className="text-lg font-bold text-foreground">Response</h3>
                      {responseTime !== null && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {responseTime}ms
                        </Badge>
                      )}
                    </div>
                    
                    {/* Response Headers (collapsed by default) */}
                    {Object.keys(responseHeaders).length > 0 && (
                      <Collapsible className="mb-3">
                        <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ChevronRight className="h-3 w-3" />
                          Response Headers ({Object.keys(responseHeaders).length})
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 rounded-md bg-muted p-2 font-mono text-xs">
                            {Object.entries(responseHeaders).map(([key, value]) => (
                              <div key={key} className="flex">
                                <span className="text-primary">{key}:</span>
                                <span className="ml-2 text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    
                    <Textarea
                      value={response || "// Response will appear here after sending a request..."}
                      className={`min-h-[280px] font-mono text-sm ${
                        response.includes('"error"') 
                          ? 'border-destructive/50 bg-destructive/5' 
                          : response 
                            ? 'border-green-500/50 bg-green-500/5'
                            : ''
                      }`}
                      readOnly
                    />
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 sm:grid-cols-4">
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                        <Code className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Demo Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Returns realistic sample data
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
                          Sandbox: 10 req/min
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.open('/swagger-ui', '_blank')}>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                        <FileJson className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-1">
                          Swagger UI
                          <ExternalLink className="h-3 w-3" />
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Full OpenAPI explorer
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Link to="/api-keys">
                    <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900">
                          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Go Live</h4>
                          <p className="text-sm text-muted-foreground">
                            Get production API key
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
