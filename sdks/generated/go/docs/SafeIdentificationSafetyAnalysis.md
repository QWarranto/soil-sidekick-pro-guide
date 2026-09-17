# SafeIdentificationSafetyAnalysis

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ToxicityLevel** | Pointer to **string** |  | [optional] 
**ToxicTo** | Pointer to **[]string** | List of animals/people this is toxic to (e.g., cats, dogs, children) | [optional] 
**Lookalikes** | Pointer to [**[]SafeIdentificationSafetyAnalysisLookalikesInner**](SafeIdentificationSafetyAnalysisLookalikesInner.md) |  | [optional] 
**Warnings** | Pointer to **[]string** |  | [optional] 

## Methods

### NewSafeIdentificationSafetyAnalysis

`func NewSafeIdentificationSafetyAnalysis() *SafeIdentificationSafetyAnalysis`

NewSafeIdentificationSafetyAnalysis instantiates a new SafeIdentificationSafetyAnalysis object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationSafetyAnalysisWithDefaults

`func NewSafeIdentificationSafetyAnalysisWithDefaults() *SafeIdentificationSafetyAnalysis`

NewSafeIdentificationSafetyAnalysisWithDefaults instantiates a new SafeIdentificationSafetyAnalysis object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetToxicityLevel

`func (o *SafeIdentificationSafetyAnalysis) GetToxicityLevel() string`

GetToxicityLevel returns the ToxicityLevel field if non-nil, zero value otherwise.

### GetToxicityLevelOk

`func (o *SafeIdentificationSafetyAnalysis) GetToxicityLevelOk() (*string, bool)`

GetToxicityLevelOk returns a tuple with the ToxicityLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToxicityLevel

`func (o *SafeIdentificationSafetyAnalysis) SetToxicityLevel(v string)`

SetToxicityLevel sets ToxicityLevel field to given value.

### HasToxicityLevel

`func (o *SafeIdentificationSafetyAnalysis) HasToxicityLevel() bool`

HasToxicityLevel returns a boolean if a field has been set.

### GetToxicTo

`func (o *SafeIdentificationSafetyAnalysis) GetToxicTo() []string`

GetToxicTo returns the ToxicTo field if non-nil, zero value otherwise.

### GetToxicToOk

`func (o *SafeIdentificationSafetyAnalysis) GetToxicToOk() (*[]string, bool)`

GetToxicToOk returns a tuple with the ToxicTo field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToxicTo

`func (o *SafeIdentificationSafetyAnalysis) SetToxicTo(v []string)`

SetToxicTo sets ToxicTo field to given value.

### HasToxicTo

`func (o *SafeIdentificationSafetyAnalysis) HasToxicTo() bool`

HasToxicTo returns a boolean if a field has been set.

### GetLookalikes

`func (o *SafeIdentificationSafetyAnalysis) GetLookalikes() []SafeIdentificationSafetyAnalysisLookalikesInner`

GetLookalikes returns the Lookalikes field if non-nil, zero value otherwise.

### GetLookalikesOk

`func (o *SafeIdentificationSafetyAnalysis) GetLookalikesOk() (*[]SafeIdentificationSafetyAnalysisLookalikesInner, bool)`

GetLookalikesOk returns a tuple with the Lookalikes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLookalikes

`func (o *SafeIdentificationSafetyAnalysis) SetLookalikes(v []SafeIdentificationSafetyAnalysisLookalikesInner)`

SetLookalikes sets Lookalikes field to given value.

### HasLookalikes

`func (o *SafeIdentificationSafetyAnalysis) HasLookalikes() bool`

HasLookalikes returns a boolean if a field has been set.

### GetWarnings

`func (o *SafeIdentificationSafetyAnalysis) GetWarnings() []string`

GetWarnings returns the Warnings field if non-nil, zero value otherwise.

### GetWarningsOk

`func (o *SafeIdentificationSafetyAnalysis) GetWarningsOk() (*[]string, bool)`

GetWarningsOk returns a tuple with the Warnings field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWarnings

`func (o *SafeIdentificationSafetyAnalysis) SetWarnings(v []string)`

SetWarnings sets Warnings field to given value.

### HasWarnings

`func (o *SafeIdentificationSafetyAnalysis) HasWarnings() bool`

HasWarnings returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


