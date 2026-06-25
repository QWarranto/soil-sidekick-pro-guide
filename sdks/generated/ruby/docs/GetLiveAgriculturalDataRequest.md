# SoilSidekick::GetLiveAgriculturalDataRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  |  |
| **data_types** | **Array&lt;String&gt;** | Types of data to fetch |  |
| **state_code** | **String** |  |  |
| **county_name** | **String** |  |  |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::GetLiveAgriculturalDataRequest.new(
  county_fips: null,
  data_types: null,
  state_code: null,
  county_name: null
)
```

