# SoilSidekick::BeginnerGuidance

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **success** | **Boolean** |  | [optional] |
| **simple_answer** | **String** | Plain-language answer without jargon, 1-2 sentences | [optional] |
| **what_to_do_now** | **String** | Immediate actionable step | [optional] |
| **why_this_happens** | **String** | Simple explanation of the cause | [optional] |
| **detailed_explanation** | [**BeginnerGuidanceDetailedExplanation**](BeginnerGuidanceDetailedExplanation.md) |  | [optional] |
| **encouragement** | **String** | Supportive message for the user | [optional] |
| **related_questions** | **Array&lt;String&gt;** | Common follow-up questions | [optional] |
| **confidence** | **Float** | Confidence in the guidance (0-100) | [optional] |
| **metadata** | [**BeginnerGuidanceMetadata**](BeginnerGuidanceMetadata.md) |  | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::BeginnerGuidance.new(
  success: null,
  simple_answer: null,
  what_to_do_now: null,
  why_this_happens: null,
  detailed_explanation: null,
  encouragement: null,
  related_questions: null,
  confidence: null,
  metadata: null
)
```

