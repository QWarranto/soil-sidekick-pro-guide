# SoilSidekick::TurboQuantCapabilities

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **supported** | **Boolean** | Whether TurboQuant is supported on this device | [optional] |
| **recommended_model** | **String** | Recommended model for the device | [optional] |
| **max_context_tokens** | **Integer** | Maximum context window feasible on this device | [optional] |
| **estimated_kv_cache_gb** | **Float** | Estimated KV cache size in GB | [optional] |
| **kv_compression_ratio** | **String** | Compression ratio vs 16-bit baseline | [optional] |
| **estimated_latency_ms** | [**TurboQuantCapabilitiesEstimatedLatencyMs**](TurboQuantCapabilitiesEstimatedLatencyMs.md) |  | [optional] |
| **runtime_tier** | **String** | Detected or recommended runtime | [optional] |

## Example

```ruby
require 'soilsidekick'

instance = SoilSidekick::TurboQuantCapabilities.new(
  supported: null,
  recommended_model: null,
  max_context_tokens: 24576,
  estimated_kv_cache_gb: 1.3,
  kv_compression_ratio: 5.3x,
  estimated_latency_ms: null,
  runtime_tier: null
)
```

