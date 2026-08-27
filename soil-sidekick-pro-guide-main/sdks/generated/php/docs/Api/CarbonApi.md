# SoilSidekick\CarbonApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**calculateCarbonCredits()**](CarbonApi.md#calculateCarbonCredits) | **POST** /carbon-credit-calculator | Calculate carbon credits |


## `calculateCarbonCredits()`

```php
calculateCarbonCredits($calculate_carbon_credits_request): \SoilSidekick\Model\CarbonCreditCalculation
```

Calculate carbon credits

Calculate carbon credits based on field data and soil organic matter

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\CarbonApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$calculate_carbon_credits_request = new \SoilSidekick\Model\CalculateCarbonCreditsRequest(); // \SoilSidekick\Model\CalculateCarbonCreditsRequest

try {
    $result = $apiInstance->calculateCarbonCredits($calculate_carbon_credits_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CarbonApi->calculateCarbonCredits: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **calculate_carbon_credits_request** | [**\SoilSidekick\Model\CalculateCarbonCreditsRequest**](../Model/CalculateCarbonCreditsRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\CarbonCreditCalculation**](../Model/CarbonCreditCalculation.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
