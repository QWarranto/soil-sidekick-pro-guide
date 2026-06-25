# GetLiveAgriculturalDataRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | **string** |  | 
**DataTypes** | **[]string** | Types of data to fetch | 
**StateCode** | **string** |  | 
**CountyName** | **string** |  | 

## Methods

### NewGetLiveAgriculturalDataRequest

`func NewGetLiveAgriculturalDataRequest(countyFips string, dataTypes []string, stateCode string, countyName string, ) *GetLiveAgriculturalDataRequest`

NewGetLiveAgriculturalDataRequest instantiates a new GetLiveAgriculturalDataRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetLiveAgriculturalDataRequestWithDefaults

`func NewGetLiveAgriculturalDataRequestWithDefaults() *GetLiveAgriculturalDataRequest`

NewGetLiveAgriculturalDataRequestWithDefaults instantiates a new GetLiveAgriculturalDataRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *GetLiveAgriculturalDataRequest) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *GetLiveAgriculturalDataRequest) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *GetLiveAgriculturalDataRequest) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.


### GetDataTypes

`func (o *GetLiveAgriculturalDataRequest) GetDataTypes() []string`

GetDataTypes returns the DataTypes field if non-nil, zero value otherwise.

### GetDataTypesOk

`func (o *GetLiveAgriculturalDataRequest) GetDataTypesOk() (*[]string, bool)`

GetDataTypesOk returns a tuple with the DataTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataTypes

`func (o *GetLiveAgriculturalDataRequest) SetDataTypes(v []string)`

SetDataTypes sets DataTypes field to given value.


### GetStateCode

`func (o *GetLiveAgriculturalDataRequest) GetStateCode() string`

GetStateCode returns the StateCode field if non-nil, zero value otherwise.

### GetStateCodeOk

`func (o *GetLiveAgriculturalDataRequest) GetStateCodeOk() (*string, bool)`

GetStateCodeOk returns a tuple with the StateCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStateCode

`func (o *GetLiveAgriculturalDataRequest) SetStateCode(v string)`

SetStateCode sets StateCode field to given value.


### GetCountyName

`func (o *GetLiveAgriculturalDataRequest) GetCountyName() string`

GetCountyName returns the CountyName field if non-nil, zero value otherwise.

### GetCountyNameOk

`func (o *GetLiveAgriculturalDataRequest) GetCountyNameOk() (*string, bool)`

GetCountyNameOk returns a tuple with the CountyName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyName

`func (o *GetLiveAgriculturalDataRequest) SetCountyName(v string)`

SetCountyName sets CountyName field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


