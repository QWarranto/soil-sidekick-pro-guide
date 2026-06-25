# SoilSidekick::LeafenginesQueryRequestPlant

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **common_name** | **String** |  | [optional] |
| **scientific_name** | **String** |  | [optional] |
| **plant_id** | **String** |  | [optional] |
| **care_requirements** | [**LeafenginesQueryRequestPlantCareRequirements**](LeafenginesQueryRequestPlantCareRequirements.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::LeafenginesQueryRequestPlant.new(
  common_name: null,
  scientific_name: null,
  plant_id: null,
  care_requirements: null
)
```

