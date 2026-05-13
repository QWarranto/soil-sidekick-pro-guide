INSERT INTO public.api_keys (
  user_id, key_name, key_hash, subscription_tier, rate_limit, rate_window_minutes,
  permissions, is_active
) VALUES (
  '36aa8617-6848-4878-a10c-cfe105b717c2',
  'Owner Full-Access Key',
  '881cdfc6282fa8067b167c3bd269f5721ac090aa4df46c01e15b39edc538553f',
  'enterprise',
  10000,
  1,
  '{"endpoints":["get-soil-data","county-lookup","agricultural-intelligence","territorial-water-quality","territorial-water-analytics","multi-parameter-planting-calendar","live-agricultural-data","environmental-impact-engine","alpha-earth-environmental-enhancement","seasonal-planning-assistant","smart-report-summary","carbon-credit-calculator","leafengines-query","generate-vrt-prescription","visual-crop-analysis","mcp-server"],"sandbox_only":false,"owner":true}'::jsonb,
  true
);