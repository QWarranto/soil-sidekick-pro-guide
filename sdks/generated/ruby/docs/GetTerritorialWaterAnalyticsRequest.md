# SoilSidekick::GetTerritorialWaterAnalyticsRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **territory_type** | **String** | Type of territory to analyze | [optional] |
| **epa_region** | **String** | EPA region identifier | [optional] |
| **date_range** | [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::GetTerritorialWaterAnalyticsRequest.new(
  territory_type: null,
  epa_region: null,
  date_range: null
)
```

