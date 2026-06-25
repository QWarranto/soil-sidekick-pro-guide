# \SoilAnalysisAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetLiveAgriculturalData**](SoilAnalysisAPI.md#GetLiveAgriculturalData) | **Post** /live-agricultural-data | Get live agricultural data
[**GetPlantingCalendar**](SoilAnalysisAPI.md#GetPlantingCalendar) | **Post** /multi-parameter-planting-calendar | Get planting calendar recommendations
[**GetSoilData**](SoilAnalysisAPI.md#GetSoilData) | **Post** /get-soil-data | Get soil analysis data



## GetLiveAgriculturalData

> LiveAgriculturalData GetLiveAgriculturalData(ctx).GetLiveAgriculturalDataRequest(getLiveAgriculturalDataRequest).Execute()

Get live agricultural data



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
	getLiveAgriculturalDataRequest := *openapiclient.NewGetLiveAgriculturalDataRequest("CountyFips_example", []string{"DataTypes_example"}, "StateCode_example", "CountyName_example") // GetLiveAgriculturalDataRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SoilAnalysisAPI.GetLiveAgriculturalData(context.Background()).GetLiveAgriculturalDataRequest(getLiveAgriculturalDataRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SoilAnalysisAPI.GetLiveAgriculturalData``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetLiveAgriculturalData`: LiveAgriculturalData
	fmt.Fprintf(os.Stdout, "Response from `SoilAnalysisAPI.GetLiveAgriculturalData`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetLiveAgriculturalDataRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getLiveAgriculturalDataRequest** | [**GetLiveAgriculturalDataRequest**](GetLiveAgriculturalDataRequest.md) |  | 

### Return type

[**LiveAgriculturalData**](LiveAgriculturalData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetPlantingCalendar

> PlantingCalendar GetPlantingCalendar(ctx).GetPlantingCalendarRequest(getPlantingCalendarRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()

Get planting calendar recommendations



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
	getPlantingCalendarRequest := *openapiclient.NewGetPlantingCalendarRequest("CountyFips_example", "corn") // GetPlantingCalendarRequest | 
	xTqContextMode := int32(56) // int32 | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  (optional) (default to 4096)
	xTqKvCacheHint := "xTqKvCacheHint_example" // string | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse  (optional) (default to "none")
	xTqModelTier := "xTqModelTier_example" // string | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB)  (optional) (default to "auto")

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SoilAnalysisAPI.GetPlantingCalendar(context.Background()).GetPlantingCalendarRequest(getPlantingCalendarRequest).XTqContextMode(xTqContextMode).XTqKvCacheHint(xTqKvCacheHint).XTqModelTier(xTqModelTier).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SoilAnalysisAPI.GetPlantingCalendar``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetPlantingCalendar`: PlantingCalendar
	fmt.Fprintf(os.Stdout, "Response from `SoilAnalysisAPI.GetPlantingCalendar`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetPlantingCalendarRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPlantingCalendarRequest** | [**GetPlantingCalendarRequest**](GetPlantingCalendarRequest.md) |  | 
 **xTqContextMode** | **int32** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [default to 4096]
 **xTqKvCacheHint** | **string** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [default to &quot;none&quot;]
 **xTqModelTier** | **string** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [default to &quot;auto&quot;]

### Return type

[**PlantingCalendar**](PlantingCalendar.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetSoilData

> SoilData GetSoilData(ctx).GetSoilDataRequest(getSoilDataRequest).Execute()

Get soil analysis data



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
	getSoilDataRequest := *openapiclient.NewGetSoilDataRequest("12345") // GetSoilDataRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SoilAnalysisAPI.GetSoilData(context.Background()).GetSoilDataRequest(getSoilDataRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SoilAnalysisAPI.GetSoilData``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetSoilData`: SoilData
	fmt.Fprintf(os.Stdout, "Response from `SoilAnalysisAPI.GetSoilData`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetSoilDataRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getSoilDataRequest** | [**GetSoilDataRequest**](GetSoilDataRequest.md) |  | 

### Return type

[**SoilData**](SoilData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

