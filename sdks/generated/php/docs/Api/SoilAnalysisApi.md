# SoilSidekick\SoilAnalysisApi



All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getLiveAgriculturalData()**](SoilAnalysisApi.md#getLiveAgriculturalData) | **POST** /live-agricultural-data | Get live agricultural data |
| [**getPlantingCalendar()**](SoilAnalysisApi.md#getPlantingCalendar) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations |
| [**getSoilData()**](SoilAnalysisApi.md#getSoilData) | **POST** /get-soil-data | Get soil analysis data |


## `getLiveAgriculturalData()`

```php
getLiveAgriculturalData($get_live_agricultural_data_request): \SoilSidekick\Model\LiveAgriculturalData
```

Get live agricultural data

Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\SoilAnalysisApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_live_agricultural_data_request = new \SoilSidekick\Model\GetLiveAgriculturalDataRequest(); // \SoilSidekick\Model\GetLiveAgriculturalDataRequest

try {
    $result = $apiInstance->getLiveAgriculturalData($get_live_agricultural_data_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SoilAnalysisApi->getLiveAgriculturalData: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_live_agricultural_data_request** | [**\SoilSidekick\Model\GetLiveAgriculturalDataRequest**](../Model/GetLiveAgriculturalDataRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\LiveAgriculturalData**](../Model/LiveAgriculturalData.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getPlantingCalendar()`

```php
getPlantingCalendar($get_planting_calendar_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\PlantingCalendar
```

Get planting calendar recommendations

Multi-parameter planting calendar with climate and soil factors

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\SoilAnalysisApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_planting_calendar_request = new \SoilSidekick\Model\GetPlantingCalendarRequest(); // \SoilSidekick\Model\GetPlantingCalendarRequest
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->getPlantingCalendar($get_planting_calendar_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SoilAnalysisApi->getPlantingCalendar: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_planting_calendar_request** | [**\SoilSidekick\Model\GetPlantingCalendarRequest**](../Model/GetPlantingCalendarRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

### Return type

[**\SoilSidekick\Model\PlantingCalendar**](../Model/PlantingCalendar.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getSoilData()`

```php
getSoilData($get_soil_data_request): \SoilSidekick\Model\SoilData
```

Get soil analysis data

Retrieve comprehensive soil analysis for a specific county

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\SoilAnalysisApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_soil_data_request = new \SoilSidekick\Model\GetSoilDataRequest(); // \SoilSidekick\Model\GetSoilDataRequest

try {
    $result = $apiInstance->getSoilData($get_soil_data_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SoilAnalysisApi->getSoilData: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_soil_data_request** | [**\SoilSidekick\Model\GetSoilDataRequest**](../Model/GetSoilDataRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\SoilData**](../Model/SoilData.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
