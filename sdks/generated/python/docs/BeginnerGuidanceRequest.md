# BeginnerGuidanceRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**question** | **str** | User&#39;s plant question in natural language | 
**plant_context** | [**BeginnerGuidanceRequestPlantContext**](BeginnerGuidanceRequestPlantContext.md) |  | [optional] 
**location** | [**BeginnerGuidanceRequestLocation**](BeginnerGuidanceRequestLocation.md) |  | [optional] 
**user_expertise** | **str** | User&#39;s self-assessed expertise level | [optional] [default to 'complete_beginner']

## Example

```python
from soilsidekick.models.beginner_guidance_request import BeginnerGuidanceRequest

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidanceRequest from a JSON string
beginner_guidance_request_instance = BeginnerGuidanceRequest.from_json(json)
# print the JSON string representation of the object
print(BeginnerGuidanceRequest.to_json())

# convert the object into a dict
beginner_guidance_request_dict = beginner_guidance_request_instance.to_dict()
# create an instance of BeginnerGuidanceRequest from a dict
beginner_guidance_request_from_dict = BeginnerGuidanceRequest.from_dict(beginner_guidance_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


