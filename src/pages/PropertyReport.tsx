import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Home } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { PropertySoilAnalysis } from '@/components/PropertySoilAnalysis';
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

const PropertyReport = () => {
  const { user, trialUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user && !trialUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Home className="h-6 w-6 text-blue-600" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access property soil reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const { data, error } = await supabase.functions.invoke('get-soil-data', {
        body: { 
          county_fips: county.fips_code,
          county_name: county.county_name,
          state_code: county.state_code 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to fetch soil data');
      }

      if (data?.soilAnalysis) {
        setSoilData(data.soilAnalysis);
        
        await supabase.from('subscription_usages').insert({
          user_id: user?.id,
          action_type: 'property_report',
          county_fips: county.fips_code
        });
        
        toast({
          title: "Property Report Generated",
          description: `Soil analysis retrieved for ${county.county_name}, ${county.state_code}`,
        });
      }
    } catch (error: any) {
      console.error('Error getting soil data:', error);
      
      let errorMessage = "Unable to retrieve soil data. ";
      if (error.message?.includes('session')) {
        errorMessage += "Your session has expired. Please sign in again.";
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again later.";
      }
      
      toast({
        title: "Property Report Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackHome}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Property Soil Report</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6 slide-in-up">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Property Soil Analysis for Home Buyers & Real Estate</CardTitle>
              <CardDescription>
                Get essential soil information for foundation inspection, septic system feasibility, 
                landscaping potential, and property value assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Foundation Risk</h4>
                    <p className="text-xs text-muted-foreground">Soil bearing capacity & settlement potential</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Septic Feasibility</h4>
                    <p className="text-xs text-muted-foreground">Percolation rates & water table assessment</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Property Value</h4>
                    <p className="text-xs text-muted-foreground">Landscaping potential & drainage quality</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <CountyLookup onCountySelect={handleCountySelect} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                    <div className="text-sm">
                      <p className="font-medium">Search Property Location</p>
                      <p className="text-muted-foreground">Enter the county where the property is located</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                    <div className="text-sm">
                      <p className="font-medium">Get NRCS Soil Data</p>
                      <p className="text-muted-foreground">Official USDA soil survey information retrieved</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                    <div className="text-sm">
                      <p className="font-medium">View Property Insights</p>
                      <p className="text-muted-foreground">Foundation risk, septic feasibility, and value impact</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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

          {soilData && !loading && (
            <PropertySoilAnalysis soilData={soilData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertyReport;
