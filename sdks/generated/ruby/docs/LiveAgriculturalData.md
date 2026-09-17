# SoilSidekick::LiveAgriculturalData

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  | [optional] |
| **county_name** | **String** |  | [optional] |
| **state_code** | **String** |  | [optional] |
| **data** | [**LiveAgriculturalDataData**](LiveAgriculturalDataData.md) |  | [optional] |
| **sources** | **Array&lt;String&gt;** |  | [optional] |
| **timestamp** | **Time** |  | [optional] |
| **cache_status** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::LiveAgriculturalData.new(
  county_fips: null,
  county_name: null,
  state_code: null,
  data: null,
  sources: null,
  timestamp: null,
  cache_status: null
)
```

