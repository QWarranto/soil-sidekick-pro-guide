import { supabase } from '@/integrations/supabase/client';

/**
 * Sync service for handling offline data synchronization with Supabase
 */

export interface SyncOperation {
  table: string;
  type: 'create' | 'update' | 'delete';
  data: any;
}

/**
 * Sync a create operation to Supabase
 */
export const syncCreate = async (table: string, data: any) => {
  const { data: result, error } = await supabase
    .from(table as any)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to sync create: ${error.message}`);
  }

  return result;
};

/**
 * Sync an update operation to Supabase
 */
export const syncUpdate = async (table: string, data: any) => {
  const { id, ...updateData } = data;
  
  if (!id) {
    throw new Error('Update operation requires an id field');
  }

  const { data: result, error } = await supabase
    .from(table as any)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to sync update: ${error.message}`);
  }

  return result;
};

/**
 * Sync a delete operation to Supabase
 */
export const syncDelete = async (table: string, data: any) => {
  const { id } = data;
  
  if (!id) {
    throw new Error('Delete operation requires an id field');
  }

  const { error } = await supabase
    .from(table as any)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to sync delete: ${error.message}`);
  }

  return { success: true };
};

/**
 * Execute a sync operation based on type
 */
export const executeSyncOperation = async (operation: SyncOperation) => {
  switch (operation.type) {
    case 'create':
      return syncCreate(operation.table, operation.data);
    case 'update':
      return syncUpdate(operation.table, operation.data);
    case 'delete':
      return syncDelete(operation.table, operation.data);
    default:
      throw new Error(`Unknown operation type: ${operation.type}`);
  }
};
