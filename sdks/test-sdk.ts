/**
 * SoilSidekick Pro SDK Test Script
 * 
 * This script validates SDK functionality including:
 * - Authentication with API keys
 * - Rate limiting headers
 * - Tier-based feature access
 * - Error handling
 * 
 * Usage:
 *   npx ts-node sdks/test-sdk.ts <API_KEY>
 *   
 * Or with environment variable:
 *   SOILSIDEKICK_API_KEY=ss_prod_xxx npx ts-node sdks/test-sdk.ts
 */

const BASE_URL = 'https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1';

interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'skip';
  statusCode?: number;
  rateLimitHeaders?: {
    limit?: string;
    remaining?: string;
    reset?: string;
  };
  responseTime: number;
  error?: string;
  tierRequired?: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  summary: {
    passed: number;
    failed: number;
    skipped: number;
  };
}

// Test configurations by tier
const ENDPOINT_TESTS = [
  // Free tier endpoints
  {
    endpoint: '/get-soil-data',
    method: 'POST',
    body: { county_fips: '12086' }, // Miami-Dade
    tierRequired: 'free',
  },
  {
    endpoint: '/county-lookup',
    method: 'POST',
    body: { term: 'Miami' },
    tierRequired: 'free',
  },
  // Starter tier endpoints
  {
    endpoint: '/territorial-water-quality',
    method: 'POST',
    body: { county_fips: '12086' },
    tierRequired: 'starter',
  },
  {
    endpoint: '/territorial-water-analytics',
    method: 'POST',
    body: { territory_type: 'state' },
    tierRequired: 'starter',
  },
  {
    endpoint: '/multi-parameter-planting-calendar',
    method: 'POST',
    body: { county_fips: '12086', crop_type: 'tomato' },
    tierRequired: 'starter',
  },
  {
    endpoint: '/live-agricultural-data',
    method: 'POST',
    body: { 
      county_fips: '12086', 
      data_types: ['weather', 'soil'],
      state_code: 'FL',
      county_name: 'Miami-Dade'
    },
    tierRequired: 'starter',
  },
  {
    endpoint: '/environmental-impact-engine',
    method: 'POST',
    body: { 
      analysis_id: '00000000-0000-0000-0000-000000000000',
      county_fips: '12086',
      soil_data: { ph_level: 6.5, organic_matter: 3.2 }
    },
    tierRequired: 'starter',
  },
  // Pro tier endpoints
  {
    endpoint: '/alpha-earth-environmental-enhancement',
    method: 'POST',
    body: { latitude: 25.7617, longitude: -80.1918 },
    tierRequired: 'pro',
  },
  {
    endpoint: '/agricultural-intelligence',
    method: 'POST',
    body: { county_fips: '12086', analysis_type: 'crop_recommendation' },
    tierRequired: 'pro',
  },
  {
    endpoint: '/seasonal-planning-assistant',
    method: 'POST',
    body: { 
      location: { county_fips: '12086', state_code: 'FL' },
      planningType: 'spring_planting'
    },
    tierRequired: 'pro',
  },
  {
    endpoint: '/smart-report-summary',
    method: 'POST',
    body: { 
      reportType: 'soil',
      reportData: { ph_level: 6.5, organic_matter: 3.2 }
    },
    tierRequired: 'pro',
  },
  {
    endpoint: '/carbon-credit-calculator',
    method: 'POST',
    body: { 
      field_name: 'Test Field',
      field_size_acres: 100
    },
    tierRequired: 'pro',
  },
  {
    endpoint: '/leafengines-query',
    method: 'POST',
    body: { 
      location: { county_fips: '12086' },
      plant: { common_name: 'Tomato' }
    },
    tierRequired: 'pro',
    useXApiKey: true, // This endpoint uses x-api-key header
  },
  // Enterprise tier endpoints
  {
    endpoint: '/visual-crop-analysis',
    method: 'POST',
    body: { 
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      analysis_type: 'crop_health'
    },
    tierRequired: 'enterprise',
  },
];

