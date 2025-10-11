import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOfflineUsageTracking } from '@/hooks/useOfflineUsageTracking';
import { OfflineUsageTracker } from '@/services/offlineUsageTracker';
import { 
  WifiOff, 
  Clock, 
  Activity, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const OfflineUsageMonitor = () => {
  const { metrics, isTracking, refreshMetrics, clearMetrics } = useOfflineUsageTracking();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    loadRecentSessions();
  }, [metrics]);

  const loadRecentSessions = async () => {
    const sessions = await OfflineUsageTracker.getRecentSessions(5);
    setRecentSessions(sessions);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            Offline Usage Monitor
          </CardTitle>
          <CardDescription>Loading offline usage metrics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <WifiOff className="h-5 w-5" />
                Offline Usage Monitor
              </CardTitle>
              <CardDescription>
                Track how your app is used while offline
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshMetrics}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearMetrics}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isTracking && (
            <Badge className="mb-4" variant="secondary">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Currently tracking offline session
            </Badge>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Offline Time</span>
              </div>
              <p className="text-2xl font-bold">{formatDuration(metrics.totalOfflineTime)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across {metrics.offlineSessions} session{metrics.offlineSessions !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Actions While Offline</span>
              </div>
              <p className="text-2xl font-bold">{metrics.actionsWhileOffline}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg {metrics.offlineSessions > 0 
                  ? Math.round(metrics.actionsWhileOffline / metrics.offlineSessions) 
                  : 0} per session
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sync Success Rate</span>
              </div>
              <p className="text-2xl font-bold">{metrics.syncSuccessRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                When reconnecting to network
              </p>
            </div>
          </div>

          {metrics.mostCommonActions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Most Common Offline Actions</h4>
              <div className="space-y-2">
                {metrics.mostCommonActions.map((action, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm font-medium">{action.type}</span>
                    <Badge variant="secondary">{action.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentSessions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Recent Offline Sessions</h4>
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="bg-muted/30 rounded-lg px-3 py-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {formatDuration(session.duration || 0)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(session.startTime, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{session.actionsPerformed.length} actions</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {session.syncSuccesses} synced
                      </span>
                      {session.syncFailures > 0 && (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-destructive" />
                          {session.syncFailures} failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {metrics.offlineSessions === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <WifiOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No offline usage recorded yet</p>
              <p className="text-xs mt-1">Data will appear here when you use the app offline</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
