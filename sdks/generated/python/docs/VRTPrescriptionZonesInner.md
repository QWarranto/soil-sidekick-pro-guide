# VRTPrescriptionZonesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**zone_id** | **int** |  | [optional] 
**application_rate** | **float** |  | [optional] 
**geometry** | **object** |  | [optional] 

## Example

```python
from soilsidekick.models.vrt_prescription_zones_inner import VRTPrescriptionZonesInner

# TODO update the JSON string below
json = "{}"
# create an instance of VRTPrescriptionZonesInner from a JSON string
vrt_prescription_zones_inner_instance = VRTPrescriptionZonesInner.from_json(json)
# print the JSON string representation of the object
print(VRTPrescriptionZonesInner.to_json())

# convert the object into a dict
vrt_prescription_zones_inner_dict = vrt_prescription_zones_inner_instance.to_dict()
# create an instance of VRTPrescriptionZonesInner from a dict
vrt_prescription_zones_inner_from_dict = VRTPrescriptionZonesInner.from_dict(vrt_prescription_zones_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


