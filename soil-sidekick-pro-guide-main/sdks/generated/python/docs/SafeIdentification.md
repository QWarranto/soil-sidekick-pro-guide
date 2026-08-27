# SafeIdentification

Safe plant identification response with toxic lookalike analysis

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | [optional] 
**identification** | [**SafeIdentificationIdentification**](SafeIdentificationIdentification.md) |  | [optional] 
**safety_analysis** | [**SafeIdentificationSafetyAnalysis**](SafeIdentificationSafetyAnalysis.md) |  | [optional] 
**confidence_breakdown** | [**SafeIdentificationConfidenceBreakdown**](SafeIdentificationConfidenceBreakdown.md) |  | [optional] 
**metadata** | [**SafeIdentificationMetadata**](SafeIdentificationMetadata.md) |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification import SafeIdentification

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentification from a JSON string
safe_identification_instance = SafeIdentification.from_json(json)
# print the JSON string representation of the object
print SafeIdentification.to_json()

# convert the object into a dict
safe_identification_dict = safe_identification_instance.to_dict()
# create an instance of SafeIdentification from a dict
safe_identification_form_dict = safe_identification.from_dict(safe_identification_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


