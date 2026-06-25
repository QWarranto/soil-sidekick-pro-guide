# GetSeasonalPlanningAssistantRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Location** | [**GetSeasonalPlanningAssistantRequestLocation**](GetSeasonalPlanningAssistantRequestLocation.md) |  | 
**SoilData** | Pointer to **map[string]interface{}** | Optional soil data for enhanced recommendations | [optional] 
**PlanningType** | **string** |  | 
**CropPreferences** | Pointer to **[]string** |  | [optional] 
**Timeframe** | Pointer to **string** | Planning timeframe (e.g., \&quot;3 months\&quot;, \&quot;1 year\&quot;) | [optional] 

## Methods

### NewGetSeasonalPlanningAssistantRequest

`func NewGetSeasonalPlanningAssistantRequest(location GetSeasonalPlanningAssistantRequestLocation, planningType string, ) *GetSeasonalPlanningAssistantRequest`

NewGetSeasonalPlanningAssistantRequest instantiates a new GetSeasonalPlanningAssistantRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetSeasonalPlanningAssistantRequestWithDefaults

`func NewGetSeasonalPlanningAssistantRequestWithDefaults() *GetSeasonalPlanningAssistantRequest`

NewGetSeasonalPlanningAssistantRequestWithDefaults instantiates a new GetSeasonalPlanningAssistantRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetLocation

`func (o *GetSeasonalPlanningAssistantRequest) GetLocation() GetSeasonalPlanningAssistantRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *GetSeasonalPlanningAssistantRequest) GetLocationOk() (*GetSeasonalPlanningAssistantRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *GetSeasonalPlanningAssistantRequest) SetLocation(v GetSeasonalPlanningAssistantRequestLocation)`

SetLocation sets Location field to given value.


### GetSoilData

`func (o *GetSeasonalPlanningAssistantRequest) GetSoilData() map[string]interface{}`

GetSoilData returns the SoilData field if non-nil, zero value otherwise.

### GetSoilDataOk

`func (o *GetSeasonalPlanningAssistantRequest) GetSoilDataOk() (*map[string]interface{}, bool)`

GetSoilDataOk returns a tuple with the SoilData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilData

`func (o *GetSeasonalPlanningAssistantRequest) SetSoilData(v map[string]interface{})`

SetSoilData sets SoilData field to given value.

### HasSoilData

`func (o *GetSeasonalPlanningAssistantRequest) HasSoilData() bool`

HasSoilData returns a boolean if a field has been set.

### GetPlanningType

`func (o *GetSeasonalPlanningAssistantRequest) GetPlanningType() string`

GetPlanningType returns the PlanningType field if non-nil, zero value otherwise.

### GetPlanningTypeOk

`func (o *GetSeasonalPlanningAssistantRequest) GetPlanningTypeOk() (*string, bool)`

GetPlanningTypeOk returns a tuple with the PlanningType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlanningType

`func (o *GetSeasonalPlanningAssistantRequest) SetPlanningType(v string)`

SetPlanningType sets PlanningType field to given value.


### GetCropPreferences

`func (o *GetSeasonalPlanningAssistantRequest) GetCropPreferences() []string`

GetCropPreferences returns the CropPreferences field if non-nil, zero value otherwise.

### GetCropPreferencesOk

`func (o *GetSeasonalPlanningAssistantRequest) GetCropPreferencesOk() (*[]string, bool)`

GetCropPreferencesOk returns a tuple with the CropPreferences field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCropPreferences

`func (o *GetSeasonalPlanningAssistantRequest) SetCropPreferences(v []string)`

SetCropPreferences sets CropPreferences field to given value.

### HasCropPreferences

`func (o *GetSeasonalPlanningAssistantRequest) HasCropPreferences() bool`

HasCropPreferences returns a boolean if a field has been set.

### GetTimeframe

`func (o *GetSeasonalPlanningAssistantRequest) GetTimeframe() string`

GetTimeframe returns the Timeframe field if non-nil, zero value otherwise.

### GetTimeframeOk

`func (o *GetSeasonalPlanningAssistantRequest) GetTimeframeOk() (*string, bool)`

GetTimeframeOk returns a tuple with the Timeframe field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTimeframe

`func (o *GetSeasonalPlanningAssistantRequest) SetTimeframe(v string)`

SetTimeframe sets Timeframe field to given value.

### HasTimeframe

`func (o *GetSeasonalPlanningAssistantRequest) HasTimeframe() bool`

HasTimeframe returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


