import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ListTodo, LogOut, ArrowLeft, Plus, Library, History } from 'lucide-react';
import { TaskList } from '@/components/TaskManagement/TaskList';
import { TaskTemplateLibrary } from '@/components/TaskManagement/TaskTemplateLibrary';
import { TaskDialog } from '@/components/TaskManagement/TaskDialog';

const TaskManager = () => {
  const { user, signOut, trialUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    if (user || trialUser) {
      fetchTasks();
      fetchFields();
    }
  }, [user, trialUser]);

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

  const handleCreateTask = () => {
    setSelectedTask(null);
    setSelectedTemplate(null);
    setDialogOpen(true);
  };

  const handleAddFromTemplate = (template: any) => {
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
        // Create new task
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
            <span className="text-sm text-muted-foreground">
              {(user?.email || trialUser?.email) ?? 'Trial User'}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
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
                </div>
                <Button onClick={handleCreateTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Task
                </Button>
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
                    <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
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
                  <CardTitle>Task History & Learnings</CardTitle>
                  <CardDescription>
                    Review completed tasks and your notes for future reference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Task history view coming soon!</p>
                    <p className="text-sm mt-2">
                      Complete tasks and add notes to build your farming knowledge base
                    </p>
                  </div>
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
