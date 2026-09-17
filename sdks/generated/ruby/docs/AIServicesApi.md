# SoilSidekick::AIServicesApi

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**generate_smart_report_summary**](AIServicesApi.md#generate_smart_report_summary) | **POST** /smart-report-summary | Generate AI report summary |
| [**get_agricultural_intelligence**](AIServicesApi.md#get_agricultural_intelligence) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights |
| [**get_seasonal_planning_assistant**](AIServicesApi.md#get_seasonal_planning_assistant) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations |
| [**visual_crop_analysis**](AIServicesApi.md#visual_crop_analysis) | **POST** /visual-crop-analysis | Analyze crop images |


## generate_smart_report_summary

> <SmartReportSummary> generate_smart_report_summary(generate_smart_report_summary_request, opts)

Generate AI report summary

Generate AI-powered summaries for soil or water quality reports

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

api_instance = SoilSidekick::AIServicesApi.new
generate_smart_report_summary_request = SoilSidekick::GenerateSmartReportSummaryRequest.new({report_type: 'soil', report_data: 3.56}) # GenerateSmartReportSummaryRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Generate AI report summary
  result = api_instance.generate_smart_report_summary(generate_smart_report_summary_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->generate_smart_report_summary: #{e}"
end
```

#### Using the generate_smart_report_summary_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<SmartReportSummary>, Integer, Hash)> generate_smart_report_summary_with_http_info(generate_smart_report_summary_request, opts)

```ruby
begin
  # Generate AI report summary
  data, status_code, headers = api_instance.generate_smart_report_summary_with_http_info(generate_smart_report_summary_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <SmartReportSummary>
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->generate_smart_report_summary_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **generate_smart_report_summary_request** | [**GenerateSmartReportSummaryRequest**](GenerateSmartReportSummaryRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**SmartReportSummary**](SmartReportSummary.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## get_agricultural_intelligence

> <AIAnalysis> get_agricultural_intelligence(get_agricultural_intelligence_request, opts)

Get AI-powered agricultural insights

Agricultural intelligence with AI recommendations

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

api_instance = SoilSidekick::AIServicesApi.new
get_agricultural_intelligence_request = SoilSidekick::GetAgriculturalIntelligenceRequest.new({county_fips: 'county_fips_example', analysis_type: 'crop_recommendation'}) # GetAgriculturalIntelligenceRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Get AI-powered agricultural insights
  result = api_instance.get_agricultural_intelligence(get_agricultural_intelligence_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->get_agricultural_intelligence: #{e}"
end
```

#### Using the get_agricultural_intelligence_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<AIAnalysis>, Integer, Hash)> get_agricultural_intelligence_with_http_info(get_agricultural_intelligence_request, opts)

```ruby
begin
  # Get AI-powered agricultural insights
  data, status_code, headers = api_instance.get_agricultural_intelligence_with_http_info(get_agricultural_intelligence_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <AIAnalysis>
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->get_agricultural_intelligence_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_agricultural_intelligence_request** | [**GetAgriculturalIntelligenceRequest**](GetAgriculturalIntelligenceRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**AIAnalysis**](AIAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## get_seasonal_planning_assistant

> <SeasonalPlanningResponse> get_seasonal_planning_assistant(get_seasonal_planning_assistant_request, opts)

Get seasonal planning recommendations

AI-powered seasonal planning with weather integration

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

api_instance = SoilSidekick::AIServicesApi.new
get_seasonal_planning_assistant_request = SoilSidekick::GetSeasonalPlanningAssistantRequest.new({location: SoilSidekick::GetSeasonalPlanningAssistantRequestLocation.new, planning_type: 'spring_planting'}) # GetSeasonalPlanningAssistantRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Get seasonal planning recommendations
  result = api_instance.get_seasonal_planning_assistant(get_seasonal_planning_assistant_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->get_seasonal_planning_assistant: #{e}"
end
```

#### Using the get_seasonal_planning_assistant_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<SeasonalPlanningResponse>, Integer, Hash)> get_seasonal_planning_assistant_with_http_info(get_seasonal_planning_assistant_request, opts)

```ruby
begin
  # Get seasonal planning recommendations
  data, status_code, headers = api_instance.get_seasonal_planning_assistant_with_http_info(get_seasonal_planning_assistant_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <SeasonalPlanningResponse>
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->get_seasonal_planning_assistant_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **get_seasonal_planning_assistant_request** | [**GetSeasonalPlanningAssistantRequest**](GetSeasonalPlanningAssistantRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**SeasonalPlanningResponse**](SeasonalPlanningResponse.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## visual_crop_analysis

> <VisualCropAnalysis> visual_crop_analysis(visual_crop_analysis_request, opts)

Analyze crop images

AI-powered visual crop analysis for pest detection, health assessment, and disease screening

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

api_instance = SoilSidekick::AIServicesApi.new
visual_crop_analysis_request = SoilSidekick::VisualCropAnalysisRequest.new({image: 'image_example', analysis_type: 'pest_detection'}) # VisualCropAnalysisRequest | 
opts = {
  x_tq_context_mode: 4096, # Integer | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K. 
  x_tq_kv_cache_hint: 'none', # String | KV cache management hint. - `none`: No caching (default) - `reuse`: Reuse KV cache from previous request in same session (40-60% compute savings) - `persist`: Persist cache to disk for cross-session reuse 
  x_tq_model_tier: 'auto' # String | Preferred model tier for inference. - `auto`: Server selects optimal model based on device capabilities - `gemma-2b`: Lightweight model (~0.5GB KV with TQ) - `gemma-7b`: Full model, standard KV cache - `gemma-7b-tq`: Full model with TurboQuant 3-bit KV cache (~1.3GB) 
}

begin
  # Analyze crop images
  result = api_instance.visual_crop_analysis(visual_crop_analysis_request, opts)
  p result
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->visual_crop_analysis: #{e}"
end
```

#### Using the visual_crop_analysis_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<VisualCropAnalysis>, Integer, Hash)> visual_crop_analysis_with_http_info(visual_crop_analysis_request, opts)

```ruby
begin
  # Analyze crop images
  data, status_code, headers = api_instance.visual_crop_analysis_with_http_info(visual_crop_analysis_request, opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <VisualCropAnalysis>
rescue SoilSidekick::ApiError => e
  puts "Error when calling AIServicesApi->visual_crop_analysis_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **visual_crop_analysis_request** | [**VisualCropAnalysisRequest**](VisualCropAnalysisRequest.md) |  |  |
| **x_tq_context_mode** | **Integer** | TurboQuant extended context window size (tokens). With 3-bit KV cache, context windows up to 24K tokens are feasible within the same memory budget as standard 4K.  | [optional][default to 4096] |
| **x_tq_kv_cache_hint** | **String** | KV cache management hint. - &#x60;none&#x60;: No caching (default) - &#x60;reuse&#x60;: Reuse KV cache from previous request in same session (40-60% compute savings) - &#x60;persist&#x60;: Persist cache to disk for cross-session reuse  | [optional][default to &#39;none&#39;] |
| **x_tq_model_tier** | **String** | Preferred model tier for inference. - &#x60;auto&#x60;: Server selects optimal model based on device capabilities - &#x60;gemma-2b&#x60;: Lightweight model (~0.5GB KV with TQ) - &#x60;gemma-7b&#x60;: Full model, standard KV cache - &#x60;gemma-7b-tq&#x60;: Full model with TurboQuant 3-bit KV cache (~1.3GB)  | [optional][default to &#39;auto&#39;] |

### Return type

[**VisualCropAnalysis**](VisualCropAnalysis.md)

### Authorization

[ApiKeyAuth](../README.md#ApiKeyAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

