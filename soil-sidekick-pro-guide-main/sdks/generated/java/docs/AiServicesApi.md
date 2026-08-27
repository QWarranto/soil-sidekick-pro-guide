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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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

> ApiResponse<SmartReportSummary> generateSmartReportSummary generateSmartReportSummaryWithHttpInfo(generateSmartReportSummaryRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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

> ApiResponse<AIAnalysis> getAgriculturalIntelligence getAgriculturalIntelligenceWithHttpInfo(getAgriculturalIntelligenceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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

> ApiResponse<SeasonalPlanningResponse> getSeasonalPlanningAssistant getSeasonalPlanningAssistantWithHttpInfo(getSeasonalPlanningAssistantRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

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
        TQContextMode xTqContextMode = TQContextMode.fromValue("standard"); // TQContextMode | TurboQuant context mode for AI tools
        TQKVCacheHint xTqKvCacheHint = TQKVCacheHint.fromValue("none"); // TQKVCacheHint | TurboQuant KV cache compression hint
        TQModelTier xTqModelTier = TQModelTier.fromValue("starter"); // TQModelTier | Preferred model tier for TurboQuant optimization
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
| **xTqContextMode** | [**TQContextMode**](.md)| TurboQuant context mode for AI tools | [optional] [enum: standard, extended, maximum] |
| **xTqKvCacheHint** | [**TQKVCacheHint**](.md)| TurboQuant KV cache compression hint | [optional] [enum: none, 3bit] |
| **xTqModelTier** | [**TQModelTier**](.md)| Preferred model tier for TurboQuant optimization | [optional] [enum: starter, professional, enterprise] |

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

> VisualCropAnalysis visualCropAnalysis(visualCropAnalysisRequest)

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
        try {
            VisualCropAnalysis result = apiInstance.visualCropAnalysis(visualCropAnalysisRequest);
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

> ApiResponse<VisualCropAnalysis> visualCropAnalysis visualCropAnalysisWithHttpInfo(visualCropAnalysisRequest)

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
        try {
            ApiResponse<VisualCropAnalysis> response = apiInstance.visualCropAnalysisWithHttpInfo(visualCropAnalysisRequest);
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

