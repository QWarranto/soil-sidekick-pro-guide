import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AppCharacteristics {
  currentAccuracy: number;
  avgResponseTime: number;
  monthlyApiCalls: number;
  currentCostPerCall: number;
  dataQuality: number;
  userBase: number;
}

interface ImpactMetrics {
  accuracyImprovement: number;
  responseTimeReduction: number;
  costSavings: number;
  dataQualityScore: number;
  roi: number;
  timeToValue: number;
}

interface ImpactSimulatorChartsProps {
  characteristics: AppCharacteristics;
  impact: ImpactMetrics;
}

export default function ImpactSimulatorCharts({ characteristics, impact }: ImpactSimulatorChartsProps) {
  const accuracyData = [
    {
      metric: "Accuracy",
      "Before LeafEngines": characteristics.currentAccuracy,
      "With LeafEngines": impact.accuracyImprovement,
    },
  ];

  const responseTimeData = [
    { month: "Month 1", time: characteristics.avgResponseTime },
    { month: "Month 2", time: characteristics.avgResponseTime * 0.85 },
    { month: "Month 3", time: characteristics.avgResponseTime * 0.70 },
    { month: "Month 4", time: characteristics.avgResponseTime * 0.55 },
    { month: "Month 5", time: impact.responseTimeReduction },
    { month: "Month 6", time: impact.responseTimeReduction * 0.98 },
  ];

  const costBreakdownData = [
    { name: "Monthly Savings", value: impact.costSavings, color: "hsl(var(--primary))" },
    { name: "Remaining Cost", value: (characteristics.currentCostPerCall * characteristics.monthlyApiCalls) - impact.costSavings, color: "hsl(var(--muted))" },
  ];

  const apiEfficiencyData = [
    { month: "Jan", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
    { month: "Feb", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
    { month: "Mar", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
    { month: "Apr", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
    { month: "May", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
    { month: "Jun", current: characteristics.monthlyApiCalls, optimized: characteristics.monthlyApiCalls * 0.7 },
  ];

  const retentionGrowthData = [
    { month: "Month 1", users: characteristics.userBase, retention: 75 },
    { month: "Month 3", users: characteristics.userBase * 1.15, retention: 82 },
    { month: "Month 6", users: characteristics.userBase * 1.35, retention: 88 },
    { month: "Month 9", users: characteristics.userBase * 1.55, retention: 92 },
    { month: "Month 12", users: characteristics.userBase * 1.80, retention: 95 },
  ];

  const dataQualityGaugeData = [
    {
      name: "Quality",
      value: impact.dataQualityScore,
      fill: "hsl(var(--primary))",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📈 Accuracy Uplift</CardTitle>
          <CardDescription>
            Current vs. projected environmental data accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Before LeafEngines" fill="hsl(var(--muted))" />
              <Bar dataKey="With LeafEngines" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚡ Response Time Improvement</CardTitle>
          <CardDescription>
            Reduced latency with LeafEngines™ on-device AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={3} name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 API Efficiency</CardTitle>
          <CardDescription>
            Monthly API calls vs. optimized calls with cost savings highlighted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiEfficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="hsl(var(--muted))" name="Current Calls" />
              <Bar dataKey="optimized" fill="hsl(var(--primary))" name="With LeafEngines" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-sm font-medium text-green-600">Estimated Monthly Savings</div>
            <div className="text-2xl font-bold text-green-600">${impact.costSavings.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Through optimized API usage and reduced infrastructure costs
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💵 Cost Breakdown</CardTitle>
          <CardDescription>
            Financial clarity on cost reduction per API call
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {costBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Data Quality Score Boost</CardTitle>
          <CardDescription>
            Uplift in quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={30}
              data={dataQualityGaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                dataKey="value"
              />
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-primary">
                {impact.dataQualityScore.toFixed(1)}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>👥 Retention & User Growth Projection</CardTitle>
          <CardDescription>
            Reduced churn and expanded user base with improved accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={retentionGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
                name="Active Users"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="retention"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
                name="Retention %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
