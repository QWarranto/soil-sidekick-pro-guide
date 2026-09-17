# SoilSidekick::DynamicCareRequestLocation

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  |  |
| **state_code** | **String** |  | [optional] |
| **indoor** | **Boolean** | Whether the plant is indoors | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCareRequestLocation.new(
  county_fips: null,
  state_code: null,
  indoor: null
)
```

