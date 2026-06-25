# SoilSidekick::LeafenginesQueryRequestPlantCareRequirements

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **sun_exposure** | **String** |  | [optional] |
| **water_needs** | **String** |  | [optional] |
| **soil_ph_range** | [**LeafenginesQueryRequestPlantCareRequirementsSoilPhRange**](LeafenginesQueryRequestPlantCareRequirementsSoilPhRange.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::LeafenginesQueryRequestPlantCareRequirements.new(
  sun_exposure: null,
  water_needs: null,
  soil_ph_range: null
)
```

