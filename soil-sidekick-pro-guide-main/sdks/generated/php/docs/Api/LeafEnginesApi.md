# SoilSidekick\LeafEnginesApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**leafenginesQuery()**](LeafEnginesApi.md#leafenginesQuery) | **POST** /leafengines-query | Query plant-environment compatibility |


## `leafenginesQuery()`

```php
leafenginesQuery($leafengines_query_request): \SoilSidekick\Model\LeafEnginesCompatibility
```

Query plant-environment compatibility

LeafEngines API for plant compatibility scoring with environmental factors

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\LeafEnginesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$leafengines_query_request = new \SoilSidekick\Model\LeafenginesQueryRequest(); // \SoilSidekick\Model\LeafenginesQueryRequest

try {
    $result = $apiInstance->leafenginesQuery($leafengines_query_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling LeafEnginesApi->leafenginesQuery: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **leafengines_query_request** | [**\SoilSidekick\Model\LeafenginesQueryRequest**](../Model/LeafenginesQueryRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\LeafEnginesCompatibility**](../Model/LeafEnginesCompatibility.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
