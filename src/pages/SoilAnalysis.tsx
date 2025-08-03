
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Leaf, LogOut, Plus } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { CountyMenuLookup } from '@/components/CountyMenuLookup';
import { SoilAnalysisResults } from '@/components/SoilAnalysisResults';
import { EnhancedPDFExport } from '@/components/EnhancedPDFExport';
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
  const [soilDataList, setSoilDataList] = useState<SoilData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'database'>('search');

  const handleBackHome = () => {
    navigate('/');
  };

  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Fallback to approximate county center if geolocation fails
          resolve({ lat: 39.8283, lng: -98.5795 }); // Center of US
        }
      );
    });
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
        
        // Get user's location for satellite enhancement
        try {
          const coordinates = await getCurrentLocation();
          
          // Enhance with satellite data
          await supabase.functions.invoke('alpha-earth-environmental-enhancement', {
            body: {
              analysis_id: data.soilAnalysis.id,
              county_fips: county.fips_code,
              lat: coordinates.lat,
              lng: coordinates.lng,
              soil_data: data.soilAnalysis.analysis_data,
              water_body_data: data.soilAnalysis.water_body_data
            }
          });
        } catch (enhancementError) {
          console.log('Satellite enhancement failed, continuing with basic analysis:', enhancementError);
        }
        
        // Track usage
        await supabase.from('subscription_usages').insert({
          user_id: user?.id,
          action_type: 'county_lookup',
          county_fips: county.fips_code
        });
        
        toast({
          title: "Analysis Complete",
          description: `Enhanced soil data retrieved for ${county.county_name}, ${county.state_code}`,
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

  const handleDataFound = (data: SoilData[]) => {
    setSoilDataList(data);
    setSoilData(null); // Clear single soil data when showing list
  };

  const handleNoDataFound = () => {
    setSoilDataList([]);
    setSoilData(null);
  };

  const handleSelectFromList = (data: SoilData) => {
    setSoilData(data);
    setSoilDataList([]);
  };

  const handlePopulateCounties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-counties', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: "Counties Populated",
        description: `Successfully populated counties: ${data.message}`,
      });
    } catch (error) {
      console.error('Error populating counties:', error);
      toast({
        title: "Population Failed",
        description: "Unable to populate counties. Please try again.",
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
          {/* County Population Button */}
          <Card>
            <CardHeader>
              <CardTitle>County Database Management</CardTitle>
              <CardDescription>
                Populate the database with all counties from the US Census Bureau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handlePopulateCounties}
                variant="default" 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Populating..." : "Populate Counties from Census API"}
              </Button>
            </CardContent>
          </Card>

          {/* Tab Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Soil Data Lookup Options</CardTitle>
              <CardDescription>
                Choose how you want to search for soil analysis data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={activeTab === 'search' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('search')}
                  size="sm"
                >
                  External Search
                </Button>
                <Button 
                  variant={activeTab === 'database' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('database')}
                  size="sm"
                >
                  Database Lookup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lookup Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {activeTab === 'search' ? (
              <CountyLookup onCountySelect={handleCountySelect} />
            ) : (
              <CountyMenuLookup 
                onDataFound={handleDataFound}
                onNoDataFound={handleNoDataFound}
              />
            )}
            
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
                   <div className="pt-4 border-t">
                     <Button 
                       onClick={handlePopulateCounties}
                       variant="outline" 
                       size="sm"
                       disabled={loading}
                       className="w-full"
                     >
                       Populate Counties from Census API
                     </Button>
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

          {/* Database Results List */}
          {soilDataList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Soil Analysis Data</CardTitle>
                <CardDescription>
                  Found {soilDataList.length} soil analysis record(s). Click to view details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {soilDataList.map((data, index) => (
                    <div
                      key={data.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleSelectFromList(data)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{data.county_name}, {data.state_code}</h4>
                          <p className="text-sm text-muted-foreground">
                            Analyzed on {new Date(data.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {data.ph_level && <Badge variant="outline">pH: {data.ph_level}</Badge>}
                          {data.organic_matter && <Badge variant="outline">OM: {data.organic_matter}%</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {soilData && !loading && (
            <div className="space-y-6">
              <SoilAnalysisResults soilData={soilData} onExport={handleExport} />
              <EnhancedPDFExport soilData={soilData} userTier="pro" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SoilAnalysis;
