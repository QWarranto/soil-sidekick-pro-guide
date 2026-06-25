# SatelliteData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ndvi** | **float** | Normalized Difference Vegetation Index | [optional] 
**evi** | **float** | Enhanced Vegetation Index | [optional] 
**soil_moisture** | **float** |  | [optional] 
**temperature** | **float** |  | [optional] 
**cloud_cover** | **float** |  | [optional] 

## Example

```python
from soilsidekick.models.satellite_data import SatelliteData

# TODO update the JSON string below
json = "{}"
# create an instance of SatelliteData from a JSON string
satellite_data_instance = SatelliteData.from_json(json)
# print the JSON string representation of the object
print(SatelliteData.to_json())

# convert the object into a dict
satellite_data_dict = satellite_data_instance.to_dict()
# create an instance of SatelliteData from a dict
satellite_data_from_dict = SatelliteData.from_dict(satellite_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


