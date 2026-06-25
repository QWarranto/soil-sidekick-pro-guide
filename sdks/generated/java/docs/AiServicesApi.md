# AiServicesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**generateSmartReportSummary**](AiServicesApi.md#generateSmartReportSummary) | **POST** /smart-report-summary | Generate AI report summary |
| [**generateSmartReportSummaryWithHttpInfo**](AiServicesApi.md#generateSmartReportSummaryWithHttpInfo) | **POST** /smart-report-summary | Generate AI report summary |
| [**getAgriculturalIntelligence**](AiServicesApi.md#getAgriculturalIntelligence) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights |
| [**getAgriculturalIntelligenceWithHttpInfo**](AiServicesApi.md#getAgriculturalIntelligenceWithHttpInfo) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights |
| [**getSeasonalPlanningAssistant**](AiServicesApi.md#getSeasonalPlanningAssistant) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations |
| [**getSeasonalPlanningAssistantWithHttpInfo**](AiServicesApi.md#getSeasonalPlanningAssistantWithHttpInfo) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations |
| [**visualCropAnalysis**](AiServicesApi.md#visualCropAnalysis) | **POST** /visual-crop-analysis | Analyze crop images |
| [**visualCropAnalysisWithHttpInfo**](AiServicesApi.md#visualCropAnalysisWithHttpInfo) | **POST** /visual-crop-analysis | Analyze crop images |



## generateSmartReportSummary

> SmartReportSummary generateSmartReportSummary(generateSmartReportSummaryRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Generate AI report summary

Generate AI-powered summaries for soil or water quality reports

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GenerateSmartReportSummaryRequest generateSmartReportSummaryRequest = new GenerateSmartReportSummaryRequest(); // GenerateSmartReportSummaryRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            SmartReportSummary result = apiInstance.generateSmartReportSummary(generateSmartReportSummaryRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#generateSmartReportSummary");
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
| **generateSmartReportSummaryRequest** | [**GenerateSmartReportSummaryRequest**](GenerateSmartReportSummaryRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## generateSmartReportSummaryWithHttpInfo

> ApiResponse<SmartReportSummary> generateSmartReportSummaryWithHttpInfo(generateSmartReportSummaryRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Generate AI report summary

Generate AI-powered summaries for soil or water quality reports

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GenerateSmartReportSummaryRequest generateSmartReportSummaryRequest = new GenerateSmartReportSummaryRequest(); // GenerateSmartReportSummaryRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<SmartReportSummary> response = apiInstance.generateSmartReportSummaryWithHttpInfo(generateSmartReportSummaryRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#generateSmartReportSummary");
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
| **generateSmartReportSummaryRequest** | [**GenerateSmartReportSummaryRequest**](GenerateSmartReportSummaryRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**SmartReportSummary**](SmartReportSummary.md)>


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


## getAgriculturalIntelligence

> AIAnalysis getAgriculturalIntelligence(getAgriculturalIntelligenceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get AI-powered agricultural insights

Agricultural intelligence with AI recommendations

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GetAgriculturalIntelligenceRequest getAgriculturalIntelligenceRequest = new GetAgriculturalIntelligenceRequest(); // GetAgriculturalIntelligenceRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            AIAnalysis result = apiInstance.getAgriculturalIntelligence(getAgriculturalIntelligenceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#getAgriculturalIntelligence");
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
| **getAgriculturalIntelligenceRequest** | [**GetAgriculturalIntelligenceRequest**](GetAgriculturalIntelligenceRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getAgriculturalIntelligenceWithHttpInfo

> ApiResponse<AIAnalysis> getAgriculturalIntelligenceWithHttpInfo(getAgriculturalIntelligenceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get AI-powered agricultural insights

Agricultural intelligence with AI recommendations

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GetAgriculturalIntelligenceRequest getAgriculturalIntelligenceRequest = new GetAgriculturalIntelligenceRequest(); // GetAgriculturalIntelligenceRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<AIAnalysis> response = apiInstance.getAgriculturalIntelligenceWithHttpInfo(getAgriculturalIntelligenceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#getAgriculturalIntelligence");
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
| **getAgriculturalIntelligenceRequest** | [**GetAgriculturalIntelligenceRequest**](GetAgriculturalIntelligenceRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**AIAnalysis**](AIAnalysis.md)>


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


## getSeasonalPlanningAssistant

> SeasonalPlanningResponse getSeasonalPlanningAssistant(getSeasonalPlanningAssistantRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get seasonal planning recommendations

AI-powered seasonal planning with weather integration

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GetSeasonalPlanningAssistantRequest getSeasonalPlanningAssistantRequest = new GetSeasonalPlanningAssistantRequest(); // GetSeasonalPlanningAssistantRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            SeasonalPlanningResponse result = apiInstance.getSeasonalPlanningAssistant(getSeasonalPlanningAssistantRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#getSeasonalPlanningAssistant");
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
| **getSeasonalPlanningAssistantRequest** | [**GetSeasonalPlanningAssistantRequest**](GetSeasonalPlanningAssistantRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## getSeasonalPlanningAssistantWithHttpInfo

> ApiResponse<SeasonalPlanningResponse> getSeasonalPlanningAssistantWithHttpInfo(getSeasonalPlanningAssistantRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Get seasonal planning recommendations

AI-powered seasonal planning with weather integration

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        GetSeasonalPlanningAssistantRequest getSeasonalPlanningAssistantRequest = new GetSeasonalPlanningAssistantRequest(); // GetSeasonalPlanningAssistantRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<SeasonalPlanningResponse> response = apiInstance.getSeasonalPlanningAssistantWithHttpInfo(getSeasonalPlanningAssistantRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#getSeasonalPlanningAssistant");
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
| **getSeasonalPlanningAssistantRequest** | [**GetSeasonalPlanningAssistantRequest**](GetSeasonalPlanningAssistantRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**SeasonalPlanningResponse**](SeasonalPlanningResponse.md)>


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


## visualCropAnalysis

> VisualCropAnalysis visualCropAnalysis(visualCropAnalysisRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Analyze crop images

AI-powered visual crop analysis for pest detection, health assessment, and disease screening

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        VisualCropAnalysisRequest visualCropAnalysisRequest = new VisualCropAnalysisRequest(); // VisualCropAnalysisRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            VisualCropAnalysis result = apiInstance.visualCropAnalysis(visualCropAnalysisRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#visualCropAnalysis");
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
| **visualCropAnalysisRequest** | [**VisualCropAnalysisRequest**](VisualCropAnalysisRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

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
| **200** | Successful response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## visualCropAnalysisWithHttpInfo

> ApiResponse<VisualCropAnalysis> visualCropAnalysisWithHttpInfo(visualCropAnalysisRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Analyze crop images

AI-powered visual crop analysis for pest detection, health assessment, and disease screening

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AiServicesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        AiServicesApi apiInstance = new AiServicesApi(defaultClient);
        VisualCropAnalysisRequest visualCropAnalysisRequest = new VisualCropAnalysisRequest(); // VisualCropAnalysisRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<VisualCropAnalysis> response = apiInstance.visualCropAnalysisWithHttpInfo(visualCropAnalysisRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AiServicesApi#visualCropAnalysis");
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
| **visualCropAnalysisRequest** | [**VisualCropAnalysisRequest**](VisualCropAnalysisRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**VisualCropAnalysis**](VisualCropAnalysis.md)>


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

