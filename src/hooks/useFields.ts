import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Field {
  id: string;
  name: string;
  description?: string;
  boundary_coordinates: any;
  area_acres?: number;
  crop_type?: string;
  planting_date?: string;
  harvest_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useFields = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Field[];
    },
    enabled: !!user?.id,
  });

  const createField = useMutation({
    mutationFn: async (fieldData: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fields')
        .insert([{ ...fieldData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data as Field;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', user?.id] });
      toast({
        title: 'Success',
        description: 'Field created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Field> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Field;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', user?.id] });
      toast({
        title: 'Success',
        description: 'Field updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields', user?.id] });
      toast({
        title: 'Success',
        description: 'Field deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    fields,
    isLoading,
    error,
    createField: createField.mutate,
    updateField: updateField.mutate,
    deleteField: deleteField.mutate,
    isCreating: createField.isPending,
    isUpdating: updateField.isPending,
    isDeleting: deleteField.isPending,
  };
};
