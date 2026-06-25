# \WaterQualityAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetTerritorialWaterAnalytics**](WaterQualityAPI.md#GetTerritorialWaterAnalytics) | **Post** /territorial-water-analytics | Get territorial water analytics
[**GetWaterQuality**](WaterQualityAPI.md#GetWaterQuality) | **Post** /territorial-water-quality | Get water quality data



## GetTerritorialWaterAnalytics

> TerritorialWaterAnalytics GetTerritorialWaterAnalytics(ctx).GetTerritorialWaterAnalyticsRequest(getTerritorialWaterAnalyticsRequest).Execute()

Get territorial water analytics



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
	getTerritorialWaterAnalyticsRequest := *openapiclient.NewGetTerritorialWaterAnalyticsRequest() // GetTerritorialWaterAnalyticsRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WaterQualityAPI.GetTerritorialWaterAnalytics(context.Background()).GetTerritorialWaterAnalyticsRequest(getTerritorialWaterAnalyticsRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WaterQualityAPI.GetTerritorialWaterAnalytics``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetTerritorialWaterAnalytics`: TerritorialWaterAnalytics
	fmt.Fprintf(os.Stdout, "Response from `WaterQualityAPI.GetTerritorialWaterAnalytics`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetTerritorialWaterAnalyticsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getTerritorialWaterAnalyticsRequest** | [**GetTerritorialWaterAnalyticsRequest**](GetTerritorialWaterAnalyticsRequest.md) |  | 

### Return type

[**TerritorialWaterAnalytics**](TerritorialWaterAnalytics.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetWaterQuality

> WaterQuality GetWaterQuality(ctx).GetSoilDataRequest(getSoilDataRequest).Execute()

Get water quality data



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
	resp, r, err := apiClient.WaterQualityAPI.GetWaterQuality(context.Background()).GetSoilDataRequest(getSoilDataRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WaterQualityAPI.GetWaterQuality``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetWaterQuality`: WaterQuality
	fmt.Fprintf(os.Stdout, "Response from `WaterQualityAPI.GetWaterQuality`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetWaterQualityRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getSoilDataRequest** | [**GetSoilDataRequest**](GetSoilDataRequest.md) |  | 

### Return type

[**WaterQuality**](WaterQuality.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

