

# SafeIdentificationSafetyAnalysis


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**toxicityLevel** | [**ToxicityLevelEnum**](#ToxicityLevelEnum) |  |  [optional] |
|**toxicTo** | **List&lt;String&gt;** | List of animals/people this is toxic to (e.g., cats, dogs, children) |  [optional] |
|**lookalikes** | [**List&lt;SafeIdentificationSafetyAnalysisLookalikesInner&gt;**](SafeIdentificationSafetyAnalysisLookalikesInner.md) |  |  [optional] |
|**warnings** | **List&lt;String&gt;** |  |  [optional] |



## Enum: ToxicityLevelEnum

| Name | Value |
|---- | -----|
| SAFE | &quot;safe&quot; |
| MILDLY_TOXIC | &quot;mildly_toxic&quot; |
| TOXIC | &quot;toxic&quot; |
| HIGHLY_TOXIC | &quot;highly_toxic&quot; |



