# DynamicCare

Dynamic, environment-aware plant care recommendations

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**plant** | [**DynamicCarePlant**](DynamicCarePlant.md) |  | [optional] 
**current_conditions** | [**DynamicCareCurrentConditions**](DynamicCareCurrentConditions.md) |  | [optional] 
**care_recommendations** | [**DynamicCareCareRecommendations**](DynamicCareCareRecommendations.md) |  | [optional] 
**warnings** | **List[str]** | Any urgent care warnings | [optional] 
**metadata** | [**DynamicCareMetadata**](DynamicCareMetadata.md) |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care import DynamicCare

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCare from a JSON string
dynamic_care_instance = DynamicCare.from_json(json)
# print the JSON string representation of the object
print(DynamicCare.to_json())

# convert the object into a dict
dynamic_care_dict = dynamic_care_instance.to_dict()
# create an instance of DynamicCare from a dict
dynamic_care_from_dict = DynamicCare.from_dict(dynamic_care_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


