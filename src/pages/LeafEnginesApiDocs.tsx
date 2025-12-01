import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Book, Key, Zap, Shield, Globe, ArrowRight, Copy, CheckCircle2, ClipboardList } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";
import leafEnginesLogo from "@/assets/leafengines-logo.png";

const LeafEnginesApiDocs = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    toast({
      title: "Copied to clipboard",
      description: `${label} example copied successfully`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlExample = `curl -X POST https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/leafengines-query \\
  -H "x-api-key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "plant": {
      "common_name": "Tomato",
      "care_requirements": {
        "sun_exposure": "full_sun",
        "water_needs": "medium",
        "soil_ph_range": { "min": 6.0, "max": 6.8 }
      }
    },
    "options": {
      "include_satellite_data": true,
      "include_water_quality": true
    }
  }'`;

  const jsExample = `const leafEngines = {
  apiKey: 'your_api_key_here',
  baseUrl: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1',
  
  async query(location, plant, options = {}) {
    const response = await fetch(\`\${this.baseUrl}/leafengines-query\`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location, plant, options })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    
    return response.json();
  }
};

// Example usage
const result = await leafEngines.query(
  { latitude: 40.7128, longitude: -74.0060 },
  {
    common_name: "Tomato",
    care_requirements: {
      sun_exposure: "full_sun",
      water_needs: "medium",
      soil_ph_range: { min: 6.0, max: 6.8 }
    }
  },
  { include_satellite_data: true }
);

console.log('Compatibility Score:', result.data.overall_score);`;

  const pythonExample = `import requests
import json

class LeafEngines:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1'
    
    def query(self, location, plant, options=None):
        url = f'{self.base_url}/leafengines-query'
        headers = {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json'
        }
        payload = {
            'location': location,
            'plant': plant,
            'options': options or {}
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

# Example usage
client = LeafEngines('your_api_key_here')

result = client.query(
    location={'latitude': 40.7128, 'longitude': -74.0060},
    plant={
        'common_name': 'Tomato',
        'care_requirements': {
            'sun_exposure': 'full_sun',
            'water_needs': 'medium',
            'soil_ph_range': {'min': 6.0, 'max': 6.8}
        }
    },
    options={'include_satellite_data': True}
)

print(f"Compatibility Score: {result['data']['overall_score']}")`;

  const responseExample = `{
  "success": true,
  "data": {
    "overall_score": 78,
    "soil_compatibility": 85,
    "water_compatibility": 72,
    "climate_compatibility": 75,
    "breakdown": {
      "soil": {
        "score": 85,
        "factors": [
          "Soil pH (6.5) is optimal for plant",
          "Good organic matter content supports healthy growth",
          "Adequate nitrogen levels"
        ],
        "concerns": []
      },
      "water": {
        "score": 72,
        "factors": ["Low contamination risk in area", "Safe nitrate levels in water"],
        "concerns": ["Elevated salinity detected"]
      },
      "climate": {
        "score": 75,
        "factors": [
          "High vegetation health in area",
          "Soil moisture levels compatible with plant needs"
        ],
        "concerns": []
      }
    },
    "recommendations": [
      "Monitor irrigation water salinity",
      "Consider drip irrigation for water efficiency",
      "Test soil annually to maintain optimal pH"
    ],
    "risk_level": "low",
    "metadata": {
      "location": "New York County, NY",
      "timestamp": "2025-01-25T14:30:00Z",
      "data_sources": ["USDA_NRCS", "EPA_WQP", "ALPHA_EARTH"]
    }
  },
  "usage": {
    "credits_used": 1,
    "response_time_ms": 847
  }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <LeafEnginesNav />
      
      {/* Large Subtle Logo Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img 
          src={leafEnginesLogo} 
          alt="" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-auto opacity-[0.03] select-none"
        />
      </div>
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="container mx-auto px-4 py-16">
          <Badge className="mb-4" variant="outline">
            <Book className="mr-2 h-3 w-3" />
            API Documentation
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            LeafEngines™ API Reference
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Integrate environmental intelligence into your plant identification app. 
            Turn "what is this plant?" into "how do I keep it alive here?"
          </p>
          <div className="mt-6 flex gap-4">
            <Button size="lg" asChild>
              <Link to="/client-integration-guide">
                <ClipboardList className="mr-2 h-4 w-4" />
                Integration Guide
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View Quickstart
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Key Features */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Real-Time Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get environmental compatibility scores (0-100) in under 1 second using multi-agency data fusion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Global Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                3,000+ US counties with USDA soil data, EPA water quality, and Google Earth Engine satellite imagery.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Patent-Protected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proprietary algorithms for hierarchical cache optimization and environmental impact assessment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quickstart */}
        <Card className="mb-12" id="quickstart">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Start</CardTitle>
            <CardDescription>Get up and running in 3 steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Get Your API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact <a href="mailto:sales@leafengines.com" className="text-primary hover:underline">sales@leafengines.com</a> for partner access and API credentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Make Your First Request</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Send a POST request to the query endpoint with location and plant data:
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{curlExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(curlExample, "cURL")}
                    >
                      {copiedCode === "cURL" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Parse the Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a comprehensive compatibility score with actionable recommendations to display in your app.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Authentication</CardTitle>
            <CardDescription>Secure your API requests with API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              All requests must include your API key in the <code className="bg-muted px-2 py-1 rounded">x-api-key</code> header:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>x-api-key: your_api_key_here</code>
            </pre>
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="text-sm font-semibold">Security Best Practices</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                <li>Never expose API keys in client-side code or public repositories</li>
                <li>Store keys in environment variables or secure key management systems</li>
                <li>Rotate keys regularly and immediately if compromised</li>
                <li>Use different keys for development and production environments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoint */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">POST /leafengines-query</CardTitle>
            <CardDescription>Get environmental compatibility analysis for a plant at a specific location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Request Body</h3>
              <div className="space-y-4">
                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">location</code>
                  <Badge variant="destructive" className="ml-2 text-xs">required</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Location information for environmental analysis</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><code>latitude</code> (number): Geographic latitude</li>
                    <li><code>longitude</code> (number): Geographic longitude</li>
                    <li><code>county_fips</code> (string): 5-digit FIPS code (alternative to lat/lng)</li>
                    <li><code>address</code> (string): Street address (for future geocoding)</li>
                  </ul>
                </div>

                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">plant</code>
                  <Badge variant="destructive" className="ml-2 text-xs">required</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Plant identification and care requirements</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><code>common_name</code> (string): Plant common name</li>
                    <li><code>scientific_name</code> (string): Scientific name</li>
                    <li><code>plant_id</code> (string): Internal plant database ID</li>
                    <li><code>care_requirements</code> (object): Plant care needs
                      <ul className="ml-4 mt-1">
                        <li><code>sun_exposure</code>: full_sun | partial_shade | full_shade</li>
                        <li><code>water_needs</code>: low | medium | high</li>
                        <li><code>soil_ph_range</code>: {`{ min: number, max: number }`}</li>
                        <li><code>hardiness_zones</code>: string[] (e.g., ["6a", "7b"])</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <code className="bg-muted px-2 py-1 rounded text-sm">options</code>
                  <Badge variant="outline" className="ml-2 text-xs">optional</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Additional data sources to include</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><code>include_satellite_data</code> (boolean): Include Google Earth Engine data</li>
                    <li><code>include_water_quality</code> (boolean): Include EPA water quality data</li>
                    <li><code>include_recommendations</code> (boolean): Include care recommendations (default: true)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Response</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{responseExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(responseExample, "Response")}
                >
                  {copiedCode === "Response" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Response Fields</h3>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-muted px-2 py-1 rounded">overall_score</code> (0-100): Combined environmental compatibility</li>
                <li><code className="bg-muted px-2 py-1 rounded">soil_compatibility</code> (0-100): Soil condition match</li>
                <li><code className="bg-muted px-2 py-1 rounded">water_compatibility</code> (0-100): Water quality assessment</li>
                <li><code className="bg-muted px-2 py-1 rounded">climate_compatibility</code> (0-100): Climate suitability</li>
                <li><code className="bg-muted px-2 py-1 rounded">breakdown</code>: Detailed analysis per category with factors and concerns</li>
                <li><code className="bg-muted px-2 py-1 rounded">recommendations</code>: Actionable care suggestions</li>
                <li><code className="bg-muted px-2 py-1 rounded">risk_level</code>: low | medium | high</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Code Examples</CardTitle>
            <CardDescription>Integration examples in multiple languages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>

              <TabsContent value="javascript" className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{jsExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(jsExample, "JavaScript")}
                >
                  {copiedCode === "JavaScript" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="python" className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{pythonExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pythonExample, "Python")}
                >
                  {copiedCode === "Python" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="curl" className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{curlExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(curlExample, "cURL")}
                >
                  {copiedCode === "cURL" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Error Handling</CardTitle>
            <CardDescription>Common errors and how to handle them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-semibold text-sm">401 Unauthorized</p>
                <p className="text-sm text-muted-foreground">Invalid or missing API key. Check your x-api-key header.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-semibold text-sm">403 Forbidden</p>
                <p className="text-sm text-muted-foreground">API key doesn't have access to this endpoint. Contact support.</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-semibold text-sm">400 Bad Request</p>
                <p className="text-sm text-muted-foreground">Invalid request format. Check required fields in location and plant objects.</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-semibold text-sm">429 Too Many Requests</p>
                <p className="text-sm text-muted-foreground">Rate limit exceeded. Implement exponential backoff and retry logic.</p>
              </div>
              <div className="border-l-4 border-gray-500 pl-4 py-2">
                <p className="font-semibold text-sm">500 Internal Server Error</p>
                <p className="text-sm text-muted-foreground">Server error. Retry the request. If it persists, contact support.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits & Pricing */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Rate Limits & Pricing</CardTitle>
            <CardDescription>Usage tiers and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>For emerging plant ID apps</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-2">$500</p>
                  <p className="text-sm text-muted-foreground mb-4">per month</p>
                  <ul className="text-sm space-y-2">
                    <li>✓ 50,000 calls/month</li>
                    <li>✓ 1,000 requests/minute</li>
                    <li>✓ EPA water quality data</li>
                    <li>✓ FIPS location intelligence</li>
                    <li>✓ Email support (48hr)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>With satellite monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-2">$1,500</p>
                  <p className="text-sm text-muted-foreground mb-4">per month</p>
                  <ul className="text-sm space-y-2">
                    <li>✓ 250,000 calls/month</li>
                    <li>✓ 2,500 requests/minute</li>
                    <li>✓ AlphaEarth satellite data</li>
                    <li>✓ Real-time NDVI & soil moisture</li>
                    <li>✓ Priority support (24hr)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Custom</CardTitle>
                  <CardDescription>White-label enterprise solution</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-2">Custom</p>
                  <p className="text-sm text-muted-foreground mb-4">pricing</p>
                  <ul className="text-sm space-y-2">
                    <li>✓ Unlimited API calls</li>
                    <li>✓ Custom rate limits</li>
                    <li>✓ White-label options</li>
                    <li>✓ Dedicated account manager</li>
                    <li>✓ 24/7 phone & Slack support</li>
                    <li>✓ Custom SLA agreements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="text-sm font-semibold">Need Help Choosing?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Contact <a href="mailto:sales@leafengines.com" className="text-primary hover:underline">sales@leafengines.com</a> to discuss your app's needs and find the right tier
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Support & Resources</CardTitle>
            <CardDescription>Get help and stay updated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Contact Sales</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Schedule a demo or discuss enterprise plans
                </p>
                <Button variant="outline">
                  <a href="mailto:sales@leafengines.com">sales@leafengines.com</a>
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Get help with integration and troubleshooting
                </p>
                <Button variant="outline">
                  <a href="mailto:support@leafengines.com">support@leafengines.com</a>
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Developer Sandbox</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Test the API with live data
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/developer-sandbox'}>
                  Try It Now
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status & Uptime</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Monitor API availability and performance
                </p>
                <Button variant="outline">
                  View Status Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeafEnginesApiDocs;
