import { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';

/**
 * Smart PWA Install Banner
 * Shows platform-specific installation instructions
 */
export const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, showInstallPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isInstalled || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Check if previously dismissed (within 7 days)
    const dismissedAt = localStorage.getItem('pwa_banner_dismissed');
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
        return;
      }
    }

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    
    if (isIOS) {
      setPlatform('ios');
      // Show for iOS (they don't have beforeinstallprompt)
      setIsVisible(true);
    } else if (isAndroid) {
      setPlatform('android');
      // Show for Android if installable
      setIsVisible(isInstallable);
    } else {
      setPlatform('desktop');
      // Show for desktop if installable
      setIsVisible(isInstallable);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa_banner_dismissed', new Date().toISOString());
  };

  const handleInstall = async () => {
    if (platform === 'ios') {
      // For iOS, we just keep the instructions visible
      return;
    }
    
    // For Android/Desktop, trigger the install prompt
    const result = await showInstallPrompt();
    if (result === 'accepted') {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in-up md:left-auto md:right-4 md:max-w-md">
      <Card className="card-elevated border-primary/20 bg-gradient-primary shadow-glow-primary">
        <div className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="pr-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Install SoilSidekick Pro
            </h3>

            {platform === 'ios' ? (
              // iOS-specific instructions
              <div className="space-y-3 text-white/90 text-sm">
                <p>Install this app on your iPhone for the best experience:</p>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li className="flex items-start gap-2">
                    <span>Tap the Share button</span>
                    <Share className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  </li>
                  <li className="flex items-start gap-2">
                    <span>Select "Add to Home Screen"</span>
                    <Plus className="h-4 w-4 mt-0.5 flex-shrink-0 border border-white/50 rounded" />
                  </li>
                </ol>
                <div className="bg-white/10 p-3 rounded-lg mt-3">
                  <p className="text-xs">
                    ✓ Works offline<br />
                    ✓ Quick access from home screen<br />
                    ✓ Full screen experience
                  </p>
                </div>
              </div>
            ) : (
              // Android/Desktop install button
              <div className="space-y-3">
                <p className="text-white/90 text-sm">
                  Get quick access and use offline capabilities:
                </p>
                <ul className="text-xs text-white/80 space-y-1 ml-4 list-disc">
                  <li>Access from your home screen</li>
                  <li>Work without internet connection</li>
                  <li>Faster loading times</li>
                  <li>Push notifications</li>
                </ul>
                <Button
                  variant="hero"
                  className="w-full bg-white text-primary hover:bg-white/90"
                  onClick={handleInstall}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
