# SoilSidekick::TurboQuantCapabilitiesRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **device_memory_gb** | **Float** | Device RAM in GB | [optional] |
| **has_webgpu** | **Boolean** | Whether WebGPU is available | [optional] |
| **platform** | **String** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::TurboQuantCapabilitiesRequest.new(
  device_memory_gb: 4,
  has_webgpu: true,
  platform: mobile
)
```

