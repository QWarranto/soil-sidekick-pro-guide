# LeafEnginesCompatibilityDataMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**location** | **str** |  | [optional] 
**timestamp** | **datetime** |  | [optional] 
**data_sources** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.leaf_engines_compatibility_data_metadata import LeafEnginesCompatibilityDataMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of LeafEnginesCompatibilityDataMetadata from a JSON string
leaf_engines_compatibility_data_metadata_instance = LeafEnginesCompatibilityDataMetadata.from_json(json)
# print the JSON string representation of the object
print LeafEnginesCompatibilityDataMetadata.to_json()

# convert the object into a dict
leaf_engines_compatibility_data_metadata_dict = leaf_engines_compatibility_data_metadata_instance.to_dict()
# create an instance of LeafEnginesCompatibilityDataMetadata from a dict
leaf_engines_compatibility_data_metadata_form_dict = leaf_engines_compatibility_data_metadata.from_dict(leaf_engines_compatibility_data_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


