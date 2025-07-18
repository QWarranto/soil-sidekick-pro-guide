
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut, Plus } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { SoilAnalysisResults } from '@/components/SoilAnalysisResults';
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

const SoilAnalysis = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleCountySelect = async (county: County) => {
    setSelectedCounty(county);
    setLoading(true);
    
    try {
      // Call edge function to get soil data
      const { data, error } = await supabase.functions.invoke('get-soil-data', {
        body: { 
          county_fips: county.fips_code,
          county_name: county.county_name,
          state_code: county.state_code 
        }
      });

      if (error) throw error;

      if (data?.soilAnalysis) {
        setSoilData(data.soilAnalysis);
        
        // Track usage
        await supabase.from('subscription_usages').insert({
          user_id: user?.id,
          action_type: 'county_lookup',
          county_fips: county.fips_code
        });
        
        toast({
          title: "Analysis Complete",
          description: `Soil data retrieved for ${county.county_name}, ${county.state_code}`,
        });
      }
    } catch (error) {
      console.error('Error getting soil data:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to retrieve soil data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!soilData) return;
    
    // Create a simple text export for now
    const exportData = `
Soil Analysis Report
County: ${soilData.county_name}, ${soilData.state_code}
Date: ${new Date(soilData.created_at).toLocaleDateString()}

pH Level: ${soilData.ph_level || 'Not available'}
Organic Matter: ${soilData.organic_matter ? soilData.organic_matter + '%' : 'Not available'}
Nitrogen: ${soilData.nitrogen_level || 'Not available'}
Phosphorus: ${soilData.phosphorus_level || 'Not available'}
Potassium: ${soilData.potassium_level || 'Not available'}

Recommendations:
${soilData.recommendations || 'No recommendations available'}
    `;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-analysis-${soilData.county_name}-${soilData.state_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Exported",
      description: "Soil analysis report has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* County Lookup Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CountyLookup onCountySelect={handleCountySelect} />
            
            {/* Quick Stats or Recent Analyses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Start by selecting a county to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Search for a county</p>
                      <p className="text-muted-foreground">Use the search box to find your area</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Get soil analysis</p>
                      <p className="text-muted-foreground">Receive detailed soil composition data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">View recommendations</p>
                      <p className="text-muted-foreground">Get agricultural guidance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">
                    Analyzing soil data for {selectedCounty?.county_name}...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {soilData && !loading && (
            <SoilAnalysisResults soilData={soilData} onExport={handleExport} />
          )}
        </div>
      </main>
    </div>
  );
};

export default SoilAnalysis;
