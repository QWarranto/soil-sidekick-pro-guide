# SoilSidekick\SatelliteDataApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getSatelliteData()**](SatelliteDataApi.md#getSatelliteData) | **POST** /alpha-earth-environmental-enhancement | Get satellite environmental data |


## `getSatelliteData()`

```php
getSatelliteData($get_satellite_data_request): \SoilSidekick\Model\SatelliteData
```

Get satellite environmental data

AlphaEarth satellite intelligence integration

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\SatelliteDataApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$get_satellite_data_request = new \SoilSidekick\Model\GetSatelliteDataRequest(); // \SoilSidekick\Model\GetSatelliteDataRequest

try {
    $result = $apiInstance->getSatelliteData($get_satellite_data_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SatelliteDataApi->getSatelliteData: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **get_satellite_data_request** | [**\SoilSidekick\Model\GetSatelliteDataRequest**](../Model/GetSatelliteDataRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\SatelliteData**](../Model/SatelliteData.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
