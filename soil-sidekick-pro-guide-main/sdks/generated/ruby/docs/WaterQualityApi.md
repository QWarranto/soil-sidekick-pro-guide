# SoilSidekick::WaterQualityApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**get_territorial_water_analytics**](WaterQualityApi.md#get_territorial_water_analytics) | **POST** /territorial-water-analytics | Get territorial water analytics |
| [**get_water_quality**](WaterQualityApi.md#get_water_quality) | **POST** /territorial-water-quality | Get water quality data |


## get_territorial_water_analytics

> <TerritorialWaterAnalytics> get_territorial_water_analytics(get_territorial_water_analytics_request)

Get territorial water analytics

Generate territorial water quality analytics across regions

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

api_instance = SoilSidekick::WaterQualityApi.new
get_territorial_water_analytics_request = SoilSidekick::GetTerritorialWaterAnalyticsRequest.new # GetTerritorialWaterAnalyticsRequest | 

begin
  # Get territorial water analytics
  result = api_instance.get_territorial_water_analytics(get_territorial_water_analytics_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling WaterQualityApi->get_territorial_water_analytics: #{e}"
end
```

#### Using the get_territorial_water_analytics_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<TerritorialWaterAnalytics>, Integer, Hash)> get_territorial_water_analytics_with_http_info(get_territorial_water_analytics_request)

```ruby
begin
  # Get territorial water analytics
  data, status_code, headers = api_instance.get_territorial_water_analytics_with_http_info(get_territorial_water_analytics_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <TerritorialWaterAnalytics>
rescue SoilSidekick::ApiError => e
  puts "Error when calling WaterQualityApi->get_territorial_water_analytics_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_territorial_water_analytics_request** | [**GetTerritorialWaterAnalyticsRequest**](GetTerritorialWaterAnalyticsRequest.md) |  |  |

### Return type

[**TerritorialWaterAnalytics**](TerritorialWaterAnalytics.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## get_water_quality

> <WaterQuality> get_water_quality(get_water_quality_request)

Get water quality data

Retrieve water quality metrics for a specific county

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

api_instance = SoilSidekick::WaterQualityApi.new
get_water_quality_request = SoilSidekick::GetWaterQualityRequest.new({county_fips: '12345'}) # GetWaterQualityRequest | 

begin
  # Get water quality data
  result = api_instance.get_water_quality(get_water_quality_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling WaterQualityApi->get_water_quality: #{e}"
end
```

#### Using the get_water_quality_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<WaterQuality>, Integer, Hash)> get_water_quality_with_http_info(get_water_quality_request)

```ruby
begin
  # Get water quality data
  data, status_code, headers = api_instance.get_water_quality_with_http_info(get_water_quality_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <WaterQuality>
rescue SoilSidekick::ApiError => e
  puts "Error when calling WaterQualityApi->get_water_quality_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_water_quality_request** | [**GetWaterQualityRequest**](GetWaterQualityRequest.md) |  |  |

### Return type

[**WaterQuality**](WaterQuality.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

