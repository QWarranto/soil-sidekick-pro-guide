import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, Wifi, WifiOff, Download, AlertCircle, Check } from 'lucide-react';
import { localLLMService, LocalLLMConfig } from '@/services/localLLMService';
import { useToast } from '@/hooks/use-toast';

interface LocalLLMToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigChange: (config: LocalLLMConfig) => void;
  currentConfig: LocalLLMConfig;
}

export function LocalLLMToggle({ enabled, onToggle, onConfigChange, currentConfig }: LocalLLMToggleProps) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [webGPUSupported, setWebGPUSupported] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkWebGPUSupport();
  }, []);

  const checkWebGPUSupport = async () => {
    const supported = await localLLMService.checkWebGPUSupport();
    setWebGPUSupported(supported);
  };

  const handleToggle = async (checked: boolean) => {
    if (checked && !webGPUSupported) {
      toast({
        title: "WebGPU Not Supported",
        description: "Your browser doesn't support WebGPU, which is required for local AI processing.",
        variant: "destructive"
      });
      return;
    }

    if (checked && !isInitialized) {
      setIsInitializing(true);
      try {
        await localLLMService.initialize(currentConfig);
        setIsInitialized(true);
        onToggle(true);
        toast({
          title: "Offline Mode Enabled",
          description: `Local ${currentConfig.model} model is ready for offline agricultural intelligence.`,
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
      onToggle(false);
    }
  };

  const handleMaxTokensChange = (tokens: string) => {
    const newConfig = { ...currentConfig, maxTokens: parseInt(tokens) };
    onConfigChange(newConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Offline AI Mode
        </CardTitle>
        <CardDescription>
          Use local Gemma models for agricultural intelligence without internet connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {webGPUSupported === false && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              WebGPU is not supported in your browser. Please use Chrome, Edge, or another compatible browser for offline AI features.
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
            disabled={isInitializing || webGPUSupported === false}
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
                    Gemma 2B (Faster, 4GB RAM)
                  </SelectItem>
                  <SelectItem value="gemma-7b">
                    Gemma 7B (Better Quality, 8GB RAM)
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
                </SelectContent>
              </Select>
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