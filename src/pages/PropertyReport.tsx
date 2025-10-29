import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Home, MapPin } from 'lucide-react';
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
  property_address: string;
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
  const [propertyAddress, setPropertyAddress] = useState('');
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
  };

  const handleGenerateReport = async () => {
    if (!selectedCounty) {
      toast({
        title: "County Required",
        description: "Please select a county first.",
        variant: "destructive",
      });
      return;
    }

    if (!propertyAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter the complete property address to generate a report.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const { data, error } = await supabase.functions.invoke('get-soil-data', {
        body: { 
          county_fips: selectedCounty.fips_code,
          county_name: selectedCounty.county_name,
          state_code: selectedCounty.state_code,
          property_address: propertyAddress.trim()
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
          county_fips: selectedCounty.fips_code
        });
        
        toast({
          title: "Property Report Generated",
          description: `Soil analysis retrieved for ${propertyAddress}`,
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
            <div className="space-y-6">
              <CountyLookup onCountySelect={handleCountySelect} />
              
              {selectedCounty && (
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Property Address Required
                    </CardTitle>
                    <CardDescription>
                      Each report is watermarked with the property address to prevent unauthorized reuse
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-address">Complete Property Address *</Label>
                      <Input
                        id="property-address"
                        placeholder="123 Main Street, City, State ZIP"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        This address will be permanently embedded in your report
                      </p>
                    </div>
                    
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        <strong>Anti-Reuse Protection:</strong> Each report is uniquely watermarked for a specific property address. 
                        This ensures authenticity and prevents report reuse for different properties.
                      </p>
                    </div>

                    <Button 
                      onClick={handleGenerateReport} 
                      disabled={loading || !propertyAddress.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Home className="h-4 w-4 mr-2" />
                          Generate Property Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
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
                      <p className="text-muted-foreground">Select the county where the property is located</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                    <div className="text-sm">
                      <p className="font-medium">Enter Property Address</p>
                      <p className="text-muted-foreground">Provide complete address for watermark protection</p>
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
                    Generating watermarked report for {propertyAddress}...
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
