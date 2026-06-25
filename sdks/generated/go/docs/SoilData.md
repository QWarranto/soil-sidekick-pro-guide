# SoilData

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | Pointer to **string** |  | [optional] 
**CountyFips** | Pointer to **string** |  | [optional] 
**CountyName** | Pointer to **string** |  | [optional] 
**StateCode** | Pointer to **string** |  | [optional] 
**PhLevel** | Pointer to **float32** |  | [optional] 
**OrganicMatter** | Pointer to **float32** |  | [optional] 
**NitrogenLevel** | Pointer to **string** |  | [optional] 
**PhosphorusLevel** | Pointer to **string** |  | [optional] 
**PotassiumLevel** | Pointer to **string** |  | [optional] 
**Recommendations** | Pointer to **string** |  | [optional] 
**AnalysisData** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewSoilData

`func NewSoilData() *SoilData`

NewSoilData instantiates a new SoilData object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSoilDataWithDefaults

`func NewSoilDataWithDefaults() *SoilData`

NewSoilDataWithDefaults instantiates a new SoilData object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *SoilData) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *SoilData) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *SoilData) SetId(v string)`

SetId sets Id field to given value.

### HasId

`func (o *SoilData) HasId() bool`

HasId returns a boolean if a field has been set.

### GetCountyFips

`func (o *SoilData) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *SoilData) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *SoilData) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.

### HasCountyFips

`func (o *SoilData) HasCountyFips() bool`

HasCountyFips returns a boolean if a field has been set.

### GetCountyName

`func (o *SoilData) GetCountyName() string`

GetCountyName returns the CountyName field if non-nil, zero value otherwise.

### GetCountyNameOk

`func (o *SoilData) GetCountyNameOk() (*string, bool)`

GetCountyNameOk returns a tuple with the CountyName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyName

`func (o *SoilData) SetCountyName(v string)`

SetCountyName sets CountyName field to given value.

### HasCountyName

`func (o *SoilData) HasCountyName() bool`

HasCountyName returns a boolean if a field has been set.

### GetStateCode

`func (o *SoilData) GetStateCode() string`

GetStateCode returns the StateCode field if non-nil, zero value otherwise.

### GetStateCodeOk

`func (o *SoilData) GetStateCodeOk() (*string, bool)`

GetStateCodeOk returns a tuple with the StateCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStateCode

`func (o *SoilData) SetStateCode(v string)`

SetStateCode sets StateCode field to given value.

### HasStateCode

`func (o *SoilData) HasStateCode() bool`

HasStateCode returns a boolean if a field has been set.

### GetPhLevel

`func (o *SoilData) GetPhLevel() float32`

GetPhLevel returns the PhLevel field if non-nil, zero value otherwise.

### GetPhLevelOk

`func (o *SoilData) GetPhLevelOk() (*float32, bool)`

GetPhLevelOk returns a tuple with the PhLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPhLevel

`func (o *SoilData) SetPhLevel(v float32)`

SetPhLevel sets PhLevel field to given value.

### HasPhLevel

`func (o *SoilData) HasPhLevel() bool`

HasPhLevel returns a boolean if a field has been set.

### GetOrganicMatter

`func (o *SoilData) GetOrganicMatter() float32`

GetOrganicMatter returns the OrganicMatter field if non-nil, zero value otherwise.

### GetOrganicMatterOk

`func (o *SoilData) GetOrganicMatterOk() (*float32, bool)`

GetOrganicMatterOk returns a tuple with the OrganicMatter field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganicMatter

`func (o *SoilData) SetOrganicMatter(v float32)`

SetOrganicMatter sets OrganicMatter field to given value.

### HasOrganicMatter

`func (o *SoilData) HasOrganicMatter() bool`

HasOrganicMatter returns a boolean if a field has been set.

### GetNitrogenLevel

`func (o *SoilData) GetNitrogenLevel() string`

GetNitrogenLevel returns the NitrogenLevel field if non-nil, zero value otherwise.

### GetNitrogenLevelOk

`func (o *SoilData) GetNitrogenLevelOk() (*string, bool)`

GetNitrogenLevelOk returns a tuple with the NitrogenLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNitrogenLevel

`func (o *SoilData) SetNitrogenLevel(v string)`

SetNitrogenLevel sets NitrogenLevel field to given value.

### HasNitrogenLevel

`func (o *SoilData) HasNitrogenLevel() bool`

HasNitrogenLevel returns a boolean if a field has been set.

### GetPhosphorusLevel

`func (o *SoilData) GetPhosphorusLevel() string`

GetPhosphorusLevel returns the PhosphorusLevel field if non-nil, zero value otherwise.

### GetPhosphorusLevelOk

`func (o *SoilData) GetPhosphorusLevelOk() (*string, bool)`

GetPhosphorusLevelOk returns a tuple with the PhosphorusLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPhosphorusLevel

`func (o *SoilData) SetPhosphorusLevel(v string)`

SetPhosphorusLevel sets PhosphorusLevel field to given value.

### HasPhosphorusLevel

`func (o *SoilData) HasPhosphorusLevel() bool`

HasPhosphorusLevel returns a boolean if a field has been set.

### GetPotassiumLevel

`func (o *SoilData) GetPotassiumLevel() string`

GetPotassiumLevel returns the PotassiumLevel field if non-nil, zero value otherwise.

### GetPotassiumLevelOk

`func (o *SoilData) GetPotassiumLevelOk() (*string, bool)`

GetPotassiumLevelOk returns a tuple with the PotassiumLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPotassiumLevel

`func (o *SoilData) SetPotassiumLevel(v string)`

SetPotassiumLevel sets PotassiumLevel field to given value.

### HasPotassiumLevel

`func (o *SoilData) HasPotassiumLevel() bool`

HasPotassiumLevel returns a boolean if a field has been set.

### GetRecommendations

`func (o *SoilData) GetRecommendations() string`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *SoilData) GetRecommendationsOk() (*string, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *SoilData) SetRecommendations(v string)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *SoilData) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.

### GetAnalysisData

`func (o *SoilData) GetAnalysisData() map[string]interface{}`

GetAnalysisData returns the AnalysisData field if non-nil, zero value otherwise.

### GetAnalysisDataOk

`func (o *SoilData) GetAnalysisDataOk() (*map[string]interface{}, bool)`

GetAnalysisDataOk returns a tuple with the AnalysisData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAnalysisData

`func (o *SoilData) SetAnalysisData(v map[string]interface{})`

SetAnalysisData sets AnalysisData field to given value.

### HasAnalysisData

`func (o *SoilData) HasAnalysisData() bool`

HasAnalysisData returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


