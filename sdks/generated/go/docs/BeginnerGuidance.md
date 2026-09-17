# BeginnerGuidance

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Success** | Pointer to **bool** |  | [optional] 
**SimpleAnswer** | Pointer to **string** | Plain-language answer without jargon, 1-2 sentences | [optional] 
**WhatToDoNow** | Pointer to **string** | Immediate actionable step | [optional] 
**WhyThisHappens** | Pointer to **string** | Simple explanation of the cause | [optional] 
**DetailedExplanation** | Pointer to [**BeginnerGuidanceDetailedExplanation**](BeginnerGuidanceDetailedExplanation.md) |  | [optional] 
**Encouragement** | Pointer to **string** | Supportive message for the user | [optional] 
**RelatedQuestions** | Pointer to **[]string** | Common follow-up questions | [optional] 
**Confidence** | Pointer to **float32** | Confidence in the guidance (0-100) | [optional] 
**Metadata** | Pointer to [**BeginnerGuidanceMetadata**](BeginnerGuidanceMetadata.md) |  | [optional] 

## Methods

### NewBeginnerGuidance

`func NewBeginnerGuidance() *BeginnerGuidance`

NewBeginnerGuidance instantiates a new BeginnerGuidance object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewBeginnerGuidanceWithDefaults

`func NewBeginnerGuidanceWithDefaults() *BeginnerGuidance`

NewBeginnerGuidanceWithDefaults instantiates a new BeginnerGuidance object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSuccess

`func (o *BeginnerGuidance) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *BeginnerGuidance) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *BeginnerGuidance) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *BeginnerGuidance) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetSimpleAnswer

`func (o *BeginnerGuidance) GetSimpleAnswer() string`

GetSimpleAnswer returns the SimpleAnswer field if non-nil, zero value otherwise.

### GetSimpleAnswerOk

`func (o *BeginnerGuidance) GetSimpleAnswerOk() (*string, bool)`

GetSimpleAnswerOk returns a tuple with the SimpleAnswer field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSimpleAnswer

`func (o *BeginnerGuidance) SetSimpleAnswer(v string)`

SetSimpleAnswer sets SimpleAnswer field to given value.

### HasSimpleAnswer

`func (o *BeginnerGuidance) HasSimpleAnswer() bool`

HasSimpleAnswer returns a boolean if a field has been set.

### GetWhatToDoNow

`func (o *BeginnerGuidance) GetWhatToDoNow() string`

GetWhatToDoNow returns the WhatToDoNow field if non-nil, zero value otherwise.

### GetWhatToDoNowOk

`func (o *BeginnerGuidance) GetWhatToDoNowOk() (*string, bool)`

GetWhatToDoNowOk returns a tuple with the WhatToDoNow field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWhatToDoNow

`func (o *BeginnerGuidance) SetWhatToDoNow(v string)`

SetWhatToDoNow sets WhatToDoNow field to given value.

### HasWhatToDoNow

`func (o *BeginnerGuidance) HasWhatToDoNow() bool`

HasWhatToDoNow returns a boolean if a field has been set.

### GetWhyThisHappens

`func (o *BeginnerGuidance) GetWhyThisHappens() string`

GetWhyThisHappens returns the WhyThisHappens field if non-nil, zero value otherwise.

### GetWhyThisHappensOk

`func (o *BeginnerGuidance) GetWhyThisHappensOk() (*string, bool)`

GetWhyThisHappensOk returns a tuple with the WhyThisHappens field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWhyThisHappens

`func (o *BeginnerGuidance) SetWhyThisHappens(v string)`

SetWhyThisHappens sets WhyThisHappens field to given value.

### HasWhyThisHappens

`func (o *BeginnerGuidance) HasWhyThisHappens() bool`

HasWhyThisHappens returns a boolean if a field has been set.

### GetDetailedExplanation

`func (o *BeginnerGuidance) GetDetailedExplanation() BeginnerGuidanceDetailedExplanation`

GetDetailedExplanation returns the DetailedExplanation field if non-nil, zero value otherwise.

### GetDetailedExplanationOk

`func (o *BeginnerGuidance) GetDetailedExplanationOk() (*BeginnerGuidanceDetailedExplanation, bool)`

GetDetailedExplanationOk returns a tuple with the DetailedExplanation field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetailedExplanation

`func (o *BeginnerGuidance) SetDetailedExplanation(v BeginnerGuidanceDetailedExplanation)`

SetDetailedExplanation sets DetailedExplanation field to given value.

### HasDetailedExplanation

`func (o *BeginnerGuidance) HasDetailedExplanation() bool`

HasDetailedExplanation returns a boolean if a field has been set.

### GetEncouragement

`func (o *BeginnerGuidance) GetEncouragement() string`

GetEncouragement returns the Encouragement field if non-nil, zero value otherwise.

### GetEncouragementOk

`func (o *BeginnerGuidance) GetEncouragementOk() (*string, bool)`

GetEncouragementOk returns a tuple with the Encouragement field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEncouragement

`func (o *BeginnerGuidance) SetEncouragement(v string)`

SetEncouragement sets Encouragement field to given value.

### HasEncouragement

`func (o *BeginnerGuidance) HasEncouragement() bool`

HasEncouragement returns a boolean if a field has been set.

### GetRelatedQuestions

`func (o *BeginnerGuidance) GetRelatedQuestions() []string`

GetRelatedQuestions returns the RelatedQuestions field if non-nil, zero value otherwise.

### GetRelatedQuestionsOk

`func (o *BeginnerGuidance) GetRelatedQuestionsOk() (*[]string, bool)`

GetRelatedQuestionsOk returns a tuple with the RelatedQuestions field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRelatedQuestions

`func (o *BeginnerGuidance) SetRelatedQuestions(v []string)`

SetRelatedQuestions sets RelatedQuestions field to given value.

### HasRelatedQuestions

`func (o *BeginnerGuidance) HasRelatedQuestions() bool`

HasRelatedQuestions returns a boolean if a field has been set.

### GetConfidence

`func (o *BeginnerGuidance) GetConfidence() float32`

GetConfidence returns the Confidence field if non-nil, zero value otherwise.

### GetConfidenceOk

`func (o *BeginnerGuidance) GetConfidenceOk() (*float32, bool)`

GetConfidenceOk returns a tuple with the Confidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidence

`func (o *BeginnerGuidance) SetConfidence(v float32)`

SetConfidence sets Confidence field to given value.

### HasConfidence

`func (o *BeginnerGuidance) HasConfidence() bool`

HasConfidence returns a boolean if a field has been set.

### GetMetadata

`func (o *BeginnerGuidance) GetMetadata() BeginnerGuidanceMetadata`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *BeginnerGuidance) GetMetadataOk() (*BeginnerGuidanceMetadata, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *BeginnerGuidance) SetMetadata(v BeginnerGuidanceMetadata)`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *BeginnerGuidance) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


