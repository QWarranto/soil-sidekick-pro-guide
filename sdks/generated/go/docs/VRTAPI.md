# \VRTAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GenerateVRTPrescription**](VRTAPI.md#GenerateVRTPrescription) | **Post** /generate-vrt-prescription | Generate VRT prescription map



## GenerateVRTPrescription

> VRTPrescription GenerateVRTPrescription(ctx).GenerateVRTPrescriptionRequest(generateVRTPrescriptionRequest).Execute()

Generate VRT prescription map



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
	generateVRTPrescriptionRequest := *openapiclient.NewGenerateVRTPrescriptionRequest("FieldId_example", "ApplicationType_example") // GenerateVRTPrescriptionRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.VRTAPI.GenerateVRTPrescription(context.Background()).GenerateVRTPrescriptionRequest(generateVRTPrescriptionRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `VRTAPI.GenerateVRTPrescription``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GenerateVRTPrescription`: VRTPrescription
	fmt.Fprintf(os.Stdout, "Response from `VRTAPI.GenerateVRTPrescription`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGenerateVRTPrescriptionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **generateVRTPrescriptionRequest** | [**GenerateVRTPrescriptionRequest**](GenerateVRTPrescriptionRequest.md) |  | 

### Return type

[**VRTPrescription**](VRTPrescription.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

