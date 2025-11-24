import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Copy, CheckCircle2, Lock, Zap, Database, Satellite, Droplet } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-foreground">API Documentation</h1>
              <p className="text-lg text-muted-foreground">
                Environmental Intelligence Layer • RESTful APIs • Real-time Data
              </p>
            </div>
            <Button asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <section className="border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-foreground">Quick Start</h2>
            
            <Alert className="mb-6">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                All API requests require authentication. Contact sales to obtain your API key.
              </AlertDescription>
            </Alert>

            <Card className="overflow-hidden">
              <div className="bg-muted p-4">
                <p className="text-sm font-semibold text-foreground">Base URL</p>
              </div>
              <div className="relative bg-slate-950 p-4">
                <code className="text-sm text-green-400">https://api.soilsidekick.com/v1</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard("https://api.soilsidekick.com/v1", "base")}
                >
                  {copiedEndpoint === "base" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>

            <Card className="mt-6 overflow-hidden">
              <div className="bg-muted p-4">
                <p className="text-sm font-semibold text-foreground">Authentication Header</p>
              </div>
              <div className="relative bg-slate-950 p-4">
                <pre className="text-sm text-green-400">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY\nContent-Type: application/json', "auth")}
                >
                  {copiedEndpoint === "auth" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-3xl font-bold text-foreground">Available APIs</h2>

            <Tabs defaultValue="environmental" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="environmental">Environmental Score</TabsTrigger>
                <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
                <TabsTrigger value="water">Water Quality</TabsTrigger>
                <TabsTrigger value="fips">Location Intelligence</TabsTrigger>
              </TabsList>

              {/* Environmental Compatibility Score API */}
              <TabsContent value="environmental" className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-3 bg-primary/10 p-6">
                    <div className="rounded-lg bg-primary/20 p-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Environmental Compatibility Score API</h3>
                      <Badge variant="secondary" className="mt-2">
                        Patent-Protected
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-6 text-lg text-muted-foreground">
                      Real-time assessment of whether a specific plant will thrive at a given location based on multi-agency environmental data.
                    </p>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Pricing</p>
                        <p className="text-muted-foreground">$0.03 per request</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Rate Limit</p>
                        <p className="text-muted-foreground">1000 req/min</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Response Time</p>
                        <p className="text-muted-foreground">~800ms avg</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Endpoint</p>
                        <div className="relative overflow-hidden rounded-lg bg-slate-950">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-600">POST</Badge>
                              <code className="text-sm text-green-400">/environmental-score</code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("/environmental-score", "env-endpoint")}
                            >
                              {copiedEndpoint === "env-endpoint" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Request Body</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "plant_id": "monstera-deliciosa",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "county_fips": "36061"
  },
  "planting_date": "2024-03-15"
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "plant_id": "monstera-deliciosa",\n  "location": {\n    "latitude": 40.7128,\n    "longitude": -74.0060,\n    "county_fips": "36061"\n  },\n  "planting_date": "2024-03-15"\n}', "env-request")}
                          >
                            {copiedEndpoint === "env-request" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Response</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "compatibility_score": 87,
  "risk_level": "low",
  "factors": {
    "soil_ph": { "optimal": true, "current": 6.8 },
    "water_quality": { "optimal": true, "contamination_risk": "none" },
    "climate": { "optimal": true, "hardiness_zone": "7b" },
    "satellite_health": { "ndvi": 0.82, "soil_moisture": "adequate" }
  },
  "recommendations": [
    "Soil conditions are ideal for Monstera deliciosa",
    "Monitor soil moisture weekly during summer months"
  ],
  "alerts": []
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "compatibility_score": 87,\n  "risk_level": "low",\n  "factors": {...},\n  "recommendations": [...],\n  "alerts": []\n}', "env-response")}
                          >
                            {copiedEndpoint === "env-response" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Satellite Monitoring API */}
              <TabsContent value="satellite" className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-3 bg-primary/10 p-6">
                    <div className="rounded-lg bg-primary/20 p-3">
                      <Satellite className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">AlphaEarth Satellite Intelligence API</h3>
                      <Badge variant="secondary" className="mt-2">
                        Real-Time Imagery
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-6 text-lg text-muted-foreground">
                      Live NDVI, soil moisture, and thermal analysis from satellite imagery for precise plant health monitoring.
                    </p>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Pricing</p>
                        <p className="text-muted-foreground">$0.05 per request</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Rate Limit</p>
                        <p className="text-muted-foreground">500 req/min</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Response Time</p>
                        <p className="text-muted-foreground">~1.2s avg</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Endpoint</p>
                        <div className="relative overflow-hidden rounded-lg bg-slate-950">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-600">POST</Badge>
                              <code className="text-sm text-green-400">/satellite-data</code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("/satellite-data", "sat-endpoint")}
                            >
                              {copiedEndpoint === "sat-endpoint" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Request Body</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "area_size_acres": 0.25,
  "data_types": ["ndvi", "soil_moisture", "thermal"]
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "location": {...},\n  "area_size_acres": 0.25,\n  "data_types": ["ndvi", "soil_moisture", "thermal"]\n}', "sat-request")}
                          >
                            {copiedEndpoint === "sat-request" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Response</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "timestamp": "2024-01-15T14:30:00Z",
  "imagery_date": "2024-01-14T10:15:00Z",
  "ndvi": {
    "average": 0.78,
    "range": [0.65, 0.92],
    "health_status": "healthy"
  },
  "soil_moisture": {
    "percentage": 42,
    "status": "adequate",
    "trend": "stable"
  },
  "thermal": {
    "surface_temp_f": 72,
    "stress_indicators": "none"
  }
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "timestamp": "2024-01-15T14:30:00Z",\n  "ndvi": {...},\n  "soil_moisture": {...},\n  "thermal": {...}\n}', "sat-response")}
                          >
                            {copiedEndpoint === "sat-response" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Water Quality API */}
              <TabsContent value="water" className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-3 bg-primary/10 p-6">
                    <div className="rounded-lg bg-primary/20 p-3">
                      <Droplet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">EPA Water Quality API</h3>
                      <Badge variant="secondary" className="mt-2">
                        Government Data
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-6 text-lg text-muted-foreground">
                      Location-specific water quality analysis and contamination alerts from EPA databases.
                    </p>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Pricing</p>
                        <p className="text-muted-foreground">$0.02 per request</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Rate Limit</p>
                        <p className="text-muted-foreground">2000 req/min</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Response Time</p>
                        <p className="text-muted-foreground">~500ms avg</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Endpoint</p>
                        <div className="relative overflow-hidden rounded-lg bg-slate-950">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-blue-600">GET</Badge>
                              <code className="text-sm text-green-400">/water-quality/:county_fips</code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("/water-quality/:county_fips", "water-endpoint")}
                            >
                              {copiedEndpoint === "water-endpoint" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Response</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "county_fips": "36061",
  "water_sources": [
    {
      "source_type": "municipal",
      "quality_score": 92,
      "contaminants": [],
      "last_tested": "2024-01-10"
    }
  ],
  "irrigation_safety": "safe",
  "alerts": [],
  "recommendations": [
    "Municipal water supply meets all EPA standards"
  ]
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "county_fips": "36061",\n  "water_sources": [...],\n  "irrigation_safety": "safe",\n  "alerts": [],\n  "recommendations": [...]\n}', "water-response")}
                          >
                            {copiedEndpoint === "water-response" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* FIPS Location Intelligence API */}
              <TabsContent value="fips" className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-3 bg-primary/10 p-6">
                    <div className="rounded-lg bg-primary/20 p-3">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Federal FIPS Location Intelligence API</h3>
                      <Badge variant="secondary" className="mt-2">
                        County-Level Data
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-6 text-lg text-muted-foreground">
                      Comprehensive soil composition, climate patterns, and growing conditions at the county level.
                    </p>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Pricing</p>
                        <p className="text-muted-foreground">$0.01 per request</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Rate Limit</p>
                        <p className="text-muted-foreground">5000 req/min</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">Response Time</p>
                        <p className="text-muted-foreground">~200ms avg</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Endpoint</p>
                        <div className="relative overflow-hidden rounded-lg bg-slate-950">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-blue-600">GET</Badge>
                              <code className="text-sm text-green-400">/location-data/:county_fips</code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("/location-data/:county_fips", "fips-endpoint")}
                            >
                              {copiedEndpoint === "fips-endpoint" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">Response</p>
                        <div className="relative overflow-hidden rounded-lg">
                          <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-green-400">
{`{
  "county_fips": "36061",
  "county_name": "New York County",
  "state": "NY",
  "soil_data": {
    "dominant_type": "Urban land",
    "ph_range": [6.5, 7.5],
    "organic_matter_avg": 3.2,
    "drainage": "well-drained"
  },
  "climate": {
    "hardiness_zone": "7b",
    "avg_temp_f": 54.6,
    "annual_rainfall_inches": 49.9,
    "frost_dates": {
      "last_spring": "2024-04-15",
      "first_fall": "2024-11-01"
    }
  },
  "growing_season_days": 199
}`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard('{\n  "county_fips": "36061",\n  "county_name": "New York County",\n  "soil_data": {...},\n  "climate": {...},\n  "growing_season_days": 199\n}', "fips-response")}
                          >
                            {copiedEndpoint === "fips-response" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Error Codes */}
            <Card className="mt-8">
              <div className="bg-muted p-4">
                <h3 className="text-xl font-semibold text-foreground">Error Codes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="destructive">401</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Unauthorized</p>
                      <p className="text-sm text-muted-foreground">Invalid or missing API key</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="destructive">429</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Rate Limit Exceeded</p>
                      <p className="text-sm text-muted-foreground">Too many requests. Check rate limits for your tier.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="destructive">500</Badge>
                    <div>
                      <p className="font-semibold text-foreground">Internal Server Error</p>
                      <p className="text-sm text-muted-foreground">Contact support if this persists</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Contact our sales team to obtain API credentials and start integrating environmental intelligence into your app.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg">
                Contact Sales
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing Tiers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
