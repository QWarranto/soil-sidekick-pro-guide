# WaterQualityApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getTerritorialWaterAnalytics**](WaterQualityApi.md#getTerritorialWaterAnalytics) | **POST** /territorial-water-analytics | Get territorial water analytics |
| [**getTerritorialWaterAnalyticsWithHttpInfo**](WaterQualityApi.md#getTerritorialWaterAnalyticsWithHttpInfo) | **POST** /territorial-water-analytics | Get territorial water analytics |
| [**getWaterQuality**](WaterQualityApi.md#getWaterQuality) | **POST** /territorial-water-quality | Get water quality data |
| [**getWaterQualityWithHttpInfo**](WaterQualityApi.md#getWaterQualityWithHttpInfo) | **POST** /territorial-water-quality | Get water quality data |



## getTerritorialWaterAnalytics

> TerritorialWaterAnalytics getTerritorialWaterAnalytics(getTerritorialWaterAnalyticsRequest)

Get territorial water analytics

Generate territorial water quality analytics across regions

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.WaterQualityApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        WaterQualityApi apiInstance = new WaterQualityApi(defaultClient);
        GetTerritorialWaterAnalyticsRequest getTerritorialWaterAnalyticsRequest = new GetTerritorialWaterAnalyticsRequest(); // GetTerritorialWaterAnalyticsRequest | 
        try {
            TerritorialWaterAnalytics result = apiInstance.getTerritorialWaterAnalytics(getTerritorialWaterAnalyticsRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WaterQualityApi#getTerritorialWaterAnalytics");
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
| **getTerritorialWaterAnalyticsRequest** | [**GetTerritorialWaterAnalyticsRequest**](GetTerritorialWaterAnalyticsRequest.md)|  | |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getTerritorialWaterAnalyticsWithHttpInfo

> ApiResponse<TerritorialWaterAnalytics> getTerritorialWaterAnalytics getTerritorialWaterAnalyticsWithHttpInfo(getTerritorialWaterAnalyticsRequest)

Get territorial water analytics

Generate territorial water quality analytics across regions

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.WaterQualityApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        WaterQualityApi apiInstance = new WaterQualityApi(defaultClient);
        GetTerritorialWaterAnalyticsRequest getTerritorialWaterAnalyticsRequest = new GetTerritorialWaterAnalyticsRequest(); // GetTerritorialWaterAnalyticsRequest | 
        try {
            ApiResponse<TerritorialWaterAnalytics> response = apiInstance.getTerritorialWaterAnalyticsWithHttpInfo(getTerritorialWaterAnalyticsRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WaterQualityApi#getTerritorialWaterAnalytics");
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
| **getTerritorialWaterAnalyticsRequest** | [**GetTerritorialWaterAnalyticsRequest**](GetTerritorialWaterAnalyticsRequest.md)|  | |

### Return type

ApiResponse<[**TerritorialWaterAnalytics**](TerritorialWaterAnalytics.md)>


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


## getWaterQuality

> WaterQuality getWaterQuality(getWaterQualityRequest)

Get water quality data

Retrieve water quality metrics for a specific county

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.WaterQualityApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        WaterQualityApi apiInstance = new WaterQualityApi(defaultClient);
        GetWaterQualityRequest getWaterQualityRequest = new GetWaterQualityRequest(); // GetWaterQualityRequest | 
        try {
            WaterQuality result = apiInstance.getWaterQuality(getWaterQualityRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WaterQualityApi#getWaterQuality");
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
| **getWaterQualityRequest** | [**GetWaterQualityRequest**](GetWaterQualityRequest.md)|  | |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getWaterQualityWithHttpInfo

> ApiResponse<WaterQuality> getWaterQuality getWaterQualityWithHttpInfo(getWaterQualityRequest)

Get water quality data

Retrieve water quality metrics for a specific county

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.WaterQualityApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        WaterQualityApi apiInstance = new WaterQualityApi(defaultClient);
        GetWaterQualityRequest getWaterQualityRequest = new GetWaterQualityRequest(); // GetWaterQualityRequest | 
        try {
            ApiResponse<WaterQuality> response = apiInstance.getWaterQualityWithHttpInfo(getWaterQualityRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WaterQualityApi#getWaterQuality");
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
| **getWaterQualityRequest** | [**GetWaterQualityRequest**](GetWaterQualityRequest.md)|  | |

### Return type

ApiResponse<[**WaterQuality**](WaterQuality.md)>


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

