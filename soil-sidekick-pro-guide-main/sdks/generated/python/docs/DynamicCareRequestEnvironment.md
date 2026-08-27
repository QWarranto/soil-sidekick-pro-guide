# DynamicCareRequestEnvironment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**light_exposure** | **str** |  | [optional] 
**humidity_level** | **str** | Approximate indoor humidity if applicable | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_request_environment import DynamicCareRequestEnvironment

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareRequestEnvironment from a JSON string
dynamic_care_request_environment_instance = DynamicCareRequestEnvironment.from_json(json)
# print the JSON string representation of the object
print DynamicCareRequestEnvironment.to_json()

# convert the object into a dict
dynamic_care_request_environment_dict = dynamic_care_request_environment_instance.to_dict()
# create an instance of DynamicCareRequestEnvironment from a dict
dynamic_care_request_environment_form_dict = dynamic_care_request_environment.from_dict(dynamic_care_request_environment_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


