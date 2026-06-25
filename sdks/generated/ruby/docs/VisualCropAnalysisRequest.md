# SoilSidekick::VisualCropAnalysisRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **image** | **String** | Base64 encoded image or image URL |  |
| **analysis_type** | **String** |  |  |
| **location** | [**VisualCropAnalysisRequestLocation**](VisualCropAnalysisRequestLocation.md) |  | [optional] |
| **crop_type** | **String** | Type of crop being analyzed | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::VisualCropAnalysisRequest.new(
  image: null,
  analysis_type: null,
  location: null,
  crop_type: null
)
```

