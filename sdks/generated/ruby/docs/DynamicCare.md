# SoilSidekick::DynamicCare

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **success** | **Boolean** |  | [optional] |
| **plant** | [**DynamicCarePlant**](DynamicCarePlant.md) |  | [optional] |
| **current_conditions** | [**DynamicCareCurrentConditions**](DynamicCareCurrentConditions.md) |  | [optional] |
| **care_recommendations** | [**DynamicCareCareRecommendations**](DynamicCareCareRecommendations.md) |  | [optional] |
| **warnings** | **Array&lt;String&gt;** | Any urgent care warnings | [optional] |
| **metadata** | [**DynamicCareMetadata**](DynamicCareMetadata.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCare.new(
  success: null,
  plant: null,
  current_conditions: null,
  care_recommendations: null,
  warnings: null,
  metadata: null
)
```

