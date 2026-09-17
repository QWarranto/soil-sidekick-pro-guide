# DynamicCareCareRecommendationsLight


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**current_assessment** | **str** |  | [optional] 
**adjustment_needed** | **bool** |  | [optional] 
**recommendation** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_care_recommendations_light import DynamicCareCareRecommendationsLight

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareCareRecommendationsLight from a JSON string
dynamic_care_care_recommendations_light_instance = DynamicCareCareRecommendationsLight.from_json(json)
# print the JSON string representation of the object
print(DynamicCareCareRecommendationsLight.to_json())

# convert the object into a dict
dynamic_care_care_recommendations_light_dict = dynamic_care_care_recommendations_light_instance.to_dict()
# create an instance of DynamicCareCareRecommendationsLight from a dict
dynamic_care_care_recommendations_light_from_dict = DynamicCareCareRecommendationsLight.from_dict(dynamic_care_care_recommendations_light_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


