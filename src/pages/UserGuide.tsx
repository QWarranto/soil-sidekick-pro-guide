import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Leaf, 
  LogOut, 
  Satellite, 
  TrendingUp, 
  Droplets, 
  Map, 
  BarChart3, 
  FileText, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info,
  Target
} from 'lucide-react';

const UserGuide = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">User Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master SoilSidekick Pro's agricultural intelligence platform with our comprehensive guides.
              From satellite data interpretation to environmental risk assessment.
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Satellite className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">AlphaEarth Intelligence</CardTitle>
                    <CardDescription>Satellite-powered insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn to interpret vegetation health, soil moisture, and environmental risk scores from Google Earth Engine data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                  <div>
                    <CardTitle className="text-lg">Soil Analysis</CardTitle>
                    <CardDescription>County-level precision</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Master USDA soil data interpretation, pH optimization, and nutrient recommendations for your crops.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-accent" />
                  <div>
                    <CardTitle className="text-lg">Environmental Assessment</CardTitle>
                    <CardDescription>EPA data integration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand water quality monitoring, contamination detection, and eco-friendly farming practices.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Guide Content */}
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="alpha-earth">AlphaEarth</TabsTrigger>
              <TabsTrigger value="soil-analysis">Soil Analysis</TabsTrigger>
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="troubleshooting">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Welcome to SoilSidekick Pro
                  </CardTitle>
                  <CardDescription>
                    Your complete guide to agricultural intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        1. Choose Your County
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Start by selecting your county using either the search tool or database lookup. 
                        SoilSidekick Pro provides county-level precision for all 3,143 US counties.
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Tip:</strong> Use FIPS codes for the most accurate results. Example: 48453 for Travis County, TX.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        2. Review Your Analysis
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get comprehensive soil analysis with pH levels, organic matter, and nutrient recommendations. 
                        Each analysis includes satellite-enhanced environmental assessments.
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Pro Tip:</strong> Look for the AlphaEarth satellite intelligence section for advanced insights.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        3. Explore Features
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Navigate between Soil Analysis, Water Quality, Planting Calendar, and Fertilizer Footprint tools. 
                        Each provides specialized agricultural intelligence.
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Remember:</strong> All features integrate with real-time EPA and satellite data for accuracy.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        4. Export & Share
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Generate professional PDF reports for your analysis. Pro subscribers get enhanced exports 
                        with detailed recommendations and environmental impact assessments.
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>API Users:</strong> Integrate data directly into your platform using our REST endpoints.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alpha-earth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-6 w-6" />
                    AlphaEarth Satellite Intelligence Guide
                    <Badge variant="outline" className="ml-2">NEW</Badge>
                  </CardTitle>
                  <CardDescription>
                    Understand and interpret satellite-enhanced environmental insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="vegetation-health">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Vegetation Health Analysis
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Excellent (8.0-10.0)</h4>
                            <p className="text-sm text-green-700">
                              High chlorophyll content, optimal photosynthesis. Crops are thriving with minimal stress indicators.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Moderate (5.0-7.9)</h4>
                            <p className="text-sm text-yellow-700">
                              Some vegetation stress present. Consider irrigation, fertilization, or pest management.
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2">Poor (0.0-4.9)</h4>
                            <p className="text-sm text-red-700">
                              Significant vegetation stress. Immediate intervention needed for crop recovery.
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">How to Use This Data:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Monitor trends over time to identify seasonal patterns</li>
                            <li>• Compare with historical data for your region</li>
                            <li>• Use for precision irrigation and fertilizer application</li>
                            <li>• Integrate with soil moisture data for complete picture</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="soil-moisture">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5" />
                          Satellite Soil Moisture Assessment
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Understanding Moisture Levels</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium mb-1">High Moisture (70-100%)</h5>
                                <p className="text-sm text-blue-700">
                                  Optimal for most crops. Risk of root diseases if sustained. Good for planting.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Low Moisture (0-30%)</h5>
                                <p className="text-sm text-blue-700">
                                  Drought stress likely. Irrigation needed. Delayed planting recommended.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Actionable Insights:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Plan irrigation schedules based on moisture trends</li>
                              <li>• Optimize planting windows for your crops</li>
                              <li>• Predict yield potential based on moisture availability</li>
                              <li>• Combine with weather forecasts for precision farming</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="environmental-risk">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Environmental Risk Scoring
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3">Risk Categories</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm"><strong>Low Risk (0-3):</strong> Minimal environmental impact</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm"><strong>Medium Risk (4-6):</strong> Moderate precautions needed</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm"><strong>High Risk (7-10):</strong> Significant mitigation required</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Mitigation Strategies</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Use buffer strips near water bodies</li>
                              <li>• Implement precision application techniques</li>
                              <li>• Choose slow-release fertilizer formulations</li>
                              <li>• Follow weather-based application timing</li>
                              <li>• Consider cover crops for soil protection</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="confidence-scores">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Understanding Confidence Scores
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">What Confidence Scores Mean:</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Confidence scores (0-100%) indicate the reliability of satellite data based on cloud cover, 
                            atmospheric conditions, and data quality at the time of capture.
                          </p>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div>
                              <h5 className="font-medium text-green-600">High (80-100%)</h5>
                              <p className="text-xs text-muted-foreground">Clear conditions, reliable data</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-yellow-600">Medium (60-79%)</h5>
                              <p className="text-xs text-muted-foreground">Some interference, good quality</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-red-600">Low (0-59%)</h5>
                              <p className="text-xs text-muted-foreground">Cloudy conditions, use with caution</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="soil-analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-6 w-6" />
                    Soil Analysis Interpretation Guide
                  </CardTitle>
                  <CardDescription>
                    Master USDA soil data and optimize your farming decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ph-levels">
                      <AccordionTrigger className="text-left">pH Level Understanding & Optimization</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2">Acidic (pH &lt; 6.0)</h4>
                            <p className="text-sm text-red-700 mb-2">
                              Nutrient lockout possible. Aluminum toxicity risk.
                            </p>
                            <p className="text-xs text-red-600">
                              <strong>Action:</strong> Apply lime 2-3 months before planting
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Optimal (pH 6.0-7.0)</h4>
                            <p className="text-sm text-green-700 mb-2">
                              Maximum nutrient availability for most crops.
                            </p>
                            <p className="text-xs text-green-600">
                              <strong>Action:</strong> Maintain with balanced fertilization
                            </p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Alkaline (pH &gt; 7.0)</h4>
                            <p className="text-sm text-blue-700 mb-2">
                              Iron and phosphorus deficiency possible.
                            </p>
                            <p className="text-xs text-blue-600">
                              <strong>Action:</strong> Add sulfur or organic matter
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="organic-matter">
                      <AccordionTrigger className="text-left">Organic Matter & Soil Health</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Organic Matter Benefits:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Improves water retention and soil structure</li>
                              <li>• Provides slow-release nutrients</li>
                              <li>• Enhances beneficial microbial activity</li>
                              <li>• Reduces erosion and compaction</li>
                            </ul>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Target Levels by Crop:</h4>
                              <ul className="text-sm space-y-1">
                                <li><strong>Vegetables:</strong> 3-5% organic matter</li>
                                <li><strong>Row Crops:</strong> 2-4% organic matter</li>
                                <li><strong>Pasture:</strong> 2-3% organic matter</li>
                                <li><strong>Orchards:</strong> 3-6% organic matter</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Improvement Strategies:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Add compost annually (1-2 inches)</li>
                                <li>• Plant cover crops between seasons</li>
                                <li>• Reduce tillage to preserve soil structure</li>
                                <li>• Use crop rotation with legumes</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="nutrients">
                      <AccordionTrigger className="text-left">Nutrient Management & Fertilizer Selection</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-blue-600">Nitrogen (N)</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Essential for leaf growth and chlorophyll production.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Deficiency signs:</strong> Yellowing leaves, stunted growth
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-orange-600">Phosphorus (P)</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Critical for root development and flowering.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Deficiency signs:</strong> Purple leaves, poor root growth
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-green-600">Potassium (K)</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Important for water regulation and disease resistance.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Deficiency signs:</strong> Brown leaf edges, weak stems
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="environmental" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-6 w-6" />
                    Environmental Assessment Guide
                  </CardTitle>
                  <CardDescription>
                    EPA water quality data and environmental impact understanding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="water-quality">
                      <AccordionTrigger className="text-left">EPA Water Quality Monitoring</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Understanding Water Grades</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-1">Grade A (Excellent)</h5>
                              <p className="text-sm text-blue-700">All parameters within EPA guidelines</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Grade F (Poor)</h5>
                              <p className="text-sm text-blue-700">Multiple violations, immediate attention needed</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold">Key Contaminants to Monitor:</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-red-600">Nitrate (MCL: 10 mg/L)</h5>
                              <p className="text-sm text-muted-foreground">
                                High levels indicate fertilizer runoff. Dangerous for infants.
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-orange-600">Phosphorus (No MCL)</h5>
                              <p className="text-sm text-muted-foreground">
                                Causes algal blooms and ecosystem disruption.
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="runoff-risk">
                      <AccordionTrigger className="text-left">Fertilizer Runoff Risk Assessment</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Low Risk</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Well-drained soils</li>
                              <li>• &gt;5 miles from water bodies</li>
                              <li>• Gentle slopes (&lt;3%)</li>
                              <li>• High organic matter</li>
                            </ul>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Medium Risk</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              <li>• Moderate drainage</li>
                              <li>• 1-5 miles from water</li>
                              <li>• Moderate slopes (3-8%)</li>
                              <li>• Average soil conditions</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2">High Risk</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              <li>• Poor drainage/clay soils</li>
                              <li>• &lt;1 mile from water bodies</li>
                              <li>• Steep slopes (&gt;8%)</li>
                              <li>• Low organic matter</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="eco-alternatives">
                      <AccordionTrigger className="text-left">Eco-Friendly Farming Practices</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Sustainable Fertilizer Alternatives</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium mb-1">Organic Options</h5>
                                <ul className="text-sm text-green-700 space-y-1">
                                  <li>• Compost and aged manure</li>
                                  <li>• Fish emulsion and bone meal</li>
                                  <li>• Legume cover crops</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Slow-Release Synthetic</h5>
                                <ul className="text-sm text-green-700 space-y-1">
                                  <li>• Polymer-coated fertilizers</li>
                                  <li>• Controlled-release granules</li>
                                  <li>• Split application timing</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Dashboard Navigation Guide
                  </CardTitle>
                  <CardDescription>
                    Make the most of your agricultural intelligence dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Core Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Map className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Soil Analysis</h4>
                            <p className="text-sm text-muted-foreground">
                              County-level USDA soil data with pH, nutrients, and recommendations
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Droplets className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Water Quality</h4>
                            <p className="text-sm text-muted-foreground">
                              Real-time EPA monitoring data and contamination assessment
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Satellite className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">AlphaEarth Intelligence</h4>
                            <p className="text-sm text-muted-foreground">
                              Satellite-powered vegetation health and soil moisture analysis
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Planning Tools</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-secondary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Planting Calendar</h4>
                            <p className="text-sm text-muted-foreground">
                              Optimized planting windows based on soil and climate data
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-secondary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Fertilizer Footprint</h4>
                            <p className="text-sm text-muted-foreground">
                              Environmental impact assessment and eco-friendly alternatives
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-secondary mt-0.5" />
                          <div>
                            <h4 className="font-medium">PDF Reports</h4>
                            <p className="text-sm text-muted-foreground">
                              Professional analysis reports for sharing and record-keeping
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Dashboard Tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Start with Soil Analysis to establish baseline conditions</li>
                      <li>• Check Water Quality for environmental context</li>
                      <li>• Use AlphaEarth data for real-time field monitoring</li>
                      <li>• Export reports for sharing with consultants or lenders</li>
                      <li>• Monitor usage limits in your subscription tier</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="troubleshooting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6" />
                    Help & Troubleshooting
                  </CardTitle>
                  <CardDescription>
                    Common questions and solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="data-accuracy">
                      <AccordionTrigger className="text-left">Data Accuracy & Reliability</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2">How accurate is the satellite data?</h4>
                            <p className="text-sm text-muted-foreground">
                              AlphaEarth uses Google Earth Engine with confidence scoring. Look for scores above 80% 
                              for highest reliability. Lower scores may indicate cloud cover or atmospheric interference.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Why might I see "No EPA data available"?</h4>
                            <p className="text-sm text-muted-foreground">
                              Some counties have limited monitoring stations. The system will use simulated data 
                              based on regional patterns when real-time data isn't available.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="subscription-limits">
                      <AccordionTrigger className="text-left">Subscription & Usage Limits</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2">What counts towards my usage limit?</h4>
                            <p className="text-sm text-muted-foreground">
                              Each county lookup counts as one usage. Multiple views of the same county analysis 
                              within the same session don't count as additional usage.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">How do I upgrade my subscription?</h4>
                            <p className="text-sm text-muted-foreground">
                              Visit the Pricing page and select your desired tier. Upgrades take effect immediately 
                              with prorated billing.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="technical-issues">
                      <AccordionTrigger className="text-left">Technical Issues</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold mb-2">County lookup not working?</h4>
                            <p className="text-sm text-muted-foreground">
                              Try using the FIPS code instead of county name. Ensure you're using the correct 
                              state abbreviation. Clear your browser cache if issues persist.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">PDF export failing?</h4>
                            <p className="text-sm text-muted-foreground">
                              Ensure you have completed a soil analysis first. PDF export requires Pro subscription 
                              or higher. Check your browser's popup blocker settings.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="contact-support">
                      <AccordionTrigger className="text-left">Contact Support</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Get Help</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Our technical support team is ready to help you get the most out of SoilSidekick Pro.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Email Support</Button>
                            <Button size="sm" variant="outline">Schedule Call</Button>
                            <Button size="sm" variant="outline">View FAQ</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserGuide;