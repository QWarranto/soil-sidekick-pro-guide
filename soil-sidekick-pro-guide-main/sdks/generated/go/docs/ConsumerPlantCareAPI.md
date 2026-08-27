# \ConsumerPlantCareAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**BeginnerGuidance**](ConsumerPlantCareAPI.md#BeginnerGuidance) | **Post** /beginner-guidance | Beginner-friendly plant guidance without jargon
[**DynamicCare**](ConsumerPlantCareAPI.md#DynamicCare) | **Post** /dynamic-care | Hyper-localized dynamic plant care recommendations
[**SafeIdentification**](ConsumerPlantCareAPI.md#SafeIdentification) | **Post** /safe-identification | Safe plant identification with toxic lookalike warnings



## BeginnerGuidance

> BeginnerGuidance BeginnerGuidance(ctx).BeginnerGuidanceRequest(beginnerGuidanceRequest).Execute()

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.BeginnerGuidance(context.Background()).BeginnerGuidanceRequest(beginnerGuidanceRequest).Execute()
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

> DynamicCare DynamicCare(ctx).DynamicCareRequest(dynamicCareRequest).Execute()

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.DynamicCare(context.Background()).DynamicCareRequest(dynamicCareRequest).Execute()
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

> SafeIdentification SafeIdentification(ctx).SafeIdentificationRequest(safeIdentificationRequest).Execute()

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ConsumerPlantCareAPI.SafeIdentification(context.Background()).SafeIdentificationRequest(safeIdentificationRequest).Execute()
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

