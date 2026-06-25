

# GetSeasonalPlanningAssistantRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**location** | [**GetSeasonalPlanningAssistantRequestLocation**](GetSeasonalPlanningAssistantRequestLocation.md) |  |  |
|**soilData** | **Object** | Optional soil data for enhanced recommendations |  [optional] |
|**planningType** | [**PlanningTypeEnum**](#PlanningTypeEnum) |  |  |
|**cropPreferences** | **List&lt;String&gt;** |  |  [optional] |
|**timeframe** | **String** | Planning timeframe (e.g., \&quot;3 months\&quot;, \&quot;1 year\&quot;) |  [optional] |



## Enum: PlanningTypeEnum

| Name | Value |
|---- | -----|
| SPRING_PLANTING | &quot;spring_planting&quot; |
| FALL_HARVEST | &quot;fall_harvest&quot; |
| WINTER_PREP | &quot;winter_prep&quot; |
| YEAR_ROUND | &quot;year_round&quot; |



