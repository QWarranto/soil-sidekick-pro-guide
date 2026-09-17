# GIS Interoperability Implementation Schedule

**Objective:** Increase GIS Interoperability compliance from 20% → 90%  
**Timeline:** 6 weeks  
**Priority:** 🔴 Critical (Blocks Urban Forestry vertical)  
**Start Date:** Q1 2026

---

## Executive Summary

| Current State | Target State | Gap | Business Impact |
|---------------|--------------|-----|-----------------|
| 20% | 90% | 70% | Unlocks Urban Forestry + Precision Ag verticals |

**Current Limitations:**
- ❌ All endpoints are READ-only (POST for queries)
- ❌ No CRUD operations for asset/field management
- ❌ No WFS (Web Feature Service) endpoints
- ❌ No spatial querying capabilities
- ❌ No TreePlotter/Esri integration patterns

---

## Phase 1: CRUD Foundation (Weeks 1-2)

### Week 1: Database Schema & Core CRUD

#### Day 1-2: Asset Management Schema

**Migration: Create `managed_assets` table**

```sql
-- Unified asset table for trees, fields, infrastructure
CREATE TABLE public.managed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Asset identification
  asset_type TEXT NOT NULL CHECK (asset_type IN ('tree', 'field', 'infrastructure', 'water_body', 'sensor')),
  external_id TEXT, -- TreePlotter ID, Esri ObjectID, etc.
  name TEXT NOT NULL,
  description TEXT,
  
  -- Geospatial data (GeoJSON compatible)
  geometry JSONB NOT NULL, -- GeoJSON geometry object
  geometry_type TEXT GENERATED ALWAYS AS (geometry->>'type') STORED,
  centroid_lat DECIMAL(10, 8),
  centroid_lng DECIMAL(11, 8),
  area_sq_meters DECIMAL(15, 2),
  
  -- Asset-specific metadata
  properties JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Sync tracking for bi-directional integration
  sync_source TEXT, -- 'leafengines', 'treeplotter', 'esri', 'manual'
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_push', 'pending_pull', 'conflict')),
  last_synced_at TIMESTAMPTZ,
  external_updated_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  version INTEGER DEFAULT 1,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- Indexes for spatial and temporal queries
CREATE INDEX idx_assets_user ON managed_assets(user_id) WHERE NOT is_deleted;
CREATE INDEX idx_assets_type ON managed_assets(asset_type) WHERE NOT is_deleted;
CREATE INDEX idx_assets_geometry ON managed_assets USING GIN(geometry);
CREATE INDEX idx_assets_tags ON managed_assets USING GIN(tags);
CREATE INDEX idx_assets_sync ON managed_assets(sync_status) WHERE sync_status != 'synced';
CREATE INDEX idx_assets_centroid ON managed_assets(centroid_lat, centroid_lng) WHERE NOT is_deleted;

-- Enable RLS
ALTER TABLE managed_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own assets"
  ON managed_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assets"
  ON managed_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON managed_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can soft-delete own assets"
  ON managed_assets FOR UPDATE
  USING (auth.uid() = user_id AND is_deleted = FALSE);

-- Trigger for updated_at
CREATE TRIGGER update_managed_assets_updated_at
  BEFORE UPDATE ON managed_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for version increment
CREATE OR REPLACE FUNCTION increment_asset_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_asset_version_trigger
  BEFORE UPDATE ON managed_assets
  FOR EACH ROW
  EXECUTE FUNCTION increment_asset_version();
```

#### Day 2-3: Asset History Table (Audit Trail)

```sql
-- Full audit trail for SOC 2 compliance and conflict resolution
CREATE TABLE public.asset_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES managed_assets(id) ON DELETE CASCADE NOT NULL,
  
  -- Change tracking
  operation TEXT NOT NULL CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'SYNC_PUSH', 'SYNC_PULL')),
  changed_fields TEXT[],
  previous_values JSONB,
  new_values JSONB,
  
  -- Context
  changed_by UUID REFERENCES auth.users(id),
  change_source TEXT, -- 'api', 'web', 'sync', 'bulk_import'
  sync_reference TEXT, -- External transaction ID for sync operations
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asset_history_asset ON asset_history(asset_id);
CREATE INDEX idx_asset_history_time ON asset_history(created_at DESC);

-- RLS: Users can view history for their own assets
ALTER TABLE asset_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own asset history"
  ON asset_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM managed_assets 
      WHERE managed_assets.id = asset_history.asset_id 
      AND managed_assets.user_id = auth.uid()
    )
  );
```

