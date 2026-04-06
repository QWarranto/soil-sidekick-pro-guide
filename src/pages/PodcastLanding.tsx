import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Key, Copy, CheckCircle, Loader2, Rocket, Radio, ExternalLink,
  Cpu, Globe, Leaf, Shield, Zap, ArrowRight
} from 'lucide-react';

export default function PodcastLanding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Track podcast funnel visit
  useState(() => {
    supabase.from('conversion_funnel').insert({
      event_type: 'podcast_landing_visit',
      source_channel: 'podcast',
      metadata: { referrer: document.referrer, timestamp: new Date().toISOString() }
    }).then(() => {});
  });

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('api-key-request', {
        body: { action: 'generate_sandbox' }
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      if (data.apiKey?.key) {
        setGeneratedKey(data.apiKey.key);
        // Track conversion
        supabase.from('conversion_funnel').insert({
          event_type: 'podcast_sandbox_key_generated',
          source_channel: 'podcast',
          user_id: user?.id,
          metadata: { key_prefix: data.apiKey.key.substring(0, 12) }
        }).then(() => {});
      }
      toast({ title: 'Sandbox API Key Generated!', description: 'Copy your key — it won\'t be shown again.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Generation failed', description: error.message, variant: 'destructive' });
    }
  });

  const copyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const tiers = [
    {
      name: 'Free (Sandbox)',
      price: '$0',
      endpoints: ['get-soil-data', 'county-lookup'],
      limit: '100 req/hr',
      highlight: true,
    },
    {
      name: 'Starter',
      price: '$149/mo',
      endpoints: ['water-quality', 'dynamic-care', 'safe-identification', 'seasonal-planning', 'beginner-guidance', 'sensor-data-quality', 'smart-report-summary', 'multi-parameter-planting-calendar'],
      limit: '10K req/mo',
    },
    {
      name: 'Pro',
      price: '$499/mo',
      endpoints: ['agricultural-intelligence', 'carbon-credit-calculator', 'generate-vrt-prescription', 'environmental-impact-engine', 'live-agricultural-data', 'plant-id-comparison', 'isobus-task'],
      limit: '50K req/mo',
    },
    {
      name: 'Enterprise',
      price: '$1,500/mo',
      endpoints: ['gpt5-chat', 'visual-crop-analysis', 'geo-consumption-analytics'],
      limit: 'Unlimited',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container max-w-5xl py-16 md:py-24 relative">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="gap-1">
              <Radio className="h-3 w-3" /> Podcast Exclusive
            </Badge>
            <Badge variant="outline">Listener Access</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            LeafEngines API — <span className="text-primary">Data Integrity at the Edge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            20 environmental intelligence endpoints. Offline-first architecture.
            Get your sandbox key instantly and start building.
          </p>

          {/* Key Generation CTA */}
          {!user && !loading ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => navigate('/auth?redirect=/podcast-api')}>
                <Key className="mr-2 h-5 w-5" />
                Sign in to Get Your Free API Key
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://flows.nodered.org/node/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Node-RED Flows Library
                </a>
              </Button>
            </div>
          ) : generatedKey ? (
            <Card className="max-w-xl border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Your Sandbox API Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-background p-3 font-mono text-sm border break-all">
                    {generatedKey}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyKey}>
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Copy this key now — it will not be shown again.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => generateKeyMutation.mutate()}
                disabled={generateKeyMutation.isPending}
              >
                {generateKeyMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-5 w-5" />
                )}
                Get Instant Sandbox Key
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://flows.nodered.org/node/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Node-RED Flows Library
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Value Props */}
      <section className="container max-w-5xl py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Leaf, label: '20 Endpoints', desc: 'Soil, water, crop, carbon intelligence' },
            { icon: Shield, label: 'Edge-First', desc: 'Offline inference with Gemma 4 26B MoE' },
            { icon: Cpu, label: 'MCP Native', desc: 'Model Context Protocol for AI agents' },
            { icon: Globe, label: 'Node-RED Ready', desc: 'npm install node-red-contrib-leafengines' },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold">{label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Distribution Links */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Available Now</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="https://flows.nodered.org/node/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Radio className="h-5 w-5 text-primary shrink-0" />
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
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-y bg-muted/30">
        <div className="container max-w-5xl py-12">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">cURL</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-background rounded p-4 text-sm overflow-x-auto border">
{`curl -X POST \\
  https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1/get-soil-data \\
  -H "apikey: <SUPABASE_ANON_KEY>" \\
  -H "x-api-key: ak_sandbox_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"fips_code":"06037"}'`}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Node-RED</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-background rounded p-4 text-sm overflow-x-auto border">
{`npm install node-red-contrib-leafengines

// Drag "soil-data" node onto canvas
// Paste your ak_sandbox_ key
// Connect to inject → soil-data → debug
// Deploy and watch data flow`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="container max-w-5xl py-12">
        <h2 className="text-2xl font-bold mb-6">API Tiers & Endpoints</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <span className="font-bold text-primary">{tier.price}</span>
                </div>
                <CardDescription>{tier.limit}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {tier.endpoints.map((ep) => (
                    <Badge key={ep} variant="secondary" className="text-xs font-mono">
                      {ep}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contributor Program CTA */}
      <section className="border-t bg-muted/30">
        <div className="container max-w-5xl py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Contributor Program</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Build an integration, submit a Node-RED node, or contribute domain expertise
            to earn a <strong>Founders Series API key</strong> with lifetime pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/api-keys')}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Manage API Keys
            </Button>
            <Button variant="outline" asChild>
              <a href="https://flows.nodered.org/node/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer">
                <Zap className="mr-2 h-4 w-4" />
                Node-RED Flows Library
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/QWarranto/node-red-contrib-leafengines" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
