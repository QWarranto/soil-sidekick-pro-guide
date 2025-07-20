import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Droplets, LogOut, Download, ArrowLeft } from 'lucide-react';
import { CountyLookup } from '@/components/CountyLookup';
import { useToast } from '@/hooks/use-toast';

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

// Mock water quality data structure - will be replaced with EPA SDWIS data
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
}

const WaterQuality = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [waterData, setWaterData] = useState<WaterQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration - will be replaced with EPA SDWIS API
  const mockWaterData: WaterQualityData = {
    utility_name: "City of Springfield Water Department",
    pwsid: "IL0123456",
    contaminants: [
      { name: "Lead", level: 8.2, unit: "ppb", mcl: 15, violation: false },
      { name: "Chlorine", level: 2.1, unit: "ppm", mcl: 4, violation: false },
      { name: "Nitrates", level: 5.8, unit: "ppm", mcl: 10, violation: false },
      { name: "Fluoride", level: 0.8, unit: "ppm", mcl: 4, violation: false },
      { name: "Total Trihalomethanes", level: 45, unit: "ppb", mcl: 80, violation: false }
    ],
    grade: "B+",
    last_tested: "2024-01-15",
    source_type: "Surface Water"
  };

  const handleCountySelect = async (county: County) => {
    setSelectedCounty(county);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setWaterData(mockWaterData);
      setIsLoading(false);
      toast({
        title: "Water Quality Data Retrieved",
        description: `Found data for ${county.county_name}, ${county.state_code}`,
      });
    }, 1500);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "Water quality report will be generated and downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
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
              {user?.email}
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
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
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
            <Card>
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

          {waterData && !isLoading && (
            <>
              {/* Water Quality Grade */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Water Quality Grade</CardTitle>
                    <Button onClick={exportToPDF} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF Report
                    </Button>
                  </div>
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