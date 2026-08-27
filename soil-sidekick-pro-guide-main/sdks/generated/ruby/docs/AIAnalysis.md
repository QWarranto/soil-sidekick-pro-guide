# SoilSidekick::AIAnalysis

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **analysis_type** | **String** |  | [optional] |
| **confidence_score** | **Float** |  | [optional] |
| **recommendations** | [**Array&lt;AIAnalysisRecommendationsInner&gt;**](AIAnalysisRecommendationsInner.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::AIAnalysis.new(
  analysis_type: null,
  confidence_score: null,
  recommendations: null
)
```