#### Day 3-4: CRUD Edge Function

**File:** `supabase/functions/assets-crud/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createTimingHeaders } from "../_shared/response-timing.ts";

// Validation schemas
const geometrySchema = z.object({
  type: z.enum(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']),
  coordinates: z.any(), // GeoJSON coordinates
});

const assetCreateSchema = z.object({
  asset_type: z.enum(['tree', 'field', 'infrastructure', 'water_body', 'sensor']),
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  geometry: geometrySchema,
  properties: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  external_id: z.string().optional(),
});

const assetUpdateSchema = assetCreateSchema.partial().extend({
  id: z.string().uuid(),
});

const assetQuerySchema = z.object({
  asset_type: z.enum(['tree', 'field', 'infrastructure', 'water_body', 'sensor']).optional(),
  bbox: z.array(z.number()).length(4).optional(), // [minLng, minLat, maxLng, maxLat]
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(1000).default(100),
  offset: z.number().min(0).default(0),
  include_deleted: z.boolean().default(false),
});

serve(async (req) => {
  const startTime = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const assetId = pathParts[pathParts.length - 1];
    
    let result;
    
    switch (req.method) {
      case 'POST': {
        // CREATE or QUERY
        const body = await req.json();
        
        if (body.action === 'query') {
          // Spatial query
          const query = assetQuerySchema.parse(body);
          result = await queryAssets(supabase, user.id, query);
        } else {
          // Create new asset
          const asset = assetCreateSchema.parse(body);
          result = await createAsset(supabase, user.id, asset);
        }
        break;
      }
      
      case 'GET': {
        // READ single asset or list
        if (assetId && assetId !== 'assets-crud') {
          result = await getAsset(supabase, user.id, assetId);
        } else {
          const query = assetQuerySchema.parse(Object.fromEntries(url.searchParams));
          result = await queryAssets(supabase, user.id, query);
        }
        break;
      }
      
      case 'PUT':
      case 'PATCH': {
        // UPDATE
        const body = await req.json();
        const asset = assetUpdateSchema.parse({ ...body, id: assetId });
        result = await updateAsset(supabase, user.id, asset);
        break;
      }
      
      case 'DELETE': {
        // SOFT DELETE
        result = await deleteAsset(supabase, user.id, assetId);
        break;
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(result), {
      status: result.error ? 400 : 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...createTimingHeaders(startTime, 'assets-crud'),
      },
    });

  } catch (error) {
    console.error('Assets CRUD error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof z.ZodError 
        ? error.errors 
        : error.message || 'Internal error' 
    }), {
      status: error instanceof z.ZodError ? 400 : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...createTimingHeaders(startTime, 'assets-crud'),
      },
    });
  }
});

// CRUD Operations
async function createAsset(supabase: any, userId: string, asset: any) {
  const centroid = calculateCentroid(asset.geometry);
  
  const { data, error } = await supabase
    .from('managed_assets')
    .insert({
      user_id: userId,
      created_by: userId,
      ...asset,
      centroid_lat: centroid.lat,
      centroid_lng: centroid.lng,
      area_sq_meters: calculateArea(asset.geometry),
      sync_source: 'leafengines',
    })
    .select()
    .single();

  if (error) throw error;
  
  // Log to history
  await supabase.from('asset_history').insert({
    asset_id: data.id,
    operation: 'CREATE',
    new_values: data,
    changed_by: userId,
    change_source: 'api',
  });

  return { data, created: true };
}

async function getAsset(supabase: any, userId: string, assetId: string) {
  const { data, error } = await supabase
    .from('managed_assets')
    .select('*')
    .eq('id', assetId)
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .single();

  if (error) throw error;
  return { data };
}

async function queryAssets(supabase: any, userId: string, query: any) {
  let q = supabase
    .from('managed_assets')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (!query.include_deleted) {
    q = q.eq('is_deleted', false);
  }

  if (query.asset_type) {
    q = q.eq('asset_type', query.asset_type);
  }

  if (query.tags?.length) {
    q = q.overlaps('tags', query.tags);
  }

  if (query.bbox) {
    const [minLng, minLat, maxLng, maxLat] = query.bbox;
    q = q
      .gte('centroid_lat', minLat)
      .lte('centroid_lat', maxLat)
      .gte('centroid_lng', minLng)
      .lte('centroid_lng', maxLng);
  }

  q = q.range(query.offset, query.offset + query.limit - 1);

  const { data, count, error } = await q;
  if (error) throw error;

  return { 
    data, 
    pagination: { 
      total: count, 
      limit: query.limit, 
      offset: query.offset 
    } 
  };
}

async function updateAsset(supabase: any, userId: string, asset: any) {
  const { id, ...updates } = asset;

  // Get current state for history
  const { data: current } = await supabase
    .from('managed_assets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!current) throw new Error('Asset not found');

  // Recalculate spatial fields if geometry changed
  if (updates.geometry) {
    const centroid = calculateCentroid(updates.geometry);
    updates.centroid_lat = centroid.lat;
    updates.centroid_lng = centroid.lng;
    updates.area_sq_meters = calculateArea(updates.geometry);
  }

  const { data, error } = await supabase
    .from('managed_assets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Log to history
  const changedFields = Object.keys(updates);
  await supabase.from('asset_history').insert({
    asset_id: id,
    operation: 'UPDATE',
    changed_fields: changedFields,
    previous_values: current,
    new_values: data,
    changed_by: userId,
    change_source: 'api',
  });

  return { data, updated: true };
}

async function deleteAsset(supabase: any, userId: string, assetId: string) {
  const { data, error } = await supabase
    .from('managed_assets')
    .update({ 
      is_deleted: true, 
      deleted_at: new Date().toISOString() 
    })
    .eq('id', assetId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Log to history
  await supabase.from('asset_history').insert({
    asset_id: assetId,
    operation: 'DELETE',
    changed_by: userId,
    change_source: 'api',
  });

  return { data, deleted: true };
}

// Geometry helpers
function calculateCentroid(geometry: any): { lat: number; lng: number } {
  if (geometry.type === 'Point') {
    return { lng: geometry.coordinates[0], lat: geometry.coordinates[1] };
  }
  
  // For polygons/lines, calculate average of all coordinates
  const coords = flattenCoordinates(geometry.coordinates);
  const sum = coords.reduce(
    (acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 }
  );
  
  return {
    lat: sum.lat / coords.length,
    lng: sum.lng / coords.length,
  };
}

function flattenCoordinates(coords: any): number[][] {
  if (typeof coords[0] === 'number') return [coords];
  return coords.flatMap(flattenCoordinates);
}

function calculateArea(geometry: any): number | null {
  if (!['Polygon', 'MultiPolygon'].includes(geometry.type)) return null;
  // Simplified area calculation (would use turf.js in production)
  return 0; // Placeholder
}
```

