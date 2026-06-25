# SoilSidekick::BeginnerGuidanceRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **question** | **String** | User&#39;s plant question in natural language |  |
| **plant_context** | [**BeginnerGuidanceRequestPlantContext**](BeginnerGuidanceRequestPlantContext.md) |  | [optional] |
| **location** | [**BeginnerGuidanceRequestLocation**](BeginnerGuidanceRequestLocation.md) |  | [optional] |
| **user_expertise** | **String** | User&#39;s self-assessed expertise level | [optional][default to &#39;complete_beginner&#39;] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::BeginnerGuidanceRequest.new(
  question: My plant has yellow leaves, what&#39;s wrong?,
  plant_context: null,
  location: null,
  user_expertise: null
)
```

