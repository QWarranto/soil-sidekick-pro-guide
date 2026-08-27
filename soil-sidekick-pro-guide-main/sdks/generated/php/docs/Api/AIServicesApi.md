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
$x_tq_context_mode = new \SoilSidekick\Model\TQContextMode(); // TQContextMode | TurboQuant context mode for AI tools
$x_tq_kv_cache_hint = new \SoilSidekick\Model\TQKVCacheHint(); // TQKVCacheHint | TurboQuant KV cache compression hint
$x_tq_model_tier = new \SoilSidekick\Model\TQModelTier(); // TQModelTier | Preferred model tier for TurboQuant optimization

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
| **x_tq_context_mode** | [**TQContextMode**](../Model/.md)| TurboQuant context mode for AI tools | [optional] |
| **x_tq_kv_cache_hint** | [**TQKVCacheHint**](../Model/.md)| TurboQuant KV cache compression hint | [optional] |
| **x_tq_model_tier** | [**TQModelTier**](../Model/.md)| Preferred model tier for TurboQuant optimization | [optional] |

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
$x_tq_context_mode = new \SoilSidekick\Model\TQContextMode(); // TQContextMode | TurboQuant context mode for AI tools
$x_tq_kv_cache_hint = new \SoilSidekick\Model\TQKVCacheHint(); // TQKVCacheHint | TurboQuant KV cache compression hint
$x_tq_model_tier = new \SoilSidekick\Model\TQModelTier(); // TQModelTier | Preferred model tier for TurboQuant optimization

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
| **x_tq_context_mode** | [**TQContextMode**](../Model/.md)| TurboQuant context mode for AI tools | [optional] |
| **x_tq_kv_cache_hint** | [**TQKVCacheHint**](../Model/.md)| TurboQuant KV cache compression hint | [optional] |
| **x_tq_model_tier** | [**TQModelTier**](../Model/.md)| Preferred model tier for TurboQuant optimization | [optional] |

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
$x_tq_context_mode = new \SoilSidekick\Model\TQContextMode(); // TQContextMode | TurboQuant context mode for AI tools
$x_tq_kv_cache_hint = new \SoilSidekick\Model\TQKVCacheHint(); // TQKVCacheHint | TurboQuant KV cache compression hint
$x_tq_model_tier = new \SoilSidekick\Model\TQModelTier(); // TQModelTier | Preferred model tier for TurboQuant optimization

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
| **x_tq_context_mode** | [**TQContextMode**](../Model/.md)| TurboQuant context mode for AI tools | [optional] |
| **x_tq_kv_cache_hint** | [**TQKVCacheHint**](../Model/.md)| TurboQuant KV cache compression hint | [optional] |
| **x_tq_model_tier** | [**TQModelTier**](../Model/.md)| Preferred model tier for TurboQuant optimization | [optional] |

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
visualCropAnalysis($visual_crop_analysis_request): \SoilSidekick\Model\VisualCropAnalysis
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

try {
    $result = $apiInstance->visualCropAnalysis($visual_crop_analysis_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->visualCropAnalysis: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **visual_crop_analysis_request** | [**\SoilSidekick\Model\VisualCropAnalysisRequest**](../Model/VisualCropAnalysisRequest.md)|  | |

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
