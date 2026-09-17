import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APIKeyManager } from "../APIKeyManager";
import { mockSupabaseClient, resetSupabaseMocks } from "@/test/mocks/supabase";
import {
  createMockSession,
  createMockAPIKey,
  configureAuthenticatedSession,
} from "@/test/authHelpers";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock haptic service to prevent console noise
vi.mock("@/services/hapticService", () => ({
  hapticService: {
    light: vi.fn(),
    medium: vi.fn(),
    heavy: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    selectionClick: vi.fn(),
    vibrate: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("APIKeyManager", () => {
  beforeEach(() => {
    resetSupabaseMocks();
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("shows loading spinner while fetching data", () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { container } = renderWithProviders(<APIKeyManager />);
      
      // Check for animate-spin class on any element
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeTruthy();
    });
  });

  describe("Initial Render", () => {
    it("shows Generate Sandbox Key button when no sandbox key exists", async () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: { apiKeys: [], pendingRequests: [] },
        error: null,
      });

      renderWithProviders(<APIKeyManager />);

      await waitFor(() => {
        expect(screen.getByText("Get Instant Sandbox Key")).toBeInTheDocument();
      });
    });

    it("shows Request Paid Tier button", async () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: { apiKeys: [], pendingRequests: [] },
        error: null,
      });

      renderWithProviders(<APIKeyManager />);

      await waitFor(() => {
        expect(screen.getByText("Request Paid Tier")).toBeInTheDocument();
      });
    });

    it("renders API Keys and Upgrade Requests tabs", async () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: { apiKeys: [], pendingRequests: [] },
        error: null,
      });

      renderWithProviders(<APIKeyManager />);

      await waitFor(() => {
        expect(screen.getByText("API Keys")).toBeInTheDocument();
        expect(screen.getByText("Upgrade Requests")).toBeInTheDocument();
      });
    });
  });

  describe("Upgrade Request Dialog", () => {
    it("opens upgrade request dialog when clicking Request Paid Tier", async () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: { apiKeys: [], pendingRequests: [] },
        error: null,
      });

      renderWithProviders(<APIKeyManager />);

      await waitFor(() => {
        expect(screen.getByText("Request Paid Tier")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Request Paid Tier"));

      await waitFor(() => {
        expect(screen.getByText("Request API Key Upgrade")).toBeInTheDocument();
      });
    });

    it("displays tier selection options in upgrade dialog", async () => {
      configureAuthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.functions.invoke.mockResolvedValue({
        data: { apiKeys: [], pendingRequests: [] },
        error: null,
      });

      renderWithProviders(<APIKeyManager />);

      await waitFor(() => {
        fireEvent.click(screen.getByText("Request Paid Tier"));
      });

      await waitFor(() => {
        // Dialog should contain form elements
        expect(screen.getByText("Tier")).toBeInTheDocument();
        expect(screen.getByText("Company Name")).toBeInTheDocument();
        expect(screen.getByText("Use Case")).toBeInTheDocument();
      });
    });
  });

});

