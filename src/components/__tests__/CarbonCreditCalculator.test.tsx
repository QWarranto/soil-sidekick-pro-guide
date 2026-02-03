import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { CarbonCreditCalculator } from '../CarbonCreditCalculator';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock useSubscription hook
vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: vi.fn(() => ({
    checkFeatureAccess: vi.fn().mockResolvedValue({ canUse: true }),
    subscription: { tier: 'pro' },
    loading: false,
    usage: {},
    canUseFeature: vi.fn().mockResolvedValue(true),
    incrementUsage: vi.fn().mockResolvedValue(true),
    showUpgradePrompt: vi.fn(),
    refreshSubscription: vi.fn(),
  })),
}));

// Mock useOneTimePurchase hook
vi.mock('@/hooks/useOneTimePurchase', () => ({
  useOneTimePurchase: vi.fn(() => ({
    isModalOpen: false,
    currentFeature: null,
    shouldShowOneTimePurchase: vi.fn().mockReturnValue(false),
    showOneTimePurchaseModal: vi.fn().mockReturnValue(false),
    closeModal: vi.fn(),
    getFeatureConfig: vi.fn().mockReturnValue({
      title: 'Carbon Credits',
      description: 'Calculate carbon credits',
      price: 9.99,
      originalPrice: 14.99,
      benefits: ['Benefit 1'],
    }),
  })),
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

describe('CarbonCreditCalculator', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render the calculator dialog', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Carbon Credit Calculator')).toBeInTheDocument();
      expect(screen.getByLabelText(/field name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/field size/i)).toBeInTheDocument();
      expect(screen.getByText('Calculate Credits')).toBeInTheDocument();
    });

    it('should render soil organic matter input as optional', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      const somInput = screen.getByLabelText(/soil organic matter/i);
      expect(somInput).toBeInTheDocument();
      expect(screen.getByText(/regional average.*will be used/i)).toBeInTheDocument();
    });

    it('should render verification type selector', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/verification type/i)).toBeInTheDocument();
    });

    it('should render calculation formula explanation', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/how carbon credits are calculated/i)).toBeInTheDocument();
      expect(screen.getByText(/formula/i)).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should show error when field name is empty', async () => {
      const { toast } = await import('sonner');
      
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Set only field size, leave name empty
      const sizeInput = screen.getByLabelText(/field size/i);
      fireEvent.change(sizeInput, { target: { value: '100' } });

      // Click calculate
      const calculateBtn = screen.getByText('Calculate Credits');
      fireEvent.click(calculateBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please fill in all required fields');
      });
    });

    it('should show error when field size is zero', async () => {
      const { toast } = await import('sonner');
      
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Set only field name, leave size at 0
      const nameInput = screen.getByLabelText(/field name/i);
      fireEvent.change(nameInput, { target: { value: 'North Field' } });

      // Click calculate
      const calculateBtn = screen.getByText('Calculate Credits');
      fireEvent.click(calculateBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please fill in all required fields');
      });
    });

    it('should accept valid field size values', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      const sizeInput = screen.getByLabelText(/field size/i) as HTMLInputElement;
      fireEvent.change(sizeInput, { target: { value: '150.5' } });

      expect(sizeInput.value).toBe('150.5');
    });

    it('should accept soil organic matter percentage between 0 and 100', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      const somInput = screen.getByLabelText(/soil organic matter/i) as HTMLInputElement;
      
      // Test valid value
      fireEvent.change(somInput, { target: { value: '3.5' } });
      expect(somInput.value).toBe('3.5');
    });
  });

  describe('calculation', () => {
    it('should call edge function with correct parameters', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          success: true,
          credit_record: {
            credits_earned: 12.5,
            field_name: 'North Field',
          },
        },
        error: null,
      } as any);

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      const nameInput = screen.getByLabelText(/field name/i);
      const sizeInput = screen.getByLabelText(/field size/i);
      const somInput = screen.getByLabelText(/soil organic matter/i);

      fireEvent.change(nameInput, { target: { value: 'North Field' } });
      fireEvent.change(sizeInput, { target: { value: '100' } });
      fireEvent.change(somInput, { target: { value: '3.5' } });

      // Click calculate
      const calculateBtn = screen.getByText('Calculate Credits');
      fireEvent.click(calculateBtn);

      await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith('carbon-credit-calculator', {
          body: {
            field_name: 'North Field',
            field_size_acres: 100,
            soil_organic_matter: 3.5,
            verification_type: 'self_reported',
          },
        });
      });
    });

    it('should show success message after calculation', async () => {
      const { toast } = await import('sonner');
      
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          success: true,
          credit_record: {
            credits_earned: 15.75,
            field_name: 'Test Field',
          },
        },
        error: null,
      } as any);

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'Test Field' } });
      fireEvent.change(screen.getByLabelText(/field size/i), { target: { value: '200' } });

      // Click calculate
      fireEvent.click(screen.getByText('Calculate Credits'));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('15.75')
        );
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should handle calculation error gracefully', async () => {
      const { toast } = await import('sonner');
      
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { message: 'Calculation failed' },
      } as any);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/field size/i), { target: { value: '50' } });

      // Click calculate
      fireEvent.click(screen.getByText('Calculate Credits'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should show loading state during calculation', async () => {
      // Create a promise that won't resolve immediately
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      vi.mocked(supabase.functions.invoke).mockReturnValue(promise as any);

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/field size/i), { target: { value: '50' } });

      // Click calculate
      fireEvent.click(screen.getByText('Calculate Credits'));

      // Button should be disabled during calculation
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /calculate/i });
        expect(button).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise!({
        data: { success: true, credit_record: { credits_earned: 10 } },
        error: null,
      });
    });
  });

  describe('feature access', () => {
    it('should check feature access before calculation', async () => {
      const mockCheckFeatureAccess = vi.fn().mockResolvedValue({ canUse: true });
      
      const { useSubscription } = await import('@/hooks/useSubscription');
      vi.mocked(useSubscription).mockReturnValue({
        checkFeatureAccess: mockCheckFeatureAccess,
        subscription: { tier: 'pro' } as any,
        loading: false,
        usage: {},
        canUseFeature: vi.fn().mockResolvedValue(true),
        incrementUsage: vi.fn().mockResolvedValue(true),
        showUpgradePrompt: vi.fn(),
        refreshSubscription: vi.fn(),
      });

      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { success: true, credit_record: { credits_earned: 5 } },
        error: null,
      } as any);

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/field size/i), { target: { value: '50' } });

      // Click calculate
      fireEvent.click(screen.getByText('Calculate Credits'));

      await waitFor(() => {
        expect(mockCheckFeatureAccess).toHaveBeenCalledWith('carbon_credits');
      });
    });

    it('should show one-time purchase modal when access denied', async () => {
      const mockShowModal = vi.fn().mockReturnValue(true);
      const mockCheckFeatureAccess = vi.fn().mockResolvedValue({ 
        canUse: false, 
        reason: 'Feature limit exceeded' 
      });
      
      const { useSubscription } = await import('@/hooks/useSubscription');
      vi.mocked(useSubscription).mockReturnValue({
        checkFeatureAccess: mockCheckFeatureAccess,
        subscription: { tier: 'free' } as any,
        loading: false,
        usage: {},
        canUseFeature: vi.fn().mockResolvedValue(false),
        incrementUsage: vi.fn(),
        showUpgradePrompt: vi.fn(),
        refreshSubscription: vi.fn(),
      });

      const { useOneTimePurchase } = await import('@/hooks/useOneTimePurchase');
      vi.mocked(useOneTimePurchase).mockReturnValue({
        isModalOpen: false,
        currentFeature: null,
        shouldShowOneTimePurchase: vi.fn().mockReturnValue(true),
        showOneTimePurchaseModal: mockShowModal,
        closeModal: vi.fn(),
        getFeatureConfig: vi.fn().mockReturnValue({
          title: 'Carbon Credits',
          description: 'Test',
          price: 9.99,
          originalPrice: 14.99,
          benefits: [],
        }),
      });

      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/field size/i), { target: { value: '50' } });

      // Click calculate
      fireEvent.click(screen.getByText('Calculate Credits'));

      await waitFor(() => {
        expect(mockShowModal).toHaveBeenCalledWith('carbon_credits');
      });
    });
  });

  describe('dialog controls', () => {
    it('should call onClose when cancel button clicked', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      const cancelBtn = screen.getByText('Cancel');
      fireEvent.click(cancelBtn);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when X button clicked', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Find the X button (close icon)
      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons.find(btn => btn.querySelector('svg.lucide-x'));
      
      if (xButton) {
        fireEvent.click(xButton);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe('verification type selection', () => {
    it('should default to self_reported verification type', () => {
      render(
        <CarbonCreditCalculator onClose={mockOnClose} onSuccess={mockOnSuccess} />,
        { wrapper: createWrapper() }
      );

      // Check the select value displays "Self Reported"
      expect(screen.getByText('Self Reported')).toBeInTheDocument();
    });
  });
});
