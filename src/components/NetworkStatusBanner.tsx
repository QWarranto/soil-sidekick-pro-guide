import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineSyncQueue } from '@/hooks/useOfflineSyncQueue';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CloudOff, Wifi, WifiOff, RefreshCw, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NetworkStatusBanner = () => {
  const { isOnline, networkType, isWifi, isCellular } = useNetworkStatus();
  const { hasItemsToSync, queueStats, syncNow, isSyncing } = useOfflineSyncQueue();

  // Don't show banner if online and nothing to sync
  if (isOnline && !hasItemsToSync) {
    return null;
  }

  return (
    <Alert 
      className={cn(
        "border-0 rounded-none m-0 py-2 transition-all duration-300",
        !isOnline && "bg-destructive/10 border-destructive/20",
        isOnline && hasItemsToSync && "bg-warning/10 border-warning/20"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isOnline ? (
            <CloudOff className="h-4 w-4 text-destructive shrink-0" />
          ) : isCellular ? (
            <Signal className="h-4 w-4 text-warning shrink-0" />
          ) : (
            <Wifi className="h-4 w-4 text-warning shrink-0" />
          )}
          
          <AlertDescription className="text-sm font-medium truncate">
            {!isOnline ? (
              <>You're offline. Changes will sync when connection is restored.</>
            ) : hasItemsToSync ? (
              <>
                {queueStats.total} change{queueStats.total !== 1 ? 's' : ''} pending sync
                {isCellular && ' (using cellular data)'}
              </>
            ) : null}
          </AlertDescription>
        </div>

        {hasItemsToSync && isOnline && (
          <Button
            onClick={syncNow}
            disabled={isSyncing}
            size="sm"
            variant="outline"
            className="shrink-0"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </div>
    </Alert>
  );
};
