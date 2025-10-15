import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ListTodo, ArrowLeft, Plus, Library, History, Lock } from 'lucide-react';
import { TaskList } from '@/components/TaskManagement/TaskList';
import { TaskTemplateLibrary } from '@/components/TaskManagement/TaskTemplateLibrary';
import { TaskDialog } from '@/components/TaskManagement/TaskDialog';
import { TaskListSkeleton } from '@/components/skeletons/TaskListSkeleton';

const TaskManager = () => {
  const { user, trialUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, checkFeatureAccess, incrementUsage, showUpgradePrompt } = useSubscription();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [taskCreationAllowed, setTaskCreationAllowed] = useState(true);

  useEffect(() => {
    if (user || trialUser) {
      fetchTasks();
      fetchFields();
      checkTaskCreationLimit();
    }
  }, [user, trialUser, tasks.length]);

  const checkTaskCreationLimit = async () => {
    // Free tier: max 10 tasks per season
    if (subscription?.tier === 'free') {
      const access = await checkFeatureAccess('task_creation');
      setTaskCreationAllowed(access.canUse);
    } else {
      setTaskCreationAllowed(true);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .order('scheduled_date', { ascending: true, nullsFirst: false })
        .order('priority', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name');

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleCreateTask = async () => {
    // Check task creation limit for free tier
    if (subscription?.tier === 'free' && tasks.length >= 10) {
      showUpgradePrompt('task_creation', 'You\'ve reached the free tier limit of 10 tasks. Upgrade to Starter for unlimited tasks.');
      return;
    }
    
    setSelectedTask(null);
    setSelectedTemplate(null);
    setDialogOpen(true);
  };

  const handleAddFromTemplate = async (template: any) => {
    // Check task creation limit for free tier
    if (subscription?.tier === 'free' && tasks.length >= 10) {
      showUpgradePrompt('task_creation', 'You\'ve reached the free tier limit of 10 tasks. Upgrade to Starter for unlimited tasks.');
      return;
    }
    
    setSelectedTask(null);
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setSelectedTemplate(null);
    setDialogOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (selectedTask) {
        // Update existing task
        const { error } = await supabase
          .from('user_tasks')
          .update(taskData)
          .eq('id', selectedTask.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
      } else {
        // Create new task - increment usage for free tier
        if (subscription?.tier === 'free') {
          await incrementUsage('task_creation', 1);
        }
        
        const { error } = await supabase
          .from('user_tasks')
          .insert({
            ...taskData,
            user_id: user?.id || trialUser?.id,
            status: 'pending',
            created_from_template_id: selectedTemplate?.id || null,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task created successfully',
        });
      }

      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .update({
          status: completed ? 'completed' : 'pending',
          completed_date: completed ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: completed ? 'Task marked as completed' : 'Task marked as pending',
      });

      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 floating-animation">
              <ListTodo className="h-6 w-6 text-green-600 pulse-glow" />
              <span className="text-xl font-bold gradient-text">Seasonal Task Manager</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl gradient-text">Task Management</CardTitle>
                  <CardDescription>
                    Never forget seasonal tasks again. Track what works year after year.
                  </CardDescription>
                  {subscription?.tier === 'free' && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{tasks.length}/10 tasks created</Badge>
                      {tasks.length >= 8 && (
                        <span className="text-xs text-yellow-600">
                          Approaching limit - upgrade for unlimited tasks
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {subscription?.tier === 'free' && tasks.length >= 10 && (
                    <Button variant="outline" onClick={() => navigate('/pricing')}>
                      <Lock className="h-4 w-4 mr-2" />
                      Upgrade for More
                    </Button>
                  )}
                  <Button 
                    onClick={handleCreateTask}
                    disabled={subscription?.tier === 'free' && tasks.length >= 10}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Task
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tasks">
                <ListTodo className="h-4 w-4 mr-2" />
                My Tasks
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Library className="h-4 w-4 mr-2" />
                Task Library
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                History & Learnings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>
                    Manage your seasonal farming tasks and track completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <TaskListSkeleton />
                  ) : (
                    <TaskList
                      tasks={tasks}
                      onTaskComplete={handleTaskComplete}
                      onTaskEdit={handleEditTask}
                      onTaskDelete={handleDeleteTask}
                      fields={fields}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <TaskTemplateLibrary onAddTask={handleAddFromTemplate} />
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Task History & Learnings</CardTitle>
                      <CardDescription>
                        Review completed tasks and your notes for future reference
                      </CardDescription>
                    </div>
                    {(subscription?.tier === 'free') && (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Starter+ Feature
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {(subscription?.tier === 'free') ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <Lock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-semibold mb-2">Task History Tracking</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Track what works year after year with task completion notes and learnings
                      </p>
                      <Button onClick={() => navigate('/pricing')}>
                        Upgrade to Starter Plan
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Task history view coming soon!</p>
                      <p className="text-sm mt-2">
                        Complete tasks and add notes to build your farming knowledge base
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        task={selectedTask}
        template={selectedTemplate}
        fields={fields}
      />
    </div>
  );
};

export default TaskManager;
