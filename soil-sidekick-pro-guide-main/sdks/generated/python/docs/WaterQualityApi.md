# soilsidekick.WaterQualityApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_territorial_water_analytics**](WaterQualityApi.md#get_territorial_water_analytics) | **POST** /territorial-water-analytics | Get territorial water analytics
[**get_water_quality**](WaterQualityApi.md#get_water_quality) | **POST** /territorial-water-quality | Get water quality data


# **get_territorial_water_analytics**
> TerritorialWaterAnalytics get_territorial_water_analytics(get_territorial_water_analytics_request)

Get territorial water analytics

Generate territorial water quality analytics across regions

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import time
import os
import soilsidekick
from soilsidekick.models.get_territorial_water_analytics_request import GetTerritorialWaterAnalyticsRequest
from soilsidekick.models.territorial_water_analytics import TerritorialWaterAnalytics
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
    api_instance = soilsidekick.WaterQualityApi(api_client)
    get_territorial_water_analytics_request = soilsidekick.GetTerritorialWaterAnalyticsRequest() # GetTerritorialWaterAnalyticsRequest | 

    try:
        # Get territorial water analytics
        api_response = api_instance.get_territorial_water_analytics(get_territorial_water_analytics_request)
        print("The response of WaterQualityApi->get_territorial_water_analytics:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WaterQualityApi->get_territorial_water_analytics: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_territorial_water_analytics_request** | [**GetTerritorialWaterAnalyticsRequest**](GetTerritorialWaterAnalyticsRequest.md)|  | 

### Return type

[**TerritorialWaterAnalytics**](TerritorialWaterAnalytics.md)

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

# **get_water_quality**
> WaterQuality get_water_quality(get_water_quality_request)

Get water quality data

Retrieve water quality metrics for a specific county

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import time
import os
import soilsidekick
from soilsidekick.models.get_water_quality_request import GetWaterQualityRequest
from soilsidekick.models.water_quality import WaterQuality
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
    api_instance = soilsidekick.WaterQualityApi(api_client)
    get_water_quality_request = soilsidekick.GetWaterQualityRequest() # GetWaterQualityRequest | 

    try:
        # Get water quality data
        api_response = api_instance.get_water_quality(get_water_quality_request)
        print("The response of WaterQualityApi->get_water_quality:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WaterQualityApi->get_water_quality: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **get_water_quality_request** | [**GetWaterQualityRequest**](GetWaterQualityRequest.md)|  | 

### Return type

[**WaterQuality**](WaterQuality.md)

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

