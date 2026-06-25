# SoilSidekick::SatelliteData

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **ndvi** | **Float** | Normalized Difference Vegetation Index | [optional] |
| **evi** | **Float** | Enhanced Vegetation Index | [optional] |
| **soil_moisture** | **Float** |  | [optional] |
| **temperature** | **Float** |  | [optional] |
| **cloud_cover** | **Float** |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::SatelliteData.new(
  ndvi: null,
  evi: null,
  soil_moisture: null,
  temperature: null,
  cloud_cover: null
)
```