#### Day 4-5: Update OpenAPI Spec

Add to `openapi-spec.yaml`:

```yaml
paths:
  /assets:
    post:
      summary: Create asset or query assets
      tags: [Assets]
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              oneOf:
                - $ref: '#/components/schemas/AssetCreate'
                - $ref: '#/components/schemas/AssetQuery'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AssetResponse'
    get:
      summary: List assets
      tags: [Assets]
      security:
        - bearerAuth: []
      parameters:
        - name: asset_type
          in: query
          schema:
            type: string
            enum: [tree, field, infrastructure, water_body, sensor]
        - name: bbox
          in: query
          schema:
            type: array
            items:
              type: number
        - name: limit
          in: query
          schema:
            type: integer
            default: 100
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Asset list
          
  /assets/{id}:
    get:
      summary: Get single asset
      tags: [Assets]
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Asset details
          
    put:
      summary: Update asset
      tags: [Assets]
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssetUpdate'
      responses:
        '200':
          description: Updated asset
          
    delete:
      summary: Delete asset (soft delete)
      tags: [Assets]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Asset deleted

components:
  schemas:
    AssetCreate:
      type: object
      required: [asset_type, name, geometry]
      properties:
        asset_type:
          type: string
          enum: [tree, field, infrastructure, water_body, sensor]
        name:
          type: string
        description:
          type: string
        geometry:
          $ref: '#/components/schemas/GeoJSONGeometry'
        properties:
          type: object
        tags:
          type: array
          items:
            type: string
        external_id:
          type: string
          
    GeoJSONGeometry:
      type: object
      required: [type, coordinates]
      properties:
        type:
          type: string
          enum: [Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon]
        coordinates:
          type: array
```

---

## Phase 2: GeoJSON & WFS Export (Week 3)

### Week 3: Standards-Compliant Output

