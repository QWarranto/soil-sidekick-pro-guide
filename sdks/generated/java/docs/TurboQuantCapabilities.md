

# TurboQuantCapabilities


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**supported** | **Boolean** | Whether TurboQuant is supported on this device |  [optional] |
|**recommendedModel** | [**RecommendedModelEnum**](#RecommendedModelEnum) | Recommended model for the device |  [optional] |
|**maxContextTokens** | **Integer** | Maximum context window feasible on this device |  [optional] |
|**estimatedKvCacheGb** | **BigDecimal** | Estimated KV cache size in GB |  [optional] |
|**kvCompressionRatio** | **String** | Compression ratio vs 16-bit baseline |  [optional] |
|**estimatedLatencyMs** | [**TurboQuantCapabilitiesEstimatedLatencyMs**](TurboQuantCapabilitiesEstimatedLatencyMs.md) |  |  [optional] |
|**runtimeTier** | [**RuntimeTierEnum**](#RuntimeTierEnum) | Detected or recommended runtime |  [optional] |



## Enum: RecommendedModelEnum

| Name | Value |
|---- | -----|
| GEMMA_2B | &quot;gemma-2b&quot; |
| GEMMA_7B | &quot;gemma-7b&quot; |
| GEMMA_7B_TQ | &quot;gemma-7b-tq&quot; |



## Enum: RuntimeTierEnum

| Name | Value |
|---- | -----|
| WEBGPU | &quot;webgpu&quot; |
| WASM_TQ | &quot;wasm_tq&quot; |
| WASM_STANDARD | &quot;wasm_standard&quot; |
| CLOUD_FALLBACK | &quot;cloud_fallback&quot; |



