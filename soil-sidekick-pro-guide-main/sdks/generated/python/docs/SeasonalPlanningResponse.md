# SeasonalPlanningResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**recommendations** | [**SeasonalPlanningResponseRecommendations**](SeasonalPlanningResponseRecommendations.md) |  | [optional] 
**weather_data** | [**SeasonalPlanningResponseWeatherData**](SeasonalPlanningResponseWeatherData.md) |  | [optional] 
**model_used** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.seasonal_planning_response import SeasonalPlanningResponse

# TODO update the JSON string below
json = "{}"
# create an instance of SeasonalPlanningResponse from a JSON string
seasonal_planning_response_instance = SeasonalPlanningResponse.from_json(json)
# print the JSON string representation of the object
print SeasonalPlanningResponse.to_json()

# convert the object into a dict
seasonal_planning_response_dict = seasonal_planning_response_instance.to_dict()
# create an instance of SeasonalPlanningResponse from a dict
seasonal_planning_response_form_dict = seasonal_planning_response.from_dict(seasonal_planning_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


