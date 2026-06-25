# CalculateCarbonCreditsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**FieldName** | **string** | Name of the field | 
**FieldSizeAcres** | **float32** | Field size in acres | 
**SoilOrganicMatter** | Pointer to **float32** | Soil organic matter percentage | [optional] 
**SoilAnalysisId** | Pointer to **string** | Reference to existing soil analysis | [optional] 
**VerificationType** | Pointer to **string** |  | [optional] 

## Methods

### NewCalculateCarbonCreditsRequest

`func NewCalculateCarbonCreditsRequest(fieldName string, fieldSizeAcres float32, ) *CalculateCarbonCreditsRequest`

NewCalculateCarbonCreditsRequest instantiates a new CalculateCarbonCreditsRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCalculateCarbonCreditsRequestWithDefaults

`func NewCalculateCarbonCreditsRequestWithDefaults() *CalculateCarbonCreditsRequest`

NewCalculateCarbonCreditsRequestWithDefaults instantiates a new CalculateCarbonCreditsRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetFieldName

`func (o *CalculateCarbonCreditsRequest) GetFieldName() string`

GetFieldName returns the FieldName field if non-nil, zero value otherwise.

### GetFieldNameOk

`func (o *CalculateCarbonCreditsRequest) GetFieldNameOk() (*string, bool)`

GetFieldNameOk returns a tuple with the FieldName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFieldName

`func (o *CalculateCarbonCreditsRequest) SetFieldName(v string)`

SetFieldName sets FieldName field to given value.


### GetFieldSizeAcres

`func (o *CalculateCarbonCreditsRequest) GetFieldSizeAcres() float32`

GetFieldSizeAcres returns the FieldSizeAcres field if non-nil, zero value otherwise.

### GetFieldSizeAcresOk

`func (o *CalculateCarbonCreditsRequest) GetFieldSizeAcresOk() (*float32, bool)`

GetFieldSizeAcresOk returns a tuple with the FieldSizeAcres field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFieldSizeAcres

`func (o *CalculateCarbonCreditsRequest) SetFieldSizeAcres(v float32)`

SetFieldSizeAcres sets FieldSizeAcres field to given value.


### GetSoilOrganicMatter

`func (o *CalculateCarbonCreditsRequest) GetSoilOrganicMatter() float32`

GetSoilOrganicMatter returns the SoilOrganicMatter field if non-nil, zero value otherwise.

### GetSoilOrganicMatterOk

`func (o *CalculateCarbonCreditsRequest) GetSoilOrganicMatterOk() (*float32, bool)`

GetSoilOrganicMatterOk returns a tuple with the SoilOrganicMatter field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilOrganicMatter

`func (o *CalculateCarbonCreditsRequest) SetSoilOrganicMatter(v float32)`

SetSoilOrganicMatter sets SoilOrganicMatter field to given value.

### HasSoilOrganicMatter

`func (o *CalculateCarbonCreditsRequest) HasSoilOrganicMatter() bool`

HasSoilOrganicMatter returns a boolean if a field has been set.

### GetSoilAnalysisId

`func (o *CalculateCarbonCreditsRequest) GetSoilAnalysisId() string`

GetSoilAnalysisId returns the SoilAnalysisId field if non-nil, zero value otherwise.

### GetSoilAnalysisIdOk

`func (o *CalculateCarbonCreditsRequest) GetSoilAnalysisIdOk() (*string, bool)`

GetSoilAnalysisIdOk returns a tuple with the SoilAnalysisId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilAnalysisId

`func (o *CalculateCarbonCreditsRequest) SetSoilAnalysisId(v string)`

SetSoilAnalysisId sets SoilAnalysisId field to given value.

### HasSoilAnalysisId

`func (o *CalculateCarbonCreditsRequest) HasSoilAnalysisId() bool`

HasSoilAnalysisId returns a boolean if a field has been set.

### GetVerificationType

`func (o *CalculateCarbonCreditsRequest) GetVerificationType() string`

GetVerificationType returns the VerificationType field if non-nil, zero value otherwise.

### GetVerificationTypeOk

`func (o *CalculateCarbonCreditsRequest) GetVerificationTypeOk() (*string, bool)`

GetVerificationTypeOk returns a tuple with the VerificationType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVerificationType

`func (o *CalculateCarbonCreditsRequest) SetVerificationType(v string)`

SetVerificationType sets VerificationType field to given value.

### HasVerificationType

`func (o *CalculateCarbonCreditsRequest) HasVerificationType() bool`

HasVerificationType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


