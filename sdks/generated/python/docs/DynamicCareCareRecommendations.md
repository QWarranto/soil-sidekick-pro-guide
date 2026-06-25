# DynamicCareCareRecommendations


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**watering** | [**DynamicCareCareRecommendationsWatering**](DynamicCareCareRecommendationsWatering.md) |  | [optional] 
**light** | [**DynamicCareCareRecommendationsLight**](DynamicCareCareRecommendationsLight.md) |  | [optional] 
**humidity** | [**DynamicCareCareRecommendationsHumidity**](DynamicCareCareRecommendationsHumidity.md) |  | [optional] 
**seasonal_notes** | **str** | Season-specific care adjustments | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_care_recommendations import DynamicCareCareRecommendations

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareCareRecommendations from a JSON string
dynamic_care_care_recommendations_instance = DynamicCareCareRecommendations.from_json(json)
# print the JSON string representation of the object
print(DynamicCareCareRecommendations.to_json())

# convert the object into a dict
dynamic_care_care_recommendations_dict = dynamic_care_care_recommendations_instance.to_dict()
# create an instance of DynamicCareCareRecommendations from a dict
dynamic_care_care_recommendations_from_dict = DynamicCareCareRecommendations.from_dict(dynamic_care_care_recommendations_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


