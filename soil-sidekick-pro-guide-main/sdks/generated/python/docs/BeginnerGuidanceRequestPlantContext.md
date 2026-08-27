# BeginnerGuidanceRequestPlantContext


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**plant_name** | **str** | Common plant name if known | [optional] 
**image** | **str** | Base64 image for context | [optional] 

## Example

```python
from soilsidekick.models.beginner_guidance_request_plant_context import BeginnerGuidanceRequestPlantContext

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidanceRequestPlantContext from a JSON string
beginner_guidance_request_plant_context_instance = BeginnerGuidanceRequestPlantContext.from_json(json)
# print the JSON string representation of the object
print BeginnerGuidanceRequestPlantContext.to_json()

# convert the object into a dict
beginner_guidance_request_plant_context_dict = beginner_guidance_request_plant_context_instance.to_dict()
# create an instance of BeginnerGuidanceRequestPlantContext from a dict
beginner_guidance_request_plant_context_form_dict = beginner_guidance_request_plant_context.from_dict(beginner_guidance_request_plant_context_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


