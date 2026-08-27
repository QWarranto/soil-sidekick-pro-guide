# SoilSidekick::LeafEnginesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**leafengines_query**](LeafEnginesApi.md#leafengines_query) | **POST** /leafengines-query | Query plant-environment compatibility |


## leafengines_query

> <LeafEnginesCompatibility> leafengines_query(leafengines_query_request)

Query plant-environment compatibility

LeafEngines API for plant compatibility scoring with environmental factors

### Examples

```ruby
require 'time'
require 'soilsidekick'
# setup authorization
SoilSidekick.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['ApiKeyAuth'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['ApiKeyAuth'] = 'Bearer'
end

api_instance = SoilSidekick::LeafEnginesApi.new
leafengines_query_request = SoilSidekick::LeafenginesQueryRequest.new({location: SoilSidekick::LeafenginesQueryRequestLocation.new, plant: SoilSidekick::LeafenginesQueryRequestPlant.new}) # LeafenginesQueryRequest | 

begin
  # Query plant-environment compatibility
  result = api_instance.leafengines_query(leafengines_query_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling LeafEnginesApi->leafengines_query: #{e}"
end
```

#### Using the leafengines_query_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<LeafEnginesCompatibility>, Integer, Hash)> leafengines_query_with_http_info(leafengines_query_request)

```ruby
begin
  # Query plant-environment compatibility
  data, status_code, headers = api_instance.leafengines_query_with_http_info(leafengines_query_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <LeafEnginesCompatibility>
rescue SoilSidekick::ApiError => e
  puts "Error when calling LeafEnginesApi->leafengines_query_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **leafengines_query_request** | [**LeafenginesQueryRequest**](LeafenginesQueryRequest.md) |  |  |

### Return type

[**LeafEnginesCompatibility**](LeafEnginesCompatibility.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

