import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Circle,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  ClipboardList,
  Satellite,
  MapPin,
  Zap,
} from 'lucide-react';

type CheckStatus = 'pending' | 'pass' | 'fail';

interface CheckItem {
  id: string;
  action: string;
  verify: string;
  status: CheckStatus;
}

interface WorkflowStep {
  step: number;
  route: string;
  title: string;
  checks: CheckItem[];
}

// ─── WORKFLOW 1: AlphaEarth Anomaly → Scouting Task → Field Validation ───────
const workflow1Steps: WorkflowStep[] = [
  {
    step: 1,
    route: '/',
    title: 'Main Menu (Home)',
    checks: [
      { id: 'w1-s1-nav', action: 'Navigate to / (Home)', verify: 'Page loads without error. Top navigation visible.', status: 'pending' },
      { id: 'w1-s1-dash', action: 'Click "Dashboard" in the top navigation', verify: 'Redirects to /dashboard — Overview panel renders', status: 'pending' },
    ],
  },
  {
    step: 2,
    route: '/dashboard',
    title: 'Dashboard — Force Live Update',
    checks: [
      { id: 'w1-s2-load', action: 'Confirm Dashboard (/dashboard) is loaded', verify: 'Overview panel is visible with data or loading state', status: 'pending' },
      { id: 'w1-s2-force', action: 'In the Overview panel → click "Force Live Update"', verify: 'Spinner appears then data refreshes — simulates AlphaEarth satellite feed ingestion. No error toast.', status: 'pending' },
    ],
  },
  {
    step: 3,
    route: '/dashboard',
    title: 'Dashboard — AI Crop Recommendations Alert',
    checks: [
      { id: 'w1-s3-panel', action: 'Observe the AI Crop Recommendations panel', verify: 'Panel renders — a low vegetation index alert (NDVI ≈ 0.42) surfaces as a stress indicator on Field A', status: 'pending' },
      { id: 'w1-s3-alert', action: 'Confirm the alert text visible in the panel', verify: '"Low Vegetation Index Detected" or equivalent stress indicator shown with severity: High', status: 'pending' },
    ],
  },
  {
    step: 4,
    route: '/task-manager',
    title: 'Task Manager — Navigate',
    checks: [
      { id: 'w1-s4-nav', action: 'Click "Task Manager" in the top nav', verify: 'Navigates to /task-manager — "My Tasks" tab visible, no white screen', status: 'pending' },
    ],
  },
  {
    step: 5,
    route: '/task-manager',
    title: 'Task Manager — Create Scouting Task',
    checks: [
      { id: 'w1-s5-new', action: 'Click "New Task" button', verify: 'Dialog opens with all form fields visible', status: 'pending' },
      { id: 'w1-s5-title', action: 'Enter title: "Investigate Low Vegetation Index — Field A"', verify: 'Text appears in Task Name field', status: 'pending' },
      { id: 'w1-s5-cat', action: 'Set Category → Scouting', verify: '"scouting" selected in the Category dropdown', status: 'pending' },
      { id: 'w1-s5-pri', action: 'Set Priority → High', verify: '"high" selected in Priority dropdown', status: 'pending' },
      { id: 'w1-s5-status', action: 'Set Status → Pending', verify: '"pending" selected in Status dropdown', status: 'pending' },
      { id: 'w1-s5-save', action: 'Click "Create Task" / Save', verify: 'Dialog closes. Task appears in list with High priority badge and Pending status. No error banner.', status: 'pending' },
    ],
  },
  {
    step: 6,
    route: '/dashboard',
    title: 'Dashboard → Field Mapping',
    checks: [
      { id: 'w1-s6-return', action: 'Return to /dashboard', verify: 'Dashboard loads without crash', status: 'pending' },
      { id: 'w1-s6-fmap', action: 'Click "Field Mapping" in the quick-access panel or sidebar', verify: 'Navigates to /field-mapping — map renders or loading indicator shown, no crash', status: 'pending' },
    ],
  },
  {
    step: 7,
    route: '/field-mapping',
    title: 'Field Mapping — Select Field A',
    checks: [
      { id: 'w1-s7-list', action: 'Scroll to "Your Fields" list and locate Field A', verify: 'Field A card visible in the list', status: 'pending' },
      { id: 'w1-s7-select', action: 'Click "View Map" on Field A', verify: 'Map centers on the GPS boundary of Field A — boundary polygon highlights on the map', status: 'pending' },
    ],
  },
  {
    step: 8,
    route: '/field-mapping',
    title: 'Field Modal — View Soil Analysis',
    checks: [
      { id: 'w1-s8-prereq', action: 'PREREQUISITE: Soil Analysis must have been run for Field A. The field card button changes from "Run Soil Analysis" → "View Soil Analysis" once data is linked.', verify: 'Field A card shows "View Soil Analysis" button (not "Run Soil Analysis")', status: 'pending' },
      { id: 'w1-s8-open', action: 'Click "View Soil Analysis" on Field A', verify: 'Inline modal opens on this page (no navigation) — shows N-P-K bar chart, pH gauge, Organic Matter gauge, and agronomist recommendations correlated with the anomaly', status: 'pending' },
    ],
  },
  {
    step: 9,
    route: '/field-mapping',
    title: 'Field Modal — Stress Classification',
    checks: [
      { id: 'w1-s9-classify', action: 'The agronomist on-site selects the stress classification via the visual crop analysis prompt', verify: 'Options visible: Pest / Drought / False Alarm. Selecting one records the classification without error.', status: 'pending' },
    ],
  },
  {
    step: 10,
    route: '/task-manager',
    title: 'Task Manager — Close the Loop',
    checks: [
      { id: 'w1-s10-return', action: 'Return to /task-manager', verify: 'Task list loads — scouting task "Investigate Low Vegetation Index — Field A" still visible', status: 'pending' },
      { id: 'w1-s10-inprog', action: 'Update task Status → "In Progress" and add field notes', verify: 'Status badge updates to In Progress. Notes saved.', status: 'pending' },
      { id: 'w1-s10-done', action: 'Mark task as "Completed"', verify: 'Task moves to Completed state. Talking point: "From satellite ping to closed task — without leaving the platform."', status: 'pending' },
    ],
  },
];

