# DynamicCareMetadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**LocationDataUsed** | Pointer to **bool** |  | [optional] 
**WeatherDataFreshness** | Pointer to **string** |  | [optional] 
**Confidence** | Pointer to **float32** |  | [optional] 

## Methods

### NewDynamicCareMetadata

`func NewDynamicCareMetadata() *DynamicCareMetadata`

NewDynamicCareMetadata instantiates a new DynamicCareMetadata object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDynamicCareMetadataWithDefaults

`func NewDynamicCareMetadataWithDefaults() *DynamicCareMetadata`

NewDynamicCareMetadataWithDefaults instantiates a new DynamicCareMetadata object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetLocationDataUsed

`func (o *DynamicCareMetadata) GetLocationDataUsed() bool`

GetLocationDataUsed returns the LocationDataUsed field if non-nil, zero value otherwise.

### GetLocationDataUsedOk

`func (o *DynamicCareMetadata) GetLocationDataUsedOk() (*bool, bool)`

GetLocationDataUsedOk returns a tuple with the LocationDataUsed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocationDataUsed

`func (o *DynamicCareMetadata) SetLocationDataUsed(v bool)`

SetLocationDataUsed sets LocationDataUsed field to given value.

### HasLocationDataUsed

`func (o *DynamicCareMetadata) HasLocationDataUsed() bool`

HasLocationDataUsed returns a boolean if a field has been set.

### GetWeatherDataFreshness

`func (o *DynamicCareMetadata) GetWeatherDataFreshness() string`

GetWeatherDataFreshness returns the WeatherDataFreshness field if non-nil, zero value otherwise.

### GetWeatherDataFreshnessOk

`func (o *DynamicCareMetadata) GetWeatherDataFreshnessOk() (*string, bool)`

GetWeatherDataFreshnessOk returns a tuple with the WeatherDataFreshness field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWeatherDataFreshness

`func (o *DynamicCareMetadata) SetWeatherDataFreshness(v string)`

SetWeatherDataFreshness sets WeatherDataFreshness field to given value.

### HasWeatherDataFreshness

`func (o *DynamicCareMetadata) HasWeatherDataFreshness() bool`

HasWeatherDataFreshness returns a boolean if a field has been set.

### GetConfidence

`func (o *DynamicCareMetadata) GetConfidence() float32`

GetConfidence returns the Confidence field if non-nil, zero value otherwise.

### GetConfidenceOk

`func (o *DynamicCareMetadata) GetConfidenceOk() (*float32, bool)`

GetConfidenceOk returns a tuple with the Confidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidence

`func (o *DynamicCareMetadata) SetConfidence(v float32)`

SetConfidence sets Confidence field to given value.

### HasConfidence

`func (o *DynamicCareMetadata) HasConfidence() bool`

HasConfidence returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


