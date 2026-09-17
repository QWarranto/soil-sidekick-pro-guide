# SoilSidekick::SoilData

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **id** | **String** |  | [optional] |
| **county_fips** | **String** |  | [optional] |
| **county_name** | **String** |  | [optional] |
| **state_code** | **String** |  | [optional] |
| **ph_level** | **Float** |  | [optional] |
| **organic_matter** | **Float** |  | [optional] |
| **nitrogen_level** | **String** |  | [optional] |
| **phosphorus_level** | **String** |  | [optional] |
| **potassium_level** | **String** |  | [optional] |
| **recommendations** | **String** |  | [optional] |
| **analysis_data** | **Hash&lt;String, Object&gt;** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SoilData.new(
  id: null,
  county_fips: null,
  county_name: null,
  state_code: null,
  ph_level: null,
  organic_matter: null,
  nitrogen_level: null,
  phosphorus_level: null,
  potassium_level: null,
  recommendations: null,
  analysis_data: null
)
```

