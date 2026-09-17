# DynamicCareMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**location_data_used** | **bool** |  | [optional] 
**weather_data_freshness** | **str** |  | [optional] 
**confidence** | **float** |  | [optional] 

## Example

```python
from soilsidekick.models.dynamic_care_metadata import DynamicCareMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of DynamicCareMetadata from a JSON string
dynamic_care_metadata_instance = DynamicCareMetadata.from_json(json)
# print the JSON string representation of the object
print(DynamicCareMetadata.to_json())

# convert the object into a dict
dynamic_care_metadata_dict = dynamic_care_metadata_instance.to_dict()
# create an instance of DynamicCareMetadata from a dict
dynamic_care_metadata_from_dict = DynamicCareMetadata.from_dict(dynamic_care_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


