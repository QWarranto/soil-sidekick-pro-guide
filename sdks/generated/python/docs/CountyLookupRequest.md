# CountyLookupRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**term** | **str** | Search term (county name, state, or FIPS) | 

## Example

```python
from soilsidekick.models.county_lookup_request import CountyLookupRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CountyLookupRequest from a JSON string
county_lookup_request_instance = CountyLookupRequest.from_json(json)
# print the JSON string representation of the object
print(CountyLookupRequest.to_json())

# convert the object into a dict
county_lookup_request_dict = county_lookup_request_instance.to_dict()
# create an instance of CountyLookupRequest from a dict
county_lookup_request_from_dict = CountyLookupRequest.from_dict(county_lookup_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


