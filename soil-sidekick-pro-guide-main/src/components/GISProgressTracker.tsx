import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Clock,
  Database,
  Download,
  RefreshCw,
  Map,
  Target
} from "lucide-react";

interface GISMilestone {
  week: string;
  title: string;
  deliverables: string[];
  impact: number;
  status: 'completed' | 'in_progress' | 'pending';
}

const milestones: GISMilestone[] = [
  {
    week: "1-2",
    title: "Core Asset Management (managed_assets + CRUD)",
    deliverables: [
      "Comprehensive managed_assets table (geometry JSONB, sync fields, soft-delete, version)",
      "asset_history audit table + triggers",
      "assets-crud edge function (action-routed, Zod validation, rate-limited)",
      "RLS policies (owner + admin) and per-user rate limiting"
    ],
    impact: 25,
    status: 'in_progress'
  },
  {
    week: "3",
    title: "GeoJSON/WFS Export Endpoints",
    deliverables: [
      "export-geojson reads geometry JSONB (Point/Line/Polygon)",
      "wfs-export emits GML for any geometry type with centroid fallback",
      "Filters: asset_type, since, bbox, soft-delete aware",
      "Asset export UI panel"
    ],
    impact: 20,
    status: 'in_progress'
  },
  {
    week: "4-5",
    title: "Bi-directional Sync (TreePlotter, Esri)",
    deliverables: [
      "TreePlotter API integration",
      "Esri ArcGIS API integration",
      "Sync configuration UI",
      "Conflict resolution + retry logic"
    ],
    impact: 20,
    status: 'pending'
  },
  {
    week: "6",
    title: "Spatial Queries + ISA Tree Standards",
    deliverables: [
      "Spatial query edge functions",
      "ISA-compliant data validation",
      "Tree valuation calculator",
      "Standards compliance report generator"
    ],
    impact: 5,
    status: 'pending'
  }
];

const getStatusIcon = (status: GISMilestone['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'in_progress':
      return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
    case 'pending':
      return <Circle className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: GISMilestone['status']) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Circle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

const getMilestoneIcon = (index: number) => {
  const icons = [
    <Database className="w-5 h-5" />,
    <Download className="w-5 h-5" />,
    <RefreshCw className="w-5 h-5" />,
    <Map className="w-5 h-5" />
  ];
  return icons[index] || <Target className="w-5 h-5" />;
};

const GISProgressTracker = () => {
  const baselineCompliance = 20;
  const completedImpact = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.impact, 0);
  const inProgressImpact = milestones
    .filter(m => m.status === 'in_progress')
    .reduce((sum, m) => sum + m.impact, 0);
  
  const currentCompliance = baselineCompliance + completedImpact;
  const targetCompliance = 90;
  const progressPercentage = (currentCompliance / targetCompliance) * 100;

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;

  return (
    <Card className="p-6 border-2 border-blue-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Map className="w-6 h-6 text-blue-500" />
            GIS Interoperability Progress
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            6-week implementation plan • {completedMilestones}/{totalMilestones} milestones complete
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{currentCompliance}%</div>
          <div className="text-sm text-muted-foreground">of {targetCompliance}% target</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">GIS Compliance Score</span>
          <span className="text-sm text-muted-foreground">
            {baselineCompliance}% baseline → {targetCompliance}% target
          </span>
        </div>
        <div className="relative">
          <Progress value={progressPercentage} className="h-4" />
          {inProgressImpact > 0 && (
            <div 
              className="absolute top-0 h-4 bg-amber-400/50 rounded-r"
              style={{ 
                left: `${progressPercentage}%`, 
                width: `${(inProgressImpact / targetCompliance) * 100}%`,
                maxWidth: `${100 - progressPercentage}%`
              }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>+{completedImpact}% completed</span>
          {inProgressImpact > 0 && <span>+{inProgressImpact}% in progress</span>}
          <span>+{70 - completedImpact - inProgressImpact}% remaining</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.week}
            className={`border rounded-lg p-4 transition-all ${
              milestone.status === 'completed' 
                ? 'bg-green-500/5 border-green-500/20' 
                : milestone.status === 'in_progress'
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  milestone.status === 'completed'
                    ? 'bg-green-500/10 text-green-600'
                    : milestone.status === 'in_progress'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {getMilestoneIcon(index)}
                </div>
                <div>
                  <div className="font-semibold">{milestone.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Week {milestone.week} • +{milestone.impact}% compliance
                  </div>
                </div>
              </div>
              {getStatusBadge(milestone.status)}
            </div>
            
            <div className="ml-12 grid grid-cols-1 md:grid-cols-2 gap-2">
              {milestone.deliverables.map((deliverable, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-sm p-2 rounded bg-background/50"
                >
                  {getStatusIcon(milestone.status)}
                  <span className={milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                    {deliverable}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-xs text-muted-foreground">Export Formats</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">0</div>
          <div className="text-xs text-muted-foreground">Platform Integrations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">0%</div>
          <div className="text-xs text-muted-foreground">ISA Compliance</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentCompliance}%</div>
          <div className="text-xs text-muted-foreground">GIS Score</div>
        </div>
      </div>
    </Card>
  );
};

export default GISProgressTracker;
