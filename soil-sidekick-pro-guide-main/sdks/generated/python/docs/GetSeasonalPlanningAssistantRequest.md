# GetSeasonalPlanningAssistantRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**location** | [**GetSeasonalPlanningAssistantRequestLocation**](GetSeasonalPlanningAssistantRequestLocation.md) |  | 
**soil_data** | **object** | Optional soil data for enhanced recommendations | [optional] 
**planning_type** | **str** |  | 
**crop_preferences** | **List[str]** |  | [optional] 
**timeframe** | **str** | Planning timeframe (e.g., \&quot;3 months\&quot;, \&quot;1 year\&quot;) | [optional] 

## Example

```python
from soilsidekick.models.get_seasonal_planning_assistant_request import GetSeasonalPlanningAssistantRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetSeasonalPlanningAssistantRequest from a JSON string
get_seasonal_planning_assistant_request_instance = GetSeasonalPlanningAssistantRequest.from_json(json)
# print the JSON string representation of the object
print GetSeasonalPlanningAssistantRequest.to_json()

# convert the object into a dict
get_seasonal_planning_assistant_request_dict = get_seasonal_planning_assistant_request_instance.to_dict()
# create an instance of GetSeasonalPlanningAssistantRequest from a dict
get_seasonal_planning_assistant_request_form_dict = get_seasonal_planning_assistant_request.from_dict(get_seasonal_planning_assistant_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


