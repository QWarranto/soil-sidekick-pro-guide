# Offline Usage Monitoring

This document describes the offline usage monitoring system that tracks how users interact with the app while offline.

## Overview

The offline usage monitoring system automatically tracks:
- Duration of offline sessions
- Actions performed while offline
- Sync success/failure rates
- Patterns of offline behavior

## Components

### OfflineUsageTracker Service

Core service for tracking offline usage patterns.

**Key Methods:**
- `startOfflineSession()` - Begins tracking when going offline
- `endOfflineSession()` - Ends tracking when coming back online
- `trackOfflineAction(type, table)` - Records actions performed offline
- `trackSyncAttempt(success)` - Records sync attempt results
- `getOfflineMetrics()` - Retrieves aggregated metrics
- `getRecentSessions(limit)` - Gets recent offline sessions
- `clearMetrics()` - Clears all stored metrics

### useOfflineUsageTracking Hook

React hook that provides offline tracking functionality.

```typescript
const {
  metrics,           // Current aggregated metrics
  isTracking,        // Whether currently in offline session
  trackAction,       // Manually track an action
  trackSync,         // Track sync result
  refreshMetrics,    // Reload metrics
  clearMetrics       // Clear all data
} = useOfflineUsageTracking();
```

### OfflineUsageMonitor Component

Dashboard component for visualizing offline usage patterns.

**Features:**
- Overview cards showing total offline time, actions, and sync rates
- Most common offline actions breakdown
- Recent offline sessions timeline
- Real-time tracking indicator
- Refresh and clear controls

## Data Storage

### Local Storage (Capacitor Preferences)

- **Current Session:** `offline_current_session`
  - Active offline session being tracked
  - Persisted during offline period
  
- **Metrics History:** `offline_metrics_history`
  - Last 30 offline sessions
  - Used for analytics and trends

### Supabase Sync

When back online, sessions are synced to the `usage_tracking` table:

```typescript
{
  user_id: string,
  feature_name: 'offline_mode',
  action_type: 'offline_session',
  metadata: {
    session_id: string,
    duration_ms: number,
    actions_performed: number,
    sync_attempts: number,
    sync_successes: number,
    sync_failures: number,
    sync_success_rate: number
  }
}
```

## Automatic Tracking

The system automatically tracks:

1. **Session Start/End:** Triggered by network status changes
2. **Actions:** Captured from offline sync queue operations
3. **Sync Results:** Recorded from sync attempt outcomes

## Manual Tracking

You can manually track actions:

```typescript
import { OfflineUsageTracker } from '@/services/offlineUsageTracker';

// Track an offline action
await OfflineUsageTracker.trackOfflineAction('create', 'fields');

// Track sync result
await OfflineUsageTracker.trackSyncAttempt(true);
```

## Usage Example

```typescript
import { OfflineUsageMonitor } from '@/components/OfflineUsageMonitor';

function DashboardPage() {
  return (
    <div>
      {/* ... other content ... */}
      <OfflineUsageMonitor />
    </div>
  );
}
```

## Metrics Explained

### Total Offline Time
Cumulative time spent in offline mode across all sessions.

### Actions While Offline
Number of create/update/delete operations performed while offline.

### Sync Success Rate
Percentage of successful sync attempts when reconnecting.

### Average Session Duration
Mean duration of offline sessions.

### Most Common Actions
Top 5 offline action types by frequency.

## Privacy & Data Retention

- Metrics are stored locally and only synced if user is authenticated
- Local history limited to 30 most recent sessions
- Users can clear metrics at any time
- No sensitive data is tracked, only operation types and counts

## Integration with Existing Systems

This monitoring system integrates with:
- **useNetworkStatus:** Detects online/offline transitions
- **useOfflineSyncQueue:** Captures offline actions
- **Capacitor Preferences:** Local data persistence
- **Supabase:** Cloud analytics storage

## Best Practices

1. **Don't block UI:** All tracking is asynchronous
2. **Handle errors gracefully:** Tracking failures won't affect app functionality
3. **Review metrics regularly:** Use insights to improve offline UX
4. **Clear old data:** Prevent excessive local storage usage
