# LeafEnginesCompatibilityUsage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**credits_used** | **int** |  | [optional] 
**response_time_ms** | **int** |  | [optional] 

## Example

```python
from soilsidekick.models.leaf_engines_compatibility_usage import LeafEnginesCompatibilityUsage

# TODO update the JSON string below
json = "{}"
# create an instance of LeafEnginesCompatibilityUsage from a JSON string
leaf_engines_compatibility_usage_instance = LeafEnginesCompatibilityUsage.from_json(json)
# print the JSON string representation of the object
print(LeafEnginesCompatibilityUsage.to_json())

# convert the object into a dict
leaf_engines_compatibility_usage_dict = leaf_engines_compatibility_usage_instance.to_dict()
# create an instance of LeafEnginesCompatibilityUsage from a dict
leaf_engines_compatibility_usage_from_dict = LeafEnginesCompatibilityUsage.from_dict(leaf_engines_compatibility_usage_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


