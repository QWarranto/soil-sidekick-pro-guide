

# CalculateCarbonCreditsRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**fieldName** | **String** | Name of the field |  |
|**fieldSizeAcres** | **BigDecimal** | Field size in acres |  |
|**soilOrganicMatter** | **BigDecimal** | Soil organic matter percentage |  [optional] |
|**soilAnalysisId** | **UUID** | Reference to existing soil analysis |  [optional] |
|**verificationType** | [**VerificationTypeEnum**](#VerificationTypeEnum) |  |  [optional] |



## Enum: VerificationTypeEnum

| Name | Value |
|---- | -----|
| SELF_REPORTED | &quot;self_reported&quot; |
| THIRD_PARTY | &quot;third_party&quot; |
| SATELLITE | &quot;satellite&quot; |



