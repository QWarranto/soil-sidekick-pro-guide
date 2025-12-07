import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Leaf, 
  Zap, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Upload,
  MapPin,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  Calculator,
  ImageIcon,
  Download,
  Loader2
} from "lucide-react";

interface ComparisonResult {
  baseline: {
    identification: string;
    confidence: number;
    response_time_ms: number;
    details: string;
  };
  enhanced: {
    identification: string;
    confidence: number;
    response_time_ms: number;
    details: string;
    environmental_context: any;
  };
  comparison_metrics: {
    confidence_improvement: number;
    response_time_difference_ms: number;
    additional_data_points: number;
    match_agreement: boolean;
  };
}

export default function PlantIDComparison() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log("PlantIDComparison component rendering");
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [fullBaseline, setFullBaseline] = useState<any>(null);
  const [fullEnhanced, setFullEnhanced] = useState<any>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [comparisonImage, setComparisonImage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    console.log("PlantIDComparison useEffect running");
    
    const checkAdminAccess = async () => {
      try {
        console.log("Starting admin check...");
        
        // Wait for auth to initialize
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session result:", { 
          hasSession: !!session, 
          userId: session?.user?.id,
          email: session?.user?.email,
          sessionError 
        });
        
        if (sessionError) {
          setDebugInfo(`Session error: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!session?.user) {
          setDebugInfo("No authenticated session found");
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        const currentUserId = session.user.id;

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUserId)
          .eq("role", "admin")
          .maybeSingle();

        console.log("Admin check result:", { data, error, currentUserId });
        setDebugInfo(`User: ${session.user.email}, Admin data: ${JSON.stringify(data)}, Error: ${error?.message || 'none'}`);

        if (error) {
          console.error("Admin check error:", error);
        }
        
        setIsAdmin(!!data);
      } catch (err) {
        console.error("Admin check exception:", err);
        setDebugInfo(`Exception: ${err}`);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAdminAccess();
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          toast({ title: "Location captured", description: "GPS coordinates set for environmental context" });
        },
        (error) => {
          toast({ title: "Location error", description: error.message, variant: "destructive" });
        }
      );
    }
  };

  const handleAnalyze = async () => {
    if (!description && !imageUrl) {
      toast({ title: "Input required", description: "Provide a plant description or image URL", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setComparisonImage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("plant-id-comparison", {
        body: {
          description,
          image: imageUrl || undefined,
          location: latitude && longitude ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          } : undefined,
        },
      });

      if (response.error) throw response.error;

      setResult(response.data.comparison);
      setFullBaseline(response.data.full_baseline);
      setFullEnhanced(response.data.full_enhanced);
      
      toast({ title: "Analysis complete", description: "Baseline vs Enhanced comparison ready" });
    } catch (error) {
      toast({ 
        title: "Analysis failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!result) return;
    
    setIsGeneratingImage(true);
    try {
      const response = await supabase.functions.invoke("generate-comparison-image", {
        body: {
          baseline: result.baseline,
          enhanced: result.enhanced,
          plantName: result.enhanced.identification || result.baseline.identification,
          metrics: result.comparison_metrics,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.imageUrl) {
        setComparisonImage(response.data.imageUrl);
        toast({ title: "Image generated", description: "Before/After comparison image ready" });
      }
    } catch (error) {
      toast({ 
        title: "Image generation failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!comparisonImage) return;
    const link = document.createElement("a");
    link.href = comparisonImage;
    link.download = `leafengines-comparison-${Date.now()}.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto py-12 px-4 space-y-4">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              This feature is restricted to administrators for internal testing purposes.
            </AlertDescription>
          </Alert>
          <div className="p-4 bg-muted rounded-lg text-sm font-mono">
            <p><strong>Debug Info:</strong></p>
            <p>isAuthenticated: {String(isAuthenticated)}</p>
            <p>isAdmin: {String(isAdmin)}</p>
            <p>{debugInfo}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Admin Only
            </Badge>
            <Badge variant="secondary">Internal Testing</Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Plant ID Comparison</h1>
          <p className="text-muted-foreground mt-2">
            Compare baseline identification against LeafEngines-enhanced analysis with environmental context
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Plant Input
              </CardTitle>
              <CardDescription>
                Provide a description or image URL for identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Plant Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the plant's leaves, flowers, size, color..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/plant-image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Context
              </CardTitle>
              <CardDescription>
                Add location for environmental data integration (LeafEngines advantage)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={handleGetLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || (!description && !imageUrl)}
          className="w-full mb-8"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full" />
              Running Comparison...
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4 mr-2" />
              Run Baseline vs Enhanced Comparison
            </>
          )}
        </Button>

        {result && (
          <>
            {/* Scorecard Summary */}
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Comparison Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {result.comparison_metrics.confidence_improvement > 0 ? "+" : ""}
                      {result.comparison_metrics.confidence_improvement.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence Gain</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      +{result.comparison_metrics.additional_data_points}
                    </div>
                    <div className="text-sm text-muted-foreground">Extra Data Points</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {result.comparison_metrics.response_time_difference_ms > 0 ? "+" : ""}
                      {result.comparison_metrics.response_time_difference_ms}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Time Difference</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="flex justify-center mb-1">
                      {result.comparison_metrics.match_agreement ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-amber-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">ID Agreement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side by Side Results */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Baseline */}
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Baseline (Generic AI)
                  </CardTitle>
                  <CardDescription>Simple plant identification without context</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Identification</div>
                    <div className="text-xl font-semibold">{result.baseline.identification}</div>
                    {fullBaseline?.scientific_name && (
                      <div className="text-sm italic text-muted-foreground">
                        {fullBaseline.scientific_name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span>{(result.baseline.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={result.baseline.confidence * 100} />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {result.baseline.response_time_ms}ms response time
                  </div>

                  {result.baseline.details && (
                    <div className="text-sm p-3 bg-muted rounded-lg">
                      {result.baseline.details}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced */}
              <Card className="border-primary/30">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Zap className="h-5 w-5" />
                    LeafEngines Enhanced
                  </CardTitle>
                  <CardDescription>Full environmental context integration</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Identification</div>
                    <div className="text-xl font-semibold">{result.enhanced.identification}</div>
                    {fullEnhanced?.scientific_name && (
                      <div className="text-sm italic text-muted-foreground">
                        {fullEnhanced.scientific_name}
                      </div>
                    )}
                    {fullEnhanced?.family && (
                      <Badge variant="outline" className="mt-1">{fullEnhanced.family}</Badge>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span className="text-primary font-medium">
                        {(result.enhanced.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={result.enhanced.confidence * 100} className="bg-primary/20" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {result.enhanced.response_time_ms}ms response time
                  </div>

                  {fullEnhanced?.environmental_compatibility && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Environmental Compatibility</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Soil Match</span>
                          <span>{((fullEnhanced.environmental_compatibility.soil_match || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Climate Match</span>
                          <span>{((fullEnhanced.environmental_compatibility.climate_match || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                          <span>Water Needs</span>
                          <span>{((fullEnhanced.environmental_compatibility.water_needs_match || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-primary/10 rounded font-medium">
                          <span>Overall</span>
                          <span>{((fullEnhanced.environmental_compatibility.overall_suitability || 0) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {fullEnhanced?.care_recommendations?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Care Recommendations</div>
                      <ul className="text-sm space-y-1">
                        {fullEnhanced.care_recommendations.slice(0, 3).map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.enhanced.environmental_context && (
                    <div className="text-xs p-2 bg-muted rounded">
                      <div className="font-medium mb-1">Environmental Context Used:</div>
                      <div>County: {result.enhanced.environmental_context.county?.county_name}</div>
                      <div>Soil pH: {result.enhanced.environmental_context.soil?.ph_level}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Value Proposition Summary */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">LeafEngines Value Add</h3>
                    <p className="text-muted-foreground mb-4">
                      Enhanced identification provides <strong>{result.comparison_metrics.additional_data_points} additional data points</strong> including 
                      environmental compatibility scoring, care recommendations, pest/disease risks, and growth predictions. 
                      {result.comparison_metrics.confidence_improvement > 0 && (
                        <> This results in <strong>{result.comparison_metrics.confidence_improvement.toFixed(1)}% higher confidence</strong> through environmental context integration.</>
                      )}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {/* Generate Visual Comparison */}
                      <Button 
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        variant="outline"
                        className="gap-2"
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Image...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-4 w-4" />
                            Generate Visual Comparison
                          </>
                        )}
                      </Button>

                      {/* Link to Impact Simulator with real test data */}
                      <Button 
                        onClick={() => {
                          // Store comparison results in sessionStorage for Impact Simulator
                          const testData = {
                            confidenceImprovement: result.comparison_metrics.confidence_improvement,
                            additionalDataPoints: result.comparison_metrics.additional_data_points,
                            responseTimeDiff: result.comparison_metrics.response_time_difference_ms,
                            baselineConfidence: result.baseline.confidence * 100,
                            enhancedConfidence: result.enhanced.confidence * 100,
                            matchAgreement: result.comparison_metrics.match_agreement,
                            testTimestamp: new Date().toISOString(),
                          };
                          sessionStorage.setItem('plantIdComparisonResults', JSON.stringify(testData));
                          navigate('/impact-simulator?fromComparison=true');
                        }}
                        className="gap-2"
                      >
                        <Calculator className="h-4 w-4" />
                        Calculate Business Impact
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Comparison Image */}
            {comparisonImage && (
              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Before / After Visual Comparison
                    </span>
                    <Button variant="outline" size="sm" onClick={handleDownloadImage} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border">
                    <img 
                      src={comparisonImage} 
                      alt="Before/After LeafEngines Comparison" 
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    AI-generated infographic showing the difference between basic plant ID and LeafEngines-enhanced identification
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
