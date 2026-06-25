# TurboQuantCapabilities


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**supported** | **bool** | Whether TurboQuant is supported on this device | [optional] 
**recommended_model** | **str** | Recommended model for the device | [optional] 
**max_context_tokens** | **int** | Maximum context window feasible on this device | [optional] 
**estimated_kv_cache_gb** | **float** | Estimated KV cache size in GB | [optional] 
**kv_compression_ratio** | **str** | Compression ratio vs 16-bit baseline | [optional] 
**estimated_latency_ms** | [**TurboQuantCapabilitiesEstimatedLatencyMs**](TurboQuantCapabilitiesEstimatedLatencyMs.md) |  | [optional] 
**runtime_tier** | **str** | Detected or recommended runtime | [optional] 

## Example

```python
from soilsidekick.models.turbo_quant_capabilities import TurboQuantCapabilities

# TODO update the JSON string below
json = "{}"
# create an instance of TurboQuantCapabilities from a JSON string
turbo_quant_capabilities_instance = TurboQuantCapabilities.from_json(json)
# print the JSON string representation of the object
print(TurboQuantCapabilities.to_json())

# convert the object into a dict
turbo_quant_capabilities_dict = turbo_quant_capabilities_instance.to_dict()
# create an instance of TurboQuantCapabilities from a dict
turbo_quant_capabilities_from_dict = TurboQuantCapabilities.from_dict(turbo_quant_capabilities_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


