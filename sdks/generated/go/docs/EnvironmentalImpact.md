# EnvironmentalImpact

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ImpactAssessment** | Pointer to [**EnvironmentalImpactImpactAssessment**](EnvironmentalImpactImpactAssessment.md) |  | [optional] 
**DetailedAnalysis** | Pointer to [**EnvironmentalImpactDetailedAnalysis**](EnvironmentalImpactDetailedAnalysis.md) |  | [optional] 
**Recommendations** | Pointer to **[]string** |  | [optional] 

## Methods

### NewEnvironmentalImpact

`func NewEnvironmentalImpact() *EnvironmentalImpact`

NewEnvironmentalImpact instantiates a new EnvironmentalImpact object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEnvironmentalImpactWithDefaults

`func NewEnvironmentalImpactWithDefaults() *EnvironmentalImpact`

NewEnvironmentalImpactWithDefaults instantiates a new EnvironmentalImpact object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetImpactAssessment

`func (o *EnvironmentalImpact) GetImpactAssessment() EnvironmentalImpactImpactAssessment`

GetImpactAssessment returns the ImpactAssessment field if non-nil, zero value otherwise.

### GetImpactAssessmentOk

`func (o *EnvironmentalImpact) GetImpactAssessmentOk() (*EnvironmentalImpactImpactAssessment, bool)`

GetImpactAssessmentOk returns a tuple with the ImpactAssessment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImpactAssessment

`func (o *EnvironmentalImpact) SetImpactAssessment(v EnvironmentalImpactImpactAssessment)`

SetImpactAssessment sets ImpactAssessment field to given value.

### HasImpactAssessment

`func (o *EnvironmentalImpact) HasImpactAssessment() bool`

HasImpactAssessment returns a boolean if a field has been set.

### GetDetailedAnalysis

`func (o *EnvironmentalImpact) GetDetailedAnalysis() EnvironmentalImpactDetailedAnalysis`

GetDetailedAnalysis returns the DetailedAnalysis field if non-nil, zero value otherwise.

### GetDetailedAnalysisOk

`func (o *EnvironmentalImpact) GetDetailedAnalysisOk() (*EnvironmentalImpactDetailedAnalysis, bool)`

GetDetailedAnalysisOk returns a tuple with the DetailedAnalysis field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetailedAnalysis

`func (o *EnvironmentalImpact) SetDetailedAnalysis(v EnvironmentalImpactDetailedAnalysis)`

SetDetailedAnalysis sets DetailedAnalysis field to given value.

### HasDetailedAnalysis

`func (o *EnvironmentalImpact) HasDetailedAnalysis() bool`

HasDetailedAnalysis returns a boolean if a field has been set.

### GetRecommendations

`func (o *EnvironmentalImpact) GetRecommendations() []string`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *EnvironmentalImpact) GetRecommendationsOk() (*[]string, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *EnvironmentalImpact) SetRecommendations(v []string)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *EnvironmentalImpact) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


