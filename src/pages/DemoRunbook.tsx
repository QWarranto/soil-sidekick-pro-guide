import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  Circle,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';

type CheckStatus = 'pending' | 'pass' | 'fail';

interface CheckItem {
  id: string;
  action: string;
  verify: string;
  status: CheckStatus;
  notes?: string;
}

interface WorkflowStep {
  step: number;
  route: string;
  title: string;
  checks: CheckItem[];
}

const initialWorkflows: WorkflowStep[] = [
  {
    step: 1,
    route: '/',
    title: 'Home / Landing',
    checks: [
      { id: 'home-load', action: 'Navigate to /', verify: 'Page loads without white screen or console error', status: 'pending' },
      { id: 'home-nav', action: 'Click "Dashboard" in top navigation', verify: 'Redirects to /dashboard', status: 'pending' },
    ],
  },
  {
    step: 2,
    route: '/dashboard',
    title: 'Dashboard',
    checks: [
      { id: 'dash-load', action: 'Navigate to /dashboard', verify: 'Overview panel renders with data or loading state', status: 'pending' },
      { id: 'dash-force-update', action: 'Click "Force Live Update" in Overview panel', verify: 'Spinner appears, then data refreshes — no error toast', status: 'pending' },
      { id: 'dash-ai-panel', action: 'Observe AI Crop Recommendations panel', verify: 'Panel renders — stress indicator or placeholder visible', status: 'pending' },
    ],
  },
  {
    step: 3,
    route: '/task-manager',
    title: 'Task Manager — New Task',
    checks: [
      { id: 'task-load', action: 'Navigate to /task-manager', verify: 'Page loads, "My Tasks" tab shown — no white screen', status: 'pending' },
      { id: 'task-new-click', action: 'Click "New Task" button', verify: 'Dialog opens with form fields visible', status: 'pending' },
      { id: 'task-fill-name', action: 'Enter title: "Investigate Low Vegetation Index — Field A"', verify: 'Text appears in Task Name field', status: 'pending' },
      { id: 'task-category', action: 'Set Category → Scouting', verify: '"scouting" selected in dropdown', status: 'pending' },
      { id: 'task-priority', action: 'Set Priority → High', verify: '"high" selected', status: 'pending' },
      { id: 'task-status', action: 'Set Status → Pending', verify: '"pending" selected in Status dropdown', status: 'pending' },
      { id: 'task-save', action: 'Click "Create Task"', verify: 'Dialog closes, task appears in list — NO error banner', status: 'pending' },
    ],
  },
  {
    step: 4,
    route: '/task-manager',
    title: 'Task Manager — Verify Task',
    checks: [
      { id: 'task-verify', action: 'After creating the task, confirm it appears in the "My Tasks" list', verify: 'Task "Investigate Low Vegetation Index — Field A" visible with High priority and Pending status', status: 'pending' },
    ],
  },
  {
    step: 5,
    route: '/field-mapping',
    title: 'Field Mapping (via Dashboard)',
    checks: [
      { id: 'field-dash-nav', action: 'Return to /dashboard and click "Field Mapping" in the quick-access panel or sidebar', verify: 'Navigates to /field-mapping — map renders or loading indicator shown, no crash', status: 'pending' },
      { id: 'field-add', action: 'Click "Add Field" button, enter field name, click "Use Current GPS Location" (or enter lat/lng with hemisphere selectors)', verify: 'GPS fills in coordinates OR manual entry with N/S and E/W selectors works. Field saves successfully.', status: 'pending' },
      { id: 'field-list', action: 'Scroll below the map to the "Your Fields" list', verify: 'Newly saved field appears in the list with a "Run Soil Analysis" button', status: 'pending' },
      { id: 'field-soil-nav', action: 'Click "Run Soil Analysis" on the field card', verify: 'Navigates to /soil-analysis with field name and coordinates shown in a context banner at the top', status: 'pending' },
    ],
  },
  {
    step: 6,
    route: '/soil-analysis',
    title: 'Soil Analysis (from Field)',
    checks: [
      { id: 'soil-context', action: 'Observe the top banner on /soil-analysis', verify: 'Banner shows field name and coordinates passed from Field Mapping', status: 'pending' },
      { id: 'soil-county', action: 'Search for the county matching the field coordinates and select it', verify: 'Soil data loads and results appear below — no error toast', status: 'pending' },
      { id: 'soil-back', action: 'Click "Back to Fields" in the banner', verify: 'Returns to /field-mapping field list', status: 'pending' },
    ],
  },
  {
    step: 7,
    route: '/water-quality',
    title: 'Water Quality',
    checks: [
      { id: 'water-load', action: 'Navigate to /water-quality', verify: 'Page loads without crash', status: 'pending' },
      { id: 'water-export', action: 'Click PDF Export if visible', verify: 'PDF generates or error is graceful', status: 'pending' },
    ],
  },
  {
    step: 8,
    route: '/planting-calendar',
    title: 'Planting Calendar',
    checks: [
      { id: 'cal-load', action: 'Navigate to /planting-calendar', verify: 'Calendar renders — no blank panel', status: 'pending' },
    ],
  },
  {
    step: 9,
    route: '/pricing',
    title: 'Pricing',
    checks: [
      { id: 'price-load', action: 'Navigate to /pricing', verify: 'Pricing tiers render correctly', status: 'pending' },
      { id: 'price-cta', action: 'Click any upgrade CTA', verify: 'Redirects to checkout or auth — no 404', status: 'pending' },
    ],
  },
];

