# County


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **UUID** |  | [optional] 
**county_name** | **str** |  | [optional] 
**state_name** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 
**fips_code** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.county import County

# TODO update the JSON string below
json = "{}"
# create an instance of County from a JSON string
county_instance = County.from_json(json)
# print the JSON string representation of the object
print(County.to_json())

# convert the object into a dict
county_dict = county_instance.to_dict()
# create an instance of County from a dict
county_from_dict = County.from_dict(county_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


