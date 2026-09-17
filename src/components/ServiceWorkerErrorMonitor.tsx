import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useServiceWorkerErrors } from '@/hooks/useServiceWorkerErrors';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trash2,
  Download,
  Power,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const ServiceWorkerErrorMonitor = () => {
  const { 
    errors, 
    stats, 
    health, 
    isLoading, 
    loadErrors, 
    clearErrors, 
    forceUpdate, 
    unregister 
  } = useServiceWorkerErrors();

  const exportErrors = () => {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `sw-errors-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-spin" />
            Service Worker Error Monitor
          </CardTitle>
          <CardDescription>Loading error data...</CardDescription>
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
                <Activity className="h-5 w-5" />
                Service Worker Error Monitor
              </CardTitle>
              <CardDescription>
                Track and diagnose service worker issues
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadErrors}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {errors.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportErrors}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={clearErrors}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Health Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {health.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <p className="text-lg font-semibold">
                {health.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {health.isControlling ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm text-muted-foreground">Controlling</span>
              </div>
              <p className="text-lg font-semibold">
                {health.isControlling ? 'Yes' : 'No'}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Errors</span>
              </div>
              <p className="text-lg font-semibold">{health.errorCount}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Error Rate</span>
              </div>
              <p className="text-lg font-semibold">
                {stats?.errorRate.toFixed(1)}/hr
              </p>
            </div>
          </div>

          {/* Critical Alerts */}
          {!health.isActive && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Service Worker Not Active</AlertTitle>
              <AlertDescription>
                The service worker is not running. Try reloading the page or updating the service worker.
              </AlertDescription>
            </Alert>
          )}

          {!health.isControlling && health.isActive && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Service Worker Not Controlling</AlertTitle>
              <AlertDescription>
                The service worker is active but not controlling the page. A page reload may be required.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Breakdown by Context */}
          {stats && Object.keys(stats.errorsByContext).length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Errors by Context</h4>
              <div className="space-y-2">
                {Object.entries(stats.errorsByContext)
                  .sort(([, a], [, b]) => b - a)
                  .map(([context, count]) => (
                    <div 
                      key={context}
                      className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium">{context}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Errors */}
          {stats && stats.recentErrors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Recent Errors</h4>
              <ScrollArea className="h-[300px] rounded-lg border">
                <div className="p-4 space-y-3">
                  {stats.recentErrors.map((error, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-3" />}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="destructive" className="text-xs">
                            {error.context}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(error.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{error.message}</p>
                        {error.stack && (
                          <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                            {error.stack.split('\n').slice(0, 3).join('\n')}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* No Errors */}
          {errors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-sm">No service worker errors recorded</p>
              <p className="text-xs mt-1">Your service worker is running smoothly</p>
            </div>
          )}

          {/* Management Actions */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={forceUpdate}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Update
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={unregister}
            >
              <Power className="h-4 w-4 mr-2" />
              Unregister SW
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
