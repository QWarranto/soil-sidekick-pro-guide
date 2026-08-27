# SoilSidekick

Agricultural intelligence and soil analysis API with tier-based access control.

## What's New in 1.2.0
- **Consumer Plant Care APIs**: Three new endpoints addressing top pain points in plant ID apps:
  - `/safe-identification`: Toxic lookalike warnings and environmental context
  - `/dynamic-care`: Hyper-localized, real-time care recommendations
  - `/beginner-guidance`: Judgment-free, jargon-free plant guidance

## Authentication
All endpoints require an API key passed via the `x-api-key` header:
```
x-api-key: ak_your_api_key_here
```

API keys are generated through the dashboard and use the `ak_*` format.

## Rate Limiting
Rate limits are enforced based on your subscription tier:
- **Free**: 10 req/min, 100 req/hour, 1,000 req/day
- **Starter**: 30 req/min, 500 req/hour, 5,000 req/day
- **Pro**: 100 req/min, 2,000 req/hour, 25,000 req/day
- **Enterprise**: 500 req/min, 10,000 req/hour, 100,000 req/day

Rate limit information is returned in response headers:
- `X-RateLimit-Limit`: Maximum requests in window
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Response Time SLAs
All endpoints return response time headers for performance monitoring:
- `X-Response-Time`: Human-readable response time (e.g., \"245ms\")
- `X-Response-Time-Ms`: Response time in milliseconds
- `X-Response-Time-Target`: Target response time for this endpoint
- `X-Response-Time-Max`: Maximum acceptable response time
- `X-Response-Time-Status`: Performance status (`optimal`, `acceptable`, `exceeded`)

### Response Time Targets by Category

| Category | Target | Maximum | Endpoints |
|----------|--------|---------|-----------|
| **Fast** | 200ms | 500ms | county-lookup, check-subscription |
| **Standard** | 500ms | 1,500ms | get-soil-data, territorial-water-quality |
| **Complex** | 2,000ms | 5,000ms | agricultural-intelligence, gpt5-chat, visual-crop-analysis |
| **Heavy** | 5,000ms | 15,000ms | live-agricultural-data, generate-vrt-prescription |


For more information, please visit [https://soilsidekick.com/support](https://soilsidekick.com/support).

## Installation & Usage

### Requirements

PHP 7.4 and later.
Should also work with PHP 8.0.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/GIT_USER_ID/GIT_REPO_ID.git"
    }
  ],
  "require": {
    "GIT_USER_ID/GIT_REPO_ID": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/SoilSidekick/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



// Configure API key authorization: ApiKeyAuth
$config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKey('x-api-key', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = SoilSidekick\Configuration::getDefaultConfiguration()->setApiKeyPrefix('x-api-key', 'Bearer');


$apiInstance = new SoilSidekick\Api\AIServicesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$generate_smart_report_summary_request = new \SoilSidekick\Model\GenerateSmartReportSummaryRequest(); // \SoilSidekick\Model\GenerateSmartReportSummaryRequest
$x_tq_context_mode = new \SoilSidekick\Model\TQContextMode(); // TQContextMode | TurboQuant context mode for AI tools
$x_tq_kv_cache_hint = new \SoilSidekick\Model\TQKVCacheHint(); // TQKVCacheHint | TurboQuant KV cache compression hint
$x_tq_model_tier = new \SoilSidekick\Model\TQModelTier(); // TQModelTier | Preferred model tier for TurboQuant optimization

try {
    $result = $apiInstance->generateSmartReportSummary($generate_smart_report_summary_request, $x_tq_context_mode, $x_tq_kv_cache_hint, $x_tq_model_tier);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AIServicesApi->generateSmartReportSummary: ', $e->getMessage(), PHP_EOL;
}

```

## API Endpoints

All URIs are relative to *https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AIServicesApi* | [**generateSmartReportSummary**](docs/Api/AIServicesApi.md#generatesmartreportsummary) | **POST** /smart-report-summary | Generate AI report summary
*AIServicesApi* | [**getAgriculturalIntelligence**](docs/Api/AIServicesApi.md#getagriculturalintelligence) | **POST** /agricultural-intelligence | Get AI-powered agricultural insights
*AIServicesApi* | [**getSeasonalPlanningAssistant**](docs/Api/AIServicesApi.md#getseasonalplanningassistant) | **POST** /seasonal-planning-assistant | Get seasonal planning recommendations
*AIServicesApi* | [**visualCropAnalysis**](docs/Api/AIServicesApi.md#visualcropanalysis) | **POST** /visual-crop-analysis | Analyze crop images
*CarbonApi* | [**calculateCarbonCredits**](docs/Api/CarbonApi.md#calculatecarboncredits) | **POST** /carbon-credit-calculator | Calculate carbon credits
*ConsumerPlantCareApi* | [**beginnerGuidance**](docs/Api/ConsumerPlantCareApi.md#beginnerguidance) | **POST** /beginner-guidance | Beginner-friendly plant guidance without jargon
*ConsumerPlantCareApi* | [**dynamicCare**](docs/Api/ConsumerPlantCareApi.md#dynamiccare) | **POST** /dynamic-care | Hyper-localized dynamic plant care recommendations
*ConsumerPlantCareApi* | [**safeIdentification**](docs/Api/ConsumerPlantCareApi.md#safeidentification) | **POST** /safe-identification | Safe plant identification with toxic lookalike warnings
*EnvironmentalApi* | [**calculateEnvironmentalImpact**](docs/Api/EnvironmentalApi.md#calculateenvironmentalimpact) | **POST** /environmental-impact-engine | Calculate environmental impact
*GeographicApi* | [**countyLookup**](docs/Api/GeographicApi.md#countylookup) | **POST** /county-lookup | Search for counties
*LeafEnginesApi* | [**leafenginesQuery**](docs/Api/LeafEnginesApi.md#leafenginesquery) | **POST** /leafengines-query | Query plant-environment compatibility
*SatelliteDataApi* | [**getSatelliteData**](docs/Api/SatelliteDataApi.md#getsatellitedata) | **POST** /alpha-earth-environmental-enhancement | Get satellite environmental data
*SoilAnalysisApi* | [**getLiveAgriculturalData**](docs/Api/SoilAnalysisApi.md#getliveagriculturaldata) | **POST** /live-agricultural-data | Get live agricultural data
*SoilAnalysisApi* | [**getPlantingCalendar**](docs/Api/SoilAnalysisApi.md#getplantingcalendar) | **POST** /multi-parameter-planting-calendar | Get planting calendar recommendations
*SoilAnalysisApi* | [**getSoilData**](docs/Api/SoilAnalysisApi.md#getsoildata) | **POST** /get-soil-data | Get soil analysis data
*VRTApi* | [**generateVRTPrescription**](docs/Api/VRTApi.md#generatevrtprescription) | **POST** /generate-vrt-prescription | Generate VRT prescription map
*WaterQualityApi* | [**getTerritorialWaterAnalytics**](docs/Api/WaterQualityApi.md#getterritorialwateranalytics) | **POST** /territorial-water-analytics | Get territorial water analytics
*WaterQualityApi* | [**getWaterQuality**](docs/Api/WaterQualityApi.md#getwaterquality) | **POST** /territorial-water-quality | Get water quality data

## Models

- [AIAnalysis](docs/Model/AIAnalysis.md)
- [AIAnalysisRecommendationsInner](docs/Model/AIAnalysisRecommendationsInner.md)
- [BeginnerGuidance](docs/Model/BeginnerGuidance.md)
- [BeginnerGuidanceDetailedExplanation](docs/Model/BeginnerGuidanceDetailedExplanation.md)
- [BeginnerGuidanceMetadata](docs/Model/BeginnerGuidanceMetadata.md)
- [BeginnerGuidanceRequest](docs/Model/BeginnerGuidanceRequest.md)
- [BeginnerGuidanceRequestLocation](docs/Model/BeginnerGuidanceRequestLocation.md)
- [BeginnerGuidanceRequestPlantContext](docs/Model/BeginnerGuidanceRequestPlantContext.md)
- [CalculateCarbonCreditsRequest](docs/Model/CalculateCarbonCreditsRequest.md)
- [CalculateEnvironmentalImpactRequest](docs/Model/CalculateEnvironmentalImpactRequest.md)
- [CalculateEnvironmentalImpactRequestProposedTreatmentsInner](docs/Model/CalculateEnvironmentalImpactRequestProposedTreatmentsInner.md)
- [CalculateEnvironmentalImpactRequestSoilData](docs/Model/CalculateEnvironmentalImpactRequestSoilData.md)
- [CalculateEnvironmentalImpactRequestWaterBodyData](docs/Model/CalculateEnvironmentalImpactRequestWaterBodyData.md)
- [CarbonCreditCalculation](docs/Model/CarbonCreditCalculation.md)
- [CarbonCreditCalculationCalculationDetails](docs/Model/CarbonCreditCalculationCalculationDetails.md)
- [CarbonCreditCalculationCalculationDetailsMetadata](docs/Model/CarbonCreditCalculationCalculationDetailsMetadata.md)
- [CarbonCreditCalculationCreditRecord](docs/Model/CarbonCreditCalculationCreditRecord.md)
- [County](docs/Model/County.md)
- [CountyLookup200Response](docs/Model/CountyLookup200Response.md)
- [CountyLookupRequest](docs/Model/CountyLookupRequest.md)
- [DynamicCare](docs/Model/DynamicCare.md)
- [DynamicCareCareRecommendations](docs/Model/DynamicCareCareRecommendations.md)
- [DynamicCareCareRecommendationsHumidity](docs/Model/DynamicCareCareRecommendationsHumidity.md)
- [DynamicCareCareRecommendationsLight](docs/Model/DynamicCareCareRecommendationsLight.md)
- [DynamicCareCareRecommendationsWatering](docs/Model/DynamicCareCareRecommendationsWatering.md)
- [DynamicCareCurrentConditions](docs/Model/DynamicCareCurrentConditions.md)
- [DynamicCareMetadata](docs/Model/DynamicCareMetadata.md)
- [DynamicCarePlant](docs/Model/DynamicCarePlant.md)
- [DynamicCareRequest](docs/Model/DynamicCareRequest.md)
- [DynamicCareRequestContainerDetails](docs/Model/DynamicCareRequestContainerDetails.md)
- [DynamicCareRequestEnvironment](docs/Model/DynamicCareRequestEnvironment.md)
- [DynamicCareRequestLocation](docs/Model/DynamicCareRequestLocation.md)
- [EnvironmentalImpact](docs/Model/EnvironmentalImpact.md)
- [EnvironmentalImpactDetailedAnalysis](docs/Model/EnvironmentalImpactDetailedAnalysis.md)
- [EnvironmentalImpactDetailedAnalysisEcoAlternatives](docs/Model/EnvironmentalImpactDetailedAnalysisEcoAlternatives.md)
- [EnvironmentalImpactDetailedAnalysisEcoAlternativesAlternativesInner](docs/Model/EnvironmentalImpactDetailedAnalysisEcoAlternativesAlternativesInner.md)
- [EnvironmentalImpactDetailedAnalysisRunoffRisk](docs/Model/EnvironmentalImpactDetailedAnalysisRunoffRisk.md)
- [EnvironmentalImpactImpactAssessment](docs/Model/EnvironmentalImpactImpactAssessment.md)
- [Error](docs/Model/Error.md)
- [GenerateSmartReportSummaryRequest](docs/Model/GenerateSmartReportSummaryRequest.md)
- [GenerateVRTPrescriptionRequest](docs/Model/GenerateVRTPrescriptionRequest.md)
- [GetAgriculturalIntelligenceRequest](docs/Model/GetAgriculturalIntelligenceRequest.md)
- [GetLiveAgriculturalDataRequest](docs/Model/GetLiveAgriculturalDataRequest.md)
- [GetPlantingCalendarRequest](docs/Model/GetPlantingCalendarRequest.md)
- [GetSatelliteDataRequest](docs/Model/GetSatelliteDataRequest.md)
- [GetSeasonalPlanningAssistantRequest](docs/Model/GetSeasonalPlanningAssistantRequest.md)
- [GetSeasonalPlanningAssistantRequestLocation](docs/Model/GetSeasonalPlanningAssistantRequestLocation.md)
- [GetSoilDataRequest](docs/Model/GetSoilDataRequest.md)
- [GetTerritorialWaterAnalyticsRequest](docs/Model/GetTerritorialWaterAnalyticsRequest.md)
- [GetTerritorialWaterAnalyticsRequestDateRange](docs/Model/GetTerritorialWaterAnalyticsRequestDateRange.md)
- [GetWaterQualityRequest](docs/Model/GetWaterQualityRequest.md)
- [LeafEnginesCompatibility](docs/Model/LeafEnginesCompatibility.md)
- [LeafEnginesCompatibilityData](docs/Model/LeafEnginesCompatibilityData.md)
- [LeafEnginesCompatibilityDataBreakdown](docs/Model/LeafEnginesCompatibilityDataBreakdown.md)
- [LeafEnginesCompatibilityDataBreakdownSoil](docs/Model/LeafEnginesCompatibilityDataBreakdownSoil.md)
- [LeafEnginesCompatibilityDataMetadata](docs/Model/LeafEnginesCompatibilityDataMetadata.md)
- [LeafEnginesCompatibilityUsage](docs/Model/LeafEnginesCompatibilityUsage.md)
- [LeafenginesQueryRequest](docs/Model/LeafenginesQueryRequest.md)
- [LeafenginesQueryRequestLocation](docs/Model/LeafenginesQueryRequestLocation.md)
- [LeafenginesQueryRequestOptions](docs/Model/LeafenginesQueryRequestOptions.md)
- [LeafenginesQueryRequestPlant](docs/Model/LeafenginesQueryRequestPlant.md)
- [LeafenginesQueryRequestPlantCareRequirements](docs/Model/LeafenginesQueryRequestPlantCareRequirements.md)
- [LeafenginesQueryRequestPlantCareRequirementsSoilPhRange](docs/Model/LeafenginesQueryRequestPlantCareRequirementsSoilPhRange.md)
- [LiveAgriculturalData](docs/Model/LiveAgriculturalData.md)
- [LiveAgriculturalDataData](docs/Model/LiveAgriculturalDataData.md)
- [PlantingCalendar](docs/Model/PlantingCalendar.md)
- [SafeIdentification](docs/Model/SafeIdentification.md)
- [SafeIdentificationConfidenceBreakdown](docs/Model/SafeIdentificationConfidenceBreakdown.md)
- [SafeIdentificationIdentification](docs/Model/SafeIdentificationIdentification.md)
- [SafeIdentificationIdentificationPrimaryMatch](docs/Model/SafeIdentificationIdentificationPrimaryMatch.md)
- [SafeIdentificationMetadata](docs/Model/SafeIdentificationMetadata.md)
- [SafeIdentificationRequest](docs/Model/SafeIdentificationRequest.md)
- [SafeIdentificationRequestContext](docs/Model/SafeIdentificationRequestContext.md)
- [SafeIdentificationRequestLocation](docs/Model/SafeIdentificationRequestLocation.md)
- [SafeIdentificationRequestLocationCoordinates](docs/Model/SafeIdentificationRequestLocationCoordinates.md)
- [SafeIdentificationSafetyAnalysis](docs/Model/SafeIdentificationSafetyAnalysis.md)
- [SafeIdentificationSafetyAnalysisLookalikesInner](docs/Model/SafeIdentificationSafetyAnalysisLookalikesInner.md)
- [SatelliteData](docs/Model/SatelliteData.md)
- [SeasonalPlanningResponse](docs/Model/SeasonalPlanningResponse.md)
- [SeasonalPlanningResponseRecommendations](docs/Model/SeasonalPlanningResponseRecommendations.md)
- [SeasonalPlanningResponseWeatherData](docs/Model/SeasonalPlanningResponseWeatherData.md)
- [SmartReportSummary](docs/Model/SmartReportSummary.md)
- [SmartReportSummarySummary](docs/Model/SmartReportSummarySummary.md)
- [SoilData](docs/Model/SoilData.md)
- [TQContextMode](docs/Model/TQContextMode.md)
- [TQKVCacheHint](docs/Model/TQKVCacheHint.md)
- [TQModelTier](docs/Model/TQModelTier.md)
- [TerritorialWaterAnalytics](docs/Model/TerritorialWaterAnalytics.md)
- [TerritorialWaterAnalyticsAnalytics](docs/Model/TerritorialWaterAnalyticsAnalytics.md)
- [VRTPrescription](docs/Model/VRTPrescription.md)
- [VRTPrescriptionZonesInner](docs/Model/VRTPrescriptionZonesInner.md)
- [VisualCropAnalysis](docs/Model/VisualCropAnalysis.md)
- [VisualCropAnalysisAnalysis](docs/Model/VisualCropAnalysisAnalysis.md)
- [VisualCropAnalysisRequest](docs/Model/VisualCropAnalysisRequest.md)
- [VisualCropAnalysisRequestLocation](docs/Model/VisualCropAnalysisRequestLocation.md)
- [WaterQuality](docs/Model/WaterQuality.md)

## Authorization

Authentication schemes defined for the API:
### ApiKeyAuth

- **Type**: API key
- **API key parameter name**: x-api-key
- **Location**: HTTP header


## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author

support@soilsidekickpro.com

## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.2.0`
    - Package version: `1.2.0`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
