// Mock setup for testing - Phase 1 Action 1.1
// Created: March 2, 2026 for parallel test execution verification

export const createMockSupabaseClient = () => ({
  from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
  auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) }
});

export const createTestUser = () => ({
  id: 'test-user-123',
  email: 'test@example.com',
  subscription_tier: 'free'
});

export const createTestCounty = () => ({
  fips: '01001',
  name: 'Autauga County',
  state: 'AL'
});

export const createTestSoilData = () => ({
  county_fips: '01001',
  soil_type: 'sandy loam',
  ph_level: 6.5,
  organic_matter: 2.3
});

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

export const measureResponseTime = async (fn: () => Promise<any>) => {
  const start = Date.now();
  await fn();
  return Date.now() - start;
};

export const PERFORMANCE_THRESHOLDS = {
  p95: 1000, // 1 second
  p99: 2000  // 2 seconds
};
