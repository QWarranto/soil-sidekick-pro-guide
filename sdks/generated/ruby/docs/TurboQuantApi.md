# SoilSidekick::TurboQuantApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**turbo_quant_capabilities**](TurboQuantApi.md#turbo_quant_capabilities) | **POST** /turbo-quant-capabilities | Query TurboQuant device capabilities |


## turbo_quant_capabilities

> <TurboQuantCapabilities> turbo_quant_capabilities(turbo_quant_capabilities_request, opts)

Query TurboQuant device capabilities

Returns hardware-specific model recommendations and estimated performance based on detected device capabilities. Use this to determine the optimal local inference configuration for the end-user's device.  **Tier requirement:** Pro or Enterprise 

### Examples

```ruby
require 'time'
require 'soilsidekick'
# setup authorization
SoilSidekick.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['x-api-key'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['x-api-key'] = 'Bearer'
end

api_instance = SoilSidekick::TurboQuantApi.new
turbo_quant_capabilities_request = SoilSidekick::TurboQuantCapabilitiesRequest.new # TurboQuantCapabilitiesRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Query TurboQuant device capabilities
  result = api_instance.turbo_quant_capabilities(turbo_quant_capabilities_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling TurboQuantApi->turbo_quant_capabilities: #{e}"
end
```

#### Using the turbo_quant_capabilities_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<TurboQuantCapabilities>, Integer, Hash)> turbo_quant_capabilities_with_http_info(turbo_quant_capabilities_request, opts)

```ruby
begin
  # Query TurboQuant device capabilities
  data, status_code, headers = api_instance.turbo_quant_capabilities_with_http_info(turbo_quant_capabilities_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <TurboQuantCapabilities>
rescue SoilSidekick::ApiError => e
  puts "Error when calling TurboQuantApi->turbo_quant_capabilities_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **turbo_quant_capabilities_request** | [**TurboQuantCapabilitiesRequest**](TurboQuantCapabilitiesRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**TurboQuantCapabilities**](TurboQuantCapabilities.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

