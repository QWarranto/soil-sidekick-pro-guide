# DynamicCareRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**plant_species** | **str** | Common or scientific plant name | 
**location** | [**DynamicCareRequestLocation**](DynamicCareRequestLocation.md) |  | 
**environment** | [**DynamicCareRequestEnvironment**](DynamicCareRequestEnvironment.md) |  | [optional] 
**container_details** | [**DynamicCareRequestContainerDetails**](DynamicCareRequestContainerDetails.md) |  | [optional] 
**soil_type** | **str** |  | [optional] 
**last_watered** | **date** | Date plant was last watered | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_request import DynamicCareRequest

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareRequest from a JSON string
dynamic_care_request_instance = DynamicCareRequest.from_json(json)
# print the JSON string representation of the object
print DynamicCareRequest.to_json()

# convert the object into a dict
dynamic_care_request_dict = dynamic_care_request_instance.to_dict()
# create an instance of DynamicCareRequest from a dict
dynamic_care_request_form_dict = dynamic_care_request.from_dict(dynamic_care_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


