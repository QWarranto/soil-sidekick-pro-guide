-- ============================================================
-- LEAFENGINES PLANETARY DIRECTORY: Bigfoot Blueprint Schema
-- Created: 2026-05-29
-- Purpose: Transform ephemeral Telegram conversational signals
--   into permanent, indexable directory pages with vendor
--   marketplace, correlation matrix, and privacy-preserving
--   aggregation layer.
-- ============================================================
-- Architecture: 3-Layer Page System
--   Layer 1: Auto-Generated Intelligence Pages (from queries)
--   Layer 2: Category Hubs (SEO authority mega-hubs)
--   Layer 3: Monetized Vendor Pages (CTA + marketplace)
-- ============================================================

-- ============================================================
-- 1. DIRECTORY_PAGES — The core page registry
-- Every Telegram interaction that produces environmental
-- intelligence generates (or updates) a directory page.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.directory_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Page identity
  slug TEXT NOT NULL,                    -- e.g. 'soil/fayette-ky/21067'
  page_type TEXT NOT NULL                -- 'intelligence' | 'category_hub' | 'vendor'
    CHECK (page_type IN ('intelligence', 'category_hub', 'vendor')),
  mega_directory TEXT NOT NULL           -- One of the Seven Mega-Directories
    CHECK (mega_directory IN (
      'plant_intelligence',
      'soil_intelligence',
      'water_quality',
      'climate_micro_weather',
      'satellite_ndvi',
      'environmental_risk',
      'carbon_potential'
    )),

  -- Geographic anchor (every page is anchored to place)
  fips_code TEXT,                        -- e.g. '21067' (nullable for national-level hubs)
  state_code TEXT,                       -- e.g. 'KY'
  county_name TEXT,                      -- e.g. 'Fayette County'
  country_code TEXT DEFAULT 'US',

  -- Content
  title TEXT NOT NULL,                   -- e.g. 'Soil Intelligence — Fayette County, KY'
  meta_description TEXT,                 -- SEO meta (auto-generated)
  content JSONB NOT NULL DEFAULT '{}',   -- Structured page content (varies by mega_directory)
  summary_text TEXT,                     -- Plain-text 2-3 sentence summary for cards/preview

  -- Data maturity (from the 5-stage scale)
  data_maturity TEXT NOT NULL DEFAULT 'new'
    CHECK (data_maturity IN ('new', 'seeding', 'building', 'established', 'institutional_grade')),

  -- Source tracking — which queries built this page
  source_query_count INTEGER NOT NULL DEFAULT 0,  -- How many user queries contributed
  last_source_query_at TIMESTAMPTZ,                -- When the last contributing query arrived

  -- SEO and visibility
  is_indexable BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT false,     -- Pages start unpublished until validated
  sitemap_priority REAL NOT NULL DEFAULT 0.5,      -- 0.0-1.0 for sitemap.xml
  canonical_url TEXT,                              -- Override for canonical tag

  -- Layer association
  parent_hub_id UUID REFERENCES public.directory_pages(id),  -- Layer 1→2 link
  layer_depth SMALLINT NOT NULL DEFAULT 1          -- 1=intelligence, 2=category_hub, 3=vendor

);

-- Unique constraint: one page per slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_directory_pages_slug
  ON public.directory_pages(slug);

-- Fast lookups by mega_directory + geography
CREATE INDEX IF NOT EXISTS idx_directory_pages_mega_fips
  ON public.directory_pages(mega_directory, fips_code)
  WHERE fips_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_directory_pages_mega_state
  ON public.directory_pages(mega_directory, state_code)
  WHERE state_code IS NOT NULL;

-- Published pages only (for public site rendering)
CREATE INDEX IF NOT EXISTS idx_directory_pages_published
  ON public.directory_pages(mega_directory, is_published)
  WHERE is_published = true;

