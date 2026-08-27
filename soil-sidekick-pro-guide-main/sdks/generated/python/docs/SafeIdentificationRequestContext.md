# SafeIdentificationRequestContext


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**environment** | **str** |  | [optional] 
**purpose** | **str** |  | [optional] 
**growth_stage** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_request_context import SafeIdentificationRequestContext

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationRequestContext from a JSON string
safe_identification_request_context_instance = SafeIdentificationRequestContext.from_json(json)
# print the JSON string representation of the object
print SafeIdentificationRequestContext.to_json()

# convert the object into a dict
safe_identification_request_context_dict = safe_identification_request_context_instance.to_dict()
# create an instance of SafeIdentificationRequestContext from a dict
safe_identification_request_context_form_dict = safe_identification_request_context.from_dict(safe_identification_request_context_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


