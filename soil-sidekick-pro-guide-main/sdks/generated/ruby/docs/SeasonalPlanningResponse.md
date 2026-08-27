# SoilSidekick::SeasonalPlanningResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **success** | **Boolean** |  | [optional] |
| **recommendations** | [**SeasonalPlanningResponseRecommendations**](SeasonalPlanningResponseRecommendations.md) |  | [optional] |
| **weather_data** | [**SeasonalPlanningResponseWeatherData**](SeasonalPlanningResponseWeatherData.md) |  | [optional] |
| **model_used** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SeasonalPlanningResponse.new(
  success: null,
  recommendations: null,
  weather_data: null,
  model_used: null
)
```