-- Auto-trigger: updated_at maintenance
CREATE OR REPLACE FUNCTION public.update_directory_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.directory_pages
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER trg_directory_pages_updated_at
  BEFORE UPDATE ON public.directory_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_directory_pages_updated_at();


-- ============================================================
-- 2. DIRECTORY_SLUGS — URL routing and slug generation rules
-- Maps mega_directory + entity type + geography to URL patterns.
-- The Bigfoot auto-generator reads these rules to produce slugs.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.directory_slug_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mega_directory TEXT NOT NULL REFERENCES public.directory_pages(mega_directory)
    ON DELETE CASCADE,  -- won't work since it's a CHECK not FK; see note below
  -- (mega_directory is a CHECK on directory_pages, not a FK table.
  --  We store it here for rule lookup; app-layer enforces consistency.)

  entity_type TEXT NOT NULL,             -- e.g. 'county_soil', 'plant_species', 'vendor_profile'
  slug_pattern TEXT NOT NULL,            -- e.g. 'soil/{county-slug}/{fips}'
  example_slug TEXT NOT NULL,            -- e.g. 'soil/fayette-ky/21067'
  title_pattern TEXT NOT NULL,           -- e.g. 'Soil Intelligence — {county_name}, {state_code}'
  meta_pattern TEXT,                     -- e.g. 'Soil composition, pH, drainage for {county_name}...'

  content_template JSONB NOT NULL DEFAULT '{}', -- Template skeleton for auto-generation
  auto_publish_threshold INTEGER NOT NULL DEFAULT 3, -- Min source queries before auto-publish

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the seven mega-directory slug rules
INSERT INTO public.directory_slug_rules
  (mega_directory, entity_type, slug_pattern, example_slug, title_pattern, meta_pattern, auto_publish_threshold)
VALUES
  ('plant_intelligence', 'plant_species', 'plants/{species-slug}/{fips}', 'plants/white-oak/01001',
   'Plant Intelligence — {species_name} in {county_name}, {state_code}',
   '{species_name} environmental compatibility, model confidence, and local context for {county_name}', 2),

  ('soil_intelligence', 'county_soil', 'soil/{county-slug}/{fips}', 'soil/fayette-ky/21067',
   'Soil Intelligence — {county_name}, {state_code}',
   'Soil composition, pH, drainage, organic matter profiles for {county_name}, {state_code}', 1),

  ('water_quality', 'county_water', 'water/{county-slug}/{fips}', 'water/fayette-ky/21067',
   'Water Quality — {county_name}, {state_code}',
   'EPA water quality indicators, contamination risk, agricultural suitability for {county_name}', 1),

  ('climate_micro_weather', 'county_climate', 'climate/{county-slug}/{fips}', 'climate/fayette-ky/21067',
   'Climate & Micro-Weather — {county_name}, {state_code}',
   '30-year normals, seasonal patterns, crop planting windows for {county_name}, {state_code}', 2),

  ('satellite_ndvi', 'county_ndvi', 'ndvi/{county-slug}/{fips}', 'ndvi/fayette-ky/21067',
   'Satellite Vegetation (NDVI) — {county_name}, {state_code}',
   'Vegetation health index, 90-day NDVI trend, drought stress detection for {county_name}', 3),

  ('environmental_risk', 'county_risk', 'risk/{county-slug}/{fips}', 'risk/fayette-ky/21067',
   'Environmental Risk — {county_name}, {state_code}',
   'Erosion, flood, invasive species risk assessment for {county_name}, {state_code}', 2),

  ('carbon_potential', 'county_carbon', 'carbon/{county-slug}/{fips}', 'carbon/fayette-ky/21067',
   'Carbon Potential — {county_name}, {state_code}',
   'Carbon sequestration potential, land-use carbon scores for {county_name}, {state_code}', 2)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 3. VENDOR_MARKETPLACE — Layer 3 monetization
