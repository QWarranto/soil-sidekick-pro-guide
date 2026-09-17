# \GeographicAPI

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CountyLookup**](GeographicAPI.md#CountyLookup) | **Post** /county-lookup | Search for counties



## CountyLookup

> CountyLookup200Response CountyLookup(ctx).CountyLookupRequest(countyLookupRequest).Execute()

Search for counties



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
	countyLookupRequest := *openapiclient.NewCountyLookupRequest("Miami-Dade") // CountyLookupRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GeographicAPI.CountyLookup(context.Background()).CountyLookupRequest(countyLookupRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GeographicAPI.CountyLookup``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CountyLookup`: CountyLookup200Response
	fmt.Fprintf(os.Stdout, "Response from `GeographicAPI.CountyLookup`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCountyLookupRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **countyLookupRequest** | [**CountyLookupRequest**](CountyLookupRequest.md) |  | 

### Return type

[**CountyLookup200Response**](CountyLookup200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

