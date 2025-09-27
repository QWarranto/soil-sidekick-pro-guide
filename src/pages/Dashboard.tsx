import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area, BarChart, Bar } from "recharts";
import { AddFieldDialog } from "@/components/AddFieldDialog";
import AgriculturalChat from "@/components/AgriculturalChat";
import { LocationIndicator } from "@/components/LocationIndicator";
import { CarbonCreditDashboard } from "@/components/CarbonCreditDashboard";
import { SeasonalPlanningCard } from "@/components/SeasonalPlanningCard";
import { QuickAccessSuggestion } from "@/components/QuickAccessSuggestion";
import CostMonitoringDashboard from "@/components/CostMonitoringDashboard";
import UsageDashboard from "@/components/UsageDashboard";
import KPIDashboard from "@/components/KPIDashboard";
import { useLiveAgriculturalData } from "@/hooks/useLiveAgriculturalData";
import AICropRecommendations from "@/components/AICropRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  TrendingUp, 
  Droplets, 
  Thermometer, 
  Leaf, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap,
  Filter,
  Plus,
  RefreshCw,
  Satellite,
  Eye,
  Brain,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { data: liveData, isLoading, refreshData, getDataAge } = useLiveAgriculturalData();

  // Initialize data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleFieldAdded = (field: any) => {
    console.log("New field added:", field);
    // Here you would typically save to database or state management
  };

  const handleRefreshData = (forceLive: boolean = false) => {
    refreshData(undefined, forceLive);
  };

  // Use live data if available, otherwise fallback to mock data
  const soilHealthData = liveData?.soil?.trends || [
    { month: "Jan", health: 82 },
    { month: "Feb", health: 78 },
    { month: "Mar", health: 85 },
    { month: "Apr", health: 88 },
    { month: "May", health: 92 },
    { month: "Jun", health: 87 }
  ];

  const weatherForecast = liveData?.weather?.forecast || [
    { time: "6AM", temperature: 18, humidity: 75 },
    { time: "9AM", temperature: 22, humidity: 68 },
    { time: "12PM", temperature: 28, humidity: 55 },
    { time: "3PM", temperature: 32, humidity: 45 },
    { time: "6PM", temperature: 26, humidity: 62 },
    { time: "9PM", temperature: 20, humidity: 70 }
  ];

  const fields = [
    { id: 1, name: "North Field", area: "45.2 ha", crop: "Corn", health: 87, status: "healthy", ph: 6.8, moisture: 55 },
    { id: 2, name: "South Field", area: "32.8 ha", crop: "Soybeans", health: 92, status: "healthy", ph: 6.2, moisture: 42 },
    { id: 3, name: "East Field", area: "28.5 ha", crop: "Wheat", health: 79, status: "warning", ph: 7.1, moisture: 58 },
    { id: 4, name: "West Field", area: "41 ha", crop: "Barley", health: 65, status: "critical", ph: 5.8, moisture: 35 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "healthy": return "default";
      case "warning": return "secondary";
      case "critical": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Agricultural Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor your farm's health and performance in real-time</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRefreshData(true)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <AddFieldDialog onFieldAdded={handleFieldAdded} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Location Indicator */}
        <LocationIndicator />

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Farm Overview</TabsTrigger>
            <TabsTrigger value="ai-assistant" className="text-xs md:text-sm">AI Assistant</TabsTrigger>
            <TabsTrigger value="carbon-credits" className="text-xs md:text-sm">Carbon Credits</TabsTrigger>
            <TabsTrigger value="kpi-dashboard" className="text-xs md:text-sm">KPI Dashboard</TabsTrigger>
            <TabsTrigger value="cost-monitoring" className="text-xs md:text-sm">Cost Analytics</TabsTrigger>
            <TabsTrigger value="usage-analytics" className="text-xs md:text-sm">Usage Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Access Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <QuickAccessSuggestion
                feature="satellite_monitoring"
                title="Satellite Crop Monitoring"
                description="Monitor your crops with real-time satellite imagery"
                usageContext="Get real-time insights into crop health and growth patterns"
                className="md:col-span-1"
              />
              <QuickAccessSuggestion
                feature="carbon_credits"
                title="Carbon Credit Calculator"
                description="Calculate your farm's carbon sequestration potential"
                usageContext="Turn sustainable practices into revenue opportunities"
                className="md:col-span-1"
              />
              <QuickAccessSuggestion
                feature="county_lookup"
                title="Advanced County Data"
                description="Access detailed county-specific agricultural insights"
                usageContext="Get historical weather and soil data for better planning"
                className="md:col-span-1"
              />
            </div>

            {/* Data Freshness Indicator */}
            {liveData && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${liveData.sources.some(s => s.includes('NOAA') || s.includes('USDA')) ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm font-medium">
                        Data Sources: {liveData.sources.join(', ')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {getDataAge()}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshData(true)}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Force Live Update
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fields</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2 new this season</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847 ha</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+5% from last year</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crop Health</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Excellent condition</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yield Forecast</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Above target</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Soil Health Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Soil Health Trends
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {liveData && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getDataAge() || 'Unknown'}
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData()}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              {liveData?.soil && (
                <div className="text-xs text-muted-foreground">
                  Source: {liveData.soil.source} • Health Index: {liveData.soil.health_index}%
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  health: {
                    label: "Soil Health",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={soilHealthData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="health" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weather Forecast */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
                  Weather Forecast
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {liveData && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getDataAge() || 'Unknown'}
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData()}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              {liveData?.weather && (
                <div className="text-xs text-muted-foreground">
                  Source: {liveData.weather.source} • Avg Temp: {liveData.weather.temperature_avg.toFixed(1)}°C
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  temperature: {
                    label: "Temperature",
                    color: "hsl(var(--destructive))",
                  },
                  humidity: {
                    label: "Humidity",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherForecast}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Chart Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-destructive rounded"></div>
                  <span className="text-sm text-muted-foreground">Temperature (°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-primary rounded"></div>
                  <span className="text-sm text-muted-foreground">Humidity (%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Management & AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Field Management
                  </span>
                  <Button variant="outline" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(field.status)}`} />
                        <div>
                          <h4 className="font-medium">{field.name}</h4>
                          <p className="text-sm text-muted-foreground">{field.area} • {field.crop}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{field.health}% Health</p>
                          <p className="text-xs text-muted-foreground">pH {field.ph} • {field.moisture}% moisture</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(field.status)}>
                          {field.status}
                        </Badge>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Crop Recommendations */}
          <AICropRecommendations countyFips="17031" />
        </div>

        {/* Seasonal Planning Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SeasonalPlanningCard />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Planning Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Planting Calendar
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Crop Rotation Planning
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Leaf className="h-4 w-4 mr-2" />
                  Soil Improvement Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Satellite-Enhanced Environmental Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Satellite className="h-5 w-5 mr-2 text-purple-600" />
              AlphaEarth Satellite Intelligence
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Real-time environmental insights powered by Google's AlphaEarth satellite embeddings
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <div className="text-lg font-bold">High</div>
                <p className="text-xs text-muted-foreground">Vegetation Health</p>
                <p className="text-xs text-green-600">92% confidence</p>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <div className="text-lg font-bold">Moderate</div>
                <p className="text-xs text-muted-foreground">Soil Moisture</p>
                <p className="text-xs text-blue-600">85% confidence</p>
              </div>
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <div className="text-lg font-bold">Low</div>
                <p className="text-xs text-muted-foreground">Water Stress</p>
                <p className="text-xs text-yellow-600">78% confidence</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-bold">Low</div>
                <p className="text-xs text-muted-foreground">Erosion Risk</p>
                <p className="text-xs text-green-600">88% confidence</p>
              </div>
              <div className="text-center">
                <Leaf className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <div className="text-lg font-bold">0.23</div>
                <p className="text-xs text-muted-foreground">Carbon Score</p>
                <p className="text-xs text-green-600">Above avg.</p>
              </div>
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                <div className="text-lg font-bold">0.18</div>
                <p className="text-xs text-muted-foreground">Impact Score</p>
                <p className="text-xs text-orange-600">Low impact</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Satellite className="h-4 w-4 mr-2 text-purple-600" />
                Satellite-Enhanced Recommendations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Vegetation health is excellent - continue current practices</li>
                <li>• Consider drought-resistant crops for water conservation</li>
                <li>• Low erosion risk allows for standard tillage practices</li>
                <li>• Carbon sequestration opportunities identified in East Field</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Traditional Environmental Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Weather & Climate Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Thermometer className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <div className="text-2xl font-bold">24°C</div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-xs text-green-600">Sunny, 28°C high</p>
              </div>
              <div className="text-center">
                <Droplets className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <div className="text-2xl font-bold">67%</div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-xs text-muted-foreground">Optimal range</p>
              </div>
              <div className="text-center">
                <Droplets className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">12.5mm</div>
                <p className="text-sm text-muted-foreground">Rainfall</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">8.2 km/h</div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-xs text-muted-foreground">Gentle breeze</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Intelligence Chat */}
        <div className="space-y-6">
          <AgriculturalChat 
            context={{
              county_fips: "18097", // Example FIPS for demonstration
              user_location: "Indiana, USA"
            }}
          />
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium">Low soil moisture detected</p>
                  <p className="text-sm text-muted-foreground">East Field • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Irrigation completed</p>
                  <p className="text-sm text-muted-foreground">South Field • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Fertilization scheduled</p>
                  <p className="text-sm text-muted-foreground">North Field • Tomorrow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="ai-assistant">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    GPT-5 Enhanced Agricultural Intelligence
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Get sophisticated agricultural insights powered by GPT-5's advanced reasoning capabilities. 
                    Ask complex questions about soil health, crop management, sustainability planning, and more.
                  </p>
                </CardHeader>
              </Card>
              
              <AgriculturalChat 
                context={{
                  county_fips: "18097", // Example FIPS for demonstration
                  user_location: "Indiana, USA"
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="carbon-credits">
            <CarbonCreditDashboard />
          </TabsContent>

          <TabsContent value="cost-monitoring">
            <CostMonitoringDashboard />
          </TabsContent>

          <TabsContent value="kpi-dashboard">
            <KPIDashboard />
          </TabsContent>
          
          <TabsContent value="usage-analytics">
            <UsageDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;