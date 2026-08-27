# BeginnerGuidanceRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**indoor** | **bool** |  | [optional] 

## Example

```python
from soilsidekick.models.beginner_guidance_request_location import BeginnerGuidanceRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of BeginnerGuidanceRequestLocation from a JSON string
beginner_guidance_request_location_instance = BeginnerGuidanceRequestLocation.from_json(json)
# print the JSON string representation of the object
print BeginnerGuidanceRequestLocation.to_json()

# convert the object into a dict
beginner_guidance_request_location_dict = beginner_guidance_request_location_instance.to_dict()
# create an instance of BeginnerGuidanceRequestLocation from a dict
beginner_guidance_request_location_form_dict = beginner_guidance_request_location.from_dict(beginner_guidance_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


