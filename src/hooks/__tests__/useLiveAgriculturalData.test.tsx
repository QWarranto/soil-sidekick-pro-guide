import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockInvoke = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Import after mocking
import { useLiveAgriculturalData } from "@/hooks/useLiveAgriculturalData";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLiveAgriculturalData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with null data and not loading", () => {
    const { result } = renderHook(() => useLiveAgriculturalData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch data successfully", async () => {
    const mockResponse = {
      weather: {
        temperature_avg: 22,
        precipitation_total: 5,
        humidity: 65,
        forecast: [],
        source: "NOAA",
        last_updated: new Date().toISOString(),
      },
      soil: {
        health_index: 85,
        moisture_level: 55,
        ph_level: 6.5,
        organic_matter: 3.2,
        trends: [],
        source: "USDA",
        last_updated: new Date().toISOString(),
      },
      sources: ["NOAA", "USDA"],
      cache_status: "fresh",
    };

    mockInvoke.mockResolvedValueOnce({
      data: mockResponse,
      error: null,
    });

    const { result } = renderHook(() => useLiveAgriculturalData(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.refreshData("17031");
    });

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.weather.temperature_avg).toBe(22);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors gracefully", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: { message: "API rate limit exceeded" },
    });

    const { result } = renderHook(() => useLiveAgriculturalData(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.refreshData("17031");
    });

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error).toContain("rate limit");
  });

  it("should use default county FIPS when none provided", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: { weather: {}, soil: {}, sources: [] },
      error: null,
    });

    const { result } = renderHook(() => useLiveAgriculturalData(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.refreshData();
    });

    expect(mockInvoke).toHaveBeenCalledWith(
      "live-agricultural-data",
      expect.objectContaining({
        body: expect.objectContaining({
          county_fips: "17031", // Default Cook County
        }),
      })
    );
  });

  it("should calculate data age correctly", () => {
    const { result } = renderHook(() => useLiveAgriculturalData(), {
      wrapper: createWrapper(),
    });

    // Initially should be null
    expect(result.current.getDataAge()).toBeNull();
  });
});
