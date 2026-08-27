# LeafEnginesCompatibilityDataBreakdown


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**soil** | [**LeafEnginesCompatibilityDataBreakdownSoil**](LeafEnginesCompatibilityDataBreakdownSoil.md) |  | [optional] 
**water** | **object** |  | [optional] 
**climate** | **object** |  | [optional] 

## Example

```python
from soilsidekick.models.leaf_engines_compatibility_data_breakdown import LeafEnginesCompatibilityDataBreakdown

# TODO update the JSON string below
json = "{}"
# create an instance of LeafEnginesCompatibilityDataBreakdown from a JSON string
leaf_engines_compatibility_data_breakdown_instance = LeafEnginesCompatibilityDataBreakdown.from_json(json)
# print the JSON string representation of the object
print LeafEnginesCompatibilityDataBreakdown.to_json()

# convert the object into a dict
leaf_engines_compatibility_data_breakdown_dict = leaf_engines_compatibility_data_breakdown_instance.to_dict()
# create an instance of LeafEnginesCompatibilityDataBreakdown from a dict
leaf_engines_compatibility_data_breakdown_form_dict = leaf_engines_compatibility_data_breakdown.from_dict(leaf_engines_compatibility_data_breakdown_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


