# CountyLookupRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Term** | **string** | Search term (county name, state, or FIPS) | 

## Methods

### NewCountyLookupRequest

`func NewCountyLookupRequest(term string, ) *CountyLookupRequest`

NewCountyLookupRequest instantiates a new CountyLookupRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCountyLookupRequestWithDefaults

`func NewCountyLookupRequestWithDefaults() *CountyLookupRequest`

NewCountyLookupRequestWithDefaults instantiates a new CountyLookupRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTerm

`func (o *CountyLookupRequest) GetTerm() string`

GetTerm returns the Term field if non-nil, zero value otherwise.

### GetTermOk

`func (o *CountyLookupRequest) GetTermOk() (*string, bool)`

GetTermOk returns a tuple with the Term field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTerm

`func (o *CountyLookupRequest) SetTerm(v string)`

SetTerm sets Term field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


