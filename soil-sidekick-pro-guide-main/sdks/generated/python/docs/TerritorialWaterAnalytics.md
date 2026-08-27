# TerritorialWaterAnalytics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**analytics** | [**TerritorialWaterAnalyticsAnalytics**](TerritorialWaterAnalyticsAnalytics.md) |  | [optional] 
**generated_at** | **datetime** |  | [optional] 

## Example

```python
from soilsidekick.models.territorial_water_analytics import TerritorialWaterAnalytics

# TODO update the JSON string below
json = "{}"
# create an instance of TerritorialWaterAnalytics from a JSON string
territorial_water_analytics_instance = TerritorialWaterAnalytics.from_json(json)
# print the JSON string representation of the object
print TerritorialWaterAnalytics.to_json()

# convert the object into a dict
territorial_water_analytics_dict = territorial_water_analytics_instance.to_dict()
# create an instance of TerritorialWaterAnalytics from a dict
territorial_water_analytics_form_dict = territorial_water_analytics.from_dict(territorial_water_analytics_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


