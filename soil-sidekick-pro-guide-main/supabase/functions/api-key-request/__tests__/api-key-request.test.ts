// Critical Tests for api-key-request endpoint
// Priority: HIGH - API access control, subscription tier validation

import { createMockSupabaseClient, createTestUser, SUBSCRIPTION_TIERS, measureResponseTime, PERFORMANCE_THRESHOLDS } from '../__tests__/setup';

describe('POST /api-key-request', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
  });

  describe('Basic API Key Generation', () => {
    test('should generate API key for authenticated user', async () => {
      const mockUser = createTestUser({ 
        id: 'user-123',
        subscription_tier: SUBSCRIPTION_TIERS.BASIC 
      });
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'key-123',
                key_prefix: 'sk_test_',
                user_id: mockUser.id,
                subscription_tier: mockUser.subscription_tier,
                created_at: new Date().toISOString()
              },
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Test API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.api_key).toMatch(/^sk_test_[a-zA-Z0-9]+$/);
      expect(data.data.key_prefix).toBe('sk_test_');
    });

    test('should require authentication', async () => {
      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('UNAUTHORIZED');
      expect(data.error.message).toBe('Valid authentication required');
    });

    test('should require API key name', async () => {
      const mockUser = createTestUser();
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('MISSING_KEY_NAME');
      expect(data.error.message).toBe('API key name is required');
    });
  });

  describe('Subscription Tier Validation', () => {
    test('should enforce API key limits by subscription tier', async () => {
      const basicUser = createTestUser({ 
        subscription_tier: SUBSCRIPTION_TIERS.BASIC,
        api_keys_count: 1,
        api_keys_limit: 2
      });
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: basicUser },
        error: null
      });

      // Check existing key count
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            count: jest.fn().mockResolvedValue({
              data: { count: 1 },
              error: null
            })
          };
        }
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), count: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Second API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.remaining_keys).toBe(0); // 2 limit - 2 total = 0
    });

    test('should block API key creation when limit exceeded', async () => {
      const basicUser = createTestUser({ 
        subscription_tier: SUBSCRIPTION_TIERS.BASIC,
        api_keys_count: 2,
        api_keys_limit: 2
      });
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: basicUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            count: jest.fn().mockResolvedValue({
              data: { count: 2 },
              error: null
            })
          };
        }
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), count: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Third API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error.code).toBe('API_KEY_LIMIT_EXCEEDED');
      expect(data.error.message).toBe('API key limit exceeded for your subscription tier');
    });

    test('should allow unlimited keys for enterprise users', async () => {
      const enterpriseUser = createTestUser({ 
        subscription_tier: SUBSCRIPTION_TIERS.ENTERPRISE,
        api_keys_count: 10,
        api_keys_limit: null // Unlimited
      });
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: enterpriseUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'enterprise-key-123',
                key_prefix: 'sk_enterprise_',
                user_id: enterpriseUser.id,
                subscription_tier: SUBSCRIPTION_TIERS.ENTERPRISE,
                created_at: new Date().toISOString()
              },
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Enterprise API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.api_key).toMatch(/^sk_enterprise_[a-zA-Z0-9]+$/);
      expect(data.data.subscription_tier).toBe(SUBSCRIPTION_TIERS.ENTERPRISE);
    });
  });

  describe('API Key Security', () => {
    test('should generate cryptographically secure API keys', async () => {
      const mockUser = createTestUser();
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const generatedKeys: string[] = [];
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              generatedKeys.push(data.key_hash);
              return {
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'key-123',
                    key_prefix: 'sk_test_',
                    user_id: mockUser.id,
                    subscription_tier: mockUser.subscription_tier,
                    created_at: new Date().toISOString()
                  },
                  error: null
                })
              };
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      // Generate multiple keys
      for (let i = 0; i < 5; i++) {
        await fetch('/api-key-request', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer valid-token'
          },
          body: JSON.stringify({ name: `Test Key ${i}` })
        });
      }

      // Verify all keys are unique
      const uniqueKeys = new Set(generatedKeys);
      expect(uniqueKeys.size).toBe(5);
      
      // Verify key format and length
      generatedKeys.forEach(key => {
        expect(key).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hash
      });
    });

    test('should store only hashed API keys in database', async () => {
      const mockUser = createTestUser();
      let storedData: any = {};
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              storedData = data;
              return {
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'key-123',
                    key_prefix: 'sk_test_',
                    user_id: mockUser.id,
                    subscription_tier: mockUser.subscription_tier,
                    created_at: new Date().toISOString()
                  },
                  error: null
                })
              };
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Test API Key' })
      });

      expect(response.status).toBe(200);
      expect(storedData.key_hash).toBeDefined();
      expect(storedData.plain_key).toBeUndefined();
      expect(storedData.key_prefix).toBeDefined();
    });
  });

  describe('Performance Requirements', () => {
    test('should respond within performance thresholds', async () => {
      const mockUser = createTestUser();
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'key-123',
                key_prefix: 'sk_test_',
                user_id: mockUser.id,
                subscription_tier: mockUser.subscription_tier,
                created_at: new Date().toISOString()
              },
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      const { responseTime } = await measureResponseTime(async () => {
        return await fetch('/api-key-request', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer valid-token'
          },
          body: JSON.stringify({ name: 'Performance Test Key' })
        });
      });

      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.WARNING_MS);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection failures', async () => {
      const mockUser = createTestUser();
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockImplementation(() => {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        };
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Test API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error.code).toBe('SERVICE_UNAVAILABLE');
      expect(data.error.message).toMatch(/temporarily unavailable/i);
    });

    test('should handle authentication service failures', async () => {
      mockSupabase.auth.getUser.mockRejectedValue({
        error: { message: 'Authentication service unavailable' }
      });

      const response = await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token'
        },
        body: JSON.stringify({ name: 'Test API Key' })
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('AUTHENTICATION_FAILED');
    });
  });

  describe('Audit Logging', () => {
    test('should log API key creation for security monitoring', async () => {
      const mockUser = createTestUser();
      const auditLog: any[] = [];
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'audit_logs') {
          return {
            insert: jest.fn().mockImplementation((log) => {
              auditLog.push(log);
              return { error: null };
            })
          };
        }
        if (table === 'api_keys') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'key-123',
                key_prefix: 'sk_test_',
                user_id: mockUser.id,
                subscription_tier: mockUser.subscription_tier,
                created_at: new Date().toISOString()
              },
              error: null
            })
          };
        }
        return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
      });

      await fetch('/api-key-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify({ name: 'Audit Test Key' })
      });

      expect(auditLog.length).toBeGreaterThan(0);
      expect(auditLog[0]).toMatchObject({
        action: 'API_KEY_CREATED',
        user_id: mockUser.id,
        subscription_tier: mockUser.subscription_tier,
        timestamp: expect.any(String)
      });
    });
  });
});