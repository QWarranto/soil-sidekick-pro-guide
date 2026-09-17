import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Shield, Activity, AlertTriangle, DollarSign, Loader2, ArrowLeft, RefreshCw, Server, Eye, Clock, Download, Link2 } from 'lucide-react';
import Footer from '@/components/Footer';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface McpToolCall {
  id: string;
  tool_name: string;
  api_key_hash: string | null;
  source_ip: string | null;
  success: boolean;
  error_message: string | null;
  response_time_ms: number | null;
  downstream_endpoint: string | null;
  context_mode: string | null;
  is_batch: boolean | null;
  correlation_id: string | null;
  created_at: string;
}

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: string;
  source_ip: string | null;
  endpoint: string | null;
  created_at: string;
}

interface CostEntry {
  id: string;
  service_provider: string;
  service_type: string;
  feature_name: string;
  cost_usd: number;
  usage_count: number;
  date_bucket: string;
}

interface ComplianceCheck {
  id: string;
  check_type: string;
  check_name: string;
  status: string;
  compliance_score: number | null;
  last_checked_at: string | null;
  created_at: string;
}

// ── Export Helpers ──
function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const v = row[h];
      const str = v == null ? '' : String(v);
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(','))
  ].join('\n');
  downloadBlob(csv, `${filename}.csv`, 'text/csv');
}

