# SoilSidekick::EnvironmentalApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**calculate_environmental_impact**](EnvironmentalApi.md#calculate_environmental_impact) | **POST** /environmental-impact-engine | Calculate environmental impact |


## calculate_environmental_impact

> <EnvironmentalImpact> calculate_environmental_impact(calculate_environmental_impact_request, opts)

Calculate environmental impact

Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives

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

api_instance = SoilSidekick::EnvironmentalApi.new
calculate_environmental_impact_request = SoilSidekick::CalculateEnvironmentalImpactRequest.new({analysis_id: 'analysis_id_example', county_fips: 'county_fips_example', soil_data: SoilSidekick::CalculateEnvironmentalImpactRequestSoilData.new}) # CalculateEnvironmentalImpactRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Calculate environmental impact
  result = api_instance.calculate_environmental_impact(calculate_environmental_impact_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling EnvironmentalApi->calculate_environmental_impact: #{e}"
end
```

#### Using the calculate_environmental_impact_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<EnvironmentalImpact>, Integer, Hash)> calculate_environmental_impact_with_http_info(calculate_environmental_impact_request, opts)

```ruby
begin
  # Calculate environmental impact
  data, status_code, headers = api_instance.calculate_environmental_impact_with_http_info(calculate_environmental_impact_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <EnvironmentalImpact>
rescue SoilSidekick::ApiError => e
  puts "Error when calling EnvironmentalApi->calculate_environmental_impact_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **calculate_environmental_impact_request** | [**CalculateEnvironmentalImpactRequest**](CalculateEnvironmentalImpactRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**EnvironmentalImpact**](EnvironmentalImpact.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

