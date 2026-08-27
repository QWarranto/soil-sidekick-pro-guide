import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Circle,
  DollarSign,
  Users,
  FileText,
  Shield,
  FileCheck,
  Clock
} from "lucide-react";

interface LaunchProgressTrackerProps {
  revenue: {
    homebuyer: number;
    monthlySubscriptions: number;
    annualSubscriptions: number;
    total: number;
  };
  customers: {
    homebuyerReports: number;
    monthlySubscribers: number;
    annualSubscribers: number;
  };
}

const PHASE_2_TARGET = 5000;
const OFFICIAL_LAUNCH_DATE = new Date("2026-04-21");

const LaunchProgressTracker = ({ revenue, customers }: LaunchProgressTrackerProps) => {
  const progressPercent = Math.min((revenue.total / PHASE_2_TARGET) * 100, 100);
  const isLaunched = revenue.total >= PHASE_2_TARGET;
  
  // Calculate days until launch or since meeting threshold
  const today = new Date();
  const daysUntilLaunch = Math.ceil((OFFICIAL_LAUNCH_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Launch gate criteria
  const launchCriteria = [
    { 
      id: 'phase2', 
      label: 'Phase 2 Arboriculture Features Complete', 
      target: 'Feb 14, 2026',
      met: today >= new Date("2026-02-14")
    },
    { 
      id: 'revenue', 
      label: 'Cumulative Revenue ≥ $5,000', 
      target: `$${revenue.total.toLocaleString()} / $5,000`,
      met: revenue.total >= PHASE_2_TARGET
    },
    { 
      id: 'annual', 
      label: 'Minimum 5 Annual Subscribers', 
      target: `${customers.annualSubscribers} / 5`,
      met: customers.annualSubscribers >= 5
    },
    { 
      id: 'homebuyer', 
      label: 'Minimum 20 Homebuyer Reports Sold', 
      target: `${customers.homebuyerReports} / 20`,
      met: customers.homebuyerReports >= 20
    },
    { 
      id: 'satisfaction', 
      label: 'Customer Satisfaction ≥ 4.5/5', 
      target: 'Pending reviews',
      met: false
    },
  ];

  const criteriaMetCount = launchCriteria.filter(c => c.met).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 p-3 rounded-xl">
            <Rocket className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Launch Progress Tracker</h2>
            <p className="text-muted-foreground">Phase 2 Revenue Threshold</p>
          </div>
        </div>
        <Badge variant={isLaunched ? "default" : "secondary"} className="text-lg px-4 py-2">
          {isLaunched ? "🚀 LAUNCH READY" : `${daysUntilLaunch} days to target`}
        </Badge>
      </div>

      {/* Main Progress Card */}
      <Card className="p-6 border-2 border-accent/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="font-semibold">Revenue Goal Progress</span>
          </div>
          <span className="text-3xl font-bold text-accent">
            {progressPercent.toFixed(1)}%
          </span>
        </div>
        
        <Progress value={progressPercent} className="h-4 mb-4" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${revenue.total.toLocaleString()} earned</span>
          <span>${(PHASE_2_TARGET - revenue.total).toLocaleString()} remaining</span>
        </div>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Homebuyer Reports</div>
              <div className="text-2xl font-bold">${revenue.homebuyer.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {customers.homebuyerReports} reports × $29
          </div>
        </Card>

        <Card className="p-4 border-secondary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Monthly Subscriptions</div>
              <div className="text-2xl font-bold">${revenue.monthlySubscriptions.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {customers.monthlySubscribers} subscribers × $29/mo
          </div>
        </Card>

        <Card className="p-4 border-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Annual Subscriptions</div>
              <div className="text-2xl font-bold">${revenue.annualSubscriptions.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {customers.annualSubscribers} subscribers × $290/yr
          </div>
        </Card>
      </div>

      {/* Launch Gate Criteria */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Launch Gate Criteria
          </h3>
          <Badge variant="outline">
            {criteriaMetCount} / {launchCriteria.length} met
          </Badge>
        </div>

        <div className="space-y-3">
          {launchCriteria.map((criterion) => (
            <div 
              key={criterion.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                criterion.met ? 'bg-green-500/10' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {criterion.met ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className={criterion.met ? 'text-green-700 dark:text-green-400' : ''}>
                  {criterion.label}
                </span>
              </div>
              <span className={`text-sm ${criterion.met ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                {criterion.target}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Phase 2 Compliance Track */}
      <Card className="p-6 border-2 border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            Phase 2 Compliance Track (72% → 99%)
          </h3>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
            Weeks 1-12
          </Badge>
        </div>

        <div className="space-y-4">
          {/* SOC 2 Auditor Engagement */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <FileCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold">SOC 2 Auditor Engagement</div>
                  <div className="text-sm text-muted-foreground">Weeks 1-2</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            </div>
            <div className="ml-12 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Identify & contact SOC 2 auditors</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Initial scope assessment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Engagement letter signed</span>
              </div>
            </div>
          </div>

          {/* Vendor DPAs */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="font-semibold">Vendor Data Processing Agreements</div>
                  <div className="text-sm text-muted-foreground">Weeks 3-6</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            </div>
            <div className="ml-12 grid grid-cols-2 gap-2">
              {[
                { vendor: 'Supabase', status: 'pending' },
                { vendor: 'Stripe', status: 'pending' },
                { vendor: 'OpenAI', status: 'pending' },
                { vendor: 'MapBox', status: 'pending' },
              ].map((dpa) => (
                <div 
                  key={dpa.vendor}
                  className="flex items-center gap-2 text-sm p-2 rounded bg-background/50"
                >
                  <Circle className="w-3 h-3 text-muted-foreground" />
                  <span>{dpa.vendor} DPA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Launch Timeline
        </h3>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {[
              { date: 'Jan 17, 2026', label: 'Phase 1 Complete', status: today >= new Date("2026-01-17") ? 'complete' : 'pending' },
              { date: 'Jan 20, 2026', label: 'Soft Launch (Beta)', status: today >= new Date("2026-01-20") ? 'complete' : 'pending' },
              { date: 'Feb 14, 2026', label: 'Phase 2 Complete', status: today >= new Date("2026-02-14") ? 'complete' : 'pending' },
              { date: 'Feb 28, 2026', label: '25% Threshold ($1,250)', status: revenue.total >= 1250 ? 'complete' : 'pending' },
              { date: 'Mar 15, 2026', label: '50% Threshold ($2,500)', status: revenue.total >= 2500 ? 'complete' : 'pending' },
              { date: 'Mar 31, 2026', label: '75% Threshold ($3,750)', status: revenue.total >= 3750 ? 'complete' : 'pending' },
              { date: 'Apr 15, 2026', label: '100% Threshold ($5,000)', status: revenue.total >= 5000 ? 'complete' : 'pending' },
              { date: 'Apr 21, 2026', label: '🚀 OFFICIAL LAUNCH', status: isLaunched ? 'complete' : 'launch' },
            ].map((milestone, index) => (
              <div key={index} className="relative pl-10">
                <div className={`absolute left-2.5 w-3 h-3 rounded-full ${
                  milestone.status === 'complete' 
                    ? 'bg-green-500' 
                    : milestone.status === 'launch' 
                    ? 'bg-accent animate-pulse' 
                    : 'bg-muted-foreground/30'
                }`} />
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${milestone.status === 'complete' ? 'text-green-600' : ''}`}>
                      {milestone.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{milestone.date}</div>
                  </div>
                  {milestone.status === 'complete' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LaunchProgressTracker;
