# SoilSidekick::SoilAnalysisApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**get_live_agricultural_data**](SoilAnalysisApi.md#get_live_agricultural_data) | **POST** /live-agricultural-data | Get live agricultural data |
| [**get_planting_calendar**](SoilAnalysisApi.md#get_planting_calendar) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations |
| [**get_soil_data**](SoilAnalysisApi.md#get_soil_data) | **POST** /get-soil-data | Get soil analysis data |


## get_live_agricultural_data

> <LiveAgriculturalData> get_live_agricultural_data(get_live_agricultural_data_request)

Get live agricultural data

Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)

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

api_instance = SoilSidekick::SoilAnalysisApi.new
get_live_agricultural_data_request = SoilSidekick::GetLiveAgriculturalDataRequest.new({county_fips: 'county_fips_example', data_types: ['weather'], state_code: 'state_code_example', county_name: 'county_name_example'}) # GetLiveAgriculturalDataRequest | 

begin
  # Get live agricultural data
  result = api_instance.get_live_agricultural_data(get_live_agricultural_data_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_live_agricultural_data: #{e}"
end
```

#### Using the get_live_agricultural_data_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<LiveAgriculturalData>, Integer, Hash)> get_live_agricultural_data_with_http_info(get_live_agricultural_data_request)

```ruby
begin
  # Get live agricultural data
  data, status_code, headers = api_instance.get_live_agricultural_data_with_http_info(get_live_agricultural_data_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <LiveAgriculturalData>
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_live_agricultural_data_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_live_agricultural_data_request** | [**GetLiveAgriculturalDataRequest**](GetLiveAgriculturalDataRequest.md) |  |  |

### Return type

[**LiveAgriculturalData**](LiveAgriculturalData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## get_planting_calendar

> <PlantingCalendar> get_planting_calendar(get_planting_calendar_request)

Get planting calendar recommendations

Multi-parameter planting calendar with climate and soil factors

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

api_instance = SoilSidekick::SoilAnalysisApi.new
get_planting_calendar_request = SoilSidekick::GetPlantingCalendarRequest.new({county_fips: 'county_fips_example', crop_type: 'corn'}) # GetPlantingCalendarRequest | 

begin
  # Get planting calendar recommendations
  result = api_instance.get_planting_calendar(get_planting_calendar_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_planting_calendar: #{e}"
end
```

#### Using the get_planting_calendar_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<PlantingCalendar>, Integer, Hash)> get_planting_calendar_with_http_info(get_planting_calendar_request)

```ruby
begin
  # Get planting calendar recommendations
  data, status_code, headers = api_instance.get_planting_calendar_with_http_info(get_planting_calendar_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <PlantingCalendar>
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_planting_calendar_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_planting_calendar_request** | [**GetPlantingCalendarRequest**](GetPlantingCalendarRequest.md) |  |  |

### Return type

[**PlantingCalendar**](PlantingCalendar.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## get_soil_data

> <SoilData> get_soil_data(get_soil_data_request)

Get soil analysis data

Retrieve comprehensive soil analysis for a specific county

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

api_instance = SoilSidekick::SoilAnalysisApi.new
get_soil_data_request = SoilSidekick::GetSoilDataRequest.new({county_fips: '12345'}) # GetSoilDataRequest | 

begin
  # Get soil analysis data
  result = api_instance.get_soil_data(get_soil_data_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_soil_data: #{e}"
end
```

#### Using the get_soil_data_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<SoilData>, Integer, Hash)> get_soil_data_with_http_info(get_soil_data_request)

```ruby
begin
  # Get soil analysis data
  data, status_code, headers = api_instance.get_soil_data_with_http_info(get_soil_data_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <SoilData>
rescue SoilSidekick::ApiError => e
  puts "Error when calling SoilAnalysisApi->get_soil_data_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_soil_data_request** | [**GetSoilDataRequest**](GetSoilDataRequest.md) |  |  |

### Return type

[**SoilData**](SoilData.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

