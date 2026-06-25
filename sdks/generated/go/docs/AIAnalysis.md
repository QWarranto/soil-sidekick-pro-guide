# AIAnalysis

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AnalysisType** | Pointer to **string** |  | [optional] 
**ConfidenceScore** | Pointer to **float32** |  | [optional] 
**Recommendations** | Pointer to [**[]AIAnalysisRecommendationsInner**](AIAnalysisRecommendationsInner.md) |  | [optional] 

## Methods

### NewAIAnalysis

`func NewAIAnalysis() *AIAnalysis`

NewAIAnalysis instantiates a new AIAnalysis object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAIAnalysisWithDefaults

`func NewAIAnalysisWithDefaults() *AIAnalysis`

NewAIAnalysisWithDefaults instantiates a new AIAnalysis object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAnalysisType

`func (o *AIAnalysis) GetAnalysisType() string`

GetAnalysisType returns the AnalysisType field if non-nil, zero value otherwise.

### GetAnalysisTypeOk

`func (o *AIAnalysis) GetAnalysisTypeOk() (*string, bool)`

GetAnalysisTypeOk returns a tuple with the AnalysisType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAnalysisType

`func (o *AIAnalysis) SetAnalysisType(v string)`

SetAnalysisType sets AnalysisType field to given value.

### HasAnalysisType

`func (o *AIAnalysis) HasAnalysisType() bool`

HasAnalysisType returns a boolean if a field has been set.

### GetConfidenceScore

`func (o *AIAnalysis) GetConfidenceScore() float32`

GetConfidenceScore returns the ConfidenceScore field if non-nil, zero value otherwise.

### GetConfidenceScoreOk

`func (o *AIAnalysis) GetConfidenceScoreOk() (*float32, bool)`

GetConfidenceScoreOk returns a tuple with the ConfidenceScore field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidenceScore

`func (o *AIAnalysis) SetConfidenceScore(v float32)`

SetConfidenceScore sets ConfidenceScore field to given value.

### HasConfidenceScore

`func (o *AIAnalysis) HasConfidenceScore() bool`

HasConfidenceScore returns a boolean if a field has been set.

### GetRecommendations

`func (o *AIAnalysis) GetRecommendations() []AIAnalysisRecommendationsInner`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *AIAnalysis) GetRecommendationsOk() (*[]AIAnalysisRecommendationsInner, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *AIAnalysis) SetRecommendations(v []AIAnalysisRecommendationsInner)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *AIAnalysis) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


