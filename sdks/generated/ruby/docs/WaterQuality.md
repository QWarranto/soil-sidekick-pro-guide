# SoilSidekick::WaterQuality

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  | [optional] |
| **ph** | **Float** |  | [optional] |
| **dissolved_oxygen** | **Float** |  | [optional] |
| **turbidity** | **Float** |  | [optional] |
| **nitrates** | **Float** |  | [optional] |
| **phosphates** | **Float** |  | [optional] |
| **contamination_risk** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::WaterQuality.new(
  county_fips: null,
  ph: null,
  dissolved_oxygen: null,
  turbidity: null,
  nitrates: null,
  phosphates: null,
  contamination_risk: null
)
```