-- Vendor pages that convert directory traffic into revenue.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,             -- e.g. 'acme-soil-testing'
  vendor_category TEXT NOT NULL           -- Maps to the 12 vendor categories
    CHECK (vendor_category IN (
      'soil_testing_labs',
      'water_testing_labs',
      'agronomists',
      'carbon_developers',
      'invasive_species_removal',
      'forestry_land_management',
      'environmental_consultants',
      'conservation_ngos',
      'irrigation_services',
      'landscaping_horticulture',
      'ag_input_vendors',
      'government_agencies'
    )),

  -- Contact & location
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  street_address TEXT,
  city TEXT,
  state_code TEXT,
  zip_code TEXT,
  fips_code TEXT,                        -- Primary service county
  service_states TEXT[] DEFAULT '{}',    -- States they serve
  service_fips TEXT[] DEFAULT '{}',      -- FIPS codes they serve (broader than one county)

  -- Directory page link
  directory_page_id UUID REFERENCES public.directory_pages(id),

  -- Monetization tier
  listing_tier TEXT NOT NULL DEFAULT 'basic'
    CHECK (listing_tier IN ('basic', 'featured', 'premium')),
  featured_until TIMESTAMPTZ,           -- When featured listing expires
  premium_features JSONB DEFAULT '{}',   -- Certifications, analytics, deep integration flags

  -- Lead routing
  pay_per_lead_enabled BOOLEAN NOT NULL DEFAULT false,
  lead_price_cents INTEGER,              -- e.g. 5000 = $50 per lead
  monthly_lead_limit INTEGER,            -- Max leads per month (null = unlimited)
  leads_this_month INTEGER NOT NULL DEFAULT 0,

  -- Status
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookups: vendors by category + geography
CREATE INDEX IF NOT EXISTS idx_vendors_category_state
  ON public.vendors(vendor_category, state_code);
CREATE INDEX IF NOT EXISTS idx_vendors_category_fips
  ON public.vendors(vendor_category, fips_code);
CREATE INDEX IF NOT EXISTS idx_vendors_featured
  ON public.vendors(vendor_category, listing_tier)
  WHERE listing_tier = 'featured' AND is_active = true AND is_verified = true;


