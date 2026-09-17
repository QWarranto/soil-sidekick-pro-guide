# SatelliteData

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Ndvi** | Pointer to **float32** | Normalized Difference Vegetation Index | [optional] 
**Evi** | Pointer to **float32** | Enhanced Vegetation Index | [optional] 
**SoilMoisture** | Pointer to **float32** |  | [optional] 
**Temperature** | Pointer to **float32** |  | [optional] 
**CloudCover** | Pointer to **float32** |  | [optional] 

## Methods

### NewSatelliteData

`func NewSatelliteData() *SatelliteData`

NewSatelliteData instantiates a new SatelliteData object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSatelliteDataWithDefaults

`func NewSatelliteDataWithDefaults() *SatelliteData`

NewSatelliteDataWithDefaults instantiates a new SatelliteData object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNdvi

`func (o *SatelliteData) GetNdvi() float32`

GetNdvi returns the Ndvi field if non-nil, zero value otherwise.

### GetNdviOk

`func (o *SatelliteData) GetNdviOk() (*float32, bool)`

GetNdviOk returns a tuple with the Ndvi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNdvi

`func (o *SatelliteData) SetNdvi(v float32)`

SetNdvi sets Ndvi field to given value.

### HasNdvi

`func (o *SatelliteData) HasNdvi() bool`

HasNdvi returns a boolean if a field has been set.

### GetEvi

`func (o *SatelliteData) GetEvi() float32`

GetEvi returns the Evi field if non-nil, zero value otherwise.

### GetEviOk

`func (o *SatelliteData) GetEviOk() (*float32, bool)`

GetEviOk returns a tuple with the Evi field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvi

`func (o *SatelliteData) SetEvi(v float32)`

SetEvi sets Evi field to given value.

### HasEvi

`func (o *SatelliteData) HasEvi() bool`

HasEvi returns a boolean if a field has been set.

### GetSoilMoisture

`func (o *SatelliteData) GetSoilMoisture() float32`

GetSoilMoisture returns the SoilMoisture field if non-nil, zero value otherwise.

### GetSoilMoistureOk

`func (o *SatelliteData) GetSoilMoistureOk() (*float32, bool)`

GetSoilMoistureOk returns a tuple with the SoilMoisture field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilMoisture

`func (o *SatelliteData) SetSoilMoisture(v float32)`

SetSoilMoisture sets SoilMoisture field to given value.

### HasSoilMoisture

`func (o *SatelliteData) HasSoilMoisture() bool`

HasSoilMoisture returns a boolean if a field has been set.

### GetTemperature

`func (o *SatelliteData) GetTemperature() float32`

GetTemperature returns the Temperature field if non-nil, zero value otherwise.

### GetTemperatureOk

`func (o *SatelliteData) GetTemperatureOk() (*float32, bool)`

GetTemperatureOk returns a tuple with the Temperature field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTemperature

`func (o *SatelliteData) SetTemperature(v float32)`

SetTemperature sets Temperature field to given value.

### HasTemperature

`func (o *SatelliteData) HasTemperature() bool`

HasTemperature returns a boolean if a field has been set.

### GetCloudCover

`func (o *SatelliteData) GetCloudCover() float32`

GetCloudCover returns the CloudCover field if non-nil, zero value otherwise.

### GetCloudCoverOk

`func (o *SatelliteData) GetCloudCoverOk() (*float32, bool)`

GetCloudCoverOk returns a tuple with the CloudCover field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCloudCover

`func (o *SatelliteData) SetCloudCover(v float32)`

SetCloudCover sets CloudCover field to given value.

### HasCloudCover

`func (o *SatelliteData) HasCloudCover() bool`

HasCloudCover returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


