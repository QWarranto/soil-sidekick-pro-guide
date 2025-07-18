import React, { useState, useEffect } from 'react';
import { MapPin, Database, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

interface SoilData {
  id: string;
  county_name: string;
  state_code: string;
  ph_level: number | null;
  organic_matter: number | null;
  nitrogen_level: string | null;
  phosphorus_level: string | null;
  potassium_level: string | null;
  recommendations: string | null;
  analysis_data: any;
  created_at: string;
}

interface CountyMenuLookupProps {
  onDataFound: (data: SoilData[]) => void;
  onNoDataFound: () => void;
}

export const CountyMenuLookup: React.FC<CountyMenuLookupProps> = ({ 
  onDataFound, 
  onNoDataFound 
}) => {
  const [states, setStates] = useState<Array<{state_code: string, state_name: string}>>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [populatingCounties, setPopulatingCounties] = useState(false);
  const { toast } = useToast();

  // Load available states on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const { data, error } = await supabase
          .from('counties')
          .select('state_code, state_name')
          .order('state_name');

        if (error) throw error;

        // Remove duplicates
        const uniqueStates = data?.reduce((acc: Array<{state_code: string, state_name: string}>, curr) => {
          if (!acc.find(state => state.state_code === curr.state_code)) {
            acc.push({ state_code: curr.state_code, state_name: curr.state_name });
          }
          return acc;
        }, []) || [];

        setStates(uniqueStates);
        
        // If no states found, suggest populating the database
        if (uniqueStates.length === 0) {
          toast({
            title: "No County Data",
            description: "County database is empty. Click 'Populate Counties' to add sample data.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error loading states:', error);
        toast({
          title: "Error",
          description: "Failed to load states. Please try again.",
          variant: "destructive",
        });
      } finally {
        setStatesLoading(false);
      }
    };

    loadStates();
  }, [toast]);

  // Load counties when state is selected
  useEffect(() => {
    const loadCounties = async () => {
      if (!selectedState) {
        setCounties([]);
        return;
      }

      setCountiesLoading(true);
      try {
        const { data, error } = await supabase
          .from('counties')
          .select('*')
          .eq('state_code', selectedState)
          .order('county_name');

        if (error) throw error;
        setCounties(data || []);
      } catch (error) {
        console.error('Error loading counties:', error);
        toast({
          title: "Error",
          description: "Failed to load counties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCountiesLoading(false);
      }
    };

    loadCounties();
  }, [selectedState, toast]);

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedCounty('');
  };

  const handleSearch = async () => {
    if (!selectedState || !selectedCounty) {
      toast({
        title: "Selection Required",
        description: "Please select both state and county.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Query soil_analyses table for existing data
      const { data, error } = await supabase
        .from('soil_analyses')
        .select('*')
        .eq('state_code', selectedState)
        .eq('county_name', selectedCounty)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        onDataFound(data);
        toast({
          title: "Data Found",
          description: `Found ${data.length} soil analysis record(s) for the selected area.`,
        });
      } else {
        onNoDataFound();
        toast({
          title: "No Data Available",
          description: "No soil analysis data found for the selected county.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error searching soil data:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for soil data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateCounties = async () => {
    setPopulatingCounties(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-counties');
      
      if (error) throw error;
      
      toast({
        title: "Counties Populated",
        description: data?.message || "County data has been added to the database.",
      });
      
      // Reload states after populating
      const { data: stateData, error: stateError } = await supabase
        .from('counties')
        .select('state_code, state_name')
        .order('state_name');

      if (!stateError && stateData) {
        const uniqueStates = stateData.reduce((acc: Array<{state_code: string, state_name: string}>, curr) => {
          if (!acc.find(state => state.state_code === curr.state_code)) {
            acc.push({ state_code: curr.state_code, state_name: curr.state_name });
          }
          return acc;
        }, []);
        setStates(uniqueStates);
      }
    } catch (error) {
      console.error('Error populating counties:', error);
      toast({
        title: "Error",
        description: "Failed to populate counties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPopulatingCounties(false);
    }
  };

  const selectedStateName = states.find(s => s.state_code === selectedState)?.state_name;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Lookup
        </CardTitle>
        <CardDescription>
          Select county and state to search for existing soil analysis data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show populate button if no states available */}
        {states.length === 0 && !statesLoading && (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">No county data available in the database.</p>
            <Button 
              onClick={handlePopulateCounties}
              disabled={populatingCounties}
              variant="outline"
            >
              {populatingCounties ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Populating Counties...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Populate Counties
                </>
              )}
            </Button>
          </div>
        )}

        {states.length > 0 && (
          <>
        {/* State Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select value={selectedState} onValueChange={handleStateChange} disabled={statesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={statesLoading ? "Loading states..." : "Select a state"} />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.state_code} value={state.state_code}>
                  {state.state_name} ({state.state_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* County Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">County</label>
          <Select 
            value={selectedCounty} 
            onValueChange={setSelectedCounty} 
            disabled={!selectedState || countiesLoading}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !selectedState 
                    ? "Select a state first" 
                    : countiesLoading 
                      ? "Loading counties..." 
                      : "Select a county"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {counties.map((county) => (
                <SelectItem key={county.id} value={county.county_name}>
                  {county.county_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selection Summary */}
        {selectedState && selectedCounty && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-primary">Selected Location</h4>
              <Badge>{selectedState}</Badge>
            </div>
            <p className="text-sm">{selectedCounty}, {selectedStateName}</p>
          </div>
        )}

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          disabled={!selectedState || !selectedCounty || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching Database...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Search for Soil Data
            </>
          )}
        </Button>

        {/* County Count Info */}
        {selectedState && counties.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {counties.length} counties available in {selectedStateName}
          </div>
        )}
        </>
        )}
      </CardContent>
    </Card>
  );
};