import { useCallback } from 'react';
import { hapticService } from '@/services/hapticService';

/**
 * Hook for using haptic feedback in components
 * Provides convenient methods for triggering haptic feedback
 */
export const useHaptics = () => {
  const light = useCallback(() => {
    hapticService.light();
  }, []);

  const medium = useCallback(() => {
    hapticService.medium();
  }, []);

  const heavy = useCallback(() => {
    hapticService.heavy();
  }, []);

  const success = useCallback(() => {
    hapticService.success();
  }, []);

  const warning = useCallback(() => {
    hapticService.warning();
  }, []);

  const error = useCallback(() => {
    hapticService.error();
  }, []);

  const selectionChanged = useCallback(() => {
    hapticService.selectionChanged();
  }, []);

  const vibratePattern = useCallback((pattern: number | number[]) => {
    hapticService.vibratePattern(pattern);
  }, []);

  /**
   * Trigger haptic feedback based on interaction type
   */
  const trigger = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection') => {
    switch (type) {
      case 'light':
        light();
        break;
      case 'medium':
        medium();
        break;
      case 'heavy':
        heavy();
        break;
      case 'success':
        success();
        break;
      case 'warning':
        warning();
        break;
      case 'error':
        error();
        break;
      case 'selection':
        selectionChanged();
        break;
    }
  }, [light, medium, heavy, success, warning, error, selectionChanged]);

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selectionChanged,
    vibratePattern,
    trigger,
  };
};
