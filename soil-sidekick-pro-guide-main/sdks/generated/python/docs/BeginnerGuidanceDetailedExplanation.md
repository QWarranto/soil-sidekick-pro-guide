# BeginnerGuidanceDetailedExplanation

More details for users who want to learn

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**technical_term** | **str** |  | [optional] 
**plain_english** | **str** |  | [optional] 
**common_causes** | **List[str]** |  | [optional] 
**prevention_tips** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.beginner_guidance_detailed_explanation import BeginnerGuidanceDetailedExplanation

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidanceDetailedExplanation from a JSON string
beginner_guidance_detailed_explanation_instance = BeginnerGuidanceDetailedExplanation.from_json(json)
# print the JSON string representation of the object
print BeginnerGuidanceDetailedExplanation.to_json()

# convert the object into a dict
beginner_guidance_detailed_explanation_dict = beginner_guidance_detailed_explanation_instance.to_dict()
# create an instance of BeginnerGuidanceDetailedExplanation from a dict
beginner_guidance_detailed_explanation_form_dict = beginner_guidance_detailed_explanation.from_dict(beginner_guidance_detailed_explanation_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


