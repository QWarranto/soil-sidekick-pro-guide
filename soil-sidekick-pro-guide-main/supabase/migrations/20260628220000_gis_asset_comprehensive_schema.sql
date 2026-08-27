-- Migration: Add comprehensive GIS asset management fields
-- Safe ALTER TABLE approach — preserves all existing managed_assets data

-- 1. Add missing columns to managed_assets
ALTER TABLE public.managed_assets
  ADD COLUMN IF NOT EXISTS sync_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'local' CHECK (sync_status IN ('local', 'synced', 'pending', 'conflict', 'error')),
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- 2. Make latitude/longitude nullable (geometry can be provided instead)
ALTER TABLE public.managed_assets
  ALTER COLUMN latitude DROP NOT NULL,
  ALTER COLUMN longitude DROP NOT NULL;

-- 3. Add constraint: either geometry or lat+lng must be present
-- Only add if not already present (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'managed_assets_location_present'
    AND conrelid = 'public.managed_assets'::regclass
  ) THEN
    ALTER TABLE public.managed_assets
      ADD CONSTRAINT managed_assets_location_present
      CHECK (geometry IS NOT NULL OR (latitude IS NOT NULL AND longitude IS NOT NULL));
  END IF;
END $$;

-- 4. Add indexes for sync/soft-delete queries
CREATE INDEX IF NOT EXISTS idx_managed_assets_sync_status ON public.managed_assets(sync_status);
CREATE INDEX IF NOT EXISTS idx_managed_assets_is_deleted ON public.managed_assets(is_deleted);
CREATE INDEX IF NOT EXISTS idx_managed_assets_version ON public.managed_assets(version);
CREATE INDEX IF NOT EXISTS idx_managed_assets_geometry ON public.managed_assets USING GIN (geometry);

-- 5. Create asset_history audit table
CREATE TABLE IF NOT EXISTS public.asset_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.managed_assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('insert', 'update', 'delete')),
  changed_by UUID,
  previous_data JSONB,
  new_data JSONB,
  version INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Enable RLS on asset_history
ALTER TABLE public.asset_history ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies for asset_history (user-scoped)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Users can view their own asset history'
    AND polrelid = 'public.asset_history'::regclass
  ) THEN
    CREATE POLICY "Users can view their own asset history"
      ON public.asset_history FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polname = 'Users can create their own asset history'
    AND polrelid = 'public.asset_history'::regclass
  ) THEN
    CREATE POLICY "Users can create their own asset history"
      ON public.asset_history FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 8. Indexes for asset_history lookups
CREATE INDEX IF NOT EXISTS idx_asset_history_asset_id ON public.asset_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_history_user_id ON public.asset_history(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_history_created_at ON public.asset_history(created_at DESC);

-- 9. Version bump trigger
CREATE OR REPLACE FUNCTION public.bump_managed_asset_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  IF TG_OP = 'UPDATE' THEN
    NEW.version = COALESCE(OLD.version, 0) + 1;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_managed_assets_version'
    AND tgrelid = 'public.managed_assets'::regclass
  ) THEN
    CREATE TRIGGER trg_managed_assets_version
      BEFORE UPDATE ON public.managed_assets
      FOR EACH ROW EXECUTE FUNCTION public.bump_managed_asset_version();
  END IF;
END $$;

-- 10. History capture trigger
CREATE OR REPLACE FUNCTION public.log_managed_asset_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.asset_history(asset_id, user_id, change_type, changed_by, new_data, version)
    VALUES (NEW.id, NEW.user_id, 'insert', auth.uid(), to_jsonb(NEW), NEW.version);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.asset_history(asset_id, user_id, change_type, changed_by, previous_data, new_data, version)
    VALUES (NEW.id, NEW.user_id, 'update', auth.uid(), to_jsonb(OLD), to_jsonb(NEW), NEW.version);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.asset_history(asset_id, user_id, change_type, changed_by, previous_data, version)
    VALUES (OLD.id, OLD.user_id, 'delete', auth.uid(), to_jsonb(OLD), OLD.version);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_managed_assets_history'
    AND tgrelid = 'public.managed_assets'::regclass
  ) THEN
    CREATE TRIGGER trg_managed_assets_history
      AFTER INSERT OR UPDATE OR DELETE ON public.managed_assets
      FOR EACH ROW EXECUTE FUNCTION public.log_managed_asset_change();
  END IF;
END $$;

-- 11. Security: revoke function execution from public
REVOKE EXECUTE ON FUNCTION public.bump_managed_asset_version() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_managed_asset_change() FROM PUBLIC, anon;
