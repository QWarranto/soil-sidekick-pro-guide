import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { 
  Download, 
  Check, 
  Smartphone, 
  Zap, 
  WifiOff, 
  Bell,
  Share,
  Plus,
  Chrome,
  Globe
} from 'lucide-react';

/**
 * Dedicated PWA installation page
 * Provides detailed instructions for installing the app
 */
const Install = () => {
  const navigate = useNavigate();
  const { isInstallable, isInstalled, showingPrompt, showInstallPrompt } = usePWAInstall();
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await showInstallPrompt();
    } finally {
      setInstalling(false);
    }
  };

  // Detect platform
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Install SoilSidekick Pro</h1>
          <p className="text-lg text-muted-foreground">
            Get the best experience with our Progressive Web App
          </p>
        </div>

        {/* Already Installed Message */}
        {isInstalled && (
          <Card className="border-primary bg-gradient-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-primary">
                <Check className="h-6 w-6" />
                <div>
                  <p className="font-semibold">App Already Installed!</p>
                  <p className="text-sm">You can access it from your home screen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="card-elevated">
            <CardContent className="pt-6 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <WifiOff className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Offline Access</h3>
                <p className="text-sm text-muted-foreground">
                  Work without internet connection
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Instant loading with caching
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Native Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Feels like a native mobile app
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with alerts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Installation Instructions */}
        {isIOS ? (
          // iOS Instructions
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Install on iPhone/iPad
              </CardTitle>
              <CardDescription>
                Follow these steps to install SoilSidekick Pro on iOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Badge variant="outline" className="h-6 w-6 flex items-center justify-center flex-shrink-0">1</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Tap the Share button</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Share className="h-4 w-4" />
                      <span>Located at the bottom (iPhone) or top (iPad) of Safari</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge variant="outline" className="h-6 w-6 flex items-center justify-center flex-shrink-0">2</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Select "Add to Home Screen"</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Plus className="h-4 w-4 border border-current rounded" />
                      <span>Scroll down if you don't see it immediately</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge variant="outline" className="h-6 w-6 flex items-center justify-center flex-shrink-0">3</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Tap "Add" in the top right</p>
                    <p className="text-sm text-muted-foreground">
                      The app will appear on your home screen
                    </p>
                  </div>
                </div>
              </div>

              {!isSafari && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    ⚠️ You need to open this page in Safari to install the app on iOS
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : isAndroid ? (
          // Android Instructions
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Chrome className="h-5 w-5" />
                Install on Android
              </CardTitle>
              <CardDescription>
                Install directly from your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInstallable ? (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleInstall}
                  disabled={installing || showingPrompt}
                >
                  <Download className="h-5 w-5 mr-2" />
                  {installing || showingPrompt ? 'Installing...' : 'Install App Now'}
                </Button>
              ) : (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="font-medium">Manual Installation:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>Tap the menu icon (⋮) in your browser</li>
                    <li>Select "Install app" or "Add to Home screen"</li>
                    <li>Confirm the installation</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Desktop Instructions
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Install on Desktop</CardTitle>
              <CardDescription>
                Install from Chrome, Edge, or other supported browsers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInstallable ? (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleInstall}
                  disabled={installing || showingPrompt}
                >
                  <Download className="h-5 w-5 mr-2" />
                  {installing || showingPrompt ? 'Installing...' : 'Install App Now'}
                </Button>
              ) : (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <p className="font-medium">Manual Installation:</p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>Look for the install icon in your browser's address bar</li>
                    <li>Click "Install" or "Add"</li>
                    <li>The app will open in a new window</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;