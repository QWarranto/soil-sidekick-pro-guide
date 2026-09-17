# SafeIdentification

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Success** | Pointer to **bool** |  | [optional] 
**Identification** | Pointer to [**SafeIdentificationIdentification**](SafeIdentificationIdentification.md) |  | [optional] 
**SafetyAnalysis** | Pointer to [**SafeIdentificationSafetyAnalysis**](SafeIdentificationSafetyAnalysis.md) |  | [optional] 
**ConfidenceBreakdown** | Pointer to [**SafeIdentificationConfidenceBreakdown**](SafeIdentificationConfidenceBreakdown.md) |  | [optional] 
**Metadata** | Pointer to [**SafeIdentificationMetadata**](SafeIdentificationMetadata.md) |  | [optional] 

## Methods

### NewSafeIdentification

`func NewSafeIdentification() *SafeIdentification`

NewSafeIdentification instantiates a new SafeIdentification object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationWithDefaults

`func NewSafeIdentificationWithDefaults() *SafeIdentification`

NewSafeIdentificationWithDefaults instantiates a new SafeIdentification object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSuccess

`func (o *SafeIdentification) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *SafeIdentification) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *SafeIdentification) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *SafeIdentification) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetIdentification

`func (o *SafeIdentification) GetIdentification() SafeIdentificationIdentification`

GetIdentification returns the Identification field if non-nil, zero value otherwise.

### GetIdentificationOk

`func (o *SafeIdentification) GetIdentificationOk() (*SafeIdentificationIdentification, bool)`

GetIdentificationOk returns a tuple with the Identification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIdentification

`func (o *SafeIdentification) SetIdentification(v SafeIdentificationIdentification)`

SetIdentification sets Identification field to given value.

### HasIdentification

`func (o *SafeIdentification) HasIdentification() bool`

HasIdentification returns a boolean if a field has been set.

### GetSafetyAnalysis

`func (o *SafeIdentification) GetSafetyAnalysis() SafeIdentificationSafetyAnalysis`

GetSafetyAnalysis returns the SafetyAnalysis field if non-nil, zero value otherwise.

### GetSafetyAnalysisOk

`func (o *SafeIdentification) GetSafetyAnalysisOk() (*SafeIdentificationSafetyAnalysis, bool)`

GetSafetyAnalysisOk returns a tuple with the SafetyAnalysis field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSafetyAnalysis

`func (o *SafeIdentification) SetSafetyAnalysis(v SafeIdentificationSafetyAnalysis)`

SetSafetyAnalysis sets SafetyAnalysis field to given value.

### HasSafetyAnalysis

`func (o *SafeIdentification) HasSafetyAnalysis() bool`

HasSafetyAnalysis returns a boolean if a field has been set.

### GetConfidenceBreakdown

`func (o *SafeIdentification) GetConfidenceBreakdown() SafeIdentificationConfidenceBreakdown`

GetConfidenceBreakdown returns the ConfidenceBreakdown field if non-nil, zero value otherwise.

### GetConfidenceBreakdownOk

`func (o *SafeIdentification) GetConfidenceBreakdownOk() (*SafeIdentificationConfidenceBreakdown, bool)`

GetConfidenceBreakdownOk returns a tuple with the ConfidenceBreakdown field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidenceBreakdown

`func (o *SafeIdentification) SetConfidenceBreakdown(v SafeIdentificationConfidenceBreakdown)`

SetConfidenceBreakdown sets ConfidenceBreakdown field to given value.

### HasConfidenceBreakdown

`func (o *SafeIdentification) HasConfidenceBreakdown() bool`

HasConfidenceBreakdown returns a boolean if a field has been set.

### GetMetadata

`func (o *SafeIdentification) GetMetadata() SafeIdentificationMetadata`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *SafeIdentification) GetMetadataOk() (*SafeIdentificationMetadata, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *SafeIdentification) SetMetadata(v SafeIdentificationMetadata)`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *SafeIdentification) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


