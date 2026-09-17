# soilsidekick.SoilAnalysisApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_live_agricultural_data**](SoilAnalysisApi.md#get_live_agricultural_data) | **POST** /live-agricultural-data | Get live agricultural data
[**get_planting_calendar**](SoilAnalysisApi.md#get_planting_calendar) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations
[**get_soil_data**](SoilAnalysisApi.md#get_soil_data) | **POST** /get-soil-data | Get soil analysis data


# **get_live_agricultural_data**
> LiveAgriculturalData get_live_agricultural_data(get_live_agricultural_data_request)

Get live agricultural data

Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.get_live_agricultural_data_request import GetLiveAgriculturalDataRequest
from soilsidekick.models.live_agricultural_data import LiveAgriculturalData
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
    api_instance = soilsidekick.SoilAnalysisApi(api_client)
    get_live_agricultural_data_request = soilsidekick.GetLiveAgriculturalDataRequest() # GetLiveAgriculturalDataRequest | 

    try:
        # Get live agricultural data
        api_response = api_instance.get_live_agricultural_data(get_live_agricultural_data_request)
        print("The response of SoilAnalysisApi->get_live_agricultural_data:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SoilAnalysisApi->get_live_agricultural_data: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_live_agricultural_data_request** | [**GetLiveAgriculturalDataRequest**](GetLiveAgriculturalDataRequest.md)|  | 

### Return type

[**LiveAgriculturalData**](LiveAgriculturalData.md)

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

# **get_planting_calendar**
> PlantingCalendar get_planting_calendar(get_planting_calendar_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)

Get planting calendar recommendations

Multi-parameter planting calendar with climate and soil factors

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.get_planting_calendar_request import GetPlantingCalendarRequest
from soilsidekick.models.planting_calendar import PlantingCalendar
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
    api_instance = soilsidekick.SoilAnalysisApi(api_client)
    get_planting_calendar_request = soilsidekick.GetPlantingCalendarRequest() # GetPlantingCalendarRequest | 
    x_tq_context_mode = 4096 # int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
    x_tq_kv_cache_hint = none # str | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to none)
    x_tq_model_tier = auto # str | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to auto)

    try:
        # Get planting calendar recommendations
        api_response = api_instance.get_planting_calendar(get_planting_calendar_request, x_tq_context_mode=x_tq_context_mode, x_tq_kv_cache_hint=x_tq_kv_cache_hint, x_tq_model_tier=x_tq_model_tier)
        print("The response of SoilAnalysisApi->get_planting_calendar:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SoilAnalysisApi->get_planting_calendar: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_planting_calendar_request** | [**GetPlantingCalendarRequest**](GetPlantingCalendarRequest.md)|  | 
 **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096]
 **x_tq_kv_cache_hint** | **str**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none]
 **x_tq_model_tier** | **str**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto]

### Return type

[**PlantingCalendar**](PlantingCalendar.md)

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

# **get_soil_data**
> SoilData get_soil_data(get_soil_data_request)

Get soil analysis data

Retrieve comprehensive soil analysis for a specific county

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.get_soil_data_request import GetSoilDataRequest
from soilsidekick.models.soil_data import SoilData
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
    api_instance = soilsidekick.SoilAnalysisApi(api_client)
    get_soil_data_request = soilsidekick.GetSoilDataRequest() # GetSoilDataRequest | 

    try:
        # Get soil analysis data
        api_response = api_instance.get_soil_data(get_soil_data_request)
        print("The response of SoilAnalysisApi->get_soil_data:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SoilAnalysisApi->get_soil_data: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_soil_data_request** | [**GetSoilDataRequest**](GetSoilDataRequest.md)|  | 

### Return type

[**SoilData**](SoilData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  * X-Response-Time-Ms - Response time in milliseconds <br>  * X-Response-Time-Target - Target response time for this endpoint <br>  * X-Response-Time-Status - Performance status relative to SLA targets <br>  |
**401** | Authentication required or invalid API key |  -  |
**403** | Tier restriction - upgrade required |  -  |
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |
**500** | Internal server error |  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

