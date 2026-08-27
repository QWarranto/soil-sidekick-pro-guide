import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AssetType = 'tree' | 'shrub' | 'turf' | 'hardscape' | 'other';
export type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'dead';
export type RiskRating = 'low' | 'moderate' | 'high' | 'extreme';

export type SyncStatus = 'local' | 'synced' | 'pending' | 'conflict' | 'error';

export interface ManagedAsset {
  id: string;
  user_id: string;
  asset_type: AssetType;
  species: string | null;
  common_name: string | null;
  latitude: number | null;
  longitude: number | null;
  geometry: Record<string, unknown> | null;
  dbh_inches: number | null;
  height_feet: number | null;
  canopy_spread_feet: number | null;
  condition_rating: ConditionRating | null;
  risk_rating: RiskRating | null;
  maintenance_priority: number | null;
  last_inspection_date: string | null;
  next_inspection_due: string | null;
  notes: string | null;
  custom_fields: Record<string, unknown>;
  sync_source: string | null;
  external_id: string | null;
  sync_status: SyncStatus;
  last_synced_at: string | null;
  is_deleted: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAssetInput {
  asset_type: AssetType;
  latitude?: number | null;
  longitude?: number | null;
  species?: string | null;
  common_name?: string | null;
  geometry?: Record<string, unknown> | null;
  dbh_inches?: number | null;
  height_feet?: number | null;
  canopy_spread_feet?: number | null;
  condition_rating?: ConditionRating | null;
  risk_rating?: RiskRating | null;
  maintenance_priority?: number | null;
  last_inspection_date?: string | null;
  next_inspection_due?: string | null;
  notes?: string | null;
  custom_fields?: Record<string, unknown>;
  sync_source?: string | null;
  external_id?: string | null;
  sync_status?: SyncStatus;
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  id: string;
}

// Helper to bypass TypeScript for new table not yet in generated types
const managedAssetsTable = () => supabase.from('managed_assets' as 'profiles');

export function useManagedAssets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all assets for the current user
  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['managed-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('managed_assets' as any)
        .select('*')
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as unknown as ManagedAsset[];
    },
  });

  // Create a new asset
  const createAsset = useMutation({
    mutationFn: async (input: CreateAssetInput) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const insertData = {
        asset_type: input.asset_type,
        latitude: input.latitude,
        longitude: input.longitude,
        user_id: userData.user.id,
        species: input.species ?? null,
        common_name: input.common_name ?? null,
        geometry: input.geometry ?? null,
        dbh_inches: input.dbh_inches ?? null,
        height_feet: input.height_feet ?? null,
        canopy_spread_feet: input.canopy_spread_feet ?? null,
        condition_rating: input.condition_rating ?? null,
        risk_rating: input.risk_rating ?? null,
        maintenance_priority: input.maintenance_priority ?? null,
        last_inspection_date: input.last_inspection_date ?? null,
        next_inspection_due: input.next_inspection_due ?? null,
        notes: input.notes ?? null,
        custom_fields: input.custom_fields ?? {},
      };

      const { data, error } = await supabase
        .from('managed_assets' as any)
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ManagedAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-assets'] });
      toast({
        title: 'Asset Created',
        description: 'The asset has been added successfully.',
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

  // Update an existing asset
  const updateAsset = useMutation({
    mutationFn: async ({ id, ...input }: UpdateAssetInput) => {
      const updateData: Record<string, unknown> = {};
      if (input.asset_type !== undefined) updateData.asset_type = input.asset_type;
      if (input.latitude !== undefined) updateData.latitude = input.latitude;
      if (input.longitude !== undefined) updateData.longitude = input.longitude;
      if (input.species !== undefined) updateData.species = input.species;
      if (input.common_name !== undefined) updateData.common_name = input.common_name;
      if (input.geometry !== undefined) updateData.geometry = input.geometry;
      if (input.dbh_inches !== undefined) updateData.dbh_inches = input.dbh_inches;
      if (input.height_feet !== undefined) updateData.height_feet = input.height_feet;
      if (input.canopy_spread_feet !== undefined) updateData.canopy_spread_feet = input.canopy_spread_feet;
      if (input.condition_rating !== undefined) updateData.condition_rating = input.condition_rating;
      if (input.risk_rating !== undefined) updateData.risk_rating = input.risk_rating;
      if (input.maintenance_priority !== undefined) updateData.maintenance_priority = input.maintenance_priority;
      if (input.last_inspection_date !== undefined) updateData.last_inspection_date = input.last_inspection_date;
      if (input.next_inspection_due !== undefined) updateData.next_inspection_due = input.next_inspection_due;
      if (input.notes !== undefined) updateData.notes = input.notes;
      if (input.custom_fields !== undefined) updateData.custom_fields = input.custom_fields;

      const { data, error } = await supabase
        .from('managed_assets' as any)
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ManagedAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-assets'] });
      toast({
        title: 'Asset Updated',
        description: 'The asset has been updated successfully.',
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

  // Delete an asset
  const deleteAsset = useMutation({
    mutationFn: async (id: string) => {
      // Soft-delete to preserve audit history
      const { error } = await supabase
        .from('managed_assets' as any)
        .update({ is_deleted: true } as any)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-assets'] });
      toast({
        title: 'Asset Deleted',
        description: 'The asset has been removed successfully.',
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

  // Get a single asset by ID
  const getAssetById = async (id: string): Promise<ManagedAsset | null> => {
    const { data, error } = await supabase
      .from('managed_assets' as any)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as ManagedAsset | null;
  };

  // Get assets by type
  const getAssetsByType = (type: AssetType): ManagedAsset[] => {
    return assets?.filter((asset) => asset.asset_type === type) ?? [];
  };

  // Get asset statistics
  const getAssetStats = () => {
    if (!assets) return null;

    const stats = {
      total: assets.length,
      byType: {} as Record<AssetType, number>,
      byCondition: {} as Record<ConditionRating, number>,
      byRisk: {} as Record<RiskRating, number>,
    };

    assets.forEach((asset) => {
      stats.byType[asset.asset_type] = (stats.byType[asset.asset_type] || 0) + 1;
      if (asset.condition_rating) {
        stats.byCondition[asset.condition_rating] = (stats.byCondition[asset.condition_rating] || 0) + 1;
      }
      if (asset.risk_rating) {
        stats.byRisk[asset.risk_rating] = (stats.byRisk[asset.risk_rating] || 0) + 1;
      }
    });

    return stats;
  };

  return {
    assets,
    isLoading,
    error,
    refetch,
    createAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    getAssetsByType,
    getAssetStats,
  };
}
