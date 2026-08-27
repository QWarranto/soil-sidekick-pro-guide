# GetSatelliteDataRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**latitude** | **float** |  | 
**longitude** | **float** |  | 

## Example

```python
from soilsidekick.models.get_satellite_data_request import GetSatelliteDataRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetSatelliteDataRequest from a JSON string
get_satellite_data_request_instance = GetSatelliteDataRequest.from_json(json)
# print the JSON string representation of the object
print GetSatelliteDataRequest.to_json()

# convert the object into a dict
get_satellite_data_request_dict = get_satellite_data_request_instance.to_dict()
# create an instance of GetSatelliteDataRequest from a dict
get_satellite_data_request_form_dict = get_satellite_data_request.from_dict(get_satellite_data_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


