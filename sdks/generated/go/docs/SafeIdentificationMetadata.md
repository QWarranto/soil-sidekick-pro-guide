# SafeIdentificationMetadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AnalysisId** | Pointer to **string** |  | [optional] 
**Timestamp** | Pointer to **time.Time** |  | [optional] 
**EnvironmentalDataUsed** | Pointer to **[]string** |  | [optional] 

## Methods

### NewSafeIdentificationMetadata

`func NewSafeIdentificationMetadata() *SafeIdentificationMetadata`

NewSafeIdentificationMetadata instantiates a new SafeIdentificationMetadata object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationMetadataWithDefaults

`func NewSafeIdentificationMetadataWithDefaults() *SafeIdentificationMetadata`

NewSafeIdentificationMetadataWithDefaults instantiates a new SafeIdentificationMetadata object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAnalysisId

`func (o *SafeIdentificationMetadata) GetAnalysisId() string`

GetAnalysisId returns the AnalysisId field if non-nil, zero value otherwise.

### GetAnalysisIdOk

`func (o *SafeIdentificationMetadata) GetAnalysisIdOk() (*string, bool)`

GetAnalysisIdOk returns a tuple with the AnalysisId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAnalysisId

`func (o *SafeIdentificationMetadata) SetAnalysisId(v string)`

SetAnalysisId sets AnalysisId field to given value.

### HasAnalysisId

`func (o *SafeIdentificationMetadata) HasAnalysisId() bool`

HasAnalysisId returns a boolean if a field has been set.

### GetTimestamp

`func (o *SafeIdentificationMetadata) GetTimestamp() time.Time`

GetTimestamp returns the Timestamp field if non-nil, zero value otherwise.

### GetTimestampOk

`func (o *SafeIdentificationMetadata) GetTimestampOk() (*time.Time, bool)`

GetTimestampOk returns a tuple with the Timestamp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTimestamp

`func (o *SafeIdentificationMetadata) SetTimestamp(v time.Time)`

SetTimestamp sets Timestamp field to given value.

### HasTimestamp

`func (o *SafeIdentificationMetadata) HasTimestamp() bool`

HasTimestamp returns a boolean if a field has been set.

### GetEnvironmentalDataUsed

`func (o *SafeIdentificationMetadata) GetEnvironmentalDataUsed() []string`

GetEnvironmentalDataUsed returns the EnvironmentalDataUsed field if non-nil, zero value otherwise.

### GetEnvironmentalDataUsedOk

`func (o *SafeIdentificationMetadata) GetEnvironmentalDataUsedOk() (*[]string, bool)`

GetEnvironmentalDataUsedOk returns a tuple with the EnvironmentalDataUsed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironmentalDataUsed

`func (o *SafeIdentificationMetadata) SetEnvironmentalDataUsed(v []string)`

SetEnvironmentalDataUsed sets EnvironmentalDataUsed field to given value.

### HasEnvironmentalDataUsed

`func (o *SafeIdentificationMetadata) HasEnvironmentalDataUsed() bool`

HasEnvironmentalDataUsed returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


