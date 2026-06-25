# GetSoilDataRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | **string** | 5-digit FIPS code | 

## Methods

### NewGetSoilDataRequest

`func NewGetSoilDataRequest(countyFips string, ) *GetSoilDataRequest`

NewGetSoilDataRequest instantiates a new GetSoilDataRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetSoilDataRequestWithDefaults

`func NewGetSoilDataRequestWithDefaults() *GetSoilDataRequest`

NewGetSoilDataRequestWithDefaults instantiates a new GetSoilDataRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *GetSoilDataRequest) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *GetSoilDataRequest) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *GetSoilDataRequest) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


