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

> PlantingCalendar GetPlantingCalendar(ctx).GetPlantingCalendarRequest(getPlantingCalendarRequest).Execute()

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SoilAnalysisAPI.GetPlantingCalendar(context.Background()).GetPlantingCalendarRequest(getPlantingCalendarRequest).Execute()
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

