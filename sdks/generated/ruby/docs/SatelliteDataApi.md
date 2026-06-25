# SoilSidekick::SatelliteDataApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**get_satellite_data**](SatelliteDataApi.md#get_satellite_data) | **POST** /alpha-earth-environmental-enhancement | Get satellite environmental data |


## get_satellite_data

> <SatelliteData> get_satellite_data(get_satellite_data_request)

Get satellite environmental data

AlphaEarth satellite intelligence integration

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

api_instance = SoilSidekick::SatelliteDataApi.new
get_satellite_data_request = SoilSidekick::GetSatelliteDataRequest.new({latitude: 3.56, longitude: 3.56}) # GetSatelliteDataRequest | 

begin
  # Get satellite environmental data
  result = api_instance.get_satellite_data(get_satellite_data_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling SatelliteDataApi->get_satellite_data: #{e}"
end
```

#### Using the get_satellite_data_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<SatelliteData>, Integer, Hash)> get_satellite_data_with_http_info(get_satellite_data_request)

```ruby
begin
  # Get satellite environmental data
  data, status_code, headers = api_instance.get_satellite_data_with_http_info(get_satellite_data_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <SatelliteData>
rescue SoilSidekick::ApiError => e
  puts "Error when calling SatelliteDataApi->get_satellite_data_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_satellite_data_request** | [**GetSatelliteDataRequest**](GetSatelliteDataRequest.md) |  |  |

### Return type

[**SatelliteData**](SatelliteData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

