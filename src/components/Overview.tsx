import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Sector
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Leaf, Award } from 'lucide-react';

// Sample data for carbon credits and organic matter
const carbonData = [
  { month: 'Jan', credits: 45, organicMatter: 3.2 },
  { month: 'Feb', credits: 52, organicMatter: 3.4 },
  { month: 'Mar', credits: 48, organicMatter: 3.3 },
  { month: 'Apr', credits: 61, organicMatter: 3.6 },
  { month: 'May', credits: 55, organicMatter: 3.5 },
  { month: 'Jun', credits: 67, organicMatter: 3.8 },
];

// Sample data for task status distribution
const taskStatusData = [
  { name: 'Completed', value: 45, color: 'hsl(var(--success))' },
  { name: 'In Progress', value: 28, color: 'hsl(var(--primary))' },
  { name: 'Pending', value: 18, color: 'hsl(var(--warning))' },
  { name: 'Cancelled', value: 9, color: 'hsl(var(--destructive))' },
];

// Custom tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {entry.dataKey === 'credits' ? `${entry.value} credits` : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground mb-1">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} tasks ({((data.value / taskStatusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

// Active shape renderer for Pie Chart hover effect
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 6}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        className="text-lg font-bold"
      >
        {payload.value}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        className="text-sm"
      >
        {payload.name}
      </text>
    </g>
  );
};

export function Overview() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [visibleSeries, setVisibleSeries] = useState({
    credits: true,
    organicMatter: true,
  });

  const handleLegendClick = (dataKey: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farm Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your farm's performance with interactive analytics
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Credits & Organic Matter Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Carbon Credits & Organic Matter
            </CardTitle>
            <CardDescription>
              Monthly trends of carbon credits earned and soil organic matter percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Credits', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Organic Matter (%)', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  onClick={(e) => handleLegendClick(String(e.dataKey))}
                  wrapperStyle={{ cursor: 'pointer' }}
                  formatter={(value, entry: any) => (
                    <span style={{ 
                      textDecoration: !visibleSeries[entry.dataKey as keyof typeof visibleSeries] ? 'line-through' : 'none',
                      opacity: !visibleSeries[entry.dataKey as keyof typeof visibleSeries] ? 0.5 : 1 
                    }}>
                      {value}
                    </span>
                  )}
                />
                {visibleSeries.credits && (
                  <Bar 
                    yAxisId="left"
                    dataKey="credits" 
                    name="Credits Earned"
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {visibleSeries.organicMatter && (
                  <Bar 
                    yAxisId="right"
                    dataKey="organicMatter" 
                    name="Organic Matter"
                    fill="hsl(var(--success))" 
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleLegendClick('credits')}
                style={{ opacity: visibleSeries.credits ? 1 : 0.5 }}
              >
                <Award className="h-3 w-3 mr-1" />
                {visibleSeries.credits ? 'Hide' : 'Show'} Credits
              </Badge>
              <Badge 
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleLegendClick('organicMatter')}
                style={{ opacity: visibleSeries.organicMatter ? 1 : 0.5 }}
              >
                <Leaf className="h-3 w-3 mr-1" />
                {visibleSeries.organicMatter ? 'Hide' : 'Show'} Organic Matter
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>
              Overview of all tasks by their current status (hover to expand)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  onMouseEnter={handlePieEnter}
                  onMouseLeave={handlePieLeave}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
