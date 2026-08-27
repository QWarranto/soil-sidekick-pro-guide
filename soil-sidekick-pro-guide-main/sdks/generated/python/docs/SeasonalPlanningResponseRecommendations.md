# SeasonalPlanningResponseRecommendations


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**seasonal_tasks** | **List[object]** |  | [optional] 
**crop_recommendations** | **List[str]** |  | [optional] 
**timing_guidance** | **object** |  | [optional] 

## Example

```python
from soilsidekick.models.seasonal_planning_response_recommendations import SeasonalPlanningResponseRecommendations

# TODO update the JSON string below
json = "{}"
# create an instance of SeasonalPlanningResponseRecommendations from a JSON string
seasonal_planning_response_recommendations_instance = SeasonalPlanningResponseRecommendations.from_json(json)
# print the JSON string representation of the object
print SeasonalPlanningResponseRecommendations.to_json()

# convert the object into a dict
seasonal_planning_response_recommendations_dict = seasonal_planning_response_recommendations_instance.to_dict()
# create an instance of SeasonalPlanningResponseRecommendations from a dict
seasonal_planning_response_recommendations_form_dict = seasonal_planning_response_recommendations.from_dict(seasonal_planning_response_recommendations_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


