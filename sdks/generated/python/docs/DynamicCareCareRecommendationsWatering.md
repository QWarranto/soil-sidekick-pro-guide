# DynamicCareCareRecommendationsWatering


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**action** | **str** |  | [optional] 
**reasoning** | **str** |  | [optional] 
**next_check_days** | **int** |  | [optional] 
**amount_guidance** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_care_recommendations_watering import DynamicCareCareRecommendationsWatering

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareCareRecommendationsWatering from a JSON string
dynamic_care_care_recommendations_watering_instance = DynamicCareCareRecommendationsWatering.from_json(json)
# print the JSON string representation of the object
print(DynamicCareCareRecommendationsWatering.to_json())

# convert the object into a dict
dynamic_care_care_recommendations_watering_dict = dynamic_care_care_recommendations_watering_instance.to_dict()
# create an instance of DynamicCareCareRecommendationsWatering from a dict
dynamic_care_care_recommendations_watering_from_dict = DynamicCareCareRecommendationsWatering.from_dict(dynamic_care_care_recommendations_watering_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


