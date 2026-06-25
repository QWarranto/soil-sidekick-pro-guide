# DynamicCareRequestContainerDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** |  | [optional] 
**size_inches** | **float** |  | [optional] 
**has_drainage** | **bool** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_request_container_details import DynamicCareRequestContainerDetails

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareRequestContainerDetails from a JSON string
dynamic_care_request_container_details_instance = DynamicCareRequestContainerDetails.from_json(json)
# print the JSON string representation of the object
print(DynamicCareRequestContainerDetails.to_json())

# convert the object into a dict
dynamic_care_request_container_details_dict = dynamic_care_request_container_details_instance.to_dict()
# create an instance of DynamicCareRequestContainerDetails from a dict
dynamic_care_request_container_details_from_dict = DynamicCareRequestContainerDetails.from_dict(dynamic_care_request_container_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


