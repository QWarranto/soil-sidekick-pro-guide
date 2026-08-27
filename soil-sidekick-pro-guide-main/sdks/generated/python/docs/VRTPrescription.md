# VRTPrescription


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | [optional] 
**field_id** | **str** |  | [optional] 
**application_type** | **str** |  | [optional] 
**zones** | [**List[VRTPrescriptionZonesInner]**](VRTPrescriptionZonesInner.md) |  | [optional] 

## Example

```python
from soilsidekick.models.vrt_prescription import VRTPrescription

# TODO update the JSON string below
json = "{}"
# create an instance of VRTPrescription from a JSON string
vrt_prescription_instance = VRTPrescription.from_json(json)
# print the JSON string representation of the object
print VRTPrescription.to_json()

# convert the object into a dict
vrt_prescription_dict = vrt_prescription_instance.to_dict()
# create an instance of VRTPrescription from a dict
vrt_prescription_form_dict = vrt_prescription.from_dict(vrt_prescription_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


