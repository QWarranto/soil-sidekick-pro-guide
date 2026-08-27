# SoilSidekick\ConsumerPlantCareApi

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**beginnerGuidance()**](ConsumerPlantCareApi.md#beginnerGuidance) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon |
| [**dynamicCare()**](ConsumerPlantCareApi.md#dynamicCare) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations |
| [**safeIdentification()**](ConsumerPlantCareApi.md#safeIdentification) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings |


## `beginnerGuidance()`

```php
beginnerGuidance($beginner_guidance_request): \SoilSidekick\Model\BeginnerGuidance
```

Beginner-friendly plant guidance without jargon

Judgment-free, accessible plant guidance that solves community gatekeeping issues. This endpoint: - Translates scientific jargon into plain language - Never makes users feel stupid for asking about common plants - Uses progressive disclosure (simple answer first, details on request) - Provides encouraging, supportive tone - Offers practical \"what do I do right now\" guidance

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\ConsumerPlantCareApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$beginner_guidance_request = new \SoilSidekick\Model\BeginnerGuidanceRequest(); // \SoilSidekick\Model\BeginnerGuidanceRequest

try {
    $result = $apiInstance->beginnerGuidance($beginner_guidance_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ConsumerPlantCareApi->beginnerGuidance: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **beginner_guidance_request** | [**\SoilSidekick\Model\BeginnerGuidanceRequest**](../Model/BeginnerGuidanceRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\BeginnerGuidance**](../Model/BeginnerGuidance.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `dynamicCare()`

```php
dynamicCare($dynamic_care_request): \SoilSidekick\Model\DynamicCare
```

Hyper-localized dynamic plant care recommendations

Real-time, environment-aware care recommendations that solve the \"generic advice\" problem. Unlike static \"water every 7 days\" recommendations, this endpoint: - Adjusts watering based on current humidity, temperature, and recent rainfall - Considers container type, soil composition, and drainage - Factors in seasonal changes and indoor environment conditions - Accounts for plant maturity and growth phase - Provides actionable guidance, not rigid schedules

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\ConsumerPlantCareApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$dynamic_care_request = new \SoilSidekick\Model\DynamicCareRequest(); // \SoilSidekick\Model\DynamicCareRequest

try {
    $result = $apiInstance->dynamicCare($dynamic_care_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ConsumerPlantCareApi->dynamicCare: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **dynamic_care_request** | [**\SoilSidekick\Model\DynamicCareRequest**](../Model/DynamicCareRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\DynamicCare**](../Model/DynamicCare.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `safeIdentification()`

```php
safeIdentification($safe_identification_request): \SoilSidekick\Model\SafeIdentification
```

Safe plant identification with toxic lookalike warnings

Environmentally-contextualized plant identification that addresses misidentification concerns. Unlike generic plant ID, this endpoint: - Checks against a toxic lookalike database with visual similarity scores - Uses environmental context (soil, climate, regional flora) to weight identification probability - Provides confidence breakdowns showing why alternatives were considered - Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot) - Accounts for plant growth stage (seedling identification challenges)

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\ConsumerPlantCareApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$safe_identification_request = new \SoilSidekick\Model\SafeIdentificationRequest(); // \SoilSidekick\Model\SafeIdentificationRequest

try {
    $result = $apiInstance->safeIdentification($safe_identification_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ConsumerPlantCareApi->safeIdentification: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **safe_identification_request** | [**\SoilSidekick\Model\SafeIdentificationRequest**](../Model/SafeIdentificationRequest.md)|  | |

### Return type

[**\SoilSidekick\Model\SafeIdentification**](../Model/SafeIdentification.md)

### Authorization

[ApiKeyAuth](../../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
