import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SoilAnalysis {
  id: string;
  ph_level?: number;
  organic_matter?: number;
  nitrogen_level?: string;
  phosphorus_level?: string;
  potassium_level?: string;
  recommendations?: string;
  county_fips: string;
  county_name: string;
  state_code: string;
  property_address?: string;
}

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
  soilAnalysis?: SoilAnalysis;
}

export const useFields = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['fields', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Fetch fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('fields')
        .select('*')
        .order('name');

      if (fieldsError) throw fieldsError;

      // Fetch soil analyses for the user
      const { data: soilAnalysesData, error: soilError } = await supabase
        .from('soil_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (soilError) throw soilError;

      // Merge fields with soil analyses
      const enrichedFields = fieldsData.map((field, index) => {
        // Try to match by property address or use index
        let soilAnalysis = soilAnalysesData?.find(sa => 
          sa.property_address?.toLowerCase().includes(field.name.toLowerCase())
        );
        
        if (!soilAnalysis && soilAnalysesData && soilAnalysesData[index]) {
          soilAnalysis = soilAnalysesData[index];
        }

        return {
          ...field,
          soilAnalysis: soilAnalysis ? {
            id: soilAnalysis.id,
            ph_level: soilAnalysis.ph_level ?? undefined,
            organic_matter: soilAnalysis.organic_matter ?? undefined,
            nitrogen_level: soilAnalysis.nitrogen_level ?? undefined,
            phosphorus_level: soilAnalysis.phosphorus_level ?? undefined,
            potassium_level: soilAnalysis.potassium_level ?? undefined,
            recommendations: soilAnalysis.recommendations ?? undefined,
            county_fips: soilAnalysis.county_fips,
            county_name: soilAnalysis.county_name,
            state_code: soilAnalysis.state_code,
            property_address: soilAnalysis.property_address ?? undefined,
          } : undefined,
        } as Field;
      });

      return enrichedFields;
    },
    enabled: !!user?.id,
  });

  const createField = useMutation({
    mutationFn: async (fieldData: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'soilAnalysis'>) => {
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
    mutationFn: async ({ id, soilAnalysis, ...updates }: Partial<Field> & { id: string }) => {
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
