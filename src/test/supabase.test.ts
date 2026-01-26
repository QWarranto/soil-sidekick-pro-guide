import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  mockSupabaseClient, 
  resetSupabaseMocks 
} from "@/test/mocks/supabase";

// Mock the supabase client before importing the hook
vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockSupabaseClient,
}));

describe("Supabase Client Mock", () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it("should mock auth.getSession", async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
      data: { 
        session: { 
          user: { id: "test-user-id", email: "test@example.com" },
          access_token: "test-token",
          refresh_token: "test-refresh",
          expires_in: 3600,
          token_type: "bearer",
        } 
      },
      error: null,
    });

    const result = await mockSupabaseClient.auth.getSession();
    expect(result.data.session).toBeDefined();
    expect(result.data.session?.user.id).toBe("test-user-id");
  });

  it("should mock functions.invoke for trial-auth", async () => {
    mockSupabaseClient.functions.invoke.mockResolvedValueOnce({
      data: {
        success: true,
        trialUser: {
          id: "trial-123",
          email: "trial@example.com",
          trial_start: new Date().toISOString(),
          trial_end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          access_count: 1,
        },
        sessionToken: "secure-token-xyz",
      },
      error: null,
    });

    const result = await mockSupabaseClient.functions.invoke("trial-auth", {
      body: { email: "trial@example.com", action: "create_trial" },
    });

    expect(result.error).toBeNull();
    expect(result.data.success).toBe(true);
    expect(result.data.trialUser.email).toBe("trial@example.com");
  });

  it("should mock database queries with chained methods", async () => {
    const mockData = [
      { id: "1", county_name: "Cook", state_code: "IL", fips_code: "17031" },
    ];

    // Re-mock the from chain for this specific test with type assertion
    mockSupabaseClient.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        ilike: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValueOnce({ data: mockData, error: null }),
        }),
      }),
    } as any);

    const result = await (mockSupabaseClient as any)
      .from("counties")
      .select("*")
      .ilike("county_name", "%Cook%")
      .limit(10);

    expect(result.data).toEqual(mockData);
  });

  it("should mock RPC calls", async () => {
    mockSupabaseClient.rpc.mockResolvedValueOnce({
      data: true,
      error: null,
    });

    const result = await mockSupabaseClient.rpc("is_trial_valid" as any, {
      trial_email: "test@example.com",
    } as any);

    expect(result.data).toBe(true);
    expect(result.error).toBeNull();
  });
});
