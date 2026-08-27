#!/usr/bin/env node
/**
 * County-Lookup Performance Benchmarking
 * Action 2.1: Measure P95 response time vs <1000ms target
 * Created: March 2, 2026 for Phase 1 QA Acceleration
 */

const https = require('https');
const { performance } = require('perf_hooks');

// Configuration
const CONFIG = {
  endpoint: 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/county-lookup',
  sampleSize: 100, // Number of requests to make
  concurrency: 5, // Concurrent requests
  timeoutMs: 5000, // 5 second timeout per request
  targetP95: 1000, // Humaira's Week 1 target: P95 < 1000ms
  testCounty: '01001', // Autauga County, AL (sample FIPS code)
  outputFile: 'benchmark-results/county-lookup-metrics.json'
};

// Results storage
const results = {
  config: CONFIG,
  startTime: new Date().toISOString(),
  requests: [],
  summary: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    timeouts: 0,
    totalDurationMs: 0
  },
  percentiles: {
    p50: null,
    p95: null,
    p99: null
  },
  meetsTarget: null
};

// Helper: Make a single request and measure time
function makeRequest(countyFips) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout after ${CONFIG.timeoutMs}ms`));
    }, CONFIG.timeoutMs);

    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Phase1-Benchmark/1.0'
      }
    };

    const url = `${CONFIG.endpoint}?fips=${countyFips}`;
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        clearTimeout(timeout);
        const endTime = performance.now();
        const durationMs = endTime - startTime;
        
        resolve({
          success: true,
          statusCode: res.statusCode,
          durationMs,
          startTime,
          endTime,
          data: data.length > 100 ? `${data.substring(0, 100)}...` : data
        });
      });
    });

    req.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    req.end();
  });
}

// Helper: Calculate percentiles
function calculatePercentiles(times) {
  if (times.length === 0) return { p50: 0, p95: 0, p99: 0 };
  
  const sorted = [...times].sort((a, b) => a - b);
  
  return {
    p50: sorted[Math.floor(sorted.length * 0.50)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)]
  };
}

// Helper: Run concurrent requests
async function runConcurrentRequests(count, concurrency) {
  const batches = [];
  for (let i = 0; i < count; i += concurrency) {
    const batch = Array.from(
      { length: Math.min(concurrency, count - i) },
      (_, index) => makeRequest(CONFIG.testCounty)
    );
    batches.push(batch);
  }

  const allResults = [];
  for (const batch of batches) {
    const batchResults = await Promise.allSettled(batch);
    allResults.push(...batchResults);
  }

  return allResults;
}

// Main benchmarking function
async function runBenchmark() {
  console.log('=========================================');
  console.log('County-Lookup Performance Benchmarking');
  console.log('Action 2.1: Phase 1 QA Acceleration');
  console.log(`Target: P95 < ${CONFIG.targetP95}ms`);
  console.log(`Endpoint: ${CONFIG.endpoint}`);
  console.log(`Sample size: ${CONFIG.sampleSize} requests`);
  console.log(`Concurrency: ${CONFIG.concurrency}`);
  console.log('=========================================');
  
  console.log('\n🚀 Starting benchmark...');
  const benchmarkStart = performance.now();
  
  try {
    const requestResults = await runConcurrentRequests(CONFIG.sampleSize, CONFIG.concurrency);
    
    // Process results
    const successfulTimes = [];
    
    requestResults.forEach((result, index) => {
      const requestInfo = {
        requestId: index + 1,
        timestamp: new Date().toISOString()
      };
      
      if (result.status === 'fulfilled') {
        const value = result.value;
        requestInfo.success = true;
        requestInfo.statusCode = value.statusCode;
        requestInfo.durationMs = value.durationMs;
        requestInfo.dataSample = value.data;
        
        successfulTimes.push(value.durationMs);
        results.summary.successfulRequests++;
      } else {
        requestInfo.success = false;
        requestInfo.error = result.reason.message;
        
        if (result.reason.message.includes('Timeout')) {
          results.summary.timeouts++;
        }
        results.summary.failedRequests++;
      }
      
      results.requests.push(requestInfo);
    });
    
    // Calculate statistics
    results.summary.totalRequests = CONFIG.sampleSize;
    results.summary.totalDurationMs = performance.now() - benchmarkStart;
    
    if (successfulTimes.length > 0) {
      results.percentiles = calculatePercentiles(successfulTimes);
      results.meetsTarget = results.percentiles.p95 < CONFIG.targetP95;
      
      // Additional statistics
      results.summary.averageTime = successfulTimes.reduce((a, b) => a + b, 0) / successfulTimes.length;
      results.summary.minTime = Math.min(...successfulTimes);
      results.summary.maxTime = Math.max(...successfulTimes);
      results.summary.successRate = (results.summary.successfulRequests / CONFIG.sampleSize) * 100;
    }
    
    // Save results
    const fs = require('fs');
    const path = require('path');
    
    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(results, null, 2));
    
    // Print summary
    console.log('\n=========================================');
    console.log('📊 Benchmark Results Summary');
    console.log('=========================================');
    console.log(`Total requests: ${results.summary.totalRequests}`);
    console.log(`Successful: ${results.summary.successfulRequests}`);
    console.log(`Failed: ${results.summary.failedRequests}`);
    console.log(`Timeouts: ${results.summary.timeouts}`);
    console.log(`Success rate: ${results.summary.successRate.toFixed(1)}%`);
    
    if (successfulTimes.length > 0) {
      console.log('\n⏱️  Response Time Percentiles:');
      console.log(`  P50 (median): ${results.percentiles.p50.toFixed(2)}ms`);
      console.log(`  P95 (target): ${results.percentiles.p95.toFixed(2)}ms`);
      console.log(`  P99: ${results.percentiles.p99.toFixed(2)}ms`);
      console.log(`  Average: ${results.summary.averageTime.toFixed(2)}ms`);
      console.log(`  Min: ${results.summary.minTime.toFixed(2)}ms`);
      console.log(`  Max: ${results.summary.maxTime.toFixed(2)}ms`);
      
      console.log('\n🎯 Target Comparison:');
      console.log(`  Target P95: < ${CONFIG.targetP95}ms`);
      console.log(`  Actual P95: ${results.percentiles.p95.toFixed(2)}ms`);
      console.log(`  Meets target: ${results.meetsTarget ? '✅ YES' : '❌ NO'}`);
      
      if (!results.meetsTarget) {
        const overBy = results.percentiles.p95 - CONFIG.targetP95;
        console.log(`  Exceeds target by: ${overBy.toFixed(2)}ms (${((overBy / CONFIG.targetP95) * 100).toFixed(1)}%)`);
      }
    }
    
    console.log('\n📁 Results saved to:', CONFIG.outputFile);
    console.log(`⏱️  Total benchmark duration: ${results.summary.totalDurationMs.toFixed(2)}ms`);
    
    // Generate March 9 presentation snippet
    console.log('\n=========================================');
    console.log('📈 March 9 Presentation Metrics');
    console.log('=========================================');
    console.log('"Our Phase 1 performance benchmarking shows:');
    if (successfulTimes.length > 0) {
      console.log(`• County-lookup P95: ${results.percentiles.p95.toFixed(0)}ms`);
      console.log(`• Target: <${CONFIG.targetP95}ms`);
      console.log(`• Status: ${results.meetsTarget ? '✅ MEETS TARGET' : '⚠️  NEEDS OPTIMIZATION'}`);
      console.log(`• Success rate: ${results.summary.successRate.toFixed(1)}%`);
    } else {
      console.log('• Benchmark completed but no successful requests');
      console.log('• Endpoint may require authentication or have issues');
    }
    console.log('"');
    
  } catch (error) {
    console.error('❌ Benchmark failed:', error.message);
    process.exit(1);
  }
}

// Run the benchmark
runBenchmark().catch(console.error);