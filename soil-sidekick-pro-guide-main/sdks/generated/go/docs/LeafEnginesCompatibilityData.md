# LeafEnginesCompatibilityData

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**OverallScore** | Pointer to **float32** | Overall compatibility score (0-100) | [optional] 
**SoilCompatibility** | Pointer to **float32** |  | [optional] 
**WaterCompatibility** | Pointer to **float32** |  | [optional] 
**ClimateCompatibility** | Pointer to **float32** |  | [optional] 
**Breakdown** | Pointer to [**LeafEnginesCompatibilityDataBreakdown**](LeafEnginesCompatibilityDataBreakdown.md) |  | [optional] 
**Recommendations** | Pointer to **[]string** |  | [optional] 
**RiskLevel** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to [**LeafEnginesCompatibilityDataMetadata**](LeafEnginesCompatibilityDataMetadata.md) |  | [optional] 

## Methods

### NewLeafEnginesCompatibilityData

`func NewLeafEnginesCompatibilityData() *LeafEnginesCompatibilityData`

NewLeafEnginesCompatibilityData instantiates a new LeafEnginesCompatibilityData object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewLeafEnginesCompatibilityDataWithDefaults

`func NewLeafEnginesCompatibilityDataWithDefaults() *LeafEnginesCompatibilityData`

NewLeafEnginesCompatibilityDataWithDefaults instantiates a new LeafEnginesCompatibilityData object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetOverallScore

`func (o *LeafEnginesCompatibilityData) GetOverallScore() float32`

GetOverallScore returns the OverallScore field if non-nil, zero value otherwise.

### GetOverallScoreOk

`func (o *LeafEnginesCompatibilityData) GetOverallScoreOk() (*float32, bool)`

GetOverallScoreOk returns a tuple with the OverallScore field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOverallScore

`func (o *LeafEnginesCompatibilityData) SetOverallScore(v float32)`

SetOverallScore sets OverallScore field to given value.

### HasOverallScore

`func (o *LeafEnginesCompatibilityData) HasOverallScore() bool`

HasOverallScore returns a boolean if a field has been set.

### GetSoilCompatibility

`func (o *LeafEnginesCompatibilityData) GetSoilCompatibility() float32`

GetSoilCompatibility returns the SoilCompatibility field if non-nil, zero value otherwise.

### GetSoilCompatibilityOk

`func (o *LeafEnginesCompatibilityData) GetSoilCompatibilityOk() (*float32, bool)`

GetSoilCompatibilityOk returns a tuple with the SoilCompatibility field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilCompatibility

`func (o *LeafEnginesCompatibilityData) SetSoilCompatibility(v float32)`

SetSoilCompatibility sets SoilCompatibility field to given value.

### HasSoilCompatibility

`func (o *LeafEnginesCompatibilityData) HasSoilCompatibility() bool`

HasSoilCompatibility returns a boolean if a field has been set.

### GetWaterCompatibility

`func (o *LeafEnginesCompatibilityData) GetWaterCompatibility() float32`

GetWaterCompatibility returns the WaterCompatibility field if non-nil, zero value otherwise.

### GetWaterCompatibilityOk

`func (o *LeafEnginesCompatibilityData) GetWaterCompatibilityOk() (*float32, bool)`

GetWaterCompatibilityOk returns a tuple with the WaterCompatibility field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWaterCompatibility

`func (o *LeafEnginesCompatibilityData) SetWaterCompatibility(v float32)`

SetWaterCompatibility sets WaterCompatibility field to given value.

### HasWaterCompatibility

`func (o *LeafEnginesCompatibilityData) HasWaterCompatibility() bool`

HasWaterCompatibility returns a boolean if a field has been set.

### GetClimateCompatibility

`func (o *LeafEnginesCompatibilityData) GetClimateCompatibility() float32`

GetClimateCompatibility returns the ClimateCompatibility field if non-nil, zero value otherwise.

### GetClimateCompatibilityOk

`func (o *LeafEnginesCompatibilityData) GetClimateCompatibilityOk() (*float32, bool)`

GetClimateCompatibilityOk returns a tuple with the ClimateCompatibility field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClimateCompatibility

`func (o *LeafEnginesCompatibilityData) SetClimateCompatibility(v float32)`

SetClimateCompatibility sets ClimateCompatibility field to given value.

### HasClimateCompatibility

`func (o *LeafEnginesCompatibilityData) HasClimateCompatibility() bool`

HasClimateCompatibility returns a boolean if a field has been set.

### GetBreakdown

`func (o *LeafEnginesCompatibilityData) GetBreakdown() LeafEnginesCompatibilityDataBreakdown`

GetBreakdown returns the Breakdown field if non-nil, zero value otherwise.

### GetBreakdownOk

`func (o *LeafEnginesCompatibilityData) GetBreakdownOk() (*LeafEnginesCompatibilityDataBreakdown, bool)`

GetBreakdownOk returns a tuple with the Breakdown field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBreakdown

`func (o *LeafEnginesCompatibilityData) SetBreakdown(v LeafEnginesCompatibilityDataBreakdown)`

SetBreakdown sets Breakdown field to given value.

### HasBreakdown

`func (o *LeafEnginesCompatibilityData) HasBreakdown() bool`

HasBreakdown returns a boolean if a field has been set.

### GetRecommendations

`func (o *LeafEnginesCompatibilityData) GetRecommendations() []string`

GetRecommendations returns the Recommendations field if non-nil, zero value otherwise.

### GetRecommendationsOk

`func (o *LeafEnginesCompatibilityData) GetRecommendationsOk() (*[]string, bool)`

GetRecommendationsOk returns a tuple with the Recommendations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecommendations

`func (o *LeafEnginesCompatibilityData) SetRecommendations(v []string)`

SetRecommendations sets Recommendations field to given value.

### HasRecommendations

`func (o *LeafEnginesCompatibilityData) HasRecommendations() bool`

HasRecommendations returns a boolean if a field has been set.

### GetRiskLevel

`func (o *LeafEnginesCompatibilityData) GetRiskLevel() string`

GetRiskLevel returns the RiskLevel field if non-nil, zero value otherwise.

### GetRiskLevelOk

`func (o *LeafEnginesCompatibilityData) GetRiskLevelOk() (*string, bool)`

GetRiskLevelOk returns a tuple with the RiskLevel field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRiskLevel

`func (o *LeafEnginesCompatibilityData) SetRiskLevel(v string)`

SetRiskLevel sets RiskLevel field to given value.

### HasRiskLevel

`func (o *LeafEnginesCompatibilityData) HasRiskLevel() bool`

HasRiskLevel returns a boolean if a field has been set.

### GetMetadata

`func (o *LeafEnginesCompatibilityData) GetMetadata() LeafEnginesCompatibilityDataMetadata`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *LeafEnginesCompatibilityData) GetMetadataOk() (*LeafEnginesCompatibilityDataMetadata, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *LeafEnginesCompatibilityData) SetMetadata(v LeafEnginesCompatibilityDataMetadata)`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *LeafEnginesCompatibilityData) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


