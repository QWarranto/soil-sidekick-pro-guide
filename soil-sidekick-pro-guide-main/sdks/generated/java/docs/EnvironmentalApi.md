# EnvironmentalApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**calculateEnvironmentalImpact**](EnvironmentalApi.md#calculateEnvironmentalImpact) | **POST** /environmental-impact-engine | Calculate environmental impact |
| [**calculateEnvironmentalImpactWithHttpInfo**](EnvironmentalApi.md#calculateEnvironmentalImpactWithHttpInfo) | **POST** /environmental-impact-engine | Calculate environmental impact |



## calculateEnvironmentalImpact

> EnvironmentalImpact calculateEnvironmentalImpact(calculateEnvironmentalImpactRequest)

Calculate environmental impact

Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.EnvironmentalApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        EnvironmentalApi apiInstance = new EnvironmentalApi(defaultClient);
        CalculateEnvironmentalImpactRequest calculateEnvironmentalImpactRequest = new CalculateEnvironmentalImpactRequest(); // CalculateEnvironmentalImpactRequest | 
        try {
            EnvironmentalImpact result = apiInstance.calculateEnvironmentalImpact(calculateEnvironmentalImpactRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling EnvironmentalApi#calculateEnvironmentalImpact");
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
| **calculateEnvironmentalImpactRequest** | [**CalculateEnvironmentalImpactRequest**](CalculateEnvironmentalImpactRequest.md)|  | |

### Return type

[**EnvironmentalImpact**](EnvironmentalImpact.md)


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

## calculateEnvironmentalImpactWithHttpInfo

> ApiResponse<EnvironmentalImpact> calculateEnvironmentalImpact calculateEnvironmentalImpactWithHttpInfo(calculateEnvironmentalImpactRequest)

Calculate environmental impact

Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.EnvironmentalApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        EnvironmentalApi apiInstance = new EnvironmentalApi(defaultClient);
        CalculateEnvironmentalImpactRequest calculateEnvironmentalImpactRequest = new CalculateEnvironmentalImpactRequest(); // CalculateEnvironmentalImpactRequest | 
        try {
            ApiResponse<EnvironmentalImpact> response = apiInstance.calculateEnvironmentalImpactWithHttpInfo(calculateEnvironmentalImpactRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling EnvironmentalApi#calculateEnvironmentalImpact");
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
| **calculateEnvironmentalImpactRequest** | [**CalculateEnvironmentalImpactRequest**](CalculateEnvironmentalImpactRequest.md)|  | |

### Return type

ApiResponse<[**EnvironmentalImpact**](EnvironmentalImpact.md)>


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

