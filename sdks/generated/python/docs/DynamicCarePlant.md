# DynamicCarePlant


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**common_name** | **str** |  | [optional] 
**scientific_name** | **str** |  | [optional] 
**care_difficulty** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_plant import DynamicCarePlant

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCarePlant from a JSON string
dynamic_care_plant_instance = DynamicCarePlant.from_json(json)
# print the JSON string representation of the object
print(DynamicCarePlant.to_json())

# convert the object into a dict
dynamic_care_plant_dict = dynamic_care_plant_instance.to_dict()
# create an instance of DynamicCarePlant from a dict
dynamic_care_plant_from_dict = DynamicCarePlant.from_dict(dynamic_care_plant_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