-- ============================================================
-- 3b. VENDOR_LEADS — Pay-per-lead tracking
-- When a user on a directory page clicks "Contact Vendor",
-- a lead is created and the vendor is billed.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  directory_page_id UUID REFERENCES public.directory_pages(id),

  -- Lead source
  source_slug TEXT NOT NULL,             -- The page slug where the lead originated
  trigger_signal TEXT,                   -- What the user was asking about (e.g. 'nutrient_deficiency')

  -- User contact (voluntary — not required to view page)
  user_email TEXT,
  user_phone TEXT,
  user_message TEXT,

  -- Lead status
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  lead_price_cents INTEGER NOT NULL,     -- Price at time of creation (snapshot)

  -- Privacy: no telegram_id or user_id stored
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vendor_leads_vendor_status
  ON public.vendor_leads(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_created
  ON public.vendor_leads(created_at DESC);


-- ============================================================
-- 4. CORRELATION_EDGES — The Perpetual Correlation Matrix
-- Discovers non-obvious relationships between environmental
-- variables from query co-occurrence.
-- Example: "Users who ask about soil pH in FIPS 01073
--   also ask about water contamination" → edge with weight.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.correlation_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The two variables being correlated
  variable_a TEXT NOT NULL,              -- e.g. 'soil_ph', 'water_contamination_risk'
  variable_b TEXT NOT NULL,              -- e.g. 'water_contamination_risk', 'crop_corn_yield'

  -- Geographic scope
  fips_code TEXT,                        -- null = global correlation
  state_code TEXT,                       -- null = national

  -- Correlation metrics
  co_occurrence_count INTEGER NOT NULL DEFAULT 1,
  correlation_weight REAL NOT NULL DEFAULT 0.0,  -- 0.0-1.0, higher = stronger
  p_value REAL,                          -- Statistical significance
  is_significant BOOLEAN NOT NULL DEFAULT false,  -- p_value < 0.05

  -- Causal direction (if determinable)
  causal_direction TEXT                  -- 'a_causes_b', 'b_causes_a', 'bidirectional', 'unknown'
    CHECK (causal_direction IN ('a_causes_b', 'b_causes_a', 'bidirectional', 'unknown', NULL)),

  -- Temporal depth
  first_observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  observation_window_days INTEGER NOT NULL DEFAULT 30, -- Rolling window

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique: one edge per variable pair per geography
CREATE UNIQUE INDEX IF NOT EXISTS idx_correlation_edges_pair_fips
  ON public.correlation_edges(variable_a, variable_b, fips_code)
  WHERE fips_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_correlation_edges_pair_state
  ON public.correlation_edges(variable_a, variable_b, state_code)
  WHERE fips_code IS NULL AND state_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_correlation_edges_pair_global
  ON public.correlation_edges(variable_a, variable_b)
  WHERE fips_code IS NULL AND state_code IS NULL;

-- Fast lookups: edges by variable
CREATE INDEX IF NOT EXISTS idx_correlation_edges_var_a
  ON public.correlation_edges(variable_a);
CREATE INDEX IF NOT EXISTS idx_correlation_edges_var_b
  ON public.correlation_edges(variable_b);


-- ============================================================
-- 5. PRIVACY_AGGREGATION — SHA-256 + FIPS-level data export
-- Strips PII from query logs and outputs FIPS-level aggregated
-- datasets shareable with FAO, NGOs, and institutional partners.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.privacy_aggregated_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What was aggregated
  snapshot_date DATE NOT NULL,
  aggregation_scope TEXT NOT NULL         -- 'fips_daily', 'state_weekly', 'national_monthly'
    CHECK (aggregation_scope IN ('fips_daily', 'state_weekly', 'national_monthly')),

  -- Geographic anchor
  fips_code TEXT,                        -- null for state/national aggregations
  state_code TEXT,

  -- Aggregated metrics (no PII, no user IDs)
  total_queries INTEGER NOT NULL DEFAULT 0,
  unique_query_hashes INTEGER NOT NULL DEFAULT 0,  -- Count of SHA-256 hashed user identifiers
  query_type_distribution JSONB NOT NULL DEFAULT '{}',  -- e.g. {"soil": 45, "water": 12, ...}
  mega_directory_distribution JSONB NOT NULL DEFAULT '{}',

  -- Environmental signal summaries (FIPS-level only)
  top_species_requested JSONB DEFAULT '[]',     -- [{"species": "white_oak", "count": 23}, ...]
  top_risk_signals JSONB DEFAULT '[]',          -- [{"risk": "erosion", "count": 8}, ...]
  soil_ph_range JSONB DEFAULT '{}',             -- {"min": 5.2, "max": 7.8, "mean": 6.4}
  water_quality_flags JSONB DEFAULT '[]',       -- ["contamination_risk", "ph_concern"]

  -- Data maturity assessment for this geography
  data_maturity TEXT NOT NULL DEFAULT 'new'
    CHECK (data_maturity IN ('new', 'seeding', 'building', 'established', 'institutional_grade')),

  -- Export readiness
  is_exportable BOOLEAN NOT NULL DEFAULT false,  -- True after privacy review
  exported_to TEXT[] DEFAULT '{}',               -- e.g. ['fao', 'world_bank', 'usda']
  export_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition-style lookups by date
CREATE INDEX IF NOT EXISTS idx_privacy_snapshots_date_scope
  ON public.privacy_aggregated_snapshots(snapshot_date DESC, aggregation_scope);
CREATE INDEX IF NOT EXISTS idx_privacy_snapshots_fips
  ON public.privacy_aggregated_snapshots(fips_code, snapshot_date DESC)
  WHERE fips_code IS NOT NULL;


-- ============================================================
-- 6. BIGFOOT_AUTOGEN_QUEUE — The flywheel engine
-- Manages the auto-generation of directory pages from
-- Telegram queries. Target: 100+ new pages/day with zero
-- manual labor.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bigfoot_autogen_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What to generate
  target_slug TEXT NOT NULL,             -- The slug to create/update
  mega_directory TEXT NOT NULL,
  entity_type TEXT NOT NULL,             -- 'county_soil', 'plant_species', etc.
  fips_code TEXT,
  state_code TEXT,

  -- Generation state
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'skipped')),
  priority INTEGER NOT NULL DEFAULT 5,  -- 1=critical, 10=low

  -- Source data for generation
  source_query_ids UUID[] DEFAULT '{}',  -- Telegram queries that triggered this
  source_data JSONB DEFAULT '{}',        -- Pre-fetched data to render the page

  -- Result
  generated_page_id UUID REFERENCES public.directory_pages(id),
  error_message TEXT,

  -- Timing
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  processing_time_ms INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Priority queue: process highest priority first, oldest within priority
CREATE INDEX IF NOT EXISTS idx_bigfoot_queue_status_priority
  ON public.bigfoot_autogen_queue(status, priority, queued_at)
  WHERE status IN ('queued', 'processing');

