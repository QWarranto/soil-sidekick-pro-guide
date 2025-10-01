import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskData: any) => void;
  task?: any;
  template?: any;
  fields?: any[];
}

const categories = [
  'soil_preparation',
  'planting',
  'fertilization',
  'irrigation',
  'pest_management',
  'harvesting',
  'equipment_maintenance',
  'cover_crops',
  'soil_testing',
  'record_keeping',
  'other'
];

const priorities = ['low', 'medium', 'high', 'critical'];

export const TaskDialog = ({ open, onOpenChange, onSave, task, template, fields = [] }: TaskDialogProps) => {
  const { subscription } = useSubscription();
  const canUseRecurring = subscription?.tier !== 'free';
  const canUseAdvancedRecurring = subscription?.tier === 'pro' || subscription?.tier === 'enterprise';
  
  const [formData, setFormData] = useState({
    task_name: '',
    category: 'other',
    description: '',
    priority: 'medium',
    scheduled_date: undefined as Date | undefined,
    due_date: undefined as Date | undefined,
    estimated_duration_hours: '',
    field_id: '',
    crops_involved: '',
    location_notes: '',
    is_recurring: false,
    recurrence_pattern: 'annual',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        task_name: task.task_name || '',
        category: task.category || 'other',
        description: task.description || '',
        priority: task.priority || 'medium',
        scheduled_date: task.scheduled_date ? new Date(task.scheduled_date) : undefined,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        estimated_duration_hours: task.estimated_duration_hours?.toString() || '',
        field_id: task.field_id || '',
        crops_involved: task.crops_involved?.join(', ') || '',
        location_notes: task.location_notes || '',
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern || 'annual',
      });
    } else if (template) {
      setFormData({
        task_name: template.task_name || '',
        category: template.category || 'other',
        description: template.description || '',
        priority: template.priority || 'medium',
        scheduled_date: undefined,
        due_date: undefined,
        estimated_duration_hours: template.estimated_duration_hours?.toString() || '',
        field_id: '',
        crops_involved: template.recommended_for_crops?.join(', ') || '',
        location_notes: '',
        is_recurring: false,
        recurrence_pattern: 'annual',
      });
    } else {
      // Reset form
      setFormData({
        task_name: '',
        category: 'other',
        description: '',
        priority: 'medium',
        scheduled_date: undefined,
        due_date: undefined,
        estimated_duration_hours: '',
        field_id: '',
        crops_involved: '',
        location_notes: '',
        is_recurring: false,
        recurrence_pattern: 'annual',
      });
    }
  }, [task, template, open]);

  const handleSave = () => {
    // Enforce tier restrictions on save
    let finalRecurringPattern = formData.recurrence_pattern;
    if (!canUseRecurring) {
      // Force non-recurring for free tier
      formData.is_recurring = false;
    } else if (!canUseAdvancedRecurring && formData.recurrence_pattern !== 'annual') {
      // Force annual for starter tier if they somehow selected advanced
      finalRecurringPattern = 'annual';
    }
    
    const taskData = {
      ...formData,
      recurrence_pattern: finalRecurringPattern,
      estimated_duration_hours: formData.estimated_duration_hours ? parseFloat(formData.estimated_duration_hours) : null,
      crops_involved: formData.crops_involved ? formData.crops_involved.split(',').map(c => c.trim()) : null,
      field_id: formData.field_id || null,
    };
    onSave(taskData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update task details' : 'Add a new task to your schedule'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task_name">Task Name</Label>
            <Input
              id="task_name"
              value={formData.task_name}
              onChange={e => setFormData({ ...formData, task_name: e.target.value })}
              placeholder="e.g., Spring Planting"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Scheduled Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_date ? format(formData.scheduled_date, 'PP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduled_date}
                    onSelect={date => setFormData({ ...formData, scheduled_date: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, 'PP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={date => setFormData({ ...formData, due_date: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="estimated_duration">Estimated Duration (hours)</Label>
              <Input
                id="estimated_duration"
                type="number"
                step="0.5"
                value={formData.estimated_duration_hours}
                onChange={e => setFormData({ ...formData, estimated_duration_hours: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field">Field (optional)</Label>
              <Select value={formData.field_id} onValueChange={v => setFormData({ ...formData, field_id: v })}>
                <SelectTrigger id="field">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="crops">Crops (comma-separated)</Label>
            <Input
              id="crops"
              value={formData.crops_involved}
              onChange={e => setFormData({ ...formData, crops_involved: e.target.value })}
              placeholder="e.g., Tomatoes, Peppers, Corn"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location_notes">Location Notes</Label>
            <Input
              id="location_notes"
              value={formData.location_notes}
              onChange={e => setFormData({ ...formData, location_notes: e.target.value })}
              placeholder="Specific location or instructions"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={checked => setFormData({ ...formData, is_recurring: checked as boolean })}
                  disabled={!canUseRecurring}
                />
                <Label htmlFor="recurring" className={`cursor-pointer ${!canUseRecurring ? 'opacity-50' : ''}`}>
                  Make this a recurring task
                </Label>
              </div>
              {!canUseRecurring && (
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Starter+
                </Badge>
              )}
            </div>

            {formData.is_recurring && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="recurrence_pattern" className="text-sm">Recurrence Pattern</Label>
                <Select 
                  value={formData.recurrence_pattern} 
                  onValueChange={v => setFormData({ ...formData, recurrence_pattern: v })}
                >
                  <SelectTrigger id="recurrence_pattern">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual (yearly)</SelectItem>
                    <SelectItem value="seasonal" disabled={!canUseAdvancedRecurring}>
                      Seasonal (quarterly) {!canUseAdvancedRecurring && '- Pro+'}
                    </SelectItem>
                    <SelectItem value="monthly" disabled={!canUseAdvancedRecurring}>
                      Monthly {!canUseAdvancedRecurring && '- Pro+'}
                    </SelectItem>
                    <SelectItem value="custom" disabled={!canUseAdvancedRecurring}>
                      Custom {!canUseAdvancedRecurring && '- Pro+'}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!canUseAdvancedRecurring && formData.recurrence_pattern !== 'annual' && (
                  <p className="text-xs text-yellow-600">
                    Advanced recurring patterns require Pro plan. Task will be set to annual.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.task_name}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
