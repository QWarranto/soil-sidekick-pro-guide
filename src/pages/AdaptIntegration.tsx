import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Download, Settings, Zap, FlaskConical, ArrowRight, Sprout } from "lucide-react";

interface AdaptIntegration {
  id: string;
  integration_name: string;
  integration_type: string;
  integration_status: string;
  subscription_tier: string;
  last_sync_at: string | null;
  sync_frequency: string;
  created_at: string;
}

interface SoilAnalysis {
  id: string;
  county_name: string;
  state_code: string;
  created_at: string;
}

interface PrescriptionMapState {
  prescriptionMapId: string;
  prescriptionMapName: string;
  prescriptionMapData: any;
}

function transformPrescriptionToAdapt(map: any) {
  const currentDate = new Date().toISOString();
  return {
    Standard: "ADAPT-1.0",
    Version: "1.0.0",
    GeneratedBy: "SoilSidekick Pro",
    GeneratedAt: currentDate,
    Document: {
      DocumentId: map.id,
      DocumentType: "VRT_Prescription",
      DocumentName: map.map_name,
      TimeScope: {
        DateContext: currentDate,
        Description: `VRT ${map.application_type} prescription for ${map.crop_type || 'field crop'}`
      }
    },
    Grower: {
      Id: "grower-demo",
      Name: "Demo Grower"
    },
    Farm: {
      Id: "farm-demo",
      Name: "Demo Farm"
    },
    Field: {
      Id: map.id,
      Name: map.map_name.replace(/ - .*$/, ''),
      Area: { Value: 120, Unit: "ac" }
    },
    Prescription: {
      Id: map.id,
      Name: map.map_name,
      CropType: map.crop_type || "Corn",
      ApplicationType: map.application_type,
      BaseRate: { Value: map.base_rate, Unit: map.rate_unit },
      TargetYield: map.target_yield ? { Value: map.target_yield, Unit: "bu/ac" } : null,
      ConfidenceScore: map.confidence_score,
      EstimatedInputSavings: { Value: map.estimated_savings, Unit: "percent" },
      AnalysisMethod: map.analysis_method || "ai_generated",
      TotalZones: map.total_zones,
      Zones: (map.zones || []).map((z: any, i: number) => ({
        ZoneId: z.zoneId || `zone_${i + 1}`,
        ZoneName: z.zoneName || `Zone ${i + 1}`,
        AreaPercentage: z.areaPercentage,
        RateMultiplier: z.rateMultiplier,
        ApplicationRate: { Value: z.ratePerAcre?.toFixed(2), Unit: map.rate_unit },
        TotalAmount: z.totalAmount?.toFixed(2),
        Justification: z.justification || "",
        Geometry: z.geometry || null
      }))
    },
    Compliance: {
      Standard: "ADAPT-1.0",
      ISOBUSCompatible: true,
      GeneratedBy: "SoilSidekick Pro",
      GeneratedAt: currentDate
    }
  };
}

