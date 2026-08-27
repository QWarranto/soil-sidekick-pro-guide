# \EnvironmentalAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CalculateEnvironmentalImpact**](EnvironmentalAPI.md#CalculateEnvironmentalImpact) | **Post** /environmental-impact-engine | Calculate environmental impact



## CalculateEnvironmentalImpact

> EnvironmentalImpact CalculateEnvironmentalImpact(ctx).CalculateEnvironmentalImpactRequest(calculateEnvironmentalImpactRequest).Execute()

Calculate environmental impact



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
	calculateEnvironmentalImpactRequest := *openapiclient.NewCalculateEnvironmentalImpactRequest("AnalysisId_example", "CountyFips_example", *openapiclient.NewCalculateEnvironmentalImpactRequestSoilData()) // CalculateEnvironmentalImpactRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EnvironmentalAPI.CalculateEnvironmentalImpact(context.Background()).CalculateEnvironmentalImpactRequest(calculateEnvironmentalImpactRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EnvironmentalAPI.CalculateEnvironmentalImpact``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CalculateEnvironmentalImpact`: EnvironmentalImpact
	fmt.Fprintf(os.Stdout, "Response from `EnvironmentalAPI.CalculateEnvironmentalImpact`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCalculateEnvironmentalImpactRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **calculateEnvironmentalImpactRequest** | [**CalculateEnvironmentalImpactRequest**](CalculateEnvironmentalImpactRequest.md) |  | 

### Return type

[**EnvironmentalImpact**](EnvironmentalImpact.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

