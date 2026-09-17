# LiveAgriculturalData

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | Pointer to **string** |  | [optional] 
**CountyName** | Pointer to **string** |  | [optional] 
**StateCode** | Pointer to **string** |  | [optional] 
**Data** | Pointer to [**LiveAgriculturalDataData**](LiveAgriculturalDataData.md) |  | [optional] 
**Sources** | Pointer to **[]string** |  | [optional] 
**Timestamp** | Pointer to **time.Time** |  | [optional] 
**CacheStatus** | Pointer to **string** |  | [optional] 

## Methods

### NewLiveAgriculturalData

`func NewLiveAgriculturalData() *LiveAgriculturalData`

NewLiveAgriculturalData instantiates a new LiveAgriculturalData object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewLiveAgriculturalDataWithDefaults

`func NewLiveAgriculturalDataWithDefaults() *LiveAgriculturalData`

NewLiveAgriculturalDataWithDefaults instantiates a new LiveAgriculturalData object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *LiveAgriculturalData) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *LiveAgriculturalData) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *LiveAgriculturalData) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.

### HasCountyFips

`func (o *LiveAgriculturalData) HasCountyFips() bool`

HasCountyFips returns a boolean if a field has been set.

### GetCountyName

`func (o *LiveAgriculturalData) GetCountyName() string`

GetCountyName returns the CountyName field if non-nil, zero value otherwise.

### GetCountyNameOk

`func (o *LiveAgriculturalData) GetCountyNameOk() (*string, bool)`

GetCountyNameOk returns a tuple with the CountyName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyName

`func (o *LiveAgriculturalData) SetCountyName(v string)`

SetCountyName sets CountyName field to given value.

### HasCountyName

`func (o *LiveAgriculturalData) HasCountyName() bool`

HasCountyName returns a boolean if a field has been set.

### GetStateCode

`func (o *LiveAgriculturalData) GetStateCode() string`

GetStateCode returns the StateCode field if non-nil, zero value otherwise.

### GetStateCodeOk

`func (o *LiveAgriculturalData) GetStateCodeOk() (*string, bool)`

GetStateCodeOk returns a tuple with the StateCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStateCode

`func (o *LiveAgriculturalData) SetStateCode(v string)`

SetStateCode sets StateCode field to given value.

### HasStateCode

`func (o *LiveAgriculturalData) HasStateCode() bool`

HasStateCode returns a boolean if a field has been set.

### GetData

`func (o *LiveAgriculturalData) GetData() LiveAgriculturalDataData`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *LiveAgriculturalData) GetDataOk() (*LiveAgriculturalDataData, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *LiveAgriculturalData) SetData(v LiveAgriculturalDataData)`

SetData sets Data field to given value.

### HasData

`func (o *LiveAgriculturalData) HasData() bool`

HasData returns a boolean if a field has been set.

### GetSources

`func (o *LiveAgriculturalData) GetSources() []string`

GetSources returns the Sources field if non-nil, zero value otherwise.

### GetSourcesOk

`func (o *LiveAgriculturalData) GetSourcesOk() (*[]string, bool)`

GetSourcesOk returns a tuple with the Sources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSources

`func (o *LiveAgriculturalData) SetSources(v []string)`

SetSources sets Sources field to given value.

### HasSources

`func (o *LiveAgriculturalData) HasSources() bool`

HasSources returns a boolean if a field has been set.

### GetTimestamp

`func (o *LiveAgriculturalData) GetTimestamp() time.Time`

GetTimestamp returns the Timestamp field if non-nil, zero value otherwise.

### GetTimestampOk

`func (o *LiveAgriculturalData) GetTimestampOk() (*time.Time, bool)`

GetTimestampOk returns a tuple with the Timestamp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTimestamp

`func (o *LiveAgriculturalData) SetTimestamp(v time.Time)`

SetTimestamp sets Timestamp field to given value.

### HasTimestamp

`func (o *LiveAgriculturalData) HasTimestamp() bool`

HasTimestamp returns a boolean if a field has been set.

### GetCacheStatus

`func (o *LiveAgriculturalData) GetCacheStatus() string`

GetCacheStatus returns the CacheStatus field if non-nil, zero value otherwise.

### GetCacheStatusOk

`func (o *LiveAgriculturalData) GetCacheStatusOk() (*string, bool)`

GetCacheStatusOk returns a tuple with the CacheStatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCacheStatus

`func (o *LiveAgriculturalData) SetCacheStatus(v string)`

SetCacheStatus sets CacheStatus field to given value.

### HasCacheStatus

`func (o *LiveAgriculturalData) HasCacheStatus() bool`

HasCacheStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


