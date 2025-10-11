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

export class ServiceWorkerErrorTracker {
  private static messageChannel: MessageChannel | null = null;

  // Get all errors from service worker
  static async getErrors(): Promise<ServiceWorkerError[]> {
    if (!navigator.serviceWorker.controller) {
      console.warn('No service worker controller available');
      return [];
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.errors) {
          resolve(event.data.errors);
        } else {
          reject(new Error(event.data.error || 'Failed to get errors'));
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_ERROR_LOG' },
        [messageChannel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
  }

  // Clear all errors from service worker
  static async clearErrors(): Promise<boolean> {
    if (!navigator.serviceWorker.controller) {
      console.warn('No service worker controller available');
      return false;
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(true);
        } else {
          reject(new Error(event.data.error || 'Failed to clear errors'));
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_ERROR_LOG' },
        [messageChannel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
  }

  // Get error statistics
  static async getErrorStats(): Promise<ErrorStats> {
    const errors = await this.getErrors();
    
    const errorsByContext: { [key: string]: number } = {};
    errors.forEach((error) => {
      errorsByContext[error.context] = (errorsByContext[error.context] || 0) + 1;
    });

    // Calculate error rate (errors per hour in last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentErrors = errors.filter(e => e.timestamp > oneDayAgo);
    const errorRate = recentErrors.length / 24;

    return {
      totalErrors: errors.length,
      errorsByContext,
      recentErrors: errors.slice(-10).reverse(), // Last 10 errors
      errorRate,
    };
  }

  // Check service worker health
  static async checkHealth(): Promise<{
    isActive: boolean;
    isControlling: boolean;
    hasErrors: boolean;
    errorCount: number;
  }> {
    const registration = await navigator.serviceWorker.getRegistration();
    const errors = await this.getErrors();

    return {
      isActive: !!registration?.active,
      isControlling: !!navigator.serviceWorker.controller,
      hasErrors: errors.length > 0,
      errorCount: errors.length,
    };
  }

  // Force service worker update
  static async forceUpdate(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('No service worker registration found');
      }

      await registration.update();
      return true;
    } catch (error) {
      console.error('Failed to update service worker:', error);
      return false;
    }
  }

  // Unregister service worker (for troubleshooting)
  static async unregister(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return false;
      }

      await registration.unregister();
      return true;
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
      return false;
    }
  }
}
