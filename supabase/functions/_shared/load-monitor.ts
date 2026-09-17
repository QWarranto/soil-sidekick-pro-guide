/**
 * Load Monitoring and Shedding
 * Protects system under extreme load
 */

import { rateLimiter, API_PROVIDERS } from './api-rate-limiter.ts';

export interface LoadMetrics {
  timestamp: number;
  activeRequests: number;
  queuedRequests: number;
  circuitBreakersOpen: string[];
  systemHealthScore: number; // 0-100
}

class LoadMonitor {
  private activeRequests: Map<string, number> = new Map();
  private metricsHistory: LoadMetrics[] = [];
  private readonly MAX_CONCURRENT_REQUESTS = 50;
  private readonly CRITICAL_QUEUE_SIZE = 75;

  /**
   * Check if system can accept new request
   */
  canAcceptRequest(tier: 'starter' | 'professional' | 'custom'): {
    allowed: boolean;
    reason?: string;
    suggestedAction?: string;
  } {
    const totalActive = Array.from(this.activeRequests.values()).reduce((sum, count) => sum + count, 0);

    // Load shedding under extreme pressure
    if (totalActive >= this.MAX_CONCURRENT_REQUESTS) {
      // Custom tier gets priority
      if (tier !== 'custom') {
        return {
          allowed: false,
          reason: 'System at capacity',
          suggestedAction: 'Retry in 30 seconds or upgrade to Custom tier for priority access'
        };
      }
    }

    // Check queue sizes
    const queueSizes = this.getQueueSizes();
    if (queueSizes.total >= this.CRITICAL_QUEUE_SIZE) {
      if (tier === 'starter') {
        return {
          allowed: false,
          reason: 'High system load - Starter tier requests paused',
          suggestedAction: 'Upgrade to Professional or Custom tier for guaranteed access'
        };
      }
    }

    // Check circuit breakers
    const openCircuits = this.getOpenCircuits();
    if (openCircuits.length >= 2) {
      return {
        allowed: false,
        reason: `Multiple external APIs unavailable: ${openCircuits.join(', ')}`,
        suggestedAction: 'System is in degraded state. Try again in 5 minutes.'
      };
    }

    return { allowed: true };
  }

  /**
   * Register request start
   */
  startRequest(provider: string): void {
    const current = this.activeRequests.get(provider) || 0;
    this.activeRequests.set(provider, current + 1);
  }

  /**
   * Register request end
   */
  endRequest(provider: string): void {
    const current = this.activeRequests.get(provider) || 0;
    if (current > 0) {
      this.activeRequests.set(provider, current - 1);
    }
  }

  /**
   * Get current system health
   */
  getSystemHealth(): LoadMetrics {
    const totalActive = Array.from(this.activeRequests.values()).reduce((sum, count) => sum + count, 0);
    const queueSizes = this.getQueueSizes();
    const openCircuits = this.getOpenCircuits();

    // Calculate health score (0-100)
    let healthScore = 100;
    
    // Deduct for active load
    healthScore -= (totalActive / this.MAX_CONCURRENT_REQUESTS) * 40;
    
    // Deduct for queued requests
    healthScore -= (queueSizes.total / this.CRITICAL_QUEUE_SIZE) * 30;
    
    // Deduct for open circuits
    healthScore -= openCircuits.length * 15;

    healthScore = Math.max(0, Math.min(100, healthScore));

    const metrics: LoadMetrics = {
      timestamp: Date.now(),
      activeRequests: totalActive,
      queuedRequests: queueSizes.total,
      circuitBreakersOpen: openCircuits,
      systemHealthScore: Math.round(healthScore),
    };

    // Keep last 100 metrics for trending
    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }

    return metrics;
  }

  /**
   * Get queue sizes across all providers
   */
  private getQueueSizes(): { total: number; byProvider: Record<string, number> } {
    const byProvider: Record<string, number> = {};
    let total = 0;

    Object.keys(API_PROVIDERS).forEach(provider => {
      const status = rateLimiter.getStatus(provider);
      byProvider[provider] = status.queueLength;
      total += status.queueLength;
    });

    return { total, byProvider };
  }

  /**
   * Get list of providers with open circuit breakers
   */
  private getOpenCircuits(): string[] {
    return Object.keys(API_PROVIDERS).filter(provider => {
      const status = rateLimiter.getStatus(provider);
      return status.circuitOpen;
    });
  }

  /**
   * Get metrics trends
   */
  getTrends(lastNMinutes: number = 5): {
    avgHealth: number;
    peakLoad: number;
    circuitBreakerEvents: number;
  } {
    const cutoff = Date.now() - (lastNMinutes * 60 * 1000);
    const recentMetrics = this.metricsHistory.filter(m => m.timestamp > cutoff);

    if (recentMetrics.length === 0) {
      return { avgHealth: 100, peakLoad: 0, circuitBreakerEvents: 0 };
    }

    const avgHealth = recentMetrics.reduce((sum, m) => sum + m.systemHealthScore, 0) / recentMetrics.length;
    const peakLoad = Math.max(...recentMetrics.map(m => m.activeRequests));
    const circuitBreakerEvents = recentMetrics.filter(m => m.circuitBreakersOpen.length > 0).length;

    return {
      avgHealth: Math.round(avgHealth),
      peakLoad,
      circuitBreakerEvents,
    };
  }
}

// Global singleton
export const loadMonitor = new LoadMonitor();
