import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICropRecommendations } from '@/hooks/useAICropRecommendations';
import {
  Zap,
  Plus,
  TrendingUp,
  DollarSign,
  Leaf,
  Droplets,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AICropRecommendationsProps {
  countyFips?: string;
}

const AICropRecommendations: React.FC<AICropRecommendationsProps> = ({ countyFips }) => {
  const { recommendations, isLoading, getCropRecommendations, addCustomCrop } = useAICropRecommendations();
  const [customCropName, setCustomCropName] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const { toast } = useToast();

  const handleRefreshRecommendations = () => {
    getCropRecommendations(countyFips);
  };

  const handleAddCustomCrop = async () => {
    if (!customCropName.trim()) {
      toast({
        title: "Invalid Crop Name",
        description: "Please enter a valid crop name",
        variant: "destructive",
      });
      return;
    }

    setIsAddingCrop(true);
    try {
      await addCustomCrop(customCropName.trim(), countyFips);
      setCustomCropName('');
    } finally {
      setIsAddingCrop(false);
    }
  };

  // Initialize recommendations on mount
  React.useEffect(() => {
    if (!recommendations) {
      getCropRecommendations(countyFips);
    }
  }, [countyFips, getCropRecommendations, recommendations]);

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuitabilityVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            AI Crop Recommendations
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Crop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Get Recommendations for Custom Crop</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Crop Name</label>
                    <Input
                      placeholder="e.g., Quinoa, Hemp, Sunflower, Buckwheat..."
                      value={customCropName}
                      onChange={(e) => setCustomCropName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCrop()}
                    />
                  </div>
                  <Button 
                    onClick={handleAddCustomCrop} 
                    disabled={isAddingCrop || !customCropName.trim()}
                    className="w-full"
                  >
                    {isAddingCrop ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    {isAddingCrop ? 'Analyzing...' : 'Get AI Recommendation'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshRecommendations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        {recommendations && (
          <div className="text-xs text-muted-foreground">
            Source: {recommendations.source} • {recommendations.recommendations.length} crops analyzed
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && !recommendations && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations?.recommendations.map((crop, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium">{crop.crop}</h4>
                <Badge variant={getSuitabilityVariant(crop.suitability_score)}>
                  {crop.suitability_score.toFixed(0)}% suitable
                </Badge>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCrop(crop)}>
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{crop.crop} - Detailed Analysis</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="market">Market</TabsTrigger>
                      <TabsTrigger value="environment">Environment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-600 mb-2">Advantages</h5>
                          <ul className="text-sm space-y-1">
                            {crop.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-orange-600 mb-2">Considerations</h5>
                          <ul className="text-sm space-y-1">
                            {crop.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start">
                                <AlertTriangle className="h-3 w-3 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{crop.yield_potential.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Yield Potential</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{crop.confidence_level.toFixed(0)}%</div>
                          <div className="text-sm text-muted-foreground">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">${crop.market_outlook.profit_potential.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">Profit Score</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">Soil Requirements</h5>
                          <div className="space-y-2 text-sm">
                            <div>pH Range: <strong>{crop.soil_requirements.ph_range}</strong></div>
                            <div>Nitrogen Needs: <strong>{crop.soil_requirements.nitrogen_needs}</strong></div>
                            <div>Water Requirements: <strong>{crop.soil_requirements.water_requirements}</strong></div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-3">Timing</h5>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Best Planting: <strong>{crop.best_planting_window}</strong></span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="market" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">{crop.market_outlook.price_trend}</div>
                          <div className="text-sm text-muted-foreground">Price Trend</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <DollarSign className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">{crop.market_outlook.demand_level}</div>
                          <div className="text-sm text-muted-foreground">Demand Level</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="text-xl font-bold">{crop.market_outlook.profit_potential.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">Profit Potential</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="environment" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded">
                          <Leaf className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <div className="font-medium">{crop.environmental_impact.carbon_footprint}</div>
                          <div className="text-sm text-muted-foreground">Carbon Footprint</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="font-medium">{crop.environmental_impact.water_usage}</div>
                          <div className="text-sm text-muted-foreground">Water Usage</div>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="text-sm font-medium">{crop.environmental_impact.biodiversity_impact}</div>
                          <div className="text-sm text-muted-foreground">Biodiversity Impact</div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Yield Potential</span>
                <span className={getSuitabilityColor(crop.yield_potential)}>{crop.yield_potential.toFixed(1)}%</span>
              </div>
              <Progress value={crop.yield_potential} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Target: {crop.target_yield.toFixed(0)}%</span>
                <span className="flex items-center">
                  Confidence: {crop.confidence_level.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && recommendations && recommendations.recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No crop recommendations available.</p>
            <Button variant="outline" onClick={handleRefreshRecommendations} className="mt-2">
              Generate Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICropRecommendations;