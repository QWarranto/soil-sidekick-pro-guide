# SoilSidekick\WaterQualityApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getTerritorialWaterAnalytics()**](WaterQualityApi.md#getTerritorialWaterAnalytics) | **POST** /territorial-water-analytics | Get territorial water analytics |
| [**getWaterQuality()**](WaterQualityApi.md#getWaterQuality) | **POST** /territorial-water-quality | Get water quality data |


## `getTerritorialWaterAnalytics()`

```php
getTerritorialWaterAnalytics($get_territorial_water_analytics_request): \SoilSidekick\Model\TerritorialWaterAnalytics
```

Get territorial water analytics

Generate territorial water quality analytics across regions

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\WaterQualityApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_territorial_water_analytics_request = new \SoilSidekick\Model\GetTerritorialWaterAnalyticsRequest(); // \SoilSidekick\Model\GetTerritorialWaterAnalyticsRequest

try {
    $result = $apiInstance->getTerritorialWaterAnalytics($get_territorial_water_analytics_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WaterQualityApi->getTerritorialWaterAnalytics: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_territorial_water_analytics_request** | [**\SoilSidekick\Model\GetTerritorialWaterAnalyticsRequest**](../Model/GetTerritorialWaterAnalyticsRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\TerritorialWaterAnalytics**](../Model/TerritorialWaterAnalytics.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getWaterQuality()`

```php
getWaterQuality($get_water_quality_request): \SoilSidekick\Model\WaterQuality
```

Get water quality data

Retrieve water quality metrics for a specific county

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\WaterQualityApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_water_quality_request = new \SoilSidekick\Model\GetWaterQualityRequest(); // \SoilSidekick\Model\GetWaterQualityRequest

try {
    $result = $apiInstance->getWaterQuality($get_water_quality_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WaterQualityApi->getWaterQuality: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_water_quality_request** | [**\SoilSidekick\Model\GetWaterQualityRequest**](../Model/GetWaterQualityRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\WaterQuality**](../Model/WaterQuality.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
