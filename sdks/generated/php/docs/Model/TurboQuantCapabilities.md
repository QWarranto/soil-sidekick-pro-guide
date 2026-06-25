# TurboQuantCapabilities

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**supported** | **bool** | Whether TurboQuant is supported on this device | [optional]
**recommended_model** | **string** | Recommended model for the device | [optional]
**max_context_tokens** | **int** | Maximum context window feasible on this device | [optional]
**estimated_kv_cache_gb** | **float** | Estimated KV cache size in GB | [optional]
**kv_compression_ratio** | **string** | Compression ratio vs 16-bit baseline | [optional]
**estimated_latency_ms** | [**\SoilSidekick\Model\TurboQuantCapabilitiesEstimatedLatencyMs**](TurboQuantCapabilitiesEstimatedLatencyMs.md) |  | [optional]
**runtime_tier** | **string** | Detected or recommended runtime | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
