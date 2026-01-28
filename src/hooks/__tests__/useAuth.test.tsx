import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { mockSupabaseClient, resetSupabaseMocks } from "@/test/mocks/supabase";
import {
  createMockUser,
  createMockSession,
  createMockProfile,
  configureAuthenticatedSession,
  configureUnauthenticatedSession,
} from "@/test/authHelpers";

// Import the hook after mocking
import { useAuth, AuthProvider } from "../useAuth";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("useAuth Hook", () => {
  beforeEach(() => {
    resetSupabaseMocks();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("returns loading true initially while checking session", () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Initial state should be loading
      expect(result.current.loading).toBe(true);
    });

    it("returns null user when not authenticated", async () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        // Simulate auth state change with no session
        setTimeout(() => callback("INITIAL_SESSION", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  describe("Authenticated State", () => {
    it("returns user and session when authenticated", async () => {
      const mockSession = createMockSession();
      configureAuthenticatedSession(mockSupabaseClient, mockSession);
      
      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_IN", mockSession), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeTruthy();
      expect(result.current.session).toBeTruthy();
      expect(result.current.user?.email).toBe("test@example.com");
    });

    it("updates state on auth state change", async () => {
      let authCallback: ((event: string, session: any) => void) | null = null;
      
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        setTimeout(() => callback("INITIAL_SESSION", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();

      // Simulate sign in
      const mockSession = createMockSession();
      configureAuthenticatedSession(mockSupabaseClient, mockSession);
      
      act(() => {
        authCallback?.("SIGNED_IN", mockSession);
      });

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });
    });
  });

  describe("Sign In", () => {
    it("calls signInWithPassword with correct credentials", async () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: createMockUser(), session: createMockSession() },
        error: null,
      });
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.signIn("user@test.com", "password123");
      });

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123",
      });
    });

    it("returns error on failed sign in", async () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      });
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let signInResult: any;
      await act(async () => {
        signInResult = await result.current.signIn("bad@test.com", "wrong");
      });

      expect(signInResult?.error).toBeTruthy();
    });
  });

  describe("Sign Up", () => {
    it("calls signUp with email and password", async () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: createMockUser(), session: null },
        error: null,
      });
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.signUp("new@test.com", "newpass123");
      });

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@test.com",
          password: "newpass123",
        })
      );
    });
  });

  describe("Sign Out", () => {
    it("calls signOut and clears session", async () => {
      const mockSession = createMockSession();
      configureAuthenticatedSession(mockSupabaseClient, mockSession);
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
      
      let authCallback: ((event: string, session: any) => void) | null = null;
      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback;
        setTimeout(() => callback("SIGNED_IN", mockSession), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      // Simulate sign out
      configureUnauthenticatedSession(mockSupabaseClient);
      
      await act(async () => {
        await result.current.signOut();
        authCallback?.("SIGNED_OUT", null);
      });

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe("Session Persistence", () => {
    it("checks for existing session on mount", async () => {
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("unsubscribes from auth state changes on unmount", async () => {
      const unsubscribeFn = vi.fn();
      configureUnauthenticatedSession(mockSupabaseClient);
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeFn } },
      });

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      unmount();

      expect(unsubscribeFn).toHaveBeenCalled();
    });
  });
});
