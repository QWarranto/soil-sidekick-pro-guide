# SoilSidekick::DynamicCareRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **plant_species** | **String** | Common or scientific plant name |  |
| **location** | [**DynamicCareRequestLocation**](DynamicCareRequestLocation.md) |  |  |
| **environment** | [**DynamicCareRequestEnvironment**](DynamicCareRequestEnvironment.md) |  | [optional] |
| **container_details** | [**DynamicCareRequestContainerDetails**](DynamicCareRequestContainerDetails.md) |  | [optional] |
| **soil_type** | **String** |  | [optional] |
| **last_watered** | **Date** | Date plant was last watered | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCareRequest.new(
  plant_species: Monstera deliciosa,
  location: null,
  environment: null,
  container_details: null,
  soil_type: null,
  last_watered: null
)
```

