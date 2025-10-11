import { useOfflineSyncQueue } from '@/hooks/useOfflineSyncQueue';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const OfflineSyncIndicator = () => {
  const { isOnline } = useNetworkStatus();
  const {
    queue,
    queueStats,
    isSyncing,
    syncProgress,
    syncNow,
    clearQueue,
    hasItemsToSync
  } = useOfflineSyncQueue();

  if (!hasItemsToSync && isOnline) {
    return null;
  }

  const syncPercentage = syncProgress.total > 0 
    ? (syncProgress.current / syncProgress.total) * 100 
    : 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={isOnline ? "default" : "destructive"}
            size="lg"
            className="rounded-full shadow-lg"
          >
            {isSyncing ? (
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            ) : isOnline ? (
              <Cloud className="h-5 w-5 mr-2" />
            ) : (
              <CloudOff className="h-5 w-5 mr-2" />
            )}
            {hasItemsToSync && (
              <Badge variant="secondary" className="ml-2">
                {queueStats.total}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Online
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Offline
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {hasItemsToSync 
                  ? `${queueStats.total} item${queueStats.total > 1 ? 's' : ''} pending sync`
                  : 'All data synced'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSyncing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Syncing...</span>
                    <span>{syncProgress.current} / {syncProgress.total}</span>
                  </div>
                  <Progress value={syncPercentage} />
                </div>
              )}

              {hasItemsToSync && !isSyncing && (
                <div className="space-y-2">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creates:</span>
                      <span className="font-medium">{queueStats.byType.create}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updates:</span>
                      <span className="font-medium">{queueStats.byType.update}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deletes:</span>
                      <span className="font-medium">{queueStats.byType.delete}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={syncNow}
                      disabled={!isOnline || isSyncing}
                      className="flex-1"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button
                      onClick={clearQueue}
                      disabled={isSyncing}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {!hasItemsToSync && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  All changes synced
                </div>
              )}

              {queue.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Recent items:
                  </p>
                  {queue.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="text-xs p-2 rounded bg-muted/50 flex justify-between items-center"
                    >
                      <span className="truncate">
                        {item.type} on {item.table}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                  {queue.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      +{queue.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};
