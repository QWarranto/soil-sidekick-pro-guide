# \AIServicesAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GenerateSmartReportSummary**](AIServicesAPI.md#GenerateSmartReportSummary) | **Post** /smart-report-summary | Generate AI report summary
[**GetAgriculturalIntelligence**](AIServicesAPI.md#GetAgriculturalIntelligence) | **Post** /agricultural-intelligence | Get AI-powered agricultural insights
[**GetSeasonalPlanningAssistant**](AIServicesAPI.md#GetSeasonalPlanningAssistant) | **Post** /seasonal-planning-assistant | Get seasonal planning recommendations
[**VisualCropAnalysis**](AIServicesAPI.md#VisualCropAnalysis) | **Post** /visual-crop-analysis | Analyze crop images



## GenerateSmartReportSummary

> SmartReportSummary GenerateSmartReportSummary(ctx).GenerateSmartReportSummaryRequest(generateSmartReportSummaryRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Generate AI report summary



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
	generateSmartReportSummaryRequest := *openapiclient.NewGenerateSmartReportSummaryRequest("ReportType_example", map[string]interface{}(123)) // GenerateSmartReportSummaryRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AIServicesAPI.GenerateSmartReportSummary(context.Background()).GenerateSmartReportSummaryRequest(generateSmartReportSummaryRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AIServicesAPI.GenerateSmartReportSummary``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GenerateSmartReportSummary`: SmartReportSummary
	fmt.Fprintf(os.Stdout, "Response from `AIServicesAPI.GenerateSmartReportSummary`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGenerateSmartReportSummaryRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **generateSmartReportSummaryRequest** | [**GenerateSmartReportSummaryRequest**](GenerateSmartReportSummaryRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**SmartReportSummary**](SmartReportSummary.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetAgriculturalIntelligence

> AIAnalysis GetAgriculturalIntelligence(ctx).GetAgriculturalIntelligenceRequest(getAgriculturalIntelligenceRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Get AI-powered agricultural insights



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
	getAgriculturalIntelligenceRequest := *openapiclient.NewGetAgriculturalIntelligenceRequest("CountyFips_example", "AnalysisType_example") // GetAgriculturalIntelligenceRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AIServicesAPI.GetAgriculturalIntelligence(context.Background()).GetAgriculturalIntelligenceRequest(getAgriculturalIntelligenceRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AIServicesAPI.GetAgriculturalIntelligence``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetAgriculturalIntelligence`: AIAnalysis
	fmt.Fprintf(os.Stdout, "Response from `AIServicesAPI.GetAgriculturalIntelligence`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetAgriculturalIntelligenceRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getAgriculturalIntelligenceRequest** | [**GetAgriculturalIntelligenceRequest**](GetAgriculturalIntelligenceRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**AIAnalysis**](AIAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetSeasonalPlanningAssistant

> SeasonalPlanningResponse GetSeasonalPlanningAssistant(ctx).GetSeasonalPlanningAssistantRequest(getSeasonalPlanningAssistantRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Get seasonal planning recommendations



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
	getSeasonalPlanningAssistantRequest := *openapiclient.NewGetSeasonalPlanningAssistantRequest(*openapiclient.NewGetSeasonalPlanningAssistantRequestLocation(), "PlanningType_example") // GetSeasonalPlanningAssistantRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AIServicesAPI.GetSeasonalPlanningAssistant(context.Background()).GetSeasonalPlanningAssistantRequest(getSeasonalPlanningAssistantRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AIServicesAPI.GetSeasonalPlanningAssistant``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetSeasonalPlanningAssistant`: SeasonalPlanningResponse
	fmt.Fprintf(os.Stdout, "Response from `AIServicesAPI.GetSeasonalPlanningAssistant`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetSeasonalPlanningAssistantRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getSeasonalPlanningAssistantRequest** | [**GetSeasonalPlanningAssistantRequest**](GetSeasonalPlanningAssistantRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**SeasonalPlanningResponse**](SeasonalPlanningResponse.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## VisualCropAnalysis

> VisualCropAnalysis VisualCropAnalysis(ctx).VisualCropAnalysisRequest(visualCropAnalysisRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Analyze crop images



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
	visualCropAnalysisRequest := *openapiclient.NewVisualCropAnalysisRequest("Image_example", "AnalysisType_example") // VisualCropAnalysisRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AIServicesAPI.VisualCropAnalysis(context.Background()).VisualCropAnalysisRequest(visualCropAnalysisRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AIServicesAPI.VisualCropAnalysis``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `VisualCropAnalysis`: VisualCropAnalysis
	fmt.Fprintf(os.Stdout, "Response from `AIServicesAPI.VisualCropAnalysis`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiVisualCropAnalysisRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **visualCropAnalysisRequest** | [**VisualCropAnalysisRequest**](VisualCropAnalysisRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**VisualCropAnalysis**](VisualCropAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

