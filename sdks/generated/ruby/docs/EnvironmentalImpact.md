# SoilSidekick::EnvironmentalImpact

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **impact_assessment** | [**EnvironmentalImpactImpactAssessment**](EnvironmentalImpactImpactAssessment.md) |  | [optional] |
| **detailed_analysis** | [**EnvironmentalImpactDetailedAnalysis**](EnvironmentalImpactDetailedAnalysis.md) |  | [optional] |
| **recommendations** | **Array&lt;String&gt;** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::EnvironmentalImpact.new(
  impact_assessment: null,
  detailed_analysis: null,
  recommendations: null
)
```

