import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Signal, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const NetworkStatusIndicator = () => {
  const { isOnline, networkType, isWifi, isCellular } = useNetworkStatus();

  const getIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (isWifi) return <Wifi className="h-3 w-3" />;
    if (isCellular) return <Signal className="h-3 w-3" />;
    return <Zap className="h-3 w-3" />;
  };

  const getStatus = () => {
    if (!isOnline) return 'Offline';
    if (isWifi) return 'WiFi';
    if (isCellular) return 'Cellular';
    return 'Online';
  };

  const getTooltip = () => {
    if (!isOnline) return 'You are offline. Changes will be saved locally and synced when connection is restored.';
    if (isWifi) return 'Connected via WiFi';
    if (isCellular) return 'Connected via cellular data. Large downloads may use mobile data.';
    return 'Connected to the internet';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isOnline ? "secondary" : "destructive"}
            className="gap-1.5"
          >
            {getIcon()}
            <span className="text-xs hidden sm:inline">{getStatus()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{getTooltip()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
