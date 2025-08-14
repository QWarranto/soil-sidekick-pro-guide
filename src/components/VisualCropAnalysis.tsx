import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FeatureGate from '@/components/FeatureGate';
import { useSubscription } from '@/hooks/useSubscription';

interface VisualAnalysisProps {
  location?: {
    county_name: string;
    state_code: string;
    county_fips?: string;
  };
}

interface AnalysisResult {
  analysis_type: string;
  confidence_score?: number;
  pest_identification?: string;
  health_status?: string;
  disease_identification?: string;
  severity?: string;
  recommendations?: string[];
  risk_level?: string;
  raw_analysis?: string;
}

const VisualCropAnalysis: React.FC<VisualAnalysisProps> = ({ location }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string>('');
  const [cropType, setCropType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analysisTypes = [
    { value: 'pest_detection', label: 'Pest Detection', description: 'Identify pests and damage' },
    { value: 'crop_health', label: 'Crop Health Assessment', description: 'Evaluate overall plant health' },
    { value: 'disease_screening', label: 'Disease Screening', description: 'Screen for plant diseases' }
  ];

  const cropTypes = [
    'Corn', 'Soybeans', 'Wheat', 'Cotton', 'Rice', 'Potatoes', 'Tomatoes', 
    'Lettuce', 'Carrots', 'Beans', 'Peas', 'Peppers', 'Other'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async () => {
    if (!selectedImage || !analysisType) {
      toast({
        title: "Missing information",
        description: "Please select an image and analysis type",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('visual-crop-analysis', {
        body: {
          image: selectedImage,
          analysis_type: analysisType,
          location,
          crop_type: cropType || undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysisResult(data.analysis);
        toast({
          title: "Analysis complete",
          description: "Your crop analysis has been completed successfully"
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health?: string) => {
    switch (health?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-lime-100 text-lime-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <FeatureGate 
      feature="visual_analysis"
      title="Visual Crop Analysis"
      description="AI-powered image analysis for pest detection and crop health assessment"
      requiredTier="pro"
    >
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Visual Crop Analysis
          </CardTitle>
          <CardDescription>
            Upload crop images for AI-powered pest detection, health assessment, and disease screening
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="analysis-type" className="text-sm font-medium mb-2 block">
                  Analysis Type
                </label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="crop-type" className="text-sm font-medium mb-2 block">
                  Crop Type (Optional)
                </label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {selectedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={selectedImage} 
                      alt="Selected crop" 
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Upload crop image</p>
                      <p className="text-sm text-muted-foreground">
                        Select a clear image of your crop for analysis (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {location && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Analysis will be performed for {location.county_name}, {location.state_code}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={performAnalysis}
              disabled={!selectedImage || !analysisType || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Analyze Crop
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pest Detection Results */}
            {analysisType === 'pest_detection' && (
              <div className="space-y-3">
                {analysisResult.pest_identification && (
                  <div>
                    <h4 className="font-medium">Pest Identification:</h4>
                    <p className="text-muted-foreground">{analysisResult.pest_identification}</p>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {analysisResult.confidence_score && (
                    <Badge variant="outline">
                      Confidence: {analysisResult.confidence_score}%
                    </Badge>
                  )}
                  {analysisResult.severity && (
                    <Badge className={getSeverityColor(analysisResult.severity)}>
                      Severity: {analysisResult.severity}
                    </Badge>
                  )}
                  {analysisResult.risk_level && (
                    <Badge className={getSeverityColor(analysisResult.risk_level)}>
                      Risk: {analysisResult.risk_level}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Crop Health Results */}
            {analysisType === 'crop_health' && (
              <div className="space-y-3">
                {analysisResult.health_status && (
                  <div>
                    <h4 className="font-medium">Health Status:</h4>
                    <Badge className={getHealthColor(analysisResult.health_status)}>
                      {analysisResult.health_status}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Disease Screening Results */}
            {analysisType === 'disease_screening' && (
              <div className="space-y-3">
                {analysisResult.disease_identification && (
                  <div>
                    <h4 className="font-medium">Disease Identification:</h4>
                    <p className="text-muted-foreground">{analysisResult.disease_identification}</p>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {analysisResult.confidence_score && (
                    <Badge variant="outline">
                      Confidence: {analysisResult.confidence_score}%
                    </Badge>
                  )}
                  {analysisResult.severity && (
                    <Badge className={getSeverityColor(analysisResult.severity)}>
                      Urgency: {analysisResult.severity}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && Array.isArray(analysisResult.recommendations) && (
              <div>
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Analysis Fallback */}
            {analysisResult.raw_analysis && !analysisResult.pest_identification && !analysisResult.health_status && !analysisResult.disease_identification && (
              <div>
                <h4 className="font-medium mb-2">Analysis:</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {analysisResult.raw_analysis}
                </p>
              </div>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a basic AI analysis for screening purposes only. For critical decisions, 
                consult with agricultural experts or extension services.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
    </FeatureGate>
  );
};

export default VisualCropAnalysis;