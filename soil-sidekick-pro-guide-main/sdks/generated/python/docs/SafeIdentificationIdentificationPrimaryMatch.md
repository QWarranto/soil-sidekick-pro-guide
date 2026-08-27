# SafeIdentificationIdentificationPrimaryMatch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**common_name** | **str** |  | [optional] 
**scientific_name** | **str** |  | [optional] 
**confidence** | **float** | Confidence percentage (0-100) | [optional] 
**family** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_identification_primary_match import SafeIdentificationIdentificationPrimaryMatch

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationIdentificationPrimaryMatch from a JSON string
safe_identification_identification_primary_match_instance = SafeIdentificationIdentificationPrimaryMatch.from_json(json)
# print the JSON string representation of the object
print SafeIdentificationIdentificationPrimaryMatch.to_json()

# convert the object into a dict
safe_identification_identification_primary_match_dict = safe_identification_identification_primary_match_instance.to_dict()
# create an instance of SafeIdentificationIdentificationPrimaryMatch from a dict
safe_identification_identification_primary_match_form_dict = safe_identification_identification_primary_match.from_dict(safe_identification_identification_primary_match_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


