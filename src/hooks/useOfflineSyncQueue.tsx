import { useState, useEffect, useCallback, useRef } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useToast } from '@/hooks/use-toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { executeSyncOperation, isSyncableTable } from '@/services/offlineDataSync';
import type { SyncResult as DataSyncResult } from '@/services/offlineDataSync';

export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'medium' | 'low';
}

interface SyncResult {
  success: boolean;
  itemId: string;
  error?: string;
}

const SYNC_QUEUE_KEY = 'offline_sync_queue';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

export const useOfflineSyncQueue = () => {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const syncInProgressRef = useRef(false);

  // Load queue from storage
  const loadQueue = useCallback(async () => {
    try {
      const { value } = await Preferences.get({ key: SYNC_QUEUE_KEY });
      if (value) {
        const queueData: SyncQueueItem[] = JSON.parse(value);
        const sortedQueue = sortByPriority(queueData);
        setQueue(sortedQueue);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }, []);

  // Save queue to storage
  const saveQueue = useCallback(async (queueData: SyncQueueItem[]) => {
    try {
      await Preferences.set({
        key: SYNC_QUEUE_KEY,
        value: JSON.stringify(queueData)
      });
      setQueue(queueData);
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }, []);

  // Add item to sync queue with table validation
  const addToQueue = useCallback(async (
    type: 'create' | 'update' | 'delete',
    table: string,
    data: any,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    if (!isSyncableTable(table)) {
      console.error(`[OfflineSync] Table "${table}" is not registered for offline sync`);
      toast({
        title: "Sync error",
        description: `Table "${table}" is not supported for offline sync`,
        variant: "destructive"
      });
      return null;
    }

    const newItem: SyncQueueItem = {
      id: `${table}_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: MAX_RETRY_ATTEMPTS,
      priority
    };

    const updatedQueue = [...queue, newItem];
    await saveQueue(updatedQueue);

    toast({
      title: "Queued for sync",
      description: `${type} operation will sync when online`,
    });

    return newItem.id;
  }, [queue, saveQueue, toast]);

  // Remove item from queue
  const removeFromQueue = useCallback(async (itemId: string) => {
    const updatedQueue = queue.filter(item => item.id !== itemId);
    await saveQueue(updatedQueue);
  }, [queue, saveQueue]);

  // Sync a single item
  const syncItem = useCallback(async (item: SyncQueueItem): Promise<SyncResult> => {
    const result: DataSyncResult = await executeSyncOperation({
      table: item.table,
      type: item.type,
      data: item.data
    });

    if (result.success) {
      return { success: true, itemId: item.id };
    }

    console.error(`[OfflineSync] Failed to sync item ${item.id}:`, result.error);
    return { success: false, itemId: item.id, error: result.error };
  }, []);

  // Process the sync queue
  const processQueue = useCallback(async () => {
    if (!isOnline || syncInProgressRef.current || queue.length === 0) {
      return;
    }

    syncInProgressRef.current = true;
    setIsSyncing(true);
    setSyncProgress({ current: 0, total: queue.length });

    const results: SyncResult[] = [];
    const failedItems: SyncQueueItem[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setSyncProgress({ current: i + 1, total: queue.length });

      const result = await syncItem(item);
      results.push(result);

      if (!result.success) {
        if (item.retryCount < item.maxRetries) {
          failedItems.push({ ...item, retryCount: item.retryCount + 1 });
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          console.error(`[OfflineSync] Max retries reached for item ${item.id}`);
          toast({
            title: "Sync failed",
            description: `Failed to sync ${item.type} on ${item.table}`,
            variant: "destructive"
          });
        }
      }
    }

    await saveQueue(failedItems);

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    if (successCount > 0 || failCount > 0) {
      if (failCount === 0) {
        toast({
          title: "✓ Sync complete",
          description: `Successfully synced ${successCount} item${successCount !== 1 ? 's' : ''}`,
        });
      } else {
        toast({
          title: "Sync completed with errors",
          description: `${successCount} synced, ${failCount} failed`,
          variant: "destructive"
        });
      }
    }

    setIsSyncing(false);
    syncInProgressRef.current = false;
    setSyncProgress({ current: 0, total: 0 });
  }, [isOnline, queue, syncItem, saveQueue, toast]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !syncInProgressRef.current) {
      console.log(`[OfflineSync] Auto-sync triggered: ${queue.length} items in queue`);
      const timer = setTimeout(() => {
        toast({
          title: "Auto-sync started",
          description: `Syncing ${queue.length} pending change${queue.length !== 1 ? 's' : ''}...`,
          duration: 2000
        });
        processQueue();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, queue.length, processQueue, toast]);

  // Load queue on mount
  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Manual sync trigger
  const syncNow = useCallback(async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot sync while offline",
        variant: "destructive"
      });
      return;
    }
    await processQueue();
  }, [isOnline, processQueue, toast]);

  // Clear entire queue
  const clearQueue = useCallback(async () => {
    await saveQueue([]);
    toast({
      title: "Queue cleared",
      description: "All pending sync items removed",
    });
  }, [saveQueue, toast]);

  // Get pending sync count
  const getPendingSyncCount = useCallback(() => queue.length, [queue]);

  // Get queue stats
  const getQueueStats = useCallback(() => ({
    total: queue.length,
    high: queue.filter(item => item.priority === 'high').length,
    medium: queue.filter(item => item.priority === 'medium').length,
    low: queue.filter(item => item.priority === 'low').length,
    byType: {
      create: queue.filter(item => item.type === 'create').length,
      update: queue.filter(item => item.type === 'update').length,
      delete: queue.filter(item => item.type === 'delete').length,
    }
  }), [queue]);

  return {
    queue,
    queueStats: getQueueStats(),
    isSyncing,
    syncProgress,
    addToQueue,
    removeFromQueue,
    syncNow,
    clearQueue,
    getPendingSyncCount,
    hasItemsToSync: queue.length > 0
  };
};

/** Sort queue by priority then timestamp */
function sortByPriority(items: SyncQueueItem[]): SyncQueueItem[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.timestamp - b.timestamp;
  });
}
