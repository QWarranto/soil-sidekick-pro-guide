# ConsumerPlantCareApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**beginnerGuidance**](ConsumerPlantCareApi.md#beginnerGuidance) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon |
| [**beginnerGuidanceWithHttpInfo**](ConsumerPlantCareApi.md#beginnerGuidanceWithHttpInfo) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon |
| [**dynamicCare**](ConsumerPlantCareApi.md#dynamicCare) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations |
| [**dynamicCareWithHttpInfo**](ConsumerPlantCareApi.md#dynamicCareWithHttpInfo) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations |
| [**safeIdentification**](ConsumerPlantCareApi.md#safeIdentification) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings |
| [**safeIdentificationWithHttpInfo**](ConsumerPlantCareApi.md#safeIdentificationWithHttpInfo) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings |



## beginnerGuidance

> BeginnerGuidance beginnerGuidance(beginnerGuidanceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Beginner-friendly plant guidance without jargon

Judgment-free, accessible plant guidance that solves community gatekeeping issues. This endpoint: - Translates scientific jargon into plain language - Never makes users feel stupid for asking about common plants - Uses progressive disclosure (simple answer first, details on request) - Provides encouraging, supportive tone - Offers practical \&quot;what do I do right now\&quot; guidance 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        BeginnerGuidanceRequest beginnerGuidanceRequest = new BeginnerGuidanceRequest(); // BeginnerGuidanceRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            BeginnerGuidance result = apiInstance.beginnerGuidance(beginnerGuidanceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#beginnerGuidance");
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
| **beginnerGuidanceRequest** | [**BeginnerGuidanceRequest**](BeginnerGuidanceRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

[**BeginnerGuidance**](BeginnerGuidance.md)


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Beginner-friendly guidance response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## beginnerGuidanceWithHttpInfo

> ApiResponse<BeginnerGuidance> beginnerGuidanceWithHttpInfo(beginnerGuidanceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Beginner-friendly plant guidance without jargon

Judgment-free, accessible plant guidance that solves community gatekeeping issues. This endpoint: - Translates scientific jargon into plain language - Never makes users feel stupid for asking about common plants - Uses progressive disclosure (simple answer first, details on request) - Provides encouraging, supportive tone - Offers practical \&quot;what do I do right now\&quot; guidance 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        BeginnerGuidanceRequest beginnerGuidanceRequest = new BeginnerGuidanceRequest(); // BeginnerGuidanceRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<BeginnerGuidance> response = apiInstance.beginnerGuidanceWithHttpInfo(beginnerGuidanceRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#beginnerGuidance");
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
| **beginnerGuidanceRequest** | [**BeginnerGuidanceRequest**](BeginnerGuidanceRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**BeginnerGuidance**](BeginnerGuidance.md)>


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Beginner-friendly guidance response |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |


## dynamicCare

> DynamicCare dynamicCare(dynamicCareRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Hyper-localized dynamic plant care recommendations

Real-time, environment-aware care recommendations that solve the \&quot;generic advice\&quot; problem. Unlike static \&quot;water every 7 days\&quot; recommendations, this endpoint: - Adjusts watering based on current humidity, temperature, and recent rainfall - Considers container type, soil composition, and drainage - Factors in seasonal changes and indoor environment conditions - Accounts for plant maturity and growth phase - Provides actionable guidance, not rigid schedules 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        DynamicCareRequest dynamicCareRequest = new DynamicCareRequest(); // DynamicCareRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            DynamicCare result = apiInstance.dynamicCare(dynamicCareRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#dynamicCare");
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
| **dynamicCareRequest** | [**DynamicCareRequest**](DynamicCareRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

[**DynamicCare**](DynamicCare.md)


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Dynamic care recommendations |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## dynamicCareWithHttpInfo

> ApiResponse<DynamicCare> dynamicCareWithHttpInfo(dynamicCareRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Hyper-localized dynamic plant care recommendations

Real-time, environment-aware care recommendations that solve the \&quot;generic advice\&quot; problem. Unlike static \&quot;water every 7 days\&quot; recommendations, this endpoint: - Adjusts watering based on current humidity, temperature, and recent rainfall - Considers container type, soil composition, and drainage - Factors in seasonal changes and indoor environment conditions - Accounts for plant maturity and growth phase - Provides actionable guidance, not rigid schedules 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        DynamicCareRequest dynamicCareRequest = new DynamicCareRequest(); // DynamicCareRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<DynamicCare> response = apiInstance.dynamicCareWithHttpInfo(dynamicCareRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#dynamicCare");
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
| **dynamicCareRequest** | [**DynamicCareRequest**](DynamicCareRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**DynamicCare**](DynamicCare.md)>


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Dynamic care recommendations |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |


## safeIdentification

> SafeIdentification safeIdentification(safeIdentificationRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Safe plant identification with toxic lookalike warnings

Environmentally-contextualized plant identification that addresses misidentification concerns. Unlike generic plant ID, this endpoint: - Checks against a toxic lookalike database with visual similarity scores - Uses environmental context (soil, climate, regional flora) to weight identification probability - Provides confidence breakdowns showing why alternatives were considered - Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot) - Accounts for plant growth stage (seedling identification challenges) 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        SafeIdentificationRequest safeIdentificationRequest = new SafeIdentificationRequest(); // SafeIdentificationRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            SafeIdentification result = apiInstance.safeIdentification(safeIdentificationRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#safeIdentification");
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
| **safeIdentificationRequest** | [**SafeIdentificationRequest**](SafeIdentificationRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

[**SafeIdentification**](SafeIdentification.md)


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful identification with safety analysis |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

## safeIdentificationWithHttpInfo

> ApiResponse<SafeIdentification> safeIdentificationWithHttpInfo(safeIdentificationRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier)

Safe plant identification with toxic lookalike warnings

Environmentally-contextualized plant identification that addresses misidentification concerns. Unlike generic plant ID, this endpoint: - Checks against a toxic lookalike database with visual similarity scores - Uses environmental context (soil, climate, regional flora) to weight identification probability - Provides confidence breakdowns showing why alternatives were considered - Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot) - Accounts for plant growth stage (seedling identification challenges) 

### Example

```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.ApiResponse;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.ConsumerPlantCareApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1");
        
        // Configure API key authorization: ApiKeyAuth
        ApiKeyAuth ApiKeyAuth = (ApiKeyAuth) defaultClient.getAuthentication("ApiKeyAuth");
        ApiKeyAuth.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //ApiKeyAuth.setApiKeyPrefix("Token");

        ConsumerPlantCareApi apiInstance = new ConsumerPlantCareApi(defaultClient);
        SafeIdentificationRequest safeIdentificationRequest = new SafeIdentificationRequest(); // SafeIdentificationRequest | 
        Integer xTqContextMode = 4096; // Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
        String xTqKvCacheHint = "none"; // String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
        String xTqModelTier = "auto"; // String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
        try {
            ApiResponse<SafeIdentification> response = apiInstance.safeIdentificationWithHttpInfo(safeIdentificationRequest, xTqContextMode, xTqKvCacheHint, xTqModelTier);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling ConsumerPlantCareApi#safeIdentification");
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
| **safeIdentificationRequest** | [**SafeIdentificationRequest**](SafeIdentificationRequest.md)|  | |
| **xTqContextMode** | **Integer**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional] [default to 4096] [enum: 4096, 8192, 16384, 24576] |
| **xTqKvCacheHint** | **String**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional] [default to none] [enum: none, reuse, persist] |
| **xTqModelTier** | **String**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional] [default to auto] [enum: auto, gemma-2b, gemma-7b, gemma-7b-tq] |

### Return type

ApiResponse<[**SafeIdentification**](SafeIdentification.md)>


### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful identification with safety analysis |  -  |
| **401** | Authentication required or invalid API key |  -  |
| **403** | Tier restriction - upgrade required |  -  |
| **429** | Rate limit exceeded |  * X-RateLimit-Limit -  <br>  * X-RateLimit-Remaining -  <br>  * X-RateLimit-Reset -  <br>  * X-Response-Time - Response time even for rate-limited requests <br>  |

