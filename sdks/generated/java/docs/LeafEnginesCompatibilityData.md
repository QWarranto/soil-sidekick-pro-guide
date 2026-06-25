

# LeafEnginesCompatibilityData


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**overallScore** | **BigDecimal** | Overall compatibility score (0-100) |  [optional] |
|**soilCompatibility** | **BigDecimal** |  |  [optional] |
|**waterCompatibility** | **BigDecimal** |  |  [optional] |
|**climateCompatibility** | **BigDecimal** |  |  [optional] |
|**breakdown** | [**LeafEnginesCompatibilityDataBreakdown**](LeafEnginesCompatibilityDataBreakdown.md) |  |  [optional] |
|**recommendations** | **List&lt;String&gt;** |  |  [optional] |
|**riskLevel** | [**RiskLevelEnum**](#RiskLevelEnum) |  |  [optional] |
|**metadata** | [**LeafEnginesCompatibilityDataMetadata**](LeafEnginesCompatibilityDataMetadata.md) |  |  [optional] |



## Enum: RiskLevelEnum

| Name | Value |
|---- | -----|
| LOW | &quot;low&quot; |
| MEDIUM | &quot;medium&quot; |
| HIGH | &quot;high&quot; |



