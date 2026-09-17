# SoilSidekick\EnvironmentalApi

Environmental impact and analytics

All URIs are relative to https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**calculateEnvironmentalImpact()**](EnvironmentalApi.md#calculateEnvironmentalImpact) | **POST** /environmental-impact-engine | Calculate environmental impact |


## `calculateEnvironmentalImpact()`

```php
calculateEnvironmentalImpact($calculate_environmental_impact_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier): \SoilSidekick\Model\EnvironmentalImpact
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
$x_tq_context_mode = 4096; // int | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.
$x_tq_kv_cache_hint = 'none'; // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse
$x_tq_model_tier = 'auto'; // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)

try {
    $result = $apiInstance->calculateEnvironmentalImpact($calculate_environmental_impact_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling EnvironmentalApi->calculateEnvironmentalImpact: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **calculate_environmental_impact_request** | [**\SoilSidekick\Model\CalculateEnvironmentalImpactRequest**](../Model/CalculateEnvironmentalImpactRequest.md)|  | |
| **x_tq_context_mode** | **int**| TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. | [optional] [default to 4096] |
| **x_tq_kv_cache_hint** | **string**| KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse | [optional] [default to &#39;none&#39;] |
| **x_tq_model_tier** | **string**| Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB) | [optional] [default to &#39;auto&#39;] |

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
