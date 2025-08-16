import { useState, useEffect } from 'react';
import { localLLMService, LocalLLMConfig } from '@/services/localLLMService';

export interface SmartLLMState {
  useLocalLLM: boolean;
  reason: 'manual' | 'offline' | 'slow_connection' | 'privacy_mode' | 'battery_saving' | 'auto_fallback';
  isOnline: boolean;
  connectionSpeed: 'fast' | 'slow' | 'unknown';
  localLLMReady: boolean;
}

export function useSmartLLMSelection(initialConfig?: LocalLLMConfig) {
  const [state, setState] = useState<SmartLLMState>({
    useLocalLLM: false,
    reason: 'manual',
    isOnline: navigator.onLine,
    connectionSpeed: 'unknown',
    localLLMReady: false
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