// Parallel Jest Configuration for Backend Tests
// Optimized for 40-60% faster test execution

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/supabase/functions'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  
  // Parallel execution settings
  maxWorkers: '50%', // Use 50% of CPU cores
  maxConcurrency: 3, // Maximum concurrent test suites
  testRunner: 'jest-circus/runner',
  
  // Coverage settings
  collectCoverageFrom: [
    'supabase/functions/**/*.ts',
    '!supabase/functions/**/*.d.ts',
    '!supabase/functions/**/index.ts',
    '!supabase/functions/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  
  // Setup and timing
  setupFilesAfterEnv: ['<rootDir>/supabase/functions/__tests__/setup.ts'],
  testTimeout: 30000, // 30 seconds for edge function tests
  
  // Reporting
  verbose: true,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'jest-results.xml'
    }]
  ],
  
  // Cache for faster subsequent runs
  cacheDirectory: '.jest-cache',
  
  // Test sequencing (will use custom sequencer)
  testSequencer: '<rootDir>/custom-test-sequencer.cjs'
};