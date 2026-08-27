# LiveAgriculturalData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**county_name** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 
**data** | [**LiveAgriculturalDataData**](LiveAgriculturalDataData.md) |  | [optional] 
**sources** | **List[str]** |  | [optional] 
**timestamp** | **datetime** |  | [optional] 
**cache_status** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.live_agricultural_data import LiveAgriculturalData

# TODO update the JSON string below
json = "{}"
# create an instance of LiveAgriculturalData from a JSON string
live_agricultural_data_instance = LiveAgriculturalData.from_json(json)
# print the JSON string representation of the object
print LiveAgriculturalData.to_json()

# convert the object into a dict
live_agricultural_data_dict = live_agricultural_data_instance.to_dict()
# create an instance of LiveAgriculturalData from a dict
live_agricultural_data_form_dict = live_agricultural_data.from_dict(live_agricultural_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


