# SoilSidekick::CalculateCarbonCreditsRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **field_name** | **String** | Name of the field |  |
| **field_size_acres** | **Float** | Field size in acres |  |
| **soil_organic_matter** | **Float** | Soil organic matter percentage | [optional] |
| **soil_analysis_id** | **String** | Reference to existing soil analysis | [optional] |
| **verification_type** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::CalculateCarbonCreditsRequest.new(
  field_name: null,
  field_size_acres: null,
  soil_organic_matter: null,
  soil_analysis_id: null,
  verification_type: null
)
```

