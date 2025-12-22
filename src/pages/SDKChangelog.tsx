import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Leaf,
  Shield,
  Users,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";

const SDKChangelog = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = "npm install @soilsidekick/sdk@1.2.0";

  const usageExample = `import { Configuration, ConsumerPlantCareApi } from '@soilsidekick/sdk';

const config = new Configuration({
  apiKey: 'ak_your_api_key'
});

const plantCareApi = new ConsumerPlantCareApi(config);

// Safe plant identification
const identification = await plantCareApi.safeIdentification({
  image: 'base64_or_url',
  location: { county_fips: '12086' },
  context: { environment: 'wild', purpose: 'foraging' }
});

// Dynamic care recommendations
const care = await plantCareApi.dynamicCare({
  plant_species: 'Monstera deliciosa',
  location: { county_fips: '12086', indoor: true },
  container_details: { type: 'terracotta', has_drainage: true }
});

// Beginner guidance
const guidance = await plantCareApi.beginnerGuidance({
  plant_species: 'Pothos',
  experience_level: 'first_plant',
  concerns: ['watering', 'light']
});`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <LeafEnginesNav />
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="outline" className="text-lg px-4 py-1">
              <Package className="mr-2 h-4 w-4" />
              SDK Changelog
            </Badge>
            <a 
              href="https://www.npmjs.com/package/@soilsidekick/sdk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <img 
                src="https://img.shields.io/npm/v/@soilsidekick/sdk?style=flat-square&logo=npm&label=npm" 
                alt="npm version"
                className="h-5"
              />
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            SoilSidekick SDK Version History
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Track changes, new features, and improvements across SDK releases.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Current Version Highlight */}
        <Card className="mb-12 border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Badge className="mb-2 bg-primary">Current Release</Badge>
                  <CardTitle className="text-2xl">Version 1.2.0</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Published December 2025</p>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-muted p-3 rounded-lg text-sm font-mono">
                  {installCommand}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => copyToClipboard(installCommand, "Install command")}
                >
                  {copiedCode === "Install command" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4 mb-8">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-primary">20</p>
                <p className="text-sm text-muted-foreground">Total Endpoints</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-green-500">+3</p>
                <p className="text-sm text-muted-foreground">New Endpoints</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-foreground">6</p>
                <p className="text-sm text-muted-foreground">SDK Languages</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Subscription Tiers</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              What's New: Consumer Plant Care APIs
            </h3>
            <p className="text-muted-foreground mb-6">
              Version 1.2.0 expands SoilSidekick from a B2B agricultural platform into the B2C consumer plant care market, 
              addressing specific pain points identified in competitor analysis.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base">/safe-identification</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Starter Tier</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Toxic lookalike warnings and environmental context for safer plant identification, 
                    especially for foraging.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">/dynamic-care</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Starter Tier</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hyper-localized, real-time care recommendations based on current conditions, 
                    not generic schedules.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-base">/beginner-guidance</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Starter Tier</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Judgment-free, jargon-free plant guidance for new plant parents with 
                    step-by-step instructions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Version Comparison Tabs */}
        <Tabs defaultValue="v120" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="v120">v1.2.0 (Current)</TabsTrigger>
            <TabsTrigger value="v110">v1.1.0 (Previous)</TabsTrigger>
          </TabsList>

          <TabsContent value="v120" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version 1.2.0 — Consumer Plant Care APIs</CardTitle>
                <p className="text-muted-foreground">Released December 2025</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">All Endpoints by Tier</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2">Free Tier (2 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/get-soil-data</li>
                        <li>/county-lookup</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Starter Tier (8 endpoints) — +3 new</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/territorial-water-quality</li>
                        <li>/territorial-water-analytics</li>
                        <li>/multi-parameter-planting-calendar</li>
                        <li>/live-agricultural-data</li>
                        <li>/environmental-impact-engine</li>
                        <li className="text-green-600 font-medium">/safe-identification ✨ NEW</li>
                        <li className="text-green-600 font-medium">/dynamic-care ✨ NEW</li>
                        <li className="text-green-600 font-medium">/beginner-guidance ✨ NEW</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Pro Tier (7 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/alpha-earth-environmental-enhancement</li>
                        <li>/agricultural-intelligence</li>
                        <li>/seasonal-planning-assistant</li>
                        <li>/smart-report-summary</li>
                        <li>/carbon-credit-calculator</li>
                        <li>/generate-vrt-prescription</li>
                        <li>/leafengines-query</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Enterprise Tier (3 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/visual-crop-analysis</li>
                        <li>/gpt5-chat</li>
                        <li>/geo-consumption-analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Usage Example</h4>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{usageExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(usageExample, "Usage example")}
                    >
                      {copiedCode === "Usage example" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="v110" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version 1.1.0 — Core Agricultural Intelligence Platform</CardTitle>
                <p className="text-muted-foreground">Previous Release</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Endpoints by Tier</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2">Free Tier (2 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/get-soil-data</li>
                        <li>/county-lookup</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Starter Tier (5 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/territorial-water-quality</li>
                        <li>/territorial-water-analytics</li>
                        <li>/multi-parameter-planting-calendar</li>
                        <li>/live-agricultural-data</li>
                        <li>/environmental-impact-engine</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Pro Tier (7 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/alpha-earth-environmental-enhancement</li>
                        <li>/agricultural-intelligence</li>
                        <li>/seasonal-planning-assistant</li>
                        <li>/smart-report-summary</li>
                        <li>/carbon-credit-calculator</li>
                        <li>/generate-vrt-prescription</li>
                        <li>/leafengines-query</li>
                      </ul>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Enterprise Tier (3 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/visual-crop-analysis</li>
                        <li>/gpt5-chat</li>
                        <li>/geo-consumption-analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">SDK Features</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>TypeScript/JavaScript SDK with fetch-based client</li>
                    <li>Python SDK</li>
                    <li>Go SDK</li>
                    <li>API key authentication (x-api-key header)</li>
                    <li>Rate limit headers in responses</li>
                    <li>Tier-based access control</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rate Limits */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Rate Limits (All Versions)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Tier</th>
                    <th className="text-left py-3 px-4 font-semibold">Per Minute</th>
                    <th className="text-left py-3 px-4 font-semibold">Per Hour</th>
                    <th className="text-left py-3 px-4 font-semibold">Per Day</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Free</td>
                    <td className="py-3 px-4">10</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">1,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Starter</td>
                    <td className="py-3 px-4">30</td>
                    <td className="py-3 px-4">500</td>
                    <td className="py-3 px-4">5,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Pro</td>
                    <td className="py-3 px-4">100</td>
                    <td className="py-3 px-4">2,000</td>
                    <td className="py-3 px-4">25,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Enterprise</td>
                    <td className="py-3 px-4">500</td>
                    <td className="py-3 px-4">10,000</td>
                    <td className="py-3 px-4">100,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Migration Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Migration Guide: 1.1.0 → 1.2.0</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">No Breaking Changes</p>
                <p className="text-sm text-muted-foreground">
                  This is a backwards-compatible release. All existing integrations will continue to work.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Upgrade Steps</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm">
{`# NPM
npm update @soilsidekick/sdk

# Or install specific version
npm install @soilsidekick/sdk@1.2.0`}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard("npm install @soilsidekick/sdk@1.2.0", "Upgrade command")}
                >
                  {copiedCode === "Upgrade command" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
          <p className="text-muted-foreground mb-6">
            Get started with the SoilSidekick SDK and add environmental intelligence to your app.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/leafengines-api">
                View API Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a 
                href="https://www.npmjs.com/package/@soilsidekick/sdk" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Package className="mr-2 h-4 w-4" />
                View on npm
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKChangelog;
