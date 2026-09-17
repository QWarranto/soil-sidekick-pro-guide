import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Cpu, Wifi, WifiOff, Download, Check, Zap, Info, Mic, Eye, Wrench, Brain } from 'lucide-react';
import { localLLMService, LocalLLMConfig, GemmaModelId } from '@/services/localLLMService';
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
    if (checked && !isInitialized) {
      setIsInitializing(true);
      try {
        await localLLMService.initialize(currentConfig);
        setIsInitialized(true);

        const status = localLLMService.getStatus();
        const deviceLabel = status.device === 'webgpu' ? 'WebGPU' : 'WASM (CPU)';
        const tqLabel = status.turboQuantActive ? ' + TurboQuant' : '';
        const spec = localLLMService.getModelSpec(currentConfig.model);

        onToggle(true);
        toast({
          title: "Offline Mode Enabled",
          description: `${spec.description} on ${deviceLabel}${tqLabel}. Context: ${spec.contextWindow / 1024}K tokens.`,
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

  const handleModelChange = (model: GemmaModelId) => {
    const newConfig = { ...currentConfig, model };
    onConfigChange(newConfig);
    
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

  const handleThinkingModeChange = (checked: boolean) => {
    const newConfig = { ...currentConfig, thinkingMode: checked };
    onConfigChange(newConfig);
  };

  const spec = localLLMService.getModelSpec(currentConfig.model);
  const estimatedKVCache = localLLMService.estimateKVCacheGB(
    currentConfig.model, 
    currentConfig.kvCacheMode || 'none'
  );
  const isGemma4 = spec.generation === 'gemma4';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Offline AI Mode
          {isGemma4 && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-accent">
              Gemma 4
            </Badge>
          )}
          {turboQuantDetected && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Zap className="h-3 w-3 mr-1" />
              TurboQuant
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isGemma4
            ? 'Gemma 4 multimodal models — text, image, and audio intelligence offline'
            : 'Use local Gemma models for agricultural intelligence without internet connection'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Model Selection</Label>
              <Select
                value={currentConfig.model}
                onValueChange={(v) => handleModelChange(v as GemmaModelId)}
                disabled={isInitializing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemma4-e2b">
                    Gemma 4 E2B — {localLLMService.getModelSpec('gemma4-e2b').effectiveParams}, 128K ctx, audio+vision
                  </SelectItem>
                  <SelectItem value="gemma4-e4b">
                    Gemma 4 E4B — {localLLMService.getModelSpec('gemma4-e4b').effectiveParams}, 128K ctx, audio+vision
                  </SelectItem>
                  <SelectItem value="gemma4-26b-a4b">
                    Gemma 4 MoE — {localLLMService.getModelSpec('gemma4-26b-a4b').effectiveParams}, 256K ctx
                  </SelectItem>
                  <SelectItem value="gemma4-31b">
                    Gemma 4 31B — {localLLMService.getModelSpec('gemma4-31b').effectiveParams}, 256K ctx
                  </SelectItem>
                  <SelectItem value="gemma-2b">
                    Legacy Gemma 2B — basic (deprecated)
                  </SelectItem>
                  <SelectItem value="gemma-7b">
                    Legacy Gemma 7B — detailed (deprecated)
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Model capabilities badges */}
              {isGemma4 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {spec.supportsAudio && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Mic className="h-3 w-3" /> Audio
                    </Badge>
                  )}
                  {spec.supportsImages && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Eye className="h-3 w-3" /> Vision
                    </Badge>
                  )}
                  {spec.supportsFunctionCalling && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Wrench className="h-3 w-3" /> Tool Use
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {spec.contextWindow / 1024}K context
                  </Badge>
                </div>
              )}
            </div>

            {/* Thinking Mode (Gemma 4 only) */}
            {isGemma4 && (
              <div className="flex items-center justify-between">
                <Label htmlFor="thinking-mode" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Thinking Mode
                  <span className="text-xs text-muted-foreground">(step-by-step reasoning)</span>
                </Label>
                <Switch
                  id="thinking-mode"
                  checked={currentConfig.thinkingMode || false}
                  onCheckedChange={handleThinkingModeChange}
                  disabled={isInitializing}
                />
              </div>
            )}

            {/* Response Length */}
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

            {/* KV Cache Mode */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                KV Cache Mode
                {turboQuantDetected && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
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
                Est. KV cache: ~{estimatedKVCache.toFixed(1)} GB • Download: {spec.downloadSizeLabel}
                {currentConfig.kvCacheMode === '3bit' && ' • KV cache reuse enabled'}
              </p>
            </div>

            {/* Download prompts */}
            {!isInitialized && !isInitializing && (
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  The model will be downloaded ({spec.downloadSizeLabel}) 
                  and cached locally on first use. This may take a few minutes.
                </AlertDescription>
              </Alert>
            )}

            {isInitializing && (
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  Downloading and initializing {spec.description}... This may take a few minutes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
