# SoilSidekick::EnvironmentalImpactDetailedAnalysis

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **runoff_risk** | [**EnvironmentalImpactDetailedAnalysisRunoffRisk**](EnvironmentalImpactDetailedAnalysisRunoffRisk.md) |  | [optional] |
| **contamination_assessment** | **Object** |  | [optional] |
| **eco_alternatives** | [**EnvironmentalImpactDetailedAnalysisEcoAlternatives**](EnvironmentalImpactDetailedAnalysisEcoAlternatives.md) |  | [optional] |
| **carbon_analysis** | **Object** |  | [optional] |
| **biodiversity_assessment** | **Object** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::EnvironmentalImpactDetailedAnalysis.new(
  runoff_risk: null,
  contamination_assessment: null,
  eco_alternatives: null,
  carbon_analysis: null,
  biodiversity_assessment: null
)
```

