// Custom Test Sequencer for Parallel Execution
// Groups tests by function for optimal parallelization

class CustomTestSequencer {
  async sort(tests) {
    // Group tests by function type for parallel execution
    const testGroups = {
      'trial-auth': [],
      'get-soil-data': [],
      'api-key-request': [],
      'other': []
    };
    
    // Categorize each test
    tests.forEach(test => {
      const path = test.path;
      
      if (path.includes('trial-auth')) {
        testGroups['trial-auth'].push(test);
      } else if (path.includes('get-soil-data')) {
        testGroups['get-soil-data'].push(test);
      } else if (path.includes('api-key-request')) {
        testGroups['api-key-request'].push(test);
      } else {
        testGroups['other'].push(test);
      }
    });
    
    // Log grouping for debugging
    console.log('Test grouping for parallel execution:');
    Object.entries(testGroups).forEach(([group, tests]) => {
      if (tests.length > 0) {
        console.log(`  ${group}: ${tests.length} test(s)`);
      }
    });
    
    // Return tests in grouped order (groups will run in parallel)
    // Within each group, tests run sequentially
    return [
      ...testGroups['trial-auth'],
      ...testGroups['get-soil-data'], 
      ...testGroups['api-key-request'],
      ...testGroups['other']
    ];
  }
  
  // Add cacheResults method to fix Jest error
  cacheResults() {
    // No-op implementation to satisfy Jest interface
    return Promise.resolve();
  }
}

module.exports = CustomTestSequencer;