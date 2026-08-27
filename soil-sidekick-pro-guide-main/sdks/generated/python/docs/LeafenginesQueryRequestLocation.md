# LeafenginesQueryRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**latitude** | **float** |  | [optional] 
**longitude** | **float** |  | [optional] 
**address** | **str** |  | [optional] 
**county_fips** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.leafengines_query_request_location import LeafenginesQueryRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of LeafenginesQueryRequestLocation from a JSON string
leafengines_query_request_location_instance = LeafenginesQueryRequestLocation.from_json(json)
# print the JSON string representation of the object
print LeafenginesQueryRequestLocation.to_json()

# convert the object into a dict
leafengines_query_request_location_dict = leafengines_query_request_location_instance.to_dict()
# create an instance of LeafenginesQueryRequestLocation from a dict
leafengines_query_request_location_form_dict = leafengines_query_request_location.from_dict(leafengines_query_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


