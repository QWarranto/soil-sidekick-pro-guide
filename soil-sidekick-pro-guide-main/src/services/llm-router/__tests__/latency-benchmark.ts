// llm-router/__tests__/latency-benchmark.ts
// Reliable latency testing for LLM Router
// Run this to benchmark actual performance

import { llmService } from '../llm-service';

interface BenchmarkResult {
  backend: string;
  model: string;
  latencyMs: number;
  success: boolean;
  degraded?: boolean;
  timestamp: Date;
}

/**
 * Run comprehensive latency benchmark
 */
export async function runLatencyBenchmark(): Promise<{
  results: BenchmarkResult[];
  summary: {
    webgpuAvailable: boolean;
    averageLatency: number;
    minLatency: number;
    maxLatency: number;
    slaCompliance: number; // % under 100ms
  };
}> {
  const results: BenchmarkResult[] = [];
  const testPrompts = [
    "Summarize: Soil moisture at 28%",
    "Analyze: Temperature 18°C, pH 6.5",
    "Recommend: Low nitrogen detected",
  ];

  console.log('=== LLM Router Latency Benchmark ===\n');

  // Check capabilities
  const caps = await llmService.getCapabilities();
  console.log(`WebGPU Available: ${caps.webgpu}`);
  console.log(`Recommended Backend: ${caps.recommended}\n`);

  // Preload model (warmup)
  console.log('Preloading model...');
  await llmService.preload();
  console.log('Ready.\n');

  // Run benchmarks
  for (let i = 0; i < 5; i++) {
    const prompt = testPrompts[i % testPrompts.length];
    
    try {
      const response = await llmService.generate({
        prompt,
        maxTokens: 50,
        maxLatencyMs: 100,
      });

      results.push({
        backend: response.backend,
        model: response.model,
        latencyMs: response.latencyMs,
        success: true,
        degraded: response.degraded,
        timestamp: new Date(),
      });

      console.log(`Test ${i + 1}: ${response.latencyMs}ms (${response.backend})${response.degraded ? ' [DEGRADED]' : ''}`);

    } catch (error) {
      results.push({
        backend: 'error',
        model: 'unknown',
        latencyMs: 0,
        success: false,
        timestamp: new Date(),
      });

      console.log(`Test ${i + 1}: FAILED - ${error}`);
    }

    // Small delay between tests
    await new Promise(r => setTimeout(r, 100));
  }

  // Calculate summary
  const successful = results.filter(r => r.success);
  const latencies = successful.map(r => r.latencyMs);
  
  const summary = {
    webgpuAvailable: caps.webgpu,
    averageLatency: latencies.length > 0 
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0,
    minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
    maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
    slaCompliance: latencies.length > 0
      ? Math.round((latencies.filter(l => l <= 100).length / latencies.length) * 100)
      : 0,
  };

  console.log('\n=== Summary ===');
  console.log(`Average Latency: ${summary.averageLatency}ms`);
  console.log(`Min/Max: ${summary.minLatency}ms / ${summary.maxLatency}ms`);
  console.log(`SLA Compliance (<100ms): ${summary.slaCompliance}%`);
  console.log(`Degraded Runs: ${results.filter(r => r.degraded).length}`);

  return { results, summary };
}

// Run if executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).runLatencyBenchmark = runLatencyBenchmark;
}

export default runLatencyBenchmark;
