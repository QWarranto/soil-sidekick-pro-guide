# GetTerritorialWaterAnalyticsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**territory_type** | **str** | Type of territory to analyze | [optional] 
**epa_region** | **str** | EPA region identifier | [optional] 
**date_range** | [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] 

## Example

```python
from soilsidekick.models.get_territorial_water_analytics_request import GetTerritorialWaterAnalyticsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetTerritorialWaterAnalyticsRequest from a JSON string
get_territorial_water_analytics_request_instance = GetTerritorialWaterAnalyticsRequest.from_json(json)
# print the JSON string representation of the object
print(GetTerritorialWaterAnalyticsRequest.to_json())

# convert the object into a dict
get_territorial_water_analytics_request_dict = get_territorial_water_analytics_request_instance.to_dict()
# create an instance of GetTerritorialWaterAnalyticsRequest from a dict
get_territorial_water_analytics_request_from_dict = GetTerritorialWaterAnalyticsRequest.from_dict(get_territorial_water_analytics_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


