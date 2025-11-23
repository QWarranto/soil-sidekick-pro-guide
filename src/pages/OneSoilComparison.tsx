import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Satellite, BarChart3, MapPin, Calendar, Shield, Cpu, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const OneSoilComparison = () => {
  const comparisonData = [
    {
      category: "Target Audience",
      soilSidekick: "Large-scale commercial farming operations, precision agriculture enterprises",
      oneSoil: "Mid to large-scale farmers, agricultural consultants, precision farming adopters",
      winner: "Similar"
    },
    {
      category: "Core Focus",
      soilSidekick: "Soil analysis, environmental compliance, water quality, comprehensive agricultural intelligence",
      oneSoil: "Satellite crop monitoring, variable-rate application (VRA), yield optimization",
      winner: "Different"
    },
    {
      category: "Geographic Scope", 
      soilSidekick: "Global AlphaEarth satellite coverage with US-focused regulatory integration",
      oneSoil: "Global coverage with satellite imagery worldwide",
      winner: "Similar"
    },
    {
      category: "Soil Analysis",
      soilSidekick: "Advanced pH, N-P-K, organic matter analysis with ADAPT compliance",
      oneSoil: "Basic soil productivity zones through satellite analysis",
      winner: "SoilSidekick"
    },
    {
      category: "Satellite Technology",
      soilSidekick: "Google AlphaEarth - Unified petabyte-scale Earth observation AI embeddings (instant analysis)",
      oneSoil: "Traditional satellite monitoring with NDVI, growing degree days, precipitation analysis",
      winner: "SoilSidekick"
    },
    {
      category: "Environmental Impact",
      soilSidekick: "Comprehensive carbon footprint, runoff risk, sustainability scoring",
      oneSoil: "Cost reduction and input optimization focus",
      winner: "SoilSidekick"
    },
    {
      category: "Water Quality",
      soilSidekick: "Real-time EPA Water Quality Portal integration",
      oneSoil: "Precipitation monitoring only",
      winner: "SoilSidekick"
    },
    {
      category: "Variable Rate Application",
      soilSidekick: "Basic fertilizer recommendations",
      oneSoil: "Advanced VRA technology with proven $36-45/hectare profitability gains",
      winner: "OneSoil"
    },
    {
      category: "Field Monitoring",
      soilSidekick: "Seasonal planning and basic monitoring",
      oneSoil: "Real-time satellite monitoring, NDVI analysis, problem area detection",
      winner: "OneSoil"
    },
    {
      category: "Mobile Technology",
      soilSidekick: "Progressive Web App",
      oneSoil: "Native iOS/Android apps with field scouting capabilities",
      winner: "OneSoil"
    },
    {
      category: "AI Integration",
      soilSidekick: "Local AI (Gemma models) + cloud GPT-5, agricultural intelligence",
      oneSoil: "Machine learning for satellite image analysis and crop monitoring",
      winner: "SoilSidekick"
    },
    {
      category: "Compliance & Standards",
      soilSidekick: "ADAPT Standard 1.0, SOC 2 Type 1, EPA integration",
      oneSoil: "Basic agricultural compliance, focus on EU/global markets",
      winner: "SoilSidekick"
    },
    {
      category: "Pricing Model",
      soilSidekick: "Freemium with tiered subscriptions ($29-149/month)",
      oneSoil: "Free basic platform with premium OneSoil Pro features",
      winner: "OneSoil"
    },
    {
      category: "Data Integration",
      soilSidekick: "AlphaEarth AI embeddings + extensive federal/state database integration",
      oneSoil: "Traditional satellite data processing with 9 years of historical analysis",
      winner: "SoilSidekick"
    },
    {
      category: "AI Earth Observation",
      soilSidekick: "Google AlphaEarth Foundations - unified Earth embedding model for instant global insights",
      oneSoil: "Machine learning for satellite image analysis and crop pattern recognition",
      winner: "SoilSidekick"
    },
    {
      category: "Speed to Insights",
      soilSidekick: "Instant analysis - no waiting for processing",
      oneSoil: "Near real-time satellite updates (days to weeks)",
      winner: "SoilSidekick"
    }
  ];

  const pricingComparison = [
    {
      feature: "Free Tier",
      soilSidekick: "5 county lookups/month, basic soil analysis",
      oneSoil: "Full platform access with satellite monitoring, NDVI maps, weather data",
      oneSoilWins: true
    },
    {
      feature: "Entry Level",
      soilSidekick: "Starter: $29/month - 50 lookups, enhanced analysis",
      oneSoil: "Free (no entry-level paid tier)",
      oneSoilWins: true
    },
    {
      feature: "Professional",
      soilSidekick: "Pro: $79/month - Unlimited lookups, full features",
      oneSoil: "OneSoil Pro: Premium VRA features (pricing on request)",
      oneSoilWins: null
    },
    {
      feature: "Enterprise",
      soilSidekick: "Enterprise: $149/month - API access, custom integrations",
      oneSoil: "OneSoil Global Analytics: B2B data solutions (custom pricing)",
      oneSoilWins: null
    }
  ];

  const getWinnerIcon = (winner: string) => {
    if (winner === "SoilSidekick") return <Badge variant="default" className="bg-primary">SoilSidekick Pro</Badge>;
    if (winner === "OneSoil") return <Badge variant="secondary" className="bg-green-600 text-white">OneSoil</Badge>;
    if (winner === "Similar") return <Badge variant="outline">Similar</Badge>;
    return <Badge variant="outline">Different Focus</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Meta Tags */}
      <div className="sr-only">
        <h1>SoilSidekick Pro vs OneSoil: Comprehensive Precision Agriculture Platform Comparison</h1>
        <p>Compare SoilSidekick Pro and OneSoil agricultural platforms. Detailed analysis of satellite monitoring, soil analysis, pricing, and precision farming features for commercial operations.</p>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">SoilSidekick Pro vs OneSoil</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive comparison of enterprise agricultural intelligence platforms for precision farming
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
              Comprehensive agricultural intelligence platform focused on soil analysis, 
              environmental compliance, and US federal data integration.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">SOC 2 Type 1 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">US Federal Data Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm">Google AlphaEarth AI Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="text-sm">Environmental Impact Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-6 w-6" />
              OneSoil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Satellite-powered precision agriculture platform specializing in crop monitoring, 
              variable-rate application, and yield optimization.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4 text-green-600" />
                <span className="text-sm">Traditional Satellite Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm">$36-45/hectare VRA Gains</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm">9 Years Satellite Data</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">Free Core Platform</span>
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
                  <th className="text-left py-3 px-4">OneSoil</th>
                  <th className="text-left py-3 px-4">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.category}</td>
                    <td className="py-3 px-4 text-sm">{item.soilSidekick}</td>
                    <td className="py-3 px-4 text-sm">{item.oneSoil}</td>
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
                  <th className="text-left py-3 px-4">OneSoil</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.feature}</td>
                    <td className="py-3 px-4 text-sm">{item.soilSidekick}</td>
                    <td className="py-3 px-4 text-sm">{item.oneSoil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * OneSoil Pro and Global Analytics pricing available on request
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
                <span>You need comprehensive soil analysis and environmental compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>US federal data integration (EPA, USDA) is critical</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Water quality monitoring and runoff risk assessment are priorities</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>ADAPT Standard compliance is required</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>You want AI-powered agricultural intelligence and cost monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Carbon footprint tracking and sustainability reporting are needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Choose OneSoil If:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Satellite crop monitoring and NDVI analysis are your main focus</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Variable-rate application (VRA) optimization is a priority</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>You operate globally or outside the US</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>You want a free platform with optional premium features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Real-time field scouting with mobile apps is important</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <span>Historical satellite data analysis (9+ years) provides value</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Differentiators */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Key Differentiators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-primary">SoilSidekick Pro Strengths</h3>
              <ul className="space-y-2 text-sm">
                <li>• Google AlphaEarth AI - unified petabyte-scale Earth observation embeddings</li>
                <li>• Instant analysis vs days/weeks for traditional satellite processing</li>
                <li>• Patent-protected Environmental Impact Engine</li>
                <li>• Real-time EPA Water Quality Portal integration</li>
                <li>• Privacy-first local AI (Gemma models) + SOC 2 Type 1 compliance</li>
                <li>• Advanced soil chemistry analysis + ADAPT Standard compliance</li>
                <li>• Category leader in AI-powered environmental agricultural intelligence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-600">OneSoil Strengths</h3>
              <ul className="space-y-2 text-sm">
                <li>• Free core platform with premium options</li>
                <li>• Proven VRA profitability gains ($36-45/hectare)</li>
                <li>• Established traditional satellite monitoring</li>
                <li>• Advanced NDVI and crop monitoring</li>
                <li>• Native mobile field scouting apps</li>
                <li>• 9 years of historical satellite data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Choose Your Precision Agriculture Platform?</h3>
            <p className="text-muted-foreground mb-6">
              Explore SoilSidekick Pro's comprehensive agricultural intelligence capabilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/pricing">
                  View SoilSidekick Pricing
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

export default OneSoilComparison;