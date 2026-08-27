# CalculateEnvironmentalImpactRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**AnalysisId** | **string** |  | 
**CountyFips** | **string** |  | 
**SoilData** | [**CalculateEnvironmentalImpactRequestSoilData**](CalculateEnvironmentalImpactRequestSoilData.md) |  | 
**ProposedTreatments** | Pointer to [**[]CalculateEnvironmentalImpactRequestProposedTreatmentsInner**](CalculateEnvironmentalImpactRequestProposedTreatmentsInner.md) |  | [optional] 
**WaterBodyData** | Pointer to [**CalculateEnvironmentalImpactRequestWaterBodyData**](CalculateEnvironmentalImpactRequestWaterBodyData.md) |  | [optional] 

## Methods

### NewCalculateEnvironmentalImpactRequest

`func NewCalculateEnvironmentalImpactRequest(analysisId string, countyFips string, soilData CalculateEnvironmentalImpactRequestSoilData, ) *CalculateEnvironmentalImpactRequest`

NewCalculateEnvironmentalImpactRequest instantiates a new CalculateEnvironmentalImpactRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCalculateEnvironmentalImpactRequestWithDefaults

`func NewCalculateEnvironmentalImpactRequestWithDefaults() *CalculateEnvironmentalImpactRequest`

NewCalculateEnvironmentalImpactRequestWithDefaults instantiates a new CalculateEnvironmentalImpactRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAnalysisId

`func (o *CalculateEnvironmentalImpactRequest) GetAnalysisId() string`

GetAnalysisId returns the AnalysisId field if non-nil, zero value otherwise.

### GetAnalysisIdOk

`func (o *CalculateEnvironmentalImpactRequest) GetAnalysisIdOk() (*string, bool)`

GetAnalysisIdOk returns a tuple with the AnalysisId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAnalysisId

`func (o *CalculateEnvironmentalImpactRequest) SetAnalysisId(v string)`

SetAnalysisId sets AnalysisId field to given value.


### GetCountyFips

`func (o *CalculateEnvironmentalImpactRequest) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *CalculateEnvironmentalImpactRequest) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *CalculateEnvironmentalImpactRequest) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.


### GetSoilData

`func (o *CalculateEnvironmentalImpactRequest) GetSoilData() CalculateEnvironmentalImpactRequestSoilData`

GetSoilData returns the SoilData field if non-nil, zero value otherwise.

### GetSoilDataOk

`func (o *CalculateEnvironmentalImpactRequest) GetSoilDataOk() (*CalculateEnvironmentalImpactRequestSoilData, bool)`

GetSoilDataOk returns a tuple with the SoilData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilData

`func (o *CalculateEnvironmentalImpactRequest) SetSoilData(v CalculateEnvironmentalImpactRequestSoilData)`

SetSoilData sets SoilData field to given value.


### GetProposedTreatments

`func (o *CalculateEnvironmentalImpactRequest) GetProposedTreatments() []CalculateEnvironmentalImpactRequestProposedTreatmentsInner`

GetProposedTreatments returns the ProposedTreatments field if non-nil, zero value otherwise.

### GetProposedTreatmentsOk

`func (o *CalculateEnvironmentalImpactRequest) GetProposedTreatmentsOk() (*[]CalculateEnvironmentalImpactRequestProposedTreatmentsInner, bool)`

GetProposedTreatmentsOk returns a tuple with the ProposedTreatments field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProposedTreatments

`func (o *CalculateEnvironmentalImpactRequest) SetProposedTreatments(v []CalculateEnvironmentalImpactRequestProposedTreatmentsInner)`

SetProposedTreatments sets ProposedTreatments field to given value.

### HasProposedTreatments

`func (o *CalculateEnvironmentalImpactRequest) HasProposedTreatments() bool`

HasProposedTreatments returns a boolean if a field has been set.

### GetWaterBodyData

`func (o *CalculateEnvironmentalImpactRequest) GetWaterBodyData() CalculateEnvironmentalImpactRequestWaterBodyData`

GetWaterBodyData returns the WaterBodyData field if non-nil, zero value otherwise.

### GetWaterBodyDataOk

`func (o *CalculateEnvironmentalImpactRequest) GetWaterBodyDataOk() (*CalculateEnvironmentalImpactRequestWaterBodyData, bool)`

GetWaterBodyDataOk returns a tuple with the WaterBodyData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWaterBodyData

`func (o *CalculateEnvironmentalImpactRequest) SetWaterBodyData(v CalculateEnvironmentalImpactRequestWaterBodyData)`

SetWaterBodyData sets WaterBodyData field to given value.

### HasWaterBodyData

`func (o *CalculateEnvironmentalImpactRequest) HasWaterBodyData() bool`

HasWaterBodyData returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


