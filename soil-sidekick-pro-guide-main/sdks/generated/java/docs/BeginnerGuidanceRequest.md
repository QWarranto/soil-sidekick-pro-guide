

# BeginnerGuidanceRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**question** | **String** | User&#39;s plant question in natural language |  |
|**plantContext** | [**BeginnerGuidanceRequestPlantContext**](BeginnerGuidanceRequestPlantContext.md) |  |  [optional] |
|**location** | [**BeginnerGuidanceRequestLocation**](BeginnerGuidanceRequestLocation.md) |  |  [optional] |
|**userExpertise** | [**UserExpertiseEnum**](#UserExpertiseEnum) | User&#39;s self-assessed expertise level |  [optional] |



## Enum: UserExpertiseEnum

| Name | Value |
|---- | -----|
| COMPLETE_BEGINNER | &quot;complete_beginner&quot; |
| SOME_EXPERIENCE | &quot;some_experience&quot; |
| INTERMEDIATE | &quot;intermediate&quot; |



