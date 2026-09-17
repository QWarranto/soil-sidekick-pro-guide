import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeSyncOperation,
  executeBatchSync,
  isSyncableTable,
  getSyncableTables,
  syncCreate,
  syncUpdate,
  syncDelete,
} from '@/services/offlineDataSync';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const createMockChain = () => {
    const mockChain: any = {};
    mockChain.insert = vi.fn(() => mockChain);
    mockChain.update = vi.fn(() => mockChain);
    mockChain.delete = vi.fn(() => mockChain);
    mockChain.select = vi.fn(() => mockChain);
    mockChain.eq = vi.fn(() => mockChain);
    mockChain.single = vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null });
    return mockChain;
  };

  const mockChain = createMockChain();

  return {
    supabase: {
      from: vi.fn(() => {
        // Reset chain for each from() call so tests don't interfere
        Object.assign(mockChain, createMockChain());
        mockChain.single.mockResolvedValue({ data: { id: 'test-id' }, error: null });
        return mockChain;
      }),
    },
  };
});

describe('Offline Data Sync Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isSyncableTable', () => {
    it('returns true for registered tables', () => {
      expect(isSyncableTable('fields')).toBe(true);
      expect(isSyncableTable('user_tasks')).toBe(true);
      expect(isSyncableTable('carbon_credits')).toBe(true);
      expect(isSyncableTable('plant_query_history')).toBe(true);
      expect(isSyncableTable('prescription_maps')).toBe(true);
      expect(isSyncableTable('kpi_targets')).toBe(true);
    });

    it('returns false for unregistered tables', () => {
      expect(isSyncableTable('profiles')).toBe(false);
      expect(isSyncableTable('auth_security_log')).toBe(false);
      expect(isSyncableTable('api_keys')).toBe(false);
      expect(isSyncableTable('nonexistent_table')).toBe(false);
    });
  });

  describe('getSyncableTables', () => {
    it('returns a non-empty array of table names', () => {
      const tables = getSyncableTables();
      expect(tables.length).toBeGreaterThan(0);
      expect(tables).toContain('fields');
      expect(tables).toContain('user_tasks');
    });
  });

  describe('syncCreate', () => {
    it('rejects unsyncable tables', async () => {
      const result = await syncCreate('api_keys', { name: 'test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('not registered');
    });

    it('succeeds for syncable tables', async () => {
      const result = await syncCreate('fields', { name: 'Test Field', boundary_coordinates: {} });
      expect(result.success).toBe(true);
    });
  });

  describe('syncUpdate', () => {
    it('rejects unsyncable tables', async () => {
      const result = await syncUpdate('profiles', { id: '123', name: 'test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('not registered');
    });

    it('rejects updates without an id', async () => {
      const result = await syncUpdate('fields', { name: 'test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('requires an id');
    });

    it('succeeds for valid update operations', async () => {
      const result = await syncUpdate('fields', { id: '123', name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('syncDelete', () => {
    it('rejects unsyncable tables', async () => {
      const result = await syncDelete('cost_tracking', { id: '123' });
      expect(result.success).toBe(false);
    });

    it('rejects deletes without an id', async () => {
      const result = await syncDelete('fields', {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('requires an id');
    });

    it('succeeds for valid delete operations', async () => {
      const result = await syncDelete('fields', { id: '123' });
      expect(result.success).toBe(true);
    });
  });

  describe('executeSyncOperation', () => {
    it('routes create operations correctly', async () => {
      const result = await executeSyncOperation({
        table: 'fields',
        type: 'create',
        data: { name: 'Test', boundary_coordinates: {} },
      });
      expect(result.success).toBe(true);
    });

    it('routes update operations correctly', async () => {
      const result = await executeSyncOperation({
        table: 'fields',
        type: 'update',
        data: { id: '123', name: 'Updated' },
      });
      expect(result.success).toBe(true);
    });

    it('rejects unknown operation types', async () => {
      const result = await executeSyncOperation({
        table: 'fields',
        type: 'upsert' as any,
        data: {},
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation type');
    });

    it('rejects operations on unsyncable tables', async () => {
      const result = await executeSyncOperation({
        table: 'auth_security_log',
        type: 'create',
        data: { event_type: 'test' },
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('not registered');
    });
  });

  describe('executeBatchSync', () => {
    it('processes multiple operations and reports counts', async () => {
      const operations = [
        { table: 'fields', type: 'create' as const, data: { name: 'A', boundary_coordinates: {} } },
        { table: 'fields', type: 'create' as const, data: { name: 'B', boundary_coordinates: {} } },
        { table: 'api_keys', type: 'create' as const, data: { name: 'C' } }, // should fail — unsyncable
      ];

      const { results, successCount, failCount } = await executeBatchSync(operations);

      expect(results).toHaveLength(3);
      expect(successCount).toBe(2);
      expect(failCount).toBe(1);
      expect(results[2].success).toBe(false);
    });

    it('handles empty batch gracefully', async () => {
      const { results, successCount, failCount } = await executeBatchSync([]);
      expect(results).toHaveLength(0);
      expect(successCount).toBe(0);
      expect(failCount).toBe(0);
    });
  });
});
