# SoilSidekick\AIServicesApi



All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**generateSmartReportSummary()**](AIServicesApi.md#generateSmartReportSummary) | **POST** /smart-report-summary | Generate AI report summary |
| [**getAgriculturalIntelligence()**](AIServicesApi.md#getAgriculturalIntelligence) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights |
| [**getSeasonalPlanningAssistant()**](AIServicesApi.md#getSeasonalPlanningAssistant) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations |
| [**visualCropAnalysis()**](AIServicesApi.md#visualCropAnalysis) | **POST** /visual-crop-analysis | Analyze crop images |


## `generateSmartReportSummary()`

```php
generateSmartReportSummary($generate_smart_report_summary_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\SmartReportSummary
```

Generate AI report summary

Generate AI-powered summaries for soil or water quality reports

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\AIServicesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$generate_smart_report_summary_request = new \SoilSidekick\Model\GenerateSmartReportSummaryRequest(); // \SoilSidekick\Model\GenerateSmartReportSummaryRequest
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->generateSmartReportSummary($generate_smart_report_summary_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->generateSmartReportSummary: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **generate_smart_report_summary_request** | [**\SoilSidekick\Model\GenerateSmartReportSummaryRequest**](../Model/GenerateSmartReportSummaryRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

### Return type

[**\SoilSidekick\Model\SmartReportSummary**](../Model/SmartReportSummary.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getAgriculturalIntelligence()`

```php
getAgriculturalIntelligence($get_agricultural_intelligence_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\AIAnalysis
```

Get AI-powered agricultural insights

Agricultural intelligence with AI recommendations

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\AIServicesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_agricultural_intelligence_request = new \SoilSidekick\Model\GetAgriculturalIntelligenceRequest(); // \SoilSidekick\Model\GetAgriculturalIntelligenceRequest
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->getAgriculturalIntelligence($get_agricultural_intelligence_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->getAgriculturalIntelligence: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_agricultural_intelligence_request** | [**\SoilSidekick\Model\GetAgriculturalIntelligenceRequest**](../Model/GetAgriculturalIntelligenceRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

### Return type

[**\SoilSidekick\Model\AIAnalysis**](../Model/AIAnalysis.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getSeasonalPlanningAssistant()`

```php
getSeasonalPlanningAssistant($get_seasonal_planning_assistant_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\SeasonalPlanningResponse
```

Get seasonal planning recommendations

AI-powered seasonal planning with weather integration

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\AIServicesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_seasonal_planning_assistant_request = new \SoilSidekick\Model\GetSeasonalPlanningAssistantRequest(); // \SoilSidekick\Model\GetSeasonalPlanningAssistantRequest
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->getSeasonalPlanningAssistant($get_seasonal_planning_assistant_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->getSeasonalPlanningAssistant: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_seasonal_planning_assistant_request** | [**\SoilSidekick\Model\GetSeasonalPlanningAssistantRequest**](../Model/GetSeasonalPlanningAssistantRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

### Return type

[**\SoilSidekick\Model\SeasonalPlanningResponse**](../Model/SeasonalPlanningResponse.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `visualCropAnalysis()`

```php
visualCropAnalysis($visual_crop_analysis_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\VisualCropAnalysis
```

Analyze crop images

AI-powered visual crop analysis for pest detection, health assessment, and disease screening

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\AIServicesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$visual_crop_analysis_request = new \SoilSidekick\Model\VisualCropAnalysisRequest(); // \SoilSidekick\Model\VisualCropAnalysisRequest
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->visualCropAnalysis($visual_crop_analysis_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->visualCropAnalysis: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **visual_crop_analysis_request** | [**\SoilSidekick\Model\VisualCropAnalysisRequest**](../Model/VisualCropAnalysisRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

### Return type

[**\SoilSidekick\Model\VisualCropAnalysis**](../Model/VisualCropAnalysis.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
