// Backend Test Framework for LeafEngines SDK
// Jest configuration for Supabase Edge Functions

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/supabase/functions'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'supabase/functions/**/*.ts',
    '!supabase/functions/**/*.d.ts',
    '!supabase/functions/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  setupFilesAfterEnv: ['<rootDir>/supabase/functions/__tests__/setup.ts'],
  testTimeout: 30000, // 30 seconds for edge function tests
  verbose: true
};