# SoilSidekick\GeographicApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**countyLookup()**](GeographicApi.md#countyLookup) | **POST** /county-lookup | Search for counties |


## `countyLookup()`

```php
countyLookup($county_lookup_request): \SoilSidekick\Model\CountyLookup200Response
```

Search for counties

Search counties by name, state, or FIPS code

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\GeographicApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$county_lookup_request = new \SoilSidekick\Model\CountyLookupRequest(); // \SoilSidekick\Model\CountyLookupRequest

try {
    $result = $apiInstance->countyLookup($county_lookup_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GeographicApi->countyLookup: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **county_lookup_request** | [**\SoilSidekick\Model\CountyLookupRequest**](../Model/CountyLookupRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\CountyLookup200Response**](../Model/CountyLookup200Response.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
