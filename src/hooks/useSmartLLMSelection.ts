import { useState, useEffect } from 'react';
import { localLLMService, LocalLLMConfig } from '@/services/localLLMService';

/**
 * TurboQuant Impact Notes (March 2026)
 * 
 * Google's TurboQuant compresses KV caches from 16-bit to 3-bit with zero accuracy loss.
 * This changes the local vs cloud calculus significantly:
 * 
 * Before TurboQuant:
 *   - Gemma 2B: ~2-4 GB KV cache, only viable local option on mobile
 *   - Gemma 7B: ~8-16 GB KV cache, desktop-only
 *   - Local mode only competitive for simple queries
 * 
 * After TurboQuant:
 *   - Gemma 2B: ~0.5-0.7 GB KV cache, runs on any device
 *   - Gemma 7B: ~1.3-2.7 GB KV cache, now viable on 4GB+ mobile devices
 *   - Local mode competitive with cloud for most agricultural queries
 *   - Context windows 4-6x larger — full-season history fits in single pass
 * 
 * When TurboQuant lands in onnxruntime-web or @huggingface/transformers:
 *   - Update model selection to prefer 7B over 2B on capable devices
 *   - Raise the 'slow_connection' threshold — local is now good enough for complex tasks
 *   - Lower battery-mode penalty — 3-bit KV cache uses less memory bandwidth
 * 
 * For BitNet Phase 3 (native, Q3-Q4 2026):
 *   - 1-bit weights (BitNet) + 3-bit KV cache (TurboQuant) = maximum compression
 *   - 70B models feasible on 8GB tablets, 100B+ on 16GB laptops
 *   - See docs/BITNET_PHASE3_ENHANCEMENT.md for full analysis
 */

export interface SmartLLMState {
  useLocalLLM: boolean;
  reason: 'manual' | 'offline' | 'slow_connection' | 'privacy_mode' | 'battery_saving' | 'auto_fallback';
  isOnline: boolean;
  connectionSpeed: 'fast' | 'slow' | 'unknown';
  localLLMReady: boolean;
  /** Whether TurboQuant KV compression is available in the current runtime */
  turboQuantAvailable: boolean;
}

export function useSmartLLMSelection(initialConfig?: LocalLLMConfig) {
  const [state, setState] = useState<SmartLLMState>({
    useLocalLLM: false,
    reason: 'manual',
    isOnline: navigator.onLine,
    connectionSpeed: 'unknown',
    localLLMReady: false,
    // TurboQuant: Will be set to true once onnxruntime-web or
    // @huggingface/transformers ships 3-bit KV cache quantization support.
    // When true, local model thresholds shift: 7B becomes mobile-viable,
    // context windows expand 4-6x, and local mode competes with cloud.
    turboQuantAvailable: false
  });

  const [localLLMConfig, setLocalLLMConfig] = useState<LocalLLMConfig>(
    initialConfig || {
      model: 'gemma-2b',
      maxTokens: 256,
      temperature: 0.7
    }
  );

  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

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
  }, []);

  // Monitor local LLM readiness
  useEffect(() => {
    const checkLocalLLMStatus = () => {
      const ready = localLLMService.isAvailable();
      setState(prev => ({ ...prev, localLLMReady: ready }));
      
      if (ready && !navigator.onLine) {
        setState(prev => ({ 
          ...prev, 
          useLocalLLM: true, 
          reason: 'offline' 
        }));
      }
    };

    const interval = setInterval(checkLocalLLMStatus, 2000);
    checkLocalLLMStatus(); // Initial check

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

        const speed = latency > 2000 ? 'slow' : 'fast';
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
    const interval = setInterval(measureConnectionSpeed, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [state.isOnline, state.localLLMReady, manualOverride]);

  const evaluateOptimalChoice = () => {
    if (manualOverride !== null) return; // User has made manual choice

    // Auto-switch logic
    if (!state.isOnline && state.localLLMReady) {
      setState(prev => ({ ...prev, useLocalLLM: true, reason: 'offline' }));
    } else if (state.isOnline && state.connectionSpeed === 'slow' && state.localLLMReady) {
      setState(prev => ({ ...prev, useLocalLLM: true, reason: 'slow_connection' }));
    } else if (state.isOnline && state.connectionSpeed === 'fast') {
      setState(prev => ({ ...prev, useLocalLLM: false, reason: 'auto_fallback' }));
    }
  };

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
      setState(prev => ({ 
        ...prev, 
        useLocalLLM: true, 
        reason: 'battery_saving' 
      }));
      setManualOverride(true);
    }
  };

  const getStatusMessage = () => {
    switch (state.reason) {
      case 'offline':
        return 'Using offline mode - no internet connection';
      case 'slow_connection':
        return 'Using local mode - slow internet detected';
      case 'privacy_mode':
        return 'Privacy mode - data stays on your device';
      case 'battery_saving':
        return 'Battery saving mode - reduced network usage';
      case 'auto_fallback':
        return 'Auto-selected cloud mode for best performance';
      case 'manual':
        return state.useLocalLLM ? 'Manual offline mode' : 'Manual cloud mode';
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