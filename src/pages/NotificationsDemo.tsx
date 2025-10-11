import { NotificationSettings } from '@/components/NotificationSettings';
import { NotificationTester } from '@/components/NotificationTester';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NotificationsDemo = () => {
  const { token, isPermissionGranted, isRegistered } = usePushNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Bell className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Push Notifications</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with real-time updates about tasks, soil analysis, and important farming reminders
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Mobile App Required</AlertTitle>
          <AlertDescription>
            Push notifications work best on mobile devices. Install the app using the "Add to Home Screen" 
            option in your browser menu for the full experience.
          </AlertDescription>
        </Alert>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Status</CardTitle>
            <CardDescription>Current state of push notification system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Permission Granted</span>
              <span className={`text-sm font-bold ${isPermissionGranted ? 'text-green-500' : 'text-orange-500'}`}>
                {isPermissionGranted ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Device Registered</span>
              <span className={`text-sm font-bold ${isRegistered ? 'text-green-500' : 'text-orange-500'}`}>
                {isRegistered ? 'Yes' : 'No'}
              </span>
            </div>
            {token && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <span className="text-sm font-medium">Push Token</span>
                <p className="text-xs font-mono break-all text-muted-foreground">
                  {token}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <NotificationSettings />

        {/* Tester (Development) */}
        {process.env.NODE_ENV === 'development' && <NotificationTester />}

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Features</CardTitle>
            <CardDescription>
              What you can receive notifications about
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Task Reminders
                </h4>
                <p className="text-sm text-muted-foreground pl-4">
                  Get notified about upcoming tasks and deadlines for your farming operations
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Soil Analysis Updates
                </h4>
                <p className="text-sm text-muted-foreground pl-4">
                  Receive alerts when your soil test results are ready to view
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Planting Schedules
                </h4>
                <p className="text-sm text-muted-foreground pl-4">
                  Reminders for optimal planting windows based on weather and soil conditions
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Subscription Alerts
                </h4>
                <p className="text-sm text-muted-foreground pl-4">
                  Important updates about your subscription status and billing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Best Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-medium">Install as PWA</h4>
                <p className="text-sm text-muted-foreground">
                  Add the app to your home screen for native-like notification experience
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🔔</div>
              <div>
                <h4 className="font-medium">Enable All Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Allow notifications in both the app and your device settings
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">⚙️</div>
              <div>
                <h4 className="font-medium">Customize Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Choose which types of notifications you want to receive
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🔋</div>
              <div>
                <h4 className="font-medium">Battery Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Disable battery optimization for the app to ensure timely notifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsDemo;
