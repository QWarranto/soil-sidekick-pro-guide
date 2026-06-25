# SoilSidekick::SeasonalPlanningResponseWeatherData

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **current_season** | **String** |  | [optional] |
| **temperature** | **String** |  | [optional] |
| **rainfall** | **String** |  | [optional] |
| **frost_dates** | **Object** |  | [optional] |
| **growing_season** | **String** |  | [optional] |
| **zone** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SeasonalPlanningResponseWeatherData.new(
  current_season: null,
  temperature: null,
  rainfall: null,
  frost_dates: null,
  growing_season: null,
  zone: null
)
```

