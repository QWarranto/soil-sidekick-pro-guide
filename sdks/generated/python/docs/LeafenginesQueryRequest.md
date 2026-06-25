# LeafenginesQueryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**location** | [**LeafenginesQueryRequestLocation**](LeafenginesQueryRequestLocation.md) |  | 
**plant** | [**LeafenginesQueryRequestPlant**](LeafenginesQueryRequestPlant.md) |  | 
**options** | [**LeafenginesQueryRequestOptions**](LeafenginesQueryRequestOptions.md) |  | [optional] 

## Example

```python
from soilsidekick.models.leafengines_query_request import LeafenginesQueryRequest

# TODO update the JSON string below
json = "{}"
# create an instance of LeafenginesQueryRequest from a JSON string
leafengines_query_request_instance = LeafenginesQueryRequest.from_json(json)
# print the JSON string representation of the object
print(LeafenginesQueryRequest.to_json())

# convert the object into a dict
leafengines_query_request_dict = leafengines_query_request_instance.to_dict()
# create an instance of LeafenginesQueryRequest from a dict
leafengines_query_request_from_dict = LeafenginesQueryRequest.from_dict(leafengines_query_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


