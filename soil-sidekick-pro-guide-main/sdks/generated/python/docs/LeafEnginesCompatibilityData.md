# LeafEnginesCompatibilityData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**overall_score** | **float** | Overall compatibility score (0-100) | [optional] 
**soil_compatibility** | **float** |  | [optional] 
**water_compatibility** | **float** |  | [optional] 
**climate_compatibility** | **float** |  | [optional] 
**breakdown** | [**LeafEnginesCompatibilityDataBreakdown**](LeafEnginesCompatibilityDataBreakdown.md) |  | [optional] 
**recommendations** | **List[str]** |  | [optional] 
**risk_level** | **str** |  | [optional] 
**metadata** | [**LeafEnginesCompatibilityDataMetadata**](LeafEnginesCompatibilityDataMetadata.md) |  | [optional] 

## Example

```python
from soilsidekick.models.leaf_engines_compatibility_data import LeafEnginesCompatibilityData

# TODO update the JSON string below
json = "{}"
# create an instance of LeafEnginesCompatibilityData from a JSON string
leaf_engines_compatibility_data_instance = LeafEnginesCompatibilityData.from_json(json)
# print the JSON string representation of the object
print LeafEnginesCompatibilityData.to_json()

# convert the object into a dict
leaf_engines_compatibility_data_dict = leaf_engines_compatibility_data_instance.to_dict()
# create an instance of LeafEnginesCompatibilityData from a dict
leaf_engines_compatibility_data_form_dict = leaf_engines_compatibility_data.from_dict(leaf_engines_compatibility_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


