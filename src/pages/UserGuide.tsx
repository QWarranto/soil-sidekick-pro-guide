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
  Target,
  Zap,
  Settings,
  Wifi,
  HardDrive,
  Webhook,
  Shield,
  Key,
  RefreshCw,
  Calendar,
  Brain,
  Battery
} from 'lucide-react';

const UserGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 slide-in-up">
            <h1 className="text-4xl font-bold mb-4 text-white opacity-100">
              User Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Master SoilSidekick Pro's agricultural intelligence platform with our comprehensive guides.
              From satellite data interpretation to environmental risk assessment.
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20 card-elevated hover:card-3d animate-fade-in">
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
            <TabsList className="grid w-full grid-cols-10">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="gpt5-features">GPT-5 Features</TabsTrigger>
              <TabsTrigger value="task-management">Task Manager</TabsTrigger>
              <TabsTrigger value="local-ai">Local AI</TabsTrigger>
              <TabsTrigger value="alpha-earth">AlphaEarth</TabsTrigger>
              <TabsTrigger value="soil-analysis">Soil Analysis</TabsTrigger>
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="sensor-integration">Sensor Setup</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
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

            <TabsContent value="gpt5-features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    GPT-5 Enhanced Features Guide
                    <Badge variant="outline" className="ml-2">NEW</Badge>
                  </CardTitle>
                  <CardDescription>
                    Master the three powerful GPT-5 enhanced features for advanced agricultural intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="enhanced-chat">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Enhanced Agricultural Q&A Chat
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">What's Enhanced?</h4>
                          <p className="text-sm text-muted-foreground">
                            The Enhanced Agricultural Q&A Chat uses GPT-5's advanced reasoning to provide sophisticated agricultural insights. 
                            Ask complex questions about soil health, crop management, pest control, and sustainability practices.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">How to Use:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Navigate to Dashboard → AI Assistant tab</li>
                              <li>• Toggle "GPT-5 Enhanced Reasoning" for advanced analysis</li>
                              <li>• Ask complex, multi-part agricultural questions</li>
                              <li>• Request specific recommendations for your location</li>
                              <li>• Compare different farming strategies</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Example Questions:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• "How should I adjust fertilizer based on my soil pH and upcoming weather?"</li>
                              <li>• "What crop rotation would optimize soil health for my county?"</li>
                              <li>• "Analyze the pest management options for corn in my region"</li>
                              <li>• "How do my soil conditions affect carbon sequestration potential?"</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Pro Tips:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Provide context about your specific location, crops, and goals</li>
                            <li>• Ask follow-up questions to dive deeper into recommendations</li>
                            <li>• Use the enhanced reasoning for complex decision-making scenarios</li>
                            <li>• The system automatically falls back to GPT-4o if GPT-5 is unavailable</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="smart-summaries">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Smart Report Summaries
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Auto-Generated Intelligence</h4>
                          <p className="text-sm text-muted-foreground">
                            Smart Report Summaries automatically generate executive summaries for both soil analysis and water quality reports, 
                            highlighting key findings, critical issues, and actionable recommendations.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">For Soil Reports:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Overall soil health assessment</li>
                              <li>• Key nutrient deficiencies or excesses</li>
                              <li>• Priority improvement recommendations</li>
                              <li>• Economic impact analysis</li>
                              <li>• ROI considerations for amendments</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">For Water Reports:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Overall water safety assessment</li>
                              <li>• Contaminant violations and concerns</li>
                              <li>• Health and safety recommendations</li>
                              <li>• Property and lending implications</li>
                              <li>• Filter and treatment suggestions</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">When Summaries Appear:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Automatically generated when viewing soil analysis results</li>
                            <li>• Appear at the top of water quality reports</li>
                            <li>• Can be refreshed to generate new perspectives</li>
                            <li>• Include model information (GPT-5 or GPT-4o fallback)</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="crop-recommendations">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          AI Crop Recommendations
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Intelligent Crop Selection</h4>
                          <p className="text-sm text-muted-foreground">
                            AI Crop Recommendations analyze your specific location, soil conditions, weather patterns, and market data 
                            to provide personalized crop suitability scores for traditional and alternative crops.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">What You Get:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Suitability scores (0-100%) for each crop</li>
                              <li>• Yield potential and target assessments</li>
                              <li>• Pros and cons for your specific location</li>
                              <li>• Market outlook and profit potential</li>
                              <li>• Environmental impact analysis</li>
                              <li>• Detailed growing requirements</li>
                              <li>• Confidence levels for each recommendation</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Custom Crop Analysis:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Click "Add Crop" to analyze any crop</li>
                              <li>• Enter specialty crops like quinoa, hemp, buckwheat</li>
                              <li>• Analyze cover crops and rotation options</li>
                              <li>• Compare unconventional crops to traditional ones</li>
                              <li>• Get detailed analysis for emerging crops</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Accessing Recommendations:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• View in Dashboard → Farm Overview tab</li>
                            <li>• Click refresh button for latest market data</li>
                            <li>• Click info button for detailed crop analysis</li>
                            <li>• Use "Force Live Update" for real-time agricultural data</li>
                            <li>• Data includes USDA soil data and NOAA weather when available</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="seasonal-planning">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Seasonal Planning Assistant
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Intelligent Crop Planning</h4>
                          <p className="text-sm text-muted-foreground">
                            The Seasonal Planning Assistant uses GPT-5 to create comprehensive seasonal strategies including 
                            crop rotation plans, planting schedules, and sustainability practices tailored to your location and conditions.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Planning Types:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• <strong>Crop Rotation Planning:</strong> 3-4 year sequences</li>
                              <li>• <strong>Seasonal Calendar:</strong> Month-by-month timing</li>
                              <li>• <strong>Soil Improvement:</strong> Long-term fertility</li>
                              <li>• <strong>Market Optimization:</strong> Economic benefits</li>
                              <li>• <strong>Sustainable Practices:</strong> Environmental focus</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">How to Access:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Visit the Dashboard and click the Seasonal Planning card</li>
                              <li>• Or navigate directly to /seasonal-planning</li>
                              <li>• Select your county for location-specific recommendations</li>
                              <li>• Choose planning focus and timeframe (1, 3, or 5 years)</li>
                              <li>• Optionally select preferred crops</li>
                            </ul>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-1">Weather Integration</h5>
                            <p className="text-xs text-blue-700">
                              Considers USDA zones, frost dates, growing season length, and seasonal patterns
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded border border-green-200">
                            <h5 className="font-medium text-green-800 mb-1">Soil Context</h5>
                            <p className="text-xs text-green-700">
                              Integrates your soil analysis data for personalized recommendations
                            </p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded border border-purple-200">
                            <h5 className="font-medium text-purple-800 mb-1">GPT-5 Analysis</h5>
                            <p className="text-xs text-purple-700">
                              Advanced reasoning for complex multi-year planning strategies
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Sample Planning Output:</h4>
                          <p className="text-sm text-muted-foreground">
                            The assistant provides detailed markdown-formatted plans including crop rotation sequences, 
                            monthly planting/harvesting schedules, soil management practices, weather considerations, 
                            economic optimization strategies, and sustainability recommendations.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="task-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Seasonal Task Management Guide
                    <Badge variant="outline" className="ml-2">NEW</Badge>
                  </CardTitle>
                  <CardDescription>
                    Master seasonal task tracking to remember and improve farming practices year after year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="task-overview">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Getting Started with Task Management
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Why Task Management?</h4>
                          <p className="text-sm text-muted-foreground">
                            One of the biggest challenges farmers face is remembering what worked, what didn't, and when to do things from one season to the next. 
                            The Seasonal Task Manager helps you track every seasonal task, build a farming knowledge base, and improve your operations year over year.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Access the Task Manager:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• From Dashboard → "Manage Seasonal Tasks" button</li>
                              <li>• From Seasonal Planning → "Task Manager" button</li>
                              <li>• Direct navigation to /task-manager</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Main Sections:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• <strong>My Tasks:</strong> Active and pending tasks</li>
                              <li>• <strong>Task Library:</strong> Pre-built templates</li>
                              <li>• <strong>History & Learnings:</strong> Completed tasks with notes</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="task-templates">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Task Template Library
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Pre-Built Seasonal Tasks</h4>
                          <p className="text-sm text-muted-foreground">
                            Start with 20+ professionally crafted task templates covering every season and farming activity. 
                            Each template includes recommended timing, estimated duration, and crop-specific guidance.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-semibold mb-2">Spring Tasks:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Soil Testing & Preparation</li>
                              <li>• Spring Planting (Cool & Warm Season)</li>
                              <li>• Irrigation Setup</li>
                              <li>• Frost Protection</li>
                              <li>• First Fertilizer Application</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Summer Tasks:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Pest Scouting & Management</li>
                              <li>• Irrigation Monitoring</li>
                              <li>• Mid-Season Fertilization</li>
                              <li>• Succession Planting</li>
                              <li>• Harvest Operations</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-2">Fall/Winter Tasks:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Fall Soil Amendment</li>
                              <li>• Cover Crop Planting</li>
                              <li>• Equipment Winterization</li>
                              <li>• Record Keeping</li>
                              <li>• Winter Planning</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">How to Use Templates:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Browse templates by category or search by name</li>
                            <li>• Click "Add to My Tasks" to create from template</li>
                            <li>• Customize dates, fields, and details for your farm</li>
                            <li>• Templates provide typical timing notes (e.g., "2 weeks before last frost")</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tier-features">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Features by Subscription Tier
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid gap-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Free Tier</Badge>
                              <span className="text-sm font-medium">Getting Started</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• View all task templates (read-only)</li>
                              <li>• Create up to 10 tasks per season</li>
                              <li>• Basic task status tracking (pending/completed)</li>
                              <li>• No recurring task support</li>
                            </ul>
                          </div>

                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>Starter - $29/mo</Badge>
                              <span className="text-sm font-medium">Unlimited Tasks</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• <strong>Unlimited task creation</strong></li>
                              <li>• Full access to task template library</li>
                              <li>• Task history tracking</li>
                              <li>• Annual recurring tasks</li>
                              <li>• Field-specific task assignment</li>
                              <li>• Up to 50 email reminders per month</li>
                            </ul>
                          </div>

                          <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-purple-600">Pro - $79/mo</Badge>
                              <span className="text-sm font-medium">Advanced Intelligence</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Everything in Starter, plus:</li>
                              <li>• <strong>Advanced recurring patterns</strong> (seasonal, monthly, custom)</li>
                              <li>• Task completion learnings & notes</li>
                              <li>• Year-over-year task comparison</li>
                              <li>• AI-powered task recommendations</li>
                              <li>• Unlimited email reminders</li>
                              <li>• Task export & reporting</li>
                            </ul>
                          </div>

                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">Enterprise - $149/mo</Badge>
                              <span className="text-sm font-medium">Team Collaboration</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Everything in Pro, plus:</li>
                              <li>• Team task collaboration & assignment</li>
                              <li>• Custom task templates & workflows</li>
                              <li>• Task management API access</li>
                              <li>• Multi-user farm management</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="recurring-tasks">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-5 w-5" />
                          Recurring Task Automation
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                          <h4 className="font-semibold mb-2">Never Forget Seasonal Tasks</h4>
                          <p className="text-sm text-muted-foreground">
                            Recurring tasks automatically remind you what needs to be done each season. Set it once, and the system 
                            generates new task instances at the right time every year.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-3">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <Badge variant="outline">Starter+</Badge>
                              Annual Recurring
                            </h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Tasks that repeat once per year (e.g., "Spring Soil Testing", "Fall Cover Crop Planting")
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Perfect for farmers who need to remember yearly maintenance and seasonal preparations
                            </p>
                          </div>
                          <div className="border-2 border-purple-500 rounded-lg p-3 bg-purple-50">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                              <Badge className="bg-purple-600">Pro+</Badge>
                              Advanced Patterns
                            </h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Seasonal (quarterly), Monthly, or Custom frequency patterns
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ideal for intensive rotations, succession planting, and frequent monitoring tasks
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="task-history">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Task History & Learnings (Coming Soon)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold mb-2">Build Your Farming Knowledge Base</h4>
                          <p className="text-sm text-muted-foreground">
                            The History & Learnings feature (currently in development) will let you document what worked, what didn't, 
                            and recommendations for next time. This creates a personalized farming playbook that improves year over year.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Planned Features:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Task completion notes and observations</li>
                            <li>• "What worked" and "What to improve" sections</li>
                            <li>• Outcome ratings (1-5 stars)</li>
                            <li>• Year-over-year comparison</li>
                            <li>• AI-powered insights from your history</li>
                            <li>• Photo attachments for visual documentation</li>
                          </ul>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          This feature requires Starter plan or higher and will be available in Q2 2025
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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

            <TabsContent value="sensor-integration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-6 w-6" />
                    Soil Sensor Integration & Installation
                    <Badge variant="outline" className="ml-2">ADVANCED</Badge>
                  </CardTitle>
                  <CardDescription>
                    Connect physical soil sensors to activate real-time data feeds for Soil Health Trends and Weather Forecast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="compatible-sensors">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5" />
                          Compatible Soil Sensor Systems
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Professional IoT Sensors</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• <strong>Davis Instruments WeatherLink:</strong> Weather + soil moisture</li>
                              <li>• <strong>Onset HOBO:</strong> Multi-parameter data loggers</li>
                              <li>• <strong>Campbell Scientific:</strong> Research-grade stations</li>
                              <li>• <strong>Sentek Drill & Drop:</strong> Profile moisture sensors</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">DIY & Arduino-Based</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• <strong>Arduino + DHT22:</strong> Temperature/humidity</li>
                              <li>• <strong>Raspberry Pi + sensors:</strong> Custom monitoring</li>
                              <li>• <strong>ESP32 + soil probes:</strong> Wireless soil monitoring</li>
                              <li>• <strong>LoRaWAN networks:</strong> Long-range field sensors</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Required Sensor Capabilities:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <strong>API or webhook output:</strong> Must provide real-time data feeds</li>
                            <li>• <strong>JSON/REST compatibility:</strong> For integration with SoilSidekick Pro</li>
                            <li>• <strong>Minimum measurements:</strong> Soil moisture, temperature, pH (optional)</li>
                            <li>• <strong>Data logging:</strong> 15-minute or hourly intervals recommended</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="physical-installation">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Physical Sensor Installation
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Installation Safety</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              <li>• Call 811 before digging to locate underground utilities</li>
                              <li>• Use weatherproof enclosures for electronics</li>
                              <li>• Ground all electrical components properly</li>
                              <li>• Install lightning protection for exposed sensors</li>
                            </ul>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-3">Soil Sensor Placement</h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Depth: 6-12 inches</p>
                                    <p className="text-xs text-muted-foreground">Root zone monitoring depth</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Representative location</p>
                                    <p className="text-xs text-muted-foreground">Avoid field edges, drainage areas</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Multiple sensors</p>
                                    <p className="text-xs text-muted-foreground">1 per 10-20 acres recommended</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Weather Station Setup</h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Height: 5-6 feet</p>
                                    <p className="text-xs text-muted-foreground">Standard weather measurement height</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Open area</p>
                                    <p className="text-xs text-muted-foreground">No obstructions within 30 feet</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Radiation shield</p>
                                    <p className="text-xs text-muted-foreground">Protect temperature/humidity sensors</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="api-integration">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          API Integration & Data Pipeline
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Integration Methods</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">1. Webhook Integration</h5>
                              <p className="text-sm text-blue-700 mb-2">
                                Configure your sensor system to send real-time data to SoilSidekick Pro endpoints.
                              </p>
                              <div className="bg-blue-100 p-2 rounded text-xs font-mono">
                                POST /api/sensor-data<br/>
                                Authorization: Bearer YOUR_API_KEY
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">2. Polling Integration</h5>
                              <p className="text-sm text-blue-700 mb-2">
                                SoilSidekick Pro pulls data from your sensor API on a scheduled basis.
                              </p>
                              <div className="bg-blue-100 p-2 rounded text-xs font-mono">
                                GET /your-sensor-api/data<br/>
                                Content-Type: application/json
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Required Data Format</h4>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <pre className="text-xs overflow-x-auto">{`{
  "timestamp": "2024-01-15T14:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "field_id": "north_field_1"
  },
  "soil_data": {
    "moisture_percent": 55.2,
    "temperature_c": 18.5,
    "ph": 6.8,
    "electrical_conductivity": 1.2
  },
  "weather_data": {
    "air_temperature_c": 24.1,
    "humidity_percent": 67,
    "wind_speed_mps": 3.2,
    "precipitation_mm": 0.0
  }
}`}</pre>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Integration Steps:</h4>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            <li>1. <strong>Generate API Key:</strong> Go to Settings → API Keys in your dashboard</li>
                            <li>2. <strong>Configure Sensor Output:</strong> Set your sensor system to output JSON data</li>
                            <li>3. <strong>Test Integration:</strong> Use our API testing tool to verify data flow</li>
                            <li>4. <strong>Enable Live Data:</strong> Toggle "Live Sensor Data" in dashboard settings</li>
                            <li>5. <strong>Verify Charts:</strong> Check that Soil Health Trends shows real sensor data</li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="troubleshooting-sensors">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Sensor Troubleshooting & Maintenance
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-red-600">Common Issues</h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm">Data Not Appearing in Dashboard</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Check API key authentication</li>
                                  <li>• Verify JSON format matches requirements</li>
                                  <li>• Ensure timestamps are in UTC</li>
                                  <li>• Check network connectivity</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Inconsistent Readings</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Calibrate sensors quarterly</li>
                                  <li>• Clean soil contact surfaces</li>
                                  <li>• Check for physical damage</li>
                                  <li>• Verify sensor placement depth</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 text-green-600">Maintenance Schedule</h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm">Monthly</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Check battery levels</li>
                                  <li>• Verify data transmission</li>
                                  <li>• Clean weather station components</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Quarterly</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Calibrate soil sensors</li>
                                  <li>• Update firmware if available</li>
                                  <li>• Check mounting stability</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Annually</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Replace batteries</li>
                                  <li>• Inspect cables and connections</li>
                                  <li>• Update sensor calibration constants</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Professional Installation</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            For large-scale operations or complex installations, we recommend working with certified agricultural technology providers.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Find Installers</Button>
                            <Button size="sm" variant="outline">Request Quote</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-6 w-6" />
                    Webhooks & Integrations
                    <Badge variant="outline" className="ml-2">API</Badge>
                  </CardTitle>
                  <CardDescription>
                    Configure webhooks for real-time notifications, third-party integrations, and automated workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="webhook-overview">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Webhook className="h-5 w-5" />
                          What Are Webhooks?
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Webhook Basics</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Webhooks are HTTP callbacks that SoilSidekick Pro sends to your external systems when specific events occur. 
                            Think of them as "reverse APIs" - instead of you asking for data, we push it to you in real-time.
                          </p>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <h5 className="font-medium mb-1">Traditional API Call</h5>
                              <p className="text-xs text-blue-600">Your system → SoilSidekick Pro</p>
                              <p className="text-xs text-blue-700">"Give me the latest soil data"</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Webhook</h5>
                              <p className="text-xs text-blue-600">SoilSidekick Pro → Your system</p>
                              <p className="text-xs text-blue-700">"Here's new soil data as it happens"</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Agricultural Events</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Soil moisture alerts</li>
                              <li>• Weather warnings</li>
                              <li>• Crop health changes</li>
                              <li>• pH threshold violations</li>
                            </ul>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-2">System Events</h4>
                            <ul className="text-sm text-orange-700 space-y-1">
                              <li>• Analysis completions</li>
                              <li>• Report generations</li>
                              <li>• API rate limit warnings</li>
                              <li>• Data sync events</li>
                            </ul>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Integration Events</h4>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>• Third-party data updates</li>
                              <li>• Equipment status changes</li>
                              <li>• Market price alerts</li>
                              <li>• Carbon credit updates</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhook-setup">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Setting Up Webhooks
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Step-by-Step Setup</h4>
                            <ol className="text-sm text-muted-foreground space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">1</span>
                                <div>
                                  <strong>Create Webhook Endpoint:</strong> Set up an HTTPS endpoint on your server to receive webhook data
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">2</span>
                                <div>
                                  <strong>Configure in Dashboard:</strong> Go to Settings → Webhooks and add your endpoint URL
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">3</span>
                                <div>
                                  <strong>Select Events:</strong> Choose which events should trigger webhooks to your endpoint
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">4</span>
                                <div>
                                  <strong>Test Integration:</strong> Use our webhook testing tool to verify your endpoint works
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">5</span>
                                <div>
                                  <strong>Go Live:</strong> Enable the webhook and start receiving real-time events
                                </div>
                              </li>
                            </ol>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-3">Required Endpoint Properties</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">HTTPS only (SSL required)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">Responds with 200 status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">Responds within 30 seconds</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">Accepts POST requests</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Example Endpoint Code</h4>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <pre className="text-xs overflow-x-auto">{`// Node.js Express example
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  const payload = req.body;
  
  // Verify signature (see security section)
  if (verifySignature(payload, signature)) {
    // Process the webhook event
    console.log('Event:', payload.event);
    console.log('Data:', payload.data);
    
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});`}</pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhook-security">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Webhook Security & Verification
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">🔒 Security Best Practices</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• <strong>Always verify webhook signatures</strong> to ensure requests come from SoilSidekick Pro</li>
                            <li>• <strong>Use HTTPS endpoints only</strong> to protect data in transit</li>
                            <li>• <strong>Implement rate limiting</strong> to prevent abuse</li>
                            <li>• <strong>Log webhook events</strong> for debugging and audit trails</li>
                          </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3">Signature Verification</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Each webhook includes an <code>X-Signature</code> header containing an HMAC SHA-256 signature of the payload.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <pre className="text-xs overflow-x-auto">{`// JavaScript verification
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === \`sha256=\${expected}\`;
}`}</pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">IP Whitelisting</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              For additional security, whitelist these SoilSidekick Pro IP ranges:
                            </p>
                            <div className="space-y-2">
                              <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                                198.51.100.0/24
                              </div>
                              <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                                203.0.113.0/24
                              </div>
                              <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                                192.0.2.0/24
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              <strong>Note:</strong> IP ranges may change. Check dashboard for current list.
                            </p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Webhook Secret Management</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Each webhook endpoint gets a unique secret key for signature verification. You can:
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Key className="h-4 w-4 mr-2" />
                              Regenerate Secret
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Test Webhook
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhook-payloads">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Webhook Payloads & Event Types
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Common Payload Structure</h4>
                            <pre className="text-xs overflow-x-auto">{`{
  "event": "soil.moisture.alert",
  "timestamp": "2024-01-15T14:30:00Z",
  "webhook_id": "wh_123456789",
  "data": {
    "field_id": "north_field_1",
    "county_fips": "48453",
    "alert_type": "low_moisture",
    "current_value": 25.3,
    "threshold": 30.0,
    "location": {
      "latitude": 30.2672,
      "longitude": -97.7431
    }
  },
  "metadata": {
    "user_id": "usr_abc123",
    "subscription_tier": "pro",
    "delivery_attempt": 1
  }
}`}</pre>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-3 text-green-600">Agricultural Events</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="font-medium text-sm">soil.moisture.alert</h5>
                                  <p className="text-xs text-muted-foreground">Triggered when soil moisture falls below/above thresholds</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">weather.severe.warning</h5>
                                  <p className="text-xs text-muted-foreground">Severe weather alerts for your fields</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">crop.health.change</h5>
                                  <p className="text-xs text-muted-foreground">Significant vegetation health changes detected</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">ph.threshold.violation</h5>
                                  <p className="text-xs text-muted-foreground">Soil pH outside optimal range</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3 text-blue-600">System Events</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="font-medium text-sm">analysis.completed</h5>
                                  <p className="text-xs text-muted-foreground">Soil or water analysis finished processing</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">report.generated</h5>
                                  <p className="text-xs text-muted-foreground">PDF report ready for download</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">api.rate.limit.warning</h5>
                                  <p className="text-xs text-muted-foreground">Approaching API rate limits</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">carbon.credit.update</h5>
                                  <p className="text-xs text-muted-foreground">Carbon credit calculation completed</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhook-integrations">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Popular Integration Examples
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Farm Management Systems</h4>
                            <p className="text-sm text-green-700 mb-3">
                              Integrate with John Deere Operations Center, Climate FieldView, or custom farm management platforms.
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <strong>Use Case:</strong> Auto-sync soil data to update field records
                              </div>
                              <div className="text-xs">
                                <strong>Events:</strong> soil.analysis.completed, moisture.alert
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Irrigation Systems</h4>
                            <p className="text-sm text-blue-700 mb-3">
                              Connect with smart irrigation controllers for automated water management.
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <strong>Use Case:</strong> Trigger irrigation when soil moisture drops
                              </div>
                              <div className="text-xs">
                                <strong>Events:</strong> soil.moisture.alert, weather.forecast.update
                              </div>
                            </div>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-2">Slack/Teams Notifications</h4>
                            <p className="text-sm text-orange-700 mb-3">
                              Send real-time agricultural alerts to your team communication channels.
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <strong>Use Case:</strong> Instant alerts for critical field conditions
                              </div>
                              <div className="text-xs">
                                <strong>Events:</strong> weather.severe.warning, ph.threshold.violation
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Business Intelligence</h4>
                            <p className="text-sm text-purple-700 mb-3">
                              Feed data into Power BI, Tableau, or custom analytics dashboards.
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <strong>Use Case:</strong> Real-time agricultural KPI monitoring
                              </div>
                              <div className="text-xs">
                                <strong>Events:</strong> analysis.completed, carbon.credit.update
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Integration Templates</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            We provide ready-to-use webhook integration templates for popular platforms:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline">Zapier Template</Button>
                            <Button size="sm" variant="outline">Power Automate</Button>
                            <Button size="sm" variant="outline">IFTTT Recipe</Button>
                            <Button size="sm" variant="outline">AWS Lambda</Button>
                            <Button size="sm" variant="outline">Google Cloud</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="webhook-troubleshooting">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Troubleshooting Webhooks
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-red-600">Common Issues</h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm">Webhooks Not Arriving</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Check endpoint HTTPS certificate</li>
                                  <li>• Verify endpoint returns 200 status</li>
                                  <li>• Check firewall/IP restrictions</li>
                                  <li>• Review webhook delivery logs</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Signature Verification Failing</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Ensure using correct webhook secret</li>
                                  <li>• Check payload encoding (UTF-8)</li>
                                  <li>• Verify HMAC implementation</li>
                                  <li>• Test with webhook testing tool</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Duplicate Events</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  <li>• Implement idempotency using webhook_id</li>
                                  <li>• Check for multiple webhook configurations</li>
                                  <li>• Review retry/timeout settings</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 text-green-600">Debugging Tools</h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm">Webhook Inspector</h5>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Real-time webhook delivery monitoring in your dashboard
                                </p>
                                <Button size="sm" variant="outline">Open Inspector</Button>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Test Webhook</h5>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Send test events to verify your endpoint setup
                                </p>
                                <Button size="sm" variant="outline">Send Test Event</Button>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">Delivery Logs</h5>
                                <p className="text-xs text-muted-foreground mb-2">
                                  View detailed logs of webhook delivery attempts
                                </p>
                                <Button size="sm" variant="outline">View Logs</Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">Retry Policy</h4>
                          <p className="text-sm text-yellow-700 mb-3">
                            If your endpoint fails to respond with a 200 status, we'll retry delivery with exponential backoff:
                          </p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• <strong>Attempt 1:</strong> Immediate</li>
                            <li>• <strong>Attempt 2:</strong> After 1 minute</li>
                            <li>• <strong>Attempt 3:</strong> After 5 minutes</li>
                            <li>• <strong>Attempt 4:</strong> After 30 minutes</li>
                            <li>• <strong>Attempt 5:</strong> After 2 hours (final attempt)</li>
                          </ul>
                          <p className="text-xs text-yellow-600 mt-2">
                            After 5 failed attempts, the webhook will be disabled and you'll receive an email notification.
                          </p>
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
                          <Zap className="h-5 w-5 text-secondary mt-0.5" />
                          <div>
                            <h4 className="font-medium">AI Crop Recommendations</h4>
                            <p className="text-sm text-muted-foreground">
                              GPT-5 powered crop suitability analysis with custom crop support and live data
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
                      <li>• Use refresh buttons to get live data from NOAA and USDA</li>
                      <li>• Try AI Crop Recommendations for alternative crop analysis</li>
                      <li>• Click "Add Crop" to analyze any specialty or cover crop</li>
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