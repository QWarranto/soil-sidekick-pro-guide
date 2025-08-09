import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, Sprout, CloudRain, TrendingUp, Leaf, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SeasonalPlanningAssistantProps {
  location?: {
    county_name: string;
    state_code: string;
    fips_code: string;
  };
  soilData?: any;
}

export const SeasonalPlanningAssistant: React.FC<SeasonalPlanningAssistantProps> = ({
  location,
  soilData
}) => {
  const [planningType, setPlanningType] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [cropPreferences, setCropPreferences] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string>('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const planningTypes = [
    { value: 'crop_rotation', label: 'Crop Rotation Planning' },
    { value: 'seasonal_calendar', label: 'Seasonal Planting Calendar' },
    { value: 'soil_improvement', label: 'Soil Health Improvement' },
    { value: 'market_timing', label: 'Market-Optimized Planning' },
    { value: 'sustainable_farming', label: 'Sustainable Practices' }
  ];

  const timeframes = [
    { value: '1_year', label: 'Next 12 Months' },
    { value: '3_years', label: '3-Year Plan' },
    { value: '5_years', label: '5-Year Strategy' }
  ];

  const cropOptions = [
    'Corn', 'Soybeans', 'Wheat', 'Oats', 'Barley', 'Alfalfa', 'Clover',
    'Tomatoes', 'Peppers', 'Lettuce', 'Carrots', 'Potatoes', 'Onions',
    'Cover Crops', 'Pasture Grasses', 'Fruit Trees', 'Vegetable Gardens'
  ];

  const handleCropToggle = (crop: string) => {
    setCropPreferences(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const generatePlan = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    if (!planningType || !timeframe) {
      toast({
        title: "Missing Information",
        description: "Please select planning type and timeframe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await supabase.functions.invoke('seasonal-planning-assistant', {
        body: {
          location,
          soilData,
          planningType,
          cropPreferences,
          timeframe
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate plan');
      }

      if (response.data?.success) {
        setRecommendations(response.data.recommendations.content);
        setWeatherData(response.data.weatherData);
        setModelUsed(response.data.modelUsed);
        toast({
          title: "Planning Complete",
          description: `Seasonal plan generated using ${response.data.modelUsed.toUpperCase()}`,
        });
      } else {
        throw new Error(response.data?.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate planning recommendations';
      setError(errorMessage);
      toast({
        title: "Planning Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Seasonal Planning Assistant
            <Badge variant="outline" className="ml-2">
              GPT-5 Enhanced
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered crop rotation and seasonal planning with weather integration
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Location & Soil Context */}
      {location && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Planning Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Location:</strong> {location.county_name}, {location.state_code}
              </div>
              {soilData && (
                <div>
                  <strong>Soil pH:</strong> {soilData.ph_level || 'Unknown'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planning Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Planning Parameters</CardTitle>
          <CardDescription>
            Configure your seasonal planning preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Planning Type */}
          <div className="space-y-2">
            <Label>Planning Focus</Label>
            <Select value={planningType} onValueChange={setPlanningType}>
              <SelectTrigger>
                <SelectValue placeholder="Select planning type" />
              </SelectTrigger>
              <SelectContent>
                {planningTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <Label>Planning Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Crop Preferences */}
          <div className="space-y-3">
            <Label>Crop Preferences (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cropOptions.map(crop => (
                <div key={crop} className="flex items-center space-x-2">
                  <Checkbox
                    id={crop}
                    checked={cropPreferences.includes(crop)}
                    onCheckedChange={() => handleCropToggle(crop)}
                  />
                  <Label htmlFor={crop} className="text-sm">
                    {crop}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={generatePlan} 
            disabled={isLoading || !location}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Plan...
              </>
            ) : (
              <>
                <Sprout className="h-4 w-4 mr-2" />
                Generate Seasonal Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Weather Context */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
              Weather Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Current Season:</strong><br />
                {weatherData.currentSeason}
              </div>
              <div>
                <strong>USDA Zone:</strong><br />
                {weatherData.zone}
              </div>
              <div>
                <strong>Growing Season:</strong><br />
                {weatherData.growingSeason}
              </div>
              <div>
                <strong>Annual Rainfall:</strong><br />
                {weatherData.rainfall}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-2 mt-4">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse delay-75" />
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse delay-150" />
                <span className="text-xs text-muted-foreground ml-2">
                  AI analyzing seasonal factors...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Planning Failed</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && !isLoading && (
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Seasonal Planning Recommendations
                  {modelUsed && (
                    <Badge variant={modelUsed.includes('gpt-5') ? 'default' : 'secondary'}>
                      {modelUsed.toUpperCase()}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-generated seasonal strategy tailored to your location and conditions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-sm leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ 
                  __html: recommendations
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/#{1,6}\s*(.*?)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2 text-green-700">$1</h3>')
                    .replace(/•/g, '•')
                    .replace(/- /g, '• ')
                }} 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};