# SeasonalPlanningResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Success** | Pointer to **bool** |  | [optional] 
**Recommendations** | Pointer to [**SeasonalPlanningResponseRecommendations**](SeasonalPlanningResponseRecommendations.md) |  | [optional] 
**WeatherData** | Pointer to [**SeasonalPlanningResponseWeatherData**](SeasonalPlanningResponseWeatherData.md) |  | [optional] 
**ModelUsed** | Pointer to **string** |  | [optional] 

## Methods

### NewSeasonalPlanningResponse

`func NewSeasonalPlanningResponse() *SeasonalPlanningResponse`

NewSeasonalPlanningResponse instantiates a new SeasonalPlanningResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSeasonalPlanningResponseWithDefaults

`func NewSeasonalPlanningResponseWithDefaults() *SeasonalPlanningResponse`

NewSeasonalPlanningResponseWithDefaults instantiates a new SeasonalPlanningResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSuccess

`func (o *SeasonalPlanningResponse) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *SeasonalPlanningResponse) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *SeasonalPlanningResponse) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *SeasonalPlanningResponse) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetRecommendations

`func (o *SeasonalPlanningResponse) GetRecommendations() SeasonalPlanningResponseRecommendations`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *SeasonalPlanningResponse) GetRecommendationsOk() (*SeasonalPlanningResponseRecommendations, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *SeasonalPlanningResponse) SetRecommendations(v SeasonalPlanningResponseRecommendations)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *SeasonalPlanningResponse) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.

### GetWeatherData

`func (o *SeasonalPlanningResponse) GetWeatherData() SeasonalPlanningResponseWeatherData`

GetWeatherData returns the WeatherData field if non-nil, zero value otherwise.

### GetWeatherDataOk

`func (o *SeasonalPlanningResponse) GetWeatherDataOk() (*SeasonalPlanningResponseWeatherData, bool)`

GetWeatherDataOk returns a tuple with the WeatherData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWeatherData

`func (o *SeasonalPlanningResponse) SetWeatherData(v SeasonalPlanningResponseWeatherData)`

SetWeatherData sets WeatherData field to given value.

### HasWeatherData

`func (o *SeasonalPlanningResponse) HasWeatherData() bool`

HasWeatherData returns a boolean if a field has been set.

### GetModelUsed

`func (o *SeasonalPlanningResponse) GetModelUsed() string`

GetModelUsed returns the ModelUsed field if non-nil, zero value otherwise.

### GetModelUsedOk

`func (o *SeasonalPlanningResponse) GetModelUsedOk() (*string, bool)`

GetModelUsedOk returns a tuple with the ModelUsed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModelUsed

`func (o *SeasonalPlanningResponse) SetModelUsed(v string)`

SetModelUsed sets ModelUsed field to given value.

### HasModelUsed

`func (o *SeasonalPlanningResponse) HasModelUsed() bool`

HasModelUsed returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