export default function AdaptIntegration() {
  const { user, trialUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const incomingPrescription = location.state as PrescriptionMapState | null;

  const [integrations, setIntegrations] = useState<AdaptIntegration[]>([]);
  const [soilAnalyses, setSoilAnalyses] = useState<SoilAnalysis[]>([]);
  const [prescriptionMaps, setPrescriptionMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportingPrescription, setExportingPrescription] = useState(false);

  // Form states
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: '',
    syncFrequency: 'manual'
  });
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>(
    incomingPrescription?.prescriptionMapId || ''
  );

  // Auto-select the tab when navigating here from VRT
  const defaultTab = incomingPrescription ? "prescriptions" : "export";

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Inject demo prescription if coming from VRT with demo data
  useEffect(() => {
    if (incomingPrescription?.prescriptionMapData) {
      setPrescriptionMaps(prev => {
        const alreadyPresent = prev.some(m => m.id === incomingPrescription.prescriptionMapId);
        if (alreadyPresent) return prev;
        return [incomingPrescription.prescriptionMapData, ...prev];
      });
      setSelectedPrescriptionId(incomingPrescription.prescriptionMapId);
    }
  }, [incomingPrescription]);

  const loadData = async () => {
    try {
      const [integrationsResult, analysesResult, prescriptionsResult] = await Promise.all([
        supabase
          .from('adapt_integrations')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('soil_analyses')
          .select('id, county_name, state_code, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('prescription_maps')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      if (integrationsResult.data) setIntegrations(integrationsResult.data);
      if (analysesResult.data) setSoilAnalyses(analysesResult.data);
      if (prescriptionsResult.data) {
        setPrescriptionMaps(prev => {
          // Merge DB maps with any incoming demo map
          const demoMaps = prev.filter(m => m.id?.startsWith('demo-'));
          return [...demoMaps, ...(prescriptionsResult.data || [])];
        });
      }
    } catch (error) {
      console.warn('Error loading integration data:', error);
      toast({
        title: "Data unavailable",
        description: "Couldn't load integration data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('adapt_integrations')
        .insert({
          user_id: user?.id,
          integration_name: newIntegration.name,
          integration_type: newIntegration.type,
          sync_frequency: newIntegration.syncFrequency,
          integration_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration created successfully"
      });

      setNewIntegration({ name: '', type: '', syncFrequency: 'manual' });
      loadData();
    } catch (error) {
      console.error('Error creating integration:', error);
      toast({
        title: "Error",
        description: "Failed to create integration",
        variant: "destructive"
      });
    }
  };

  const exportPrescriptionAsAdapt = () => {
    if (!selectedPrescriptionId) {
      toast({
        title: "No Prescription Selected",
        description: "Please select a prescription map to export.",
        variant: "destructive"
      });
      return;
    }

    const map = prescriptionMaps.find(m => m.id === selectedPrescriptionId);
    if (!map) {
      toast({ title: "Prescription not found", variant: "destructive" });
      return;
    }

    setExportingPrescription(true);
    try {
      const adaptPayload = transformPrescriptionToAdapt(map);
      const blob = new Blob([JSON.stringify(adaptPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vrt-prescription-adapt-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ ADAPT Export Complete",
        description: `"${map.map_name}" exported as ADAPT 1.0 JSON — ready for John Deere, AGCO, or any ISOBUS-compatible system.`
      });
    } catch (error) {
      console.error('Prescription export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate ADAPT JSON",
        variant: "destructive"
      });
    } finally {
      setExportingPrescription(false);
    }
  };

  const exportToAdapt = async () => {
    if (selectedAnalyses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one soil analysis to export",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('adapt-soil-export', {
        body: {
          soilAnalysisIds: selectedAnalyses,
          format: 'adapt_1.0'
        }
      });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `soil-analysis-adapt-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${data.exportedCount} soil analyses in ADAPT format`
      });

      setSelectedAnalyses([]);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export soil analyses",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Settings className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      error: 'destructive',
      disabled: 'outline'
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero parallax-scroll">
        <div className="container mx-auto flex justify-center items-center min-h-[50vh]">
          <div className="text-white text-lg">Loading integration data...</div>
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
              <p className="text-muted-foreground">Please sign in to access ADAPT integration features.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedPrescription = prescriptionMaps.find(m => m.id === selectedPrescriptionId);

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between slide-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white animate-fade-in">ADAPT Standard Integration</h1>
            <p className="text-white/90 animate-fade-in">
              Connect SoilSidekick Pro with ADAPT Standard 1.0 compatible systems
            </p>
          </div>
          <Badge variant="outline" className="text-sm pulse-glow">
            <Zap className="h-3 w-3 mr-1" />
            ADAPT 1.0 Certified
          </Badge>
        </div>

        {/* Demo path banner */}
        {incomingPrescription && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Demo Mode — Step 3 of 3</p>
                <p className="text-xs text-muted-foreground">
                  Prescription map <strong>"{incomingPrescription.prescriptionMapName}"</strong> is pre-selected. Click <strong>Export as ADAPT JSON</strong> to download the file.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prescriptions">
              <Sprout className="h-3 w-3 mr-1" />
              VRT Prescription Export
              {incomingPrescription && <Badge variant="default" className="ml-2 text-xs">New</Badge>}
            </TabsTrigger>
            <TabsTrigger value="export">Soil Data Export</TabsTrigger>
            <TabsTrigger value="integrations">Manage Integrations</TabsTrigger>
          </TabsList>

          {/* ── VRT Prescription Export Tab ── */}
          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export VRT Prescription Map as ADAPT JSON
                </CardTitle>
                <CardDescription>
                  Download your prescription map in ADAPT Standard 1.0 format — compatible with John Deere Operations Center, AGCO VarioDoc, Case IH AFS Connect, and any ISOBUS-certified display.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Prescription Map</Label>
                  <Select value={selectedPrescriptionId} onValueChange={setSelectedPrescriptionId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a prescription map…" />
                    </SelectTrigger>
                    <SelectContent>
                      {prescriptionMaps.map((map) => (
                        <SelectItem key={map.id} value={map.id}>
                          {map.map_name} — {map.total_zones} zones ({map.application_type})
                          {map.id?.startsWith('demo-') ? ' 🔬' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {prescriptionMaps.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      No prescription maps found. Go to <strong>/vrt</strong> to generate one first.
                    </p>
                  )}
                </div>

                {selectedPrescription && (
                  <div className="bg-muted/40 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-semibold">{selectedPrescription.map_name}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-muted-foreground">
                      <span>Application Type:</span><span className="font-medium text-foreground capitalize">{selectedPrescription.application_type}</span>
                      <span>Crop:</span><span className="font-medium text-foreground">{selectedPrescription.crop_type || '—'}</span>
                      <span>Base Rate:</span><span className="font-medium text-foreground">{selectedPrescription.base_rate} {selectedPrescription.rate_unit}</span>
                      <span>Zones:</span><span className="font-medium text-foreground">{selectedPrescription.total_zones}</span>
                      <span>AI Confidence:</span><span className="font-medium text-foreground">{selectedPrescription.confidence_score}%</span>
                      <span>Est. Input Savings:</span><span className="font-medium text-primary">{selectedPrescription.estimated_savings?.toFixed(1)}%</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={exportPrescriptionAsAdapt}
                  disabled={exportingPrescription || !selectedPrescriptionId}
                  size="lg"
                  className="w-full md:w-auto flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {exportingPrescription ? 'Generating ADAPT JSON…' : 'Export as ADAPT JSON'}
                </Button>

                <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3 space-y-1">
                  <p className="font-medium">What's included in the ADAPT export:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>ADAPT 1.0 document schema with Grower / Farm / Field hierarchy</li>
                    <li>All management zones with GeoJSON geometries</li>
                    <li>Per-zone application rates and area percentages</li>
                    <li>ISOBUS-compatible metadata for equipment ingestion</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Soil Data Export Tab ── */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Soil Analysis Data
                </CardTitle>
                <CardDescription>
                  Export your soil analysis data in ADAPT Standard 1.0 format for use with compatible farm management systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Soil Analyses to Export</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                    {soilAnalyses.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No soil analyses found.</p>
                    )}
                    {soilAnalyses.map((analysis) => (
                      <div key={analysis.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={analysis.id}
                          checked={selectedAnalyses.includes(analysis.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAnalyses([...selectedAnalyses, analysis.id]);
                            } else {
                              setSelectedAnalyses(selectedAnalyses.filter(id => id !== analysis.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={analysis.id} className="text-sm cursor-pointer flex-1">
                          {analysis.county_name}, {analysis.state_code} — {new Date(analysis.created_at).toLocaleDateString()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={exportToAdapt}
                    disabled={exporting || selectedAnalyses.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {exporting ? 'Exporting...' : 'Export to ADAPT Format'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedAnalyses.length === soilAnalyses.length) {
                        setSelectedAnalyses([]);
                      } else {
                        setSelectedAnalyses(soilAnalyses.map(a => a.id));
                      }
                    }}
                  >
                    {selectedAnalyses.length === soilAnalyses.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Manage Integrations Tab ── */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Integration</CardTitle>
                <CardDescription>
                  Set up a new connection to an ADAPT-compatible system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="integration-name">Integration Name</Label>
                    <Input
                      id="integration-name"
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                      placeholder="e.g., John Deere Operations Center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="integration-type">System Type</Label>
                    <Select value={newIntegration.type} onValueChange={(value) => setNewIntegration({...newIntegration, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john_deere">John Deere Operations Center</SelectItem>
                        <SelectItem value="case_ih">Case IH AFS Connect</SelectItem>
                        <SelectItem value="agco">AGCO VarioDoc</SelectItem>
                        <SelectItem value="generic_fmis">Generic FMIS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select value={newIntegration.syncFrequency} onValueChange={(value) => setNewIntegration({...newIntegration, syncFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="real_time">Real-time (Enterprise tier only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={createIntegration}>Create Integration</Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(integration.integration_status)}
                        <div>
                          <h3 className="font-semibold">{integration.integration_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {integration.integration_type.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(integration.integration_status)}
                        <Badge variant="outline">{integration.subscription_tier}</Badge>
                      </div>
                    </div>
                    {integration.last_sync_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
