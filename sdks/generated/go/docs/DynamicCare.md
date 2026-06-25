# DynamicCare

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Success** | Pointer to **bool** |  | [optional] 
**Plant** | Pointer to [**DynamicCarePlant**](DynamicCarePlant.md) |  | [optional] 
**CurrentConditions** | Pointer to [**DynamicCareCurrentConditions**](DynamicCareCurrentConditions.md) |  | [optional] 
**CareRecommendations** | Pointer to [**DynamicCareCareRecommendations**](DynamicCareCareRecommendations.md) |  | [optional] 
**Warnings** | Pointer to **[]string** | Any urgent care warnings | [optional] 
**Metadata** | Pointer to [**DynamicCareMetadata**](DynamicCareMetadata.md) |  | [optional] 

## Methods

### NewDynamicCare

`func NewDynamicCare() *DynamicCare`

NewDynamicCare instantiates a new DynamicCare object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDynamicCareWithDefaults

`func NewDynamicCareWithDefaults() *DynamicCare`

NewDynamicCareWithDefaults instantiates a new DynamicCare object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSuccess

`func (o *DynamicCare) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *DynamicCare) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *DynamicCare) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *DynamicCare) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetPlant

`func (o *DynamicCare) GetPlant() DynamicCarePlant`

GetPlant returns the Plant field if non-nil, zero value otherwise.

### GetPlantOk

`func (o *DynamicCare) GetPlantOk() (*DynamicCarePlant, bool)`

GetPlantOk returns a tuple with the Plant field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlant

`func (o *DynamicCare) SetPlant(v DynamicCarePlant)`

SetPlant sets Plant field to given value.

### HasPlant

`func (o *DynamicCare) HasPlant() bool`

HasPlant returns a boolean if a field has been set.

### GetCurrentConditions

`func (o *DynamicCare) GetCurrentConditions() DynamicCareCurrentConditions`

GetCurrentConditions returns the CurrentConditions field if non-nil, zero value otherwise.

### GetCurrentConditionsOk

`func (o *DynamicCare) GetCurrentConditionsOk() (*DynamicCareCurrentConditions, bool)`

GetCurrentConditionsOk returns a tuple with the CurrentConditions field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrentConditions

`func (o *DynamicCare) SetCurrentConditions(v DynamicCareCurrentConditions)`

SetCurrentConditions sets CurrentConditions field to given value.

### HasCurrentConditions

`func (o *DynamicCare) HasCurrentConditions() bool`

HasCurrentConditions returns a boolean if a field has been set.

### GetCareRecommendations

`func (o *DynamicCare) GetCareRecommendations() DynamicCareCareRecommendations`

GetCareRecommendations returns the CareRecommendations field if non-nil, zero value otherwise.

### GetCareRecommendationsOk

`func (o *DynamicCare) GetCareRecommendationsOk() (*DynamicCareCareRecommendations, bool)`

GetCareRecommendationsOk returns a tuple with the CareRecommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCareRecommendations

`func (o *DynamicCare) SetCareRecommendations(v DynamicCareCareRecommendations)`

SetCareRecommendations sets CareRecommendations field to given value.

### HasCareRecommendations

`func (o *DynamicCare) HasCareRecommendations() bool`

HasCareRecommendations returns a boolean if a field has been set.

### GetWarnings

`func (o *DynamicCare) GetWarnings() []string`

GetWarnings returns the Warnings field if non-nil, zero value otherwise.

### GetWarningsOk

`func (o *DynamicCare) GetWarningsOk() (*[]string, bool)`

GetWarningsOk returns a tuple with the Warnings field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWarnings

`func (o *DynamicCare) SetWarnings(v []string)`

SetWarnings sets Warnings field to given value.

### HasWarnings

`func (o *DynamicCare) HasWarnings() bool`

HasWarnings returns a boolean if a field has been set.

### GetMetadata

`func (o *DynamicCare) GetMetadata() DynamicCareMetadata`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *DynamicCare) GetMetadataOk() (*DynamicCareMetadata, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *DynamicCare) SetMetadata(v DynamicCareMetadata)`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *DynamicCare) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


