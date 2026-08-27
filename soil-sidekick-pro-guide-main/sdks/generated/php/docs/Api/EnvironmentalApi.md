# SoilSidekick\EnvironmentalApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**calculateEnvironmentalImpact()**](EnvironmentalApi.md#calculateEnvironmentalImpact) | **POST** /environmental-impact-engine | Calculate environmental impact |


## `calculateEnvironmentalImpact()`

```php
calculateEnvironmentalImpact($calculate_environmental_impact_request): \SoilSidekick\Model\EnvironmentalImpact
```

Calculate environmental impact

Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\EnvironmentalApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$calculate_environmental_impact_request = new \SoilSidekick\Model\CalculateEnvironmentalImpactRequest(); // \SoilSidekick\Model\CalculateEnvironmentalImpactRequest

try {
    $result = $apiInstance->calculateEnvironmentalImpact($calculate_environmental_impact_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling EnvironmentalApi->calculateEnvironmentalImpact: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **calculate_environmental_impact_request** | [**\SoilSidekick\Model\CalculateEnvironmentalImpactRequest**](../Model/CalculateEnvironmentalImpactRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\EnvironmentalImpact**](../Model/EnvironmentalImpact.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
