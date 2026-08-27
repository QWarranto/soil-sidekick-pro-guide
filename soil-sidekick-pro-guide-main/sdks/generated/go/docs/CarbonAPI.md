# \CarbonAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CalculateCarbonCredits**](CarbonAPI.md#CalculateCarbonCredits) | **Post** /carbon-credit-calculator | Calculate carbon credits



## CalculateCarbonCredits

> CarbonCreditCalculation CalculateCarbonCredits(ctx).CalculateCarbonCreditsRequest(calculateCarbonCreditsRequest).Execute()

Calculate carbon credits



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
	calculateCarbonCreditsRequest := *openapiclient.NewCalculateCarbonCreditsRequest("FieldName_example", float32(123)) // CalculateCarbonCreditsRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CarbonAPI.CalculateCarbonCredits(context.Background()).CalculateCarbonCreditsRequest(calculateCarbonCreditsRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CarbonAPI.CalculateCarbonCredits``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CalculateCarbonCredits`: CarbonCreditCalculation
	fmt.Fprintf(os.Stdout, "Response from `CarbonAPI.CalculateCarbonCredits`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCalculateCarbonCreditsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **calculateCarbonCreditsRequest** | [**CalculateCarbonCreditsRequest**](CalculateCarbonCreditsRequest.md) |  | 

### Return type

[**CarbonCreditCalculation**](CarbonCreditCalculation.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

