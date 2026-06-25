# SoilSidekick::LeafEnginesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**leafengines_query**](LeafEnginesApi.md#leafengines_query) | **POST** /leafengines-query | Query plant-environment compatibility |


## leafengines_query

> <LeafEnginesCompatibility> leafengines_query(leafengines_query_request, opts)

Query plant-environment compatibility

LeafEngines API for plant compatibility scoring with environmental factors

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

api_instance = SoilSidekick::LeafEnginesApi.new
leafengines_query_request = SoilSidekick::LeafenginesQueryRequest.new({location: SoilSidekick::LeafenginesQueryRequestLocation.new, plant: SoilSidekick::LeafenginesQueryRequestPlant.new}) # LeafenginesQueryRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Query plant-environment compatibility
  result = api_instance.leafengines_query(leafengines_query_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling LeafEnginesApi->leafengines_query: #{e}"
end
```

#### Using the leafengines_query_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<LeafEnginesCompatibility>, Integer, Hash)> leafengines_query_with_http_info(leafengines_query_request, opts)

```ruby
begin
  # Query plant-environment compatibility
  data, status_code, headers = api_instance.leafengines_query_with_http_info(leafengines_query_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <LeafEnginesCompatibility>
rescue SoilSidekick::ApiError => e
  puts "Error when calling LeafEnginesApi->leafengines_query_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **leafengines_query_request** | [**LeafenginesQueryRequest**](LeafenginesQueryRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**LeafEnginesCompatibility**](LeafEnginesCompatibility.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

