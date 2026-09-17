# SoilSidekick::GetSoilDataRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_fips** | **String** | 5-digit FIPS code |  |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::GetSoilDataRequest.new(
  county_fips: 12345
)
```

