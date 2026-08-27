# SeasonalPlanningResponseWeatherData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**current_season** | **str** |  | [optional] 
**temperature** | **str** |  | [optional] 
**rainfall** | **str** |  | [optional] 
**frost_dates** | **object** |  | [optional] 
**growing_season** | **str** |  | [optional] 
**zone** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.seasonal_planning_response_weather_data import SeasonalPlanningResponseWeatherData

# TODO update the JSON string below
json = "{}"
# create an instance of SeasonalPlanningResponseWeatherData from a JSON string
seasonal_planning_response_weather_data_instance = SeasonalPlanningResponseWeatherData.from_json(json)
# print the JSON string representation of the object
print SeasonalPlanningResponseWeatherData.to_json()

# convert the object into a dict
seasonal_planning_response_weather_data_dict = seasonal_planning_response_weather_data_instance.to_dict()
# create an instance of SeasonalPlanningResponseWeatherData from a dict
seasonal_planning_response_weather_data_form_dict = seasonal_planning_response_weather_data.from_dict(seasonal_planning_response_weather_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


