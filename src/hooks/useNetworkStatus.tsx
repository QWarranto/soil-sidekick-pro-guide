import { useState, useEffect, useRef } from 'react';
import { Network } from '@capacitor/network';
import { useToast } from '@/hooks/use-toast';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState<string>('unknown');
  const { toast } = useToast();
  const previousOnlineStatus = useRef(true);

  useEffect(() => {
    let handler: any = null;

    const initNetworkStatus = async () => {
      // Get initial status
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setNetworkType(status.connectionType);
      previousOnlineStatus.current = status.connected;

      // Listen for network changes
      handler = await Network.addListener('networkStatusChange', (status) => {
        const wasOffline = !previousOnlineStatus.current;
        previousOnlineStatus.current = status.connected;
        
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);

        if (status.connected && wasOffline) {
          toast({
            title: "Back online",
            description: "Auto-syncing pending changes...",
            duration: 3000
          });
        } else if (!status.connected && !wasOffline) {
          toast({
            title: "Offline mode",
            description: "Changes will sync when connection is restored",
            variant: "destructive"
          });
        }
      });
    };

    initNetworkStatus();

    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [toast]);

  return {
    isOnline,
    networkType,
    isWifi: networkType === 'wifi',
    isCellular: networkType === 'cellular'
  };
};
