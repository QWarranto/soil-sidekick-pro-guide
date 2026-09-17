# SoilSidekick::SafeIdentificationRequestLocation

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** |  | [optional] |
| **state_code** | **String** |  | [optional] |
| **coordinates** | [**SafeIdentificationRequestLocationCoordinates**](SafeIdentificationRequestLocationCoordinates.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SafeIdentificationRequestLocation.new(
  county_fips: null,
  state_code: null,
  coordinates: null
)
```

