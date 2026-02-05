-- Add unique constraint for upsert functionality on fips_data_cache
-- This enables efficient cache updates without duplicates

CREATE UNIQUE INDEX IF NOT EXISTS fips_data_cache_key_source_unique 
ON public.fips_data_cache (cache_key, data_source);

-- Add RLS policy to allow service role to insert/update cache data
-- (service role already bypasses RLS, but ensuring table has proper policies)

-- Add index for faster cache lookups by expiration
CREATE INDEX IF NOT EXISTS fips_data_cache_expires_at_idx 
ON public.fips_data_cache (expires_at DESC);

-- Add index for faster lookups by cache_key
CREATE INDEX IF NOT EXISTS fips_data_cache_key_idx 
ON public.fips_data_cache (cache_key);