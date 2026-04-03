INSERT INTO public.api_keys (
  user_id,
  key_name,
  key_hash,
  subscription_tier,
  rate_limit,
  rate_window_minutes,
  is_active,
  permissions
) VALUES (
  'e95930d5-21a2-43f6-b820-03c5ae467e8f',
  'Composio.dev Enterprise Integration Key',
  '304864aeb134e09edfa7d40fe3781e7e850c00deea8189f8dfc29aa3168bde5bf7c7a7eb16c68d4a6a9b281b23dfaddc49ddf930cf6af00d590248837f10c4e0',
  'enterprise',
  10000,
  60,
  true,
  '{"endpoints": ["get-soil-data", "county-lookup", "agricultural-intelligence", "territorial-water-quality", "territorial-water-analytics", "multi-parameter-planting-calendar", "live-agricultural-data", "environmental-impact-engine", "alpha-earth-environmental-enhancement", "seasonal-planning-assistant", "smart-report-summary", "carbon-credit-calculator", "leafengines-query", "generate-vrt-prescription", "visual-crop-analysis", "mcp-server"], "sandbox_only": false, "partner": "composio.dev"}'::jsonb
);