// ─── WORKFLOW 2: GPS-Triggered FIPS Compliance Warning ───────────────────────
const workflow2Steps: WorkflowStep[] = [
  {
    step: 1,
    route: '/soil-analysis',
    title: 'Main Menu → Soil Analysis',
    checks: [
      { id: 'w2-s1-nav', action: 'Click "Soil Analysis" (/soil-analysis) in the top nav', verify: 'Page loads without crash — soil analysis form visible', status: 'pending' },
    ],
  },
  {
    step: 2,
    route: '/soil-analysis',
    title: 'GPS Auto-Detection',
    checks: [
      { id: 'w2-s2-gps', action: 'Allow location permission if prompted — app auto-detects location via GPS', verify: 'County Lookup fires against the local FIPS cache (no network call required)', status: 'pending' },
    ],
  },
  {
    step: 3,
    route: '/soil-analysis',
    title: 'County Banner Populates',
    checks: [
      { id: 'w2-s3-banner', action: 'Observe the County detection banner at the top of the form', verify: 'Banner shows: "Detected: [County Name], [State]" — sourced from the offline hierarchical FIPS cache', status: 'pending' },
    ],
  },
  {
    step: 4,
    route: '/soil-analysis',
    title: 'Fill Soil Sample Form',
    checks: [
      { id: 'w2-s4-form', action: 'Begin filling the soil sample form — set Application Type → "Chemical Application"', verify: 'Form fields accept input. Chemical Application selected in the type dropdown.', status: 'pending' },
    ],
  },
  {
    step: 5,
    route: '/soil-analysis',
    title: 'Compliance Warning Triggers',
    checks: [
      { id: 'w2-s5-warn', action: 'Observe inline compliance alert triggered by the Chemical Application selection', verify: 'Alert reads: "⚠️ Warning: You are in [County Name]. This county requires a 50ft buffer zone for chemical applications near water bodies."', status: 'pending' },
    ],
  },
  {
    step: 6,
    route: '/soil-analysis',
    title: 'Acknowledge & Continue',
    checks: [
      { id: 'w2-s6-ack', action: 'The agronomist acknowledges the warning and continues logging the sample', verify: 'Buffer zone acknowledgement recorded. Form remains open and editable.', status: 'pending' },
    ],
  },
  {
    step: 7,
    route: '/soil-analysis',
    title: 'Generate Compliance Report',
    checks: [
      { id: 'w2-s7-pdf', action: 'Click "Generate Report"', verify: 'PDF exports with the compliance warning embedded. Talking point: "The entire federal regulatory database lives in the device cache. Zero bars, full compliance."', status: 'pending' },
    ],
  },
];

