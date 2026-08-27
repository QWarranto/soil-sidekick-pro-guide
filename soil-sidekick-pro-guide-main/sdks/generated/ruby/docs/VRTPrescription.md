# SoilSidekick::VRTPrescription

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **id** | **String** |  | [optional] |
| **field_id** | **String** |  | [optional] |
| **application_type** | **String** |  | [optional] |
| **zones** | [**Array&lt;VRTPrescriptionZonesInner&gt;**](VRTPrescriptionZonesInner.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::VRTPrescription.new(
  id: null,
  field_id: null,
  application_type: null,
  zones: null
)
```

