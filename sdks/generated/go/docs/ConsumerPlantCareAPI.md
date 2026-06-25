# \ConsumerPlantCareAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**BeginnerGuidance**](ConsumerPlantCareAPI.md#BeginnerGuidance) | **Post** /beginner-guidance | Beginner-friendly plant guidance without jargon
[**DynamicCare**](ConsumerPlantCareAPI.md#DynamicCare) | **Post** /dynamic-care | Hyper-localized dynamic plant care recommendations
[**SafeIdentification**](ConsumerPlantCareAPI.md#SafeIdentification) | **Post** /safe-identification | Safe plant identification with toxic lookalike warnings



## BeginnerGuidance

> BeginnerGuidance BeginnerGuidance(ctx).BeginnerGuidanceRequest(beginnerGuidanceRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Beginner-friendly plant guidance without jargon



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID/soilsidekick"
)

func main() {
	beginnerGuidanceRequest := *openapiclient.NewBeginnerGuidanceRequest("My plant has yellow leaves, what's wrong?") // BeginnerGuidanceRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.BeginnerGuidance(context.Background()).BeginnerGuidanceRequest(beginnerGuidanceRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ConsumerPlantCareAPI.BeginnerGuidance``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `BeginnerGuidance`: BeginnerGuidance
	fmt.Fprintf(os.Stdout, "Response from `ConsumerPlantCareAPI.BeginnerGuidance`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiBeginnerGuidanceRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **beginnerGuidanceRequest** | [**BeginnerGuidanceRequest**](BeginnerGuidanceRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**BeginnerGuidance**](BeginnerGuidance.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DynamicCare

> DynamicCare DynamicCare(ctx).DynamicCareRequest(dynamicCareRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Hyper-localized dynamic plant care recommendations



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID/soilsidekick"
)

func main() {
	dynamicCareRequest := *openapiclient.NewDynamicCareRequest("Monstera deliciosa", *openapiclient.NewDynamicCareRequestLocation("CountyFips_example")) // DynamicCareRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.DynamicCare(context.Background()).DynamicCareRequest(dynamicCareRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ConsumerPlantCareAPI.DynamicCare``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DynamicCare`: DynamicCare
	fmt.Fprintf(os.Stdout, "Response from `ConsumerPlantCareAPI.DynamicCare`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiDynamicCareRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dynamicCareRequest** | [**DynamicCareRequest**](DynamicCareRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**DynamicCare**](DynamicCare.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SafeIdentification

> SafeIdentification SafeIdentification(ctx).SafeIdentificationRequest(safeIdentificationRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Safe plant identification with toxic lookalike warnings



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID/soilsidekick"
)

func main() {
	safeIdentificationRequest := *openapiclient.NewSafeIdentificationRequest("Image_example") // SafeIdentificationRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.SafeIdentification(context.Background()).SafeIdentificationRequest(safeIdentificationRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ConsumerPlantCareAPI.SafeIdentification``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SafeIdentification`: SafeIdentification
	fmt.Fprintf(os.Stdout, "Response from `ConsumerPlantCareAPI.SafeIdentification`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSafeIdentificationRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **safeIdentificationRequest** | [**SafeIdentificationRequest**](SafeIdentificationRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**SafeIdentification**](SafeIdentification.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