async function testEndpoint(
  apiKey: string,
  config: typeof ENDPOINT_TESTS[0]
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Some endpoints use x-api-key, others use Authorization Bearer
    if (config.useXApiKey) {
      headers['x-api-key'] = apiKey;
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    const response = await fetch(`${BASE_URL}${config.endpoint}`, {
      method: config.method,
      headers,
      body: JSON.stringify(config.body),
    });
    
    const responseTime = Date.now() - startTime;
    
    // Extract rate limit headers
    const rateLimitHeaders = {
      limit: response.headers.get('X-RateLimit-Limit') || undefined,
      remaining: response.headers.get('X-RateLimit-Remaining') || undefined,
      reset: response.headers.get('X-RateLimit-Reset') || undefined,
    };
    
    // Determine test result
    let status: 'pass' | 'fail' | 'skip' = 'fail';
    let error: string | undefined;
    
    if (response.ok) {
      status = 'pass';
    } else if (response.status === 401) {
      error = 'Authentication failed - check API key';
    } else if (response.status === 403) {
      // Tier restriction is expected for higher tiers
      status = 'skip';
      error = `Tier restriction - requires ${config.tierRequired} tier`;
    } else if (response.status === 429) {
      error = 'Rate limited';
    } else {
      const errorBody = await response.text();
      error = `HTTP ${response.status}: ${errorBody.substring(0, 200)}`;
    }
    
    return {
      endpoint: config.endpoint,
      status,
      statusCode: response.status,
      rateLimitHeaders,
      responseTime,
      error,
      tierRequired: config.tierRequired,
    };
  } catch (err) {
    return {
      endpoint: config.endpoint,
      status: 'fail',
      responseTime: Date.now() - startTime,
      error: err instanceof Error ? err.message : 'Unknown error',
      tierRequired: config.tierRequired,
    };
  }
}

async function testRateLimiting(apiKey: string): Promise<TestResult[]> {
  console.log('\n🔄 Testing Rate Limiting...');
  const results: TestResult[] = [];
  
  // Make rapid requests to test rate limiting
  const rapidRequests = 5;
  for (let i = 0; i < rapidRequests; i++) {
    const result = await testEndpoint(apiKey, ENDPOINT_TESTS[0]); // Use free tier endpoint
    results.push({
      ...result,
      endpoint: `/get-soil-data (request ${i + 1}/${rapidRequests})`,
    });
    
    // Log rate limit headers
    if (result.rateLimitHeaders?.remaining) {
      console.log(`  Request ${i + 1}: Remaining: ${result.rateLimitHeaders.remaining}`);
    }
    
    // Small delay to avoid overwhelming
    await new Promise(r => setTimeout(r, 100));
  }
  
  return results;
}

async function testAuthenticationFailure(): Promise<TestResult> {
  console.log('\n🔐 Testing Authentication Failure...');
  
  const startTime = Date.now();
  const response = await fetch(`${BASE_URL}/get-soil-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid_api_key_12345',
    },
    body: JSON.stringify({ county_fips: '12086' }),
  });
  
  const passed = response.status === 401;
  
  return {
    endpoint: '/get-soil-data (invalid key)',
    status: passed ? 'pass' : 'fail',
    statusCode: response.status,
    responseTime: Date.now() - startTime,
    error: passed ? undefined : `Expected 401, got ${response.status}`,
  };
}

async function testMissingAuthentication(): Promise<TestResult> {
  console.log('\n🔐 Testing Missing Authentication...');
  
  const startTime = Date.now();
  const response = await fetch(`${BASE_URL}/get-soil-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ county_fips: '12086' }),
  });
  
  const passed = response.status === 401;
  
  return {
    endpoint: '/get-soil-data (no auth)',
    status: passed ? 'pass' : 'fail',
    statusCode: response.status,
    responseTime: Date.now() - startTime,
    error: passed ? undefined : `Expected 401, got ${response.status}`,
  };
}

