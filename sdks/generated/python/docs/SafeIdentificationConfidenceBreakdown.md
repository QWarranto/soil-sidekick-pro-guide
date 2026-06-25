# SafeIdentificationConfidenceBreakdown


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**visual_match** | **float** |  | [optional] 
**environmental_context** | **float** |  | [optional] 
**regional_prevalence** | **float** |  | [optional] 
**growth_stage_alignment** | **float** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_confidence_breakdown import SafeIdentificationConfidenceBreakdown

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationConfidenceBreakdown from a JSON string
safe_identification_confidence_breakdown_instance = SafeIdentificationConfidenceBreakdown.from_json(json)
# print the JSON string representation of the object
print(SafeIdentificationConfidenceBreakdown.to_json())

# convert the object into a dict
safe_identification_confidence_breakdown_dict = safe_identification_confidence_breakdown_instance.to_dict()
# create an instance of SafeIdentificationConfidenceBreakdown from a dict
safe_identification_confidence_breakdown_from_dict = SafeIdentificationConfidenceBreakdown.from_dict(safe_identification_confidence_breakdown_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


