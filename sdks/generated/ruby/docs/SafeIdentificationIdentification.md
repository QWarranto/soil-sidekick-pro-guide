# SoilSidekick::SafeIdentificationIdentification

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **primary_match** | [**SafeIdentificationIdentificationPrimaryMatch**](SafeIdentificationIdentificationPrimaryMatch.md) |  | [optional] |
| **environmental_probability** | **Float** | Likelihood this plant exists in the given environment | [optional] |
| **growth_stage_detected** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SafeIdentificationIdentification.new(
  primary_match: null,
  environmental_probability: null,
  growth_stage_detected: null
)
```

