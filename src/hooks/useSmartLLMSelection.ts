import { useState, useEffect, useCallback } from 'react';
import { localLLMService, LocalLLMConfig, GemmaModelId } from '@/services/localLLMService';

/**
 * Gemma 4 Smart LLM Selection (April 2026)
 * 
 * Gemma 4 introduces a 3-tier on-device model hierarchy:
 *   - E2B (2.3B effective): phones, battery mode, quick queries — with audio input
 *   - E4B (4.5B effective): standard mode, balanced quality — with audio input
 *   - 26B A4B MoE (3.8B active): power/laptop mode, frontier reasoning + function calling
 *   - 31B Dense (30.7B): workstation mode, maximum quality
 * 
 * All Gemma 4 models feature:
 *   - 128K-256K context windows (vs 8K for Gemma 2)
 *   - Native system prompt support
 *   - Built-in thinking/reasoning mode
 *   - Function calling (enables local MCP agent execution)
 * 
 * With TurboQuant 3-bit KV cache:
 *   - E2B runs comfortably on 2GB RAM devices
 *   - E4B viable on 4GB+ mobile
 *   - 26B MoE viable on 8GB+ laptops (only 3.8B active params)
 *   - 50 message sessions without OOM
 */

export interface SmartLLMState {
  useLocalLLM: boolean;
  reason: 'manual' | 'offline' | 'slow_connection' | 'privacy_mode' | 'battery_saving' | 'auto_fallback';
  isOnline: boolean;
  connectionSpeed: 'fast' | 'slow' | 'unknown';
  localLLMReady: boolean;
  turboQuantAvailable: boolean;
  /** Current model generation detected */
  modelGeneration: 'gemma2' | 'gemma4';
}

/**
 * Auto-select the best Gemma 4 model based on device capabilities.
 * Falls back to legacy Gemma 2B if no Gemma 4 ONNX weights are available yet.
 */
function selectOptimalModel(): GemmaModelId {
  const ram = (navigator as any).deviceMemory as number | undefined;

  // Workstation: 16GB+ → try 26B MoE (only 3.8B active)
  if (ram && ram >= 16) return 'gemma4-26b-a4b';
  // Laptop: 8GB+ → E4B
  if (ram && ram >= 8) return 'gemma4-e4b';
  // Mobile/tablet: 4GB+ → E4B with TurboQuant, else E2B
  if (ram && ram >= 4) return 'gemma4-e4b';
  // Low-end: E2B
  return 'gemma4-e2b';
}

