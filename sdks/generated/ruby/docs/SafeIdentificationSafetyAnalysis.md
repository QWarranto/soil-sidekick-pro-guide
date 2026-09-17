# SoilSidekick::SafeIdentificationSafetyAnalysis

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **toxicity_level** | **String** |  | [optional] |
| **toxic_to** | **Array&lt;String&gt;** | List of animals/people this is toxic to (e.g., cats, dogs, children) | [optional] |
| **lookalikes** | [**Array&lt;SafeIdentificationSafetyAnalysisLookalikesInner&gt;**](SafeIdentificationSafetyAnalysisLookalikesInner.md) |  | [optional] |
| **warnings** | **Array&lt;String&gt;** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SafeIdentificationSafetyAnalysis.new(
  toxicity_level: null,
  toxic_to: null,
  lookalikes: null,
  warnings: null
)
```