// ─── WORKFLOW 3: Rapid-Fire Mode — 4-Second Sample Logging ───────────────────
const workflow3Steps: WorkflowStep[] = [
  {
    step: 1,
    route: '/soil-analysis',
    title: 'Main Menu → Soil Analysis',
    checks: [
      { id: 'w3-s1-nav', action: 'Click "Soil Analysis" (/soil-analysis) in the main menu', verify: 'Page loads — standard soil analysis form visible', status: 'pending' },
    ],
  },
  {
    step: 2,
    route: '/soil-analysis',
    title: 'Enable Rapid-Fire Mode',
    checks: [
      { id: 'w3-s2-toggle', action: 'Tap the "Rapid-Fire Mode" toggle at the top of the page', verify: 'Interface strips to minimal input fields — barcode and GPS fields prominent', status: 'pending' },
    ],
  },
  {
    step: 3,
    route: '/soil-analysis',
    title: 'Scan Barcode',
    checks: [
      { id: 'w3-s3-scan', action: 'Tap "Scan Barcode" button', verify: 'Device camera activates (or barcode input field focused on desktop)', status: 'pending' },
      { id: 'w3-s3-result', action: 'Scan / enter a sample bag barcode', verify: 'Barcode ID populates in the field instantly', status: 'pending' },
    ],
  },
  {
    step: 4,
    route: '/soil-analysis',
    title: 'Auto-Log GPS + Queue',
    checks: [
      { id: 'w3-s4-gps', action: 'App automatically captures GPS coordinates + barcode ID', verify: 'Soil record created and queued in the offline sync queue — shown in the sync indicator', status: 'pending' },
    ],
  },
  {
    step: 5,
    route: '/soil-analysis',
    title: 'Sync Indicator Increments',
    checks: [
      { id: 'w3-s5-badge', action: 'Observe the Offline Sync Indicator badge', verify: 'Badge increments (+1 queued) — no confirmation screen, no tap delay', status: 'pending' },
    ],
  },
  {
    step: 6,
    route: '/soil-analysis',
    title: 'Add Audio Note',
    checks: [
      { id: 'w3-s6-audio', action: 'Tap 🎤 "Add Audio Note"', verify: 'Recording UI activates — user can speak a note (e.g., "High clay content here")', status: 'pending' },
      { id: 'w3-s6-save', action: 'Stop recording', verify: 'App displays: "Audio saved. Will transcribe when connected."', status: 'pending' },
    ],
  },
  {
    step: 7,
    route: '/soil-analysis',
    title: 'Repeat Cycle (≤4 sec/sample)',
    checks: [
      { id: 'w3-s7-speed', action: 'User is already positioned at the next sample — repeat Steps 3–6', verify: 'Each full cycle (scan → GPS log → queue → audio note) completes in ≤4 seconds', status: 'pending' },
    ],
  },
  {
    step: 8,
    route: '/dashboard',
    title: 'On Reconnect — Auto-Sync',
    checks: [
      { id: 'w3-s8-sync', action: 'Restore network connectivity (or simulate reconnect)', verify: 'Offline Sync auto-triggers — all queued records + audio files upload', status: 'pending' },
      { id: 'w3-s8-dash', action: 'Navigate to /dashboard', verify: 'Dashboard updates with the full sample run. Talking point: "No server. No wait. No lost data. Just ground truth at the speed of field work."', status: 'pending' },
    ],
  },
];

const WORKFLOWS = [
  {
    id: 'workflow1',
    label: 'Workflow 1',
    icon: Satellite,
    title: 'AlphaEarth Anomaly → Scouting Task → Field Validation',
    tagline: '"The satellite flags it. The app guides you there. The agronomist closes the loop."',
    steps: workflow1Steps,
    color: 'text-primary',
  },
  {
    id: 'workflow2',
    label: 'Workflow 2',
    icon: MapPin,
    title: 'GPS-Triggered FIPS Compliance Warning',
    tagline: '"The app knows the law before the agronomist even opens the form."',
    steps: workflow2Steps,
    color: 'text-orange-500',
  },
  {
    id: 'workflow3',
    label: 'Workflow 3',
    icon: Zap,
    title: 'Rapid-Fire Mode — 4-Second Sample Logging',
    tagline: '"Collect 100 samples in the time it takes competitors to log 10."',
    steps: workflow3Steps,
    color: 'text-yellow-500',
  },
];

type WorkflowChecks = Record<string, Record<string, CheckStatus>>;
type WorkflowNotes = Record<string, Record<string, string>>;

