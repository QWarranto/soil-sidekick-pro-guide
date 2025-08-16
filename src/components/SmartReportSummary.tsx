import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Sparkles, RefreshCw, AlertCircle, Cpu, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LocalLLMToggle } from './LocalLLMToggle';
import { localLLMService, LocalLLMConfig } from '@/services/localLLMService';
import { useSmartLLMSelection } from '@/hooks/useSmartLLMSelection';

interface SmartReportSummaryProps {
  reportType: 'soil' | 'water';
  reportData: any;
  autoGenerate?: boolean;
}

export const SmartReportSummary: React.FC<SmartReportSummaryProps> = ({
  reportType,
  reportData,
  autoGenerate = false
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const {
    state: smartState,
    localLLMConfig,
    setLocalLLMConfig,
    setManualMode,
    enableAutoMode,
    enablePrivacyMode,
    enableBatterySavingMode,
    getStatusMessage,
    isAutoMode
  } = useSmartLLMSelection({
    model: 'gemma-2b',
    maxTokens: 256,
    temperature: 0.7
  });
  
  const { toast } = useToast();

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (smartState.useLocalLLM) {
        // Use local LLM
        const summary = await localLLMService.generateSummary(
          reportType,
          reportData,
          localLLMConfig
        );
        setSummary(summary);
        setModelUsed(`${localLLMConfig.model}-local`);
        toast({
          title: "Summary Generated",
          description: `Executive summary created using local ${localLLMConfig.model} model`,
        });
      } else {
        // Use cloud LLM
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Authentication required');
        }

        const response = await supabase.functions.invoke('smart-report-summary', {
          body: {
            reportType,
            reportData
          }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to generate summary');
        }

        if (response.data?.success) {
          setSummary(response.data.summary.content);
          setModelUsed(response.data.modelUsed);
          toast({
            title: "Summary Generated",
            description: `Executive summary created using ${response.data.modelUsed.toUpperCase()}`,
          });
        } else {
          throw new Error(response.data?.error || 'Failed to generate summary');
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate summary';
      setError(errorMessage);
      toast({
        title: "Summary Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoGenerate && reportData) {
      generateSummary();
    }
  }, [autoGenerate, reportData]);

  if (!summary && !isLoading && !error) {
    return (
      <div className="space-y-4">
        <LocalLLMToggle
          enabled={smartState.useLocalLLM}
          onToggle={setManualMode}
          onConfigChange={setLocalLLMConfig}
          currentConfig={localLLMConfig}
          smartState={smartState}
          onEnableAutoMode={enableAutoMode}
          onEnablePrivacyMode={enablePrivacyMode}
          onEnableBatterySaving={enableBatterySavingMode}
          isAutoMode={isAutoMode}
        />
        
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {smartState.useLocalLLM ? <Cpu className="h-5 w-5 text-primary" /> : <Brain className="h-5 w-5 text-primary" />}
              AI Executive Summary
              <Badge variant="outline" className="ml-2">
                {smartState.useLocalLLM ? `${localLLMConfig.model} Local` : 'GPT-5 Enhanced'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Generate an intelligent executive summary of your {reportType} analysis using {smartState.useLocalLLM ? 'local offline AI' : 'advanced cloud AI reasoning'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateSummary} className="w-full" disabled={smartState.useLocalLLM && !localLLMService.isAvailable()}>
              {smartState.useLocalLLM ? <Cpu className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate Smart Summary
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LocalLLMToggle
        enabled={smartState.useLocalLLM}
        onToggle={setManualMode}
        onConfigChange={setLocalLLMConfig}
        currentConfig={localLLMConfig}
        smartState={smartState}
        onEnableAutoMode={enableAutoMode}
        onEnablePrivacyMode={enablePrivacyMode}
        onEnableBatterySaving={enableBatterySavingMode}
        isAutoMode={isAutoMode}
      />
      
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {modelUsed.includes('local') ? <Cpu className="h-5 w-5 text-primary" /> : <Brain className="h-5 w-5 text-primary" />}
                AI Executive Summary
                {modelUsed && (
                  <Badge variant={modelUsed.includes('gpt-5') ? 'default' : modelUsed.includes('local') ? 'outline' : 'secondary'}>
                    {modelUsed.includes('local') ? 
                      modelUsed.replace('-local', '').toUpperCase() + ' (Local)' : 
                      modelUsed.toUpperCase()
                    }
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Intelligent analysis powered by {modelUsed.includes('local') ? 'local offline AI' : 'advanced cloud AI reasoning'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSummary}
              disabled={isLoading || (smartState.useLocalLLM && !localLLMService.isAvailable())}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2 mt-4">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-75" />
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150" />
              <span className="text-xs text-muted-foreground ml-2">
                AI analyzing your {reportType} data...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Summary Generation Failed</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div 
              className="text-sm leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                   .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                   .replace(/•/g, '•')
              }} 
            />
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};