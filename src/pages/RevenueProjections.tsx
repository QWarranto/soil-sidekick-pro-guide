import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Users, DollarSign, Calendar, CheckCircle, AlertCircle, ArrowRight, Building2, Leaf, Cpu, Tractor, FlaskConical, CloudSun, XCircle, Scale, Clock, Percent, UserCheck, Briefcase, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";

interface TargetCompany {
  company: string;
  decisionMaker: string;
  title: string;
  priority: number;
  // API Volume metrics
  estimatedApps: number;
  avgUsersPerApp: number;
  callsPerUserMonth: number;
}

// Calculate API Volume Priority Score: (Apps × Users × Calls) normalized to 0-10 scale
const calculateVolumeScore = (t: TargetCompany): number => {
  const monthlyVolume = t.estimatedApps * t.avgUsersPerApp * t.callsPerUserMonth;
  // Normalize: 100M calls = 10.0, scale logarithmically
  const score = Math.min(10, Math.log10(monthlyVolume + 1) * 1.25);
  return Math.round(score * 10) / 10;
};

const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(1)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(0)}K`;
  return volume.toString();
};

const plantIdTargets: TargetCompany[] = [
  { company: "Plantum", decisionMaker: "Alex Rodionov", title: "CEO", priority: 9.5, estimatedApps: 1, avgUsersPerApp: 2_000_000, callsPerUserMonth: 12 },
  { company: "Plant Parent", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.8, estimatedApps: 1, avgUsersPerApp: 800_000, callsPerUserMonth: 10 },
  { company: "Flora Incognita", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 8.7, estimatedApps: 1, avgUsersPerApp: 1_500_000, callsPerUserMonth: 8 },
  { company: "Garden Tags", decisionMaker: "Contact Person", title: "CEO", priority: 8.5, estimatedApps: 1, avgUsersPerApp: 300_000, callsPerUserMonth: 15 },
  { company: "PlantNet", decisionMaker: "Contact Person", title: "Head of Technology", priority: 8.2, estimatedApps: 2, avgUsersPerApp: 5_000_000, callsPerUserMonth: 6 },
  { company: "Gardenize", decisionMaker: "Contact Person", title: "CEO", priority: 8.0, estimatedApps: 1, avgUsersPerApp: 200_000, callsPerUserMonth: 20 },
];

const smartHomeTargets: TargetCompany[] = [
  { company: "Wyze Labs", decisionMaker: "Yun Zhang", title: "CEO", priority: 9.2, estimatedApps: 3, avgUsersPerApp: 4_000_000, callsPerUserMonth: 8 },
  { company: "SwitchBot", decisionMaker: "Contact Person", title: "CEO", priority: 8.9, estimatedApps: 2, avgUsersPerApp: 1_500_000, callsPerUserMonth: 10 },
  { company: "Rachio", decisionMaker: "Contact Person", title: "CTO", priority: 8.6, estimatedApps: 1, avgUsersPerApp: 800_000, callsPerUserMonth: 25 },
  { company: "Netro", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.4, estimatedApps: 1, avgUsersPerApp: 200_000, callsPerUserMonth: 20 },
  { company: "Click & Grow", decisionMaker: "Contact Person", title: "CEO", priority: 8.1, estimatedApps: 1, avgUsersPerApp: 150_000, callsPerUserMonth: 30 },
  { company: "AeroGarden", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.9, estimatedApps: 1, avgUsersPerApp: 100_000, callsPerUserMonth: 25 },
];

const precisionAgTargets: TargetCompany[] = [
  { company: "Farmers Edge", decisionMaker: "Wade Barnes", title: "CEO", priority: 9.0, estimatedApps: 5, avgUsersPerApp: 80_000, callsPerUserMonth: 50 },
  { company: "Granular", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.8, estimatedApps: 3, avgUsersPerApp: 120_000, callsPerUserMonth: 40 },
  { company: "Cropio", decisionMaker: "Contact Person", title: "CEO", priority: 8.5, estimatedApps: 2, avgUsersPerApp: 60_000, callsPerUserMonth: 45 },
  { company: "Taranis", decisionMaker: "Contact Person", title: "CTO", priority: 8.3, estimatedApps: 2, avgUsersPerApp: 40_000, callsPerUserMonth: 60 },
  { company: "Gamaya", decisionMaker: "Contact Person", title: "CEO", priority: 8.0, estimatedApps: 1, avgUsersPerApp: 25_000, callsPerUserMonth: 50 },
  { company: "Prospera", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.8, estimatedApps: 2, avgUsersPerApp: 30_000, callsPerUserMonth: 55 },
];

const agSoftwareTargets: TargetCompany[] = [
  { company: "Arable", decisionMaker: "Adam Wolf", title: "CEO", priority: 9.1, estimatedApps: 2, avgUsersPerApp: 35_000, callsPerUserMonth: 80 },
  { company: "CropX", decisionMaker: "Contact Person", title: "CEO", priority: 8.9, estimatedApps: 2, avgUsersPerApp: 50_000, callsPerUserMonth: 60 },
  { company: "Semios", decisionMaker: "Contact Person", title: "CTO", priority: 8.7, estimatedApps: 3, avgUsersPerApp: 20_000, callsPerUserMonth: 100 },
  { company: "Trace Genomics", decisionMaker: "Contact Person", title: "CEO", priority: 8.4, estimatedApps: 1, avgUsersPerApp: 15_000, callsPerUserMonth: 40 },
  { company: "Agworld", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.2, estimatedApps: 2, avgUsersPerApp: 45_000, callsPerUserMonth: 35 },
  { company: "Conservis", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.9, estimatedApps: 1, avgUsersPerApp: 30_000, callsPerUserMonth: 45 },
];

const envMonitoringTargets: TargetCompany[] = [
  { company: "Aclima", decisionMaker: "Davida Herzl", title: "CEO", priority: 9.0, estimatedApps: 2, avgUsersPerApp: 50_000, callsPerUserMonth: 100 },
  { company: "Clarity Movement", decisionMaker: "Contact Person", title: "CEO", priority: 8.8, estimatedApps: 1, avgUsersPerApp: 80_000, callsPerUserMonth: 60 },
  { company: "Libelium", decisionMaker: "Contact Person", title: "CTO", priority: 8.5, estimatedApps: 3, avgUsersPerApp: 25_000, callsPerUserMonth: 80 },
  { company: "Sentera", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.3, estimatedApps: 2, avgUsersPerApp: 40_000, callsPerUserMonth: 50 },
  { company: "Pycno", decisionMaker: "Contact Person", title: "CEO", priority: 8.0, estimatedApps: 1, avgUsersPerApp: 20_000, callsPerUserMonth: 70 },
  { company: "Hortau", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.8, estimatedApps: 1, avgUsersPerApp: 35_000, callsPerUserMonth: 45 },
  { company: "CropMetrics", decisionMaker: "Contact Person", title: "Sustainability Director", priority: 7.6, estimatedApps: 1, avgUsersPerApp: 25_000, callsPerUserMonth: 50 },
];

const TargetTable = ({ targets, icon: Icon, title, strategicFit }: { targets: TargetCompany[], icon: React.ElementType, title: string, strategicFit: string }) => {
  // Sort by volume score descending for optimal onboarding priority
  const sortedTargets = [...targets].sort((a, b) => {
    const volumeA = a.estimatedApps * a.avgUsersPerApp * a.callsPerUserMonth;
    const volumeB = b.estimatedApps * b.avgUsersPerApp * b.callsPerUserMonth;
    return volumeB - volumeA;
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{strategicFit}</p>
        <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
          <strong>Volume Score:</strong> log₁₀(Apps × Users × Calls/Mo) × 1.25 — sorted by monthly API volume potential
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-2 font-semibold">Company</th>
                <th className="text-right p-2 font-semibold">Apps</th>
                <th className="text-right p-2 font-semibold">Users/App</th>
                <th className="text-right p-2 font-semibold">Calls/User/Mo</th>
                <th className="text-right p-2 font-semibold">Mo. Volume</th>
                <th className="text-right p-2 font-semibold">Vol. Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortedTargets.map((target, idx) => {
                const monthlyVolume = target.estimatedApps * target.avgUsersPerApp * target.callsPerUserMonth;
                const volumeScore = calculateVolumeScore(target);
                return (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="p-2">
                      <div className="font-medium">{target.company}</div>
                      <div className="text-xs text-muted-foreground">{target.decisionMaker} • {target.title}</div>
                    </td>
                    <td className="text-right p-2 font-mono">{target.estimatedApps}</td>
                    <td className="text-right p-2 font-mono">{formatVolume(target.avgUsersPerApp)}</td>
                    <td className="text-right p-2 font-mono">{target.callsPerUserMonth}</td>
                    <td className="text-right p-2 font-mono font-semibold text-primary">{formatVolume(monthlyVolume)}</td>
                    <td className="text-right p-2">
                      <Badge variant={volumeScore >= 8 ? "default" : volumeScore >= 7 ? "secondary" : "outline"}>
                        {volumeScore.toFixed(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const RevenueProjections = () => {
  // Calculate total potential volume across all targets
  const allTargets = [...plantIdTargets, ...smartHomeTargets, ...precisionAgTargets, ...agSoftwareTargets, ...envMonitoringTargets];
  const totalMonthlyVolume = allTargets.reduce((sum, t) => sum + t.estimatedApps * t.avgUsersPerApp * t.callsPerUserMonth, 0);
  const totalApps = allTargets.reduce((sum, t) => sum + t.estimatedApps, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <LeafEnginesNav />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="mb-4" variant="secondary">
            <Scale className="w-3 h-3 mr-1" />
            B2C → B2B Strategic Pivot
          </Badge>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            LeafEngines™ Revenue Projections
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From per-query consumer model to enterprise "Botanical Truth Layer" licensing
          </p>
        </div>

        {/* API Volume Summary */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              API Volume Onboarding Priority
            </CardTitle>
            <p className="text-sm text-muted-foreground">Optimizing for maximum API call volume per onboarding effort</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">{totalApps}</div>
                <div className="text-xs text-muted-foreground">Total Apps (Target List)</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">{allTargets.length}</div>
                <div className="text-xs text-muted-foreground">Companies</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">{formatVolume(totalMonthlyVolume)}</div>
                <div className="text-xs text-muted-foreground">Potential Monthly Calls</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border">
                <div className="text-3xl font-bold text-primary">{(totalApps / allTargets.length).toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Avg Apps/Company</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B2C vs B2B Financial Comparison */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              B2C vs B2B Model Comparison
            </CardTitle>
            <p className="text-sm text-muted-foreground">Strategic pivot from consumer to enterprise licensing</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original B2C Model */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-destructive/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    Original B2C Model
                  </h3>
                  <Badge variant="outline" className="border-destructive/50 text-destructive">Retired</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Revenue Model</span>
                    <span className="font-medium">Per-query API calls</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="font-medium">$0.001 - $0.01/query</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Target Customer</span>
                    <span className="font-medium">Individual developers</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Sales Cycle</span>
                    <span className="font-medium">Self-serve (days)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Year 1 Revenue Target</span>
                    <span className="font-medium">$50K - $100K</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">CAC Recovery</span>
                    <span className="font-medium">12-18 months</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">LTV per Customer</span>
                    <span className="font-medium">$50 - $500</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-destructive/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>Why Retired:</strong> High churn, low LTV, commodity pricing pressure, unsustainable unit economics at scale.
                  </p>
                </div>
              </div>

              {/* Revised B2B Model */}
              <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Revised B2B Model
                  </h3>
                  <Badge className="bg-primary">Active</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Revenue Model</span>
                    <span className="font-medium">Enterprise licensing</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="font-medium">$25K - $250K/year</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Target Customer</span>
                    <span className="font-medium">Middle-tier companies</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Sales Cycle</span>
                    <span className="font-medium">3-6 months</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">Year 1 Revenue Target</span>
                    <span className="font-medium text-primary">$500K - $1.5M</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">CAC Recovery</span>
                    <span className="font-medium text-primary">4-8 months</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">LTV per Customer</span>
                    <span className="font-medium text-primary">$75K - $500K+</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>Value Proposition:</strong> "Botanical Truth Layer" - verified, auditable infrastructure for risk mitigation and compliance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Impact Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Financial Impact: B2C → B2B Pivot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Percent className="w-5 h-5" />
                  10-15x
                </div>
                <div className="text-xs text-muted-foreground mt-1">Revenue per Customer</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Clock className="w-5 h-5" />
                  3x
                </div>
                <div className="text-xs text-muted-foreground mt-1">Faster CAC Recovery</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <UserCheck className="w-5 h-5" />
                  85%+
                </div>
                <div className="text-xs text-muted-foreground mt-1">Retention Rate</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <Briefcase className="w-5 h-5" />
                  {allTargets.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Qualified Targets</div>
              </div>
            </div>

            {/* Pricing by Vertical */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Value-Based Pricing by Vertical</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span>Plant ID Apps</span>
                  </div>
                  <span className="font-medium">$25K-75K/yr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span>Smart Home/IoT</span>
                  </div>
                  <span className="font-medium">$50K-150K/yr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tractor className="w-4 h-4 text-primary" />
                    <span>Precision Agriculture</span>
                  </div>
                  <span className="font-medium">$75K-200K/yr</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Urban Forestry</span>
                  </div>
                  <span className="font-medium">$100K-250K/yr</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 1 Strategy Notice */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
              Phase 1: US-First Market Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Due to more limited access to foreign water and soils data, <strong>Phase 1 focuses exclusively on US companies</strong>. 
              Foreign companies will be added during later phases after revenues are steady and increasing.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-amber-500/50">US Data Infrastructure Ready</Badge>
              <Badge variant="outline" className="border-amber-500/50">3-6 Month Sales Cycles</Badge>
              <Badge variant="outline" className="border-amber-500/50">Agile Decision Making</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Optimal Middle Tier Characteristics */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Optimal Middle Tier Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">$10M - $500M Revenue</p>
                  <p className="text-xs text-muted-foreground">Sweet spot for technology investment</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">50 - 2,000 Employees</p>
                  <p className="text-xs text-muted-foreground">Agile but resourced</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">3-6 Month Sales Cycles</p>
                  <p className="text-xs text-muted-foreground">Faster than enterprise</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Growth-Oriented Leadership</p>
                  <p className="text-xs text-muted-foreground">Seeking competitive advantages</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Technology Adoption Budgets</p>
                  <p className="text-xs text-muted-foreground">Resources to invest</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ArrowRight className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Agile Decision-Making</p>
                  <p className="text-xs text-muted-foreground">Less bureaucratic complexity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Verticals Tabs */}
        <Tabs defaultValue="plant-id" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="plant-id" className="text-xs md:text-sm">
              <Leaf className="w-4 h-4 mr-1 hidden md:inline" />
              Plant ID
            </TabsTrigger>
            <TabsTrigger value="smart-home" className="text-xs md:text-sm">
              <Cpu className="w-4 h-4 mr-1 hidden md:inline" />
              Smart Home
            </TabsTrigger>
            <TabsTrigger value="precision-ag" className="text-xs md:text-sm">
              <Tractor className="w-4 h-4 mr-1 hidden md:inline" />
              Precision Ag
            </TabsTrigger>
            <TabsTrigger value="ag-software" className="text-xs md:text-sm">
              <FlaskConical className="w-4 h-4 mr-1 hidden md:inline" />
              Ag Software
            </TabsTrigger>
            <TabsTrigger value="env-monitoring" className="text-xs md:text-sm">
              <CloudSun className="w-4 h-4 mr-1 hidden md:inline" />
              Environmental
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plant-id" className="mt-6">
            <TargetTable 
              targets={plantIdTargets}
              icon={Leaf}
              title="1. Plant ID & Gardening Apps"
              strategicFit="Mid-tier apps with high user churn, ideal for LeafEngines™ integration to boost retention."
            />
          </TabsContent>

          <TabsContent value="smart-home" className="mt-6">
            <TargetTable 
              targets={smartHomeTargets}
              icon={Cpu}
              title="2. Smart Home & IoT"
              strategicFit="Companies expanding into garden sensors and smart planters, needing environmental intelligence."
            />
          </TabsContent>

          <TabsContent value="precision-ag" className="mt-6">
            <TargetTable 
              targets={precisionAgTargets}
              icon={Tractor}
              title="3. Precision Agriculture"
              strategicFit="Data analytics platforms that can leverage LeafEngines™ for enhanced environmental intelligence."
            />
          </TabsContent>

          <TabsContent value="ag-software" className="mt-6">
            <TargetTable 
              targets={agSoftwareTargets}
              icon={FlaskConical}
              title="4. Agricultural Software Startups"
              strategicFit="Growth-stage companies seeking a competitive advantage through unique data integration."
            />
          </TabsContent>

          <TabsContent value="env-monitoring" className="mt-6">
            <TargetTable 
              targets={envMonitoringTargets}
              icon={CloudSun}
              title="5. Environmental Monitoring"
              strategicFit="Sensor platforms expanding into agricultural applications that require sophisticated data layers."
            />
          </TabsContent>
        </Tabs>

        {/* Priority Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Top Volume Priority Targets
            </CardTitle>
            <p className="text-sm text-muted-foreground">Sorted by monthly API call potential — prioritize multi-app platforms and high-penetration apps</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Highest Volume Targets</h3>
                <ul className="space-y-2 text-sm">
                  {allTargets
                    .map(t => ({ ...t, volume: t.estimatedApps * t.avgUsersPerApp * t.callsPerUserMonth }))
                    .sort((a, b) => b.volume - a.volume)
                    .slice(0, 6)
                    .map((t, idx) => (
                      <li key={idx} className="flex justify-between items-center p-2 bg-primary/10 rounded">
                        <div>
                          <span className="font-medium">{t.company}</span>
                          <span className="text-xs text-muted-foreground ml-2">({t.estimatedApps} apps)</span>
                        </div>
                        <div className="text-right">
                          <Badge>{formatVolume(t.volume)}/mo</Badge>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Multi-App Companies (Higher Efficiency)</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {allTargets
                    .filter(t => t.estimatedApps >= 2)
                    .sort((a, b) => b.estimatedApps - a.estimatedApps)
                    .map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>{t.company}:</strong> {t.estimatedApps} apps × {formatVolume(t.avgUsersPerApp)} users</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phased Expansion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tractor className="w-5 h-5 text-primary" />
              Phased Expansion Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary">Phase 1</Badge>
                  <span className="text-xs text-muted-foreground">Now - Q2 2026</span>
                </div>
                <h3 className="font-semibold">US Market Entry</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Focus on {allTargets.length} qualified US targets</li>
                  <li>• {totalApps} total apps potential</li>
                  <li>• Establish reference customers</li>
                  <li>• Refine onboarding process</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Phase 2</Badge>
                  <span className="text-xs text-muted-foreground">Q3 - Q4 2026</span>
                </div>
                <h3 className="font-semibold">European Expansion</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GDPR compliance advantage</li>
                  <li>• EU-based plant ID apps</li>
                  <li>• Agricultural platforms</li>
                  <li>• Data infrastructure buildout</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Phase 3</Badge>
                  <span className="text-xs text-muted-foreground">2027+</span>
                </div>
                <h3 className="font-semibold">Global Scale</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Asia-Pacific markets</li>
                  <li>• Latin America expansion</li>
                  <li>• Enterprise tier offerings</li>
                  <li>• Full vertical coverage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Integrate LeafEngines™?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join the growing ecosystem of agricultural technology providers enhancing their platforms with 
                verified botanical intelligence and environmental data.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Link to="/leafengines-api">
                  <Button size="lg">
                    View API Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/developer-sandbox">
                  <Button variant="outline" size="lg">
                    Try Developer Sandbox
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueProjections;
