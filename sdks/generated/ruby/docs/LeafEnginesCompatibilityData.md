# SoilSidekick::LeafEnginesCompatibilityData

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **overall_score** | **Float** | Overall compatibility score (0-100) | [optional] |
| **soil_compatibility** | **Float** |  | [optional] |
| **water_compatibility** | **Float** |  | [optional] |
| **climate_compatibility** | **Float** |  | [optional] |
| **breakdown** | [**LeafEnginesCompatibilityDataBreakdown**](LeafEnginesCompatibilityDataBreakdown.md) |  | [optional] |
| **recommendations** | **Array&lt;String&gt;** |  | [optional] |
| **risk_level** | **String** |  | [optional] |
| **metadata** | [**LeafEnginesCompatibilityDataMetadata**](LeafEnginesCompatibilityDataMetadata.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::LeafEnginesCompatibilityData.new(
  overall_score: null,
  soil_compatibility: null,
  water_compatibility: null,
  climate_compatibility: null,
  breakdown: null,
  recommendations: null,
  risk_level: null,
  metadata: null
)
```

