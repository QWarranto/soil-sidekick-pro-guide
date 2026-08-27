# SatelliteDataApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getSatelliteData**](SatelliteDataApi.md#getSatelliteData) | **POST** /alpha-earth-environmental-enhancement | Get satellite environmental data |
| [**getSatelliteDataWithHttpInfo**](SatelliteDataApi.md#getSatelliteDataWithHttpInfo) | **POST** /alpha-earth-environmental-enhancement | Get satellite environmental data |



## getSatelliteData

> SatelliteData getSatelliteData(getSatelliteDataRequest)

Get satellite environmental data

AlphaEarth satellite intelligence integration

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SatelliteDataApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SatelliteDataApi apiInstance = new SatelliteDataApi(defaultClient);
        GetSatelliteDataRequest getSatelliteDataRequest = new GetSatelliteDataRequest(); // GetSatelliteDataRequest | 
        try {
            SatelliteData result = apiInstance.getSatelliteData(getSatelliteDataRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SatelliteDataApi#getSatelliteData");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **getSatelliteDataRequest** | [**GetSatelliteDataRequest**](GetSatelliteDataRequest.md)|  | |

### Return type

[**SatelliteData**](SatelliteData.md)


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getSatelliteDataWithHttpInfo

> ApiResponse<SatelliteData> getSatelliteData getSatelliteDataWithHttpInfo(getSatelliteDataRequest)

Get satellite environmental data

AlphaEarth satellite intelligence integration

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SatelliteDataApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SatelliteDataApi apiInstance = new SatelliteDataApi(defaultClient);
        GetSatelliteDataRequest getSatelliteDataRequest = new GetSatelliteDataRequest(); // GetSatelliteDataRequest | 
        try {
            ApiResponse<SatelliteData> response = apiInstance.getSatelliteDataWithHttpInfo(getSatelliteDataRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SatelliteDataApi#getSatelliteData");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **getSatelliteDataRequest** | [**GetSatelliteDataRequest**](GetSatelliteDataRequest.md)|  | |

### Return type

ApiResponse<[**SatelliteData**](SatelliteData.md)>


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

