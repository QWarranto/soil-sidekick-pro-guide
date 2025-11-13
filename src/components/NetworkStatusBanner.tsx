import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineSyncQueue } from '@/hooks/useOfflineSyncQueue';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CloudOff, Wifi, WifiOff, RefreshCw, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NetworkStatusBanner = () => {
  const { isOnline, networkType, isWifi, isCellular } = useNetworkStatus();
  const { hasItemsToSync, queueStats, syncNow, isSyncing } = useOfflineSyncQueue();

  return (
    <div 
      className={cn(
        "border-b-2 transition-all duration-300 py-3",
        !isOnline && "bg-destructive/20 border-destructive animate-pulse",
        isOnline && !hasItemsToSync && "bg-primary/20 border-primary",
        isOnline && hasItemsToSync && "bg-warning/20 border-warning"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
            !isOnline && "bg-destructive/30",
            isOnline && !hasItemsToSync && "bg-primary/30",
            isOnline && hasItemsToSync && "bg-warning/30"
          )}>
            {!isOnline ? (
              <WifiOff className="h-6 w-6 text-destructive-foreground" />
            ) : isCellular ? (
              <Signal className="h-6 w-6 text-foreground" />
            ) : (
              <Wifi className="h-6 w-6 text-foreground" />
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className={cn(
              "text-lg font-bold uppercase tracking-wide",
              !isOnline && "text-destructive-foreground",
              isOnline && "text-foreground"
            )}>
              {!isOnline ? 'OFFLINE MODE' : 'ONLINE MODE'}
            </div>
            <div className="text-sm text-muted-foreground">
              {!isOnline ? (
                <>Changes saved locally • Will sync when connection restored</>
              ) : hasItemsToSync ? (
                <>
                  {queueStats.total} change{queueStats.total !== 1 ? 's' : ''} pending sync
                  {isCellular && ' • Using cellular data'}
                </>
              ) : (
                <>Connected {isWifi ? 'via WiFi' : isCellular ? 'via cellular' : ''} • All data synced</>
              )}
            </div>
          </div>
        </div>

        {hasItemsToSync && isOnline && (
          <Button
            onClick={syncNow}
            disabled={isSyncing}
            size="lg"
            className="shrink-0 font-semibold"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
