# SoilSidekick::LeafenginesQueryRequestOptions

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **include_satellite_data** | **Boolean** |  | [optional] |
| **include_water_quality** | **Boolean** |  | [optional] |
| **include_recommendations** | **Boolean** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::LeafenginesQueryRequestOptions.new(
  include_satellite_data: null,
  include_water_quality: null,
  include_recommendations: null
)
```

