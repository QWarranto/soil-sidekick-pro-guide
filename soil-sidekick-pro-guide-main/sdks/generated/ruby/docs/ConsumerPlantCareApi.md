# SoilSidekick::ConsumerPlantCareApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**beginner_guidance**](ConsumerPlantCareApi.md#beginner_guidance) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon |
| [**dynamic_care**](ConsumerPlantCareApi.md#dynamic_care) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations |
| [**safe_identification**](ConsumerPlantCareApi.md#safe_identification) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings |


## beginner_guidance

> <BeginnerGuidance> beginner_guidance(beginner_guidance_request)

Beginner-friendly plant guidance without jargon

Judgment-free, accessible plant guidance that solves community gatekeeping issues. This endpoint: - Translates scientific jargon into plain language - Never makes users feel stupid for asking about common plants - Uses progressive disclosure (simple answer first, details on request) - Provides encouraging, supportive tone - Offers practical \"what do I do right now\" guidance 

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

api_instance = SoilSidekick::ConsumerPlantCareApi.new
beginner_guidance_request = SoilSidekick::BeginnerGuidanceRequest.new({question: 'My plant has yellow leaves, what's wrong?'}) # BeginnerGuidanceRequest | 

begin
  # Beginner-friendly plant guidance without jargon
  result = api_instance.beginner_guidance(beginner_guidance_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->beginner_guidance: #{e}"
end
```

#### Using the beginner_guidance_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<BeginnerGuidance>, Integer, Hash)> beginner_guidance_with_http_info(beginner_guidance_request)

```ruby
begin
  # Beginner-friendly plant guidance without jargon
  data, status_code, headers = api_instance.beginner_guidance_with_http_info(beginner_guidance_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <BeginnerGuidance>
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->beginner_guidance_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **beginner_guidance_request** | [**BeginnerGuidanceRequest**](BeginnerGuidanceRequest.md) |  |  |

### Return type

[**BeginnerGuidance**](BeginnerGuidance.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## dynamic_care

> <DynamicCare> dynamic_care(dynamic_care_request)

Hyper-localized dynamic plant care recommendations

Real-time, environment-aware care recommendations that solve the \"generic advice\" problem. Unlike static \"water every 7 days\" recommendations, this endpoint: - Adjusts watering based on current humidity, temperature, and recent rainfall - Considers container type, soil composition, and drainage - Factors in seasonal changes and indoor environment conditions - Accounts for plant maturity and growth phase - Provides actionable guidance, not rigid schedules 

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

api_instance = SoilSidekick::ConsumerPlantCareApi.new
dynamic_care_request = SoilSidekick::DynamicCareRequest.new({plant_species: 'Monstera deliciosa', location: SoilSidekick::DynamicCareRequestLocation.new({county_fips: 'county_fips_example'})}) # DynamicCareRequest | 

begin
  # Hyper-localized dynamic plant care recommendations
  result = api_instance.dynamic_care(dynamic_care_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->dynamic_care: #{e}"
end
```

#### Using the dynamic_care_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<DynamicCare>, Integer, Hash)> dynamic_care_with_http_info(dynamic_care_request)

```ruby
begin
  # Hyper-localized dynamic plant care recommendations
  data, status_code, headers = api_instance.dynamic_care_with_http_info(dynamic_care_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <DynamicCare>
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->dynamic_care_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **dynamic_care_request** | [**DynamicCareRequest**](DynamicCareRequest.md) |  |  |

### Return type

[**DynamicCare**](DynamicCare.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## safe_identification

> <SafeIdentification> safe_identification(safe_identification_request)

Safe plant identification with toxic lookalike warnings

Environmentally-contextualized plant identification that addresses misidentification concerns. Unlike generic plant ID, this endpoint: - Checks against a toxic lookalike database with visual similarity scores - Uses environmental context (soil, climate, regional flora) to weight identification probability - Provides confidence breakdowns showing why alternatives were considered - Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot) - Accounts for plant growth stage (seedling identification challenges) 

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

api_instance = SoilSidekick::ConsumerPlantCareApi.new
safe_identification_request = SoilSidekick::SafeIdentificationRequest.new({image: 'image_example'}) # SafeIdentificationRequest | 

begin
  # Safe plant identification with toxic lookalike warnings
  result = api_instance.safe_identification(safe_identification_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->safe_identification: #{e}"
end
```

#### Using the safe_identification_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<SafeIdentification>, Integer, Hash)> safe_identification_with_http_info(safe_identification_request)

```ruby
begin
  # Safe plant identification with toxic lookalike warnings
  data, status_code, headers = api_instance.safe_identification_with_http_info(safe_identification_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <SafeIdentification>
rescue SoilSidekick::ApiError => e
  puts "Error when calling ConsumerPlantCareApi->safe_identification_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **safe_identification_request** | [**SafeIdentificationRequest**](SafeIdentificationRequest.md) |  |  |

### Return type

[**SafeIdentification**](SafeIdentification.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

