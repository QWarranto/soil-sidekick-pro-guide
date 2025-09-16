import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CountyLookup } from '@/components/CountyLookup';
import FertilizerDetailsDialog from '@/components/FertilizerDetailsDialog';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut, ArrowLeft, Droplets, AlertTriangle, CheckCircle, TrendingDown, Recycle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FertilizerRecommendation {
  name: string;
  type: 'synthetic' | 'organic' | 'slow-release';
  nValue: number;
  pValue: number;
  kValue: number;
  runoffRisk: 'low' | 'medium' | 'high';
  environmentalScore: number;
  price: string;
  benefits: string[];
  ecoAlternative?: string;
  runoffReduction?: number;
}

interface WaterBodyData {
  nearbyStreams: number;
  impairedWaterBodies: number;
  drainageBasin: string;
  runoffRiskLevel: 'low' | 'medium' | 'high';
}

// Sample fertilizer data - would come from USGS SPARROW + EPA 303(d) APIs
const sampleFertilizerData: FertilizerRecommendation[] = [
  {
    name: 'Standard NPK 10-10-10',
    type: 'synthetic',
    nValue: 10,
    pValue: 10,
    kValue: 10,
    runoffRisk: 'high',
    environmentalScore: 3,
    price: '$24.99',
    benefits: ['Quick release', 'Widely available', 'Cost effective'],
    ecoAlternative: 'Organic Compost Blend',
    runoffReduction: 0
  },
  {
    name: 'Organic Compost Blend',
    type: 'organic',
    nValue: 4,
    pValue: 2,
    kValue: 3,
    runoffRisk: 'low',
    environmentalScore: 9,
    price: '$32.99',
    benefits: ['Low runoff risk', 'Improves soil structure', 'Sustainable'],
    runoffReduction: 65
  },
  {
    name: 'Slow-Release Polymer Coated',
    type: 'slow-release',
    nValue: 15,
    pValue: 5,
    kValue: 10,
    runoffRisk: 'low',
    environmentalScore: 7,
    price: '$45.99',
    benefits: ['Controlled nutrient release', 'Less frequent application', 'Reduced runoff'],
    runoffReduction: 45
  },
  {
    name: 'Low-Phosphorus Organic',
    type: 'organic',
    nValue: 6,
    pValue: 1,
    kValue: 4,
    runoffRisk: 'low',
    environmentalScore: 8,
    price: '$38.99',
    benefits: ['Minimal phosphorus runoff', 'Organic certification', 'Soil health improvement'],
    runoffReduction: 70
  }
];

const sampleWaterData: WaterBodyData = {
  nearbyStreams: 3,
  impairedWaterBodies: 1,
  drainageBasin: 'Mississippi River Basin',
  runoffRiskLevel: 'medium'
};

