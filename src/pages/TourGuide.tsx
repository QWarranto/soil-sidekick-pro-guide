import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Leaf,
  FlaskConical,
  Droplets,
  Calendar,
  Footprints,
  BarChart3,
  Cloud,
  DollarSign,
  Settings,
  Map,
  MapPin,
  CheckCircle,
  PlayCircle,
  Lightbulb,
  Target,
  Camera,
  Brain,
  Zap
} from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: any;
  route?: string;
  color: string;
  badge?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Welcome to SoilSidekick Pro",
    description: "Your comprehensive agricultural analytics platform with ADAPT Standard 1.0 integration for seamless farm management.",
    features: [
      "Real-time soil analysis and recommendations",
      "Water quality testing and monitoring",
      "Carbon credit calculations",
      "Seasonal planning assistance",
      "ADAPT Standard 1.0 compatibility"
    ],
    icon: Leaf,
    route: "/",
    color: "text-green-600",
    badge: "Start Here"
  },
  {
    id: 2,
    title: "Interactive Dashboard & Overview",
    description: "Explore visual analytics with interactive charts displaying carbon credits, organic matter trends, and task distributions. Click and hover for detailed insights.",
    features: [
      "Toggle chart data series by clicking legend items",
      "Expanding pie chart slices on hover",
      "Custom tooltips with precise measurements",
      "Carbon credits vs organic matter bar chart",
      "Task status distribution pie chart",
      "Theme-adaptive visualizations"
    ],
    icon: BarChart3,
    route: "/dashboard",
    color: "text-blue-600",
    badge: "New"
  },
  {
    id: 3,
    title: "Enhanced Field Management",
    description: "Comprehensive field visualization with interactive soil analysis modals showing N-P-K nutrients, pH levels, and organic matter with color-coded charts.",
    features: [
      "Interactive soil analysis visualization modal",
      "N-P-K nutrient bar chart (Nitrogen, Phosphorus, Potassium)",
      "Color-coded nutrient levels (Red/Amber/Green)",
      "pH level gauge with optimal range indicators",
      "Organic matter progress bar with quality ratings",
      "Location-based soil data integration",
      "Agronomist recommendations display",
      "Nutrient summary badges"
    ],
    icon: Map,
    route: "/field-mapping",
    color: "text-green-600",
    badge: "Enhanced"
  },
  {
    id: 4,
    title: "Smart Task Management",  
    description: "Advanced task filtering with dual filter system allowing you to organize tasks by both status and crop type simultaneously.",
    features: [
      "Dual filtering: Status + Crop Type",
      "Dynamic crop extraction from task data",
      "Live task counter showing filtered results",
      "Clear filters button for quick reset",
      "Status filters: Pending, In Progress, Completed, etc.",
      "Crop-specific task organization",
      "Combined filter logic for precise task views"
    ],
    icon: Calendar,
    route: "/task-manager",
    color: "text-purple-600",
    badge: "New Filter"
  },
  {
    id: 3,
    title: "Soil Analysis Engine",
    description: "Perform comprehensive soil testing with AI-powered recommendations tailored to your specific county and crop requirements.",
    features: [
      "County-specific soil data lookup",
      "pH, nitrogen, phosphorus, potassium analysis",
      "Fertilizer recommendations",
      "Organic matter assessment",
      "PDF report generation"
    ],
    icon: FlaskConical,
    route: "/soil-analysis",
    color: "text-amber-600",
    badge: "Core Feature"
  },
  {
    id: 4,
    title: "Water Quality Testing",
    description: "Monitor and analyze water quality parameters essential for irrigation and livestock management.",
    features: [
      "Water source quality assessment",
      "Contamination risk analysis",
      "Irrigation suitability scoring",
      "Environmental impact evaluation",
      "Detailed quality reports"
    ],
    icon: Droplets,
    route: "/water-quality",
    color: "text-cyan-600"
  },
  {
    id: 5,
    title: "Smart Planting Calendar",
    description: "Get optimized planting schedules based on local climate data, soil conditions, and crop requirements.",
    features: [
      "Climate-based planting windows",
      "Crop-specific recommendations",
      "Frost date considerations",
      "Seasonal planning integration",
      "Export to farm management systems"
    ],
    icon: Calendar,
    route: "/planting-calendar",
    color: "text-purple-600"
  },
  {
    id: 6,
    title: "Carbon Credit Calculator",
    description: "Track and monetize your sustainable farming practices through accurate carbon sequestration calculations.",
    features: [
      "Soil organic matter tracking",
      "Carbon sequestration estimation",
      "Credit value calculations",
      "Verification documentation",
      "Market opportunity analysis"
    ],
    icon: Footprints,
    route: "/fertilizer-footprint",
    color: "text-emerald-600",
    badge: "Premium"
  },
  {
    id: 7,
    title: "Visual Crop Analysis",
    description: "AI-powered image analysis for pest detection, crop health assessment, and disease screening.",
    features: [
      "Pest identification and detection",
      "Crop health status assessment",
      "Disease screening and diagnosis",
      "AI-powered visual analysis",
      "Actionable recommendations"
    ],
    icon: Camera,
    color: "text-pink-600",
    badge: "AI Vision"
  },
  {
    id: 8,
    title: "Field Boundary Mapping",
    description: "Interactive satellite-based field mapping with precision boundary drawing and comprehensive field management.",
    features: [
      "Satellite imagery-based boundary drawing",
      "Interactive field boundary creation",
      "Crop type and planting date tracking",
      "Automatic acreage calculations",
      "Field-specific data management",
      "Integration with analysis tools"
    ],
    icon: MapPin,
    route: "/field-mapping",
    color: "text-blue-600",
    badge: "Mapping"
  },
  {
    id: 9,
    title: "Seasonal Planning Assistant",
    description: "Plan your entire growing season with AI-powered insights and recommendations.",
    features: [
      "Multi-season crop rotation planning",
      "Resource allocation optimization",
      "Weather pattern analysis",
      "Risk assessment and mitigation",
      "Profit optimization strategies"
    ],
    icon: Target,
    route: "/seasonal-planning",
    color: "text-orange-600"
  },
  {
    id: 10,
    title: "Seasonal Task Manager",
    description: "Never forget critical farming tasks again with intelligent seasonal task tracking and year-over-year learning.",
    features: [
      "Create custom tasks or use pre-built templates",
      "Track completion history and learnings",
      "Annual recurring tasks (Starter+)",
      "Advanced recurring patterns (Pro+)",
      "Field-specific task assignment",
      "Year-over-year comparison"
    ],
    icon: Calendar,
    route: "/task-manager",
    color: "text-green-600",
    badge: "Memory Aid"
  },
  {
    id: 11,
    title: "AI Crop Recommendations",
    description: "Get personalized crop suggestions powered by GPT-5 intelligence with support for custom and alternative crops.",
    features: [
      "Suitability scoring for all crop types",
      "Custom crop analysis on demand",
      "Market outlook and profit potential",
      "Environmental impact assessment", 
      "Live agricultural data integration",
      "Detailed growing requirements",
      "Confidence levels and risk analysis"
    ],
    icon: Zap,
    route: "/dashboard",
    color: "text-yellow-600",
    badge: "AI Powered"
  },
  {
    id: 12,
    title: "Local AI Processing",
    description: "Privacy-preserving agricultural intelligence using Google Gemma models that run on your device.",
    features: [
      "Offline AI capabilities",
      "Complete data privacy",
      "Google Gemma 2B/7B models",
      "WebGPU acceleration",
      "Smart model selection",
      "Battery saving mode"
    ],
    icon: Brain,
    route: "/soil-analysis",
    color: "text-purple-600",
    badge: "Privacy First"
  },
  {
    id: 13,
    title: "Variable Rate Technology (VRT)",
    description: "Create AI-powered prescription maps for precision agriculture - optimize inputs and reduce waste with zone-based variable rate application.",
    features: [
      "AI-generated management zones (3-5 zones per field)",
      "Zone-specific application rates for fertilizer, seed, water",
      "Integration with GPS-enabled tractors",
      "Estimated input savings up to 30%",
      "Export to ADAPT, Shapefile, ISO-XML formats",
      "Field-specific optimization based on soil variability"
    ],
    icon: Zap,
    route: "/variable-rate-technology",
    color: "text-yellow-600",
    badge: "NEW - Precision Ag"
  },
  {
    id: 14,
    title: "ADAPT Integration Hub",
    description: "Seamlessly connect with existing farm management systems through ADAPT Standard 1.0 compatibility.",
    features: [
      "Data export to ADAPT format",
      "Integration with major FMS platforms",
      "Automated data synchronization",
      "Field boundary management",
      "Equipment compatibility"
    ],
    icon: Settings,
    route: "/adapt-integration",
    color: "text-indigo-600",
    badge: "Pro Feature"
  }
];

const TourGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const navigate = useNavigate();

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setVisitedSteps(prev => new Set([...prev, prevStep]));
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setVisitedSteps(prev => new Set([...prev, stepIndex]));
  };

  const handleTryFeature = () => {
    if (step.route) {
      navigate(step.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
              <span className="text-xs text-muted-foreground">Interactive Tour Guide</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8 slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to SoilSidekick Pro</h1>
                <p className="text-muted-foreground animate-fade-in">Learn how to maximize your agricultural productivity with our comprehensive platform</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Progress</div>
                <div className="text-2xl font-bold gradient-text">{currentStep + 1}/{tourSteps.length}</div>
              </div>
            </div>
            <Progress value={progress} className="h-2 shadow-glow-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Tour Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tourSteps.map((tourStep, index) => (
                    <Button
                      key={tourStep.id}
                      variant={index === currentStep ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleStepClick(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-1 ${visitedSteps.has(index) ? 'bg-primary/20' : 'bg-muted'}`}>
                          {visitedSteps.has(index) && index !== currentStep ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <div className={`h-4 w-4 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          )}
                        </div>
                        <div className="text-sm font-medium">{tourStep.title}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="mb-6 card-elevated animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-primary/10`}>
                        <step.icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-2xl">{step.title}</CardTitle>
                          {step.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {step.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {step.route && (
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-primary mb-1">Ready to explore this feature?</h4>
                            <p className="text-sm text-muted-foreground">Try it out with real data and see the results.</p>
                          </div>
                          <Button onClick={handleTryFeature} className="ml-4">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Try Now
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action - Show on last step */}
              {currentStep === tourSteps.length - 1 && (
                <Card className="mb-6 card-elevated bg-gradient-primary border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center text-white space-y-4">
                      <h3 className="text-2xl font-bold">🎉 Congratulations! You've Completed the Tour</h3>
                      <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        You've discovered the powerful features that will transform your agricultural operations. 
                        Ready to put them to work?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button size="xl" variant="hero" onClick={() => navigate('/auth')} className="text-lg px-8">
                          Start Free Trial
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/pricing')} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                          View Pricing Plans
                        </Button>
                      </div>
                      <p className="text-sm text-white/70 pt-2">
                        10-day free trial • No credit card required • Access all premium features
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {tourSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleStepClick(index)}
                      className={`h-2 w-8 rounded-full transition-colors ${
                        index === currentStep 
                          ? 'bg-primary' 
                          : visitedSteps.has(index)
                            ? 'bg-primary/50' 
                            : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {currentStep === tourSteps.length - 1 ? (
                  <Button onClick={() => navigate('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourGuide;