import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, TrendingUp, Droplet } from 'lucide-react';

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

interface SoilAnalysisResultsProps {
  soilData: SoilData;
  onExport?: () => void;
}

export const SoilAnalysisResults: React.FC<SoilAnalysisResultsProps> = ({ 
  soilData, 
  onExport 
}) => {
  const getPHLevel = (ph: number | null) => {
    if (!ph) return { label: 'Unknown', color: 'secondary', description: 'pH data not available' };
    if (ph < 6.0) return { label: 'Acidic', color: 'destructive', description: 'May need lime application' };
    if (ph <= 7.5) return { label: 'Optimal', color: 'default', description: 'Good for most crops' };
    return { label: 'Alkaline', color: 'warning', description: 'May need sulfur application' };
  };

  const getNutrientLevel = (level: string | null) => {
    if (!level) return { color: 'secondary', progress: 0 };
    switch (level.toLowerCase()) {
      case 'low': return { color: 'destructive', progress: 25 };
      case 'medium': return { color: 'warning', progress: 60 };
      case 'high': return { color: 'default', progress: 90 };
      default: return { color: 'secondary', progress: 0 };
    }
  };

  const phInfo = getPHLevel(soilData.ph_level);
  const nitrogenInfo = getNutrientLevel(soilData.nitrogen_level);
  const phosphorusInfo = getNutrientLevel(soilData.phosphorus_level);
  const potassiumInfo = getNutrientLevel(soilData.potassium_level);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Soil Analysis Results
              </CardTitle>
              <CardDescription>
                {soilData.county_name}, {soilData.state_code} • 
                {new Date(soilData.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* pH Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            pH Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">
              {soilData.ph_level ? soilData.ph_level.toFixed(1) : 'N/A'}
            </span>
            <Badge variant={phInfo.color as any}>{phInfo.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{phInfo.description}</p>
          {soilData.ph_level && (
            <Progress 
              value={(soilData.ph_level / 14) * 100} 
              className="mt-2" 
            />
          )}
        </CardContent>
      </Card>

      {/* Organic Matter */}
      {soilData.organic_matter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Organic Matter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{soilData.organic_matter.toFixed(1)}%</span>
              <Badge variant={soilData.organic_matter > 3 ? 'default' : 'destructive'}>
                {soilData.organic_matter > 3 ? 'Good' : 'Low'}
              </Badge>
            </div>
            <Progress value={(soilData.organic_matter / 10) * 100} className="mt-2" />
          </CardContent>
        </Card>
      )}

      {/* Nutrient Levels */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Nitrogen */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nitrogen (N)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                {soilData.nitrogen_level || 'Unknown'}
              </span>
              <Badge variant={nitrogenInfo.color as any} className="text-xs">
                {soilData.nitrogen_level || 'N/A'}
              </Badge>
            </div>
            <Progress value={nitrogenInfo.progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Phosphorus */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Phosphorus (P)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                {soilData.phosphorus_level || 'Unknown'}
              </span>
              <Badge variant={phosphorusInfo.color as any} className="text-xs">
                {soilData.phosphorus_level || 'N/A'}
              </Badge>
            </div>
            <Progress value={phosphorusInfo.progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Potassium */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Potassium (K)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                {soilData.potassium_level || 'Unknown'}
              </span>
              <Badge variant={potassiumInfo.color as any} className="text-xs">
                {soilData.potassium_level || 'N/A'}
              </Badge>
            </div>
            <Progress value={potassiumInfo.progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {soilData.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{soilData.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};