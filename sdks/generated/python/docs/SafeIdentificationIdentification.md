# SafeIdentificationIdentification


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**primary_match** | [**SafeIdentificationIdentificationPrimaryMatch**](SafeIdentificationIdentificationPrimaryMatch.md) |  | [optional] 
**environmental_probability** | **float** | Likelihood this plant exists in the given environment | [optional] 
**growth_stage_detected** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_identification import SafeIdentificationIdentification

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationIdentification from a JSON string
safe_identification_identification_instance = SafeIdentificationIdentification.from_json(json)
# print the JSON string representation of the object
print(SafeIdentificationIdentification.to_json())

# convert the object into a dict
safe_identification_identification_dict = safe_identification_identification_instance.to_dict()
# create an instance of SafeIdentificationIdentification from a dict
safe_identification_identification_from_dict = SafeIdentificationIdentification.from_dict(safe_identification_identification_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


