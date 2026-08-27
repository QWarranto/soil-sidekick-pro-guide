# SoilSidekick::DynamicCareCareRecommendations

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **watering** | [**DynamicCareCareRecommendationsWatering**](DynamicCareCareRecommendationsWatering.md) |  | [optional] |
| **light** | [**DynamicCareCareRecommendationsLight**](DynamicCareCareRecommendationsLight.md) |  | [optional] |
| **humidity** | [**DynamicCareCareRecommendationsHumidity**](DynamicCareCareRecommendationsHumidity.md) |  | [optional] |
| **seasonal_notes** | **String** | Season-specific care adjustments | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCareCareRecommendations.new(
  watering: null,
  light: null,
  humidity: null,
  seasonal_notes: null
)
```

