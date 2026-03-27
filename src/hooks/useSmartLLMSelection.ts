import { useState, useEffect, useCallback } from 'react';
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
 *   - Slow connection threshold: 2000ms (conservative — local quality too low to prefer)
 *   - WASM fallback: "degraded mode" (300-800ms), blocks non-WebGPU browsers
 * 
 * After TurboQuant:
 *   - Gemma 2B: ~0.5-0.7 GB KV cache, runs on any device
 *   - Gemma 7B: ~1.3-2.7 GB KV cache, now viable on 4GB+ mobile devices
 *   - Local mode competitive with cloud for most agricultural queries
 *   - Slow connection threshold: 1000ms (more aggressive — local quality now sufficient)
 *   - WASM + TurboQuant: viable tier (~sub-200ms), no longer blocks browsers
 *   - Context windows 4-6x larger — full-season history fits in single pass
 *   - KV cache reuse saves 40-60% compute on follow-up messages
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
    turboQuantAvailable: false
  });

  const [localLLMConfig, setLocalLLMConfig] = useState<LocalLLMConfig>(
    initialConfig || {
      model: 'gemma-2b',
      maxTokens: 256,
      temperature: 0.7,
      kvCacheMode: 'none',
      reuseKVCache: false
    }
  );

  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  // Detect TurboQuant on mount and update config accordingly
  useEffect(() => {
    const tqAvailable = localLLMService.detectTurboQuantSupport();
    setState(prev => ({ ...prev, turboQuantAvailable: tqAvailable }));

    if (tqAvailable) {
      // After TurboQuant: auto-enable 3-bit KV cache and KV reuse
      setLocalLLMConfig(prev => ({
        ...prev,
        kvCacheMode: '3bit',
        reuseKVCache: true
      }));
    }
  }, []);

  const evaluateOptimalChoice = useCallback(() => {
    if (manualOverride !== null) return;

    // Before TurboQuant: slow_connection threshold was 2000ms (conservative)
    // After TurboQuant: local quality is high enough to prefer at 1000ms
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
      setState(prev => ({ ...prev, localLLMReady: ready, turboQuantAvailable: tqAvailable }));
      
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

        // Before TurboQuant: threshold was 2000ms (local quality too low to prefer)
        // After TurboQuant: threshold lowered to 1000ms (local quality now sufficient)
        const slowThreshold = state.turboQuantAvailable ? 1000 : 2000;
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
      // After TurboQuant: battery saving is even more effective because
      // 3-bit KV cache uses less memory bandwidth = less power
      setState(prev => ({ 
        ...prev, 
        useLocalLLM: true, 
        reason: 'battery_saving' 
      }));
      setManualOverride(true);
    }
  };

  const getStatusMessage = () => {
    const tqSuffix = state.turboQuantAvailable ? ' (TurboQuant active)' : '';
    switch (state.reason) {
      case 'offline':
        return `Using offline mode - no internet connection${tqSuffix}`;
      case 'slow_connection':
        return `Using local mode - slow internet detected${tqSuffix}`;
      case 'privacy_mode':
        return `Privacy mode - data stays on your device${tqSuffix}`;
      case 'battery_saving':
        return `Battery saving mode - reduced network usage${tqSuffix}`;
      case 'auto_fallback':
        return 'Auto-selected cloud mode for best performance';
      case 'manual':
        return state.useLocalLLM ? `Manual offline mode${tqSuffix}` : 'Manual cloud mode';
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
