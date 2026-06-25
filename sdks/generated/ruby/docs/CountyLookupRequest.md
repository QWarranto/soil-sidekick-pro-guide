# SoilSidekick::CountyLookupRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **term** | **String** | Search term (county name, state, or FIPS) |  |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::CountyLookupRequest.new(
  term: Miami-Dade
)
```

