import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Sprout, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { localLLMService } from "@/services/localLLMService";
import { LocalLLMToggle } from "@/components/LocalLLMToggle";
import { useSmartLLMSelection } from "@/hooks/useSmartLLMSelection";
import AppHeader from "@/components/AppHeader";

export default function OfflinePlantID() {
  const { toast } = useToast();
  const [plantDescription, setPlantDescription] = useState("");
  const [plantName, setPlantName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [careContext, setCareContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState("identify");

  const {
    state: smartState,
    localLLMConfig,
    setLocalLLMConfig,
    setManualMode,
    enableAutoMode,
  } = useSmartLLMSelection();

  const handleIdentifyPlant = async () => {
    if (!plantDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe the plant you want to identify.",
        variant: "destructive",
      });
      return;
    }

    if (!smartState.localLLMReady) {
      toast({
        title: "Local AI Not Ready",
        description: "Please enable and initialize the offline AI mode first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await localLLMService.identifyPlant(
        plantDescription,
        localLLMConfig
      );
      setResult(response);
      toast({
        title: "Identification Complete",
        description: "Plant identified using offline AI.",
      });
    } catch (error) {
      console.error("Plant identification failed:", error);
      toast({
        title: "Identification Failed",
        description: error instanceof Error ? error.message : "Failed to identify plant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeHealth = async () => {
    if (!plantName.trim() || !symptoms.trim()) {
      toast({
        title: "Information Required",
        description: "Please provide both plant name and symptoms.",
        variant: "destructive",
      });
      return;
    }

    if (!smartState.localLLMReady) {
      toast({
        title: "Local AI Not Ready",
        description: "Please enable and initialize the offline AI mode first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await localLLMService.analyzePlantHealth(
        plantName,
        symptoms,
        localLLMConfig
      );
      setResult(response);
      toast({
        title: "Analysis Complete",
        description: "Health diagnosis generated using offline AI.",
      });
    } catch (error) {
      console.error("Plant health analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze plant health",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCareAdvice = async () => {
    if (!plantName.trim() || !careContext.trim()) {
      toast({
        title: "Information Required",
        description: "Please provide both plant name and context.",
        variant: "destructive",
      });
      return;
    }

    if (!smartState.localLLMReady) {
      toast({
        title: "Local AI Not Ready",
        description: "Please enable and initialize the offline AI mode first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await localLLMService.getPlantCareAdvice(
        plantName,
        careContext,
        localLLMConfig
      );
      setResult(response);
      toast({
        title: "Care Advice Generated",
        description: "Recommendations provided using offline AI.",
      });
    } catch (error) {
      console.error("Plant care advice failed:", error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to generate care advice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Offline Plant ID</h1>
            {smartState.isOnline ? (
              <Wifi className="h-6 w-6 text-green-500" />
            ) : (
              <WifiOff className="h-6 w-6 text-orange-500" />
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Identify plants, diagnose health issues, and get care advice - all without internet connection.
            Powered by local AI running in your browser.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">
              <WifiOff className="h-3 w-3 mr-1" />
              Works Offline
            </Badge>
            <Badge variant="secondary">Privacy-First</Badge>
            <Badge variant="secondary">No API Costs</Badge>
          </div>
        </div>

        <div className="mb-6">
          <LocalLLMToggle
            enabled={smartState.useLocalLLM}
            onToggle={setManualMode}
            onConfigChange={setLocalLLMConfig}
            currentConfig={localLLMConfig}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="identify" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Identify Plant
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Health Analysis
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Care Advice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identify" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Describe the Plant</h3>
              <Textarea
                placeholder="Describe the plant's characteristics: leaf shape, flower color, size, habitat, etc. Example: 'Small plant with heart-shaped leaves, purple flowers with 5 petals, grows in shaded woodland areas'"
                value={plantDescription}
                onChange={(e) => setPlantDescription(e.target.value)}
                className="min-h-32 mb-4"
              />
              <Button
                onClick={handleIdentifyPlant}
                disabled={isLoading || !smartState.localLLMReady}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Identifying...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-4 w-4" />
                    Identify Plant
                  </>
                )}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Plant Health Diagnosis</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Plant Name</label>
                  <input
                    type="text"
                    placeholder="Enter the plant name (e.g., 'Tomato', 'Rose', 'Oak tree')"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Symptoms</label>
                  <Textarea
                    placeholder="Describe symptoms: yellowing leaves, brown spots, wilting, pest presence, etc."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <Button
                  onClick={handleAnalyzeHealth}
                  disabled={isLoading || !smartState.localLLMReady}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Analyze Health
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="care" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Plant Care Recommendations</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Plant Name</label>
                  <input
                    type="text"
                    placeholder="Enter the plant name (e.g., 'Monstera', 'Basil', 'Cactus')"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Context</label>
                  <Textarea
                    placeholder="Provide context: indoor/outdoor, climate, current season, specific concerns or questions"
                    value={careContext}
                    onChange={(e) => setCareContext(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <Button
                  onClick={handleGetCareAdvice}
                  disabled={isLoading || !smartState.localLLMReady}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sprout className="mr-2 h-4 w-4" />
                      Get Care Advice
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Result</h3>
              <Badge variant="secondary">Offline AI</Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{result}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
