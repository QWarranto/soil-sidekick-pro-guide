import { useEffect, useState } from 'react';
import { OfflineUsageTracker } from '@/services/offlineUsageTracker';
import { useNetworkStatus } from './useNetworkStatus';

interface OfflineMetrics {
  totalOfflineTime: number;
  offlineSessions: number;
  actionsWhileOffline: number;
  syncSuccessRate: number;
  averageSessionDuration: number;
  mostCommonActions: { type: string; count: number }[];
}

export const useOfflineUsageTracking = () => {
  const { isOnline } = useNetworkStatus();
  const [metrics, setMetrics] = useState<OfflineMetrics | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Start/stop session based on network status
  useEffect(() => {
    const handleNetworkChange = async () => {
      if (!isOnline && !isTracking) {
        await OfflineUsageTracker.startOfflineSession();
        setIsTracking(true);
      } else if (isOnline && isTracking) {
        await OfflineUsageTracker.endOfflineSession();
        setIsTracking(false);
        // Refresh metrics after session ends
        await refreshMetrics();
      }
    };

    handleNetworkChange();
  }, [isOnline, isTracking]);

  // Load metrics on mount
  useEffect(() => {
    refreshMetrics();
  }, []);

  const refreshMetrics = async () => {
    const data = await OfflineUsageTracker.getOfflineMetrics();
    setMetrics(data);
  };

  const trackAction = async (type: 'create' | 'update' | 'delete', table: string) => {
    if (!isOnline) {
      await OfflineUsageTracker.trackOfflineAction(type, table);
      await refreshMetrics();
    }
  };

  const trackSync = async (success: boolean) => {
    await OfflineUsageTracker.trackSyncAttempt(success);
    await refreshMetrics();
  };

  const clearMetrics = async () => {
    await OfflineUsageTracker.clearMetrics();
    await refreshMetrics();
  };

  return {
    metrics,
    isTracking,
    trackAction,
    trackSync,
    refreshMetrics,
    clearMetrics,
  };
};
