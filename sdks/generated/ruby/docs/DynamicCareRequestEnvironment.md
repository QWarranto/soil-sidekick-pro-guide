# SoilSidekick::DynamicCareRequestEnvironment

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **light_exposure** | **String** |  | [optional] |
| **humidity_level** | **String** | Approximate indoor humidity if applicable | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::DynamicCareRequestEnvironment.new(
  light_exposure: null,
  humidity_level: null
)
```