async function runTestSuite(apiKey: string): Promise<TestSuite> {
  console.log('═'.repeat(60));
  console.log('🧪 SoilSidekick Pro SDK Test Suite');
  console.log('═'.repeat(60));
  console.log(`\n📍 Base URL: ${BASE_URL}`);
  console.log(`🔑 API Key: ${apiKey.substring(0, 12)}...${apiKey.slice(-4)}`);
  
  const results: TestResult[] = [];
  
  // Test authentication failure scenarios
  results.push(await testAuthenticationFailure());
  results.push(await testMissingAuthentication());
  
  // Test all endpoints
  console.log('\n📋 Testing Endpoints by Tier...');
  
  const tierGroups = {
    free: ENDPOINT_TESTS.filter(t => t.tierRequired === 'free'),
    starter: ENDPOINT_TESTS.filter(t => t.tierRequired === 'starter'),
    pro: ENDPOINT_TESTS.filter(t => t.tierRequired === 'pro'),
    enterprise: ENDPOINT_TESTS.filter(t => t.tierRequired === 'enterprise'),
  };
  
  for (const [tier, tests] of Object.entries(tierGroups)) {
    console.log(`\n  [${tier.toUpperCase()} TIER]`);
    
    for (const test of tests) {
      const result = await testEndpoint(apiKey, test);
      results.push(result);
      
      const statusIcon = result.status === 'pass' ? '✅' : result.status === 'skip' ? '⏭️' : '❌';
      console.log(`    ${statusIcon} ${test.endpoint} (${result.responseTime}ms)`);
      
      if (result.error && result.status === 'fail') {
        console.log(`       └─ ${result.error}`);
      }
      
      // Small delay between requests
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  // Test rate limiting
  const rateLimitResults = await testRateLimiting(apiKey);
  results.push(...rateLimitResults);
  
  // Calculate summary
  const summary = {
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    skipped: results.filter(r => r.status === 'skip').length,
  };
  
  return {
    name: 'SoilSidekick Pro SDK Tests',
    results,
    summary,
  };
}

function printSummary(suite: TestSuite) {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Summary');
  console.log('═'.repeat(60));
  
  console.log(`\n  ✅ Passed:  ${suite.summary.passed}`);
  console.log(`  ❌ Failed:  ${suite.summary.failed}`);
  console.log(`  ⏭️  Skipped: ${suite.summary.skipped}`);
  console.log(`  📝 Total:   ${suite.results.length}`);
  
  // List failed tests
  const failed = suite.results.filter(r => r.status === 'fail');
  if (failed.length > 0) {
    console.log('\n  Failed Tests:');
    for (const test of failed) {
      console.log(`    - ${test.endpoint}: ${test.error}`);
    }
  }
  
  // Print rate limit info from last successful request
  const lastWithRateLimit = suite.results
    .filter(r => r.rateLimitHeaders?.limit)
    .pop();
    
  if (lastWithRateLimit?.rateLimitHeaders) {
    console.log('\n  Rate Limit Status:');
    console.log(`    Limit:     ${lastWithRateLimit.rateLimitHeaders.limit}`);
    console.log(`    Remaining: ${lastWithRateLimit.rateLimitHeaders.remaining}`);
    console.log(`    Reset:     ${lastWithRateLimit.rateLimitHeaders.reset}`);
  }
  
  console.log('\n' + '═'.repeat(60));
  
  // Exit code based on failures
  const exitCode = suite.summary.failed > 0 ? 1 : 0;
  console.log(`\n${exitCode === 0 ? '✅ All tests passed!' : '❌ Some tests failed.'}\n`);
  
  return exitCode;
}

// Export for programmatic use
export { runTestSuite, testEndpoint, ENDPOINT_TESTS, TestResult, TestSuite };

// CLI entry point
async function main() {
  const apiKey = process.argv[2] || process.env.SOILSIDEKICK_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: API key required');
    console.error('\nUsage:');
    console.error('  npx ts-node sdks/test-sdk.ts <API_KEY>');
    console.error('  SOILSIDEKICK_API_KEY=xxx npx ts-node sdks/test-sdk.ts');
    process.exit(1);
  }
  
  try {
    const suite = await runTestSuite(apiKey);
    const exitCode = printSummary(suite);
    process.exit(exitCode);
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
}
