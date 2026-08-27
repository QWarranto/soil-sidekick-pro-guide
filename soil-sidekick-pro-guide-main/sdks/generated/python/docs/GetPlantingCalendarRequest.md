# GetPlantingCalendarRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | 
**crop_type** | **str** |  | 

## Example

```python
from soilsidekick.models.get_planting_calendar_request import GetPlantingCalendarRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetPlantingCalendarRequest from a JSON string
get_planting_calendar_request_instance = GetPlantingCalendarRequest.from_json(json)
# print the JSON string representation of the object
print GetPlantingCalendarRequest.to_json()

# convert the object into a dict
get_planting_calendar_request_dict = get_planting_calendar_request_instance.to_dict()
# create an instance of GetPlantingCalendarRequest from a dict
get_planting_calendar_request_form_dict = get_planting_calendar_request.from_dict(get_planting_calendar_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


