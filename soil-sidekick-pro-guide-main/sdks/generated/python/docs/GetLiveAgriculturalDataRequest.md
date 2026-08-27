# GetLiveAgriculturalDataRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | 
**data_types** | **List[str]** | Types of data to fetch | 
**state_code** | **str** |  | 
**county_name** | **str** |  | 

## Example

```python
from soilsidekick.models.get_live_agricultural_data_request import GetLiveAgriculturalDataRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetLiveAgriculturalDataRequest from a JSON string
get_live_agricultural_data_request_instance = GetLiveAgriculturalDataRequest.from_json(json)
# print the JSON string representation of the object
print GetLiveAgriculturalDataRequest.to_json()

# convert the object into a dict
get_live_agricultural_data_request_dict = get_live_agricultural_data_request_instance.to_dict()
# create an instance of GetLiveAgriculturalDataRequest from a dict
get_live_agricultural_data_request_form_dict = get_live_agricultural_data_request.from_dict(get_live_agricultural_data_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


