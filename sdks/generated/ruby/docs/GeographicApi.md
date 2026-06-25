# SoilSidekick::GeographicApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**county_lookup**](GeographicApi.md#county_lookup) | **POST** /county-lookup | Search for counties |


## county_lookup

> <CountyLookup200Response> county_lookup(county_lookup_request)

Search for counties

Search counties by name, state, or FIPS code

### Examples

```ruby
require 'time'
require 'soilsidekick'
# setup authorization
SoilSidekick.configure do |config|
  # Configure API key authorization: ApiKeyAuth
  config.api_key['x-api-key'] = 'YOUR API KEY'
  # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
  # config.api_key_prefix['x-api-key'] = 'Bearer'
end

api_instance = SoilSidekick::GeographicApi.new
county_lookup_request = SoilSidekick::CountyLookupRequest.new({term: 'Miami-Dade'}) # CountyLookupRequest | 

begin
  # Search for counties
  result = api_instance.county_lookup(county_lookup_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling GeographicApi->county_lookup: #{e}"
end
```

#### Using the county_lookup_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<CountyLookup200Response>, Integer, Hash)> county_lookup_with_http_info(county_lookup_request)

```ruby
begin
  # Search for counties
  data, status_code, headers = api_instance.county_lookup_with_http_info(county_lookup_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <CountyLookup200Response>
rescue SoilSidekick::ApiError => e
  puts "Error when calling GeographicApi->county_lookup_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **county_lookup_request** | [**CountyLookupRequest**](CountyLookupRequest.md) |  |  |

### Return type

[**CountyLookup200Response**](CountyLookup200Response.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

