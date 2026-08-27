// Critical Tests for trial-auth endpoint
// Priority: HIGH - Authentication gateway, production risk

import { createMockSupabaseClient, createTestUser, SUBSCRIPTION_TIERS, measureResponseTime, PERFORMANCE_THRESHOLDS } from '../__tests__/setup';

describe('POST /trial-auth', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
  });

  describe('Basic Authentication', () => {
    test('should create trial account for valid email', async () => {
      const testEmail = 'trial@example.com';
      const mockUser = createTestUser({ email: testEmail });
      
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'trial-token-123' } },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.access_token).toBe('trial-token-123');
      expect(data.data.user.subscription_tier).toBe('trial');
    });

    test('should return 400 for missing email', async () => {
      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('MISSING_EMAIL');
      expect(data.error.message).toBe('Email address is required');
    });

    test('should return 400 for invalid email format', async () => {
      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email' })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('INVALID_EMAIL');
      expect(data.error.message).toBe('Valid email address is required');
    });
  });

  describe('Trial Account Limitations', () => {
    test('should enforce trial account limits', async () => {
      const testEmail = 'trial@example.com';
      const mockUser = createTestUser({ 
        email: testEmail,
        subscription_tier: 'trial',
        api_calls_count: 95, // Close to limit
        api_calls_limit: 100
      });
      
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'trial-token-123' } },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.user.api_calls_remaining).toBe(5);
      expect(data.data.user.subscription_tier).toBe('trial');
    });

    test('should block trial accounts exceeding limits', async () => {
      const testEmail = 'trial@example.com';
      const mockUser = createTestUser({ 
        email: testEmail,
        subscription_tier: 'trial',
        api_calls_count: 100, // At limit
        api_calls_limit: 100
      });
      
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          };
        }
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error.code).toBe('TRIAL_LIMIT_EXCEEDED');
      expect(data.error.message).toBe('Trial limit exceeded. Please upgrade your subscription.');
    });
  });

  describe('Performance Requirements', () => {
    test('should respond within performance thresholds', async () => {
      const testEmail = 'trial@example.com';
      const mockUser = createTestUser({ email: testEmail });
      
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'trial-token-123' } },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const { responseTime } = await measureResponseTime(async () => {
        return await fetch('/trial-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail })
        });
      });

      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.WARNING_MS);
    });

    test('should handle concurrent trial requests', async () => {
      const testEmails = ['trial1@example.com', 'trial2@example.com', 'trial3@example.com'];
      
      mockSupabase.auth.signIn.mockImplementation((credentials) => {
        const email = credentials.email;
        return Promise.resolve({
          data: { 
            user: createTestUser({ email }), 
            session: { access_token: `trial-token-${email}` } 
          },
          error: null
        });
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: createTestUser(),
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const startTime = performance.now();
      const requests = testEmails.map(email => 
        fetch('/trial-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
      );
      
      const responses = await Promise.all(requests);
      const endTime = performance.now();
      
      const allSuccessful = responses.every(r => r.status === 200);
      const totalTime = endTime - startTime;
      const averageTime = totalTime / testEmails.length;

      expect(allSuccessful).toBe(true);
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.WARNING_MS);
    });
  });

  describe('Security Validation', () => {
    test('should prevent email enumeration attacks', async () => {
      const existingEmail = 'existing@example.com';
      
      // Simulate existing user
      mockSupabase.auth.signIn.mockRejectedValue({
        error: { message: 'User already exists' }
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: existingEmail })
      });

      const data = await response.json();

      // Should not reveal whether email exists
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.message).toMatch(/check your email|verification sent/i);
    });

    test('should sanitize error messages', async () => {
      mockSupabase.auth.signIn.mockRejectedValue({
        error: { message: 'Database connection failed: Invalid credentials for user postgres@localhost' }
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.message).not.toContain('Database connection failed');
      expect(data.error.message).not.toContain('postgres@localhost');
      expect(data.error.message).toMatch(/temporarily unavailable|try again/i);
    });

    test('should validate rate limiting', async () => {
      const testEmail = 'trial@example.com';
      
      // Simulate rate limit exceeded
      mockSupabase.auth.signIn.mockRejectedValue({
        error: { message: 'Rate limit exceeded' }
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(data.error.retry_after).toBeDefined();
    });
  });

  describe('Audit Logging', () => {
    test('should log trial account creation attempts', async () => {
      const testEmail = 'trial@example.com';
      const mockUser = createTestUser({ email: testEmail });
      
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'trial-token-123' } },
        error: null
      });

      const auditLog: any[] = [];
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'audit_logs') {
          return {
            insert: jest.fn().mockImplementation((log) => {
              auditLog.push(log);
              return { error: null };
            })
          };
        }
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      expect(auditLog.length).toBeGreaterThan(0);
      expect(auditLog[0]).toMatchObject({
        action: 'TRIAL_AUTH_REQUEST',
        email: testEmail,
        timestamp: expect.any(String)
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection failures', async () => {
      mockSupabase.auth.signIn.mockRejectedValue(new Error('Connection timeout'));

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });

      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error.code).toBe('SERVICE_UNAVAILABLE');
      expect(data.error.retry_after).toBeDefined();
    });

    test('should handle authentication service failures', async () => {
      mockSupabase.auth.signIn.mockRejectedValue({
        error: { message: 'Auth service unavailable' }
      });

      const response = await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });

      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error.code).toBe('AUTH_SERVICE_UNAVAILABLE');
      expect(data.error.message).toMatch(/temporarily unavailable/i);
    });
  });

  describe('Subscription Tier Validation', () => {
    test('should create trial user with correct tier limitations', async () => {
      const testEmail = 'trial@example.com';
      
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { 
          user: createTestUser({ email: testEmail }), 
          session: { access_token: 'trial-token-123' } 
        },
        error: null
      });

      const createdProfile: any = {};
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              Object.assign(createdProfile, data);
              return { select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: data, error: null }) };
            }),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis()
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      await fetch('/trial-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      expect(createdProfile.subscription_tier).toBe('trial');
      expect(createdProfile.api_calls_limit).toBe(100);
      expect(createdProfile.features).toEqual(['basic-soil-analysis']);
    });
  });
});