#### Day 1-2: GeoJSON Feature Collection Endpoint

**File:** `supabase/functions/assets-geojson/index.ts`

```typescript
// Returns RFC 7946 compliant GeoJSON FeatureCollection
serve(async (req) => {
  // ... auth and query logic ...
  
  const features = assets.map(asset => ({
    type: 'Feature',
    id: asset.id,
    geometry: asset.geometry,
    properties: {
      id: asset.id,
      asset_type: asset.asset_type,
      name: asset.name,
      description: asset.description,
      ...asset.properties,
      tags: asset.tags,
      created_at: asset.created_at,
      updated_at: asset.updated_at,
    },
  }));

  return new Response(JSON.stringify({
    type: 'FeatureCollection',
    features,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
    },
    metadata: {
      total: features.length,
      generated_at: new Date().toISOString(),
      source: 'LeafEngines API v1',
    }
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/geo+json',
    },
  });
});
```

#### Day 3-4: WFS-Compatible Endpoint

**File:** `supabase/functions/assets-wfs/index.ts`

```typescript
// WFS 2.0 compatible endpoint for GIS platform integration
// Supports: GetCapabilities, DescribeFeatureType, GetFeature

serve(async (req) => {
  const url = new URL(req.url);
  const service = url.searchParams.get('service');
  const request = url.searchParams.get('request');
  
  if (service !== 'WFS') {
    return errorResponse('Service must be WFS');
  }
  
  switch (request) {
    case 'GetCapabilities':
      return getCapabilities();
    case 'DescribeFeatureType':
      return describeFeatureType(url.searchParams.get('typeName'));
    case 'GetFeature':
      return getFeature(supabase, userId, {
        typeName: url.searchParams.get('typeName'),
        bbox: url.searchParams.get('bbox'),
        count: url.searchParams.get('count'),
        outputFormat: url.searchParams.get('outputFormat') || 'application/json',
      });
    default:
      return errorResponse('Unsupported request type');
  }
});
```

#### Day 5: Esri JSON Export

```typescript
// Esri Feature Service compatible output
function toEsriFeatureSet(assets: Asset[]): EsriFeatureSet {
  return {
    objectIdFieldName: 'OBJECTID',
    globalIdFieldName: 'id',
    geometryType: 'esriGeometryPolygon', // or Point, Polyline
    spatialReference: { wkid: 4326 },
    fields: [
      { name: 'OBJECTID', type: 'esriFieldTypeOID' },
      { name: 'id', type: 'esriFieldTypeGUID' },
      { name: 'name', type: 'esriFieldTypeString' },
      { name: 'asset_type', type: 'esriFieldTypeString' },
      // ... other fields
    ],
    features: assets.map((asset, i) => ({
      attributes: {
        OBJECTID: i + 1,
        id: asset.id,
        name: asset.name,
        asset_type: asset.asset_type,
        ...asset.properties,
      },
      geometry: geoJsonToEsri(asset.geometry),
    })),
  };
}
```

---

## Phase 3: Bi-Directional Sync (Weeks 4-5)

### Week 4: Sync Infrastructure

#### Day 1-2: Sync Queue Table

```sql
CREATE TABLE public.asset_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES managed_assets(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Sync details
  direction TEXT NOT NULL CHECK (direction IN ('push', 'pull')),
  target_system TEXT NOT NULL, -- 'treeplotter', 'esri', 'custom'
  target_endpoint TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'conflict')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Conflict resolution
  conflict_data JSONB,
  resolution_strategy TEXT, -- 'local_wins', 'remote_wins', 'manual', 'merge'
  resolved_by UUID REFERENCES auth.users(id),
  
  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,
  
  error_message TEXT
);

CREATE INDEX idx_sync_queue_pending ON asset_sync_queue(status, next_retry_at) 
  WHERE status IN ('pending', 'failed');
```

#### Day 3-4: Sync Processor Edge Function

**File:** `supabase/functions/asset-sync-processor/index.ts`

