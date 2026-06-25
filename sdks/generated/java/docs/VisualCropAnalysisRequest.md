

# VisualCropAnalysisRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**image** | **String** | Base64 encoded image or image URL |  |
|**analysisType** | [**AnalysisTypeEnum**](#AnalysisTypeEnum) |  |  |
|**location** | [**VisualCropAnalysisRequestLocation**](VisualCropAnalysisRequestLocation.md) |  |  [optional] |
|**cropType** | **String** | Type of crop being analyzed |  [optional] |



## Enum: AnalysisTypeEnum

| Name | Value |
|---- | -----|
| PEST_DETECTION | &quot;pest_detection&quot; |
| CROP_HEALTH | &quot;crop_health&quot; |
| DISEASE_SCREENING | &quot;disease_screening&quot; |



