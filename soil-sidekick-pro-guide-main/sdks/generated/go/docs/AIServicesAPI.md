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
	xTqContextMode := openapiclient.TQContextMode("standard") // TQContextMode | TurboQuant context mode for AI tools (optional)
	xTqKvCacheHint := openapiclient.TQKVCacheHint("none") // TQKVCacheHint | TurboQuant KV cache compression hint (optional)
	xTqModelTier := openapiclient.TQModelTier("starter") // TQModelTier | Preferred model tier for TurboQuant optimization (optional)

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
 **xTqContextMode** | [**TQContextMode**](TQContextMode.md) | TurboQuant context mode for AI tools | 
 **xTqKvCacheHint** | [**TQKVCacheHint**](TQKVCacheHint.md) | TurboQuant KV cache compression hint | 
 **xTqModelTier** | [**TQModelTier**](TQModelTier.md) | Preferred model tier for TurboQuant optimization | 

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
	xTqContextMode := openapiclient.TQContextMode("standard") // TQContextMode | TurboQuant context mode for AI tools (optional)
	xTqKvCacheHint := openapiclient.TQKVCacheHint("none") // TQKVCacheHint | TurboQuant KV cache compression hint (optional)
	xTqModelTier := openapiclient.TQModelTier("starter") // TQModelTier | Preferred model tier for TurboQuant optimization (optional)

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
 **xTqContextMode** | [**TQContextMode**](TQContextMode.md) | TurboQuant context mode for AI tools | 
 **xTqKvCacheHint** | [**TQKVCacheHint**](TQKVCacheHint.md) | TurboQuant KV cache compression hint | 
 **xTqModelTier** | [**TQModelTier**](TQModelTier.md) | Preferred model tier for TurboQuant optimization | 

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
	xTqContextMode := openapiclient.TQContextMode("standard") // TQContextMode | TurboQuant context mode for AI tools (optional)
	xTqKvCacheHint := openapiclient.TQKVCacheHint("none") // TQKVCacheHint | TurboQuant KV cache compression hint (optional)
	xTqModelTier := openapiclient.TQModelTier("starter") // TQModelTier | Preferred model tier for TurboQuant optimization (optional)

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
 **xTqContextMode** | [**TQContextMode**](TQContextMode.md) | TurboQuant context mode for AI tools | 
 **xTqKvCacheHint** | [**TQKVCacheHint**](TQKVCacheHint.md) | TurboQuant KV cache compression hint | 
 **xTqModelTier** | [**TQModelTier**](TQModelTier.md) | Preferred model tier for TurboQuant optimization | 

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

> VisualCropAnalysis VisualCropAnalysis(ctx).VisualCropAnalysisRequest(visualCropAnalysisRequest).Execute()

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AIServicesAPI.VisualCropAnalysis(context.Background()).VisualCropAnalysisRequest(visualCropAnalysisRequest).Execute()
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

