import { useEffect, useState, useCallback } from 'react';
import { 
  PushNotifications, 
  Token, 
  ActionPerformed,
  PushNotificationSchema 
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  soilAnalysisUpdates: boolean;
  subscriptionAlerts: boolean;
  marketingUpdates: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  taskReminders: true,
  soilAnalysisUpdates: true,
  subscriptionAlerts: true,
  marketingUpdates: false,
};

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load settings from storage
  const loadSettings = useCallback(async () => {
    try {
      const { value } = await Preferences.get({ key: 'push_notification_settings' });
      if (value) {
        const savedSettings = JSON.parse(value);
        setSettings(savedSettings);
        return savedSettings;
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return DEFAULT_SETTINGS;
    }
  }, []);

  // Save settings to storage
  const saveSettings = useCallback(async (newSettings: NotificationSettings) => {
    try {
      await Preferences.set({
        key: 'push_notification_settings',
        value: JSON.stringify(newSettings)
      });
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, []);

  // Save push token to database
  const savePushToken = useCallback(async (tokenValue: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profile with push token
      const { error } = await supabase
        .from('profiles' as any)
        .update({
          // Note: You may need to add a push_token column to profiles table
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving push token:', error);
      }
    } catch (error) {
      console.error('Error in savePushToken:', error);
    }
  }, []);

  // Register for push notifications
  const registerNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        setIsPermissionGranted(true);
        await PushNotifications.register();
        
        toast({
          title: "Notifications enabled",
          description: "You'll receive important updates and reminders",
        });
        
        return true;
      } else {
        toast({
          title: "Permission denied",
          description: "Push notifications are disabled. Enable them in settings.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error registering notifications:', error);
      toast({
        title: "Registration failed",
        description: "Could not register for push notifications",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update notification settings
  const updateSettings = useCallback(async (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...settings, ...updates };
    
    // If enabling notifications for the first time, request permission
    if (updates.enabled && !settings.enabled && !isRegistered) {
      const success = await registerNotifications();
      if (!success) {
        newSettings.enabled = false;
      }
    }
    
    await saveSettings(newSettings);
  }, [settings, isRegistered, registerNotifications, saveSettings]);

  // Schedule a local notification
  const scheduleLocalNotification = async (
    title: string,
    body: string,
    scheduleAt: Date,
    id?: number,
    extra?: any
  ) => {
    try {
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: id || Math.floor(Math.random() * 100000),
              schedule: { at: scheduleAt },
              sound: undefined,
              attachments: undefined,
              actionTypeId: '',
              extra
            }
          ]
        });

        toast({
          title: "Reminder set",
          description: `You'll be notified on ${scheduleAt.toLocaleDateString()}`
        });
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast({
        title: "Error",
        description: "Failed to schedule reminder",
        variant: "destructive"
      });
    }
  };

  // Send immediate local notification
  const sendLocalNotification = useCallback(async (
    title: string,
    body: string,
    data?: any
  ) => {
    const now = new Date(Date.now() + 1000); // 1 second from now
    await scheduleLocalNotification(title, body, now, undefined, data);
  }, []);

  // Schedule planting reminder
  const schedulePlantingReminder = async (
    cropName: string,
    plantingDate: Date,
    daysBeforeReminder: number = 7
  ) => {
    const reminderDate = new Date(plantingDate);
    reminderDate.setDate(reminderDate.getDate() - daysBeforeReminder);

    await scheduleLocalNotification(
      `Planting Reminder: ${cropName}`,
      `Time to prepare for planting ${cropName} in ${daysBeforeReminder} days`,
      reminderDate
    );
  };

  // Get pending notifications
  const getPendingNotifications = useCallback(async () => {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }, []);

  // Cancel notification
  const cancelNotification = useCallback(async (notificationId: number) => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: notificationId }]
      });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }, []);

  // Check permissions
  const checkPermissions = useCallback(async () => {
    try {
      const result = await PushNotifications.checkPermissions();
      return result.receive === 'granted';
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const initPushNotifications = async () => {
      // Load saved settings
      const savedSettings = await loadSettings();
      
      // Only auto-register if previously enabled
      if (savedSettings.enabled) {
        const permission = await PushNotifications.requestPermissions();
        
        if (permission.receive === 'granted') {
          setIsPermissionGranted(true);
          await PushNotifications.register();
        }
      }

      // Register listeners
      const registrationListener = await PushNotifications.addListener(
        'registration', 
        (tokenData: Token) => {
          console.log('Push registration success, token:', tokenData.value);
          setToken(tokenData.value);
          setIsRegistered(true);
          savePushToken(tokenData.value);
        }
      );

      const registrationErrorListener = await PushNotifications.addListener(
        'registrationError', 
        (error: any) => {
          console.error('Error on registration:', error);
          toast({
            title: "Notification setup failed",
            description: error.error || 'Unknown error',
            variant: "destructive"
          });
        }
      );

      const notificationListener = await PushNotifications.addListener(
        'pushNotificationReceived', 
        (notification: PushNotificationSchema) => {
          console.log('Push notification received:', notification);
          toast({
            title: notification.title || "Notification",
            description: notification.body || ""
          });
        }
      );

      const actionListener = await PushNotifications.addListener(
        'pushNotificationActionPerformed', 
        (action: ActionPerformed) => {
          console.log('Push notification action performed:', action);
          
          // Handle navigation based on notification data
          const data = action.notification.data;
          if (data?.route) {
            window.location.href = data.route;
          }
        }
      );

      return () => {
        registrationListener.remove();
        registrationErrorListener.remove();
        notificationListener.remove();
        actionListener.remove();
      };
    };

    const cleanup = initPushNotifications();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [toast, loadSettings, savePushToken]);

  return {
    // Legacy API
    token,
    isPermissionGranted,
    scheduleLocalNotification,
    schedulePlantingReminder,
    // New API
    settings,
    updateSettings,
    isRegistered,
    pushToken: token,
    isLoading,
    registerNotifications,
    sendLocalNotification,
    getPendingNotifications,
    cancelNotification,
    checkPermissions,
  };
};
