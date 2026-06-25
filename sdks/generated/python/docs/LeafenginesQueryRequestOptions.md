# LeafenginesQueryRequestOptions


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**include_satellite_data** | **bool** |  | [optional] 
**include_water_quality** | **bool** |  | [optional] 
**include_recommendations** | **bool** |  | [optional] 

## Example

```python
from soilsidekick.models.leafengines_query_request_options import LeafenginesQueryRequestOptions

# TODO update the JSON string below
json = "{}"
# create an instance of LeafenginesQueryRequestOptions from a JSON string
leafengines_query_request_options_instance = LeafenginesQueryRequestOptions.from_json(json)
# print the JSON string representation of the object
print(LeafenginesQueryRequestOptions.to_json())

# convert the object into a dict
leafengines_query_request_options_dict = leafengines_query_request_options_instance.to_dict()
# create an instance of LeafenginesQueryRequestOptions from a dict
leafengines_query_request_options_from_dict = LeafenginesQueryRequestOptions.from_dict(leafengines_query_request_options_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


