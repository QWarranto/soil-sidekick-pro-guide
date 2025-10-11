import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useToast } from '@/hooks/use-toast';

interface OfflineData<T> {
  data: T;
  timestamp: number;
  synced: boolean;
}

export const useOfflineStorage = <T,>(key: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSync, setNeedsSync] = useState(false);
  const { toast } = useToast();

  // Load data from offline storage
  const loadOfflineData = useCallback(async () => {
    try {
      const { value } = await Preferences.get({ key });
      if (value) {
        const offlineData: OfflineData<T> = JSON.parse(value);
        setData(offlineData.data);
        setNeedsSync(!offlineData.synced);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Save data to offline storage
  const saveOfflineData = useCallback(async (newData: T, synced: boolean = false) => {
    try {
      const offlineData: OfflineData<T> = {
        data: newData,
        timestamp: Date.now(),
        synced
      };
      await Preferences.set({
        key,
        value: JSON.stringify(offlineData)
      });
      setData(newData);
      setNeedsSync(!synced);
      
      if (!synced) {
        toast({
          title: "Saved offline",
          description: "Data saved locally. Will sync when online."
        });
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
      toast({
        title: "Error",
        description: "Failed to save data offline",
        variant: "destructive"
      });
    }
  }, [key, toast]);

  // Mark data as synced
  const markAsSynced = useCallback(async () => {
    if (data) {
      const offlineData: OfflineData<T> = {
        data,
        timestamp: Date.now(),
        synced: true
      };
      await Preferences.set({
        key,
        value: JSON.stringify(offlineData)
      });
      setNeedsSync(false);
    }
  }, [key, data]);

  // Clear offline data
  const clearOfflineData = useCallback(async () => {
    try {
      await Preferences.remove({ key });
      setData(null);
      setNeedsSync(false);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, [key]);

  useEffect(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  return {
    data,
    isLoading,
    needsSync,
    saveOfflineData,
    markAsSynced,
    clearOfflineData,
    reloadData: loadOfflineData
  };
};
