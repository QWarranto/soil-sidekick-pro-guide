// Test file for useCostMonitoring hook
// Implements standardized error handling as per v2.2 API documentation

import { renderHook, waitFor } from '@testing-library/react';
import { useCostMonitoring } from '../useCostMonitoring';
import { useAuth } from '../useAuth';
import { useToast } from '../use-toast';

// Mock the dependencies
jest.mock('../useAuth');
jest.mock('../use-toast');
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    }))
  }
}));

describe('useCostMonitoring', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockToast = jest.fn();
  const mockSupabaseInvoke = jest.fn();
  const mockSupabaseFrom = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup supabase mocks
    const supabase = require('@/integrations/supabase/client').supabase;
    supabase.functions.invoke = mockSupabaseInvoke;
    supabase.from = mockSupabaseFrom;
  });

  describe('Error Handling with Standardized Messages', () => {
    test('should handle service unavailability with standardized error message', async () => {
      // Mock service unavailable error
      mockSupabaseInvoke.mockRejectedValueOnce({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable. Please try again.',
          request_id: 'req_1234567890'
        }
      });

      const { result } = renderHook(() => useCostMonitoring());

      // Trigger cost tracking that will fail
      await result.current.trackCost('openai', 'gpt-4', 0.02, 'soil-analysis');

      // Wait for the error to be processed
      await waitFor(() => {
        // The hook should handle the error gracefully
        expect(mockSupabaseInvoke).toHaveBeenCalledWith('cost-monitoring', {
          body: {
            action: 'track_cost',
            service_provider: 'openai',
            service_type: 'gpt-4',
            usage_amount: 0.02,
            feature_name: 'soil-analysis',
            request_details: undefined
          }
        });
      });

      // Verify no toast notification for service errors (handled silently)
      expect(mockToast).not.toHaveBeenCalled();
    });

    test('should handle authentication failures with standardized error', async () => {
      // Mock authentication error
      mockSupabaseInvoke.mockRejectedValueOnce({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please check your API key.',
          request_id: 'req_auth_failed'
        }
      });

      const { result } = renderHook(() => useCostMonitoring());

      // Trigger usage tracking that will fail
      await result.current.trackUsage('soil-analysis', 'process', 'basic');

      await waitFor(() => {
        expect(mockSupabaseInvoke).toHaveBeenCalledWith('cost-monitoring', {
          body: expect.objectContaining({
            action: 'track_usage',
            feature_name: 'soil-analysis'
          })
        });
      });

      // Authentication errors should be handled silently
      expect(mockToast).not.toHaveBeenCalled();
    });

    test('should handle rate limiting with retry information', async () => {
      // Mock rate limit error
      mockSupabaseInvoke.mockRejectedValueOnce({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Rate limit exceeded. Please try again later.',
          retry_after: 60,
          request_id: 'req_rate_limited'
        }
      });

      const { result } = renderHook(() => useCostMonitoring());

      await result.current.trackCost('openai', 'gpt-4', 0.02, 'soil-analysis');

      await waitFor(() => {
        expect(mockSupabaseInvoke).toHaveBeenCalled();
      });

      // Rate limiting should be handled silently with retry logic
      expect(mockToast).not.toHaveBeenCalled();
    });

    test('should handle network timeouts gracefully', async () => {
      // Mock network timeout
      mockSupabaseInvoke.mockRejectedValueOnce(new Error('Network timeout'));

      const { result } = renderHook(() => useCostMonitoring());

      await result.current.fetchUserCosts();

      await waitFor(() => {
        expect(mockSupabaseInvoke).toHaveBeenCalledWith('cost-monitoring', {
          body: {
            action: 'get_user_costs',
            start_date: undefined,
            end_date: undefined
          }
        });
      });

      // Network timeouts should show user-friendly message
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Service temporarily unavailable. Please try again.",
        variant: "destructive"
      });
    });

    test('should handle database connection failures', async () => {
      // Mock database connection error
      mockSupabaseFrom.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValueOnce(new Error('Database connection failed'))
      }));

      const { result } = renderHook(() => useCostMonitoring());

      await result.current.fetchUserUsage();

      await waitFor(() => {
        expect(mockSupabaseFrom).toHaveBeenCalledWith('usage_analytics');
      });

      // Database errors should be handled gracefully
      expect(mockToast).not.toHaveBeenCalled(); // Silent failure for background operations
    });
  });

  describe('Standardized Error Response Format', () => {
    test('should maintain consistent error structure across all operations', async () => {
      const errorScenarios = [
        {
          name: 'service unavailable',
          error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable. Please try again.' },
          expectedToast: 'Service temporarily unavailable. Please try again.'
        },
        {
          name: 'authentication failed',
          error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please check your API key.' },
          expectedToast: null // Should be silent
        },
        {
          name: 'rate limited',
          error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' },
          expectedToast: null // Should be silent
        }
      ];

      for (const scenario of errorScenarios) {
        jest.clearAllMocks();
        mockSupabaseInvoke.mockRejectedValueOnce({ error: scenario.error });

        const { result } = renderHook(() => useCostMonitoring());
        
        await result.current.trackCost('openai', 'gpt-4', 0.02, 'test-feature');

        await waitFor(() => {
          expect(mockSupabaseInvoke).toHaveBeenCalled();
        });

        if (scenario.expectedToast) {
          expect(mockToast).toHaveBeenCalledWith({
            title: "Error",
            description: scenario.expectedToast,
            variant: "destructive"
          });
        } else {
          expect(mockToast).not.toHaveBeenCalled();
        }
      }
    });
  });

  describe('Error Code Categories', () => {
    test('should handle 1xx authentication errors', async () => {
      const authErrors = [
        { code: '1001', message: 'Authentication required' },
        { code: '1002', message: 'Invalid authentication token' },
        { code: '1003', message: 'Authentication expired' }
      ];

      for (const error of authErrors) {
        jest.clearAllMocks();
        mockSupabaseInvoke.mockRejectedValueOnce({ error });

        const { result } = renderHook(() => useCostMonitoring());
        
        await result.current.trackUsage('test-feature', 'process', 'basic');

        await waitFor(() => {
          expect(mockSupabaseInvoke).toHaveBeenCalled();
        });

        // Authentication errors should be handled silently
        expect(mockToast).not.toHaveBeenCalled();
      }
    });

    test('should handle 2xx subscription tier errors', async () => {
      const tierErrors = [
        { code: '2001', message: 'Subscription tier required' },
        { code: '2002', message: 'Feature not available for tier' },
        { code: '2003', message: 'API limit exceeded for tier' }
      ];

      for (const error of tierErrors) {
        jest.clearAllMocks();
        mockSupabaseInvoke.mockRejectedValueOnce({ error });

        const { result } = renderHook(() => useCostMonitoring());
        
        await result.current.trackCost('premium-service', 'api-call', 0.05, 'premium-feature');

        await waitFor(() => {
          expect(mockSupabaseInvoke).toHaveBeenCalled();
        });

        // Tier errors should be handled silently or with upgrade prompts
        expect(mockToast).not.toHaveBeenCalled();
      }
    });

    test('should handle 9xx service errors with user notification', async () => {
      const serviceErrors = [
        { 
          code: '9001', 
          message: 'Service temporarily unavailable. Please try again.',
          retry_after: 30
        },
        { 
          code: '9002', 
          message: 'Rate limit exceeded. Please try again later.',
          retry_after: 60
        }
      ];

      for (const error of serviceErrors) {
        jest.clearAllMocks();
        mockSupabaseInvoke.mockRejectedValueOnce({ error });

        const { result } = renderHook(() => useCostMonitoring());
        
        await result.current.fetchUserCosts();

        await waitFor(() => {
          expect(mockSupabaseInvoke).toHaveBeenCalled();
        });

        // Service errors should show user-friendly messages
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  });

  describe('Graceful Error Recovery', () => {
    test('should continue operation after errors', async () => {
      // First call fails
      mockSupabaseInvoke.mockRejectedValueOnce({
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable' }
      });

      // Second call succeeds
      mockSupabaseInvoke.mockResolvedValueOnce({
        data: { cost_usd: 0.02 },
        error: null
      });

      const { result } = renderHook(() => useCostMonitoring());

      // First call - fails
      await result.current.trackCost('openai', 'gpt-4', 0.02, 'test-feature');

      // Second call - should succeed
      const cost = await result.current.trackCost('openai', 'gpt-4', 0.02, 'test-feature-2');

      await waitFor(() => {
        expect(mockSupabaseInvoke).toHaveBeenCalledTimes(2);
      });

      expect(cost).toBe(0.02); // Should return the successful result
    });

    test('should maintain data integrity during errors', async () => {
      const { result } = renderHook(() => useCostMonitoring());

      // Simulate error during data fetching
      mockSupabaseInvoke.mockRejectedValueOnce(new Error('Network error'));

      await result.current.fetchUserCosts();

      // Data should remain unchanged after error
      expect(result.current.costData).toEqual([]);
      expect(result.current.loading).toBe(false); // Loading state should be reset
    });
  });
});