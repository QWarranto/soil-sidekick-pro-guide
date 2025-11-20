import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface UserTask {
  id: string;
  task_name: string;
  category: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'cancelled';
  priority: string;
  scheduled_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  estimated_duration_hours: number | null;
  crops_involved: string[] | null;
  location_notes: string | null;
  field_id: string | null;
}

interface TaskListProps {
  tasks: UserTask[];
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onTaskEdit: (task: UserTask) => void;
  onTaskDelete: (taskId: string) => void;
  fields?: any[];
}

export const TaskList = ({ tasks, onTaskComplete, onTaskEdit, onTaskDelete, fields = [] }: TaskListProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');

  // Extract unique crop types from tasks
  const availableCrops = useMemo(() => {
    const crops = new Set<string>();
    tasks.forEach(task => {
      if (task.crops_involved && task.crops_involved.length > 0) {
        task.crops_involved.forEach(crop => crops.add(crop));
      }
    });
    return Array.from(crops).sort();
  }, [tasks]);

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      const cropMatch = cropFilter === 'all' || 
        (task.crops_involved && task.crops_involved.includes(cropFilter));
      return statusMatch && cropMatch;
    });
  }, [tasks, statusFilter, cropFilter]);

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    return <Circle className="h-4 w-4" />;
  };

  const getFieldName = (fieldId: string | null) => {
    if (!fieldId || !fields) return null;
    const field = fields.find(f => f.id === fieldId);
    return field?.name;
  };

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {} as Record<string, UserTask[]>);

  const statusOrder = ['pending', 'in_progress', 'completed', 'skipped', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status Filter
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Crop Type Filter
              </label>
              <Select value={cropFilter} onValueChange={setCropFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {availableCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(statusFilter !== 'all' || cropFilter !== 'all') && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setCropFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </CardContent>
      </Card>

      {/* Task Lists */}
      {statusOrder.map(status => {
        const statusTasks = groupedTasks[status] || [];
        if (statusTasks.length === 0) return null;

        return (
          <div key={status}>
            <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
              {status === 'pending' && <Circle className="h-5 w-5 text-yellow-600" />}
              {status === 'in_progress' && <Clock className="h-5 w-5 text-blue-600" />}
              {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {status.replace('_', ' ')} ({statusTasks.length})
            </h3>
            <div className="space-y-3">
              {statusTasks.map(task => {
                const isExpanded = expandedTasks.has(task.id);
                const fieldName = getFieldName(task.field_id);

                return (
                  <Card key={task.id} className={task.status === 'completed' ? 'opacity-75' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={(checked) => onTaskComplete(task.id, checked as boolean)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.task_name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {task.category.replace('_', ' ')}
                                </Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                {fieldName && (
                                  <Badge variant="secondary" className="text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {fieldName}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onTaskEdit(task)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onTaskDelete(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpand(task.id)}
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {(task.scheduled_date || task.due_date) && (
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                              {task.scheduled_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Scheduled: {format(new Date(task.scheduled_date), 'MMM d, yyyy')}
                                </div>
                              )}
                              {task.due_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                                </div>
                              )}
                              {task.estimated_duration_hours && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.estimated_duration_hours}h estimated
                                </div>
                              )}
                            </div>
                          )}

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t space-y-2">
                              {task.description && (
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              )}
                              {task.crops_involved && task.crops_involved.length > 0 && (
                                <div className="text-sm">
                                  <span className="font-medium">Crops: </span>
                                  {task.crops_involved.join(', ')}
                                </div>
                              )}
                              {task.location_notes && (
                                <div className="text-sm">
                                  <span className="font-medium">Location: </span>
                                  {task.location_notes}
                                </div>
                              )}
                              {task.completed_date && (
                                <div className="text-sm text-green-600">
                                  Completed: {format(new Date(task.completed_date), 'MMM d, yyyy')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Circle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No tasks yet. Add your first task to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
