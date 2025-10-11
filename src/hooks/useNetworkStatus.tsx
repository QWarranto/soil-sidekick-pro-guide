import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { useToast } from '@/hooks/use-toast';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState<string>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    const initNetworkStatus = async () => {
      // Get initial status
      const status = await Network.getStatus();
      setIsOnline(status.connected);
      setNetworkType(status.connectionType);

      // Listen for network changes
      const handler = await Network.addListener('networkStatusChange', (status) => {
        const wasOffline = !isOnline;
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);

        if (status.connected && wasOffline) {
          toast({
            title: "Back online",
            description: "Syncing your data..."
          });
        } else if (!status.connected) {
          toast({
            title: "Offline mode",
            description: "Changes will sync when connection is restored",
            variant: "destructive"
          });
        }
      });

      return () => {
        handler.remove();
      };
    };

    initNetworkStatus();
  }, [isOnline, toast]);

  return {
    isOnline,
    networkType,
    isWifi: networkType === 'wifi',
    isCellular: networkType === 'cellular'
  };
};
