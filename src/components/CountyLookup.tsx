import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface CountyLookupProps {
  onCountySelect: (county: County) => void;
}

export const CountyLookup: React.FC<CountyLookupProps> = ({ onCountySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const { toast } = useToast();

  const searchCounties = async (term: string) => {
    if (term.length < 2) {
      setCounties([]);
      return;
    }

    console.log('Searching for county:', term);
    setLoading(true);
    try {
      // Clean the search term by removing commas and extra spaces, then escape for SQL
      const cleanTerm = term.replace(/,/g, '').trim();
      console.log('Clean search term:', cleanTerm);
      
      // Call public edge function to avoid RLS issues
      const { data, error } = await supabase.functions.invoke('county-lookup', {
        body: { term: cleanTerm }
      });

      console.log('county-lookup response:', { data, error });
      if (error) throw error;

      const results = (data?.results || []).slice(0, 10);
      setCounties(results);
    } catch (error) {
      console.error('Error searching counties:', error);
      toast({
        title: "Search Error",
        description: "Failed to search counties. Please try again.",
        variant: "destructive",
      });
      setCounties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    setSearchTerm(`${county.county_name}, ${county.state_code}`);
    setCounties([]);
    onCountySelect(county);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCounties(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          County Lookup
        </CardTitle>
        <CardDescription>
          Search for a county to analyze soil data and get agricultural recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search county or state (e.g., 'Los Angeles' or 'California')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {counties.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
            {counties.map((county) => (
              <div
                key={county.id}
                className="p-3 rounded-md border hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleCountySelect(county)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{county.county_name}</p>
                    <p className="text-sm text-muted-foreground">{county.state_name}</p>
                  </div>
                  <Badge variant="outline">{county.state_code}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCounty && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-primary">Selected County</h4>
              <Badge>{selectedCounty.fips_code}</Badge>
            </div>
            <p className="text-sm">{selectedCounty.county_name}, {selectedCounty.state_name}</p>
          </div>
        )}

        {searchTerm.length > 0 && counties.length === 0 && !loading && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No counties found matching "{searchTerm}"</p>
            <p className="text-xs mt-1">Try searching with different terms</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};