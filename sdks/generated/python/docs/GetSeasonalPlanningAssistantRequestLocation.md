# GetSeasonalPlanningAssistantRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 
**county_name** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.get_seasonal_planning_assistant_request_location import GetSeasonalPlanningAssistantRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of GetSeasonalPlanningAssistantRequestLocation from a JSON string
get_seasonal_planning_assistant_request_location_instance = GetSeasonalPlanningAssistantRequestLocation.from_json(json)
# print the JSON string representation of the object
print(GetSeasonalPlanningAssistantRequestLocation.to_json())

# convert the object into a dict
get_seasonal_planning_assistant_request_location_dict = get_seasonal_planning_assistant_request_location_instance.to_dict()
# create an instance of GetSeasonalPlanningAssistantRequestLocation from a dict
get_seasonal_planning_assistant_request_location_from_dict = GetSeasonalPlanningAssistantRequestLocation.from_dict(get_seasonal_planning_assistant_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


