import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Zap, DollarSign, Target, Clock, CheckCircle2 } from "lucide-react";

interface AppCharacteristics {
  currentAccuracy: number;
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ImpactMetrics {
  accuracyImprovement: number;
  responseTimeReduction: number;
  costSavings: number;
  dataQualityScore: number;
  roi: number;
  timeToValue: number;
}

export default function LeafEnginesImpactSimulator() {
  const [characteristics, setCharacteristics] = useState<AppCharacteristics>({
    currentAccuracy: 75,
    avgResponseTime: 2000,
    monthlyApiCalls: 10000,
    currentCostPerCall: 0.05,
    dataQuality: 60,
    userBase: 1000,
  });

  const [showResults, setShowResults] = useState(false);

  const calculateImpact = (): ImpactMetrics => {
    // LeafEngines improvements based on real-world benchmarks
    const accuracyBoost = Math.min(95, characteristics.currentAccuracy + (100 - characteristics.currentAccuracy) * 0.65);
    const speedImprovement = characteristics.avgResponseTime * 0.45; // 55% faster
    const costPerCallWithLeafEngines = 0.02; // Optimized cost structure
    const monthlySavings = (characteristics.currentCostPerCall - costPerCallWithLeafEngines) * characteristics.monthlyApiCalls;
    const dataQualityImprovement = Math.min(95, characteristics.dataQuality + (100 - characteristics.dataQuality) * 0.70);
    
    const annualSavings = monthlySavings * 12;
    const implementationCost = 5000 + (characteristics.userBase * 2); // Base + per-user cost
    const roiMonths = implementationCost / monthlySavings;

    return {
      accuracyImprovement: accuracyBoost,
      responseTimeReduction: speedImprovement,
      costSavings: monthlySavings,
      dataQualityScore: dataQualityImprovement,
      roi: (annualSavings / implementationCost) * 100,
      timeToValue: roiMonths,
    };
  };

  const impact = calculateImpact();

  const comparisonData = [
    {
      metric: "Accuracy",
      "Before LeafEngines": characteristics.currentAccuracy,
      "With LeafEngines": impact.accuracyImprovement,
    },
    {
      metric: "Response Time (ms)",
      "Before LeafEngines": characteristics.avgResponseTime,
      "With LeafEngines": impact.responseTimeReduction,
    },
    {
      metric: "Data Quality",
      "Before LeafEngines": characteristics.dataQuality,
      "With LeafEngines": impact.dataQualityScore,
    },
    {
      metric: "Cost/1K Calls",
      "Before LeafEngines": characteristics.currentCostPerCall * 1000,
      "With LeafEngines": 20, // $0.02 per call
    },
  ];

  const radarData = [
    { subject: "Accuracy", current: characteristics.currentAccuracy, improved: impact.accuracyImprovement, fullMark: 100 },
    { subject: "Speed", current: 100 - (characteristics.avgResponseTime / 50), improved: 100 - (impact.responseTimeReduction / 50), fullMark: 100 },
    { subject: "Data Quality", current: characteristics.dataQuality, improved: impact.dataQualityScore, fullMark: 100 },
    { subject: "Cost Efficiency", current: 100 - (characteristics.currentCostPerCall * 1000), improved: 80, fullMark: 100 },
    { subject: "Scalability", current: 60, improved: 95, fullMark: 100 },
  ];

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Zap className="w-4 h-4 mr-2" />
            Impact Calculator
          </Badge>
          <h1 className="text-4xl font-bold mb-4">LeafEngines™ Impact Simulator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how LeafEngines Environmental Intelligence transforms your agricultural application's performance, accuracy, and ROI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Current Application
              </CardTitle>
              <CardDescription>
                Enter your current app's characteristics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Environmental Data Accuracy: {characteristics.currentAccuracy}%</Label>
                <Slider
                  value={[characteristics.currentAccuracy]}
                  onValueChange={(v) => setCharacteristics({ ...characteristics, currentAccuracy: v[0] })}
                  min={40}
                  max={95}
                  step={5}
                />
              </div>

              <div className="space-y-3">
                <Label>Average API Response Time: {characteristics.avgResponseTime}ms</Label>
                <Slider
                  value={[characteristics.avgResponseTime]}
                  onValueChange={(v) => setCharacteristics({ ...characteristics, avgResponseTime: v[0] })}
                  min={500}
                  max={5000}
                  step={100}
                />
              </div>

              <div className="space-y-3">
                <Label>Monthly API Calls</Label>
                <Input
                  type="number"
                  value={characteristics.monthlyApiCalls}
                  onChange={(e) => setCharacteristics({ ...characteristics, monthlyApiCalls: Number(e.target.value) })}
                  min={1000}
                />
              </div>

              <div className="space-y-3">
                <Label>Current Cost per API Call ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={characteristics.currentCostPerCall}
                  onChange={(e) => setCharacteristics({ ...characteristics, currentCostPerCall: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-3">
                <Label>Data Quality Score: {characteristics.dataQuality}%</Label>
                <Slider
                  value={[characteristics.dataQuality]}
                  onValueChange={(v) => setCharacteristics({ ...characteristics, dataQuality: v[0] })}
                  min={30}
                  max={90}
                  step={5}
                />
              </div>

              <div className="space-y-3">
                <Label>Active User Base</Label>
                <Input
                  type="number"
                  value={characteristics.userBase}
                  onChange={(e) => setCharacteristics({ ...characteristics, userBase: Number(e.target.value) })}
                  min={100}
                />
              </div>

              <Button onClick={handleCalculate} className="w-full" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Calculate Impact
              </Button>
            </CardContent>
          </Card>

          {showResults && (
            <Card className="border-2 border-primary/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Projected Results with LeafEngines
                </CardTitle>
                <CardDescription>
                  Based on real-world implementation benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
                    <div className="text-3xl font-bold text-primary">
                      {impact.accuracyImprovement.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      +{(impact.accuracyImprovement - characteristics.currentAccuracy).toFixed(1)}% improvement
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                    <div className="text-3xl font-bold text-primary">
                      {impact.responseTimeReduction.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      55% faster
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Monthly Savings</div>
                    <div className="text-3xl font-bold text-green-600">
                      ${impact.costSavings.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${(impact.costSavings * 12).toFixed(0)}/year
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-sm text-muted-foreground mb-1">ROI</div>
                    <div className="text-3xl font-bold text-green-600">
                      {impact.roi.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Break-even: {impact.timeToValue.toFixed(1)} months
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Data Quality Score</span>
                    <span className="font-medium">{impact.dataQualityScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={impact.dataQualityScore} className="h-3" />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 text-primary" />
                    <div className="text-sm">
                      <span className="font-medium">Time to Value:</span> {impact.timeToValue.toFixed(1)} months until ROI break-even
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 mt-0.5 text-green-600" />
                    <div className="text-sm">
                      <span className="font-medium">3-Year Savings:</span> ${(impact.costSavings * 36).toFixed(0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {showResults && (
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="comparison">Comparison Charts</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>
                    Side-by-side comparison of key metrics before and after LeafEngines integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Before LeafEngines" fill="hsl(var(--muted))" />
                      <Bar dataKey="With LeafEngines" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capability Radar</CardTitle>
                  <CardDescription>
                    Multi-dimensional view of application improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Current" dataKey="current" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" fillOpacity={0.3} />
                      <Radar name="With LeafEngines" dataKey="improved" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Cost Reduction</div>
                        <div className="text-sm text-muted-foreground">
                          Save ${(impact.costSavings * 12).toFixed(0)} annually through optimized API costs and reduced data infrastructure needs
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Faster Time to Market</div>
                        <div className="text-sm text-muted-foreground">
                          Pre-integrated environmental data eliminates months of data sourcing and integration work
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Competitive Advantage</div>
                        <div className="text-sm text-muted-foreground">
                          {((impact.accuracyImprovement - characteristics.currentAccuracy) / characteristics.currentAccuracy * 100).toFixed(0)}% accuracy improvement differentiates your product
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Enhanced Accuracy</div>
                        <div className="text-sm text-muted-foreground">
                          Multi-source environmental data fusion provides {impact.accuracyImprovement.toFixed(1)}% accuracy
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Superior Performance</div>
                        <div className="text-sm text-muted-foreground">
                          55% faster response times through optimized data pipelines and caching
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Scalable Architecture</div>
                        <div className="text-sm text-muted-foreground">
                          Handle {(characteristics.userBase * 10).toLocaleString()}+ users without infrastructure changes
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Implementation Roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                          <div className="w-0.5 h-16 bg-border"></div>
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="font-medium">Week 1-2: Integration Setup</div>
                          <div className="text-sm text-muted-foreground">API key provisioning, SDK integration, initial testing</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                          <div className="w-0.5 h-16 bg-border"></div>
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="font-medium">Week 3-4: Feature Migration</div>
                          <div className="text-sm text-muted-foreground">Migrate existing features to LeafEngines data sources</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                          <div className="w-0.5 h-16 bg-border"></div>
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="font-medium">Week 5-6: Optimization & Testing</div>
                          <div className="text-sm text-muted-foreground">Performance tuning, A/B testing, quality validation</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Week 7: Production Launch</div>
                          <div className="text-sm text-muted-foreground">Full rollout with monitoring and support</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Application?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Schedule a demo to see LeafEngines in action and discuss your specific use case with our team
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/developer-sandbox">Try API Sandbox</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/api-docs">View Documentation</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
