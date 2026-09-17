import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Droplet, Sprout, Calculator, Download, TrendingDown, Sparkles, FlaskConical, ArrowRight } from "lucide-react";

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

// Demo field used when the user has no real fields — enables the demo path
const DEMO_FIELD: Field = {
  id: '__demo__',
  name: 'Demo Farm — North Field',
  area_acres: 120,
  crop_type: 'Corn',
};

const DEMO_DEFAULTS = {
  fieldId: '__demo__',
  applicationType: 'fertilizer',
  cropType: 'Corn',
  baseRate: '150',
  rateUnit: 'lbs/acre',
  targetYield: '180',
};

export default function VariableRateTechnology() {
  const { user, trialUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [prescriptionMaps, setPrescriptionMaps] = useState<PrescriptionMap[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
    setDataLoading(true);
    try {
      const [fieldsResult, mapsResult] = await Promise.all([
        supabase.from('fields').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('prescription_maps').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      const realFields = fieldsResult.data || [];
      setFields(realFields);
      if (mapsResult.data) setPrescriptionMaps(mapsResult.data as any);

      // Auto-enable demo mode if no real fields exist
      if (realFields.length === 0) {
        setIsDemoMode(true);
        setFormData({ ...DEMO_DEFAULTS });
      }
    } catch (error) {
      console.warn('Error loading VRT data:', error);
      setIsDemoMode(true);
      setFormData({ ...DEMO_DEFAULTS });
    } finally {
      setDataLoading(false);
    }
  };

  const activateDemoMode = () => {
    setIsDemoMode(true);
    setFormData({ ...DEMO_DEFAULTS });
  };

  const availableFields = isDemoMode
    ? [DEMO_FIELD, ...fields]
    : fields;

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
      const isDemo = formData.fieldId === '__demo__';

      if (isDemo) {
        // Generate a locally-constructed prescription map for the demo path
        // (no real DB field needed, avoids the edge function's field lookup)
        const demoMap: PrescriptionMap = buildDemoPrescriptionMap(formData);
        setPrescriptionMaps(prev => [demoMap, ...prev]);
        toast({
          title: "Demo Prescription Map Generated",
          description: `Created ${demoMap.total_zones} management zones with ${demoMap.estimated_savings?.toFixed(1)}% estimated input savings`,
        });
        setFormData({ ...DEMO_DEFAULTS });
        return;
      }

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

  const exportPrescriptionMap = (map: PrescriptionMap) => {
    // Pass the prescription map id via URL state so ADAPT page can pre-select it
    navigate('/adapt-integration', {
      state: {
        prescriptionMapId: map.id,
        prescriptionMapName: map.map_name,
        prescriptionMapData: map,
      }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero parallax-scroll">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-2">
            {!isDemoMode && fields.length > 0 && (
              <Button variant="outline" size="sm" onClick={activateDemoMode} className="text-xs">
                <FlaskConical className="h-3 w-3 mr-1" />
                Demo Mode
              </Button>
            )}
            <Badge variant="outline" className="text-sm pulse-glow">
              <TrendingDown className="h-3 w-3 mr-1" />
              Up to 30% Input Savings
            </Badge>
          </div>
        </div>

        {/* Demo mode banner */}
        {isDemoMode && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Demo Mode Active</p>
                <p className="text-xs text-muted-foreground">
                  Pre-populated with <strong>Demo Farm — North Field (120 acres, Corn)</strong>. Generate a prescription, then export it to ADAPT from the "My Prescription Maps" tab.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Step 1 of 3
                <ArrowRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Prescription</TabsTrigger>
            <TabsTrigger value="maps">
              My Prescription Maps
              {prescriptionMaps.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{prescriptionMaps.length}</Badge>
              )}
            </TabsTrigger>
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
                        {availableFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name} ({field.area_acres} acres)
                            {field.id === '__demo__' && ' 🔬'}
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
              <>
                {isDemoMode && (
                  <Card className="border-primary/40 bg-primary/5">
                    <CardContent className="pt-4 pb-4 flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                      <p className="text-sm text-primary">
                        <strong>Step 2 of 3:</strong> Click <strong>Export to ADAPT</strong> on any map below to proceed to the ADAPT export page.
                      </p>
                    </CardContent>
                  </Card>
                )}
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
                              {map.crop_type && <Badge variant="outline">{map.crop_type}</Badge>}
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
                            variant="default"
                            size="sm"
                            onClick={() => exportPrescriptionMap(map)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Export to ADAPT
                            <ArrowRight className="h-3 w-3 ml-1" />
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Demo prescription map builder (local, no DB)
// ─────────────────────────────────────────────
function buildDemoPrescriptionMap(form: {
  applicationType: string;
  cropType: string;
  baseRate: string;
  rateUnit: string;
  targetYield: string;
}): PrescriptionMap {
  const base = parseFloat(form.baseRate) || 150;
  const zones = [
    {
      zoneId: 'zone_1',
      zoneName: 'High Productivity Zone',
      rateMultiplier: 1.2,
      justification: 'High organic matter (3.8%) and optimal pH 6.7 — increase rate for max yield',
      areaPercentage: 35,
      ratePerAcre: base * 1.2,
      totalAmount: (120 * 0.35) * base * 1.2,
      geometry: { type: 'Polygon', coordinates: [[[-89.5, 41.2], [-89.4, 41.2], [-89.4, 41.25], [-89.5, 41.25], [-89.5, 41.2]]] }
    },
    {
      zoneId: 'zone_2',
      zoneName: 'Standard Application Zone',
      rateMultiplier: 1.0,
      justification: 'Average soil characteristics — apply base rate',
      areaPercentage: 45,
      ratePerAcre: base * 1.0,
      totalAmount: (120 * 0.45) * base * 1.0,
      geometry: { type: 'Polygon', coordinates: [[[-89.4, 41.2], [-89.3, 41.2], [-89.3, 41.25], [-89.4, 41.25], [-89.4, 41.2]]] }
    },
    {
      zoneId: 'zone_3',
      zoneName: 'Low Application Zone',
      rateMultiplier: 0.75,
      justification: 'Waterlogged area with low productivity — reduce rate to avoid waste',
      areaPercentage: 20,
      ratePerAcre: base * 0.75,
      totalAmount: (120 * 0.20) * base * 0.75,
      geometry: { type: 'Polygon', coordinates: [[[-89.5, 41.15], [-89.3, 41.15], [-89.3, 41.2], [-89.5, 41.2], [-89.5, 41.15]]] }
    },
  ];

  return {
    id: `demo-${Date.now()}`,
    map_name: `Demo Farm — North Field - ${form.applicationType.charAt(0).toUpperCase() + form.applicationType.slice(1)} Prescription`,
    application_type: form.applicationType,
    crop_type: form.cropType || 'Corn',
    total_zones: 3,
    base_rate: base,
    rate_unit: form.rateUnit,
    estimated_savings: 18.5,
    confidence_score: 88,
    status: 'draft',
    created_at: new Date().toISOString(),
    zones,
  };
}
