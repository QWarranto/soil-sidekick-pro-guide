import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area, BarChart, Bar } from "recharts";
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
  RefreshCw
} from "lucide-react";

const Dashboard = () => {
  // Mock data for demonstration
  const soilHealthData = [
    { month: "Jan", health: 82 },
    { month: "Feb", health: 78 },
    { month: "Mar", health: 85 },
    { month: "Apr", health: 88 },
    { month: "May", health: 92 },
    { month: "Jun", health: 87 }
  ];

  const weatherForecast = [
    { time: "6AM", temperature: 18, humidity: 75 },
    { time: "9AM", temperature: 22, humidity: 68 },
    { time: "12PM", temperature: 28, humidity: 55 },
    { time: "3PM", temperature: 32, humidity: 45 },
    { time: "6PM", temperature: 26, humidity: 62 },
    { time: "9PM", temperature: 20, humidity: 70 }
  ];

  const cropYield = [
    { crop: "Corn", yield: 85, target: 90 },
    { crop: "Wheat", yield: 78, target: 80 },
    { crop: "Soybeans", yield: 92, target: 85 },
    { crop: "Barley", yield: 74, target: 75 }
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
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Soil Health Trends
              </CardTitle>
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
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
                Weather Forecast
              </CardTitle>
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

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                AI Crop Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cropYield.map((crop, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{crop.crop}</span>
                    <span className="text-muted-foreground">{crop.yield}%</span>
                  </div>
                  <Progress value={crop.yield} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Yield: {crop.yield} tons/ha</span>
                    <span className={crop.yield >= crop.target ? "text-green-600" : "text-yellow-600"}>
                      {crop.yield >= crop.target ? "Above target" : "Below target"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <h5 className="font-medium text-sm mb-2">Quick Actions</h5>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Planting
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Droplets className="h-4 w-4 mr-2" />
                    Set Irrigation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Leaf className="h-4 w-4 mr-2" />
                    Apply Fertilizer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Environmental Monitoring
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
      </div>
    </div>
  );
};

export default Dashboard;