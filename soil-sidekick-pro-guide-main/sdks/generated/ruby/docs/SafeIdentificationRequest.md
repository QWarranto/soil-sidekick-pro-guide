# SoilSidekick::SafeIdentificationRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **image** | **String** | Base64 encoded image or image URL |  |
| **location** | [**SafeIdentificationRequestLocation**](SafeIdentificationRequestLocation.md) |  | [optional] |
| **context** | [**SafeIdentificationRequestContext**](SafeIdentificationRequestContext.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SafeIdentificationRequest.new(
  image: null,
  location: null,
  context: null
)
```

