import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Offline fallback page for PWA
 * Shows when user tries to access unavailable content while offline
 */
export const PWAOfflinePage = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [lastOnline, setLastOnline] = useState<string>('');

  useEffect(() => {
    // Track when we last were online
    if (isOnline) {
      const now = new Date().toLocaleTimeString();
      setLastOnline(now);
      localStorage.setItem('last_online', now);
    } else {
      const stored = localStorage.getItem('last_online');
      if (stored) setLastOnline(stored);
    }
  }, [isOnline]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Auto-reload when back online
  useEffect(() => {
    if (isOnline) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-lg w-full card-elevated">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              This page requires an internet connection to load.
            </p>
            {lastOnline && (
              <p className="text-sm text-muted-foreground">
                Last online: {lastOnline}
              </p>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">While offline, you can:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>View previously loaded pages</li>
              <li>Access saved soil analysis reports</li>
              <li>Review your dashboard data</li>
              <li>Work with offline data sync</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              className="w-full"
              onClick={handleRefresh}
              disabled={!isOnline}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isOnline ? 'Reconnected! Refresh' : 'Try Again'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoHome}
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>

          {isOnline && (
            <div className="text-center text-sm text-primary animate-fade-in">
              ✓ Connection restored! Refreshing...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};