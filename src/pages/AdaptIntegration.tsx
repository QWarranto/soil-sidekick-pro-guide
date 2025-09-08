import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Download, Settings, Zap } from "lucide-react";

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

export default function AdaptIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<AdaptIntegration[]>([]);
  const [soilAnalyses, setSoilAnalyses] = useState<SoilAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Form states
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: '',
    syncFrequency: 'manual'
  });
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [integrationsResult, analysesResult] = await Promise.all([
        supabase
          .from('adapt_integrations')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('soil_analyses')
          .select('id, county_name, state_code, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      if (integrationsResult.data) {
        setIntegrations(integrationsResult.data);
      }
      
      if (analysesResult.data) {
        setSoilAnalyses(analysesResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load integration data",
        variant: "destructive"
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

      // Create downloadable file
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: 'application/json'
      });
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
        <div className="container mx-auto flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

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

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="integrations">Manage Integrations</TabsTrigger>
          <TabsTrigger value="usage">API Usage</TabsTrigger>
        </TabsList>

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
                        {analysis.county_name}, {analysis.state_code} - {new Date(analysis.created_at).toLocaleDateString()}
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

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Statistics</CardTitle>
              <CardDescription>
                Monitor your ADAPT integration API usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                API usage tracking will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);
}