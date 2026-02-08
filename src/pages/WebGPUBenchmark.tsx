import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { localLLMService, LocalLLMConfig, LLMStatus } from '@/services/localLLMService';
import { 
  Play, 
  Square, 
  Download, 
  Cpu, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface BenchmarkResult {
  iteration: number;
  latencyMs: number;
  tokensGenerated: number;
  tokensPerSecond: number;
  timestamp: Date;
}

interface BenchmarkStats {
  totalIterations: number;
  successfulIterations: number;
  failedIterations: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  stdDev: number;
  avgTokensPerSecond: number;
}

type BenchmarkTestType = 'plant-id' | 'care-advice' | 'health-diagnosis' | 'report-summary';

const TEST_PROMPTS: Record<BenchmarkTestType, { name: string; prompt: string; description: string }> = {
  'plant-id': {
    name: 'Plant Identification',
    prompt: 'Identify: Green leaves, 6 inches tall, small white flowers, grows in partial shade.',
    description: 'Simulates plant identification from description'
  },
  'care-advice': {
    name: 'Care Advice',
    prompt: 'How should I care for a tomato plant in zone 7b during summer?',
    description: 'Simulates plant care recommendation'
  },
  'health-diagnosis': {
    name: 'Health Diagnosis',
    prompt: 'My tomato plant has yellowing leaves and brown spots. What could be wrong?',
    description: 'Simulates plant health analysis'
  },
  'report-summary': {
    name: 'Report Summary',
    prompt: 'Summarize soil with pH 6.5, nitrogen 45ppm, phosphorus 30ppm, potassium 180ppm.',
    description: 'Simulates report summarization'
  }
};

function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;
  const index = (percentile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
}

function calculateStats(results: BenchmarkResult[]): BenchmarkStats | null {
  if (results.length === 0) return null;
  
  const latencies = results.map(r => r.latencyMs).sort((a, b) => a - b);
  const tokensPerSec = results.map(r => r.tokensPerSecond);
  
  const sum = latencies.reduce((a, b) => a + b, 0);
  const mean = sum / latencies.length;
  const variance = latencies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / latencies.length;
  
  return {
    totalIterations: results.length,
    successfulIterations: results.length,
    failedIterations: 0,
    min: Math.min(...latencies),
    max: Math.max(...latencies),
    mean,
    median: calculatePercentile(latencies, 50),
    p50: calculatePercentile(latencies, 50),
    p75: calculatePercentile(latencies, 75),
    p90: calculatePercentile(latencies, 90),
    p95: calculatePercentile(latencies, 95),
    p99: calculatePercentile(latencies, 99),
    stdDev: Math.sqrt(variance),
    avgTokensPerSecond: tokensPerSec.reduce((a, b) => a + b, 0) / tokensPerSec.length
  };
}

export default function WebGPUBenchmark() {
  const [isRunning, setIsRunning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [stats, setStats] = useState<BenchmarkStats | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Configuration
  const [iterations, setIterations] = useState<number>(10);
  const [testType, setTestType] = useState<BenchmarkTestType>('plant-id');
  const [maxTokens, setMaxTokens] = useState<number>(50);
  
  const abortRef = React.useRef(false);

  const checkWebGPU = useCallback(async () => {
    const supported = await localLLMService.checkWebGPUSupport();
    setWebgpuSupported(supported);
    return supported;
  }, []);

  React.useEffect(() => {
    checkWebGPU();
    const status = localLLMService.getStatus();
    if (status.initialized) {
      setLlmStatus(status);
    }
  }, [checkWebGPU]);

  const initializeModel = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      const config: LocalLLMConfig = {
        model: 'gemma-2b',
        maxTokens: 50,
        temperature: 0.7
      };
      
      await localLLMService.initialize(config);
      setLlmStatus(localLLMService.getStatus());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize model');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const runBenchmark = useCallback(async () => {
    if (!localLLMService.isAvailable()) {
      setError('Model not initialized. Please initialize first.');
      return;
    }

    setIsRunning(true);
    setError(null);
    setResults([]);
    setStats(null);
    setProgress(0);
    setCurrentIteration(0);
    abortRef.current = false;

    const newResults: BenchmarkResult[] = [];
    const testPrompt = TEST_PROMPTS[testType];
    const config: LocalLLMConfig = {
      model: 'gemma-2b',
      maxTokens,
      temperature: 0.7
    };

    // Warm-up run (not counted)
    try {
      await localLLMService.generateChatResponse(
        [{ role: 'user', content: 'Hello' }],
        { ...config, maxTokens: 10 }
      );
    } catch (e) {
      console.log('Warm-up completed with potential error (expected)');
    }

    for (let i = 0; i < iterations; i++) {
      if (abortRef.current) break;

      setCurrentIteration(i + 1);
      setProgress(((i + 1) / iterations) * 100);

      const startTime = performance.now();
      
      try {
        const response = await localLLMService.generateChatResponse(
          [{ role: 'user', content: testPrompt.prompt }],
          config
        );
        
        const endTime = performance.now();
        const latencyMs = endTime - startTime;
        const tokensGenerated = response.split(/\s+/).length; // Approximate token count
        const tokensPerSecond = (tokensGenerated / latencyMs) * 1000;

        const result: BenchmarkResult = {
          iteration: i + 1,
          latencyMs,
          tokensGenerated,
          tokensPerSecond,
          timestamp: new Date()
        };

        newResults.push(result);
        setResults([...newResults]);
        setStats(calculateStats(newResults));
      } catch (err) {
        console.error(`Iteration ${i + 1} failed:`, err);
        // Continue with remaining iterations
      }

      // Small delay between iterations to prevent overload
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
    setProgress(100);
  }, [iterations, testType, maxTokens]);

  const stopBenchmark = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
  }, []);

  const exportResults = useCallback(() => {
    if (!stats || results.length === 0) return;

    const exportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        device: llmStatus?.device || 'unknown',
        model: llmStatus?.model || 'unknown',
        fallbackUsed: llmStatus?.fallbackUsed || false,
        testType,
        maxTokens,
        iterations,
        userAgent: navigator.userAgent
      },
      statistics: stats,
      rawResults: results.map(r => ({
        iteration: r.iteration,
        latencyMs: r.latencyMs,
        tokensGenerated: r.tokensGenerated,
        tokensPerSecond: r.tokensPerSecond,
        timestamp: r.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webgpu-benchmark-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stats, results, llmStatus, testType, maxTokens, iterations]);

  const getLatencyBadgeVariant = (latency: number): "default" | "secondary" | "destructive" | "outline" => {
    if (latency < 100) return "default";
    if (latency < 200) return "secondary";
    return "destructive";
  };

  const getSLAStatus = (p95: number): { status: 'pass' | 'warn' | 'fail'; message: string } => {
    if (p95 < 100) return { status: 'pass', message: 'SLA Met: p95 < 100ms' };
    if (p95 < 200) return { status: 'warn', message: 'Near SLA: p95 < 200ms' };
    return { status: 'fail', message: 'SLA Missed: p95 ≥ 200ms' };
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">WebGPU Latency Benchmark</h1>
        <p className="text-muted-foreground">
          Validate sub-100ms SLA for offline local inference using WebGPU and Gemma 2B
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              WebGPU Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            {webgpuSupported === null ? (
              <Badge variant="outline">Checking...</Badge>
            ) : webgpuSupported ? (
              <Badge className="bg-primary text-primary-foreground">Supported</Badge>
            ) : (
              <Badge variant="destructive">Not Available</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Model Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {llmStatus?.initialized ? (
              <div className="space-y-1">
                <Badge className="bg-primary text-primary-foreground">Initialized</Badge>
                <p className="text-xs text-muted-foreground">
                  Device: {llmStatus.device?.toUpperCase()}
                  {llmStatus.fallbackUsed && ' (fallback)'}
                </p>
              </div>
            ) : (
              <Badge variant="outline">Not Loaded</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              SLA Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">p95 &lt; 100ms</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              For offline WebGPU inference
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Initialization */}
      {!llmStatus?.initialized && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Model Not Loaded</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Initialize the Gemma 2B model to run benchmarks. First load may take 30-60 seconds.</span>
            <Button 
              onClick={initializeModel} 
              disabled={isInitializing}
              className="ml-4"
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading Model...
                </>
              ) : (
                'Initialize Model'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Benchmark Configuration</CardTitle>
          <CardDescription>Configure test parameters before running the benchmark</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Type</label>
              <Select 
                value={testType} 
                onValueChange={(v) => setTestType(v as BenchmarkTestType)}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEST_PROMPTS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {TEST_PROMPTS[testType].description}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Iterations</label>
              <Select 
                value={iterations.toString()} 
                onValueChange={(v) => setIterations(parseInt(v))}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 iterations</SelectItem>
                  <SelectItem value="10">10 iterations</SelectItem>
                  <SelectItem value="20">20 iterations</SelectItem>
                  <SelectItem value="50">50 iterations</SelectItem>
                  <SelectItem value="100">100 iterations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Tokens</label>
              <Select 
                value={maxTokens.toString()} 
                onValueChange={(v) => setMaxTokens(parseInt(v))}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 tokens (fast)</SelectItem>
                  <SelectItem value="50">50 tokens (balanced)</SelectItem>
                  <SelectItem value="100">100 tokens (detailed)</SelectItem>
                  <SelectItem value="150">150 tokens (verbose)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {!isRunning ? (
              <Button 
                onClick={runBenchmark} 
                disabled={!llmStatus?.initialized || isInitializing}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Benchmark
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopBenchmark}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={exportResults}
              disabled={results.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>

          {isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {currentIteration}/{iterations}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Benchmark Results</span>
              {(() => {
                const sla = getSLAStatus(stats.p95);
                return (
                  <Badge 
                    variant={sla.status === 'pass' ? 'default' : sla.status === 'warn' ? 'secondary' : 'destructive'}
                  >
                    {sla.status === 'pass' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {sla.status === 'warn' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {sla.message}
                  </Badge>
                );
              })()}
            </CardTitle>
            <CardDescription>
              {stats.totalIterations} iterations completed • Device: {llmStatus?.device?.toUpperCase() || 'Unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.p50.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">p50 (Median)</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.p75.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">p75</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.p90.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">p90</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-primary">
                <div className="text-2xl font-bold">{stats.p95.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">p95 (SLA Target)</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.p99.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">p99</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{stats.avgTokensPerSecond.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Tokens/sec</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Min: {stats.min.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Max: {stats.max.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Mean: {stats.mean.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">StdDev: {stats.stdDev.toFixed(0)}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results Table */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Iterations</CardTitle>
            <CardDescription>Detailed latency measurements for each inference run</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Iteration</TableHead>
                    <TableHead>Latency (ms)</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Tokens/sec</TableHead>
                    <TableHead>SLA Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.iteration}>
                      <TableCell>{result.iteration}</TableCell>
                      <TableCell className="font-mono">{result.latencyMs.toFixed(2)}</TableCell>
                      <TableCell>{result.tokensGenerated}</TableCell>
                      <TableCell>{result.tokensPerSecond.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge variant={getLatencyBadgeVariant(result.latencyMs)}>
                          {result.latencyMs < 100 ? '✓ Pass' : result.latencyMs < 200 ? '~ Near' : '✗ Fail'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
