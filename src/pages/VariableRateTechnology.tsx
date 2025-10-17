import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Droplet, Sprout, Calculator, Download, TrendingDown, Sparkles } from "lucide-react";

interface Field {
  id: string;
  name: string;
  area_acres: number;
  crop_type: string;
}

interface PrescriptionMap {
  id: string;
  map_name: string;
  application_type: string;
  crop_type: string;
  total_zones: number;
  base_rate: number;
  rate_unit: string;
  estimated_savings: number;
  confidence_score: number;
  status: string;
  created_at: string;
  zones: any[];
}

export default function VariableRateTechnology() {
  const { user, trialUser } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [prescriptionMaps, setPrescriptionMaps] = useState<PrescriptionMap[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fieldId: '',
    applicationType: 'fertilizer',
    cropType: '',
    baseRate: '',
    rateUnit: 'lbs/acre',
    targetYield: ''
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fieldsResult, mapsResult] = await Promise.all([
        supabase.from('fields').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('prescription_maps').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      if (fieldsResult.data) setFields(fieldsResult.data);
      if (mapsResult.data) setPrescriptionMaps(mapsResult.data as any);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load VRT data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePrescriptionMap = async () => {
    if (!formData.fieldId || !formData.baseRate) {
      toast({
        title: "Missing Information",
        description: "Please select a field and enter base application rate",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-vrt-prescription', {
        body: {
          fieldId: formData.fieldId,
          applicationType: formData.applicationType,
          cropType: formData.cropType,
          baseRate: parseFloat(formData.baseRate),
          rateUnit: formData.rateUnit,
          targetYield: formData.targetYield ? parseFloat(formData.targetYield) : null
        }
      });

      if (error) throw error;

      toast({
        title: "Prescription Map Generated",
        description: `Created ${data.prescriptionMap.total_zones} management zones with ${data.prescriptionMap.estimated_savings?.toFixed(1)}% estimated input savings`
      });

      loadData();
      setFormData({ ...formData, fieldId: '', baseRate: '', targetYield: '' });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate prescription map",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const exportPrescriptionMap = async (mapId: string) => {
    toast({
      title: "Export Feature",
      description: "Exporting to ADAPT/ISO-XML format coming soon!",
    });
  };

  const getApplicationIcon = (type: string) => {
    switch (type) {
      case 'fertilizer': return <Sprout className="h-5 w-5" />;
      case 'water': return <Droplet className="h-5 w-5" />;
      case 'seed': return <MapPin className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'secondary',
      approved: 'default',
      applied: 'outline',
      archived: 'destructive'
    } as const;
    return colors[status as keyof typeof colors] || 'secondary';
  };

  if (!user && !trialUser) {
    return (
      <div className="min-h-screen bg-gradient-hero parallax-scroll">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground">Please sign in to access Variable Rate Technology features.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between slide-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white animate-fade-in flex items-center gap-2">
              <Sparkles className="h-8 w-8" />
              Variable Rate Technology (VRT)
            </h1>
            <p className="text-white/90 animate-fade-in">
              AI-powered prescription maps for precision agriculture - optimize inputs and reduce waste
            </p>
          </div>
          <Badge variant="outline" className="text-sm pulse-glow">
            <TrendingDown className="h-3 w-3 mr-1" />
            Up to 30% Input Savings
          </Badge>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Prescription</TabsTrigger>
            <TabsTrigger value="maps">My Prescription Maps</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Generate AI-Powered Prescription Map
                </CardTitle>
                <CardDescription>
                  Create zone-based application plans that allow tractors to apply inputs at variable rates across your field
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field">Select Field *</Label>
                    <Select value={formData.fieldId} onValueChange={(value) => setFormData({ ...formData, fieldId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name} ({field.area_acres} acres)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="applicationType">Application Type</Label>
                    <Select value={formData.applicationType} onValueChange={(value) => setFormData({ ...formData, applicationType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertilizer">Fertilizer</SelectItem>
                        <SelectItem value="seed">Seeding Rate</SelectItem>
                        <SelectItem value="water">Irrigation/Water</SelectItem>
                        <SelectItem value="pesticide">Pesticide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      placeholder="e.g., Corn, Soybeans, Wheat"
                    />
                  </div>

                  <div>
                    <Label htmlFor="baseRate">Base Application Rate *</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      step="0.01"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rateUnit">Rate Unit</Label>
                    <Select value={formData.rateUnit} onValueChange={(value) => setFormData({ ...formData, rateUnit: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs/acre">lbs/acre</SelectItem>
                        <SelectItem value="seeds/acre">seeds/acre</SelectItem>
                        <SelectItem value="gallons/acre">gallons/acre</SelectItem>
                        <SelectItem value="kg/hectare">kg/hectare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetYield">Target Yield (Optional)</Label>
                    <Input
                      id="targetYield"
                      type="number"
                      step="0.01"
                      value={formData.targetYield}
                      onChange={(e) => setFormData({ ...formData, targetYield: e.target.value })}
                      placeholder="e.g., 180 bu/acre"
                    />
                  </div>
                </div>

                <Button 
                  onClick={generatePrescriptionMap} 
                  disabled={generating}
                  className="w-full md:w-auto"
                >
                  {generating ? 'Generating AI Prescription...' : 'Generate Prescription Map'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  How VRT Works
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ AI analyzes your field's soil variability and crop requirements</li>
                  <li>✓ Generates 3-5 management zones with optimized application rates</li>
                  <li>✓ Creates prescription maps compatible with GPS-enabled tractors</li>
                  <li>✓ Reduces input waste while maintaining or improving yield</li>
                  <li>✓ Export to ADAPT, Shapefile, or ISO-XML formats for equipment</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps" className="space-y-4">
            {prescriptionMaps.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No prescription maps yet. Create your first one to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {prescriptionMaps.map((map) => (
                  <Card key={map.id} className="card-elevated">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getApplicationIcon(map.application_type)}
                            <h3 className="font-semibold">{map.map_name}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={getStatusColor(map.status)}>
                              {map.status.charAt(0).toUpperCase() + map.status.slice(1)}
                            </Badge>
                            <Badge variant="outline">{map.total_zones} zones</Badge>
                            <Badge variant="outline">{map.crop_type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Base Rate: {map.base_rate} {map.rate_unit}</p>
                            {map.estimated_savings && (
                              <p className="text-green-600 font-medium">
                                Estimated Savings: {map.estimated_savings.toFixed(1)}%
                              </p>
                            )}
                            {map.confidence_score && (
                              <p>AI Confidence: {map.confidence_score}%</p>
                            )}
                            <p className="text-xs">Created: {new Date(map.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportPrescriptionMap(map.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      {map.zones && map.zones.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Management Zones:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {map.zones.slice(0, 4).map((zone: any, idx: number) => (
                              <div key={idx} className="bg-secondary/20 p-2 rounded">
                                <span className="font-medium">{zone.zoneName}:</span> {zone.ratePerAcre?.toFixed(1)} {map.rate_unit}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}