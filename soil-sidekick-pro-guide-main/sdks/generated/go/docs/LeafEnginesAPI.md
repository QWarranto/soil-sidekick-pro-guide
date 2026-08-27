# \LeafEnginesAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**LeafenginesQuery**](LeafEnginesAPI.md#LeafenginesQuery) | **Post** /leafengines-query | Query plant-environment compatibility



## LeafenginesQuery

> LeafEnginesCompatibility LeafenginesQuery(ctx).LeafenginesQueryRequest(leafenginesQueryRequest).Execute()

Query plant-environment compatibility



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
	leafenginesQueryRequest := *openapiclient.NewLeafenginesQueryRequest(*openapiclient.NewLeafenginesQueryRequestLocation(), *openapiclient.NewLeafenginesQueryRequestPlant()) // LeafenginesQueryRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.LeafEnginesAPI.LeafenginesQuery(context.Background()).LeafenginesQueryRequest(leafenginesQueryRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `LeafEnginesAPI.LeafenginesQuery``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `LeafenginesQuery`: LeafEnginesCompatibility
	fmt.Fprintf(os.Stdout, "Response from `LeafEnginesAPI.LeafenginesQuery`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiLeafenginesQueryRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **leafenginesQueryRequest** | [**LeafenginesQueryRequest**](LeafenginesQueryRequest.md) |  | 

### Return type

[**LeafEnginesCompatibility**](LeafEnginesCompatibility.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

