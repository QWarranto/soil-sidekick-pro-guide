# SoilAnalysisApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getLiveAgriculturalData**](SoilAnalysisApi.md#getLiveAgriculturalData) | **POST** /live-agricultural-data | Get live agricultural data |
| [**getLiveAgriculturalDataWithHttpInfo**](SoilAnalysisApi.md#getLiveAgriculturalDataWithHttpInfo) | **POST** /live-agricultural-data | Get live agricultural data |
| [**getPlantingCalendar**](SoilAnalysisApi.md#getPlantingCalendar) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations |
| [**getPlantingCalendarWithHttpInfo**](SoilAnalysisApi.md#getPlantingCalendarWithHttpInfo) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations |
| [**getSoilData**](SoilAnalysisApi.md#getSoilData) | **POST** /get-soil-data | Get soil analysis data |
| [**getSoilDataWithHttpInfo**](SoilAnalysisApi.md#getSoilDataWithHttpInfo) | **POST** /get-soil-data | Get soil analysis data |



## getLiveAgriculturalData

> LiveAgriculturalData getLiveAgriculturalData(getLiveAgriculturalDataRequest)

Get live agricultural data

Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetLiveAgriculturalDataRequest getLiveAgriculturalDataRequest = new GetLiveAgriculturalDataRequest(); // GetLiveAgriculturalDataRequest | 
        try {
            LiveAgriculturalData result = apiInstance.getLiveAgriculturalData(getLiveAgriculturalDataRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getLiveAgriculturalData");
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
| **getLiveAgriculturalDataRequest** | [**GetLiveAgriculturalDataRequest**](GetLiveAgriculturalDataRequest.md)|  | |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getLiveAgriculturalDataWithHttpInfo

> ApiResponse<LiveAgriculturalData> getLiveAgriculturalDataWithHttpInfo(getLiveAgriculturalDataRequest)

Get live agricultural data

Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetLiveAgriculturalDataRequest getLiveAgriculturalDataRequest = new GetLiveAgriculturalDataRequest(); // GetLiveAgriculturalDataRequest | 
        try {
            ApiResponse<LiveAgriculturalData> response = apiInstance.getLiveAgriculturalDataWithHttpInfo(getLiveAgriculturalDataRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getLiveAgriculturalData");
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
| **getLiveAgriculturalDataRequest** | [**GetLiveAgriculturalDataRequest**](GetLiveAgriculturalDataRequest.md)|  | |

### Return type

ApiResponse<[**LiveAgriculturalData**](LiveAgriculturalData.md)>


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


## getPlantingCalendar

> PlantingCalendar getPlantingCalendar(getPlantingCalendarRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get planting calendar recommendations

Multi-parameter planting calendar with climate and soil factors

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetPlantingCalendarRequest getPlantingCalendarRequest = new GetPlantingCalendarRequest(); // GetPlantingCalendarRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            PlantingCalendar result = apiInstance.getPlantingCalendar(getPlantingCalendarRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getPlantingCalendar");
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
| **getPlantingCalendarRequest** | [**GetPlantingCalendarRequest**](GetPlantingCalendarRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getPlantingCalendarWithHttpInfo

> ApiResponse<PlantingCalendar> getPlantingCalendarWithHttpInfo(getPlantingCalendarRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get planting calendar recommendations

Multi-parameter planting calendar with climate and soil factors

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetPlantingCalendarRequest getPlantingCalendarRequest = new GetPlantingCalendarRequest(); // GetPlantingCalendarRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<PlantingCalendar> response = apiInstance.getPlantingCalendarWithHttpInfo(getPlantingCalendarRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getPlantingCalendar");
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
| **getPlantingCalendarRequest** | [**GetPlantingCalendarRequest**](GetPlantingCalendarRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**PlantingCalendar**](PlantingCalendar.md)>


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


## getSoilData

> SoilData getSoilData(getSoilDataRequest)

Get soil analysis data

Retrieve comprehensive soil analysis for a specific county

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetSoilDataRequest getSoilDataRequest = new GetSoilDataRequest(); // GetSoilDataRequest | 
        try {
            SoilData result = apiInstance.getSoilData(getSoilDataRequest);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getSoilData");
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
| **getSoilDataRequest** | [**GetSoilDataRequest**](GetSoilDataRequest.md)|  | |

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
| **200** | Successful response |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  * X-Response-Time-Ms - Response time in milliseconds <br>  * X-Response-Time-Target - Target response time for this endpoint <br>  * X-Response-Time-Status - Performance status relative to SLA targets <br>  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |
| **500** | Internal server error |  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getSoilDataWithHttpInfo

> ApiResponse<SoilData> getSoilDataWithHttpInfo(getSoilDataRequest)

Get soil analysis data

Retrieve comprehensive soil analysis for a specific county

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.SoilAnalysisApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        SoilAnalysisApi apiInstance = new SoilAnalysisApi(defaultClient);
        GetSoilDataRequest getSoilDataRequest = new GetSoilDataRequest(); // GetSoilDataRequest | 
        try {
            ApiResponse<SoilData> response = apiInstance.getSoilDataWithHttpInfo(getSoilDataRequest);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SoilAnalysisApi#getSoilData");
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
| **getSoilDataRequest** | [**GetSoilDataRequest**](GetSoilDataRequest.md)|  | |

### Return type

ApiResponse<[**SoilData**](SoilData.md)>


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  * X-Response-Time-Ms - Response time in milliseconds <br>  * X-Response-Time-Target - Target response time for this endpoint <br>  * X-Response-Time-Status - Performance status relative to SLA targets <br>  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |
| **500** | Internal server error |  * X-Response-Time - Response time even for rate-limited requests <br>  |

