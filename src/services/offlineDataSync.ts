import { supabase } from '@/integrations/supabase/client';

/**
 * Unified offline data synchronization service.
 * 
 * This is the SINGLE canonical sync executor for all offline operations.
 * All tables that support offline sync must be registered in SYNCABLE_TABLES.
 */

/** Tables that are safe for offline sync operations */
const SYNCABLE_TABLES = [
  'fields',
  'user_tasks',
  'carbon_credits',
  'plant_query_history',
  'prescription_maps',
  'kpi_targets',
  'kpi_history',
  'environmental_impact_scores',
  'planting_optimizations',
  'adapt_field_boundaries',
] as const;

export type SyncableTable = typeof SYNCABLE_TABLES[number];

export interface SyncOperation {
  table: string;
  type: 'create' | 'update' | 'delete';
  data: any;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Validate that a table is allowed for offline sync
 */
export const isSyncableTable = (table: string): table is SyncableTable => {
  return SYNCABLE_TABLES.includes(table as SyncableTable);
};

/**
 * Get the list of all syncable tables
 */
export const getSyncableTables = (): readonly string[] => SYNCABLE_TABLES;

/**
 * Sync a create operation to Supabase
 */
export const syncCreate = async (table: string, data: any): Promise<SyncResult> => {
  if (!isSyncableTable(table)) {
    return { success: false, error: `Table "${table}" is not registered for offline sync` };
  }

  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to sync create: ${error.message}` };
    }

    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: `Sync create exception: ${err instanceof Error ? err.message : String(err)}` };
  }
};

/**
 * Sync an update operation to Supabase
 */
export const syncUpdate = async (table: string, data: any): Promise<SyncResult> => {
  if (!isSyncableTable(table)) {
    return { success: false, error: `Table "${table}" is not registered for offline sync` };
  }

  const { id, ...updateData } = data;
  
  if (!id) {
    return { success: false, error: 'Update operation requires an id field' };
  }

  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to sync update: ${error.message}` };
    }

    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: `Sync update exception: ${err instanceof Error ? err.message : String(err)}` };
  }
};

/**
 * Sync a delete operation to Supabase
 */
export const syncDelete = async (table: string, data: any): Promise<SyncResult> => {
  if (!isSyncableTable(table)) {
    return { success: false, error: `Table "${table}" is not registered for offline sync` };
  }

  const { id } = data;
  
  if (!id) {
    return { success: false, error: 'Delete operation requires an id field' };
  }

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: `Failed to sync delete: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: `Sync delete exception: ${err instanceof Error ? err.message : String(err)}` };
  }
};

/**
 * Execute a sync operation based on type.
 * Returns a structured result instead of throwing.
 */
export const executeSyncOperation = async (operation: SyncOperation): Promise<SyncResult> => {
  switch (operation.type) {
    case 'create':
      return syncCreate(operation.table, operation.data);
    case 'update':
      return syncUpdate(operation.table, operation.data);
    case 'delete':
      return syncDelete(operation.table, operation.data);
    default:
      return { success: false, error: `Unknown operation type: ${operation.type}` };
  }
};

/**
 * Execute a batch of sync operations in sequence.
 * Returns per-item results for granular error handling.
 */
export const executeBatchSync = async (
  operations: SyncOperation[]
): Promise<{ results: SyncResult[]; successCount: number; failCount: number }> => {
  const results: SyncResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const op of operations) {
    const result = await executeSyncOperation(op);
    results.push(result);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  return { results, successCount, failCount };
};
