import { useEffect, useState } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useToast } from '@/hooks/use-toast';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initPushNotifications = async () => {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        setIsPermissionGranted(true);
        await PushNotifications.register();
      } else {
        toast({
          title: "Notifications disabled",
          description: "Enable notifications to receive planting reminders",
          variant: "destructive"
        });
      }

      // Register listeners
      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        setToken(token.value);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration:', error);
        toast({
          title: "Notification setup failed",
          description: error.error,
          variant: "destructive"
        });
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        toast({
          title: notification.title || "Notification",
          description: notification.body || ""
        });
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('Push notification action performed:', action);
      });
    };

    initPushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [toast]);

  // Schedule a local notification
  const scheduleLocalNotification = async (
    title: string,
    body: string,
    scheduleAt: Date,
    id?: number
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
              extra: null
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

  return {
    token,
    isPermissionGranted,
    scheduleLocalNotification,
    schedulePlantingReminder
  };
};
