import { useState, useEffect } from 'react';
import { ServiceWorkerErrorTracker } from '@/services/serviceWorkerErrorTracker';

interface ServiceWorkerError {
  timestamp: number;
  message: string;
  stack?: string;
  context: string;
  userAgent: string;
  cacheVersion: string;
}

interface ErrorStats {
  totalErrors: number;
  errorsByContext: { [key: string]: number };
  recentErrors: ServiceWorkerError[];
  errorRate: number;
}

export const useServiceWorkerErrors = () => {
  const [errors, setErrors] = useState<ServiceWorkerError[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [health, setHealth] = useState({
    isActive: false,
    isControlling: false,
    hasErrors: false,
    errorCount: 0,
  });

  const loadErrors = async () => {
    try {
      setIsLoading(true);
      const [errorData, statsData, healthData] = await Promise.all([
        ServiceWorkerErrorTracker.getErrors(),
        ServiceWorkerErrorTracker.getErrorStats(),
        ServiceWorkerErrorTracker.checkHealth(),
      ]);
      
      setErrors(errorData);
      setStats(statsData);
      setHealth(healthData);
    } catch (error) {
      console.error('Failed to load service worker errors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = async () => {
    try {
      await ServiceWorkerErrorTracker.clearErrors();
      await loadErrors();
    } catch (error) {
      console.error('Failed to clear errors:', error);
    }
  };

  const forceUpdate = async () => {
    try {
      await ServiceWorkerErrorTracker.forceUpdate();
      // Reload after a short delay to allow update to complete
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Failed to update service worker:', error);
    }
  };

  const unregister = async () => {
    try {
      await ServiceWorkerErrorTracker.unregister();
      // Reload to complete unregistration
      window.location.reload();
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    }
  };

  useEffect(() => {
    loadErrors();

    // Refresh errors every 30 seconds
    const interval = setInterval(loadErrors, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    errors,
    stats,
    health,
    isLoading,
    loadErrors,
    clearErrors,
    forceUpdate,
    unregister,
  };
};