const buildInitialChecks = (): WorkflowChecks => {
  const checks: WorkflowChecks = {};
  WORKFLOWS.forEach(wf => {
    checks[wf.id] = {};
    wf.steps.forEach(step => {
      step.checks.forEach(c => {
        checks[wf.id][c.id] = 'pending';
      });
    });
  });
  return checks;
};

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
  const [checks, setChecks] = useState<WorkflowChecks>(buildInitialChecks);
  const [notes, setNotes] = useState<WorkflowNotes>({});

  const setCheck = (workflowId: string, checkId: string, status: CheckStatus) => {
    setChecks(prev => ({
      ...prev,
      [workflowId]: { ...prev[workflowId], [checkId]: status },
    }));
  };

  const reset = () => {
    setChecks(buildInitialChecks());
    setNotes({});
  };

  const allChecks = WORKFLOWS.flatMap(wf => wf.steps.flatMap(s => s.checks.map(c => checks[wf.id]?.[c.id] ?? 'pending')));
  const totalChecks = allChecks.length;
  const passed = allChecks.filter(s => s === 'pass').length;
  const failed = allChecks.filter(s => s === 'fail').length;
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
              <Badge variant="outline">3 Client Demonstration Sequences</Badge>
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
              Reset All
            </Button>
          </div>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card className="bg-muted/50 border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">
              <strong>How to use:</strong> Select a workflow tab, execute each action exactly as written, then mark Pass or Fail. A failure here means a bug to fix before the next client demo.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="workflow1">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {WORKFLOWS.map(wf => {
              const wfChecks = Object.values(checks[wf.id] ?? {});
              const wfPassed = wfChecks.filter(s => s === 'pass').length;
              const wfFailed = wfChecks.filter(s => s === 'fail').length;
              const Icon = wf.icon;
              return (
                <TabsTrigger key={wf.id} value={wf.id} className="gap-2 relative">
                  <Icon className={`h-4 w-4 ${wf.color}`} />
                  <span className="hidden sm:inline">{wf.label}</span>
                  {wfFailed > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {wfFailed}
                    </span>
                  )}
                  {wfFailed === 0 && wfPassed === wfChecks.length && wfChecks.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {WORKFLOWS.map(wf => {
            const Icon = wf.icon;
            const wfChecks = Object.values(checks[wf.id] ?? {});
            const wfPassed = wfChecks.filter(s => s === 'pass').length;
            const wfFailed = wfChecks.filter(s => s === 'fail').length;

            return (
              <TabsContent key={wf.id} value={wf.id} className="space-y-4">
                {/* Workflow header */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-4 pb-3 flex items-start gap-3">
                    <Icon className={`h-6 w-6 mt-0.5 shrink-0 ${wf.color}`} />
                    <div>
                      <p className="font-bold text-foreground text-sm">➡️ {wf.title}</p>
                      <p className="text-xs text-muted-foreground italic mt-0.5">{wf.tagline}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{wfPassed}/{wfChecks.length}</span>
                      {wfFailed > 0 && <Badge variant="destructive">{wfFailed} failed</Badge>}
                      {wfFailed === 0 && wfPassed === wfChecks.length && wfChecks.length > 0 && (
                        <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" />Ready</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Steps */}
                {wf.steps.map((step) => {
                  const stepChecks = step.checks.map(c => checks[wf.id]?.[c.id] ?? 'pending');
                  const stepPassed = stepChecks.filter(s => s === 'pass').length;
                  const stepFailed = stepChecks.filter(s => s === 'fail').length;

                  return (
                    <Card key={step.step} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                              {step.step}
                            </div>
                            <div>
                              <CardTitle className="text-base">{step.title}</CardTitle>
                              <CardDescription className="font-mono text-xs">{step.route}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {stepFailed > 0 && <Badge variant="destructive">{stepFailed} failed</Badge>}
                            {stepPassed === step.checks.length && (
                              <Badge variant="secondary">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(step.route)}
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
                          {step.checks.map((check, checkIdx) => {
                            const status = checks[wf.id]?.[check.id] ?? 'pending';
                            return (
                              <div key={check.id}>
                                {checkIdx > 0 && <Separator className="mb-3" />}
                                <div className="flex gap-3">
                                  {statusIcon(status)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground leading-snug">{check.action}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">✓ Verify: {check.verify}</p>
                                      </div>
                                      <div className="shrink-0">{statusBadge(status)}</div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant={status === 'pass' ? 'default' : 'outline'}
                                        className="h-7 text-xs px-3"
                                        onClick={() => setCheck(wf.id, check.id, 'pass')}
                                      >
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Pass
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={status === 'fail' ? 'destructive' : 'outline'}
                                        className="h-7 text-xs px-3"
                                        onClick={() => setCheck(wf.id, check.id, 'fail')}
                                      >
                                        <XCircle className="h-3 w-3 mr-1" /> Fail
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs px-3"
                                        onClick={() => setCheck(wf.id, check.id, 'pending')}
                                      >
                                        Reset
                                      </Button>
                                    </div>
                                    {status === 'fail' && (
                                      <textarea
                                        className="mt-2 w-full text-xs rounded-md border bg-background px-2 py-1.5 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                                        rows={2}
                                        placeholder="Describe the failure (error message, screenshot URL, etc.)"
                                        value={notes[wf.id]?.[check.id] || ''}
                                        onChange={e =>
                                          setNotes(n => ({
                                            ...n,
                                            [wf.id]: { ...n[wf.id], [check.id]: e.target.value },
                                          }))
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Summary */}
        <Card className={failed > 0 ? 'border-destructive/50' : passed === totalChecks ? 'border-primary/50' : ''}>
          <CardHeader>
            <CardTitle className="text-base">Overall Run Summary</CardTitle>
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
                ✅ All {totalChecks} checks passed — safe to demo all three workflows
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