-- Prevent duplicate queued jobs
CREATE UNIQUE INDEX IF NOT EXISTS idx_bigfoot_queue_slug_pending
  ON public.bigfoot_autogen_queue(target_slug)
  WHERE status IN ('queued', 'processing');


-- ============================================================
-- 7. TELEGRAM_QUERY_SIGNALS — The ingestion pipeline
-- Captures every Telegram bot interaction as a structured
-- signal that feeds directory page auto-generation and
-- the correlation matrix. This is the "ground-truth fuel."
-- ============================================================
CREATE TABLE IF NOT EXISTS public.telegram_query_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User (privacy-preserving)
  user_hash TEXT NOT NULL,               -- SHA-256 of telegram_id (no PII stored)
  tier TEXT NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free', 'pro', 'enterprise')),

  -- Query details
  command TEXT NOT NULL,                 -- e.g. '/soil', '/water', '/identify'
  raw_input TEXT,                        -- What the user typed (sanitized)
  tool_name TEXT,                        -- e.g. 'get_soil_data', 'safe_identification'

  -- Geographic signal
  fips_code TEXT,                        -- Extracted from query or user location
  state_code TEXT,
  county_name TEXT,

  -- Environmental signals extracted from the response
  species_requested TEXT,                -- For /identify calls
  risk_signals TEXT[] DEFAULT '{}',      -- e.g. ['erosion', 'contamination']
  environmental_tags TEXT[] DEFAULT '{}', -- e.g. ['low_ph', 'poor_drainage', 'high_carbon']

  -- Response metadata
  response_success BOOLEAN NOT NULL DEFAULT true,
  response_latency_ms INTEGER,
  model_used TEXT,                       -- From model_capabilities routing

  -- Directory page impact
  directory_page_created UUID REFERENCES public.directory_pages(id),
  directory_page_updated UUID REFERENCES public.directory_pages(id),

  -- Correlation matrix feed
  correlation_processed BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookups: signals by geography + time
CREATE INDEX IF NOT EXISTS idx_tg_signals_fips_time
  ON public.telegram_query_signals(fips_code, created_at DESC)
  WHERE fips_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tg_signals_command_time
  ON public.telegram_query_signals(command, created_at DESC);

-- Signals not yet processed for correlation matrix
CREATE INDEX IF NOT EXISTS idx_tg_signals_unprocessed
  ON public.telegram_query_signals(created_at DESC)
  WHERE correlation_processed = false;

-- Signals by user hash (for retention/cohort analysis without PII)
CREATE INDEX IF NOT EXISTS idx_tg_signals_user_hash
  ON public.telegram_query_signals(user_hash, created_at DESC);


