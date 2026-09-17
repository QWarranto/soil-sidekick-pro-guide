# soilsidekick.VRTApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**generate_vrt_prescription**](VRTApi.md#generate_vrt_prescription) | **POST** /generate-vrt-prescription | Generate VRT prescription map


# **generate_vrt_prescription**
> VRTPrescription generate_vrt_prescription(generate_vrt_prescription_request)

Generate VRT prescription map

Generate variable rate technology prescription maps

### Example

* Api Key Authentication (ApiKeyAuth):

```python
import soilsidekick
from soilsidekick.models.generate_vrt_prescription_request import GenerateVRTPrescriptionRequest
from soilsidekick.models.vrt_prescription import VRTPrescription
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
    api_instance = soilsidekick.VRTApi(api_client)
    generate_vrt_prescription_request = soilsidekick.GenerateVRTPrescriptionRequest() # GenerateVRTPrescriptionRequest | 

    try:
        # Generate VRT prescription map
        api_response = api_instance.generate_vrt_prescription(generate_vrt_prescription_request)
        print("The response of VRTApi->generate_vrt_prescription:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling VRTApi->generate_vrt_prescription: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **generate_vrt_prescription_request** | [**GenerateVRTPrescriptionRequest**](GenerateVRTPrescriptionRequest.md)|  | 

### Return type

[**VRTPrescription**](VRTPrescription.md)

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

