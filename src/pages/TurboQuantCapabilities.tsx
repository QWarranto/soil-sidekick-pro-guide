import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { TurboQuantStatus } from '@/components/sdk/TurboQuantStatus';
import { supabase } from '@/integrations/supabase/client';
import { Cpu, Zap, Cloud, Wifi, WifiOff, Activity, Timer, HardDrive, Loader2 } from 'lucide-react';

interface CapabilitiesResult {
  supported: boolean;
  recommended_model: string;
  max_context_tokens: number;
  estimated_kv_cache_gb: number;
  kv_compression_ratio: string;
  estimated_latency_ms: { first_token: number; per_token: number };
  runtime_tier: string;
}

export default function TurboQuantCapabilities() {
  const [memoryGb, setMemoryGb] = useState(4);
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [platform, setPlatform] = useState('browser');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CapabilitiesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localResult, setLocalResult] = useState<CapabilitiesResult | null>(null);

  // Detect actual device capabilities
  const detectDevice = () => {
    const nav = navigator as any;
    const detectedMemory = nav.deviceMemory ?? 4;
    const detectedGPU = !!nav.gpu;
    setMemoryGb(detectedMemory);
    setHasWebGPU(detectedGPU);
    setPlatform(
      /Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'browser'
    );
  };

  // Client-side resolution (no auth needed)
  const resolveLocal = () => {
    const mem = memoryGb;
    const gpu = hasWebGPU;

    if (mem >= 8) {
      setLocalResult({
        supported: true,
        recommended_model: 'gemma-7b-tq',
        max_context_tokens: 24576,
        estimated_kv_cache_gb: 1.3,
        kv_compression_ratio: '5.3x',
        estimated_latency_ms: { first_token: gpu ? 120 : 280, per_token: gpu ? 8 : 22 },
        runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
      });
    } else if (mem >= 4) {
      setLocalResult({
        supported: true,
        recommended_model: 'gemma-7b-tq',
        max_context_tokens: 16384,
        estimated_kv_cache_gb: 1.3,
        kv_compression_ratio: '5.3x',
        estimated_latency_ms: { first_token: gpu ? 180 : 400, per_token: gpu ? 12 : 30 },
        runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
      });
    } else if (mem >= 2) {
      setLocalResult({
        supported: true,
        recommended_model: 'gemma-2b',
        max_context_tokens: 8192,
        estimated_kv_cache_gb: 0.5,
        kv_compression_ratio: '5.3x',
        estimated_latency_ms: { first_token: gpu ? 90 : 200, per_token: gpu ? 6 : 18 },
        runtime_tier: gpu ? 'webgpu' : 'wasm_tq',
      });
    } else {
      setLocalResult({
        supported: false,
        recommended_model: 'gemma-2b',
        max_context_tokens: 4096,
        estimated_kv_cache_gb: 0.5,
        kv_compression_ratio: '5.3x',
        estimated_latency_ms: { first_token: 500, per_token: 40 },
        runtime_tier: 'cloud_fallback',
      });
    }
  };

  // Server-side resolution (requires Professional subscription)
  const resolveServer = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('turbo-quant-capabilities', {
        body: { device_memory_gb: memoryGb, has_webgpu: hasWebGPU, platform },
      });
      if (fnError) throw fnError;
      setResult(data as CapabilitiesResult);
    } catch (e: any) {
      setError(e.message || 'Failed to invoke edge function');
    } finally {
      setLoading(false);
    }
  };

  const activeResult = result || localResult;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TurboQuant Capabilities Tester</h1>
        <p className="text-muted-foreground mt-1">
          Probe the TurboQuant 3-bit KV cache capability resolver with custom or auto-detected device specs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cpu className="h-5 w-5" /> Device Parameters
          </CardTitle>
          <CardDescription>
            Configure device specs manually or auto-detect from your current browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={detectDevice}>
              <Activity className="h-4 w-4 mr-2" /> Auto-Detect Device
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Device Memory (GB)</Label>
              <Slider
                value={[memoryGb]}
                onValueChange={([v]) => setMemoryGb(v)}
                min={1}
                max={32}
                step={1}
              />
              <p className="text-sm text-muted-foreground text-center font-mono">{memoryGb} GB</p>
            </div>

            <div className="space-y-2">
              <Label>WebGPU Available</Label>
              <div className="flex items-center gap-2 pt-1">
                <Switch checked={hasWebGPU} onCheckedChange={setHasWebGPU} />
                <span className="text-sm text-muted-foreground">{hasWebGPU ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="browser">Browser (Desktop)</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="embedded">Embedded / IoT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button onClick={resolveLocal} variant="secondary">
              <Cpu className="h-4 w-4 mr-2" /> Resolve Locally
            </Button>
            <Button onClick={resolveServer} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Cloud className="h-4 w-4 mr-2" />}
              Resolve via Edge Function
            </Button>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {activeResult && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" /> Recommendation
                {result ? (
                  <Badge variant="default">Server</Badge>
                ) : (
                  <Badge variant="secondary">Local</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Supported" value={activeResult.supported ? '✅ Yes' : '❌ No — Cloud Fallback'} />
              <Row label="Recommended Model" value={activeResult.recommended_model} />
              <Row label="Runtime Tier" value={activeResult.runtime_tier} />
              <Row label="Max Context" value={`${(activeResult.max_context_tokens / 1024).toFixed(0)}K tokens`} />
              <Row label="KV Cache Size" value={`~${activeResult.estimated_kv_cache_gb.toFixed(1)} GB (3-bit)`} />
              <Row label="Compression" value={activeResult.kv_compression_ratio} />
              <Separator />
              <Row label="First Token Latency" value={`${activeResult.estimated_latency_ms.first_token} ms`} />
              <Row label="Per-Token Latency" value={`${activeResult.estimated_latency_ms.per_token} ms`} />
            </CardContent>
          </Card>

          <TurboQuantStatus
            active={activeResult.supported}
            runtimeTier={activeResult.runtime_tier as any}
            model={activeResult.recommended_model}
            kvCacheGB={activeResult.estimated_kv_cache_gb}
            maxContextTokens={activeResult.max_context_tokens}
            isOnline={navigator.onLine}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><strong>Local resolve</strong> runs the same logic as the edge function but entirely in-browser — no auth required.</li>
            <li><strong>Edge function resolve</strong> calls <code>/turbo-quant-capabilities</code> (requires Professional subscription + auth).</li>
            <li>TurboQuant compresses KV caches from 16-bit → 3-bit with zero accuracy loss, enabling Gemma 7B on 4 GB devices.</li>
            <li>The <code>TurboQuantStatus</code> widget below the results is the same SDK component available to licensees.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