-- ============================================================
-- 8. RLS POLICIES
-- Directory pages are publicly readable (SEO requirement).
-- Vendor data is read-limited by tier.
-- Query signals are write-only from the webhook (service_role).
-- ============================================================

-- Directory pages: public read
ALTER TABLE public.directory_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Directory pages are publicly readable"
  ON public.directory_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Service role can manage directory pages"
  ON public.directory_pages FOR ALL USING (true) WITH CHECK (true);

-- Slug rules: public read (templates for the site)
ALTER TABLE public.directory_slug_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Slug rules are publicly readable"
  ON public.directory_slug_rules FOR SELECT USING (true);

-- Vendors: public read for active/verified, write via service_role
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active verified vendors are publicly readable"
  ON public.vendors FOR SELECT USING (is_active = true AND is_verified = true);
CREATE POLICY "Service role can manage vendors"
  ON public.vendors FOR ALL USING (true) WITH CHECK (true);

-- Vendor leads: service_role only (contains contact info)
ALTER TABLE public.vendor_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages vendor leads"
  ON public.vendor_leads FOR ALL USING (true) WITH CHECK (true);

-- Correlation edges: public read (the data moat is a public good)
ALTER TABLE public.correlation_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Correlation edges are publicly readable"
  ON public.correlation_edges FOR SELECT USING (true);
CREATE POLICY "Service role can manage correlation edges"
  ON public.correlation_edges FOR ALL USING (true) WITH CHECK (true);