const statusIcon = (status: CheckStatus) => {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />;
  if (status === 'fail') return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
  return <Circle className="h-5 w-5 text-muted-foreground shrink-0" />;
};

const statusBadge = (status: CheckStatus) => {
  if (status === 'pass') return <Badge variant="secondary">Pass</Badge>;
  if (status === 'fail') return <Badge variant="destructive">Fail</Badge>;
  return <Badge variant="outline">Pending</Badge>;
};

export default function DemoRunbook() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowStep[]>(initialWorkflows);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const setCheck = (stepIdx: number, checkId: string, status: CheckStatus) => {
    setWorkflows(prev =>
      prev.map((wf, i) =>
        i === stepIdx
          ? { ...wf, checks: wf.checks.map(c => (c.id === checkId ? { ...c, status } : c)) }
          : wf
      )
    );
  };

  const reset = () => {
    setWorkflows(initialWorkflows.map(wf => ({
      ...wf,
      checks: wf.checks.map(c => ({ ...c, status: 'pending' as CheckStatus })),
    })));
    setNotes({});
  };

  const totalChecks = workflows.flatMap(w => w.checks).length;
  const passed = workflows.flatMap(w => w.checks).filter(c => c.status === 'pass').length;
  const failed = workflows.flatMap(w => w.checks).filter(c => c.status === 'fail').length;
  const progress = Math.round((passed / totalChecks) * 100);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Demo Runbook</span>
              <Badge variant="outline">Workflow 1 — Anomaly to Action</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{passed}/{totalChecks} checks passed</span>
            {failed > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> {failed} failed
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card className="bg-muted/50 border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">
              <strong>How to use:</strong> Execute each action exactly as written. For every <em>save / submit / generate</em> action, verify the outcome in the list before marking Pass or Fail. A failure here means a bug to fix before the next client demo.
            </p>
          </CardContent>
        </Card>

        {workflows.map((wf, stepIdx) => {
          const stepPassed = wf.checks.filter(c => c.status === 'pass').length;
          const stepFailed = wf.checks.filter(c => c.status === 'fail').length;
          return (
            <Card key={wf.step} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {wf.step}
                    </div>
                    <div>
                      <CardTitle className="text-base">{wf.title}</CardTitle>
                      <CardDescription className="font-mono text-xs">{wf.route}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stepFailed > 0 && <Badge variant="destructive">{stepFailed} failed</Badge>}
                    {stepPassed === wf.checks.length && (
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(wf.route)}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {wf.checks.map((check, checkIdx) => (
                    <div key={check.id}>
                      {checkIdx > 0 && <Separator className="mb-3" />}
                      <div className="flex gap-3">
                        {statusIcon(check.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground leading-snug">{check.action}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ✓ Verify: {check.verify}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {statusBadge(check.status)}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant={check.status === 'pass' ? 'default' : 'outline'}
                              className="h-7 text-xs px-3"
                              onClick={() => setCheck(stepIdx, check.id, 'pass')}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Pass
                            </Button>
                            <Button
                              size="sm"
                              variant={check.status === 'fail' ? 'destructive' : 'outline'}
                              className="h-7 text-xs px-3"
                              onClick={() => setCheck(stepIdx, check.id, 'fail')}
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Fail
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs px-3"
                              onClick={() => setCheck(stepIdx, check.id, 'pending')}
                            >
                              Reset
                            </Button>
                          </div>
                          {check.status === 'fail' && (
                            <textarea
                              className="mt-2 w-full text-xs rounded-md border bg-background px-2 py-1.5 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                              rows={2}
                              placeholder="Describe the failure (error message, screenshot URL, etc.)"
                              value={notes[check.id] || ''}
                              onChange={e => setNotes(n => ({ ...n, [check.id]: e.target.value }))}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Summary */}
        <Card className={failed > 0 ? 'border-destructive/50' : passed === totalChecks ? 'border-green-500/50' : ''}>
          <CardHeader>
            <CardTitle className="text-base">Run Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{passed}</p>
                <p className="text-xs text-muted-foreground">Passed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{totalChecks - passed - failed}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
            {passed === totalChecks && (
              <p className="text-center text-sm text-primary font-medium mt-4">
                ✅ All checks passed — safe to demo
              </p>
            )}
            {failed > 0 && (
              <p className="text-center text-sm text-destructive font-medium mt-4">
                ⚠️ {failed} issue{failed > 1 ? 's' : ''} found — resolve before client demo
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
