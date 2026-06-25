# SoilSidekick::PlantingCalendar

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **crop_type** | **String** |  | [optional] |
| **optimal_planting_window** | [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] |
| **climate_factors** | **Object** |  | [optional] |
| **soil_factors** | **Object** |  | [optional] |
| **recommendations** | **Array&lt;String&gt;** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::PlantingCalendar.new(
  crop_type: null,
  optimal_planting_window: null,
  climate_factors: null,
  soil_factors: null,
  recommendations: null
)
```

