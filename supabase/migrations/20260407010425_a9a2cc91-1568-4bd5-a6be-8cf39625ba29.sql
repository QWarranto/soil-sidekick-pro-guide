-- Update api_tier_limits to match new pricing structure
-- Starter: $149/mo (5k commoditized + 3k enhanced + 1.5k proprietary + 500 exclusive = 10k total)
UPDATE api_tier_limits SET
  requests_per_minute = 60,
  requests_per_hour = 1000,
  requests_per_day = 10000,
  max_concurrent_requests = 5,
  features = '["soil_analysis","county_lookup","water_quality","planting_calendar","safe_identification","dynamic_care","beginner_guidance"]'::jsonb,
  updated_at = now()
WHERE tier = 'starter';

-- Pro: $499/mo (20k commoditized + 10k enhanced + 5k proprietary + 2k exclusive = 37k total)
UPDATE api_tier_limits SET
  requests_per_minute = 200,
  requests_per_hour = 3000,
  requests_per_day = 37000,
  max_concurrent_requests = 15,
  features = '["soil_analysis","county_lookup","water_quality","planting_calendar","safe_identification","dynamic_care","beginner_guidance","satellite_data","ai_recommendations","vrt_maps","turbo_quant"]'::jsonb,
  updated_at = now()
WHERE tier = 'pro';

-- Enterprise: $1,999/mo (100k commoditized + 50k enhanced + 25k proprietary + 10k exclusive = 185k total)
UPDATE api_tier_limits SET
  requests_per_minute = 500,
  requests_per_hour = 10000,
  requests_per_day = 185000,
  max_concurrent_requests = 50,
  features = '["all"]'::jsonb,
  updated_at = now()
WHERE tier = 'enterprise';