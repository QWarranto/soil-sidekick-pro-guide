# BeginnerGuidanceMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expertise_level_used** | **str** |  | [optional] 
**plant_identified** | **bool** |  | [optional] 
**environmental_context** | **bool** |  | [optional] 

## Example

```python
from soilsidekick.models.beginner_guidance_metadata import BeginnerGuidanceMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidanceMetadata from a JSON string
beginner_guidance_metadata_instance = BeginnerGuidanceMetadata.from_json(json)
# print the JSON string representation of the object
print(BeginnerGuidanceMetadata.to_json())

# convert the object into a dict
beginner_guidance_metadata_dict = beginner_guidance_metadata_instance.to_dict()
# create an instance of BeginnerGuidanceMetadata from a dict
beginner_guidance_metadata_from_dict = BeginnerGuidanceMetadata.from_dict(beginner_guidance_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


