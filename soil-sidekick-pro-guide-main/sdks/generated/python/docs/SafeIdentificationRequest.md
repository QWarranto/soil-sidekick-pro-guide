# SafeIdentificationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**image** | **str** | Base64 encoded image or image URL | 
**location** | [**SafeIdentificationRequestLocation**](SafeIdentificationRequestLocation.md) |  | [optional] 
**context** | [**SafeIdentificationRequestContext**](SafeIdentificationRequestContext.md) |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_request import SafeIdentificationRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationRequest from a JSON string
safe_identification_request_instance = SafeIdentificationRequest.from_json(json)
# print the JSON string representation of the object
print SafeIdentificationRequest.to_json()

# convert the object into a dict
safe_identification_request_dict = safe_identification_request_instance.to_dict()
# create an instance of SafeIdentificationRequest from a dict
safe_identification_request_form_dict = safe_identification_request.from_dict(safe_identification_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


