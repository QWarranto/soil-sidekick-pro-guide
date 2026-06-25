# DynamicCareRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | 
**state_code** | **str** |  | [optional] 
**indoor** | **bool** | Whether the plant is indoors | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_request_location import DynamicCareRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareRequestLocation from a JSON string
dynamic_care_request_location_instance = DynamicCareRequestLocation.from_json(json)
# print the JSON string representation of the object
print(DynamicCareRequestLocation.to_json())

# convert the object into a dict
dynamic_care_request_location_dict = dynamic_care_request_location_instance.to_dict()
# create an instance of DynamicCareRequestLocation from a dict
dynamic_care_request_location_from_dict = DynamicCareRequestLocation.from_dict(dynamic_care_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