const FertilizerFootprint = () => {
  const { user, signOut, trialUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCounty, setSelectedCounty] = useState<any>(null);
  const [fertilizerData, setFertilizerData] = useState<FertilizerRecommendation[]>([]);
  const [waterData, setWaterData] = useState<WaterBodyData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState<FertilizerRecommendation | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleCountySelect = async (county: any) => {
    setSelectedCounty(county);
    setIsLoading(true);
    
    try {
      // Get soil analysis data to inform fertilizer recommendations
      const { data: soilResponse, error } = await supabase.functions.invoke('get-soil-data', {
        body: {
          county_fips: county.fips_code,
          county_name: county.county_name,
          state_code: county.state_code
        }
      });

      if (error) {
        console.error('Error fetching soil data:', error);
        toast({
          title: "Error fetching soil data",
          description: "Using default recommendations for your area.",
          variant: "destructive",
        });
        // Fall back to sample data
        setFertilizerData(sampleFertilizerData);
        setWaterData(sampleWaterData);
      } else {
        // Generate fertilizer recommendations based on soil data and environmental factors
        const enhancedFertilizerData = generateFertilizerRecommendations(county, soilResponse.soilAnalysis);
        const enhancedWaterData = generateWaterBodyData(county);
        setFertilizerData(enhancedFertilizerData);
        setWaterData(enhancedWaterData);
        toast({
          title: "Fertilizer footprint analysis complete",
          description: `Environmental impact assessment loaded for ${county.county_name}, ${county.state_code}`,
        });
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      setFertilizerData(sampleFertilizerData);
      setWaterData(sampleWaterData);
      setShowResults(true);
      toast({
        title: "Using default data",
        description: "County-specific data unavailable, showing general recommendations.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFertilizerRecommendations = (county: any, soilAnalysis: any) => {
    const recommendations = [...sampleFertilizerData];
    
    // Adjust recommendations based on soil analysis
    if (soilAnalysis?.nitrogen_level === 'high') {
      // Prioritize low-nitrogen fertilizers
      recommendations.forEach(fert => {
        if (fert.name.includes('Low-Phosphorus')) {
          fert.environmentalScore += 1;
        }
      });
    }
    
    if (soilAnalysis?.phosphorus_level === 'high') {
      // Emphasize low-phosphorus options due to runoff concerns
      recommendations.forEach(fert => {
        if (fert.pValue <= 2) {
          fert.environmentalScore += 2;
          fert.runoffReduction = (fert.runoffReduction || 0) + 10;
        }
      });
    }

    // Adjust based on geographic location
    if (county.state_code === 'FL' || county.state_code === 'MN' || county.state_code === 'WI') {
      // States with significant water body concerns
      recommendations.forEach(fert => {
        if (fert.type === 'organic' || fert.type === 'slow-release') {
          fert.environmentalScore = Math.min(10, fert.environmentalScore + 1);
        }
      });
    }

    return recommendations.sort((a, b) => b.environmentalScore - a.environmentalScore);
  };

  const generateWaterBodyData = (county: any): WaterBodyData => {
    // Simulate water body data based on state characteristics
    const waterBodyCharacteristics: Record<string, Partial<WaterBodyData>> = {
      'FL': { nearbyStreams: 5, impairedWaterBodies: 2, drainageBasin: 'Gulf of Mexico', runoffRiskLevel: 'high' },
      'MN': { nearbyStreams: 8, impairedWaterBodies: 3, drainageBasin: 'Mississippi River Basin', runoffRiskLevel: 'medium' },
      'CA': { nearbyStreams: 2, impairedWaterBodies: 1, drainageBasin: 'Pacific Ocean', runoffRiskLevel: 'medium' },
      'TX': { nearbyStreams: 3, impairedWaterBodies: 1, drainageBasin: 'Gulf of Mexico', runoffRiskLevel: 'medium' },
      'IA': { nearbyStreams: 6, impairedWaterBodies: 2, drainageBasin: 'Mississippi River Basin', runoffRiskLevel: 'high' },
    };

    const stateData = waterBodyCharacteristics[county.state_code] || sampleWaterData;
    return { ...sampleWaterData, ...stateData };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'slow-release':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'synthetic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">SoilSidekick Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/soil-analysis')}>
              Soil Analysis
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/planting-calendar')}>
              Planting Calendar
            </Button>
            <span className="text-sm text-muted-foreground">
              Welcome, {(user?.email || trialUser?.email) ?? 'Trial User'}
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
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Page Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Droplets className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Fertilizer Footprint Optimizer</CardTitle>
                  <CardDescription>
                    Analyze environmental impact and get eco-friendly fertilizer recommendations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* County Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Your County</CardTitle>
              <CardDescription>
                Choose your county to assess fertilizer runoff risk and get sustainable recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CountyLookup
                onCountySelect={handleCountySelect}
              />
            </CardContent>
          </Card>

          {/* Environmental Impact Results */}
          {showResults && waterData && (
            <div className="space-y-6">
              {/* Water Body Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Environmental Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Droplets className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">Nearby Streams</p>
                        <p className="text-2xl text-blue-600">{waterData.nearbyStreams}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-semibold">Impaired Waters</p>
                        <p className="text-2xl text-red-600">{waterData.impairedWaterBodies}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold">Drainage Basin</p>
                        <p className="text-sm text-green-600">{waterData.drainageBasin}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your county has <strong>{waterData.runoffRiskLevel}</strong> fertilizer runoff risk. 
                      Consider eco-friendly alternatives to reduce environmental impact.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Fertilizer Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Recycle className="h-5 w-5" />
                    Sustainable Fertilizer Recommendations
                  </CardTitle>
                  <CardDescription>
                    Choose fertilizers that minimize environmental impact while meeting your soil needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {fertilizerData.map((fertilizer, index) => (
                      <Card key={index} className={`border-l-4 ${
                        fertilizer.environmentalScore >= 7 ? 'border-l-green-500' : 
                        fertilizer.environmentalScore >= 5 ? 'border-l-yellow-500' : 'border-l-red-500'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{fertilizer.name}</CardTitle>
                            <div className="flex gap-2">
                              <Badge className={getTypeColor(fertilizer.type)}>
                                {fertilizer.type}
                              </Badge>
                              <Badge className={getRiskColor(fertilizer.runoffRisk)}>
                                {fertilizer.runoffRisk} runoff
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <p className="font-medium">N</p>
                              <p className="text-lg">{fertilizer.nValue}%</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <p className="font-medium">P</p>
                              <p className="text-lg">{fertilizer.pValue}%</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <p className="font-medium">K</p>
                              <p className="text-lg">{fertilizer.kValue}%</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Environmental Score</span>
                              <span className="text-sm">{fertilizer.environmentalScore}/10</span>
                            </div>
                            <Progress value={fertilizer.environmentalScore * 10} className="h-2" />
                          </div>

                          {fertilizer.runoffReduction && fertilizer.runoffReduction > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                              <TrendingDown className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700 dark:text-green-300">
                                Reduces runoff by {fertilizer.runoffReduction}%
                              </span>
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium mb-2">Benefits:</p>
                            <ul className="text-xs space-y-1">
                              {fertilizer.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-semibold text-lg">{fertilizer.price}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedFertilizer(fertilizer);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact Tips */}
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200">🌿 Reduce Your Fertilizer Footprint</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    • Choose slow-release or organic fertilizers to minimize runoff
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    • Apply fertilizers before rain events to reduce surface runoff
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    • Use soil tests to apply only the nutrients your soil needs
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    • Consider buffer strips near water bodies to filter runoff
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    • Low-phosphorus fertilizers protect waterways from algal blooms
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Fertilizer Details Dialog */}
      <FertilizerDetailsDialog 
        fertilizer={selectedFertilizer}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedFertilizer(null);
        }}
      />
    </div>
  );
};

export default FertilizerFootprint;