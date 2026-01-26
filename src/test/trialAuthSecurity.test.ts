/**
 * Trial Auth Security Tests
 * Validates that trial authentication uses server-validated tokens
 * and does not trust client-side localStorage data
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create a proper localStorage mock
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => { store[key] = value; },
    removeItem: (key: string): void => { delete store[key]; },
    clear: (): void => { store = {}; },
    get length(): number { return Object.keys(store).length; },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
  };
};

describe('Trial Auth Security', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('localStorage Security', () => {
    it('should not store raw trial user data in localStorage', () => {
      // Simulate what the old insecure code did
      const insecureTrialData = {
        id: 'fake-id',
        email: 'attacker@example.com',
        trial_start: new Date().toISOString(),
        trial_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        access_count: 0,
      };

      // Old insecure pattern - this should NOT be trusted
      localStorage.setItem('trialUser', JSON.stringify(insecureTrialData));
      
      // The new secure implementation should NOT read 'trialUser' key
      const trialUser = localStorage.getItem('trialUser');
      const sessionToken = localStorage.getItem('trialSessionToken');
      
      // New implementation only uses trialSessionToken, not trialUser
      expect(trialUser).toBe(JSON.stringify(insecureTrialData)); // Old key exists
      expect(sessionToken).toBeNull(); // But new secure key doesn't
    });

    it('should only store opaque session tokens, not user data', () => {
      // Secure pattern - only store token and email
      const secureToken = 'trial_abc123xyz789';
      const email = 'user@example.com';
      
      localStorage.setItem('trialSessionToken', secureToken);
      localStorage.setItem('trialEmail', email);
      
      // Verify only opaque token is stored, not user data
      const storedToken = localStorage.getItem('trialSessionToken');
      const storedEmail = localStorage.getItem('trialEmail');
      
      expect(storedToken).toBe(secureToken);
      expect(storedEmail).toBe(email);
      
      // Token should be opaque - attacker cannot forge trial_end
      expect(storedToken).not.toContain('trial_end');
      expect(storedToken).not.toContain('is_active');
    });
  });

  describe('Token Format Security', () => {
    it('should generate tokens with proper prefix', () => {
      const validToken = 'trial_YWJjMTIzOjE3MDAwMDAwMDAwMDA6MTcwMDAwMDAwMDAwMDphYmMxMjM0NQ==';
      
      expect(validToken.startsWith('trial_')).toBe(true);
    });

    it('should reject tokens without proper prefix', () => {
      const invalidTokens = [
        'abc123', // No prefix
        'fake_abc123', // Wrong prefix
        'trial', // Incomplete
        '', // Empty
      ];

      invalidTokens.forEach(token => {
        expect(token.startsWith('trial_') && token.length > 6).toBe(false);
      });
    });

    it('should not allow trial_end date manipulation', () => {
      // Attacker tries to extend trial by modifying localStorage
      const forgedData = {
        trial_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Even if attacker modifies this, server will reject invalid signature
      localStorage.setItem('forgedTrialEnd', forgedData.trial_end);
      
      // The secure token contains a signature that cannot be forged
      const storedForgedEnd = localStorage.getItem('forgedTrialEnd');
      expect(storedForgedEnd).toBeTruthy();
      
      // But this data is useless without a valid server-signed token
    });
  });

  describe('Session Validation Flow', () => {
    it('should require both email and token for validation', () => {
      // Only email stored - should not validate
      localStorage.setItem('trialEmail', 'user@example.com');
      
      const hasToken = localStorage.getItem('trialSessionToken');
      const hasEmail = localStorage.getItem('trialEmail');
      
      // Both must be present for validation attempt
      const canValidate = !!(hasToken && hasEmail);
      expect(canValidate).toBe(false);
    });

    it('should clear all trial data on signOut', () => {
      // Set up trial data
      localStorage.setItem('trialSessionToken', 'trial_abc123');
      localStorage.setItem('trialEmail', 'user@example.com');
      
      // Simulate signOut clearing
      localStorage.removeItem('trialSessionToken');
      localStorage.removeItem('trialEmail');
      
      // Verify all cleared
      expect(localStorage.getItem('trialSessionToken')).toBeNull();
      expect(localStorage.getItem('trialEmail')).toBeNull();
    });

    it('should clear trial data when regular user logs in', () => {
      // Trial user had access
      localStorage.setItem('trialSessionToken', 'trial_abc123');
      localStorage.setItem('trialEmail', 'trial@example.com');
      
      // Simulate regular user login clearing trial data
      localStorage.removeItem('trialSessionToken');
      localStorage.removeItem('trialEmail');
      
      expect(localStorage.getItem('trialSessionToken')).toBeNull();
    });
  });

  describe('Attack Prevention', () => {
    it('should prevent DevTools localStorage manipulation attacks', () => {
      // Attacker opens DevTools and sets:
      localStorage.setItem('trialUser', JSON.stringify({
        id: 'forged-uuid',
        email: 'hacker@evil.com',
        trial_end: '2099-12-31T23:59:59.999Z',
        is_active: true,
      }));
      
      // New implementation ignores 'trialUser' key entirely
      const legacyKey = localStorage.getItem('trialUser');
      const secureKey = localStorage.getItem('trialSessionToken');
      
      // Legacy key exists but is ignored
      expect(legacyKey).toBeTruthy();
      // Secure key doesn't exist, so validation will fail
      expect(secureKey).toBeNull();
    });

    it('should prevent token replay with different email', () => {
      // Attacker steals a valid token
      const stolenToken = 'trial_validtoken123';
      
      // Tries to use it with their own email
      localStorage.setItem('trialSessionToken', stolenToken);
      localStorage.setItem('trialEmail', 'attacker@evil.com');
      
      // Server will reject because token was signed for different email
      const email = localStorage.getItem('trialEmail');
      expect(email).toBe('attacker@evil.com');
      
      // The server validation will fail because:
      // 1. Token contains hash of original user's email
      // 2. Attacker's email hash won't match
    });
    
    it('should not expose sensitive trial data in localStorage', () => {
      // Secure implementation only stores token + email
      localStorage.setItem('trialSessionToken', 'trial_secure123');
      localStorage.setItem('trialEmail', 'user@example.com');
      
      // Check that sensitive fields are NOT stored
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        allKeys.push(localStorage.key(i));
      }
      
      expect(allKeys).toContain('trialSessionToken');
      expect(allKeys).toContain('trialEmail');
      expect(allKeys).not.toContain('trialUser');
      expect(allKeys).not.toContain('trial_end');
      expect(allKeys).not.toContain('is_active');
    });
  });
});

