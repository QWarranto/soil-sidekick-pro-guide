import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LiveAgriculturalData {
  weather: {
    temperature_avg: number;
    precipitation_total: number;
    humidity: number;
    forecast: Array<{ time: string; temperature: number; humidity: number }>;
    source: string;
    last_updated: string;
  };
  soil: {
    health_index: number;
    moisture_level: number;
    ph_level: number;
    organic_matter: number;
    trends: Array<{ month: string; health: number }>;
    source: string;
    last_updated: string;
  };
  sources: string[];
  cache_status: string;
  last_refresh: string;
}

export const useLiveAgriculturalData = () => {
  const [data, setData] = useState<LiveAgriculturalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { toast } = useToast();

  const refreshData = useCallback(async (countyFips?: string, forceLive: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Default to a sample county if none provided
      const defaultCountyFips = countyFips || '17031'; // Cook County, IL

      console.log('Fetching live agricultural data for county:', defaultCountyFips);

      const { data: result, error: supabaseError } = await supabase.functions.invoke(
        'live-agricultural-data',
        {
          body: {
            county_fips: defaultCountyFips,
            data_types: ['weather', 'soil', 'environmental'],
            force_live_update: forceLive
          }
        }
      );

      if (supabaseError) {
        throw new Error(`Failed to fetch data: ${supabaseError.message}`);
      }

      if (!result) {
        throw new Error('No data received from the service');
      }

      // Transform the data to match our expected format
      const transformedData: LiveAgriculturalData = {
        weather: {
          temperature_avg: result.weather?.temperature_avg || 22,
          precipitation_total: result.weather?.precipitation_total || 0,
          humidity: result.weather?.humidity || 65,
          forecast: result.weather?.forecast || generateDefaultForecast(),
          source: result.weather?.source || 'simulated',
          last_updated: result.weather?.last_updated || new Date().toISOString()
        },
        soil: {
          health_index: result.soil?.health_index || 85,
          moisture_level: result.soil?.moisture_level || 55,
          ph_level: result.soil?.ph_level || 6.5,
          organic_matter: result.soil?.organic_matter || 3.2,
          trends: result.soil?.trends || generateDefaultSoilTrends(),
          source: result.soil?.source || 'simulated',
          last_updated: result.soil?.last_updated || new Date().toISOString()
        },
        sources: result.sources || ['Simulated Data'],
        cache_status: result.cache_status || 'simulated',
        last_refresh: new Date().toISOString()
      };

      setData(transformedData);
      setLastRefresh(new Date());

      // Show success toast with data source info
      const isLiveData = transformedData.sources.some(source => 
        source.includes('NOAA') || source.includes('USDA') || source.includes('EPA')
      );

      toast({
        title: "Data Refreshed",
        description: isLiveData 
          ? `Live data from: ${transformedData.sources.join(', ')}`
          : "Using simulated data - live sources may be temporarily unavailable",
        duration: 3000,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      
      toast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });

      console.error('Error refreshing agricultural data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getDataAge = useCallback(() => {
    if (!lastRefresh) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastRefresh.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }, [lastRefresh]);

  return {
    data,
    isLoading,
    error,
    lastRefresh,
    refreshData,
    getDataAge
  };
};

// Helper functions for default data
function generateDefaultForecast() {
  const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
  return hours.map((time, index) => ({
    time,
    temperature: 18 + (index * 2) + Math.random() * 4,
    humidity: 75 - (index * 3) + Math.random() * 10
  }));
}

function generateDefaultSoilTrends() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    health: 78 + index * 2 + Math.random() * 5
  }));
}