import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X, Star, TrendingUp, Satellite, MapPin, Cpu, Zap, Shield, Globe, Database, BarChart } from "lucide-react";

const FarmonautComparison = () => {
  const comparisonData = [
    {
      category: "Core Focus",
      feature: "Primary Technology",
      soilSidekick: "AI-Powered Soil Analysis + Geographic Intelligence",
      farmonaut: "Satellite Crop Monitoring + Remote Sensing",
      winner: "Different Focus",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      category: "Satellite Technology",
      feature: "Satellite Monitoring",
      soilSidekick: "AlphaEarth Integration for Soil Analysis",
      farmonaut: "100M+ Acres Monitored Globally",
      winner: "Farmonaut",
      icon: <Satellite className="h-4 w-4" />
    },
    {
      category: "Soil Analysis",
      feature: "Soil Health Assessment",
      soilSidekick: "Advanced AI Soil Chemistry + pH Analysis",
      farmonaut: "Soil Moisture via Satellite Data",
      winner: "SoilSidekick",
      icon: <Database className="h-4 w-4" />
    },
    {
      category: "AI & Intelligence",
      feature: "Local AI Processing",
      soilSidekick: "Gemma Models + Privacy-First Processing",
      farmonaut: "Cloud-Based AI Analytics",
      winner: "SoilSidekick",
      icon: <Cpu className="h-4 w-4" />
    },
    {
      category: "Geographic Data",
      feature: "Location Intelligence",
      soilSidekick: "County-Level FIPS + GPS Integration",
      farmonaut: "Field-Level Mapping",
      winner: "Similar",
      icon: <MapPin className="h-4 w-4" />
    },
    {
      category: "Environmental Impact",
      feature: "Sustainability Focus",
      soilSidekick: "Fertilizer Runoff Risk + Carbon Credits",
      farmonaut: "Resource Optimization + Carbon Monitoring",
      winner: "Similar",
      icon: <Globe className="h-4 w-4" />
    },
    {
      category: "Data Integration",
      feature: "Government Data Sources",
      soilSidekick: "EPA + USDA + Water Quality Portal",
      farmonaut: "Satellite Data + Weather APIs",
      winner: "SoilSidekick",
      icon: <Database className="h-4 w-4" />
    },
    {
      category: "Crop Monitoring",
      feature: "Real-Time Monitoring",
      soilSidekick: "Planting Calendar + Seasonal Planning",
      farmonaut: "Real-Time Crop Health + Growth Tracking",
      winner: "Farmonaut",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      category: "API Access",
      feature: "Developer Integration",
      soilSidekick: "ADAPT Standard + Enterprise APIs",
      farmonaut: "Harvest Forecast + Agricultural Monitoring APIs",
      winner: "Similar",
      icon: <Zap className="h-4 w-4" />
    },
    {
      category: "Data Privacy",
      feature: "Privacy & Security",
      soilSidekick: "SOC 2 Type 1 + Local Processing",
      farmonaut: "Cloud-Based Processing",
      winner: "SoilSidekick",
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const pricingComparison = [
    {
      platform: "SoilSidekick Pro",
      tiers: [
        { name: "Basic", price: "Free", features: ["County Lookup", "Basic Soil Analysis", "Limited Reports"] },
        { name: "Starter", price: "$19/month", features: ["Enhanced Analysis", "PDF Export", "Carbon Credits"] },
        { name: "Pro", price: "$49/month", features: ["Advanced AI", "Water Quality", "Priority Support"] },
        { name: "Enterprise", price: "$199/month", features: ["API Access", "ADAPT Export", "Custom Integration"] }
      ]
    },
    {
      platform: "Farmonaut",
      tiers: [
        { name: "Basic", price: "Free", features: ["Limited Satellite Access", "Basic Monitoring", "5 Fields"] },
        { name: "Standard", price: "$20/month", features: ["Advanced Monitoring", "Weather Data", "Unlimited Fields"] },
        { name: "Professional", price: "$50/month", features: ["AI Analytics", "Advisory Services", "API Access"] },
        { name: "Enterprise", price: "Custom", features: ["White-Label", "Custom APIs", "Dedicated Support"] }
      ]
    }
  ];

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case "SoilSidekick":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">SoilSidekick</Badge>;
      case "Farmonaut":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Farmonaut</Badge>;
      case "Similar":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Similar</Badge>;
      default:
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Different Focus</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            SoilSidekick Pro vs Farmonaut
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive comparison of two leading precision agriculture platforms: 
            AI-powered soil intelligence vs satellite crop monitoring
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-white/50">Precision Agriculture</Badge>
            <Badge variant="outline" className="bg-white/50">Satellite Technology</Badge>
            <Badge variant="outline" className="bg-white/50">AI Analytics</Badge>
            <Badge variant="outline" className="bg-white/50">Soil Health</Badge>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">SoilSidekick Pro</CardTitle>
              <CardDescription>AI-Powered Soil Intelligence Platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-green-700">
                <strong>Specialization:</strong> Deep soil analysis, environmental compliance, precision recommendations
              </div>
              <div className="text-sm text-green-700">
                <strong>Key Strength:</strong> Advanced AI soil chemistry analysis with privacy-first local processing
              </div>
              <div className="text-sm text-green-700">
                <strong>Target Users:</strong> Precision farmers, agricultural consultants, environmental compliance
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Satellite className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-800">Farmonaut</CardTitle>
              <CardDescription>Satellite-Powered Crop Monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-blue-700">
                <strong>Specialization:</strong> Real-time crop monitoring, satellite imagery, yield forecasting
              </div>
              <div className="text-sm text-blue-700">
                <strong>Key Strength:</strong> 100M+ acres monitored globally with comprehensive satellite coverage
              </div>
              <div className="text-sm text-blue-700">
                <strong>Target Users:</strong> Large-scale farmers, agribusiness, crop insurance companies
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
              Head-to-head comparison across key agricultural technology categories
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
                      <div className="font-medium text-blue-700 mb-1">Farmonaut</div>
                      <div className="text-muted-foreground">{item.farmonaut}</div>
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
            <CardDescription>Compare subscription plans and pricing structures</CardDescription>
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
                <div className="text-sm">You need detailed soil chemistry analysis and pH optimization</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Environmental compliance and water quality monitoring are priorities</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You prefer local AI processing for data privacy</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You need ADAPT standard compliance for data export</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Carbon credit calculation and sustainability reporting are important</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Choose Farmonaut If:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You manage large-scale operations (1000+ acres)</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Real-time crop health monitoring is your primary need</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You want comprehensive satellite coverage and imagery</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">Yield forecasting and harvest planning are critical</div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">You prefer cloud-based solutions with global data access</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Differentiators */}
        <Card>
          <CardHeader>
            <CardTitle>Key Differentiators</CardTitle>
            <CardDescription>What sets each platform apart in the precision agriculture market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  SoilSidekick Pro Advantages
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Privacy-first architecture with local AI processing</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Deep integration with EPA and USDA data sources</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Advanced soil chemistry analysis beyond basic monitoring</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />Built-in environmental compliance and reporting</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />SOC 2 Type 1 compliance for enterprise security</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Satellite className="h-4 w-4" />
                  Farmonaut Advantages
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />Massive scale with 100M+ acres under monitoring</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />Real-time satellite imagery and crop health tracking</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />Proven track record in large-scale operations</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />Comprehensive weather integration and forecasting</li>
                  <li className="flex gap-2"><Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />Global reach with multi-continent support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 border-0">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Choose Your Precision Agriculture Platform?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Both platforms offer unique strengths. SoilSidekick Pro excels in soil intelligence and privacy, 
              while Farmonaut leads in satellite monitoring and scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Try SoilSidekick Pro Free
              </Button>
              <Button size="lg" variant="outline">
                View Detailed Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmonautComparison;