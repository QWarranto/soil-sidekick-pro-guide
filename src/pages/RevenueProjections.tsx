import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Users, DollarSign, Calendar, CheckCircle, AlertCircle, ArrowRight, Building2, Leaf, Cpu, Tractor, FlaskConical, CloudSun, XCircle, Scale, Clock, Percent, UserCheck, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { LeafEnginesNav } from "@/components/LeafEnginesNav";

interface TargetCompany {
  company: string;
  decisionMaker: string;
  title: string;
  priority: number;
}

const plantIdTargets: TargetCompany[] = [
  { company: "Plantum", decisionMaker: "Alex Rodionov", title: "CEO", priority: 9.5 },
  { company: "Plant Parent", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.8 },
  { company: "Flora Incognita", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 8.7 },
  { company: "Garden Tags", decisionMaker: "Contact Person", title: "CEO", priority: 8.5 },
  { company: "PlantNet", decisionMaker: "Contact Person", title: "Head of Technology", priority: 8.2 },
  { company: "Gardenize", decisionMaker: "Contact Person", title: "CEO", priority: 8.0 },
];

const smartHomeTargets: TargetCompany[] = [
  { company: "Wyze Labs", decisionMaker: "Yun Zhang", title: "CEO", priority: 9.2 },
  { company: "SwitchBot", decisionMaker: "Contact Person", title: "CEO", priority: 8.9 },
  { company: "Rachio", decisionMaker: "Contact Person", title: "CTO", priority: 8.6 },
  { company: "Netro", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.4 },
  { company: "Click & Grow", decisionMaker: "Contact Person", title: "CEO", priority: 8.1 },
  { company: "AeroGarden", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.9 },
];

const precisionAgTargets: TargetCompany[] = [
  { company: "Farmers Edge", decisionMaker: "Wade Barnes", title: "CEO", priority: 9.0 },
  { company: "Granular", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.8 },
  { company: "Cropio", decisionMaker: "Contact Person", title: "CEO", priority: 8.5 },
  { company: "Taranis", decisionMaker: "Contact Person", title: "CTO", priority: 8.3 },
  { company: "Gamaya", decisionMaker: "Contact Person", title: "CEO", priority: 8.0 },
  { company: "Prospera", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.8 },
];

const agSoftwareTargets: TargetCompany[] = [
  { company: "Arable", decisionMaker: "Adam Wolf", title: "CEO", priority: 9.1 },
  { company: "CropX", decisionMaker: "Contact Person", title: "CEO", priority: 8.9 },
  { company: "Semios", decisionMaker: "Contact Person", title: "CTO", priority: 8.7 },
  { company: "Trace Genomics", decisionMaker: "Contact Person", title: "CEO", priority: 8.4 },
  { company: "Agworld", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.2 },
  { company: "Conservis", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.9 },
];

const envMonitoringTargets: TargetCompany[] = [
  { company: "Aclima", decisionMaker: "Davida Herzl", title: "CEO", priority: 9.0 },
  { company: "Clarity Movement", decisionMaker: "Contact Person", title: "CEO", priority: 8.8 },
  { company: "Libelium", decisionMaker: "Contact Person", title: "CTO", priority: 8.5 },
  { company: "Sentera", decisionMaker: "Contact Person", title: "VP of Product", priority: 8.3 },
  { company: "Pycno", decisionMaker: "Contact Person", title: "CEO", priority: 8.0 },
  { company: "Hortau", decisionMaker: "Contact Person", title: "Chief Innovation Officer", priority: 7.8 },
  { company: "CropMetrics", decisionMaker: "Contact Person", title: "Sustainability Director", priority: 7.6 },
];

const TargetTable = ({ targets, icon: Icon, title, strategicFit }: { targets: TargetCompany[], icon: React.ElementType, title: string, strategicFit: string }) => (
  <Card className="border-border/50">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </CardTitle>
      <p className="text-sm text-muted-foreground">{strategicFit}</p>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-2 font-semibold">Company</th>
              <th className="text-left p-2 font-semibold">Decision Maker</th>
              <th className="text-left p-2 font-semibold">Title</th>
              <th className="text-right p-2 font-semibold">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {targets.map((target, idx) => (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="p-2 font-medium">{target.company}</td>
                <td className="p-2 text-muted-foreground">{target.decisionMaker}</td>
                <td className="p-2 text-muted-foreground">{target.title}</td>
                <td className="text-right p-2">
                  <Badge variant={target.priority >= 9 ? "default" : target.priority >= 8.5 ? "secondary" : "outline"}>
                    {target.priority.toFixed(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const RevenueProjections = () => {
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
                  31
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
              Priority Target Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Top Priority Targets (9.0+)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Plantum</span>
                    <Badge>9.5</Badge>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Wyze Labs</span>
                    <Badge>9.2</Badge>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Arable</span>
                    <Badge>9.1</Badge>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Farmers Edge</span>
                    <Badge>9.0</Badge>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Aclima</span>
                    <Badge>9.0</Badge>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Better Targets by Vertical</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Urban Forestry:</strong> Regional consulting firms, mid-size municipalities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Ag Insurance:</strong> Specialized crop insurance brokers, regional carriers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Precision Ag:</strong> Mid-size farm management software, regional cooperatives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Nutraceuticals:</strong> Growing supplement brands, specialized testing labs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>ESG:</strong> Sustainability consulting firms, carbon credit platforms</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Expansion Roadmap */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Phased Expansion Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Phase 1: US Market (Current)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Focus on middle-tier US companies with 3-6 month sales cycles. Leverage existing US water and soils data infrastructure.
                    Target: 31 companies across 5 verticals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Phase 2: European Expansion</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add European companies after US revenues are steady and increasing. Leverage GDPR compliance advantage.
                    Requires: Steady revenue growth, European data partnerships.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Phase 3: Global Markets</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expand to APAC, LATAM, and other regions. Target enterprise clients with proven product-market fit.
                    Requires: Established revenue base, regional data integration.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Middle Tier */}
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
              Why Middle Tier Targets?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These middle-tier companies have the resources to invest in LeafEngines™ but lack the bureaucratic complexity of enterprise clients. 
              They're hungry for competitive advantages and can move quickly on promising technologies.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">31</div>
                <div className="text-xs text-muted-foreground">Total Target Companies</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">5</div>
                <div className="text-xs text-muted-foreground">Verticals</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">3-6 mo</div>
                <div className="text-xs text-muted-foreground">Avg Sales Cycle</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Ready to integrate environmental intelligence into your platform?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/leafengines-api-docs">
                View API Documentation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/developer-sandbox">
                Try Developer Sandbox
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueProjections;
