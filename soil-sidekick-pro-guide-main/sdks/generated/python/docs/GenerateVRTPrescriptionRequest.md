# GenerateVRTPrescriptionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field_id** | **str** |  | 
**application_type** | **str** |  | 
**soil_analysis_id** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.generate_vrt_prescription_request import GenerateVRTPrescriptionRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GenerateVRTPrescriptionRequest from a JSON string
generate_vrt_prescription_request_instance = GenerateVRTPrescriptionRequest.from_json(json)
# print the JSON string representation of the object
print GenerateVRTPrescriptionRequest.to_json()

# convert the object into a dict
generate_vrt_prescription_request_dict = generate_vrt_prescription_request_instance.to_dict()
# create an instance of GenerateVRTPrescriptionRequest from a dict
generate_vrt_prescription_request_form_dict = generate_vrt_prescription_request.from_dict(generate_vrt_prescription_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


