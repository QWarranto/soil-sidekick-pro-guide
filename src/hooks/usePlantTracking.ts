import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FrequentPlant {
  plant_name: string;
  query_count: number;
  last_queried: string;
  query_types: string[];
}

export interface RecentPlant {
  id: string;
  plant_name: string;
  query_type: string;
  query_details: any;
  created_at: string;
}

export function usePlantTracking() {
  const { toast } = useToast();
  const [frequentPlants, setFrequentPlants] = useState<FrequentPlant[]>([]);
  const [recentPlants, setRecentPlants] = useState<RecentPlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const logPlantQuery = async (
    plantName: string,
    queryType: 'identify' | 'health' | 'care',
    queryDetails?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return; // Don't log for unauthenticated users
      }

      const { error } = await supabase
        .from('plant_query_history')
        .insert({
          user_id: user.id,
          plant_name: plantName.trim(),
          query_type: queryType,
          query_details: queryDetails || null,
        });

      if (error) {
        console.error('Error logging plant query:', error);
      } else {
        // Refresh data after logging
        await Promise.all([fetchFrequentPlants(), fetchRecentPlants()]);
      }
    } catch (error) {
      console.error('Error in logPlantQuery:', error);
    }
  };

  const fetchFrequentPlants = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFrequentPlants([]);
        return;
      }

      const { data, error } = await supabase.rpc('get_user_frequent_plants', {
        target_user_id: user.id,
        limit_count: 10,
      });

      if (error) {
        console.error('Error fetching frequent plants:', error);
        return;
      }

      setFrequentPlants(data || []);
    } catch (error) {
      console.error('Error in fetchFrequentPlants:', error);
    }
  };

  const fetchRecentPlants = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRecentPlants([]);
        return;
      }

      const { data, error } = await supabase.rpc('get_recent_plant_queries', {
        target_user_id: user.id,
        limit_count: 20,
      });

      if (error) {
        console.error('Error fetching recent plants:', error);
        return;
      }

      setRecentPlants(data || []);
    } catch (error) {
      console.error('Error in fetchRecentPlants:', error);
    }
  };

  const loadPlantHistory = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchFrequentPlants(), fetchRecentPlants()]);
    } catch (error) {
      toast({
        title: 'Error Loading History',
        description: 'Could not load your plant history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load history on mount and when user changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        loadPlantHistory();
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadPlantHistory();
      } else {
        setFrequentPlants([]);
        setRecentPlants([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    frequentPlants,
    recentPlants,
    isLoading,
    logPlantQuery,
    refreshHistory: loadPlantHistory,
  };
}
