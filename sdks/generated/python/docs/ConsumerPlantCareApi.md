# soilsidekick.ConsumerPlantCareApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**beginner_guidance**](ConsumerPlantCareApi.md#beginner_guidance) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon
[**dynamic_care**](ConsumerPlantCareApi.md#dynamic_care) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations
[**safe_identification**](ConsumerPlantCareApi.md#safe_identification) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings


# **beginner_guidance**
> BeginnerGuidance beginner_guidance(beginner_guidance_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Beginner-friendly plant guidance without jargon

Judgment-free, accessible plant guidance that solves community gatekeeping issues.
This endpoint:
- Translates scientific jargon into plain language
- Never makes users feel stupid for asking about common plants
- Uses progressive disclosure (simple answer first, details on request)
- Provides encouraging, supportive tone
- Offers practical "what do I do right now" guidance


### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.beginner_guidance import BeginnerGuidance
from soilsidekick.models.beginner_guidance_request import BeginnerGuidanceRequest
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
    api_instance = soilsidekick.ConsumerPlantCareApi(api_client)
    beginner_guidance_request = soilsidekick.BeginnerGuidanceRequest() # BeginnerGuidanceRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Beginner-friendly plant guidance without jargon
        api_response = api_instance.beginner_guidance(beginner_guidance_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of ConsumerPlantCareApi->beginner_guidance:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ConsumerPlantCareApi->beginner_guidance: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **beginner_guidance_request** | [**BeginnerGuidanceRequest**](BeginnerGuidanceRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**BeginnerGuidance**](BeginnerGuidance.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Beginner-friendly guidance response |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dynamic_care**
> DynamicCare dynamic_care(dynamic_care_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Hyper-localized dynamic plant care recommendations

Real-time, environment-aware care recommendations that solve the "generic advice" problem.
Unlike static "water every 7 days" recommendations, this endpoint:
- Adjusts watering based on current humidity, temperature, and recent rainfall
- Considers container type, soil composition, and drainage
- Factors in seasonal changes and indoor environment conditions
- Accounts for plant maturity and growth phase
- Provides actionable guidance, not rigid schedules


### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.dynamic_care import DynamicCare
from soilsidekick.models.dynamic_care_request import DynamicCareRequest
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
    api_instance = soilsidekick.ConsumerPlantCareApi(api_client)
    dynamic_care_request = soilsidekick.DynamicCareRequest() # DynamicCareRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Hyper-localized dynamic plant care recommendations
        api_response = api_instance.dynamic_care(dynamic_care_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of ConsumerPlantCareApi->dynamic_care:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ConsumerPlantCareApi->dynamic_care: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dynamic_care_request** | [**DynamicCareRequest**](DynamicCareRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**DynamicCare**](DynamicCare.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Dynamic care recommendations |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **safe_identification**
> SafeIdentification safe_identification(safe_identification_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Safe plant identification with toxic lookalike warnings

Environmentally-contextualized plant identification that addresses misidentification concerns.
Unlike generic plant ID, this endpoint:
- Checks against a toxic lookalike database with visual similarity scores
- Uses environmental context (soil, climate, regional flora) to weight identification probability
- Provides confidence breakdowns showing why alternatives were considered
- Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot)
- Accounts for plant growth stage (seedling identification challenges)


### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.safe_identification import SafeIdentification
from soilsidekick.models.safe_identification_request import SafeIdentificationRequest
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
    api_instance = soilsidekick.ConsumerPlantCareApi(api_client)
    safe_identification_request = soilsidekick.SafeIdentificationRequest() # SafeIdentificationRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Safe plant identification with toxic lookalike warnings
        api_response = api_instance.safe_identification(safe_identification_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of ConsumerPlantCareApi->safe_identification:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ConsumerPlantCareApi->safe_identification: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **safe_identification_request** | [**SafeIdentificationRequest**](SafeIdentificationRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**SafeIdentification**](SafeIdentification.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful identification with safety analysis |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

