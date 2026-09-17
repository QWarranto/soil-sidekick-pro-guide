import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useSubscription, SubscriptionTier } from '../useSubscription';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
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

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchSubscriptionData', () => {
    it('should fetch subscription data for authenticated user', async () => {
      const mockProfile = {
        subscription_tier: 'pro',
        trial_ends_at: null,
        subscription_ends_at: '2025-12-31T23:59:59.999Z',
      };

      const mockQuotas = [
        { feature_name: 'soil_analysis', monthly_limit: 100 },
        { feature_name: 'crop_recommendations', monthly_limit: 50 },
      ];

      const mockUsage = [
        { feature_name: 'soil_analysis', usage_count: 25 },
      ];

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
              }),
            }),
          } as any;
        }
        if (table === 'usage_quotas') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: mockQuotas, error: null }),
            }),
          } as any;
        }
        if (table === 'user_usage') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: mockUsage, error: null }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription?.tier).toBe('pro');
      expect(result.current.subscription?.isSubscriptionActive).toBe(false); // Date is in the past now (2026)
    });

    it('should handle profile fetch error gracefully', async () => {
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' },
            }),
          }),
        }),
      } as any));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching profile:',
        expect.objectContaining({ message: 'Profile not found' })
      );

      consoleSpy.mockRestore();
    });

    it('should correctly calculate trial status', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days in the future

      const mockProfile = {
        subscription_tier: 'starter',
        trial_ends_at: futureDate.toISOString(),
        subscription_ends_at: null,
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
              }),
            }),
          } as any;
        }
        if (table === 'usage_quotas') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          } as any;
        }
        if (table === 'user_usage') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription?.isTrialActive).toBe(true);
    });

    it('should calculate usage percentage correctly', async () => {
      const mockProfile = {
        subscription_tier: 'pro',
        trial_ends_at: null,
        subscription_ends_at: '2027-12-31T23:59:59.999Z',
      };

      const mockQuotas = [
        { feature_name: 'soil_analysis', monthly_limit: 100 },
      ];

      const mockUsage = [
        { feature_name: 'soil_analysis', usage_count: 75 },
      ];

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
              }),
            }),
          } as any;
        }
        if (table === 'usage_quotas') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: mockQuotas, error: null }),
            }),
          } as any;
        }
        if (table === 'user_usage') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: mockUsage, error: null }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usage['soil_analysis']).toEqual({
        current: 75,
        limit: 100,
        percentage: 75,
      });
    });
  });

  describe('canUseFeature', () => {
    it('should return true when RPC returns true', async () => {
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { subscription_tier: 'pro', trial_ends_at: null, subscription_ends_at: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        } as any;
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const canUse = await result.current.canUseFeature('soil_analysis');
      expect(canUse).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('can_use_feature', {
        p_user_id: 'test-user-id',
        p_feature_name: 'soil_analysis',
      });
    });

    it('should return false when RPC returns error', async () => {
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { subscription_tier: 'free', trial_ends_at: null, subscription_ends_at: null },
              error: null,
            }),
          }),
        }),
      } as any));

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'RPC error' },
      } as any);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const canUse = await result.current.canUseFeature('premium_feature');
      expect(canUse).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('incrementUsage', () => {
    it('should call RPC to increment usage and refresh data', async () => {
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { subscription_tier: 'pro', trial_ends_at: null, subscription_ends_at: '2027-12-31' },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        } as any;
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: true,
        error: null,
      } as any);

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const incremented = await result.current.incrementUsage('soil_analysis', 1);
      expect(incremented).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('increment_usage', {
        p_user_id: 'test-user-id',
        p_feature_name: 'soil_analysis',
        p_increment: 1,
      });
    });
  });

  describe('checkFeatureAccess', () => {
    it('should allow access for trial users', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    subscription_tier: 'free',
                    trial_ends_at: futureDate.toISOString(),
                    subscription_ends_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        } as any;
      });

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.subscription?.isTrialActive).toBe(true);
      });

      const access = await result.current.checkFeatureAccess('premium_feature');
      expect(access.canUse).toBe(true);
      expect(access.reason).toBeUndefined();
    });

    it('should deny access with reason when limit exceeded', async () => {
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    subscription_tier: 'free',
                    trial_ends_at: null,
                    subscription_ends_at: '2027-12-31',
                  },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'usage_quotas') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ feature_name: 'soil_analysis', monthly_limit: 10 }],
                error: null,
              }),
            }),
          } as any;
        }
        if (table === 'user_usage') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ feature_name: 'soil_analysis', usage_count: 10 }],
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const access = await result.current.checkFeatureAccess('soil_analysis');
      expect(access.canUse).toBe(false);
      expect(access.reason).toContain('monthly limit');
    });
  });

  describe('showUpgradePrompt', () => {
    it('should display toast with upgrade action', async () => {
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { subscription_tier: 'free', trial_ends_at: null, subscription_ends_at: null },
              error: null,
            }),
          }),
        }),
      } as any));

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.showUpgradePrompt('premium_feature', 'Custom reason');

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Upgrade Required',
          description: 'Custom reason',
          variant: 'destructive',
        })
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null user gracefully', async () => {
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

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription).toBeNull();
    });

    it('should default to free tier when subscription_tier is null', async () => {
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { subscription_tier: null, trial_ends_at: null, subscription_ends_at: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        } as any;
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

      const { result } = renderHook(() => useSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription?.tier).toBe('free');
    });
  });
});
