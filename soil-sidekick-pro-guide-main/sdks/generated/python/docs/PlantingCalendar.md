# PlantingCalendar


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**crop_type** | **str** |  | [optional] 
**optimal_planting_window** | [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] 
**climate_factors** | **object** |  | [optional] 
**soil_factors** | **object** |  | [optional] 
**recommendations** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.planting_calendar import PlantingCalendar

# TODO update the JSON string below
json = "{}"
# create an instance of PlantingCalendar from a JSON string
planting_calendar_instance = PlantingCalendar.from_json(json)
# print the JSON string representation of the object
print PlantingCalendar.to_json()

# convert the object into a dict
planting_calendar_dict = planting_calendar_instance.to_dict()
# create an instance of PlantingCalendar from a dict
planting_calendar_form_dict = planting_calendar.from_dict(planting_calendar_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


