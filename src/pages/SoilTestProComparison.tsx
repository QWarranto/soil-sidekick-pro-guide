import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X, Star, TrendingUp, Beaker, MapPin, Cpu, Zap, Shield, Globe, Database, BarChart, FileText, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const SoilTestProComparison = () => {
  const comparisonData = [
    {
      category: "Core Focus",
      feature: "Primary Technology",
      soilSidekick: "AI-Powered Soil Analysis + Environmental Intelligence",
      soilTestPro: "Grid Soil Sampling + Lab Result Management",
      winner: "Different Focus",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      category: "Soil Analysis",
      feature: "Analysis Method",
      soilSidekick: "AI-Powered Analysis + Multi-Source Data Integration",
      soilTestPro: "Physical Lab Testing + Manual Sampling",
      winner: "Different Approach",
      icon: <Beaker className="h-4 w-4" />
    },
    {
      category: "AI & Intelligence",
      feature: "AI Processing",
      soilSidekick: "Google AlphaEarth AI + Local Gemma Models + GPT-5 Integration",
      soilTestPro: "No AI Features",
      winner: "SoilSidekick",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      category: "Data Sources",
      feature: "Integrated Data",
      soilSidekick: "Google AlphaEarth + EPA + USDA + Water Quality Portal (Instant)",
      soilTestPro: "Lab Results Only (1-2 Weeks)",
      winner: "SoilSidekick",
      icon: <Database className="h-4 w-4" />
    },
    {
      category: "Environmental Impact",
      feature: "Sustainability Features",
      soilSidekick: "Carbon Credits + Runoff Risk + Water Quality",
      soilTestPro: "Basic Fertilizer Recommendations",
      winner: "SoilSidekick",
      icon: <Globe className="h-4 w-4" />
    },
    {
      category: "Variable Rate Tech",
      feature: "VRT Prescriptions",
      soilSidekick: "AI-Generated VRT Maps + Multi-Parameter Analysis",
      soilTestPro: "Basic VRT File Export from Lab Results",
      winner: "SoilSidekick",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      category: "Sampling",
      feature: "Field Sampling",
      soilSidekick: "Digital Analysis (No Physical Sampling Required)",
      soilTestPro: "Grid-Based Physical Sampling + GPS Tagging",
      winner: "Different Approach",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      category: "Speed",
      feature: "Time to Results",
      soilSidekick: "Instant Digital Analysis",
      soilTestPro: "1-2 Weeks (Lab Processing Time)",
      winner: "SoilSidekick",
      icon: <Zap className="h-4 w-4" />
    },
    {
      category: "Data Privacy",
      feature: "Privacy & Security",
      soilSidekick: "SOC 2 Type 1 + Local AI Processing",
      soilTestPro: "Standard Data Privacy",
      winner: "SoilSidekick",
      icon: <Shield className="h-4 w-4" />
    },
    {
      category: "Reporting",
      feature: "Report Features",
      soilSidekick: "AI Summaries + Multi-Format Export + Visual Analytics",
      soilTestPro: "Basic Lab Reports + VRT Files",
      winner: "SoilSidekick",
      icon: <FileText className="h-4 w-4" />
    },
    {
      category: "Mobile Access",
      feature: "Mobile App",
      soilSidekick: "Progressive Web App (PWA)",
      soilTestPro: "Native iOS/Android Apps",
      winner: "Similar",
      icon: <Smartphone className="h-4 w-4" />
    },
    {
      category: "Cost Model",
      feature: "Pricing Structure",
      soilSidekick: "Subscription-Based (Free to $199/month)",
      soilTestPro: "Free Software + Lab Testing Fees",
      winner: "Different Model",
      icon: <BarChart className="h-4 w-4" />
    }
  ];

  const pricingComparison = [
    {
      platform: "SoilSidekick Pro",
      tiers: [
        { name: "Free", price: "$0/month", features: ["County Lookup", "Basic Soil Analysis", "Limited Reports", "No Lab Testing Required"] },
        { name: "Starter", price: "$19/month", features: ["Enhanced AI Analysis", "PDF Export", "Carbon Credits", "Water Quality Data"] },
        { name: "Pro", price: "$49/month", features: ["Advanced AI Intelligence", "Environmental Impact", "Priority Support", "API Access"] },
        { name: "Enterprise", price: "$199/month", features: ["ADAPT Export", "Custom Integration", "White-Label", "Dedicated Support"] }
      ]
    },
    {
      platform: "SoilTest Pro",
      tiers: [
        { name: "Software", price: "Free", features: ["Grid Sampling Tools", "Lab Result Management", "Basic VRT Export", "Mobile + Web Access"] },
        { name: "Service Provider", price: "$200-500/year", features: ["Multi-Client Management", "Advanced Reporting", "Custom Recommendations", "Technical Support"] },
        { name: "Lab Testing", price: "$8-25/sample", features: ["Physical Soil Analysis", "2-Week Turnaround", "Standard Parameters", "Separate Lab Fees"] },
        { name: "Full Service", price: "Variable", features: ["Software + Lab Testing", "Per-Acre Pricing", "Sampling Service Available", "Custom Packages"] }
      ]
    }
  ];

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case "SoilSidekick":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">SoilSidekick</Badge>;
      case "SoilTest Pro":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">SoilTest Pro</Badge>;
      case "Similar":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Similar</Badge>;
      case "Different Approach":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Different Approach</Badge>;
      case "Different Model":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Different Model</Badge>;
      default:
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">Different Focus</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            SoilSidekick Pro vs SoilTest Pro
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive comparison: AI-powered digital soil intelligence vs traditional grid sampling and lab testing
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-white/50">Soil Analysis</Badge>
            <Badge variant="outline" className="bg-white/50">Precision Agriculture</Badge>
            <Badge variant="outline" className="bg-white/50">AI vs Traditional</Badge>
            <Badge variant="outline" className="bg-white/50">VRT Technology</Badge>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Cpu className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">SoilSidekick Pro</CardTitle>
              <CardDescription>AI-Powered Digital Soil Intelligence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-green-700">
                <strong>Approach:</strong> Digital-first platform with AI-powered analysis and multi-source data integration
              </div>
              <div className="text-sm text-green-700">
                <strong>Key Strength:</strong> Instant insights via AlphaEarth AI, EPA, USDA integration - no physical sampling or lab delays
              </div>
              <div className="text-sm text-green-700">
                <strong>Best For:</strong> Fast decisions, environmental compliance, data-driven precision farming
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Beaker className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800">SoilTest Pro</CardTitle>
              <CardDescription>Traditional Grid Sampling & Lab Testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-orange-700">
                <strong>Approach:</strong> Physical soil sampling with laboratory analysis and VRT file generation
              </div>
              <div className="text-sm text-orange-700">
                <strong>Key Strength:</strong> Direct physical analysis with established grid sampling methodology
              </div>
              <div className="text-sm text-orange-700">
                <strong>Best For:</strong> Traditional farmers, soil testing services, established workflows
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feature Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Detailed Feature Comparison
            </CardTitle>
            <CardDescription>
              Head-to-head comparison between AI-powered digital analysis and traditional lab testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <div>
                        <div className="font-medium text-sm text-muted-foreground">{item.category}</div>
                        <div className="font-semibold">{item.feature}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-green-700 mb-1">SoilSidekick Pro</div>
                      <div className="text-muted-foreground">{item.soilSidekick}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-orange-700 mb-1">SoilTest Pro</div>
                      <div className="text-muted-foreground">{item.soilTestPro}</div>
                    </div>
                    <div className="flex justify-center">
                      {getWinnerIcon(item.winner)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Comparison</CardTitle>
            <CardDescription>Compare cost structures: subscription vs lab testing fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {pricingComparison.map((platform, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">{platform.platform}</h3>
                  <div className="grid gap-3">
                    {platform.tiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{tier.name}</div>
                          <div className="font-semibold text-primary">{tier.price}</div>
                        </div>
                        <div className="space-y-1">
                          {tier.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Cost Analysis Example</CardTitle>
            <CardDescription>Annual cost comparison for a 500-acre farm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">SoilSidekick Pro</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Pro Plan (Annual):</span>
                    <span className="font-medium">$588</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical Sampling:</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Testing:</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Annual Cost:</span>
                    <span className="text-green-700">$588</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Includes unlimited analyses, instant results, AI recommendations</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">SoilTest Pro</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Software:</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grid Sampling (2.5-acre grid):</span>
                    <span className="font-medium">$1,000-2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lab Testing (200 samples @ $12):</span>
                    <span className="font-medium">$2,400</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Annual Cost:</span>
                    <span className="text-orange-700">$3,400-4,400</span>
                  </div>
                  <div className="text-xs text-muted-foreground">For 2.5-acre grid sampling every 3 years (annual average $1,133-1,467)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Should Choose What */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Choose SoilSidekick Pro If:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You need instant results without waiting for lab processing</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Environmental compliance and water quality are priorities</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You want AI-powered recommendations and predictive analytics</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Multi-source data integration (EPA, USDA, satellite) is valuable</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You prefer subscription-based predictable costs</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Carbon credits and sustainability reporting matter</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Choose SoilTest Pro If:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You prefer traditional physical soil testing methods</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Direct lab analysis provides confidence in results</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You already have established sampling workflows</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Grid-based VRT prescriptions are your primary need</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You operate a soil testing service business</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Free software with pay-per-test appeals to you</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Differentiators */}
        <Card>
          <CardHeader>
            <CardTitle>Key Differentiators</CardTitle>
            <CardDescription>What sets each platform apart in soil analysis approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  SoilSidekick Pro Advantages
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Instant results - no waiting for lab processing</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />AI-powered insights with predictive recommendations</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Multi-source integration (EPA, USDA, satellite data)</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Environmental compliance and water quality monitoring</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />No physical sampling or lab testing required</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />SOC 2 Type 1 enterprise security compliance</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  SoilTest Pro Advantages
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Physical soil samples with direct lab analysis</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Established grid sampling methodology</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Free software - only pay for lab testing</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Service provider features for consultants</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Traditional approach trusted by many farmers</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />Simple VRT file export for equipment compatibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Future: Hybrid Approach */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              The Future: Best of Both Worlds
            </CardTitle>
            <CardDescription>Combining digital intelligence with physical validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Modern precision agriculture doesn't have to be either/or. Many progressive farmers are adopting a hybrid approach:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div><strong>Daily Decisions:</strong> Use SoilSidekick Pro's AI analysis for real-time insights and quick decision-making</div>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div><strong>Annual Validation:</strong> Perform periodic physical soil testing to validate and calibrate digital models</div>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div><strong>Comprehensive View:</strong> Combine AI predictions with lab-verified ground truth for maximum confidence</div>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div><strong>Cost Optimization:</strong> Reduce sampling frequency while maintaining accuracy through AI monitoring</div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-800">Ready to Experience AI-Powered Soil Intelligence?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Try SoilSidekick Pro free and get instant soil analysis without waiting for lab results. 
                No physical sampling, no lab fees, no delays.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link to="/dashboard">Start Free Analysis</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoilTestProComparison;
