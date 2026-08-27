# SoilSidekick::EnvironmentalApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**calculate_environmental_impact**](EnvironmentalApi.md#calculate_environmental_impact) | **POST** /environmental-impact-engine | Calculate environmental impact |


## calculate_environmental_impact

> <EnvironmentalImpact> calculate_environmental_impact(calculate_environmental_impact_request)

Calculate environmental impact

Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives

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

api_instance = SoilSidekick::EnvironmentalApi.new
calculate_environmental_impact_request = SoilSidekick::CalculateEnvironmentalImpactRequest.new({analysis_id: 'analysis_id_example', county_fips: 'county_fips_example', soil_data: SoilSidekick::CalculateEnvironmentalImpactRequestSoilData.new}) # CalculateEnvironmentalImpactRequest | 

begin
  # Calculate environmental impact
  result = api_instance.calculate_environmental_impact(calculate_environmental_impact_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling EnvironmentalApi->calculate_environmental_impact: #{e}"
end
```

#### Using the calculate_environmental_impact_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<EnvironmentalImpact>, Integer, Hash)> calculate_environmental_impact_with_http_info(calculate_environmental_impact_request)

```ruby
begin
  # Calculate environmental impact
  data, status_code, headers = api_instance.calculate_environmental_impact_with_http_info(calculate_environmental_impact_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <EnvironmentalImpact>
rescue SoilSidekick::ApiError => e
  puts "Error when calling EnvironmentalApi->calculate_environmental_impact_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **calculate_environmental_impact_request** | [**CalculateEnvironmentalImpactRequest**](CalculateEnvironmentalImpactRequest.md) |  |  |

### Return type

[**EnvironmentalImpact**](EnvironmentalImpact.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

