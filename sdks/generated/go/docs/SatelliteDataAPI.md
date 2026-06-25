# \SatelliteDataAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetSatelliteData**](SatelliteDataAPI.md#GetSatelliteData) | **Post** /alpha-earth-environmental-enhancement | Get satellite environmental data



## GetSatelliteData

> SatelliteData GetSatelliteData(ctx).GetSatelliteDataRequest(getSatelliteDataRequest).Execute()

Get satellite environmental data



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
	getSatelliteDataRequest := *openapiclient.NewGetSatelliteDataRequest(float32(123), float32(123)) // GetSatelliteDataRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SatelliteDataAPI.GetSatelliteData(context.Background()).GetSatelliteDataRequest(getSatelliteDataRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SatelliteDataAPI.GetSatelliteData``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetSatelliteData`: SatelliteData
	fmt.Fprintf(os.Stdout, "Response from `SatelliteDataAPI.GetSatelliteData`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetSatelliteDataRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getSatelliteDataRequest** | [**GetSatelliteDataRequest**](GetSatelliteDataRequest.md) |  | 

### Return type

[**SatelliteData**](SatelliteData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

