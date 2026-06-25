# SoilSidekick::CarbonApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**calculate_carbon_credits**](CarbonApi.md#calculate_carbon_credits) | **POST** /carbon-credit-calculator | Calculate carbon credits |


## calculate_carbon_credits

> <CarbonCreditCalculation> calculate_carbon_credits(calculate_carbon_credits_request)

Calculate carbon credits

Calculate carbon credits based on field data and soil organic matter

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

api_instance = SoilSidekick::CarbonApi.new
calculate_carbon_credits_request = SoilSidekick::CalculateCarbonCreditsRequest.new({field_name: 'field_name_example', field_size_acres: 3.56}) # CalculateCarbonCreditsRequest | 

begin
  # Calculate carbon credits
  result = api_instance.calculate_carbon_credits(calculate_carbon_credits_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling CarbonApi->calculate_carbon_credits: #{e}"
end
```

#### Using the calculate_carbon_credits_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<CarbonCreditCalculation>, Integer, Hash)> calculate_carbon_credits_with_http_info(calculate_carbon_credits_request)

```ruby
begin
  # Calculate carbon credits
  data, status_code, headers = api_instance.calculate_carbon_credits_with_http_info(calculate_carbon_credits_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <CarbonCreditCalculation>
rescue SoilSidekick::ApiError => e
  puts "Error when calling CarbonApi->calculate_carbon_credits_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **calculate_carbon_credits_request** | [**CalculateCarbonCreditsRequest**](CalculateCarbonCreditsRequest.md) |  |  |

### Return type

[**CarbonCreditCalculation**](CarbonCreditCalculation.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

