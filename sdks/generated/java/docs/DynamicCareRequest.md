

# DynamicCareRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**plantSpecies** | **String** | Common or scientific plant name |  |
|**location** | [**DynamicCareRequestLocation**](DynamicCareRequestLocation.md) |  |  |
|**environment** | [**DynamicCareRequestEnvironment**](DynamicCareRequestEnvironment.md) |  |  [optional] |
|**containerDetails** | [**DynamicCareRequestContainerDetails**](DynamicCareRequestContainerDetails.md) |  |  [optional] |
|**soilType** | [**SoilTypeEnum**](#SoilTypeEnum) |  |  [optional] |
|**lastWatered** | **LocalDate** | Date plant was last watered |  [optional] |



## Enum: SoilTypeEnum

| Name | Value |
|---- | -----|
| POTTING_MIX | &quot;potting_mix&quot; |
| SUCCULENT_MIX | &quot;succulent_mix&quot; |
| ORCHID_BARK | &quot;orchid_bark&quot; |
| GARDEN_SOIL | &quot;garden_soil&quot; |
| SANDY | &quot;sandy&quot; |
| CLAY | &quot;clay&quot; |



