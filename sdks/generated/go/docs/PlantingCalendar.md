# PlantingCalendar

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CropType** | Pointer to **string** |  | [optional] 
**OptimalPlantingWindow** | Pointer to [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] 
**ClimateFactors** | Pointer to **map[string]interface{}** |  | [optional] 
**SoilFactors** | Pointer to **map[string]interface{}** |  | [optional] 
**Recommendations** | Pointer to **[]string** |  | [optional] 

## Methods

### NewPlantingCalendar

`func NewPlantingCalendar() *PlantingCalendar`

NewPlantingCalendar instantiates a new PlantingCalendar object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPlantingCalendarWithDefaults

`func NewPlantingCalendarWithDefaults() *PlantingCalendar`

NewPlantingCalendarWithDefaults instantiates a new PlantingCalendar object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCropType

`func (o *PlantingCalendar) GetCropType() string`

GetCropType returns the CropType field if non-nil, zero value otherwise.

### GetCropTypeOk

`func (o *PlantingCalendar) GetCropTypeOk() (*string, bool)`

GetCropTypeOk returns a tuple with the CropType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCropType

`func (o *PlantingCalendar) SetCropType(v string)`

SetCropType sets CropType field to given value.

### HasCropType

`func (o *PlantingCalendar) HasCropType() bool`

HasCropType returns a boolean if a field has been set.

### GetOptimalPlantingWindow

`func (o *PlantingCalendar) GetOptimalPlantingWindow() GetTerritorialWaterAnalyticsRequestDateRange`

GetOptimalPlantingWindow returns the OptimalPlantingWindow field if non-nil, zero value otherwise.

### GetOptimalPlantingWindowOk

`func (o *PlantingCalendar) GetOptimalPlantingWindowOk() (*GetTerritorialWaterAnalyticsRequestDateRange, bool)`

GetOptimalPlantingWindowOk returns a tuple with the OptimalPlantingWindow field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOptimalPlantingWindow

`func (o *PlantingCalendar) SetOptimalPlantingWindow(v GetTerritorialWaterAnalyticsRequestDateRange)`

SetOptimalPlantingWindow sets OptimalPlantingWindow field to given value.

### HasOptimalPlantingWindow

`func (o *PlantingCalendar) HasOptimalPlantingWindow() bool`

HasOptimalPlantingWindow returns a boolean if a field has been set.

### GetClimateFactors

`func (o *PlantingCalendar) GetClimateFactors() map[string]interface{}`

GetClimateFactors returns the ClimateFactors field if non-nil, zero value otherwise.

### GetClimateFactorsOk

`func (o *PlantingCalendar) GetClimateFactorsOk() (*map[string]interface{}, bool)`

GetClimateFactorsOk returns a tuple with the ClimateFactors field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClimateFactors

`func (o *PlantingCalendar) SetClimateFactors(v map[string]interface{})`

SetClimateFactors sets ClimateFactors field to given value.

### HasClimateFactors

`func (o *PlantingCalendar) HasClimateFactors() bool`

HasClimateFactors returns a boolean if a field has been set.

### GetSoilFactors

`func (o *PlantingCalendar) GetSoilFactors() map[string]interface{}`

GetSoilFactors returns the SoilFactors field if non-nil, zero value otherwise.

### GetSoilFactorsOk

`func (o *PlantingCalendar) GetSoilFactorsOk() (*map[string]interface{}, bool)`

GetSoilFactorsOk returns a tuple with the SoilFactors field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilFactors

`func (o *PlantingCalendar) SetSoilFactors(v map[string]interface{})`

SetSoilFactors sets SoilFactors field to given value.

### HasSoilFactors

`func (o *PlantingCalendar) HasSoilFactors() bool`

HasSoilFactors returns a boolean if a field has been set.

### GetRecommendations

`func (o *PlantingCalendar) GetRecommendations() []string`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *PlantingCalendar) GetRecommendationsOk() (*[]string, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *PlantingCalendar) SetRecommendations(v []string)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *PlantingCalendar) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


