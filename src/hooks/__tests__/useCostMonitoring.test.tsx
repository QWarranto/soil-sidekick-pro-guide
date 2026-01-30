import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCostMonitoring } from '../useCostMonitoring';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock useAuth hook
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
  })),
}));

// Mock useToast hook
const mockToast = vi.fn();
vi.mock('../use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCostMonitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for initial fetch
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { data: [] },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            lte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          }),
        }),
      }),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trackCost', () => {
    it('should track cost via edge function', async () => {
      // Mock for initial fetch and trackCost call
      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_cost') {
          return { data: { cost_usd: 0.05, alerts: [] }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      // Wait for initial useEffect to complete
      await waitFor(() => {
        // Hook has rendered
        expect(result.current.trackCost).toBeDefined();
      });

      const cost = await result.current.trackCost(
        'openai',
        'gpt-4-turbo',
        1000,
        'agricultural_chat',
        { input_tokens: 500, output_tokens: 500 }
      );

      expect(supabase.functions.invoke).toHaveBeenCalledWith('cost-monitoring', {
        body: {
          action: 'track_cost',
          service_provider: 'openai',
          service_type: 'gpt-4-turbo',
          usage_amount: 1000,
          feature_name: 'agricultural_chat',
          request_details: { input_tokens: 500, output_tokens: 500 },
        },
      });

      expect(cost).toBe(0.05);
    });

    it('should display toast when cost alert is triggered', async () => {
      const mockAlerts = [
        {
          alert_id: 'alert-1',
          alert_name: 'Monthly Budget',
          current_amount: 85,
          threshold_amount: 100,
          percentage_used: 85,
        },
      ];

      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_cost') {
          return { data: { cost_usd: 0.10, alerts: mockAlerts }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackCost).toBeDefined();
      });

      await result.current.trackCost('openai', 'api', 100, 'test_feature');

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cost Alert: Monthly Budget',
          description: expect.stringContaining('85.0%'),
        })
      );
    });

    it('should display destructive toast when budget exceeded', async () => {
      const mockAlerts = [
        {
          alert_id: 'alert-1',
          alert_name: 'Daily Limit',
          current_amount: 110,
          threshold_amount: 100,
          percentage_used: 110,
        },
      ];

      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_cost') {
          return { data: { cost_usd: 0.10, alerts: mockAlerts }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackCost).toBeDefined();
      });

      await result.current.trackCost('openai', 'api', 100, 'test_feature');

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
        })
      );
    });

    it('should return 0 on error', async () => {
      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_cost') {
          return { data: null, error: { message: 'Function error' } } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackCost).toBeDefined();
      });

      const cost = await result.current.trackCost('openai', 'api', 100, 'test_feature');
      expect(cost).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe('trackUsage', () => {
    it('should track usage analytics via edge function', async () => {
      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_usage') {
          return { data: { analytics_id: 'analytics-123' }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackUsage).toBeDefined();
      });

      const analyticsId = await result.current.trackUsage(
        'soil_analysis',
        'query',
        'pro',
        'session-123',
        2.5,
        95,
        null,
        { county_fips: '01001' }
      );

      expect(supabase.functions.invoke).toHaveBeenCalledWith('cost-monitoring', {
        body: expect.objectContaining({
          action: 'track_usage',
          feature_name: 'soil_analysis',
          action_type: 'query',
          subscription_tier: 'pro',
          duration_seconds: 2.5,
          success_rate: 95,
        }),
      });

      expect(analyticsId).toBe('analytics-123');
    });

    it('should generate session ID if not provided', async () => {
      // Mock crypto.randomUUID for test environment
      const mockUUID = 'mock-session-uuid';
      vi.stubGlobal('crypto', {
        ...globalThis.crypto,
        randomUUID: () => mockUUID,
      });

      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_usage') {
          return { data: { analytics_id: 'analytics-456' }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackUsage).toBeDefined();
      });

      await result.current.trackUsage('feature', 'action', 'free');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('cost-monitoring', {
        body: expect.objectContaining({
          action: 'track_usage',
          session_id: mockUUID,
        }),
      });

      vi.unstubAllGlobals();
    });
  });

  describe('fetchUserCosts', () => {
    it('should fetch user cost data with date range', async () => {
      const mockCostData = [
        { service_provider: 'openai', service_type: 'gpt-4', cost_usd: 0.50, usage_count: 10, feature_name: 'chat', created_at: '2025-01-01T00:00:00Z' },
        { service_provider: 'supabase', service_type: 'storage', cost_usd: 0.10, usage_count: 5, feature_name: 'files', created_at: '2025-01-01T00:00:00Z' },
      ];

      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'get_user_costs' && body) {
          return { data: { data: mockCostData }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.fetchUserCosts).toBeDefined();
      });

      await result.current.fetchUserCosts('2025-01-01', '2025-01-31');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('cost-monitoring', {
        body: {
          action: 'get_user_costs',
          start_date: '2025-01-01',
          end_date: '2025-01-31',
        },
      });
    });

    it('should show error toast on fetch failure', async () => {
      let callCount = 0;
      vi.mocked(supabase.functions.invoke).mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return { data: { data: [] }, error: null } as any;
        }
        return { data: null, error: { message: 'Fetch error' } } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.fetchUserCosts).toBeDefined();
      });

      await result.current.fetchUserCosts();

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Failed to fetch cost data',
          variant: 'destructive',
        })
      );
    });
  });

  describe('getCostSummary', () => {
    it('should calculate cost summaries correctly', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const mockCostData = [
        { service_provider: 'openai', service_type: 'gpt-4', cost_usd: 0.50, usage_count: 10, feature_name: 'chat', created_at: `${today}T10:00:00Z` },
        { service_provider: 'openai', service_type: 'embeddings', cost_usd: 0.25, usage_count: 5, feature_name: 'search', created_at: `${today}T11:00:00Z` },
        { service_provider: 'supabase', service_type: 'storage', cost_usd: 0.10, usage_count: 2, feature_name: 'files', created_at: `${today}T12:00:00Z` },
      ];

      vi.mocked(supabase.functions.invoke).mockImplementation(async () => {
        return { data: { data: mockCostData }, error: null } as any;
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.costData.length).toBeGreaterThan(0);
      });

      const summary = result.current.getCostSummary();

      expect(summary.dailyTotal).toBeCloseTo(0.85, 2);
      expect(summary.monthlyTotal).toBeCloseTo(0.85, 2);
      expect(summary.serviceBreakdown.openai).toBeCloseTo(0.75, 2);
      expect(summary.serviceBreakdown.supabase).toBeCloseTo(0.10, 2);
      expect(summary.totalRequests).toBe(3);
    });
  });

  describe('getUsagePatterns', () => {
    it('should calculate usage patterns correctly', async () => {
      const mockUsageData = [
        { feature_name: 'soil_analysis', action_type: 'query', duration_seconds: 2.0, success_rate: 100, created_at: '2025-01-01T00:00:00Z' },
        { feature_name: 'soil_analysis', action_type: 'query', duration_seconds: 3.0, success_rate: 90, created_at: '2025-01-01T01:00:00Z' },
        { feature_name: 'crop_recommendations', action_type: 'generate', duration_seconds: 5.0, success_rate: 85, created_at: '2025-01-01T02:00:00Z' },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              lte: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: mockUsageData, error: null }),
                }),
              }),
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.usageData.length).toBeGreaterThan(0);
      });

      const patterns = result.current.getUsagePatterns();

      expect(patterns['soil_analysis'].total).toBe(2);
      expect(patterns['soil_analysis'].successful).toBe(2); // Both have success_rate > 80
      expect(patterns['soil_analysis'].avgDuration).toBeCloseTo(2.5, 1);
      expect(patterns['crop_recommendations'].total).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle null user gracefully for trackCost', async () => {
      const useAuthMock = await import('../useAuth');
      vi.mocked(useAuthMock.useAuth).mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        updatePassword: vi.fn(),
        session: null,
        subscriptionData: null,
        trialUser: null,
        refreshSubscription: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signInWithLinkedIn: vi.fn(),
        signInWithFacebook: vi.fn(),
        signInWithPhone: vi.fn(),
        verifyOtp: vi.fn(),
        signInWithTrial: vi.fn(),
        resetPassword: vi.fn(),
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      // Should not throw, just return early
      const cost = await result.current.trackCost('openai', 'api', 100, 'test');
      expect(cost).toBeUndefined();
      expect(supabase.functions.invoke).not.toHaveBeenCalled();
    });

    it('should update alerts state when alerts are returned', async () => {
      const mockAlerts = [
        {
          alert_id: 'alert-1',
          alert_name: 'Budget Alert',
          current_amount: 90,
          threshold_amount: 100,
          percentage_used: 90,
        },
      ];

      vi.mocked(supabase.functions.invoke).mockImplementation(async (name, options) => {
        const body = options?.body as { action?: string };
        if (body?.action === 'track_cost') {
          return { data: { cost_usd: 0.10, alerts: mockAlerts }, error: null } as any;
        }
        return { data: { data: [] }, error: null } as any;
      });

      const useAuthMock = await import('../useAuth');
      vi.mocked(useAuthMock.useAuth).mockReturnValue({
        user: { id: 'test-user-id', email: 'test@example.com' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        updatePassword: vi.fn(),
        session: null,
        subscriptionData: null,
        trialUser: null,
        refreshSubscription: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signInWithLinkedIn: vi.fn(),
        signInWithFacebook: vi.fn(),
        signInWithPhone: vi.fn(),
        verifyOtp: vi.fn(),
        signInWithTrial: vi.fn(),
        resetPassword: vi.fn(),
      });

      const { result } = renderHook(() => useCostMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.trackCost).toBeDefined();
      });

      await result.current.trackCost('openai', 'api', 100, 'test_feature');

      await waitFor(() => {
        expect(result.current.alerts).toHaveLength(1);
      });

      expect(result.current.alerts[0].alert_name).toBe('Budget Alert');
    });
  });
});
