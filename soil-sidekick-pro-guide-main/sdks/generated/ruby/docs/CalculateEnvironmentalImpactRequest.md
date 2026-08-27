# SoilSidekick::CalculateEnvironmentalImpactRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **analysis_id** | **String** |  |  |
| **county_fips** | **String** |  |  |
| **soil_data** | [**CalculateEnvironmentalImpactRequestSoilData**](CalculateEnvironmentalImpactRequestSoilData.md) |  |  |
| **proposed_treatments** | [**Array&lt;CalculateEnvironmentalImpactRequestProposedTreatmentsInner&gt;**](CalculateEnvironmentalImpactRequestProposedTreatmentsInner.md) |  | [optional] |
| **water_body_data** | [**CalculateEnvironmentalImpactRequestWaterBodyData**](CalculateEnvironmentalImpactRequestWaterBodyData.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::CalculateEnvironmentalImpactRequest.new(
  analysis_id: null,
  county_fips: null,
  soil_data: null,
  proposed_treatments: null,
  water_body_data: null
)
```

