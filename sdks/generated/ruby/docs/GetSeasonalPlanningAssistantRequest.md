# SoilSidekick::GetSeasonalPlanningAssistantRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **location** | [**GetSeasonalPlanningAssistantRequestLocation**](GetSeasonalPlanningAssistantRequestLocation.md) |  |  |
| **soil_data** | **Object** | Optional soil data for enhanced recommendations | [optional] |
| **planning_type** | **String** |  |  |
| **crop_preferences** | **Array&lt;String&gt;** |  | [optional] |
| **timeframe** | **String** | Planning timeframe (e.g., \&quot;3 months\&quot;, \&quot;1 year\&quot;) | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::GetSeasonalPlanningAssistantRequest.new(
  location: null,
  soil_data: null,
  planning_type: null,
  crop_preferences: null,
  timeframe: null
)
```

