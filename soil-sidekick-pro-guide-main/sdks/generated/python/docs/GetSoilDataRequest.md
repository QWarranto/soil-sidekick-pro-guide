# GetSoilDataRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** | 5-digit FIPS code | 

## Example

```python
from soilsidekick.models.get_soil_data_request import GetSoilDataRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetSoilDataRequest from a JSON string
get_soil_data_request_instance = GetSoilDataRequest.from_json(json)
# print the JSON string representation of the object
print GetSoilDataRequest.to_json()

# convert the object into a dict
get_soil_data_request_dict = get_soil_data_request_instance.to_dict()
# create an instance of GetSoilDataRequest from a dict
get_soil_data_request_form_dict = get_soil_data_request.from_dict(get_soil_data_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


