# BeginnerGuidanceRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Question** | **string** | User&#39;s plant question in natural language | 
**PlantContext** | Pointer to [**BeginnerGuidanceRequestPlantContext**](BeginnerGuidanceRequestPlantContext.md) |  | [optional] 
**Location** | Pointer to [**BeginnerGuidanceRequestLocation**](BeginnerGuidanceRequestLocation.md) |  | [optional] 
**UserExpertise** | Pointer to **string** | User&#39;s self-assessed expertise level | [optional] [default to "complete_beginner"]

## Methods

### NewBeginnerGuidanceRequest

`func NewBeginnerGuidanceRequest(question string, ) *BeginnerGuidanceRequest`

NewBeginnerGuidanceRequest instantiates a new BeginnerGuidanceRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewBeginnerGuidanceRequestWithDefaults

`func NewBeginnerGuidanceRequestWithDefaults() *BeginnerGuidanceRequest`

NewBeginnerGuidanceRequestWithDefaults instantiates a new BeginnerGuidanceRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetQuestion

`func (o *BeginnerGuidanceRequest) GetQuestion() string`

GetQuestion returns the Question field if non-nil, zero value otherwise.

### GetQuestionOk

`func (o *BeginnerGuidanceRequest) GetQuestionOk() (*string, bool)`

GetQuestionOk returns a tuple with the Question field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetQuestion

`func (o *BeginnerGuidanceRequest) SetQuestion(v string)`

SetQuestion sets Question field to given value.


### GetPlantContext

`func (o *BeginnerGuidanceRequest) GetPlantContext() BeginnerGuidanceRequestPlantContext`

GetPlantContext returns the PlantContext field if non-nil, zero value otherwise.

### GetPlantContextOk

`func (o *BeginnerGuidanceRequest) GetPlantContextOk() (*BeginnerGuidanceRequestPlantContext, bool)`

GetPlantContextOk returns a tuple with the PlantContext field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlantContext

`func (o *BeginnerGuidanceRequest) SetPlantContext(v BeginnerGuidanceRequestPlantContext)`

SetPlantContext sets PlantContext field to given value.

### HasPlantContext

`func (o *BeginnerGuidanceRequest) HasPlantContext() bool`

HasPlantContext returns a boolean if a field has been set.

### GetLocation

`func (o *BeginnerGuidanceRequest) GetLocation() BeginnerGuidanceRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *BeginnerGuidanceRequest) GetLocationOk() (*BeginnerGuidanceRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *BeginnerGuidanceRequest) SetLocation(v BeginnerGuidanceRequestLocation)`

SetLocation sets Location field to given value.

### HasLocation

`func (o *BeginnerGuidanceRequest) HasLocation() bool`

HasLocation returns a boolean if a field has been set.

### GetUserExpertise

`func (o *BeginnerGuidanceRequest) GetUserExpertise() string`

GetUserExpertise returns the UserExpertise field if non-nil, zero value otherwise.

### GetUserExpertiseOk

`func (o *BeginnerGuidanceRequest) GetUserExpertiseOk() (*string, bool)`

GetUserExpertiseOk returns a tuple with the UserExpertise field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUserExpertise

`func (o *BeginnerGuidanceRequest) SetUserExpertise(v string)`

SetUserExpertise sets UserExpertise field to given value.

### HasUserExpertise

`func (o *BeginnerGuidanceRequest) HasUserExpertise() bool`

HasUserExpertise returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


