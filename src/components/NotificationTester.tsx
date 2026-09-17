import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Calendar, Send } from 'lucide-react';

/**
 * Component for testing push notifications
 * Use this in development to test notification functionality
 */
export const NotificationTester = () => {
  const { sendLocalNotification, scheduleLocalNotification, getPendingNotifications } = usePushNotifications();
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification from SoilSidekick Pro');
  const [scheduleMinutes, setScheduleMinutes] = useState('1');
  const [pendingCount, setPendingCount] = useState(0);

  const handleSendNow = async () => {
    await sendLocalNotification(title, body, { test: true });
  };

  const handleSchedule = async () => {
    const minutes = parseInt(scheduleMinutes) || 1;
    const scheduleAt = new Date(Date.now() + minutes * 60 * 1000);
    await scheduleLocalNotification(title, body, scheduleAt, undefined, { test: true });
    checkPending();
  };

  const checkPending = async () => {
    const pending = await getPendingNotifications();
    setPendingCount(pending.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Tester
        </CardTitle>
        <CardDescription>
          Test push notifications (development only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-title">Notification Title</Label>
          <Input
            id="test-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-body">Notification Body</Label>
          <Textarea
            id="test-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter message..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSendNow} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Send Now
          </Button>
        </div>

        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-sm">Schedule Notification</h4>
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="schedule-minutes">Minutes from now</Label>
              <Input
                id="schedule-minutes"
                type="number"
                min="1"
                value={scheduleMinutes}
                onChange={(e) => setScheduleMinutes(e.target.value)}
              />
            </div>
            <Button onClick={handleSchedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkPending}
            className="w-full"
          >
            Check Pending ({pendingCount})
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> You need to enable notifications first</p>
          <p>📱 Test on a real device for best results</p>
          <p>🔔 Foreground notifications show as toasts</p>
        </div>
      </CardContent>
    </Card>
  );
};
