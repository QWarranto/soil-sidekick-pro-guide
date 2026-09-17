# SafeIdentificationMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**analysis_id** | **UUID** |  | [optional] 
**timestamp** | **datetime** |  | [optional] 
**environmental_data_used** | **List[str]** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_metadata import SafeIdentificationMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationMetadata from a JSON string
safe_identification_metadata_instance = SafeIdentificationMetadata.from_json(json)
# print the JSON string representation of the object
print(SafeIdentificationMetadata.to_json())

# convert the object into a dict
safe_identification_metadata_dict = safe_identification_metadata_instance.to_dict()
# create an instance of SafeIdentificationMetadata from a dict
safe_identification_metadata_from_dict = SafeIdentificationMetadata.from_dict(safe_identification_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


