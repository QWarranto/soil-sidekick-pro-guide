import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, Wifi, WifiOff, Download, AlertCircle, Check, Zap, Shield, Battery, Gauge, Info } from 'lucide-react';
import { localLLMService, LocalLLMConfig } from '@/services/localLLMService';
import { useToast } from '@/hooks/use-toast';
import { SmartLLMState } from '@/hooks/useSmartLLMSelection';

interface LocalLLMToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigChange: (config: LocalLLMConfig) => void;
  currentConfig: LocalLLMConfig;
  smartState?: SmartLLMState;
  onEnableAutoMode?: () => void;
  onEnablePrivacyMode?: () => void;
  onEnableBatterySaving?: () => void;
  isAutoMode?: boolean;
}

export function LocalLLMToggle({ 
  enabled, 
  onToggle, 
  onConfigChange, 
  currentConfig, 
  smartState,
  onEnableAutoMode,
  onEnablePrivacyMode,
  onEnableBatterySaving,
  isAutoMode = false
}: LocalLLMToggleProps) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [webGPUSupported, setWebGPUSupported] = useState<boolean | null>(null);
  const [turboQuantDetected, setTurboQuantDetected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkCapabilities();
  }, []);

  const checkCapabilities = async () => {
    const gpuSupported = await localLLMService.checkWebGPUSupport();
    setWebGPUSupported(gpuSupported);
    const tqSupported = localLLMService.detectTurboQuantSupport();
    setTurboQuantDetected(tqSupported);
  };

  const handleToggle = async (checked: boolean) => {
    // Before TurboQuant: WebGPU was required — blocked ~30% of users
    // After TurboQuant: WASM + 3-bit KV cache is a viable tier, so we
    // only warn instead of blocking when WebGPU is unavailable
    if (checked && !isInitialized) {
      setIsInitializing(true);
      try {
        await localLLMService.initialize(currentConfig);
        setIsInitialized(true);

        const status = localLLMService.getStatus();
        const deviceLabel = status.device === 'webgpu' ? 'WebGPU' : 'WASM (CPU)';
        const tqLabel = status.turboQuantActive ? ' + TurboQuant' : '';

        onToggle(true);
        toast({
          title: "Offline Mode Enabled",
          description: `${currentConfig.model} running on ${deviceLabel}${tqLabel}. ${
            status.turboQuantActive 
              ? 'TurboQuant 3-bit KV cache active — 6x memory savings.' 
              : 'Standard KV cache mode.'
          }`,
        });
      } catch (error) {
        console.error('Failed to initialize local LLM:', error);
        toast({
          title: "Initialization Failed",
          description: "Failed to load the local AI model. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    } else {
      onToggle(checked);
    }
  };

  const handleModelChange = (model: 'gemma-2b' | 'gemma-7b') => {
    const newConfig = { ...currentConfig, model };
    onConfigChange(newConfig);
    
    // Reset initialization if model changes
    if (enabled && isInitialized) {
      setIsInitialized(false);
      localLLMService.clearKVCache();
      onToggle(false);
    }
  };

  const handleMaxTokensChange = (tokens: string) => {
    const newConfig = { ...currentConfig, maxTokens: parseInt(tokens) };
    onConfigChange(newConfig);
  };

  const handleKVCacheModeChange = (mode: 'none' | '3bit') => {
    const newConfig = { ...currentConfig, kvCacheMode: mode, reuseKVCache: mode === '3bit' };
    onConfigChange(newConfig);

    if (enabled && isInitialized) {
      setIsInitialized(false);
      localLLMService.clearKVCache();
      onToggle(false);
    }
  };

  const estimatedKVCache = localLLMService.estimateKVCacheGB(
    currentConfig.model, 
    currentConfig.kvCacheMode || 'none'
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Offline AI Mode
          {turboQuantDetected && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Zap className="h-3 w-3 mr-1" />
              TurboQuant
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Use local Gemma models for agricultural intelligence without internet connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Before TurboQuant: hard block on non-WebGPU browsers
            After TurboQuant: informational warning — WASM is now viable */}
        {webGPUSupported === false && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              WebGPU is not available. Local AI will run on WASM (CPU mode)
              {turboQuantDetected 
                ? ' with TurboQuant acceleration — performance will be good.'
                : ' which may be slower. Consider using Chrome or Edge for best performance.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="local-llm-toggle" className="flex items-center gap-2">
              {enabled ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              {enabled ? 'Offline Mode' : 'Online Mode'}
            </Label>
            {isInitialized && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Ready
              </Badge>
            )}
          </div>
          <Switch
            id="local-llm-toggle"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isInitializing}
          />
        </div>

        {enabled && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label>Model Selection</Label>
              <Select
                value={currentConfig.model}
                onValueChange={handleModelChange}
                disabled={isInitializing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemma-2b">
                    Gemma 2B — Fast, ~{localLLMService.estimateKVCacheGB('gemma-2b', currentConfig.kvCacheMode || 'none').toFixed(1)} GB KV cache
                  </SelectItem>
                  <SelectItem value="gemma-7b">
                    Gemma 7B — Better quality, ~{localLLMService.estimateKVCacheGB('gemma-7b', currentConfig.kvCacheMode || 'none').toFixed(1)} GB KV cache
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response Length</Label>
              <Select
                value={currentConfig.maxTokens.toString()}
                onValueChange={handleMaxTokensChange}
                disabled={isInitializing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">Short (128 tokens)</SelectItem>
                  <SelectItem value="256">Medium (256 tokens)</SelectItem>
                  <SelectItem value="512">Long (512 tokens)</SelectItem>
                  <SelectItem value="1024">Detailed (1024 tokens)</SelectItem>
                  <SelectItem value="2048">Comprehensive (2048 tokens)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* TurboQuant KV cache mode selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                KV Cache Mode
                {turboQuantDetected && (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                    TurboQuant available
                  </Badge>
                )}
              </Label>
              <Select
                value={currentConfig.kvCacheMode || 'none'}
                onValueChange={(v) => handleKVCacheModeChange(v as 'none' | '3bit')}
                disabled={isInitializing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    Standard (16-bit) — Full precision
                  </SelectItem>
                  <SelectItem value="3bit" disabled={!turboQuantDetected}>
                    TurboQuant (3-bit) — 6x less memory, zero accuracy loss
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Est. KV cache: ~{estimatedKVCache.toFixed(1)} GB
                {currentConfig.kvCacheMode === '3bit' && ' • KV cache reuse enabled for faster follow-ups'}
              </p>
            </div>

            {!isInitialized && !isInitializing && (
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  The model will be downloaded (~{currentConfig.model === 'gemma-2b' ? '1.6GB' : '4.2GB'}) 
                  and cached locally on first use. This may take a few minutes.
                </AlertDescription>
              </Alert>
            )}

            {isInitializing && (
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  Downloading and initializing {currentConfig.model} model... This may take a few minutes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
