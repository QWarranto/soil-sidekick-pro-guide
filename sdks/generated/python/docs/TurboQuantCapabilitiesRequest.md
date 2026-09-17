# TurboQuantCapabilitiesRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**device_memory_gb** | **float** | Device RAM in GB | [optional] 
**has_webgpu** | **bool** | Whether WebGPU is available | [optional] 
**platform** | **str** |  | [optional] 

## Example

```python
from soilsidekick.models.turbo_quant_capabilities_request import TurboQuantCapabilitiesRequest

# TODO update the JSON string below
json = "{}"
# create an instance of TurboQuantCapabilitiesRequest from a JSON string
turbo_quant_capabilities_request_instance = TurboQuantCapabilitiesRequest.from_json(json)
# print the JSON string representation of the object
print(TurboQuantCapabilitiesRequest.to_json())

# convert the object into a dict
turbo_quant_capabilities_request_dict = turbo_quant_capabilities_request_instance.to_dict()
# create an instance of TurboQuantCapabilitiesRequest from a dict
turbo_quant_capabilities_request_from_dict = TurboQuantCapabilitiesRequest.from_dict(turbo_quant_capabilities_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


