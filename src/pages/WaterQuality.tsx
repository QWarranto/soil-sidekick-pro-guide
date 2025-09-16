import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, LogOut, ArrowLeft } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { WaterQualityPDFExport } from '@/components/WaterQualityPDFExport';
import { SmartReportSummary } from '@/components/SmartReportSummary';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

// Enhanced water quality data structure for territories
interface WaterQualityData {
  utility_name: string;
  pwsid: string;
  contaminants: {
    name: string;
    level: number;
    unit: string;
    mcl: number; // Maximum Contaminant Level
    violation: boolean;
  }[];
  grade: string;
  last_tested: string;
  source_type: string;
  territory_type: 'state' | 'territory' | 'compact_state';
  regulatory_authority: string;
  population_served: number;
  system_type: string;
}

interface TerritoryInfo {
  territory_type: 'state' | 'territory' | 'compact_state';
  regulatory_authority: string;
  epa_region: string;
  water_system_oversight: string;
}

const WaterQuality = () => {
  const { user, signOut, trialUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user && !trialUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access water quality reports
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
  const [waterData, setWaterData] = useState<WaterQualityData | null>(null);
  const [territoryInfo, setTerritoryInfo] = useState<TerritoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCountySelect = async (county: County) => {
    setSelectedCounty(county);
    setIsLoading(true);
    
    try {
      // Call the territorial water quality edge function using Supabase client
      const { data: result, error } = await supabase.functions.invoke('territorial-water-quality', {
        body: {
          fips_code: county.fips_code,
          state_code: county.state_code,
          admin_unit_name: county.county_name
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch water quality data');
      }
      
      if (result.success) {
        setWaterData(result.data);
        setTerritoryInfo(result.territory_info);
        toast({
          title: "Water Quality Data Retrieved",
          description: `Found ${result.data.territory_type} water data for ${county.county_name}, ${county.state_code}`,
        });
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error fetching water quality data:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve water quality data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };


  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">TapWaterCheck Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {(user?.email || trialUser?.email) ?? 'Trial Access'}
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
        <div className="max-w-4xl mx-auto space-y-6 slide-in-up">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                Water Quality Analysis
              </CardTitle>
              <CardDescription>
                Get comprehensive water quality data and safety analysis for your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CountyLookup 
                onCountySelect={handleCountySelect}
              />
            </CardContent>
          </Card>

          {selectedCounty && (
            <Card className="card-elevated animate-fade-in">
              <CardHeader>
                <CardTitle>Selected Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {selectedCounty.county_name}, {selectedCounty.state_code}
                </p>
                <p className="text-sm text-muted-foreground">
                  FIPS: {selectedCounty.fips_code}
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing water quality data...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {waterData && !isLoading && selectedCounty && (
            <>
              {/* AI Executive Summary */}
              <SmartReportSummary 
                reportType="water" 
                reportData={waterData} 
                autoGenerate={true} 
              />

              {/* Water Quality Grade */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Water Quality Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold border-2 ${getGradeColor(waterData.grade)}`}>
                      {waterData.grade}
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-lg font-semibold">{waterData.utility_name}</p>
                      <p className="text-sm text-muted-foreground">PWSID: {waterData.pwsid}</p>
                      <p className="text-sm text-muted-foreground">Source: {waterData.source_type}</p>
                      <p className="text-sm text-muted-foreground">Last Tested: {new Date(waterData.last_tested).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional PDF Export */}
              <WaterQualityPDFExport 
                waterData={waterData} 
                county={selectedCounty} 
                territoryInfo={territoryInfo || undefined}
                userTier="pro"
              />

              {/* Territorial Information */}
              {territoryInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle>Regulatory Information</CardTitle>
                    <CardDescription>
                      Water system oversight and regulatory framework
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Territory Type</h4>
                        <p className="text-sm capitalize">{waterData.territory_type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Population Served</h4>
                        <p className="text-sm">{waterData.population_served.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">System Type</h4>
                        <p className="text-sm">{waterData.system_type}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">EPA Region</h4>
                        <p className="text-sm">{territoryInfo.epa_region}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2">Regulatory Authority</h4>
                        <p className="text-sm">{territoryInfo.regulatory_authority}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2">Water System Oversight</h4>
                        <p className="text-sm">{territoryInfo.water_system_oversight}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contaminant Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Contaminant Analysis</CardTitle>
                  <CardDescription>
                    Current contaminant levels vs EPA Maximum Contaminant Levels (MCL)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {waterData.contaminants.map((contaminant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{contaminant.name}</h4>
                          {contaminant.violation && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Violation
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Level: {contaminant.level} {contaminant.unit}</span>
                            <span>MCL: {contaminant.mcl} {contaminant.unit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${contaminant.violation ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min((contaminant.level / contaminant.mcl) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {contaminant.violation 
                              ? 'Exceeds EPA safety limits - contact your water utility' 
                              : 'Within EPA safety limits'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Filter Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Water Filters</CardTitle>
                  <CardDescription>
                    Based on your water quality analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Carbon Block Filter</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reduces chlorine taste and odor, some lead
                      </p>
                      <div className="text-sm">
                        <span className="text-green-600">✓ Reduces chlorine by 95%</span>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Reverse Osmosis System</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprehensive filtration for most contaminants
                      </p>
                      <div className="text-sm space-y-1">
                        <div className="text-green-600">✓ Reduces lead by 99%</div>
                        <div className="text-green-600">✓ Reduces nitrates by 95%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WaterQuality;