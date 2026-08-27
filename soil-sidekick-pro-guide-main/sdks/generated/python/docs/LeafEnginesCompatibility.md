# LeafEnginesCompatibility


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**data** | [**LeafEnginesCompatibilityData**](LeafEnginesCompatibilityData.md) |  | [optional] 
**usage** | [**LeafEnginesCompatibilityUsage**](LeafEnginesCompatibilityUsage.md) |  | [optional] 

## Example

```python
from soilsidekick.models.leaf_engines_compatibility import LeafEnginesCompatibility

# TODO update the JSON string below
json = "{}"
# create an instance of LeafEnginesCompatibility from a JSON string
leaf_engines_compatibility_instance = LeafEnginesCompatibility.from_json(json)
# print the JSON string representation of the object
print LeafEnginesCompatibility.to_json()

# convert the object into a dict
leaf_engines_compatibility_dict = leaf_engines_compatibility_instance.to_dict()
# create an instance of LeafEnginesCompatibility from a dict
leaf_engines_compatibility_form_dict = leaf_engines_compatibility.from_dict(leaf_engines_compatibility_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


