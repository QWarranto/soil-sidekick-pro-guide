# SoilSidekick::VRTApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**generate_vrt_prescription**](VRTApi.md#generate_vrt_prescription) | **POST** /generate-vrt-prescription | Generate VRT prescription map |


## generate_vrt_prescription

> <VRTPrescription> generate_vrt_prescription(generate_vrt_prescription_request)

Generate VRT prescription map

Generate variable rate technology prescription maps

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

api_instance = SoilSidekick::VRTApi.new
generate_vrt_prescription_request = SoilSidekick::GenerateVRTPrescriptionRequest.new({field_id: 'field_id_example', application_type: 'fertilizer'}) # GenerateVRTPrescriptionRequest | 

begin
  # Generate VRT prescription map
  result = api_instance.generate_vrt_prescription(generate_vrt_prescription_request)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling VRTApi->generate_vrt_prescription: #{e}"
end
```

#### Using the generate_vrt_prescription_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<VRTPrescription>, Integer, Hash)> generate_vrt_prescription_with_http_info(generate_vrt_prescription_request)

```ruby
begin
  # Generate VRT prescription map
  data, status_code, headers = api_instance.generate_vrt_prescription_with_http_info(generate_vrt_prescription_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <VRTPrescription>
rescue SoilSidekick::ApiError => e
  puts "Error when calling VRTApi->generate_vrt_prescription_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **generate_vrt_prescription_request** | [**GenerateVRTPrescriptionRequest**](GenerateVRTPrescriptionRequest.md) |  |  |

### Return type

[**VRTPrescription**](VRTPrescription.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

