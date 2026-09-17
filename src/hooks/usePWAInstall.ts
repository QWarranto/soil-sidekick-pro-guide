import { useState, useEffect } from 'react';
import { pwaInstallTracker } from '@/services/pwaInstallTracker';

/**
 * Hook for PWA installation tracking and install prompt
 */
export const usePWAInstall = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showingPrompt, setShowingPrompt] = useState(false);

  useEffect(() => {
    // Check initial states
    setIsInstalled(pwaInstallTracker.isAppInstalled());
    setIsInstallable(pwaInstallTracker.isPromptAvailable());

    // Listen for prompt availability
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    setShowingPrompt(true);
    try {
      const result = await pwaInstallTracker.showInstallPrompt();
      
      if (result === 'accepted') {
        // User accepted, app will install
        setIsInstallable(false);
      } else if (result === 'dismissed') {
        // User dismissed the prompt
        setIsInstallable(true);
      }
      
      return result;
    } finally {
      setShowingPrompt(false);
    }
  };

  return {
    isInstallable,
    isInstalled,
    showingPrompt,
    showInstallPrompt,
  };
};
