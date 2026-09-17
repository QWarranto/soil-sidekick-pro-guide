-- Enable pg_trgm extension for fuzzy text search optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram GIN indexes on counties table for fast ILIKE searches
-- These replace sequential scans with index scans, targeting <1000ms P95 latency
CREATE INDEX IF NOT EXISTS idx_counties_name_trgm 
  ON public.counties USING gin (county_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_counties_state_name_trgm 
  ON public.counties USING gin (state_name gin_trgm_ops);

-- Also add a btree index on state_code for exact match filters
CREATE INDEX IF NOT EXISTS idx_counties_state_code 
  ON public.counties USING btree (state_code);