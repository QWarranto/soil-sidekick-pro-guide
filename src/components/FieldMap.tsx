import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Save, Trash2, Edit3, WifiOff, Wifi, CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { OfflineSyncService } from '@/services/offlineSync';

interface Field {
  id: string;
  name: string;
  description?: string;
  boundary_coordinates: any;
  area_acres?: number;
  crop_type?: string;
  planting_date?: string;
  harvest_date?: string;
}

interface FieldMapProps {
  onFieldSelect?: (field: Field | null) => void;
}

export const FieldMap: React.FC<FieldMapProps> = ({ onFieldSelect }) => {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState({
    name: '',
    description: '',
    crop_type: '',
    planting_date: '',
    harvest_date: ''
  });

  // Offline support
  const { isOnline, isWifi, isCellular } = useNetworkStatus();
  const { 
    data: offlineFields, 
    saveOfflineData, 
    markAsSynced,
    needsSync 
  } = useOfflineStorage<Field[]>('fields_cache');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Check pending sync count
  useEffect(() => {
    const checkPending = async () => {
      const count = await OfflineSyncService.getPendingSyncCount();
      setPendingSyncCount(count);
    };
    checkPending();
  }, [fields]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && needsSync) {
      syncOfflineData();
    }
  }, [isOnline, needsSync]);

  const syncOfflineData = async () => {
    try {
      const result = await OfflineSyncService.processSyncQueue();
      if (result.success) {
        toast.success(`Synced ${result.synced} item(s) successfully`);
        await markAsSynced();
        setPendingSyncCount(0);
        loadFields();
      } else {
        toast.error(`Sync completed with ${result.failed} error(s)`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync offline changes');
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get Mapbox token from Supabase secrets
    const initializeMap = async () => {
      try {
        const { data: secrets } = await supabase.functions.invoke('get-mapbox-token');
        const mapboxToken = secrets?.MAPBOX_PUBLIC_TOKEN;
        
        if (!mapboxToken) {
          toast.error('Mapbox token not configured. Please contact administrator.');
          return;
        }

        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: [-95.7129, 37.0902], // Center of US
          zoom: 10
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          loadFields();
        });

      } catch (error) {
        console.error('Failed to initialize map:', error);
        toast.error('Failed to initialize map. Please check your connection.');
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  const loadFields = async () => {
    try {
      if (isOnline) {
        const { data, error } = await supabase
          .from('fields')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setFields(data || []);
        // Save to offline cache
        await saveOfflineData(data || [], true);
        data?.forEach(field => {
          addFieldToMap(field);
        });
      } else {
        // Load from offline cache
        if (offlineFields) {
          setFields(offlineFields);
          offlineFields.forEach(field => {
            addFieldToMap(field);
          });
        }
        toast.info('Loaded fields from offline cache', { icon: <CloudOff className="h-4 w-4" /> });
      }
    } catch (error) {
      console.error('Error loading fields:', error);
      // Try loading from offline cache as fallback
      if (offlineFields) {
        setFields(offlineFields);
        offlineFields.forEach(field => {
          addFieldToMap(field);
        });
        toast.warning('Loaded fields from offline cache');
      } else {
        toast.error('Failed to load fields');
      }
    }
  };

  const addFieldToMap = (field: Field) => {
    if (!map.current) return;

    const sourceId = `field-${field.id}`;
    const layerId = `field-layer-${field.id}`;

    // Add source if it doesn't exist
    if (!map.current.getSource(sourceId)) {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: field.boundary_coordinates,
          properties: {
            id: field.id,
            name: field.name,
            crop_type: field.crop_type,
            area_acres: field.area_acres
          }
        }
      });

      // Add fill layer
      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.3
        }
      });

      // Add border layer
      map.current.addLayer({
        id: `${layerId}-border`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 2
        }
      });

      // Add click handler
      map.current.on('click', layerId, () => {
        setSelectedField(field);
        onFieldSelect?.(field);
      });

      // Change cursor on hover
      map.current.on('mouseenter', layerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', layerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    }
  };

  const startDrawing = () => {
    setIsDrawingMode(true);
    toast.info('Click on the map to start drawing your field boundary');
  };

  const saveField = async () => {
    if (!user) {
      toast.error('Please log in to save fields');
      return;
    }

    if (!newFieldForm.name.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    // For demo purposes, create a sample polygon
    const sampleCoordinates = {
      type: 'Polygon',
      coordinates: [[
        [-95.7129, 37.0902],
        [-95.7129, 37.0912],
        [-95.7119, 37.0912],
        [-95.7119, 37.0902],
        [-95.7129, 37.0902]
      ]]
    };

    const fieldData = {
      user_id: user.id,
      name: newFieldForm.name,
      description: newFieldForm.description,
      boundary_coordinates: sampleCoordinates,
      area_acres: 10.5,
      crop_type: newFieldForm.crop_type,
      planting_date: newFieldForm.planting_date || null,
      harvest_date: newFieldForm.harvest_date || null
    };

    try {
      if (isOnline) {
        const { data, error } = await supabase
          .from('fields')
          .insert(fieldData)
          .select()
          .single();

        if (error) throw error;

        toast.success('Field saved successfully!');
        setFields(prev => [...prev, data]);
        addFieldToMap(data);
        
        // Update offline cache
        const updatedFields = [...fields, data];
        await saveOfflineData(updatedFields, true);
      } else {
        // Save offline
        const tempField = {
          ...fieldData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await OfflineSyncService.addToSyncQueue('fields', 'insert', fieldData);
        setFields(prev => [...prev, tempField]);
        addFieldToMap(tempField);
        
        // Update offline cache
        const updatedFields = [...fields, tempField];
        await saveOfflineData(updatedFields, false);
        setPendingSyncCount(prev => prev + 1);
        
        toast.success('Field saved offline. Will sync when online.', { 
          icon: <CloudOff className="h-4 w-4" /> 
        });
      }

      setNewFieldForm({
        name: '',
        description: '',
        crop_type: '',
        planting_date: '',
        harvest_date: ''
      });
      setIsDrawingMode(false);
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error('Failed to save field');
    }
  };

  const deleteField = async (fieldId: string) => {
    try {
      if (isOnline) {
        const { error } = await supabase
          .from('fields')
          .delete()
          .eq('id', fieldId);

        if (error) throw error;

        const updatedFields = fields.filter(f => f.id !== fieldId);
        setFields(updatedFields);
        
        // Update offline cache
        await saveOfflineData(updatedFields, true);
      } else {
        // Queue for deletion when online
        await OfflineSyncService.addToSyncQueue('fields', 'delete', { id: fieldId });
        const updatedFields = fields.filter(f => f.id !== fieldId);
        setFields(updatedFields);
        
        // Update offline cache
        await saveOfflineData(updatedFields, false);
        setPendingSyncCount(prev => prev + 1);
        
        toast.success('Field queued for deletion. Will sync when online.', {
          icon: <CloudOff className="h-4 w-4" />
        });
      }
      
      // Remove from map
      const sourceId = `field-${fieldId}`;
      const layerId = `field-layer-${fieldId}`;
      
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeLayer(`${layerId}-border`);
        map.current.removeSource(sourceId);
      }

      if (isOnline) {
        toast.success('Field deleted successfully');
      }
      
      if (selectedField?.id === fieldId) {
        setSelectedField(null);
        onFieldSelect?.(null);
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('Failed to delete field');
    }
  };

  const cropTypes = [
    'Corn', 'Soybeans', 'Wheat', 'Cotton', 'Rice', 
    'Barley', 'Oats', 'Sorghum', 'Sunflower', 'Other'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Field Map</h3>
              
              {/* Network Status Indicator */}
              <Badge variant={isOnline ? "default" : "destructive"} className="ml-2">
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    {isWifi ? 'WiFi' : isCellular ? 'Cellular' : 'Online'}
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>

              {/* Pending Sync Indicator */}
              {pendingSyncCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  <CloudOff className="h-3 w-3 mr-1" />
                  {pendingSyncCount} pending
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {pendingSyncCount > 0 && isOnline && (
                <Button 
                  onClick={syncOfflineData}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Wifi className="h-4 w-4" />
                  Sync Now
                </Button>
              )}
              <Button 
                onClick={startDrawing}
                disabled={isDrawingMode}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {isDrawingMode ? 'Drawing...' : 'Add Field'}
              </Button>
            </div>
          </div>
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg border"
            style={{ minHeight: '400px' }}
          />
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* New Field Form */}
        {isDrawingMode && (
          <Card className="p-4">
            <h4 className="text-lg font-semibold mb-4">New Field Details</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="field-name">Field Name *</Label>
                <Input
                  id="field-name"
                  value={newFieldForm.name}
                  onChange={(e) => setNewFieldForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter field name"
                />
              </div>
              
              <div>
                <Label htmlFor="field-description">Description</Label>
                <Textarea
                  id="field-description"
                  value={newFieldForm.description}
                  onChange={(e) => setNewFieldForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Field description (optional)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="crop-type">Crop Type</Label>
                <Select value={newFieldForm.crop_type} onValueChange={(value) => setNewFieldForm(prev => ({ ...prev, crop_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map(crop => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="planting-date">Planting Date</Label>
                  <Input
                    id="planting-date"
                    type="date"
                    value={newFieldForm.planting_date}
                    onChange={(e) => setNewFieldForm(prev => ({ ...prev, planting_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="harvest-date">Harvest Date</Label>
                  <Input
                    id="harvest-date"
                    type="date"
                    value={newFieldForm.harvest_date}
                    onChange={(e) => setNewFieldForm(prev => ({ ...prev, harvest_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveField} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Field
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDrawingMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Selected Field Info */}
        {selectedField && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">{selectedField.name}</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteField(selectedField.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {selectedField.description && (
                <p className="text-sm text-muted-foreground">{selectedField.description}</p>
              )}
              {selectedField.area_acres && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedField.area_acres} acres</Badge>
                </div>
              )}
              {selectedField.crop_type && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedField.crop_type}</Badge>
                </div>
              )}
              {selectedField.planting_date && (
                <p className="text-sm">
                  <strong>Planted:</strong> {new Date(selectedField.planting_date).toLocaleDateString()}
                </p>
              )}
              {selectedField.harvest_date && (
                <p className="text-sm">
                  <strong>Harvest:</strong> {new Date(selectedField.harvest_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Fields List */}
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">Your Fields ({fields.length})</h4>
          <div className="space-y-2">
            {fields.map(field => (
              <div
                key={field.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedField?.id === field.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setSelectedField(field);
                  onFieldSelect?.(field);
                }}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{field.name}</h5>
                  {field.area_acres && (
                    <Badge variant="secondary" className="text-xs">
                      {field.area_acres} acres
                    </Badge>
                  )}
                </div>
                {field.crop_type && (
                  <p className="text-sm text-muted-foreground mt-1">{field.crop_type}</p>
                )}
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No fields added yet. Click "Add Field" to get started.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};