```typescript
// Processes sync queue for bi-directional data flow
// Supports TreePlotter, Esri ArcGIS, custom webhooks

interface SyncAdapter {
  name: string;
  push(asset: Asset): Promise<SyncResult>;
  pull(externalId: string): Promise<Asset>;
  detectConflicts(local: Asset, remote: Asset): ConflictReport;
}

const adapters: Record<string, SyncAdapter> = {
  treeplotter: new TreePlotterAdapter(),
  esri: new EsriAdapter(),
  webhook: new WebhookAdapter(),
};

async function processSyncQueue() {
  const { data: queue } = await supabase
    .from('asset_sync_queue')
    .select('*')
    .eq('status', 'pending')
    .lt('next_retry_at', new Date().toISOString())
    .limit(50);

  for (const item of queue) {
    const adapter = adapters[item.target_system];
    
    try {
      if (item.direction === 'push') {
        await adapter.push(item.asset);
      } else {
        const remote = await adapter.pull(item.external_id);
        await reconcileAsset(item.asset_id, remote, item.resolution_strategy);
      }
      
      await markCompleted(item.id);
    } catch (error) {
      await markFailed(item.id, error);
    }
  }
}
```

#### Day 5: TreePlotter Integration Pattern

```typescript
// TreePlotter-specific adapter
class TreePlotterAdapter implements SyncAdapter {
  private baseUrl: string;
  private apiKey: string;

  async push(asset: Asset): Promise<SyncResult> {
    // Convert LeafEngines asset to TreePlotter format
    const treeplotterData = {
      CommonName: asset.name,
      ScientificName: asset.properties.scientific_name,
      Latitude: asset.centroid_lat,
      Longitude: asset.centroid_lng,
      DBH: asset.properties.dbh_inches,
      Height: asset.properties.height_feet,
      Condition: asset.properties.condition_rating,
      RiskRating: asset.properties.risk_rating,
      // ISA TRAQ fields
      LikelihoodOfFailure: asset.properties.traq_lof,
      ConsequenceOfFailure: asset.properties.traq_cof,
      RiskCategory: asset.properties.traq_risk_category,
    };

    const response = await fetch(`${this.baseUrl}/api/trees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(treeplotterData),
    });

    return { 
      success: response.ok,
      externalId: (await response.json()).TreeId,
    };
  }

  async pull(externalId: string): Promise<Asset> {
    const response = await fetch(
      `${this.baseUrl}/api/trees/${externalId}`,
      { headers: { 'Authorization': `Bearer ${this.apiKey}` } }
    );
    
    const tree = await response.json();
    
    return {
      asset_type: 'tree',
      name: tree.CommonName,
      geometry: {
        type: 'Point',
        coordinates: [tree.Longitude, tree.Latitude],
      },
      properties: {
        scientific_name: tree.ScientificName,
        dbh_inches: tree.DBH,
        height_feet: tree.Height,
        condition_rating: tree.Condition,
        risk_rating: tree.RiskRating,
        traq_lof: tree.LikelihoodOfFailure,
        traq_cof: tree.ConsequenceOfFailure,
        traq_risk_category: tree.RiskCategory,
      },
      external_id: externalId,
      sync_source: 'treeplotter',
    };
  }
}
```

### Week 5: Webhook & Real-Time Sync

#### Day 1-2: Webhook Endpoint for External Systems

**File:** `supabase/functions/asset-webhook/index.ts`

```typescript
// Receives updates from external systems (TreePlotter, Esri, etc.)
serve(async (req) => {
  // Validate webhook signature
  const signature = req.headers.get('X-Webhook-Signature');
  if (!validateSignature(signature, await req.text())) {
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = await req.json();
  
  // Map external event to sync queue
  const syncItem = {
    direction: 'pull',
    target_system: payload.source,
    external_id: payload.entity_id,
    status: 'pending',
  };

  await supabase.from('asset_sync_queue').insert(syncItem);

  return new Response(JSON.stringify({ received: true }));
});
```

#### Day 3-5: Conflict Resolution UI Component

**File:** `src/components/AssetSyncConflictResolver.tsx`

```typescript
// UI for manual conflict resolution
export function AssetSyncConflictResolver({ conflict }: Props) {
  const [resolution, setResolution] = useState<'local' | 'remote' | 'merge'>('local');
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sync Conflict Detected</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-medium">Local Version</h4>
            <pre>{JSON.stringify(conflict.local, null, 2)}</pre>
          </div>
          <div className="border rounded p-4">
            <h4 className="font-medium">Remote Version ({conflict.source})</h4>
            <pre>{JSON.stringify(conflict.remote, null, 2)}</pre>
          </div>
        </div>
        
        <RadioGroup value={resolution} onValueChange={setResolution}>
          <RadioGroupItem value="local">Keep Local</RadioGroupItem>
          <RadioGroupItem value="remote">Accept Remote</RadioGroupItem>
          <RadioGroupItem value="merge">Merge (Manual)</RadioGroupItem>
        </RadioGroup>
        
        <Button onClick={() => resolveConflict(conflict.id, resolution)}>
          Resolve Conflict
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Phase 4: Spatial Queries & ISA Standards (Week 6)

### Week 6: Advanced GIS Features

#### Day 1-2: Spatial Query Endpoint

**File:** `supabase/functions/assets-spatial-query/index.ts`

```typescript
// Advanced spatial queries: within, intersects, buffer, nearest
const spatialQuerySchema = z.object({
  operation: z.enum(['within', 'intersects', 'buffer', 'nearest']),
  geometry: geometrySchema, // Query geometry
  distance: z.number().optional(), // For buffer/nearest (meters)
  limit: z.number().default(100),
});

// PostGIS-style spatial operations via database functions
async function spatialQuery(supabase, userId, query) {
  const { operation, geometry, distance, limit } = query;
  
  // Use PostGIS functions via RPC
  const { data, error } = await supabase.rpc('spatial_query_assets', {
    p_user_id: userId,
    p_operation: operation,
    p_query_geometry: geometry,
    p_distance_meters: distance,
    p_limit: limit,
  });
  
  return data;
}
```

#### Day 3-4: ISA Tree Risk Assessment Fields

Add to managed_assets properties schema:

```typescript
// ISA TRAQ (Tree Risk Assessment Qualification) fields
const traqPropertiesSchema = z.object({
  // Tree structure
  dbh_inches: z.number().optional(),
  height_feet: z.number().optional(),
  crown_spread_feet: z.number().optional(),
  
  // TRAQ assessment
  traq_lof: z.enum(['improbable', 'possible', 'probable', 'imminent']).optional(),
  traq_cof: z.enum(['negligible', 'minor', 'significant', 'severe']).optional(),
  traq_risk_category: z.enum(['low', 'moderate', 'high', 'extreme']).optional(),
  
  // QTRA (Quantified Tree Risk Assessment)
  qtra_risk_score: z.number().min(0).max(1).optional(),
  
  // CTLA (Council of Tree and Landscape Appraisers)
  ctla_value_usd: z.number().optional(),
  
  // i-Tree Eco benefits
  itree_carbon_storage_lbs: z.number().optional(),
  itree_carbon_seq_annual_lbs: z.number().optional(),
  itree_pollution_removal_lbs: z.number().optional(),
  itree_stormwater_gal: z.number().optional(),
  itree_energy_savings_kwh: z.number().optional(),
  
  // Assessment metadata
  assessed_by: z.string().optional(),
  assessment_date: z.string().optional(),
  next_assessment_date: z.string().optional(),
});
```

#### Day 5: Integration Testing & Documentation

- Test full CRUD cycle with TreePlotter mock
- Test WFS export with QGIS
- Test Esri JSON with ArcGIS Online
- Document integration patterns for each GIS platform

---

## Compliance Score Projection

| Week | Deliverable | Score Impact | Cumulative |
|------|-------------|--------------|------------|
| 1-2 | CRUD operations | +25% | 45% |
| 3 | GeoJSON/WFS export | +20% | 65% |
| 4 | Sync infrastructure | +10% | 75% |
| 5 | Bi-directional sync | +10% | 85% |
| 6 | Spatial queries + ISA | +5% | 90% |

**Final State: 20% → 90% GIS Interoperability**

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| CRUD operations | Full support | All 4 operations functional |
| GeoJSON export | RFC 7946 compliant | Validates against spec |
| WFS endpoint | OGC WFS 2.0 | Works with QGIS, ArcGIS |
| TreePlotter sync | Bi-directional | Push/pull verified |
| Esri integration | ArcGIS Online compatible | Feature service layer works |
| Spatial queries | Sub-500ms | P95 latency |
| Urban Forestry ready | Yes | ISA fields supported |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| TreePlotter API changes | Version-locked adapter, monitoring |
| Esri licensing costs | Use free ArcGIS Online tier for testing |
| Sync conflicts | Automatic conflict detection, manual resolution UI |
| Performance degradation | Spatial indexing, query optimization |
| Data integrity | Full audit trail, version control |

---

## Dependencies

- PostgreSQL with JSONB support ✅
- PostGIS extension (for advanced spatial) - Optional
- TreePlotter API access - Required for Urban Forestry
- Esri Developer account - Required for ArcGIS integration
