INSERT INTO public.api_keys (user_id, key_name, key_hash, subscription_tier, permissions, rate_limit, rate_window_minutes, is_active)
VALUES (
  '36aa8617-6848-4878-a10c-cfe105b717c2',
  'Owner Full-Access Key (ak_)',
  'acc3d8fe544485384ab484a9997d39faabde2fb7e12b071255de83b33a3a6970',
  'enterprise',
  '{"endpoints":["get-soil-data","county-lookup","agricultural-intelligence","territorial-water-quality","territorial-water-analytics","multi-parameter-planting-calendar","live-agricultural-data","environmental-impact-engine","alpha-earth-environmental-enhancement","seasonal-planning-assistant","smart-report-summary","carbon-credit-calculator","leafengines-query","generate-vrt-prescription","visual-crop-analysis","mcp-server"],"owner":true}'::jsonb,
  10000,
  1,
  true
);