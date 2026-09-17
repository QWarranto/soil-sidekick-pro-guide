# SoilSidekick\VRTApi

Variable rate technology and prescription maps

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**generateVRTPrescription()**](VRTApi.md#generateVRTPrescription) | **POST** /generate-vrt-prescription | Generate VRT prescription map |


## `generateVRTPrescription()`

```php
generateVRTPrescription($generate_vrt_prescription_request): \SoilSidekick\Model\VRTPrescription
```

Generate VRT prescription map

Generate variable rate technology prescription maps

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\VRTApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$generate_vrt_prescription_request = new \SoilSidekick\Model\GenerateVRTPrescriptionRequest(); // \SoilSidekick\Model\GenerateVRTPrescriptionRequest

try {
    $result = $apiInstance->generateVRTPrescription($generate_vrt_prescription_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling VRTApi->generateVRTPrescription: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **generate_vrt_prescription_request** | [**\SoilSidekick\Model\GenerateVRTPrescriptionRequest**](../Model/GenerateVRTPrescriptionRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\VRTPrescription**](../Model/VRTPrescription.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
