import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Leaf, BarChart3, MapPin, Calendar, Cpu, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeirloomComparison = () => {
  const comparisonData = [
    {
      category: "Target Audience",
      soilSidekick: "Large-scale commercial farming operations, precision agriculture",
      heirloom: "Small-scale diversified market gardeners, organic farmers",
      winner: "Different"
    },
    {
      category: "Core Focus",
      soilSidekick: "Soil analysis, environmental impact, compliance, data-driven insights",
      heirloom: "Crop planning, task management, revenue optimization for small farms",
      winner: "Different"
    },
    {
      category: "Geographic Scope", 
      soilSidekick: "US-wide with federal data integration (EPA, USDA, FIPS)",
      heirloom: "Farm-specific with satellite mapping",
      winner: "SoilSidekick"
    },
    {
      category: "Soil Analysis",
      soilSidekick: "Advanced pH, N-P-K, organic matter analysis with ADAPT compliance",
      heirloom: "Basic crop suitability recommendations",
      winner: "SoilSidekick"
    },
    {
      category: "Environmental Impact",
      soilSidekick: "Comprehensive carbon footprint, runoff risk, sustainability scoring",
      heirloom: "Minimal environmental tracking",
      winner: "SoilSidekick"
    },
    {
      category: "Water Quality",
      soilSidekick: "Real-time EPA Water Quality Portal integration",
      heirloom: "Not available",
      winner: "SoilSidekick"
    },
    {
      category: "Crop Planning",
      soilSidekick: "Multi-parameter planting calendar with climate/soil integration",
      heirloom: "Detailed crop planning for 250+ crops with succession planting",
      winner: "Heirloom"
    },
    {
      category: "Task Management",
      soilSidekick: "Seasonal planning assistant",
      heirloom: "Weekly task lists, workload predictions",
      winner: "Heirloom"
    },
    {
      category: "Revenue Optimization",
      soilSidekick: "Cost monitoring, efficiency metrics",
      heirloom: "Revenue projections, harvest tracking",
      winner: "Heirloom"
    },
    {
      category: "AI Integration",
      soilSidekick: "Local AI (Gemma models) + cloud GPT-5, agricultural intelligence",
      heirloom: "AI-powered farming planner",
      winner: "SoilSidekick"
    },
    {
      category: "Compliance & Standards",
      soilSidekick: "ADAPT Standard 1.0, SOC 2 Type 1, EPA integration",
      heirloom: "Basic farm management compliance",
      winner: "SoilSidekick"
    },
    {
      category: "Mobile Access",
      soilSidekick: "Progressive Web App",
      heirloom: "Native iOS and Android apps",
      winner: "Heirloom"
    }
  ];

  const pricingComparison = [
    {
      feature: "Free Tier",
      soilSidekick: "5 county lookups/month, basic soil analysis",
      heirloom: "1 month free trial",
      soilSidekickWins: true
    },
    {
      feature: "Entry Level",
      soilSidekick: "Starter: $29/month - 50 lookups, enhanced analysis",
      heirloom: "Unknown pricing (requires account)",
      soilSidekickWins: null
    },
    {
      feature: "Professional",
      soilSidekick: "Pro: $79/month - Unlimited lookups, full features",
      heirloom: "Unknown pricing",
      soilSidekickWins: null
    },
    {
      feature: "Enterprise",
      soilSidekick: "Enterprise: $149/month - API access, custom integrations",
      heirloom: "Custom pricing likely available",
      soilSidekickWins: null
    }
  ];

  const getWinnerIcon = (winner: string) => {
    if (winner === "SoilSidekick") return <Badge variant="default" className="bg-primary">SoilSidekick Pro</Badge>;
    if (winner === "Heirloom") return <Badge variant="secondary">Heirloom</Badge>;
    return <Badge variant="outline">Different Focus</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">SoilSidekick Pro vs Heirloom.ag</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive comparison of two agricultural platforms serving different market segments
        </p>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              SoilSidekick Pro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Enterprise-grade agricultural intelligence platform focused on precision farming, 
              environmental impact assessment, and regulatory compliance.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">SOC 2 Type 1 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">US-wide Geographic Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm">Local AI + Cloud Processing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              Heirloom.ag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Small-scale farming management software designed for market gardeners 
              and diversified organic operations with crop planning focus.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm">Precision Crop Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Revenue Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm">250+ Crop Database</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">SoilSidekick Pro</th>
                  <th className="text-left py-3 px-4">Heirloom.ag</th>
                  <th className="text-left py-3 px-4">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.category}</td>
                    <td className="py-3 px-4 text-sm">{item.soilSidekick}</td>
                    <td className="py-3 px-4 text-sm">{item.heirloom}</td>
                    <td className="py-3 px-4">{getWinnerIcon(item.winner)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Comparison */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Pricing Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Tier</th>
                  <th className="text-left py-3 px-4">SoilSidekick Pro</th>
                  <th className="text-left py-3 px-4">Heirloom.ag</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.feature}</td>
                    <td className="py-3 px-4 text-sm">{item.soilSidekick}</td>
                    <td className="py-3 px-4 text-sm">{item.heirloom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Heirloom.ag pricing requires account creation to view detailed plans
          </p>
        </CardContent>
      </Card>

      {/* Who Should Choose What */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Choose SoilSidekick Pro If:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>You manage large-scale commercial farming operations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Environmental compliance and impact assessment are critical</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>You need detailed soil analysis and federal data integration</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>ADAPT Standard compliance is required</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>You want AI-powered agricultural intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Water quality monitoring is important</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Choose Heirloom.ag If:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>You operate a small-scale market garden or CSA</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Detailed crop planning and succession scheduling are priorities</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>You need comprehensive task management and workload planning</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Revenue optimization for diverse crop production is key</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>You prefer native mobile apps for field use</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Automated seed ordering and harvest tracking are valuable</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started with SoilSidekick Pro?</h3>
            <p className="text-muted-foreground mb-6">
              Experience the power of enterprise-grade agricultural intelligence with our comprehensive platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/pricing">
                  View Pricing Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Try Free Tier</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeirloomComparison;