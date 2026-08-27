import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, TreeDeciduous, Leaf, Layers, MapPin, AlertTriangle } from 'lucide-react';
import { useManagedAssets, type CreateAssetInput, type AssetType, type ConditionRating, type RiskRating, type ManagedAsset } from '@/hooks/useManagedAssets';
import { AssetExportPanel } from '@/components/AssetExportPanel';

const assetTypeIcons = {
  tree: TreeDeciduous,
  shrub: Leaf,
  turf: Layers,
  hardscape: Layers,
  other: MapPin,
};

const conditionColors: Record<ConditionRating, string> = {
  excellent: 'bg-green-500',
  good: 'bg-green-400',
  fair: 'bg-yellow-500',
  poor: 'bg-orange-500',
  dead: 'bg-red-500',
};

const riskColors: Record<RiskRating, string> = {
  low: 'bg-green-500',
  moderate: 'bg-yellow-500',
  high: 'bg-orange-500',
  extreme: 'bg-red-500',
};

interface AssetFormProps {
  asset?: ManagedAsset;
  onSubmit: (data: CreateAssetInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function AssetForm({ asset, onSubmit, onCancel, isLoading }: AssetFormProps) {
  const [formData, setFormData] = useState<CreateAssetInput>({
    asset_type: asset?.asset_type ?? 'tree',
    latitude: asset?.latitude ?? 0,
    longitude: asset?.longitude ?? 0,
    species: asset?.species ?? '',
    common_name: asset?.common_name ?? '',
    dbh_inches: asset?.dbh_inches ?? undefined,
    height_feet: asset?.height_feet ?? undefined,
    canopy_spread_feet: asset?.canopy_spread_feet ?? undefined,
    condition_rating: asset?.condition_rating ?? undefined,
    risk_rating: asset?.risk_rating ?? undefined,
    maintenance_priority: asset?.maintenance_priority ?? undefined,
    notes: asset?.notes ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="asset_type">Asset Type *</Label>
          <Select
            value={formData.asset_type}
            onValueChange={(value: AssetType) => setFormData({ ...formData, asset_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tree">Tree</SelectItem>
              <SelectItem value="shrub">Shrub</SelectItem>
              <SelectItem value="turf">Turf</SelectItem>
              <SelectItem value="hardscape">Hardscape</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="common_name">Common Name</Label>
          <Input
            id="common_name"
            value={formData.common_name}
            onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
            placeholder="e.g., Red Maple"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            placeholder="e.g., Acer rubrum"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition_rating">Condition</Label>
          <Select
            value={formData.condition_rating ?? ''}
            onValueChange={(value: ConditionRating) => setFormData({ ...formData, condition_rating: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="dead">Dead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dbh_inches">DBH (inches)</Label>
          <Input
            id="dbh_inches"
            type="number"
            step="0.1"
            value={formData.dbh_inches ?? ''}
            onChange={(e) => setFormData({ ...formData, dbh_inches: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height_feet">Height (feet)</Label>
          <Input
            id="height_feet"
            type="number"
            step="0.1"
            value={formData.height_feet ?? ''}
            onChange={(e) => setFormData({ ...formData, height_feet: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canopy_spread_feet">Canopy Spread (feet)</Label>
          <Input
            id="canopy_spread_feet"
            type="number"
            step="0.1"
            value={formData.canopy_spread_feet ?? ''}
            onChange={(e) => setFormData({ ...formData, canopy_spread_feet: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="risk_rating">Risk Rating</Label>
          <Select
            value={formData.risk_rating ?? ''}
            onValueChange={(value: RiskRating) => setFormData({ ...formData, risk_rating: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance_priority">Maintenance Priority (1-5)</Label>
          <Input
            id="maintenance_priority"
            type="number"
            min="1"
            max="5"
            value={formData.maintenance_priority ?? ''}
            onChange={(e) => setFormData({ ...formData, maintenance_priority: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional observations..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
}

export function AssetManagement() {
  const { assets, isLoading, createAsset, updateAsset, deleteAsset, getAssetStats } = useManagedAssets();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<ManagedAsset | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const stats = getAssetStats();

  const handleCreate = (data: CreateAssetInput) => {
    createAsset.mutate(data, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (data: CreateAssetInput) => {
    if (!editingAsset) return;
    updateAsset.mutate({ id: editingAsset.id, ...data }, {
      onSuccess: () => setEditingAsset(null),
    });
  };

  const handleDelete = (id: string) => {
    deleteAsset.mutate(id, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5" />
              GIS Asset Management
            </CardTitle>
            <CardDescription>
              Manage landscape assets with GIS-compliant data
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Create a new landscape asset with GIS coordinates
                </DialogDescription>
              </DialogHeader>
              <AssetForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateOpen(false)}
                isLoading={createAsset.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Asset List</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="export">GIS Export</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {!assets || assets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No assets found. Add your first asset to get started.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name / Species</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => {
                      const Icon = assetTypeIcons[asset.asset_type];
                      return (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="capitalize">{asset.asset_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{asset.common_name || '—'}</div>
                              {asset.species && (
                                <div className="text-sm text-muted-foreground italic">{asset.species}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {asset.latitude.toFixed(6)}, {asset.longitude.toFixed(6)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {asset.condition_rating ? (
                              <Badge className={`${conditionColors[asset.condition_rating]} text-white capitalize`}>
                                {asset.condition_rating}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {asset.risk_rating ? (
                              <Badge className={`${riskColors[asset.risk_rating]} text-white capitalize`}>
                                {asset.risk_rating}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingAsset(asset)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteConfirmId(asset.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            {stats && stats.total > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">By Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(stats.byRisk).map(([risk, count]) => (
                        <div key={risk} className="flex justify-between text-sm">
                          <Badge className={`${riskColors[risk as RiskRating]} text-white capitalize`}>
                            {risk}
                          </Badge>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No statistics available. Add assets to see analytics.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export">
            <AssetExportPanel />
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={!!editingAsset} onOpenChange={(open) => !open && setEditingAsset(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update the asset information
              </DialogDescription>
            </DialogHeader>
            {editingAsset && (
              <AssetForm
                asset={editingAsset}
                onSubmit={handleUpdate}
                onCancel={() => setEditingAsset(null)}
                isLoading={updateAsset.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Asset</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this asset? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                disabled={deleteAsset.isPending}
              >
                {deleteAsset.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
