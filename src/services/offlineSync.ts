import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';

interface PendingSync {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

const PENDING_SYNC_KEY = 'pending_sync_queue';

export class OfflineSyncService {
  // Add operation to sync queue
  static async addToSyncQueue(
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any
  ) {
    const pendingSync: PendingSync = {
      id: crypto.randomUUID(),
      table,
      operation,
      data,
      timestamp: Date.now()
    };

    const { value } = await Preferences.get({ key: PENDING_SYNC_KEY });
    const queue: PendingSync[] = value ? JSON.parse(value) : [];
    queue.push(pendingSync);

    await Preferences.set({
      key: PENDING_SYNC_KEY,
      value: JSON.stringify(queue)
    });

    console.log('Added to sync queue:', pendingSync);
  }

  // Process sync queue
  static async processSyncQueue() {
    const { value } = await Preferences.get({ key: PENDING_SYNC_KEY });
    if (!value) return { success: true, synced: 0, failed: 0 };

    const queue: PendingSync[] = JSON.parse(value);
    let synced = 0;
    let failed = 0;
    const failedItems: PendingSync[] = [];

    for (const item of queue) {
      try {
        await this.syncItem(item);
        synced++;
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        failedItems.push(item);
        failed++;
      }
    }

    // Update queue with failed items
    await Preferences.set({
      key: PENDING_SYNC_KEY,
      value: JSON.stringify(failedItems)
    });

    return { success: failed === 0, synced, failed };
  }

  // Sync individual item
  private static async syncItem(item: PendingSync) {
    const { table, operation, data } = item;

    // Type-safe table operations - only sync tables that are safe for offline sync
    if (table === 'fields') {
      switch (operation) {
        case 'insert':
          await supabase.from('fields').insert(data);
          break;
        case 'update':
          await supabase.from('fields').update(data).eq('id', data.id);
          break;
        case 'delete':
          await supabase.from('fields').delete().eq('id', data.id);
          break;
      }
    } else if (table === 'user_tasks') {
      switch (operation) {
        case 'insert':
          await supabase.from('user_tasks').insert(data);
          break;
        case 'update':
          await supabase.from('user_tasks').update(data).eq('id', data.id);
          break;
        case 'delete':
          await supabase.from('user_tasks').delete().eq('id', data.id);
          break;
      }
    }
    // Add more tables as needed for offline sync
  }

  // Get pending sync count
  static async getPendingSyncCount(): Promise<number> {
    const { value } = await Preferences.get({ key: PENDING_SYNC_KEY });
    if (!value) return 0;
    const queue: PendingSync[] = JSON.parse(value);
    return queue.length;
  }

  // Clear sync queue
  static async clearSyncQueue() {
    await Preferences.remove({ key: PENDING_SYNC_KEY });
  }
}
