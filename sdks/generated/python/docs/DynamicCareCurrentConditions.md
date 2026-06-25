# DynamicCareCurrentConditions


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**temperature_f** | **float** |  | [optional] 
**humidity_percent** | **float** |  | [optional] 
**recent_rainfall_inches** | **float** |  | [optional] 
**season** | **str** |  | [optional] 
**days_since_watered** | **int** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_current_conditions import DynamicCareCurrentConditions

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareCurrentConditions from a JSON string
dynamic_care_current_conditions_instance = DynamicCareCurrentConditions.from_json(json)
# print the JSON string representation of the object
print(DynamicCareCurrentConditions.to_json())

# convert the object into a dict
dynamic_care_current_conditions_dict = dynamic_care_current_conditions_instance.to_dict()
# create an instance of DynamicCareCurrentConditions from a dict
dynamic_care_current_conditions_from_dict = DynamicCareCurrentConditions.from_dict(dynamic_care_current_conditions_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


