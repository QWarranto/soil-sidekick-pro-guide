#!/usr/bin/env node
/**
 * Simple County-Lookup Performance Benchmark
 * Fallback if main benchmark fails
 */

const https = require('https');

const ENDPOINT = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/county-lookup';
const TEST_COUNTY = '01001'; // Autauga County, AL
const REQUESTS = 10;

console.log('Simple County-Lookup Benchmark');
console.log('==============================');
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Test county: ${TEST_COUNTY}`);
console.log(`Requests: ${REQUESTS}`);
console.log('');

function makeRequest() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const url = `${ENDPOINT}?fips=${TEST_COUNTY}`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          success: true,
          statusCode: res.statusCode,
          duration,
          dataLength: data.length
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function runBenchmark() {
  const results = [];
  let successes = 0;
  let failures = 0;
  
  for (let i = 0; i < REQUESTS; i++) {
    process.stdout.write(`Request ${i + 1}/${REQUESTS}... `);
    
    try {
      const result = await makeRequest();
      results.push(result.duration);
      successes++;
      console.log(`✅ ${result.duration}ms (${result.statusCode})`);
    } catch (error) {
      failures++;
      console.log(`❌ ${error.message}`);
    }
    
    // Small delay between requests
    if (i < REQUESTS - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('\n📊 Results:');
  console.log(`Successful: ${successes}/${REQUESTS}`);
  console.log(`Failed: ${failures}/${REQUESTS}`);
  
  if (results.length > 0) {
    results.sort((a, b) => a - b);
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const p95 = results[Math.floor(results.length * 0.95)];
    
    console.log(`\n⏱️  Response Times:`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  P95: ${p95.toFixed(2)}ms`);
    console.log(`  Min: ${results[0]}ms`);
    console.log(`  Max: ${results[results.length - 1]}ms`);
    
    console.log(`\n🎯 Target: P95 < 1000ms`);
    console.log(`  Status: ${p95 < 1000 ? '✅ MEETS TARGET' : '⚠️  ABOVE TARGET'}`);
    
    // Save simple results
    const fs = require('fs');
    const simpleResults = {
      timestamp: new Date().toISOString(),
      endpoint: ENDPOINT,
      requests: REQUESTS,
      successes,
      failures,
      averageMs: avg,
      p95Ms: p95,
      meetsTarget: p95 < 1000,
      rawTimes: results
    };
    
    fs.writeFileSync(
      'benchmark-results/simple-results.json',
      JSON.stringify(simpleResults, null, 2)
    );
    
    console.log('\n📁 Results saved to: benchmark-results/simple-results.json');
  }
}

runBenchmark().catch(console.error);