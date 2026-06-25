# SafeIdentificationIdentification

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**PrimaryMatch** | Pointer to [**SafeIdentificationIdentificationPrimaryMatch**](SafeIdentificationIdentificationPrimaryMatch.md) |  | [optional] 
**EnvironmentalProbability** | Pointer to **float32** | Likelihood this plant exists in the given environment | [optional] 
**GrowthStageDetected** | Pointer to **string** |  | [optional] 

## Methods

### NewSafeIdentificationIdentification

`func NewSafeIdentificationIdentification() *SafeIdentificationIdentification`

NewSafeIdentificationIdentification instantiates a new SafeIdentificationIdentification object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationIdentificationWithDefaults

`func NewSafeIdentificationIdentificationWithDefaults() *SafeIdentificationIdentification`

NewSafeIdentificationIdentificationWithDefaults instantiates a new SafeIdentificationIdentification object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPrimaryMatch

`func (o *SafeIdentificationIdentification) GetPrimaryMatch() SafeIdentificationIdentificationPrimaryMatch`

GetPrimaryMatch returns the PrimaryMatch field if non-nil, zero value otherwise.

### GetPrimaryMatchOk

`func (o *SafeIdentificationIdentification) GetPrimaryMatchOk() (*SafeIdentificationIdentificationPrimaryMatch, bool)`

GetPrimaryMatchOk returns a tuple with the PrimaryMatch field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrimaryMatch

`func (o *SafeIdentificationIdentification) SetPrimaryMatch(v SafeIdentificationIdentificationPrimaryMatch)`

SetPrimaryMatch sets PrimaryMatch field to given value.

### HasPrimaryMatch

`func (o *SafeIdentificationIdentification) HasPrimaryMatch() bool`

HasPrimaryMatch returns a boolean if a field has been set.

### GetEnvironmentalProbability

`func (o *SafeIdentificationIdentification) GetEnvironmentalProbability() float32`

GetEnvironmentalProbability returns the EnvironmentalProbability field if non-nil, zero value otherwise.

### GetEnvironmentalProbabilityOk

`func (o *SafeIdentificationIdentification) GetEnvironmentalProbabilityOk() (*float32, bool)`

GetEnvironmentalProbabilityOk returns a tuple with the EnvironmentalProbability field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironmentalProbability

`func (o *SafeIdentificationIdentification) SetEnvironmentalProbability(v float32)`

SetEnvironmentalProbability sets EnvironmentalProbability field to given value.

### HasEnvironmentalProbability

`func (o *SafeIdentificationIdentification) HasEnvironmentalProbability() bool`

HasEnvironmentalProbability returns a boolean if a field has been set.

### GetGrowthStageDetected

`func (o *SafeIdentificationIdentification) GetGrowthStageDetected() string`

GetGrowthStageDetected returns the GrowthStageDetected field if non-nil, zero value otherwise.

### GetGrowthStageDetectedOk

`func (o *SafeIdentificationIdentification) GetGrowthStageDetectedOk() (*string, bool)`

GetGrowthStageDetectedOk returns a tuple with the GrowthStageDetected field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGrowthStageDetected

`func (o *SafeIdentificationIdentification) SetGrowthStageDetected(v string)`

SetGrowthStageDetected sets GrowthStageDetected field to given value.

### HasGrowthStageDetected

`func (o *SafeIdentificationIdentification) HasGrowthStageDetected() bool`

HasGrowthStageDetected returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