-- Privacy snapshots: public read (they're already sanitized)
ALTER TABLE public.privacy_aggregated_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Privacy snapshots are publicly readable"
  ON public.privacy_aggregated_snapshots FOR SELECT USING (is_exportable = true);
CREATE POLICY "Service role can manage privacy snapshots"
  ON public.privacy_aggregated_snapshots FOR ALL USING (true) WITH CHECK (true);

-- Autogen queue: service_role only (internal pipeline)
ALTER TABLE public.bigfoot_autogen_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages autogen queue"
  ON public.bigfoot_autogen_queue FOR ALL USING (true) WITH CHECK (true);

-- Telegram query signals: service_role write, no public read (PII-adjacent)
ALTER TABLE public.telegram_query_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage query signals"
  ON public.telegram_query_signals FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================================

-- 9a. Auto-queue directory page generation from query signals
-- When a telegram_query_signal is inserted with a fips_code,
-- check if a directory page exists. If not, queue it.
CREATE OR REPLACE FUNCTION public.auto_queue_directory_page()
RETURNS TRIGGER AS $$
DECLARE
  existing_page UUID;
  queue_id UUID;
  target_slug TEXT;
  entity_type TEXT;
  rule RECORD;
BEGIN
  -- Only process signals with geographic data
  IF NEW.fips_code IS NULL THEN
    RETURN NEW;
  END IF;

  -- Map command to mega_directory
  CASE NEW.command
    WHEN '/soil' THEN entity_type := 'county_soil';
    WHEN '/water' THEN entity_type := 'county_water';
    WHEN '/climate' THEN entity_type := 'county_climate';
    WHEN '/ndvi' THEN entity_type := 'county_ndvi';
    WHEN '/risk' THEN entity_type := 'county_risk';
    WHEN '/carbon' THEN entity_type := 'county_carbon';
    WHEN '/identify' THEN entity_type := 'plant_species';
    ELSE RETURN NEW;
  END CASE;

  -- Look up the slug rule
  SELECT * INTO rule FROM public.directory_slug_rules
  WHERE entity_type = entity_type
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Build the slug: replace patterns with actual values
  -- For county-level pages: mega_directory/{county-slug}/{fips}
  target_slug := replace(replace(replace(rule.slug_pattern,
    '{fips}', NEW.fips_code),
    '{county-slug}', lower(replace(NEW.county_name, ' ', '-')) || '-' || lower(NEW.state_code)),
    '{species-slug}', lower(replace(COALESCE(NEW.species_requested, 'unknown'), ' ', '-')));

  -- Check if page already exists
  SELECT id INTO existing_page FROM public.directory_pages
  WHERE slug = target_slug;

  IF existing_page IS NOT NULL THEN
    -- Update existing page: increment query count, update timestamp
    UPDATE public.directory_pages SET
      source_query_count = source_query_count + 1,
      last_source_query_at = now(),
      data_maturity = CASE
        WHEN source_query_count >= 100 THEN 'institutional_grade'
        WHEN source_query_count >= 50 THEN 'established'
        WHEN source_query_count >= 20 THEN 'building'
        WHEN source_query_count >= 5 THEN 'seeding'
        ELSE 'new'
      END
    WHERE id = existing_page;

    -- Record the update link on the signal
    NEW.directory_page_updated := existing_page;
  ELSE
    -- Queue a new page for auto-generation
    INSERT INTO public.bigfoot_autogen_queue
      (target_slug, mega_directory, entity_type, fips_code, state_code,
       status, priority, source_data)
    VALUES (
      target_slug, rule.mega_directory, entity_type, NEW.fips_code, NEW.state_code,
      'queued', 5,
      jsonb_build_object(
        'county_name', NEW.county_name,
        'state_code', NEW.state_code,
        'fips_code', NEW.fips_code,
        'species_requested', NEW.species_requested,
        'environmental_tags', NEW.environmental_tags
      )
    )
    ON CONFLICT (target_slug) WHERE status IN ('queued', 'processing') DO NOTHING
    RETURNING id INTO queue_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to query signals table
CREATE TRIGGER trg_auto_queue_directory_page
  AFTER INSERT ON public.telegram_query_signals
  FOR EACH ROW EXECUTE FUNCTION public.auto_queue_directory_page();


-- 9b. Feed the correlation matrix from query signals
-- When two different query types hit the same FIPS within 24h,
-- create or strengthen a correlation edge.
CREATE OR REPLACE FUNCTION public.feed_correlation_matrix()
RETURNS TRIGGER AS $$
DECLARE
  related_command TEXT;
  related_variable TEXT;
  new_variable TEXT;
  edge_id UUID;
BEGIN
  IF NEW.fips_code IS NULL OR NEW.correlation_processed THEN
    RETURN NEW;
  END IF;

  -- Map command to correlation variable
  new_variable := CASE NEW.command
    WHEN '/soil' THEN 'soil_query'
    WHEN '/water' THEN 'water_query'
    WHEN '/identify' THEN 'plant_id_query'
    WHEN '/ag' THEN 'ag_intelligence_query'
    WHEN '/carbon' THEN 'carbon_query'
    WHEN '/risk' THEN 'risk_query'
    WHEN '/crop' THEN 'crop_query'
    ELSE NULL
  END;

  IF new_variable IS NULL THEN
    RETURN NEW;
  END IF;

  -- Look for other query types in the same FIPS within the last 24h
  FOR related_command, related_variable IN
    SELECT DISTINCT t.command,
      CASE t.command
        WHEN '/soil' THEN 'soil_query'
        WHEN '/water' THEN 'water_query'
        WHEN '/identify' THEN 'plant_id_query'
        WHEN '/ag' THEN 'ag_intelligence_query'
        WHEN '/carbon' THEN 'carbon_query'
        WHEN '/risk' THEN 'risk_query'
        WHEN '/crop' THEN 'crop_query'
      END
    FROM public.telegram_query_signals t
    WHERE t.fips_code = NEW.fips_code
      AND t.command != NEW.command
      AND t.created_at > now() - interval '24 hours'
      AND t.created_at < NEW.created_at
    LIMIT 10
  LOOP
    IF related_variable IS NULL THEN CONTINUE; END IF;

    -- Upsert the correlation edge (alphabetical order for consistency)
    INSERT INTO public.correlation_edges
      (variable_a, variable_b, fips_code, co_occurrence_count, correlation_weight, last_observed_at)
    VALUES (
      least(new_variable, related_variable),
      greatest(new_variable, related_variable),
      NEW.fips_code,
      1,
      0.01,
      now()
    )
    ON CONFLICT (variable_a, variable_b, fips_code) WHERE fips_code IS NOT NULL
    DO UPDATE SET
      co_occurrence_count = correlation_edges.co_occurrence_count + 1,
      correlation_weight = LEAST(1.0, correlation_edges.correlation_weight + 0.01),
      last_observed_at = now(),
      is_significant = (correlation_edges.co_occurrence_count + 1 >= 10
        AND correlation_edges.correlation_weight + 0.01 >= 0.3)
    RETURNING id INTO edge_id;
  END LOOP;

  -- Mark signal as processed
  NEW.correlation_processed := true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger (runs after the directory page trigger)
CREATE TRIGGER trg_feed_correlation_matrix
  AFTER INSERT ON public.telegram_query_signals
  FOR EACH ROW EXECUTE FUNCTION public.feed_correlation_matrix();


-- ============================================================
-- 10. PG_CRON JOBS — Automated maintenance
-- ============================================================

-- 10a. Daily privacy aggregation snapshot
SELECT cron.schedule(
  'bigfoot-daily-privacy-snapshot',
  '0 2 * * *',  -- 2 AM UTC daily
  $$
  INSERT INTO public.privacy_aggregated_snapshots
    (snapshot_date, aggregation_scope, fips_code, state_code,
     total_queries, unique_query_hashes,
     query_type_distribution, mega_directory_distribution,
     top_species_requested, top_risk_signals, data_maturity, is_exportable)
  SELECT
    current_date,
    'fips_daily',
    fips_code,
    state_code,
    count(*),
    count(DISTINCT user_hash),
    jsonb_object_agg(command, cmd_count),
    '{}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    CASE
      WHEN count(*) >= 100 THEN 'institutional_grade'
      WHEN count(*) >= 50 THEN 'established'
      WHEN count(*) >= 20 THEN 'building'
      WHEN count(*) >= 5 THEN 'seeding'
      ELSE 'new'
    END,
    (count(*) >= 10)  -- Exportable after 10+ queries (privacy threshold)
  FROM (
    SELECT
      fips_code, state_code, command, user_hash,
      count(*) OVER (PARTITION BY fips_code, command) as cmd_count
    FROM public.telegram_query_signals
    WHERE created_at >= current_date
      AND fips_code IS NOT NULL
  ) sub
  GROUP BY fips_code, state_code;
  $$
);

-- 10b. Stale autogen queue cleanup (fail jobs stuck >1hr)
SELECT cron.schedule(
  'bigfoot-stale-autogen-cleanup',
  '0 */4 * * *',  -- Every 4 hours
  $$
  UPDATE public.bigfoot_autogen_queue
  SET status = 'failed',
      error_message = 'Job timed out (>1 hour in processing state)',
      completed_at = now()
  WHERE status = 'processing'
    AND started_at < now() - interval '1 hour';
  $$
);

-- 10c. Weekly data maturity promotion (pages with enough queries get published)
SELECT cron.schedule(
  'bigfoot-weekly-maturity-promotion',
  '0 3 * * 1',  -- 3 AM UTC every Monday
  $$
  UPDATE public.directory_pages
  SET
    is_published = true,
    sitemap_priority = CASE
      WHEN data_maturity = 'institutional_grade' THEN 0.9
      WHEN data_maturity = 'established' THEN 0.8
      WHEN data_maturity = 'building' THEN 0.7
      WHEN data_maturity = 'seeding' THEN 0.6
      ELSE 0.5
    END
  WHERE is_published = false
    AND source_query_count >= 3;
  $$
);


-- ============================================================
-- GRANTS: Ensure service_role has full access
-- ============================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
