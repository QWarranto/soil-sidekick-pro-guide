# soilsidekick.LeafEnginesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**leafengines_query**](LeafEnginesApi.md#leafengines_query) | **POST** /leafengines-query | Query plant-environment compatibility


# **leafengines_query**
> LeafEnginesCompatibility leafengines_query(leafengines_query_request)

Query plant-environment compatibility

LeafEngines API for plant compatibility scoring with environmental factors

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import time
import os
import soilsidekick
from soilsidekick.models.leaf_engines_compatibility import LeafEnginesCompatibility
from soilsidekick.models.leafengines_query_request import LeafenginesQueryRequest
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
    api_instance = soilsidekick.LeafEnginesApi(api_client)
    leafengines_query_request = soilsidekick.LeafenginesQueryRequest() # LeafenginesQueryRequest | 

    try:
        # Query plant-environment compatibility
        api_response = api_instance.leafengines_query(leafengines_query_request)
        print("The response of LeafEnginesApi->leafengines_query:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LeafEnginesApi->leafengines_query: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **leafengines_query_request** | [**LeafenginesQueryRequest**](LeafenginesQueryRequest.md)|  | 

### Return type

[**LeafEnginesCompatibility**](LeafEnginesCompatibility.md)

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

