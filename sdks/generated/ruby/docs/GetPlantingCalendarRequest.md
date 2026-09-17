# SoilSidekick::GetPlantingCalendarRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  |  |
| **crop_type** | **String** |  |  |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::GetPlantingCalendarRequest.new(
  county_fips: null,
  crop_type: corn
)
```

