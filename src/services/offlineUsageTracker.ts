import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';

interface OfflineSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  actionsPerformed: OfflineAction[];
  syncAttempts: number;
  syncSuccesses: number;
  syncFailures: number;
}

interface OfflineAction {
  type: 'create' | 'update' | 'delete';
  table: string;
  timestamp: number;
}

interface OfflineMetrics {
  totalOfflineTime: number;
  offlineSessions: number;
  actionsWhileOffline: number;
  syncSuccessRate: number;
  averageSessionDuration: number;
  mostCommonActions: { type: string; count: number }[];
}

const OFFLINE_SESSION_KEY = 'offline_current_session';
const OFFLINE_METRICS_KEY = 'offline_metrics_history';

export class OfflineUsageTracker {
  private static currentSession: OfflineSession | null = null;

  // Start tracking an offline session
  static async startOfflineSession() {
    if (this.currentSession) return; // Already tracking

    this.currentSession = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      actionsPerformed: [],
      syncAttempts: 0,
      syncSuccesses: 0,
      syncFailures: 0,
    };

    await Preferences.set({
      key: OFFLINE_SESSION_KEY,
      value: JSON.stringify(this.currentSession),
    });

    console.log('Started offline session:', this.currentSession.id);
  }

  // End tracking an offline session
  static async endOfflineSession() {
    if (!this.currentSession) {
      // Try to load from storage
      const { value } = await Preferences.get({ key: OFFLINE_SESSION_KEY });
      if (value) {
        this.currentSession = JSON.parse(value);
      } else {
        return;
      }
    }

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

    // Save to metrics history
    await this.saveSessionToHistory(this.currentSession);

    // Sync to Supabase when back online
    await this.syncSessionToSupabase(this.currentSession);

    // Clear current session
    await Preferences.remove({ key: OFFLINE_SESSION_KEY });
    this.currentSession = null;

    console.log('Ended offline session');
  }

  // Track an action performed while offline
  static async trackOfflineAction(type: 'create' | 'update' | 'delete', table: string) {
    if (!this.currentSession) {
      const { value } = await Preferences.get({ key: OFFLINE_SESSION_KEY });
      if (value) {
        this.currentSession = JSON.parse(value);
      } else {
        return; // Not in offline session
      }
    }

    const action: OfflineAction = {
      type,
      table,
      timestamp: Date.now(),
    };

    this.currentSession.actionsPerformed.push(action);

    await Preferences.set({
      key: OFFLINE_SESSION_KEY,
      value: JSON.stringify(this.currentSession),
    });
  }

  // Track sync attempt results
  static async trackSyncAttempt(success: boolean) {
    if (!this.currentSession) {
      const { value } = await Preferences.get({ key: OFFLINE_SESSION_KEY });
      if (value) {
        this.currentSession = JSON.parse(value);
      } else {
        return;
      }
    }

    this.currentSession.syncAttempts++;
    if (success) {
      this.currentSession.syncSuccesses++;
    } else {
      this.currentSession.syncFailures++;
    }

    await Preferences.set({
      key: OFFLINE_SESSION_KEY,
      value: JSON.stringify(this.currentSession),
    });
  }

  // Save session to local history
  private static async saveSessionToHistory(session: OfflineSession) {
    const { value } = await Preferences.get({ key: OFFLINE_METRICS_KEY });
    const history: OfflineSession[] = value ? JSON.parse(value) : [];
    
    history.push(session);

    // Keep only last 30 sessions
    const recentHistory = history.slice(-30);

    await Preferences.set({
      key: OFFLINE_METRICS_KEY,
      value: JSON.stringify(recentHistory),
    });
  }

  // Sync session data to Supabase (using pwa_analytics table for now)
  private static async syncSessionToSupabase(session: OfflineSession) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store offline session as PWA analytics event
      await supabase.from('pwa_analytics').insert({
        user_id: user.id,
        event_type: 'offline_session_completed',
        platform: navigator.platform || 'unknown',
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to sync offline session to Supabase:', error);
    }
  }

  // Get offline usage metrics
  static async getOfflineMetrics(): Promise<OfflineMetrics> {
    const { value } = await Preferences.get({ key: OFFLINE_METRICS_KEY });
    const sessions: OfflineSession[] = value ? JSON.parse(value) : [];

    const totalOfflineTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const actionsWhileOffline = sessions.reduce((sum, s) => sum + s.actionsPerformed.length, 0);
    const totalSyncAttempts = sessions.reduce((sum, s) => sum + s.syncAttempts, 0);
    const totalSyncSuccesses = sessions.reduce((sum, s) => sum + s.syncSuccesses, 0);

    // Calculate most common actions
    const actionCounts = new Map<string, number>();
    sessions.forEach(session => {
      session.actionsPerformed.forEach(action => {
        const key = `${action.type}_${action.table}`;
        actionCounts.set(key, (actionCounts.get(key) || 0) + 1);
      });
    });

    const mostCommonActions = Array.from(actionCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalOfflineTime,
      offlineSessions: sessions.length,
      actionsWhileOffline,
      syncSuccessRate: totalSyncAttempts > 0 ? (totalSyncSuccesses / totalSyncAttempts) * 100 : 0,
      averageSessionDuration: sessions.length > 0 ? totalOfflineTime / sessions.length : 0,
      mostCommonActions,
    };
  }

  // Get recent offline sessions
  static async getRecentSessions(limit: number = 10): Promise<OfflineSession[]> {
    const { value } = await Preferences.get({ key: OFFLINE_METRICS_KEY });
    const sessions: OfflineSession[] = value ? JSON.parse(value) : [];
    return sessions.slice(-limit).reverse();
  }

  // Clear all offline metrics
  static async clearMetrics() {
    await Preferences.remove({ key: OFFLINE_METRICS_KEY });
    await Preferences.remove({ key: OFFLINE_SESSION_KEY });
    this.currentSession = null;
  }
}
