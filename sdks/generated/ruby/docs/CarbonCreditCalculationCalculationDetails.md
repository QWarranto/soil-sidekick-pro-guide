# SoilSidekick::CarbonCreditCalculationCalculationDetails

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **credits_earned** | **Float** |  | [optional] |
| **calculation_method** | **String** |  | [optional] |
| **baseline_carbon** | **Float** |  | [optional] |
| **enhanced_carbon** | **Float** |  | [optional] |
| **verification_confidence** | **Float** |  | [optional] |
| **metadata** | [**CarbonCreditCalculationCalculationDetailsMetadata**](CarbonCreditCalculationCalculationDetailsMetadata.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::CarbonCreditCalculationCalculationDetails.new(
  credits_earned: null,
  calculation_method: null,
  baseline_carbon: null,
  enhanced_carbon: null,
  verification_confidence: null,
  metadata: null
)
```

