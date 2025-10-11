import { useState } from 'react';
import { useOfflineSyncQueue } from '@/hooks/useOfflineSyncQueue';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Example component demonstrating how to use the offline sync queue
 * 
 * This shows how to:
 * 1. Add items to the sync queue when offline
 * 2. Monitor network status
 * 3. Track sync progress
 * 4. Handle different operation types (create, update, delete)
 */
export const OfflineSyncExample = () => {
  const { addToQueue, hasItemsToSync, isSyncing } = useOfflineSyncQueue();
  const { isOnline } = useNetworkStatus();
  const [fieldName, setFieldName] = useState('');

  // Example: Create a field (will queue if offline)
  const handleCreateField = async () => {
    if (!fieldName.trim()) return;

    // Add to sync queue - will sync automatically when online
    await addToQueue(
      'create',
      'fields', // Supabase table name
      {
        name: fieldName,
        user_id: 'current-user-id', // Replace with actual user ID
        description: 'Created offline',
        boundary_coordinates: {},
      },
      'high' // Priority: high, medium, or low
    );

    setFieldName('');
  };

  // Example: Update a field (will queue if offline)
  const handleUpdateField = async (fieldId: string) => {
    await addToQueue(
      'update',
      'fields',
      {
        id: fieldId,
        name: 'Updated Field Name',
        updated_at: new Date().toISOString(),
      },
      'medium'
    );
  };

  // Example: Delete a field (will queue if offline)
  const handleDeleteField = async (fieldId: string) => {
    await addToQueue(
      'delete',
      'fields',
      {
        id: fieldId,
      },
      'low'
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Offline Sync Example
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </CardTitle>
        <CardDescription>
          Operations are queued when offline and synced automatically when connection returns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status indicators */}
        <div className="flex gap-2 text-sm">
          {hasItemsToSync && (
            <Badge variant="outline">
              Pending sync items
            </Badge>
          )}
          {isSyncing && (
            <Badge variant="outline">
              Syncing...
            </Badge>
          )}
        </div>

        {/* Create field example */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Create Field</label>
          <div className="flex gap-2">
            <Input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name..."
            />
            <Button onClick={handleCreateField} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Example action buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Example Actions</label>
          <div className="flex gap-2">
            <Button
              onClick={() => handleUpdateField('example-field-id')}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Example
            </Button>
            <Button
              onClick={() => handleDeleteField('example-field-id')}
              variant="outline"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Example
            </Button>
          </div>
        </div>

        {/* Info box */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Operations are queued if offline</li>
            <li>Auto-syncs when connection returns</li>
            <li>Retries failed operations (max 3 times)</li>
            <li>Prioritizes high-priority items first</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
