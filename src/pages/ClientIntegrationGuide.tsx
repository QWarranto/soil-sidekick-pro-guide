import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Code, Database, Shield, Zap, FileText, Server, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";

const ClientIntegrationGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <LeafEnginesNav />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">API Integration Guide</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LeafEngines™ API Integration Checklist
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything your team needs to prepare for a successful API demo and production deployment
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link to="/leafengines-api">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View complete API reference</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/developer-sandbox">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Code className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">Developer Sandbox</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Test API calls interactively</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/pricing-new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Zap className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-lg">Pricing & Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View rate limits and costs</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tier-guide" className="mb-12">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tier-guide">Tier Guide</TabsTrigger>
            <TabsTrigger value="technical">Technical Setup</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="business">Business Prep</TabsTrigger>
            <TabsTrigger value="demo">Demo Checklist</TabsTrigger>
          </TabsList>

          {/* Tier-Specific Guidance */}
          <TabsContent value="tier-guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Integration Path</CardTitle>
                <CardDescription>Each tier is designed for different scales and use cases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Starter Tier */}
                <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Starter - $500/month</h3>
                      <p className="text-sm text-muted-foreground">Perfect for emerging plant ID apps testing market fit</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Apps with &lt;50k users</li>
                        <li>• MVP and beta testing</li>
                        <li>• Small development teams</li>
                        <li>• Budget-conscious startups</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What You Get:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• 50,000 API calls/month</li>
                        <li>• 1,000 requests/minute</li>
                        <li>• EPA water quality data</li>
                        <li>• Email support (48hr)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Integration Priority:</h4>
                    <p className="text-sm text-muted-foreground">Focus on core compatibility scores. Skip satellite features. Implement caching aggressively to stay within limits.</p>
                  </div>
                </div>

                {/* Professional Tier */}
                <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Professional - $1,500/month</h3>
                      <Badge className="ml-2">Most Popular</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Complete environmental intelligence with satellite monitoring</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Apps with 50k-500k users</li>
                        <li>• Revenue-generating products</li>
                        <li>• Premium feature differentiation</li>
                        <li>• Agricultural focus apps</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What You Get:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• 250,000 API calls/month</li>
                        <li>• 2,500 requests/minute</li>
                        <li>• AlphaEarth satellite data</li>
                        <li>• Real-time NDVI & soil moisture</li>
                        <li>• Priority support (24hr)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Integration Priority:</h4>
                    <p className="text-sm text-muted-foreground">Implement full satellite intelligence. Build premium features around thermal stress indicators and NDVI data. Perfect for subscription upsells.</p>
                  </div>
                </div>

                {/* Custom Tier */}
                <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Custom - Enterprise Pricing</h3>
                      <p className="text-sm text-muted-foreground">White-label solution with dedicated infrastructure</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Best For:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Apps with 500k+ users</li>
                        <li>• Enterprise clients</li>
                        <li>• White-label requirements</li>
                        <li>• Mission-critical applications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What You Get:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Unlimited API calls</li>
                        <li>• Custom rate limits</li>
                        <li>• White-label branding</li>
                        <li>• Dedicated account manager</li>
                        <li>• 24/7 support & SLA</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Integration Priority:</h4>
                    <p className="text-sm text-muted-foreground">Full platform integration with custom features. Work directly with your dedicated account manager for custom data sources and integrations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-center p-3">Starter</th>
                        <th className="text-center p-3">Professional</th>
                        <th className="text-center p-3">Custom</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">API Calls/Month</td>
                        <td className="text-center p-3">50,000</td>
                        <td className="text-center p-3">250,000</td>
                        <td className="text-center p-3">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Rate Limit</td>
                        <td className="text-center p-3">1,000/min</td>
                        <td className="text-center p-3">2,500/min</td>
                        <td className="text-center p-3">Custom</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">EPA Water Quality</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">FIPS Intelligence</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">AlphaEarth Satellite</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Real-time NDVI</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">✓</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">White-label Options</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Support Response</td>
                        <td className="text-center p-3">48hr</td>
                        <td className="text-center p-3">24hr</td>
                        <td className="text-center p-3">24/7</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Account Manager</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">-</td>
                        <td className="text-center p-3">✓</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Pricing</td>
                        <td className="text-center p-3 font-semibold">$500/mo</td>
                        <td className="text-center p-3 font-semibold">$1,500/mo</td>
                        <td className="text-center p-3 font-semibold">Custom</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Prerequisites */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Technical Prerequisites
                </CardTitle>
                <CardDescription>Infrastructure and capabilities required before integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">HTTP/REST Client Capability</h4>
                      <p className="text-sm text-muted-foreground">Support for POST requests with JSON payloads and Bearer token authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Secure API Key Storage</h4>
                      <p className="text-sm text-muted-foreground">Environment variables, secrets manager, or encrypted vault for storing API credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">JSON Parsing & Serialization</h4>
                      <p className="text-sm text-muted-foreground">Native JSON handling in your programming language (JavaScript, Python, Java, C#, etc.)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Error Handling & Retry Logic</h4>
                      <p className="text-sm text-muted-foreground">Exponential backoff for rate limits (429 errors), timeout handling, and graceful degradation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Rate Limit Tracking System</h4>
                      <p className="text-sm text-muted-foreground">Local tracking to stay within tier quotas (Starter: 1,000 req/min, Professional: 2,500 req/min, Custom: Unlimited)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">HTTPS/TLS 1.2+ Support</h4>
                      <p className="text-sm text-muted-foreground">All API calls must be made over secure HTTPS connections</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Recommended Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Backend Languages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Node.js / TypeScript</li>
                      <li>• Python (requests library)</li>
                      <li>• Java (Spring Boot)</li>
                      <li>• C# (.NET Core)</li>
                      <li>• Go (net/http package)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Infrastructure</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Docker/Kubernetes ready</li>
                      <li>• AWS Lambda compatible</li>
                      <li>• Azure Functions compatible</li>
                      <li>• Cloud Run compatible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Requirements */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Integration Architecture
                </CardTitle>
                <CardDescription>System components needed to integrate LeafEngines API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">User Request Endpoints</h4>
                      <p className="text-sm text-muted-foreground">API routes in your application that receive plant identification requests from end users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Data Storage Layer</h4>
                      <p className="text-sm text-muted-foreground">Database tables to store plant query results, user associations, and query history</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                        <p className="font-mono">Suggested schema: plant_queries (id, user_id, plant_id, county_fips, result_data, queried_at)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Usage Analytics Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Internal dashboard to monitor API consumption, track usage against tier limits, and view cost projections</p>
                    </div>
                  </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Usage Monitoring & Billing</h4>
                        <p className="text-sm text-muted-foreground">System to track API usage, monitor against tier limits, and alert when approaching monthly caps (All tiers)</p>
                      </div>
                    </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Image Handling Pipeline (Optional)</h4>
                      <p className="text-sm text-muted-foreground">If using image-based plant ID: image upload, compression, and temporary storage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Webhook Endpoints (Optional)</h4>
                      <p className="text-sm text-muted-foreground">For async processing: endpoints to receive callbacks when long-running queries complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Integration Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">1</span>
                    <span>User makes plant ID request in your app</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">2</span>
                    <span>Your backend validates request and checks rate limits</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">3</span>
                    <span>Call LeafEngines API with plant_id, latitude, longitude, county_fips</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">4</span>
                    <span>Receive environmental intelligence data (EPA scores, satellite data, water quality)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">5</span>
                    <span>Store result in your database with user association</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">6</span>
                    <span>Return formatted data to user in your UI</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="font-bold text-primary">7</span>
                    <span>Log usage for billing and analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Readiness */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Business & Contractual Preparation
                </CardTitle>
                <CardDescription>Business decisions and planning before API activation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Define Use Case</h4>
                      <p className="text-sm text-muted-foreground mb-2">Clarify how LeafEngines fits into your product:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                        <li>• Agricultural advisory platforms</li>
                        <li>• Garden planning apps</li>
                        <li>• Precision farming tools</li>
                        <li>• Environmental impact assessment</li>
                        <li>• Real estate & land valuation</li>
                        <li>• Supply chain sustainability tracking</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Estimate Request Volumes</h4>
                      <p className="text-sm text-muted-foreground mb-2">Choose the appropriate tier based on expected usage:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <div className="p-3 border rounded-lg">
                          <p className="font-semibold text-sm">Starter</p>
                          <p className="text-xs text-muted-foreground">50,000 API calls/month</p>
                          <p className="text-xs text-muted-foreground">1,000 req/min rate limit</p>
                          <p className="text-xs text-muted-foreground">$500/month</p>
                        </div>
                        <div className="p-3 border rounded-lg border-primary">
                          <p className="font-semibold text-sm">Professional</p>
                          <p className="text-xs text-muted-foreground">250,000 API calls/month</p>
                          <p className="text-xs text-muted-foreground">2,500 req/min rate limit</p>
                          <p className="text-xs text-muted-foreground">$1,500/month</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="font-semibold text-sm">Custom</p>
                          <p className="text-xs text-muted-foreground">Unlimited API calls</p>
                          <p className="text-xs text-muted-foreground">Custom rate limits</p>
                          <p className="text-xs text-muted-foreground">Custom pricing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Budget for Overage Charges</h4>
                        <p className="text-sm text-muted-foreground">Starter and Professional tiers have fixed monthly limits. Custom tier includes flexible usage. Plan for:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                          <li>• Seasonal usage spikes (planting/harvest seasons)</li>
                          <li>• Marketing campaigns that drive user growth</li>
                          <li>• Upgrading tiers if consistently hitting limits</li>
                        </ul>
                      </div>
                    </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Map User Flow</h4>
                      <p className="text-sm text-muted-foreground">Document where plant identification fits in your product:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>• Entry point (search bar, camera button, property lookup)</li>
                        <li>• Data display (embedded widget, dedicated page, PDF export)</li>
                        <li>• User actions (save to library, share report, request consultation)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Legal & Compliance Review</h4>
                      <p className="text-sm text-muted-foreground">Have your legal team review:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>• Data sharing agreements (EPA data, satellite imagery)</li>
                        <li>• End-user terms (liability disclaimers for agricultural decisions)</li>
                        <li>• Data retention policies</li>
                        <li>• GDPR/CCPA compliance if applicable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Checklist */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Demo Day Preparation
                </CardTitle>
                <CardDescription>Final checklist before your API demo with SoilSidekick</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Staging Environment Ready</h4>
                      <p className="text-sm text-muted-foreground">Separate from production with test API keys provided by SoilSidekick</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Sample Data Prepared</h4>
                      <p className="text-sm text-muted-foreground">Test with these example values:</p>
                      <div className="mt-2 p-3 bg-muted rounded-lg text-xs font-mono">
                        plant_id: "ZEMA" (Corn)<br />
                        latitude: 41.8781<br />
                        longitude: -87.6298<br />
                        county_fips: "17031" (Cook County, IL)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Monitoring & Logging Active</h4>
                      <p className="text-sm text-muted-foreground">Enable debug logs to observe API behavior during demo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Error Handling Tested</h4>
                      <p className="text-sm text-muted-foreground">Verify graceful handling of:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>• 401 Unauthorized (invalid API key)</li>
                        <li>• 429 Rate Limit Exceeded</li>
                        <li>• 500 Server Errors</li>
                        <li>• Network timeouts</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Demo Script Prepared</h4>
                      <p className="text-sm text-muted-foreground">Walk through:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>1. User initiates plant identification in your UI</li>
                        <li>2. Show API call being made (network inspector or logs)</li>
                        <li>3. Display environmental intelligence results</li>
                        <li>4. Demonstrate stored data in your system</li>
                        <li>5. Show analytics/usage tracking dashboard</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Questions List Prepared</h4>
                      <p className="text-sm text-muted-foreground">Bring specific questions about:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                        <li>• Scaling to higher tiers</li>
                        <li>• Custom data fields you may need</li>
                        <li>• SLA guarantees and uptime</li>
                        <li>• White-label or co-branding options</li>
                        <li>• Integration support timeline</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Post-Demo Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>After a successful demo, you'll receive:</p>
                <ul className="space-y-1 ml-4 text-muted-foreground">
                  <li>✓ Production API keys</li>
                  <li>✓ Signed licensing agreement with rate limits and pricing</li>
                  <li>✓ Technical support contact (Slack channel or dedicated email)</li>
                  <li>✓ Access to LeafEngines partner portal for usage analytics</li>
                  <li>✓ Monthly invoicing setup</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Generate a free sandbox API key instantly or request access to paid tiers for production use.
              Our integration team will work with you to ensure a smooth onboarding experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/api-keys">
                  Get Your API Key
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/developer-sandbox">
                  Try Sandbox
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientIntegrationGuide;