# soilsidekick.GeographicApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**county_lookup**](GeographicApi.md#county_lookup) | **POST** /county-lookup | Search for counties


# **county_lookup**
> CountyLookup200Response county_lookup(county_lookup_request)

Search for counties

Search counties by name, state, or FIPS code

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import time
import os
import soilsidekick
from soilsidekick.models.county_lookup200_response import CountyLookup200Response
from soilsidekick.models.county_lookup_request import CountyLookupRequest
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
    api_instance = soilsidekick.GeographicApi(api_client)
    county_lookup_request = soilsidekick.CountyLookupRequest() # CountyLookupRequest | 

    try:
        # Search for counties
        api_response = api_instance.county_lookup(county_lookup_request)
        print("The response of GeographicApi->county_lookup:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling GeographicApi->county_lookup: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **county_lookup_request** | [**CountyLookupRequest**](CountyLookupRequest.md)|  | 

### Return type

[**CountyLookup200Response**](CountyLookup200Response.md)

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
**429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

