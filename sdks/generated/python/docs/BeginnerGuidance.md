# BeginnerGuidance

Beginner-friendly plant guidance response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**simple_answer** | **str** | Plain-language answer without jargon, 1-2 sentences | [optional] 
**what_to_do_now** | **str** | Immediate actionable step | [optional] 
**why_this_happens** | **str** | Simple explanation of the cause | [optional] 
**detailed_explanation** | [**BeginnerGuidanceDetailedExplanation**](BeginnerGuidanceDetailedExplanation.md) |  | [optional] 
**encouragement** | **str** | Supportive message for the user | [optional] 
**related_questions** | **List[str]** | Common follow-up questions | [optional] 
**confidence** | **float** | Confidence in the guidance (0-100) | [optional] 
**metadata** | [**BeginnerGuidanceMetadata**](BeginnerGuidanceMetadata.md) |  | [optional] 

## Example

```python
from soilsidekick.models.beginner_guidance import BeginnerGuidance

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidance from a JSON string
beginner_guidance_instance = BeginnerGuidance.from_json(json)
# print the JSON string representation of the object
print(BeginnerGuidance.to_json())

# convert the object into a dict
beginner_guidance_dict = beginner_guidance_instance.to_dict()
# create an instance of BeginnerGuidance from a dict
beginner_guidance_from_dict = BeginnerGuidance.from_dict(beginner_guidance_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


