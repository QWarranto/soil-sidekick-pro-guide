# soilsidekick.AIServicesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**generate_smart_report_summary**](AIServicesApi.md#generate_smart_report_summary) | **POST** /smart-report-summary | Generate AI report summary
[**get_agricultural_intelligence**](AIServicesApi.md#get_agricultural_intelligence) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights
[**get_seasonal_planning_assistant**](AIServicesApi.md#get_seasonal_planning_assistant) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations
[**visual_crop_analysis**](AIServicesApi.md#visual_crop_analysis) | **POST** /visual-crop-analysis | Analyze crop images


# **generate_smart_report_summary**
> SmartReportSummary generate_smart_report_summary(generate_smart_report_summary_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Generate AI report summary

Generate AI-powered summaries for soil or water quality reports

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.generate_smart_report_summary_request import GenerateSmartReportSummaryRequest
from soilsidekick.models.smart_report_summary import SmartReportSummary
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
    api_instance = soilsidekick.AIServicesApi(api_client)
    generate_smart_report_summary_request = soilsidekick.GenerateSmartReportSummaryRequest() # GenerateSmartReportSummaryRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Generate AI report summary
        api_response = api_instance.generate_smart_report_summary(generate_smart_report_summary_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of AIServicesApi->generate_smart_report_summary:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AIServicesApi->generate_smart_report_summary: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **generate_smart_report_summary_request** | [**GenerateSmartReportSummaryRequest**](GenerateSmartReportSummaryRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**SmartReportSummary**](SmartReportSummary.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_agricultural_intelligence**
> AIAnalysis get_agricultural_intelligence(get_agricultural_intelligence_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Get AI-powered agricultural insights

Agricultural intelligence with AI recommendations

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.ai_analysis import AIAnalysis
from soilsidekick.models.get_agricultural_intelligence_request import GetAgriculturalIntelligenceRequest
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
    api_instance = soilsidekick.AIServicesApi(api_client)
    get_agricultural_intelligence_request = soilsidekick.GetAgriculturalIntelligenceRequest() # GetAgriculturalIntelligenceRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Get AI-powered agricultural insights
        api_response = api_instance.get_agricultural_intelligence(get_agricultural_intelligence_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of AIServicesApi->get_agricultural_intelligence:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AIServicesApi->get_agricultural_intelligence: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_agricultural_intelligence_request** | [**GetAgriculturalIntelligenceRequest**](GetAgriculturalIntelligenceRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**AIAnalysis**](AIAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_seasonal_planning_assistant**
> SeasonalPlanningResponse get_seasonal_planning_assistant(get_seasonal_planning_assistant_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Get seasonal planning recommendations

AI-powered seasonal planning with weather integration

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.get_seasonal_planning_assistant_request import GetSeasonalPlanningAssistantRequest
from soilsidekick.models.seasonal_planning_response import SeasonalPlanningResponse
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
    api_instance = soilsidekick.AIServicesApi(api_client)
    get_seasonal_planning_assistant_request = soilsidekick.GetSeasonalPlanningAssistantRequest() # GetSeasonalPlanningAssistantRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Get seasonal planning recommendations
        api_response = api_instance.get_seasonal_planning_assistant(get_seasonal_planning_assistant_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of AIServicesApi->get_seasonal_planning_assistant:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AIServicesApi->get_seasonal_planning_assistant: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_seasonal_planning_assistant_request** | [**GetSeasonalPlanningAssistantRequest**](GetSeasonalPlanningAssistantRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**SeasonalPlanningResponse**](SeasonalPlanningResponse.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **visual_crop_analysis**
> VisualCropAnalysis visual_crop_analysis(visual_crop_analysis_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Analyze crop images

AI-powered visual crop analysis for pest detection, health assessment, and disease screening

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.visual_crop_analysis import VisualCropAnalysis
from soilsidekick.models.visual_crop_analysis_request import VisualCropAnalysisRequest
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
    api_instance = soilsidekick.AIServicesApi(api_client)
    visual_crop_analysis_request = soilsidekick.VisualCropAnalysisRequest() # VisualCropAnalysisRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Analyze crop images
        api_response = api_instance.visual_crop_analysis(visual_crop_analysis_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of AIServicesApi->visual_crop_analysis:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AIServicesApi->visual_crop_analysis: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **visual_crop_analysis_request** | [**VisualCropAnalysisRequest**](VisualCropAnalysisRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**VisualCropAnalysis**](VisualCropAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