function exportToJSON(data: unknown[], filename: string) {
  downloadBlob(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json');
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const OperationsAudit = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mcp-calls');
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mcpCalls, setMcpCalls] = useState<McpToolCall[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);

  const getTimeFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const fetchData = async () => {
    if (!user) return;
    setRefreshing(true);
    const since = getTimeFilter();

    const [mcpRes, incRes, costRes, compRes] = await Promise.all([
      supabase.from('mcp_tool_call_log').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(500),
      supabase.from('security_incidents').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(200),
      supabase.from('cost_tracking').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(200),
      supabase.from('soc2_compliance_checks').select('*').order('created_at', { ascending: false }).limit(50),
    ]);

    setMcpCalls((mcpRes.data as McpToolCall[]) || []);
    setIncidents((incRes.data as SecurityIncident[]) || []);
    setCosts((costRes.data as CostEntry[]) || []);
    setComplianceChecks((compRes.data as ComplianceCheck[]) || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, timeRange]);

  // ── MCP Stats ──
  const mcpStats = useMemo(() => {
    const total = mcpCalls.length;
    const success = mcpCalls.filter(c => c.success).length;
    const avgLatency = total > 0 ? Math.round(mcpCalls.reduce((s, c) => s + (c.response_time_ms || 0), 0) / total) : 0;
    const toolBreakdown: Record<string, number> = {};
    const uniqueKeys = new Set<string>();
    const correlations = new Set<string>();
    mcpCalls.forEach(c => {
      toolBreakdown[c.tool_name] = (toolBreakdown[c.tool_name] || 0) + 1;
      if (c.api_key_hash) uniqueKeys.add(c.api_key_hash);
      if (c.correlation_id) correlations.add(c.correlation_id);
    });
    return { total, success, failRate: total > 0 ? ((total - success) / total * 100).toFixed(1) : '0', avgLatency, toolBreakdown, uniqueClients: uniqueKeys.size, uniqueSessions: correlations.size };
  }, [mcpCalls]);

  // ── Anomaly Detection ──
  const anomalies = useMemo(() => {
    const alerts: { type: string; message: string; severity: 'warning' | 'critical' }[] = [];
    const failCount = mcpStats.total - mcpStats.success;
    const failRate = mcpStats.total > 0 ? failCount / mcpStats.total : 0;

    if (failRate > 0.25 && mcpStats.total >= 5) {
      alerts.push({ type: 'high_failure_rate', message: `Failure rate is ${(failRate * 100).toFixed(0)}% (${failCount}/${mcpStats.total})`, severity: 'critical' });
    }

    // Latency spike: avg > 5s
    if (mcpStats.avgLatency > 5000 && mcpStats.total > 0) {
      alerts.push({ type: 'latency_spike', message: `Average latency ${(mcpStats.avgLatency / 1000).toFixed(1)}s exceeds 5s threshold`, severity: 'warning' });
    }

    // Single client domination (>90% of calls from one key)
    if (mcpStats.uniqueClients === 1 && mcpStats.total > 20) {
      alerts.push({ type: 'single_client', message: `All ${mcpStats.total} calls from a single API key — verify this is expected`, severity: 'warning' });
    }

    // Security: critical incidents
    const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
    if (criticalIncidents > 0) {
      alerts.push({ type: 'critical_security', message: `${criticalIncidents} critical security incident(s) detected`, severity: 'critical' });
    }

    return alerts;
  }, [mcpStats, incidents]);

  const toolChartData = useMemo(() =>
    Object.entries(mcpStats.toolBreakdown)
      .map(([name, count]) => ({ name: name.replace(/_/g, ' '), count }))
      .sort((a, b) => b.count - a.count),
    [mcpStats.toolBreakdown]
  );

  // ── Security Stats ──
  const secStats = useMemo(() => {
    const critical = incidents.filter(i => i.severity === 'critical').length;
    const high = incidents.filter(i => i.severity === 'high').length;
    const typeBreakdown: Record<string, number> = {};
    incidents.forEach(i => { typeBreakdown[i.incident_type] = (typeBreakdown[i.incident_type] || 0) + 1; });
    return { total: incidents.length, critical, high, typeBreakdown };
  }, [incidents]);

  // ── Cost Stats ──
  const costStats = useMemo(() => {
    const totalCost = costs.reduce((s, c) => s + c.cost_usd, 0);
    const totalUsage = costs.reduce((s, c) => s + c.usage_count, 0);
    const byProvider: Record<string, number> = {};
    costs.forEach(c => { byProvider[c.service_provider] = (byProvider[c.service_provider] || 0) + c.cost_usd; });
    return { totalCost: totalCost.toFixed(4), totalUsage, byProvider };
  }, [costs]);

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  // ── Export handlers ──
  const handleExportMCP = useCallback((format: 'csv' | 'json') => {
    const data = mcpCalls.map(c => ({
      id: c.id,
      tool_name: c.tool_name,
      api_key_hash: c.api_key_hash || '',
      correlation_id: c.correlation_id || '',
      success: c.success,
      error_message: c.error_message || '',
      response_time_ms: c.response_time_ms || '',
      downstream_endpoint: c.downstream_endpoint || '',
      context_mode: c.context_mode || '',
      created_at: c.created_at,
    }));
    if (format === 'csv') exportToCSV(data, `mcp-audit-${timeRange}`);
    else exportToJSON(data, `mcp-audit-${timeRange}`);
  }, [mcpCalls, timeRange]);

  const handleExportSecurity = useCallback((format: 'csv' | 'json') => {
    const data = incidents.map(i => ({
      id: i.id,
      incident_type: i.incident_type,
      severity: i.severity,
      source_ip: i.source_ip || '',
      endpoint: i.endpoint || '',
      created_at: i.created_at,
    }));
    if (format === 'csv') exportToCSV(data, `security-incidents-${timeRange}`);
    else exportToJSON(data, `security-incidents-${timeRange}`);
  }, [incidents, timeRange]);

  const handleExportCosts = useCallback((format: 'csv' | 'json') => {
    const data = costs.map(c => ({
      id: c.id,
      service_provider: c.service_provider,
      service_type: c.service_type,
      feature_name: c.feature_name,
      cost_usd: c.cost_usd,
      usage_count: c.usage_count,
      date_bucket: c.date_bucket,
    }));
    if (format === 'csv') exportToCSV(data, `cost-tracking-${timeRange}`);
    else exportToJSON(data, `cost-tracking-${timeRange}`);
  }, [costs, timeRange]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operations Audit Dashboard</h1>
              <p className="text-sm text-muted-foreground">MCP tool-call governance, security, cost tracking & compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchData} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Anomaly Alerts */}
        {anomalies.length > 0 && (
          <div className="space-y-2 mb-6">
            {anomalies.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${a.severity === 'critical' ? 'border-destructive bg-destructive/10' : 'border-yellow-500/50 bg-yellow-500/10'}`}>
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${a.severity === 'critical' ? 'text-destructive' : 'text-yellow-600'}`} />
                <span className="text-sm text-foreground">{a.message}</span>
                <Badge variant={a.severity === 'critical' ? 'destructive' : 'secondary'} className="ml-auto">{a.severity}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">MCP Tool Calls</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{mcpStats.total}</p>
              <p className="text-xs text-muted-foreground">{mcpStats.uniqueClients} client(s) · {mcpStats.uniqueSessions} session(s) · {mcpStats.avgLatency}ms avg</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Security Incidents</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{secStats.total}</p>
              <p className="text-xs text-muted-foreground">{secStats.critical} critical · {secStats.high} high</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">API Costs</span>
              </div>
              <p className="text-3xl font-bold text-foreground">${costStats.totalCost}</p>
              <p className="text-xs text-muted-foreground">{costStats.totalUsage} requests tracked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Compliance Score</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {complianceChecks[0]?.compliance_score ?? '—'}%
              </p>
              <p className="text-xs text-muted-foreground">{complianceChecks.length} checks recorded</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="mcp-calls">MCP Tool Calls</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="costs">Cost Tracking</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* ── MCP Tool Calls Tab ── */}
          <TabsContent value="mcp-calls" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Tool Usage Distribution</CardTitle></CardHeader>
                <CardContent>
                  {toolChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={toolChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={11} angle={-30} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No MCP tool calls recorded yet</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Success vs Failure</CardTitle></CardHeader>
                <CardContent>
                  {mcpStats.total > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Success', value: mcpStats.success },
                            { name: 'Failed', value: mcpStats.total - mcpStats.success },
                          ]}
                          cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                        >
                          <Cell fill="hsl(var(--primary))" />
                          <Cell fill="hsl(var(--destructive))" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No data</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent MCP Tool Calls</CardTitle>
                    <CardDescription>Full audit trail with correlation IDs for chain tracing</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportMCP('csv')}>
                      <Download className="h-3 w-3 mr-1" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportMCP('json')}>
                      <Download className="h-3 w-3 mr-1" /> JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Tool</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Latency</TableHead>
                        <TableHead>Endpoint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mcpCalls.slice(0, 50).map(call => (
                        <TableRow key={call.id}>
                          <TableCell className="text-xs">{new Date(call.created_at).toLocaleString()}</TableCell>
                          <TableCell><Badge variant="outline">{call.tool_name}</Badge></TableCell>
                          <TableCell className="text-xs font-mono">{call.api_key_hash?.slice(0, 12) || '—'}</TableCell>
                          <TableCell className="text-xs font-mono">
                            {call.correlation_id ? (
                              <span className="flex items-center gap-1">
                                <Link2 className="h-3 w-3 text-muted-foreground" />
                                {call.correlation_id.slice(0, 8)}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={call.success ? 'default' : 'destructive'}>
                              {call.success ? 'OK' : 'ERR'}
                            </Badge>
                          </TableCell>
                          <TableCell>{call.response_time_ms ? `${call.response_time_ms}ms` : '—'}</TableCell>
                          <TableCell className="text-xs">{call.downstream_endpoint || '—'}</TableCell>
                        </TableRow>
                      ))}
                      {mcpCalls.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No MCP tool calls recorded in this time range.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Security Tab ── */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Security Incidents</CardTitle>
                    <CardDescription>Threat detection events from the enhanced-threat-detection function</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportSecurity('csv')}>
                      <Download className="h-3 w-3 mr-1" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportSecurity('json')}>
                      <Download className="h-3 w-3 mr-1" /> JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Source IP</TableHead>
                        <TableHead>Endpoint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidents.slice(0, 50).map(inc => (
                        <TableRow key={inc.id}>
                          <TableCell className="text-xs">{new Date(inc.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{inc.incident_type.replace(/_/g, ' ')}</TableCell>
                          <TableCell>
                            <Badge variant={severityColor(inc.severity) as any}>{inc.severity}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{inc.source_ip || '—'}</TableCell>
                          <TableCell className="text-xs">{inc.endpoint || '—'}</TableCell>
                        </TableRow>
                      ))}
                      {incidents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No security incidents in this time range.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Cost Tracking Tab ── */}
          <TabsContent value="costs" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Cost by Provider</CardTitle></CardHeader>
                <CardContent>
                  {Object.keys(costStats.byProvider).length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={Object.entries(costStats.byProvider).map(([name, value]) => ({ name, value: +value.toFixed(4) }))}
                          cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                        >
                          {Object.keys(costStats.byProvider).map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No cost data recorded</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Cost Entries</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportCosts('csv')}>
                        <Download className="h-3 w-3 mr-1" /> CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportCosts('json')}>
                        <Download className="h-3 w-3 mr-1" /> JSON
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Feature</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Calls</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costs.slice(0, 20).map(c => (
                          <TableRow key={c.id}>
                            <TableCell className="text-xs">{c.date_bucket}</TableCell>
                            <TableCell>{c.service_provider}</TableCell>
                            <TableCell className="text-xs">{c.feature_name}</TableCell>
                            <TableCell>${c.cost_usd.toFixed(4)}</TableCell>
                            <TableCell>{c.usage_count}</TableCell>
                          </TableRow>
                        ))}
                        {costs.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No cost entries</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Compliance Tab ── */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SOC 2 Compliance Checks</CardTitle>
                <CardDescription>Automated and manual compliance assessment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Check Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complianceChecks.map(cc => (
                        <TableRow key={cc.id}>
                          <TableCell>{cc.check_name}</TableCell>
                          <TableCell><Badge variant="outline">{cc.check_type}</Badge></TableCell>
                          <TableCell>
                            <Badge variant={cc.status === 'completed' ? 'default' : cc.status === 'failed' ? 'destructive' : 'secondary'}>
                              {cc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{cc.compliance_score != null ? `${cc.compliance_score}%` : '—'}</TableCell>
                          <TableCell className="text-xs">{new Date(cc.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {complianceChecks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No compliance checks recorded. Run the SOC 2 compliance monitor to generate checks.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Audit Infrastructure Info */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Audit Infrastructure Status</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground">MCP Tool-Call Logging</p>
                    <Badge className="mt-1">Active</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Every tools/call invocation is logged with sanitized arguments, correlation IDs, caller identity, latency, and outcome.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground">Threat Detection</p>
                    <Badge className="mt-1">Active</Badge>
                    <p className="text-xs text-muted-foreground mt-2">SQL injection, XSS, path traversal, and command injection are detected and logged.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground">PII Sanitization</p>
                    <Badge className="mt-1">Active</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Coordinates truncated to ~11km precision; emails, names, and secrets are redacted before logging.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default OperationsAudit;
