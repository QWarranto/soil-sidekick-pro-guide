# SoilSidekick::SafeIdentification

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **success** | **Boolean** |  | [optional] |
| **identification** | [**SafeIdentificationIdentification**](SafeIdentificationIdentification.md) |  | [optional] |
| **safety_analysis** | [**SafeIdentificationSafetyAnalysis**](SafeIdentificationSafetyAnalysis.md) |  | [optional] |
| **confidence_breakdown** | [**SafeIdentificationConfidenceBreakdown**](SafeIdentificationConfidenceBreakdown.md) |  | [optional] |
| **metadata** | [**SafeIdentificationMetadata**](SafeIdentificationMetadata.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SafeIdentification.new(
  success: null,
  identification: null,
  safety_analysis: null,
  confidence_breakdown: null,
  metadata: null
)
```

