import { vi } from "vitest";

// Mock user types
export interface MockUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  aud: string;
  role?: string;
}

export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: MockUser;
}

export interface MockProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  subscription_starts_at: string | null;
  subscription_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

// Factory functions
export const createMockUser = (overrides?: Partial<MockUser>): MockUser => ({
  id: "test-user-id-123",
  email: "test@example.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  role: "authenticated",
  ...overrides,
});

export const createMockSession = (overrides?: Partial<MockSession>): MockSession => {
  const user = createMockUser(overrides?.user);
  return {
    access_token: "mock-access-token-xyz",
    refresh_token: "mock-refresh-token-abc",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user,
    ...overrides,
  };
};

export const createMockProfile = (overrides?: Partial<MockProfile>): MockProfile => ({
  id: "profile-id-123",
  user_id: "test-user-id-123",
  email: "test@example.com",
  full_name: "Test User",
  subscription_tier: "free",
  subscription_status: null,
  trial_ends_at: null,
  subscription_starts_at: null,
  subscription_ends_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTrialUser = (daysRemaining: number): { user: MockUser; profile: MockProfile } => {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + daysRemaining);
  
  const user = createMockUser();
  const profile = createMockProfile({
    user_id: user.id,
    subscription_tier: "free",
    trial_ends_at: trialEnd.toISOString(),
  });
  
  return { user, profile };
};

export const createSubscribedUser = (
  tier: "starter" | "pro" | "enterprise"
): { user: MockUser; profile: MockProfile } => {
  const subEnd = new Date();
  subEnd.setMonth(subEnd.getMonth() + 1);
  
  const user = createMockUser();
  const profile = createMockProfile({
    user_id: user.id,
    subscription_tier: tier,
    subscription_status: "active",
    subscription_starts_at: new Date().toISOString(),
    subscription_ends_at: subEnd.toISOString(),
  });
  
  return { user, profile };
};

// Mock API Key types
export interface MockAPIKey {
  id: string;
  key_name: string;
  subscription_tier: string;
  rate_limit: number;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  permissions: Record<string, unknown>;
}

export const createMockAPIKey = (overrides?: Partial<MockAPIKey>): MockAPIKey => ({
  id: "api-key-id-123",
  key_name: "Sandbox API Key",
  subscription_tier: "free",
  rate_limit: 100,
  is_active: true,
  created_at: new Date().toISOString(),
  last_used_at: null,
  permissions: { endpoints: ["sandbox-demo", "get-soil-data"] },
  ...overrides,
});

// Supabase mock configuration helpers
export const configureAuthenticatedSession = (
  mockClient: any,
  session: MockSession | null = createMockSession()
) => {
  mockClient.auth.getSession.mockResolvedValue({
    data: { session },
    error: null,
  });
  
  mockClient.auth.getUser.mockResolvedValue({
    data: { user: session?.user ?? null },
    error: null,
  });
};

export const configureUnauthenticatedSession = (mockClient: any) => {
  mockClient.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });
  
  mockClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  });
};

export const configureAuthStateChange = (
  mockClient: any,
  callback?: (event: string, session: MockSession | null) => void
) => {
  mockClient.auth.onAuthStateChange.mockImplementation(
    (cb: (event: string, session: MockSession | null) => void) => {
      if (callback) {
        // Allow tests to trigger auth state changes
        callback("INITIAL_SESSION", createMockSession());
      }
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    }
  );
};
