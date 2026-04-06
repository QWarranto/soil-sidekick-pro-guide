import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Key, CheckCircle, Loader2, ExternalLink,
  Globe, Leaf, Shield, Zap, ArrowRight, Users, Award, Rocket
} from 'lucide-react';

export default function FoundersProgram() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    useCase: '',
    githubHandle: '',
    source: '',
  });

  const requestKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('api-key-request', {
        body: {
          action: 'request_founders',
          companyName: formData.companyName,
          useCase: formData.useCase,
          expectedVolume: formData.source,
          keyName: formData.githubHandle
            ? `Founders Request (${formData.githubHandle})`
            : 'Founders Key Request',
        }
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      setSubmitted(true);
      supabase.from('conversion_funnel').insert({
        event_type: 'founders_key_requested',
        source_channel: 'founders',
        user_id: user?.id,
        metadata: { source: formData.source, github: formData.githubHandle }
      }).then(() => {});
      toast({ title: 'Request submitted!', description: 'We\'ll review your application and assign a Founders Key.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Request failed', description: error.message, variant: 'destructive' });
    }
  });

  const benefits = [
    { icon: Award, label: 'Lifetime Pricing', desc: 'Lock in Founders-only rates permanently' },
    { icon: Zap, label: 'Auto-Upgrade', desc: 'Tier upgrades triggered by usage milestones' },
    { icon: Shield, label: 'Priority Support', desc: 'Direct access to the engineering team' },
    { icon: Users, label: 'Limited to 100', desc: 'Serialized F-001 through F-100' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container max-w-5xl py-16 md:py-24 relative">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="gap-1">
              <Award className="h-3 w-3" /> Founders Series
            </Badge>
            <Badge variant="outline">Limited — 100 Keys</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            LeafEngines <span className="text-primary">Founders Program</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-4">
            Join the first 100 developers building on LeafEngines. Get a serialized
            Founders Key with lifetime pricing and automatic tier upgrades as you grow.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Discovered us via npm, Node-RED Flows, or GitHub? You're exactly who this is for.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container max-w-5xl py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold">{label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/30">
        <div className="container max-w-5xl py-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit your application below. Tell us what you're building and how you discovered LeafEngines.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We review applications manually to ensure Founders Keys go to active builders. Typical response: 24-48 hours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                  Build & Grow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Start on the free tier. Hit 500 requests and auto-upgrade to Starter. Hit 5,000 and unlock Pro. Your Founders pricing stays forever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Auto-Upgrade Thresholds */}
      <section className="container max-w-5xl py-12">
        <h2 className="text-2xl font-bold mb-6">Auto-Upgrade Milestones</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { tier: 'Free → Starter', threshold: '500 requests', endpoints: '10 endpoints', color: 'border-primary' },
            { tier: 'Starter → Pro', threshold: '5,000 requests', endpoints: '17 endpoints', color: '' },
            { tier: 'Pro → Enterprise', threshold: '25,000 requests', endpoints: '20 endpoints', color: '' },
          ].map(({ tier, threshold, endpoints, color }) => (
            <Card key={tier} className={color}>
              <CardHeader>
                <CardTitle className="text-lg">{tier}</CardTitle>
                <CardDescription>at {threshold} lifetime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{endpoints} unlocked</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="border-t bg-muted/30">
        <div className="container max-w-2xl py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Request a Founders Key</h2>

          {!user && !loading ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">Sign in to submit your Founders Key request.</p>
                <Button size="lg" onClick={() => navigate('/auth?redirect=/founders')}>
                  <Key className="mr-2 h-5 w-5" />
                  Sign in to Apply
                </Button>
              </CardContent>
            </Card>
          ) : submitted ? (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Application Received</h3>
                <p className="text-muted-foreground mb-4">
                  We'll review your request and assign a serialized Founders Key within 24-48 hours.
                  You'll receive it via email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate('/api-keys')}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Manage API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Handle (optional)</Label>
                  <Input
                    id="github"
                    placeholder="@username"
                    value={formData.githubHandle}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubHandle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization (optional)</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">What are you building? *</Label>
                  <Textarea
                    id="useCase"
                    placeholder="Describe your use case — e.g., soil monitoring dashboard, Node-RED automation, precision ag pipeline..."
                    value={formData.useCase}
                    onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">How did you find LeafEngines? *</Label>
                  <Input
                    id="source"
                    placeholder="npm, Node-RED Flows Library, GitHub, podcast, referral..."
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => requestKeyMutation.mutate()}
                  disabled={requestKeyMutation.isPending || !formData.useCase || !formData.source}
                >
                  {requestKeyMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Rocket className="mr-2 h-5 w-5" />
                  )}
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Distribution Links */}
      <section className="container max-w-5xl py-12">
        <h3 className="text-lg font-semibold mb-4 text-center">Get Started with node-red-contrib-leafengines</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <a href="https://flows.nodered.org/node/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
            <Leaf className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Node-RED Flows Library</p>
              <p className="text-xs text-muted-foreground">flows.nodered.org</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a href="https://www.npmjs.com/package/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">npm Registry</p>
              <p className="text-xs text-muted-foreground">npmjs.com</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a href="https://github.com/QWarranto/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
            <Globe className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">GitHub Repository</p>
              <p className="text-xs text-muted-foreground">Source & README</p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
        </div>
      </section>
    </div>
  );
}
