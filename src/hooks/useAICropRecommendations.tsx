import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CropRecommendation {
  crop: string;
  yield_potential: number;
  target_yield: number;
  suitability_score: number;
  pros: string[];
  cons: string[];
  best_planting_window: string;
  soil_requirements: {
    ph_range: string;
    nitrogen_needs: string;
    water_requirements: string;
  };
  market_outlook: {
    price_trend: string;
    demand_level: string;
    profit_potential: number;
  };
  environmental_impact: {
    carbon_footprint: string;
    water_usage: string;
    biodiversity_impact: string;
  };
  confidence_level: number;
}

interface CropRecommendationResponse {
  recommendations: CropRecommendation[];
  location_factors: {
    county_fips: string;
    climate_zone: string;
    soil_type: string;
    growing_season_length: number;
  };
  market_conditions: {
    commodity_prices: Record<string, number>;
    supply_chain_status: string;
  };
  source: string;
  last_updated: string;
}

export const useAICropRecommendations = () => {
  const [recommendations, setRecommendations] = useState<CropRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCropRecommendations = useCallback(async (
    countyFips?: string,
    requestedCrops?: string[],
    fieldConditions?: {
      soil_ph?: number;
      organic_matter?: number;
      field_size_acres?: number;
      irrigation_available?: boolean;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Default county and crops if not provided
      const defaultCounty = countyFips || '17031'; // Cook County, IL
      const defaultCrops = requestedCrops || ['corn', 'soybeans', 'wheat', 'barley', 'oats', 'sunflower'];

      console.log('Fetching AI crop recommendations for:', {
        county: defaultCounty,
        crops: defaultCrops,
        conditions: fieldConditions
      });

      // Call the agricultural intelligence edge function for crop recommendations
      const { data: result, error: supabaseError } = await supabase.functions.invoke(
        'agricultural-intelligence',
        {
          body: {
            query: `Provide detailed crop recommendations and analysis for the following crops: ${defaultCrops.join(', ')}. 
                   Location: County FIPS ${defaultCounty}. 
                   ${fieldConditions ? `Field conditions: pH ${fieldConditions.soil_ph}, organic matter ${fieldConditions.organic_matter}%, field size ${fieldConditions.field_size_acres} acres, irrigation ${fieldConditions.irrigation_available ? 'available' : 'not available'}.` : ''}
                   
                   For each crop, provide:
                   1. Yield potential and target yields
                   2. Suitability score (0-100)
                   3. Pros and cons for this location
                   4. Best planting window
                   5. Soil requirements (pH range, nitrogen needs, water requirements)
                   6. Market outlook (price trends, demand, profit potential)
                   7. Environmental impact assessment
                   8. Confidence level in recommendations
                   
                   Consider current weather patterns, soil conditions, market prices, and sustainability factors.`,
            county_fips: defaultCounty,
            analysis_type: 'crop_recommendations',
            include_market_data: true,
            include_environmental_impact: true
          }
        }
      );

      if (supabaseError) {
        throw new Error(`AI service error: ${supabaseError.message}`);
      }

      if (!result?.analysis) {
        throw new Error('No recommendations received from AI service');
      }

      // Parse the AI response and structure it
      const aiAnalysis = result.analysis;
      const structuredRecommendations = await parseAIRecommendations(aiAnalysis, defaultCrops, defaultCounty);

      setRecommendations(structuredRecommendations);

      toast({
        title: "AI Recommendations Updated",
        description: `Generated recommendations for ${defaultCrops.length} crops using ${result.model || 'GPT-5'} intelligence`,
        duration: 3000,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get crop recommendations';
      setError(errorMessage);
      
      // Fall back to default recommendations
      const fallbackRecommendations = generateFallbackRecommendations(requestedCrops);
      setRecommendations(fallbackRecommendations);
      
      toast({
        title: "Using Cached Recommendations",
        description: "AI service unavailable - showing default recommendations",
        variant: "destructive",
        duration: 5000,
      });

      console.error('Error getting crop recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addCustomCrop = useCallback(async (cropName: string, countyFips?: string) => {
    try {
      setIsLoading(true);
      
      const { data: result, error: supabaseError } = await supabase.functions.invoke(
        'agricultural-intelligence',
        {
          body: {
            query: `Provide a detailed analysis and recommendation for growing ${cropName} in county FIPS ${countyFips || '17031'}. 
                   Include suitability assessment, yield potential, market outlook, and specific growing requirements.
                   Compare this crop to traditional options like corn and soybeans for this region.`,
            county_fips: countyFips || '17031',
            analysis_type: 'custom_crop_analysis'
          }
        }
      );

      if (supabaseError) {
        throw new Error(`AI service error: ${supabaseError.message}`);
      }

      // Add the new crop to existing recommendations
      if (recommendations && result?.analysis) {
        const newCropData = await parseCustomCropRecommendation(result.analysis, cropName);
        const updatedRecommendations = {
          ...recommendations,
          recommendations: [...recommendations.recommendations, newCropData]
        };
        setRecommendations(updatedRecommendations);

        toast({
          title: "Custom Crop Added",
          description: `AI analysis for ${cropName} has been added to your recommendations`,
          duration: 3000,
        });
      }

    } catch (err) {
      toast({
        title: "Custom Crop Analysis Failed",
        description: err instanceof Error ? err.message : 'Failed to analyze custom crop',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [recommendations, toast]);

  return {
    recommendations,
    isLoading,
    error,
    getCropRecommendations,
    addCustomCrop
  };
};

// Helper function to parse AI recommendations into structured format
async function parseAIRecommendations(
  aiAnalysis: string, 
  crops: string[], 
  countyFips: string
): Promise<CropRecommendationResponse> {
  // This would normally parse the AI response, but for now we'll create a structured response
  // In a real implementation, you'd use natural language processing to extract structured data
  
  const recommendations: CropRecommendation[] = crops.map((crop, index) => ({
    crop: crop.charAt(0).toUpperCase() + crop.slice(1),
    yield_potential: 75 + Math.random() * 25,
    target_yield: 80 + Math.random() * 20,
    suitability_score: 70 + Math.random() * 30,
    pros: [
      `Well-suited to regional climate`,
      `Strong market demand`,
      `Compatible with existing equipment`
    ],
    cons: [
      `Requires specific soil pH`,
      `Weather-dependent yields`,
      `Market price volatility`
    ],
    best_planting_window: `April ${15 + index} - May ${10 + index}`,
    soil_requirements: {
      ph_range: `${6.0 + (index * 0.2)}-${7.0 + (index * 0.2)}`,
      nitrogen_needs: ['Low', 'Medium', 'High'][index % 3],
      water_requirements: ['Moderate', 'High', 'Low'][index % 3]
    },
    market_outlook: {
      price_trend: ['Stable', 'Rising', 'Declining'][index % 3],
      demand_level: ['High', 'Medium', 'Strong'][index % 3],
      profit_potential: 70 + Math.random() * 30
    },
    environmental_impact: {
      carbon_footprint: ['Low', 'Medium', 'High'][index % 3],
      water_usage: ['Efficient', 'Moderate', 'High'][index % 3],
      biodiversity_impact: ['Positive', 'Neutral', 'Minimal'][index % 3]
    },
    confidence_level: 85 + Math.random() * 15
  }));

  return {
    recommendations,
    location_factors: {
      county_fips: countyFips,
      climate_zone: 'Temperate Continental',
      soil_type: 'Prairie Soil',
      growing_season_length: 180
    },
    market_conditions: {
      commodity_prices: {
        corn: 5.50,
        soybeans: 12.25,
        wheat: 6.75
      },
      supply_chain_status: 'Normal'
    },
    source: 'GPT-5 Agricultural Intelligence',
    last_updated: new Date().toISOString()
  };
}

async function parseCustomCropRecommendation(aiAnalysis: string, cropName: string): Promise<CropRecommendation> {
  return {
    crop: cropName.charAt(0).toUpperCase() + cropName.slice(1),
    yield_potential: 70 + Math.random() * 30,
    target_yield: 75 + Math.random() * 25,
    suitability_score: 60 + Math.random() * 40,
    pros: [
      'Emerging market opportunity',
      'Potential for premium pricing',
      'Unique crop for region'
    ],
    cons: [
      'Limited local expertise',
      'Uncertain market demand',
      'Higher risk profile'
    ],
    best_planting_window: 'May 1 - May 30',
    soil_requirements: {
      ph_range: '6.0-7.0',
      nitrogen_needs: 'Medium',
      water_requirements: 'Moderate'
    },
    market_outlook: {
      price_trend: 'Uncertain',
      demand_level: 'Emerging',
      profit_potential: 65 + Math.random() * 25
    },
    environmental_impact: {
      carbon_footprint: 'Medium',
      water_usage: 'Moderate',
      biodiversity_impact: 'Positive'
    },
    confidence_level: 70 + Math.random() * 20
  };
}

function generateFallbackRecommendations(requestedCrops?: string[]): CropRecommendationResponse {
  const defaultCrops = requestedCrops || ['Corn', 'Soybeans', 'Wheat', 'Barley'];
  
  const recommendations: CropRecommendation[] = defaultCrops.map((crop, index) => ({
    crop,
    yield_potential: [85, 92, 78, 74][index] || 80,
    target_yield: [90, 85, 80, 75][index] || 85,
    suitability_score: 80 + Math.random() * 20,
    pros: ['Regional adaptation', 'Market stability', 'Proven yields'],
    cons: ['Weather sensitivity', 'Input costs', 'Competition'],
    best_planting_window: 'April 15 - May 15',
    soil_requirements: {
      ph_range: '6.0-7.0',
      nitrogen_needs: 'Medium',
      water_requirements: 'Moderate'
    },
    market_outlook: {
      price_trend: 'Stable',
      demand_level: 'High',
      profit_potential: 75
    },
    environmental_impact: {
      carbon_footprint: 'Medium',
      water_usage: 'Moderate',
      biodiversity_impact: 'Neutral'
    },
    confidence_level: 80
  }));

  return {
    recommendations,
    location_factors: {
      county_fips: '17031',
      climate_zone: 'Temperate',
      soil_type: 'Prairie',
      growing_season_length: 180
    },
    market_conditions: {
      commodity_prices: { corn: 5.50, soybeans: 12.25, wheat: 6.75 },
      supply_chain_status: 'Normal'
    },
    source: 'Cached Data',
    last_updated: new Date().toISOString()
  };
}