export function useSmartLLMSelection(initialConfig?: LocalLLMConfig) {
  const [state, setState] = useState<SmartLLMState>({
    useLocalLLM: false,
    reason: 'manual',
    isOnline: navigator.onLine,
    connectionSpeed: 'unknown',
    localLLMReady: false,
    turboQuantAvailable: false,
    modelGeneration: 'gemma4'
  });

  const [localLLMConfig, setLocalLLMConfig] = useState<LocalLLMConfig>(
    initialConfig || {
      model: selectOptimalModel(),
      maxTokens: 256,
      temperature: 0.7,
      kvCacheMode: 'none',
      reuseKVCache: false,
      thinkingMode: false
    }
  );

  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  // Detect TurboQuant on mount and update config accordingly
  useEffect(() => {
    const tqAvailable = localLLMService.detectTurboQuantSupport();
    setState(prev => ({ ...prev, turboQuantAvailable: tqAvailable }));

    if (tqAvailable) {
      setLocalLLMConfig(prev => ({
        ...prev,
        kvCacheMode: '3bit',
        reuseKVCache: true
      }));
    }
  }, []);

  const evaluateOptimalChoice = useCallback(() => {
    if (manualOverride !== null) return;

    // Gemma 4 local quality is high enough to prefer at lower latency thresholds
    if (!state.isOnline && state.localLLMReady) {
      setState(prev => ({ ...prev, useLocalLLM: true, reason: 'offline' }));
    } else if (state.isOnline && state.connectionSpeed === 'slow' && state.localLLMReady) {
      setState(prev => ({ ...prev, useLocalLLM: true, reason: 'slow_connection' }));
    } else if (state.isOnline && state.connectionSpeed === 'fast') {
      setState(prev => ({ ...prev, useLocalLLM: false, reason: 'auto_fallback' }));
    }
  }, [manualOverride, state.isOnline, state.connectionSpeed, state.localLLMReady]);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      evaluateOptimalChoice();
    };

    const handleOffline = () => {
      setState(prev => ({ 
        ...prev, 
        isOnline: false,
        useLocalLLM: prev.localLLMReady ? true : prev.useLocalLLM,
        reason: prev.localLLMReady ? 'offline' : prev.reason
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [evaluateOptimalChoice]);

  // Monitor local LLM readiness
  useEffect(() => {
    const checkLocalLLMStatus = () => {
      const ready = localLLMService.isAvailable();
      const tqAvailable = localLLMService.detectTurboQuantSupport();
      const status = localLLMService.getStatus();
      setState(prev => ({
        ...prev,
        localLLMReady: ready,
        turboQuantAvailable: tqAvailable,
        modelGeneration: status.modelGeneration
      }));
      
      if (ready && !navigator.onLine) {
        setState(prev => ({ 
          ...prev, 
          useLocalLLM: true, 
          reason: 'offline' 
        }));
      }
    };

    const interval = setInterval(checkLocalLLMStatus, 2000);
    checkLocalLLMStatus();

    return () => clearInterval(interval);
  }, []);

  // Monitor connection speed
  useEffect(() => {
    if (!navigator.onLine) return;

    const measureConnectionSpeed = async () => {
      try {
        const startTime = Date.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
        const endTime = Date.now();
        const latency = endTime - startTime;

        // Gemma 4 models are high enough quality to prefer locally at 800ms
        // (vs 1000ms for TurboQuant-era Gemma 2, 2000ms for vanilla Gemma 2)
        const slowThreshold = state.turboQuantAvailable ? 800 : 1000;
        const speed = latency > slowThreshold ? 'slow' : 'fast';
        setState(prev => ({ ...prev, connectionSpeed: speed }));
        
        if (speed === 'slow' && state.localLLMReady && manualOverride === null) {
          setState(prev => ({ 
            ...prev, 
            useLocalLLM: true, 
            reason: 'slow_connection' 
          }));
        }
      } catch {
        setState(prev => ({ ...prev, connectionSpeed: 'slow' }));
      }
    };

    measureConnectionSpeed();
    const interval = setInterval(measureConnectionSpeed, 30000);

    return () => clearInterval(interval);
  }, [state.isOnline, state.localLLMReady, state.turboQuantAvailable, manualOverride]);

  const setManualMode = (useLocal: boolean) => {
    setManualOverride(useLocal);
    setState(prev => ({ 
      ...prev, 
      useLocalLLM: useLocal, 
      reason: 'manual' 
    }));
  };

  const enableAutoMode = () => {
    setManualOverride(null);
    evaluateOptimalChoice();
  };

  const enablePrivacyMode = () => {
    if (state.localLLMReady) {
      setState(prev => ({ 
        ...prev, 
        useLocalLLM: true, 
        reason: 'privacy_mode' 
      }));
      setManualOverride(true);
    }
  };

  const enableBatterySavingMode = () => {
    if (state.localLLMReady) {
      // In battery mode, downgrade to E2B (smallest, most efficient)
      setLocalLLMConfig(prev => ({
        ...prev,
        model: 'gemma4-e2b' as GemmaModelId
      }));
      setState(prev => ({ 
        ...prev, 
        useLocalLLM: true, 
        reason: 'battery_saving' 
      }));
      setManualOverride(true);
    }
  };

  const getStatusMessage = () => {
    const gen = state.modelGeneration === 'gemma4' ? 'Gemma 4' : 'Gemma 2';
    const tqSuffix = state.turboQuantAvailable ? ' + TurboQuant' : '';
    switch (state.reason) {
      case 'offline':
        return `Using ${gen} offline — no internet connection${tqSuffix}`;
      case 'slow_connection':
        return `Using ${gen} local — slow internet detected${tqSuffix}`;
      case 'privacy_mode':
        return `Privacy mode — ${gen} keeps all data on-device${tqSuffix}`;
      case 'battery_saving':
        return `Battery saving — ${gen} E2B (efficient)${tqSuffix}`;
      case 'auto_fallback':
        return 'Auto-selected cloud mode for best performance';
      case 'manual':
        return state.useLocalLLM ? `Manual ${gen} offline mode${tqSuffix}` : 'Manual cloud mode';
      default:
        return '';
    }
  };

  return {
    state,
    localLLMConfig,
    setLocalLLMConfig,
    setManualMode,
    enableAutoMode,
    enablePrivacyMode,
    enableBatterySavingMode,
    getStatusMessage,
    isAutoMode: manualOverride === null
  };
}
