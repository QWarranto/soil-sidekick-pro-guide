# Push Notifications Implementation Guide

## Overview

The SoilSidekick Pro app now includes comprehensive push notification support using `@capacitor/push-notifications` and `@capacitor/local-notifications`.

## Features

### ✅ **Implemented**

- **Push Notification Registration** - Automatic device registration for remote notifications
- **Local Notifications** - Schedule notifications locally on the device
- **Permission Management** - Request and manage notification permissions
- **Notification Settings** - User-customizable notification preferences
- **Offline Sync Integration** - Notifications work with offline data sync
- **Multiple Notification Types**:
  - Task reminders
  - Soil analysis updates
  - Subscription alerts
  - Marketing updates (opt-in)

## Components

### `usePushNotifications` Hook
Main hook for all notification functionality.

```typescript
import { usePushNotifications } from '@/hooks/usePushNotifications';

const {
  token,                      // Push token from FCM/APNS
  isPermissionGranted,        // Permission status
  isRegistered,               // Device registration status
  settings,                   // User notification preferences
  updateSettings,             // Update notification settings
  scheduleLocalNotification,  // Schedule a notification
  sendLocalNotification,      // Send immediate notification
  schedulePlantingReminder,   // Helper for planting reminders
  getPendingNotifications,    // Get pending notifications
  cancelNotification,         // Cancel a scheduled notification
  checkPermissions,           // Check current permission status
} = usePushNotifications();
```

### `NotificationSettings` Component
UI for managing notification preferences.

```typescript
import { NotificationSettings } from '@/components/NotificationSettings';

// In your component
<NotificationSettings />
```

### `NotificationTester` Component
Development tool for testing notifications.

```typescript
import { NotificationTester } from '@/components/NotificationTester';

// Only shows in development mode
<NotificationTester />
```

## Usage Examples

### 1. Schedule a Task Reminder

```typescript
const { scheduleLocalNotification, settings } = usePushNotifications();

// Check if task reminders are enabled
if (settings.taskReminders) {
  await scheduleLocalNotification(
    'Task Reminder',
    'Time to fertilize Field A',
    new Date('2025-10-15T08:00:00'),
    undefined,
    { taskId: 'task-123', route: '/task-manager' }
  );
}
```

### 2. Send Soil Analysis Notification

```typescript
const { sendLocalNotification, settings } = usePushNotifications();

// When soil analysis is complete
if (settings.soilAnalysisUpdates) {
  await sendLocalNotification(
    'Soil Analysis Complete',
    'Your soil test results are ready to view',
    { analysisId: 'analysis-456', route: '/soil-analysis' }
  );
}
```

### 3. Schedule Planting Reminder

```typescript
const { schedulePlantingReminder } = usePushNotifications();

await schedulePlantingReminder(
  'Corn',
  new Date('2025-04-15'),
  7  // Notify 7 days before
);
```

### 4. Get Pending Notifications

```typescript
const { getPendingNotifications } = usePushNotifications();

const pending = await getPendingNotifications();
console.log(`${pending.length} notifications scheduled`);
```

### 5. Cancel a Notification

```typescript
const { cancelNotification } = usePushNotifications();

await cancelNotification(notificationId);
```

## Notification Settings

Users can control which types of notifications they receive:

- **Task Reminders** - Upcoming and overdue tasks
- **Soil Analysis Updates** - When results are ready
- **Subscription Alerts** - Billing and account updates
- **Marketing & Tips** - Farming tips and feature announcements (opt-in)

## Testing

Visit `/notifications` to access the notification demo page with:
- Current status display
- Settings management
- Test notification sender (dev mode)
- Feature documentation

## Mobile Setup

### For iOS:
1. Run `npx cap sync ios`
2. Open in Xcode
3. Configure Push Notification capability
4. Add APNs key in Apple Developer portal

### For Android:
1. Run `npx cap sync android`
2. Open in Android Studio
3. Configure Firebase Cloud Messaging
4. Add `google-services.json`

## Backend Integration

To send push notifications from your backend:

```typescript
// Example using Firebase Admin SDK (Node.js)
import admin from 'firebase-admin';

await admin.messaging().send({
  token: userPushToken,
  notification: {
    title: 'Notification Title',
    body: 'Notification message'
  },
  data: {
    route: '/soil-analysis',
    analysisId: '123'
  }
});
```

## Notification Data Structure

All notifications can include custom data:

```typescript
{
  title: string;
  body: string;
  data?: {
    route?: string;        // Navigation route
    taskId?: string;       // Related task ID
    analysisId?: string;   // Related analysis ID
    [key: string]: any;    // Any custom data
  }
}
```

When a user taps a notification, the app will:
1. Open the app
2. Navigate to `data.route` if provided
3. Pass along any custom data

## Permission Flow

1. User enables notifications in settings
2. App requests permission from OS
3. User grants/denies permission
4. If granted, device registers with FCM/APNS
5. Push token is saved to user profile
6. User can customize notification types

## Storage

Notification settings are stored locally using Capacitor Preferences:
- Key: `push_notification_settings`
- Persists across app restarts
- Synced per device

## Best Practices

### ✅ DO:
- Always check permission status before scheduling
- Provide clear notification content
- Include deep link data for navigation
- Respect user preferences
- Test on real devices

### ❌ DON'T:
- Send notifications without permission
- Over-notify users
- Send marketing notifications without opt-in
- Ignore notification preferences
- Test only in browser (limited functionality)

## Troubleshooting

### Notifications not appearing?
1. Check permission status: `checkPermissions()`
2. Verify notification settings are enabled
3. Check device notification settings
4. Ensure app is registered: `isRegistered`
5. Check pending notifications: `getPendingNotifications()`

### Permission denied?
- Ask user to enable in device settings
- Provide clear value proposition before requesting
- Don't spam permission requests

### Notifications work on Android but not iOS?
- Verify APNs certificate is configured
- Check Xcode capabilities
- Ensure production provisioning profile

## Future Enhancements

Potential additions:
- [ ] Notification categories and actions
- [ ] Rich notifications with images
- [ ] Notification analytics
- [ ] Geofencing for location-based notifications
- [ ] Weather alert notifications
- [ ] Market price update notifications

## Resources

- [Capacitor Push Notifications Docs](https://capacitorjs.com/docs/apis/push-notifications)
- [Capacitor Local Notifications Docs](https://capacitorjs.com/docs/apis/local-notifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
