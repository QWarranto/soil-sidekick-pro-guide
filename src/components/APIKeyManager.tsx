import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Key, Clock, Copy, CheckCircle, AlertCircle, Loader2, Rocket, Building2 } from 'lucide-react';

interface APIKey {
  id: string;
  key_name: string;
  subscription_tier: string;
  rate_limit: number;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  permissions: Record<string, unknown>;
}

interface APIKeyRequest {
  id: string;
  requested_tier: string;
  request_status: 'pending' | 'approved' | 'rejected';
  company_name: string | null;
  use_case: string | null;
  expected_volume: string | null;
  created_at: string;
  admin_notes: string | null;
}

export function APIKeyManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyVisible, setNewKeyVisible] = useState<string | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [upgradeForm, setUpgradeForm] = useState({
    tier: 'starter',
    companyName: '',
    useCase: '',
    expectedVolume: ''
  });

  // Fetch API keys and requests
  const { data, isLoading } = useQuery({
    queryKey: ['api-keys-manager'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('api-key-request', {
        method: 'GET'
      });

      if (response.error) throw response.error;
      return response.data as { apiKeys: APIKey[]; pendingRequests: APIKeyRequest[] };
    }
  });

  // Generate sandbox key
  const generateSandboxMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('api-key-request', {
        body: { action: 'generate_sandbox' }
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      if (data.apiKey?.key) {
        setNewKeyVisible(data.apiKey.key);
      }
      toast({
        title: 'Sandbox API Key Generated!',
        description: 'Copy your key now - it won\'t be shown again.',
      });
      queryClient.invalidateQueries({ queryKey: ['api-keys-manager'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate key',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Request upgrade
  const requestUpgradeMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('api-key-request', {
        body: {
          action: 'request_upgrade',
          tier: upgradeForm.tier,
          companyName: upgradeForm.companyName,
          useCase: upgradeForm.useCase,
          expectedVolume: upgradeForm.expectedVolume
        }
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Upgrade Request Submitted',
        description: 'We\'ll review your request and get back to you soon.',
      });
      setUpgradeDialogOpen(false);
      setUpgradeForm({ tier: 'starter', companyName: '', useCase: '', expectedVolume: '' });
      queryClient.invalidateQueries({ queryKey: ['api-keys-manager'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to submit request',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const copyToClipboard = async (text: string, keyId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const hasSandboxKey = data?.apiKeys?.some(k => k.subscription_tier === 'free');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Key Alert */}
      {newKeyVisible && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              Your New API Key
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-500">
              Copy this key now! It will never be shown again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-background p-3 font-mono text-sm border">
                {newKeyVisible}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(newKeyVisible, 'new')}
              >
                {copiedKey === 'new' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setNewKeyVisible(null)}
            >
              I've saved my key
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="requests">
            Upgrade Requests
            {(data?.pendingRequests?.filter(r => r.request_status === 'pending').length ?? 0) > 0 && (
              <Badge variant="secondary" className="ml-2">
                {data?.pendingRequests?.filter(r => r.request_status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            {!hasSandboxKey && (
              <Button
                onClick={() => generateSandboxMutation.mutate()}
                disabled={generateSandboxMutation.isPending}
              >
                {generateSandboxMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                Get Instant Sandbox Key
              </Button>
            )}

            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Request Paid Tier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request API Key Upgrade</DialogTitle>
                  <DialogDescription>
                    Submit a request for a higher-tier API key. Our team will review and approve qualified requests.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select
                      value={upgradeForm.tier}
                      onValueChange={(v) => setUpgradeForm(f => ({ ...f, tier: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter ($149/mo - 10K calls)</SelectItem>
                        <SelectItem value="pro">Pro ($499/mo - 50K calls)</SelectItem>
                        <SelectItem value="enterprise">Enterprise ($1,500/mo - unlimited)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      placeholder="Your company name"
                      value={upgradeForm.companyName}
                      onChange={(e) => setUpgradeForm(f => ({ ...f, companyName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Use Case</Label>
                    <Textarea
                      placeholder="Describe how you'll use the API..."
                      value={upgradeForm.useCase}
                      onChange={(e) => setUpgradeForm(f => ({ ...f, useCase: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Monthly Volume</Label>
                    <Input
                      placeholder="e.g., 25,000 API calls"
                      value={upgradeForm.expectedVolume}
                      onChange={(e) => setUpgradeForm(f => ({ ...f, expectedVolume: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => requestUpgradeMutation.mutate()}
                  disabled={requestUpgradeMutation.isPending}
                  className="w-full"
                >
                  {requestUpgradeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Submit Request
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* API Keys List */}
          {data?.apiKeys?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Key className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No API Keys Yet</h3>
                <p className="text-muted-foreground mt-1">
                  Generate a free sandbox key to start integrating the LeafEngines API.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data?.apiKeys?.map((key) => (
                <Card key={key.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{key.key_name}</span>
                          <Badge variant={key.subscription_tier === 'free' ? 'secondary' : 'default'}>
                            {key.subscription_tier}
                          </Badge>
                          {!key.is_active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {key.rate_limit} req/hr
                          </span>
                          <span>
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </span>
                          {key.last_used_at && (
                            <span>
                              Last used {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {data?.pendingRequests?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No Upgrade Requests</h3>
                <p className="text-muted-foreground mt-1">
                  When you request a paid tier, it will appear here for tracking.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data?.pendingRequests?.map((request) => (
                <Card key={request.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{request.requested_tier} Tier Request</span>
                          <Badge
                            variant={
                              request.request_status === 'approved' ? 'default' :
                              request.request_status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {request.request_status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {request.request_status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.request_status}
                          </Badge>
                        </div>
                        {request.company_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.company_name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(request.created_at).toLocaleDateString()}
                        </p>
                        {request.admin_notes && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded">
                            {request.admin_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default APIKeyManager;
