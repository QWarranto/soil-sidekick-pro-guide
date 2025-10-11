import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const NotificationSettings = () => {
  const {
    settings,
    updateSettings,
    isRegistered,
    pushToken,
    isLoading,
    registerNotifications,
    checkPermissions,
  } = usePushNotifications();

  const handleToggleNotifications = async (enabled: boolean) => {
    await updateSettings({ enabled });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </div>
          {isRegistered ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master toggle */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <Label htmlFor="notifications-enabled" className="text-base font-medium">
              Enable Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Receive updates and reminders on your device
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading}
          />
        </div>

        {settings.enabled && (
          <>
            <Separator />

            {/* Individual notification types */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Notification Types</h4>

              {/* Task Reminders */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1">
                  <Label htmlFor="task-reminders" className="font-normal">
                    Task Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming and overdue tasks
                  </p>
                </div>
                <Switch
                  id="task-reminders"
                  checked={settings.taskReminders}
                  onCheckedChange={(checked) => 
                    updateSettings({ taskReminders: checked })
                  }
                />
              </div>

              {/* Soil Analysis Updates */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1">
                  <Label htmlFor="soil-updates" className="font-normal">
                    Soil Analysis Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when soil analysis results are ready
                  </p>
                </div>
                <Switch
                  id="soil-updates"
                  checked={settings.soilAnalysisUpdates}
                  onCheckedChange={(checked) => 
                    updateSettings({ soilAnalysisUpdates: checked })
                  }
                />
              </div>

              {/* Subscription Alerts */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1">
                  <Label htmlFor="subscription-alerts" className="font-normal">
                    Subscription Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about your subscription and billing
                  </p>
                </div>
                <Switch
                  id="subscription-alerts"
                  checked={settings.subscriptionAlerts}
                  onCheckedChange={(checked) => 
                    updateSettings({ subscriptionAlerts: checked })
                  }
                />
              </div>

              {/* Marketing Updates */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1">
                  <Label htmlFor="marketing-updates" className="font-normal">
                    Marketing & Tips
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Farming tips and new feature announcements
                  </p>
                </div>
                <Switch
                  id="marketing-updates"
                  checked={settings.marketingUpdates}
                  onCheckedChange={(checked) => 
                    updateSettings({ marketingUpdates: checked })
                  }
                />
              </div>
            </div>

            {/* Status info */}
            {isRegistered && pushToken && (
              <>
                <Separator />
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Device registered</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    Token: {pushToken.substring(0, 40)}...
                  </p>
                </div>
              </>
            )}

            {!isRegistered && (
              <>
                <Separator />
                <Button 
                  onClick={registerNotifications}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {isLoading ? 'Registering...' : 'Register Device'}
                </Button>
              </>
            )}
          </>
        )}

        {!settings.enabled && (
          <div className="p-6 border-2 border-dashed rounded-lg text-center">
            <BellOff className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-medium mb-2">Notifications Disabled</h4>
            <p className="text-sm text-muted-foreground">
              Enable notifications to receive important updates and reminders
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
