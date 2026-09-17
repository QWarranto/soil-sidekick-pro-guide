import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Activity, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Footer from '@/components/Footer';

interface AccessLogEntry {
  id: string;
  endpoint: string | null;
  success: boolean;
  response_time_ms: number | null;
  rate_limited: boolean | null;
  access_time: string;
  user_agent: string | null;
  failure_reason: string | null;
}

interface EndpointStats {
  endpoint: string;
  totalCalls: number;
  successCount: number;
  failCount: number;
  rateLimitedCount: number;
  avgResponseMs: number;
  successRate: number;
  p95ResponseMs: number;
}

interface DailyUsage {
  date: string;
  calls: number;
  successes: number;
  failures: number;
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
];

const APIUsageAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessLogs, setAccessLogs] = useState<AccessLogEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - daysAgo);

      // Get user's API keys first
      const { data: keys } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id);

      if (!keys?.length) {
        setAccessLogs([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const keyIds = keys.map(k => k.id);

      const { data: logs, error } = await supabase
        .from('api_key_access_log')
        .select('id, endpoint, success, response_time_ms, rate_limited, access_time, user_agent, failure_reason')
        .in('api_key_id', keyIds)
        .gte('access_time', since.toISOString())
        .order('access_time', { ascending: false })
        .limit(1000);

      if (error) throw error;
      setAccessLogs(logs ?? []);
    } catch (err) {
      console.error('Failed to fetch API usage:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, timeRange]);

  // Compute per-endpoint stats
  const endpointStats = useMemo<EndpointStats[]>(() => {
    const groups: Record<string, AccessLogEntry[]> = {};
    for (const log of accessLogs) {
      const ep = log.endpoint || 'unknown';
      if (!groups[ep]) groups[ep] = [];
      groups[ep].push(log);
    }

    return Object.entries(groups)
      .map(([endpoint, logs]) => {
        const times = logs.map(l => l.response_time_ms ?? 0).filter(t => t > 0).sort((a, b) => a - b);
        const successCount = logs.filter(l => l.success).length;
        const failCount = logs.filter(l => !l.success).length;
        const rateLimitedCount = logs.filter(l => l.rate_limited).length;
        const avgResponseMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        const p95ResponseMs = times.length ? times[Math.floor(times.length * 0.95)] ?? 0 : 0;

        return {
          endpoint,
          totalCalls: logs.length,
          successCount,
          failCount,
          rateLimitedCount,
          avgResponseMs,
          successRate: logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 0,
          p95ResponseMs,
        };
      })
      .sort((a, b) => b.totalCalls - a.totalCalls);
  }, [accessLogs]);

  // Compute daily usage trend
  const dailyUsage = useMemo<DailyUsage[]>(() => {
    const days: Record<string, { calls: number; successes: number; failures: number }> = {};
    for (const log of accessLogs) {
      const date = log.access_time.slice(0, 10);
      if (!days[date]) days[date] = { calls: 0, successes: 0, failures: 0 };
      days[date].calls++;
      if (log.success) days[date].successes++;
      else days[date].failures++;
    }
    return Object.entries(days)
      .map(([date, d]) => ({ date, ...d }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [accessLogs]);

  // Totals
  const totals = useMemo(() => ({
    calls: accessLogs.length,
    successes: accessLogs.filter(l => l.success).length,
    failures: accessLogs.filter(l => !l.success).length,
    rateLimited: accessLogs.filter(l => l.rate_limited).length,
    avgMs: accessLogs.length
      ? Math.round(accessLogs.reduce((a, l) => a + (l.response_time_ms ?? 0), 0) / accessLogs.length)
      : 0,
  }), [accessLogs]);

  // Pie chart data
  const pieData = useMemo(() =>
    endpointStats.slice(0, 8).map(s => ({ name: s.endpoint, value: s.totalCalls })),
    [endpointStats]
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/api-docs')} className="mb-2 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> API Docs
            </Button>
            <h1 className="text-3xl font-bold text-foreground">API Usage Analytics</h1>
            <p className="text-muted-foreground mt-1">Per-endpoint breakdown of your API call activity</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : accessLogs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No API activity yet</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Once you start making API calls with your keys, usage data will appear here with per-endpoint breakdowns.
              </p>
              <Button className="mt-4" onClick={() => navigate('/api-keys')}>Manage API Keys</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Activity className="h-4 w-4" /> Total Calls
                  </div>
                  <div className="text-2xl font-bold text-foreground">{totals.calls.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <CheckCircle className="h-4 w-4" /> Successes
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totals.successes.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <XCircle className="h-4 w-4" /> Failures
                  </div>
                  <div className="text-2xl font-bold text-destructive">{totals.failures.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <AlertTriangle className="h-4 w-4" /> Rate Limited
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{totals.rateLimited.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="h-4 w-4" /> Avg Response
                  </div>
                  <div className="text-2xl font-bold text-foreground">{totals.avgMs}ms</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="endpoints" className="space-y-6">
              <TabsList>
                <TabsTrigger value="endpoints">Per-Endpoint</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="logs">Recent Logs</TabsTrigger>
              </TabsList>

              {/* Per-Endpoint Tab */}
              <TabsContent value="endpoints" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar chart */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Calls by Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={endpointStats.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="endpoint" type="category" width={180} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="successCount" name="Success" stackId="a" fill="hsl(var(--primary))" />
                          <Bar dataKey="failCount" name="Failed" stackId="a" fill="hsl(var(--destructive))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${(name as string).slice(0, 12)} ${(percent * 100).toFixed(0)}%`}>
                            {pieData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Endpoint Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Endpoint Performance</CardTitle>
                    <CardDescription>Detailed metrics per endpoint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Endpoint</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Success Rate</TableHead>
                            <TableHead className="text-right">Avg (ms)</TableHead>
                            <TableHead className="text-right">P95 (ms)</TableHead>
                            <TableHead className="text-right">Rate Limited</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {endpointStats.map((s) => (
                            <TableRow key={s.endpoint}>
                              <TableCell className="font-mono text-sm">{s.endpoint}</TableCell>
                              <TableCell className="text-right">{s.totalCalls.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{s.successRate}%</TableCell>
                              <TableCell className="text-right">{s.avgResponseMs}</TableCell>
                              <TableCell className="text-right">{s.p95ResponseMs}</TableCell>
                              <TableCell className="text-right">{s.rateLimitedCount}</TableCell>
                              <TableCell>
                                {s.successRate >= 95 ? (
                                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                                ) : s.successRate >= 80 ? (
                                  <Badge variant="secondary">Degraded</Badge>
                                ) : (
                                  <Badge variant="destructive">Issues</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily API Call Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={dailyUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="calls" name="Total Calls" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="successes" name="Successes" stroke="hsl(142, 76%, 36%)" strokeWidth={1.5} />
                        <Line type="monotone" dataKey="failures" name="Failures" stroke="hsl(var(--destructive))" strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Logs Tab */}
              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent API Calls</CardTitle>
                    <CardDescription>Last 50 requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Response (ms)</TableHead>
                            <TableHead>Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accessLogs.slice(0, 50).map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {new Date(log.access_time).toLocaleString()}
                              </TableCell>
                              <TableCell className="font-mono text-sm">{log.endpoint ?? '—'}</TableCell>
                              <TableCell>
                                {log.rate_limited ? (
                                  <Badge variant="outline" className="text-amber-600 border-amber-600">Rate Limited</Badge>
                                ) : log.success ? (
                                  <Badge variant="default" className="bg-green-600">Success</Badge>
                                ) : (
                                  <Badge variant="destructive">Failed</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">{log.response_time_ms ?? '—'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                {log.failure_reason || '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default APIUsageAnalytics;
