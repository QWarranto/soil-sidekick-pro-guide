# SoilSidekick::DynamicCareCurrentConditions

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **temperature_f** | **Float** |  | [optional] |
| **humidity_percent** | **Float** |  | [optional] |
| **recent_rainfall_inches** | **Float** |  | [optional] |
| **season** | **String** |  | [optional] |
| **days_since_watered** | **Integer** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCareCurrentConditions.new(
  temperature_f: null,
  humidity_percent: null,
  recent_rainfall_inches: null,
  season: null,
  days_since_watered: null
)
```

