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
  Zap,
  Radio,
  Activity,
  Bell,
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

  const installCommand = "npm install @soilsidekick/sdk@2.0.0";

  const usageExample = `import { LeafEnginesClient } from '@soilsidekick/sdk';

const client = new LeafEnginesClient({
  apiKey: 'sk_live_your_api_key',
  projectRef: 'your-project-ref',
});

// Register an OEM precision sensor device
const device = await client.sensors.devices.register({
  deviceId: 'oem-mmWave-001',
  deviceType: 'mmwave_radar',
  farmId: 'farm-123',
  firmwareVersion: '1.2.0',
});

// Send sensor data
await client.sensors.readings.send({
  deviceId: 'skyline-001',
  deviceType: 'mmwave_radar',
  timestamp: new Date(),
  readings: [
    { metric: 'reflectivity', value: 0.92, unit: 'ratio', confidence: 0.94 },
    { metric: 'canopy_density', value: 0.78, unit: 'ratio' },
  ],
});

// Subscribe to real-time alerts
client.sensors.alerts.subscribe({ severity: ['high', 'critical'] }, (alert) => {
  console.log('Alert:', alert);
});`;

  const v12UsageExample = `import { Configuration, ConsumerPlantCareApi } from '@soilsidekick/sdk';

const config = new Configuration({ apiKey: 'ak_your_api_key' });
const plantCareApi = new ConsumerPlantCareApi(config);

const identification = await plantCareApi.safeIdentification({
  image: 'base64_or_url',
  location: { county_fips: '12086' },
  context: { environment: 'wild', purpose: 'foraging' }
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
                  <CardTitle className="text-2xl">Version 2.0.0</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Published February 2026</p>
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
                <p className="text-3xl font-bold text-primary">20+</p>
                <p className="text-sm text-muted-foreground">Total Endpoints</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-green-500">+6</p>
                <p className="text-sm text-muted-foreground">New Sensor APIs</p>
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
              <Radio className="h-5 w-5 text-primary" />
              What's New: OEM Precision Hardware Sensor Integration
            </h3>
            <p className="text-muted-foreground mb-6">
              Version 2.0.0 transforms SoilSidekick from a data-query platform into a real-time sensor management
              and alerting system for precision agriculture, with full OEM precision hardware support.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">sensors.devices.*</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Device Management</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Register, list, update, and delete sensor devices per farm —
                    mmWave radar, quantum RF, and precision timing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">sensors.readings.*</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Real-Time Streaming</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Send readings via HTTP (MQTT fallback), historical queries with
                    aggregation, and WebSocket subscribe for live data.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">sensors.alerts.*</CardTitle>
                  </div>
                  <Badge variant="secondary" className="w-fit">Alert Management</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to severity-filtered alerts, query history, and acknowledge
                    incidents. Direct MQTT broker connection supported.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Version Comparison Tabs */}
        <Tabs defaultValue="v200" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-xl">
            <TabsTrigger value="v200">v2.0.0 (Current)</TabsTrigger>
            <TabsTrigger value="v120">v1.2.0</TabsTrigger>
            <TabsTrigger value="v110">v1.1.0</TabsTrigger>
          </TabsList>

          <TabsContent value="v200" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version 2.0.0 — OEM Precision Hardware Sensor Integration & Real-Time APIs</CardTitle>
                <p className="text-muted-foreground">Released February 2026</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">New Sensor API Namespaces</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li><code>sensors.devices.*</code> — Register, list, update, delete</li>
                    <li><code>sensors.readings.*</code> — Send, query, aggregate, subscribe</li>
                    <li><code>sensors.alerts.*</code> — Subscribe, query, acknowledge</li>
                    <li><code>connectMQTT()</code> — Direct MQTT broker connection</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">All Endpoints by Tier (carried forward from v1.2.0)</h4>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2">Free Tier (2 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/get-soil-data</li>
                        <li>/county-lookup</li>
                      </ul>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Starter Tier (8 endpoints)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>/territorial-water-quality</li>
                        <li>/territorial-water-analytics</li>
                        <li>/multi-parameter-planting-calendar</li>
                        <li>/live-agricultural-data</li>
                        <li>/environmental-impact-engine</li>
                        <li>/safe-identification</li>
                        <li>/dynamic-care</li>
                        <li>/beginner-guidance</li>
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
                    <div>
                      <Badge variant="outline" className="mb-2 border-green-500 text-green-600">Sensor API (NEW)</Badge>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li className="text-green-600 font-medium">sensors.devices.* ✨ NEW</li>
                        <li className="text-green-600 font-medium">sensors.readings.* ✨ NEW</li>
                        <li className="text-green-600 font-medium">sensors.alerts.* ✨ NEW</li>
                        <li className="text-green-600 font-medium">connectMQTT() ✨ NEW</li>
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

          <TabsContent value="v120" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version 1.2.0 — Consumer Plant Care APIs</CardTitle>
                <p className="text-muted-foreground">Released December 2025</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Added three Starter-tier endpoints addressing top consumer plant identification pain points:
                  <code className="mx-1">/safe-identification</code>,
                  <code className="mx-1">/dynamic-care</code>, and
                  <code className="mx-1">/beginner-guidance</code>.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-base">/safe-identification</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Toxic lookalike warnings and environmental context for safer plant ID.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-base">/dynamic-care</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Hyper-localized, real-time care recommendations.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-base">/beginner-guidance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Judgment-free, jargon-free guidance for new plant parents.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Usage Example</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    <code>{v12UsageExample}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="v110" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version 1.1.0 — Core Agricultural Intelligence Platform</CardTitle>
                <p className="text-muted-foreground">Initial public release</p>
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
            <CardTitle>Migration Guide: 1.2.0 → 2.0.0</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">No Breaking Changes</p>
                <p className="text-sm text-muted-foreground">
                  Backwards-compatible release. All v1.2.0 endpoints continue to work; the sensor namespace is additive.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Upgrade Steps</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm">
{`# NPM
npm install @soilsidekick/sdk@2.0.0`}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard("npm install @soilsidekick/sdk@2.0.0", "Upgrade command")}
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
