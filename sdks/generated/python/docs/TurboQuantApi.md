# soilsidekick.TurboQuantApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**turbo_quant_capabilities**](TurboQuantApi.md#turbo_quant_capabilities) | **POST** /turbo-quant-capabilities | Query TurboQuant device capabilities


# **turbo_quant_capabilities**
> TurboQuantCapabilities turbo_quant_capabilities(turbo_quant_capabilities_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Query TurboQuant device capabilities

Returns hardware-specific model recommendations and estimated performance
based on detected device capabilities. Use this to determine the optimal
local inference configuration for the end-user's device.

**Tier requirement:** Pro or Enterprise


### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.turbo_quant_capabilities import TurboQuantCapabilities
from soilsidekick.models.turbo_quant_capabilities_request import TurboQuantCapabilitiesRequest
from soilsidekick.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1
# See configuration.py for a list of all supported configuration parameters.
configuration = soilsidekick.Configuration(
    host = "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: ApiKeyAuth
configuration.api_key['ApiKeyAuth'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['ApiKeyAuth'] = 'Bearer'

# Enter a context with an instance of the API client
with soilsidekick.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = soilsidekick.TurboQuantApi(api_client)
    turbo_quant_capabilities_request = soilsidekick.TurboQuantCapabilitiesRequest() # TurboQuantCapabilitiesRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Query TurboQuant device capabilities
        api_response = api_instance.turbo_quant_capabilities(turbo_quant_capabilities_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of TurboQuantApi->turbo_quant_capabilities:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TurboQuantApi->turbo_quant_capabilities: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **turbo_quant_capabilities_request** | [**TurboQuantCapabilitiesRequest**](TurboQuantCapabilitiesRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**TurboQuantCapabilities**](TurboQuantCapabilities.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | TurboQuant capability assessment |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

