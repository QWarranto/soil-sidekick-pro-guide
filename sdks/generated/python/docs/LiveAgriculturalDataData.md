# LiveAgriculturalDataData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**weather** | **object** |  | [optional] 
**soil** | **object** |  | [optional] 
**crop** | **object** |  | [optional] 
**environmental** | **object** |  | [optional] 

## Example

```python
from soilsidekick.models.live_agricultural_data_data import LiveAgriculturalDataData

# TODO update the JSON string below
json = "{}"
# create an instance of LiveAgriculturalDataData from a JSON string
live_agricultural_data_data_instance = LiveAgriculturalDataData.from_json(json)
# print the JSON string representation of the object
print(LiveAgriculturalDataData.to_json())

# convert the object into a dict
live_agricultural_data_data_dict = live_agricultural_data_data_instance.to_dict()
# create an instance of LiveAgriculturalDataData from a dict
live_agricultural_data_data_from_dict = LiveAgriculturalDataData.from_dict(live_agricultural_data_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


